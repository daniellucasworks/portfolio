/* =====================================================================
   admin.js  -  dein privater Admin-Bereich (admin.html)

   Was er macht:
   - Du meldest dich mit einem GitHub-Token an (siehe ADMIN-ANLEITUNG.md).
   - Er liest data/content.js aus deinem Repository (Werke, Leistungen).
   - Du änderst Werke und Leistungen in Formularen. Du schreibst nur Deutsch,
     Englisch und Französisch kann er automatisch übersetzen (MyMemory) oder du
     füllst sie in den Tabs selbst aus.
   - "Veröffentlichen" schreibt alles in EINEM Commit nach GitHub. Danach
     baut GitHub Pages die Seite neu (1 bis 2 Minuten).
   Neue Bilder werden im Browser in WebP (max. 1600 px) umgewandelt und richtig benannt.
   ===================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var TR = window.TRANSLATIONS || { de: {} };
  var GH = SITE.github || { owner: '', repo: '', branch: '' };
  var API = 'https://api.github.com';
  var MAX_SIDE = 1600;                       // längste Bildseite in Pixel
  var KNOWN_SOCIAL = ['instagram', 'behance', 'deviantart', 'artstation', 'etsy', 'kofi', 'patreon',
                      'tiktok', 'youtube', 'pinterest', 'threads', 'facebook', 'x', 'linkedin', 'discord'];
  var SOCIAL_NAMES = { instagram: 'Instagram', behance: 'Behance', deviantart: 'DeviantArt', artstation: 'ArtStation',
    etsy: 'Etsy', kofi: 'Ko-fi', patreon: 'Patreon', tiktok: 'TikTok', youtube: 'YouTube', pinterest: 'Pinterest',
    threads: 'Threads', facebook: 'Facebook', x: 'X', linkedin: 'LinkedIn', discord: 'Discord' };
  var LANG_NAMES = { de: 'Deutsch', en: 'English', fr: 'Français' };

  var st = {
    token: '', branch: '', content: null, orig: null, contentSha: '',
    existing: {},        // Dateien, die schon im Repo liegen: { 'images/portfolio/x.webp': true }
    newFiles: {},        // neue/ersetzte Dateien: { pfad: Blob }
    delFiles: {},        // zu löschende Dateien: { pfad: true }
    urls: {},            // Vorschau-Adressen neuer Dateien
    tab: 'portfolio', filter: 'all', dirty: false
  };

  /* ------------------------------ kleine Helfer ------------------------------ */
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toast(msg, kind) {
    var t = el('div', { class: 'toast ' + (kind || ''), text: msg });
    $('toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, kind === 'err' ? 9000 : 4500);
  }
  function isHttp(u) { return /^https?:\/\/\S+$/i.test(u || ''); }
  function emptyL() { return { de: '', fr: '', en: '' }; }
  function lget(o, l) { return (o && o[l]) || ''; }
  function catName(id) {
    var own = (st.content.categories || []).filter(function (c) { return c.id === id; })[0];
    if (own) return own.label.de || id;
    return TR.de['cat.' + id] || id.charAt(0).toUpperCase() + id.slice(1);
  }
  function allCats() {
    var ids = (SITE.categories || []).slice();
    (st.content.categories || []).forEach(function (c) { if (ids.indexOf(c.id) === -1) ids.push(c.id); });
    return ids;
  }
  function setDirty(v) {
    st.dirty = v;
    $('publish').hidden = !v;
    var n = Object.keys(st.newFiles).length, d = Object.keys(st.delFiles).length;
    $('publish-info').textContent = 'Ungespeicherte Änderungen' + (n || d ? ' (' + n + ' Bild(er) neu, ' + d + ' gelöscht)' : '');
  }
  window.addEventListener('beforeunload', function (e) { if (st.dirty) { e.preventDefault(); e.returnValue = ''; } });

  /* ------------------------------ GitHub-Zugriff ------------------------------ */
  async function gh(path, opts) {
    opts = opts || {};
    var res = await fetch(API + path, {
      method: opts.method || 'GET',
      headers: {
        'Authorization': 'Bearer ' + st.token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    if (!res.ok) {
      var msg = '';
      try { msg = (await res.json()).message || ''; } catch (e) {}
      var err = new Error('GitHub ' + res.status + (msg ? ': ' + msg : ''));
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }
  function repoPath(rest) { return '/repos/' + GH.owner + '/' + GH.repo + rest; }
  function b64ToText(b64) {
    var bin = atob(b64.replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function textToB64(text) {
    var bytes = new TextEncoder().encode(text), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function blobToB64(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(',')[1]); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }
  function parseContent(text) {
    var a = text.indexOf('{'), b = text.lastIndexOf('}');
    if (a < 0 || b < 0) throw new Error('data/content.js hat ein unerwartetes Format.');
    return JSON.parse(text.slice(a, b + 1));
  }
  function serializeContent(obj) {
    return '/* data/content.js - wird vom Admin (admin.html) geschrieben. Nicht von Hand bearbeiten, ausser du weisst, was du tust. */\n' +
           'window.CONTENT = ' + JSON.stringify(obj, null, 2) + ';\n';
  }
  function registerExisting(content) {
    st.existing = {};
    (content.works || []).forEach(function (w) {
      st.existing['images/portfolio/' + w.file] = true;
      (w.images || []).forEach(function (f) { st.existing['images/portfolio/' + f] = true; });
    });
  }

  /* ------------------------------ Anmeldung ------------------------------ */
  async function login(token, remember) {
    st.token = token.trim();
    var repo = await gh(repoPath(''));
    if (repo.permissions && repo.permissions.push === false) {
      throw new Error('Dieser Token darf nicht ins Repository schreiben (Contents: Read and write fehlt).');
    }
    st.branch = GH.branch || repo.default_branch || 'main';
    var who = '';
    try { who = (await gh('/user')).login; } catch (e) { who = GH.owner; }
    var f = await gh(repoPath('/contents/data/content.js?ref=' + encodeURIComponent(st.branch)));
    st.contentSha = f.sha;
    st.content = parseContent(b64ToText(f.content));
    st.content.categories = st.content.categories || [];
    st.content.works = st.content.works || [];
    st.content.services = st.content.services || [];
    st.orig = clone(st.content);
    registerExisting(st.content);
    try {
      localStorage.removeItem('dlw-admin-token'); sessionStorage.removeItem('dlw-admin-token');
      (remember ? localStorage : sessionStorage).setItem('dlw-admin-token', st.token);
    } catch (e) {}
    $('who').textContent = who + ' · ' + GH.owner + '/' + GH.repo;
    $('login').hidden = true; $('app').hidden = false;
    render();
  }
  function logout() {
    try { localStorage.removeItem('dlw-admin-token'); sessionStorage.removeItem('dlw-admin-token'); } catch (e) {}
    location.reload();
  }

  /* ------------------------------ Übersetzung ------------------------------ */
  function decodeEntities(s) { var t = document.createElement('textarea'); t.innerHTML = s; return t.value; }
  async function mm(q, to) {
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(q) + '&langpair=de|' + to +
              (SITE.translateEmail ? '&de=' + encodeURIComponent(SITE.translateEmail) : '');
    var res = await fetch(url);
    if (!res.ok) throw new Error('Übersetzungsdienst nicht erreichbar (' + res.status + ')');
    var j = await res.json();
    if (Number(j.responseStatus) !== 200) throw new Error(j.responseDetails || 'Übersetzung nicht möglich (Tageslimit erreicht?)');
    return decodeEntities(j.responseData.translatedText || '');
  }
  // lange Zeilen in Sätze zerlegen (Dienst erlaubt ca. 500 Zeichen pro Anfrage)
  async function trLine(line, to) {
    if (!line.trim()) return line;
    var lead = line.match(/^\s*/)[0], trail = line.match(/\s*$/)[0], core = line.trim();
    var chunks = core.length <= 450 ? [core] : (core.match(/[^.!?]+[.!?]*\s*/g) || [core]);
    var packed = [], cur = '';
    chunks.forEach(function (c) { if ((cur + c).length > 450 && cur) { packed.push(cur); cur = c; } else cur += c; });
    if (cur) packed.push(cur);
    var out = [];
    for (var i = 0; i < packed.length; i++) out.push((await mm(packed[i].trim(), to)));
    return lead + out.join(' ') + trail;
  }
  async function translateText(text, to) {
    if (!text || !text.trim()) return '';
    // Links [Text](https://...) bleiben erhalten, nur der Text darin wird übersetzt
    var parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\))/);
    var out = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], m = p.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (m) { out += '[' + (await mm(m[1], to)) + '](' + m[2] + ')'; continue; }
      var lines = p.split('\n');
      for (var j = 0; j < lines.length; j++) lines[j] = await trLine(lines[j], to);
      out += lines.join('\n');
    }
    return out;
  }

  /* ------------------------------ Bild umwandeln ------------------------------ */
  async function processImage(file) {
    var bmp;
    try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) { bmp = await createImageBitmap(file); }
    var scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    var w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(bmp, 0, 0, w, h);
    var q = 0.82, blob;
    for (var i = 0; i < 5; i++) {
      blob = await new Promise(function (r) { cv.toBlob(r, 'image/webp', q); });
      if (!blob) throw new Error('Dieser Browser kann kein WebP erzeugen.');
      if (blob.size <= 450 * 1024) break;
      q -= 0.08;
    }
    return blob;
  }

  /* ------------------------------ Feld mit Sprach-Tabs ------------------------------
     Zeigt Deutsch gross und darunter Tabs für English und Français.
     get(l) / set(l, text, auto) lesen und setzen die Werte. */
  function langField(label, value, opt) {
    opt = opt || {};
    value = value || emptyL();
    var inputs = {}, auto = {}, active = 'en';
    var root = el('div', { class: 'a-field' });
    root.appendChild(el('label', { text: label }));
    function mk(l) {
      var i = el(opt.multiline ? 'textarea' : 'input', opt.multiline ? {} : { type: 'text' });
      i.value = value[l] || '';
      i.placeholder = LANG_NAMES[l];
      i.addEventListener('input', function () { auto[l] = false; note(); });
      inputs[l] = i; return i;
    }
    root.appendChild(mk('de'));
    var tabs = el('div', { class: 'a-ltabs', role: 'tablist' });
    var noteEl = el('p', { class: 'a-auto' });
    ['en', 'fr'].forEach(function (l) {
      var b = el('button', { type: 'button', role: 'tab', text: LANG_NAMES[l], 'aria-selected': l === active ? 'true' : 'false',
        onclick: function () { active = l; show(); } });
      b.dataset.l = l; tabs.appendChild(b);
    });
    root.appendChild(tabs);
    root.appendChild(mk('en')); root.appendChild(mk('fr'));
    root.appendChild(noteEl);
    if (opt.hint) root.appendChild(el('p', { class: 'a-hint', text: opt.hint }));
    function show() {
      ['en', 'fr'].forEach(function (l) { inputs[l].hidden = l !== active; });
      tabs.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.l === active)); });
      note();
    }
    function note() { noteEl.textContent = auto[active] ? 'Automatisch übersetzt – bitte kurz prüfen.' : ''; }
    show();
    return {
      root: root,
      get: function (l) { return inputs[l].value.trim(); },
      getAll: function () { return { de: inputs.de.value.trim(), fr: inputs.fr.value.trim(), en: inputs.en.value.trim() }; },
      set: function (l, text, isAuto) { inputs[l].value = text; auto[l] = !!isAuto; note(); },
      isAuto: function (l) { return !!auto[l]; }
    };
  }

  // Alle Sprachfelder eines Formulars aus dem Deutschen übersetzen
  async function translateFields(fields, overwrite, btn) {
    var jobs = 0, fail = '';
    btn.disabled = true;
    var old = btn.textContent; btn.textContent = 'Übersetze …';
    try {
      for (var f = 0; f < fields.length; f++) {
        var fld = fields[f], de = fld.get('de');
        if (!de) continue;
        for (var k = 0; k < 2; k++) {
          var l = ['en', 'fr'][k];
          var has = !!fld.get(l);
          if (has && !fld.isAuto(l) && !overwrite) continue;
          try { fld.set(l, await translateText(de, l), true); jobs++; }
          catch (e) { fail = e.message; }
        }
      }
    } finally { btn.disabled = false; btn.textContent = old; }
    if (fail) toast('Übersetzen hat nicht überall geklappt: ' + fail + ' Du kannst EN/FR in den Tabs selbst eintragen.', 'err');
    else if (jobs) toast('Übersetzt. Bitte EN und FR kurz prüfen (Tabs).', 'ok');
    else toast('Nichts zu übersetzen (alles schon ausgefüllt). Mit „überschreiben“ wird neu übersetzt.');
  }

  function translateBar(fields) {
    var over = el('input', { type: 'checkbox', id: 'ow' });
    var btn = el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Aus Deutsch übersetzen (EN + FR)',
      onclick: function () { translateFields(fields, over.checked, btn); } });
    return el('div', { class: 'a-section' }, [
      el('h3', { text: 'Übersetzung' }),
      el('p', { class: 'a-hint', text: 'Schreib nur Deutsch. EN und FR füllt der Knopf vor (kostenloser Dienst, nicht perfekt). Du kannst alles in den Tabs ändern.' }),
      el('div', { class: 'a-toolbar' }, [btn, el('label', { class: 'check', for: 'ow' }, [over, 'vorhandene Übersetzungen überschreiben'])])
    ]);
  }

  /* ------------------------------ Seite zeichnen ------------------------------ */
  function render() {
    document.querySelectorAll('.a-tabs button').forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === st.tab)); });
    var p = $('panel'); p.textContent = '';
    if (st.tab === 'portfolio') renderPortfolio(p); else renderServices(p);
  }

  function thumbUrl(path) { return st.urls[path] || path; }

  function renderPortfolio(p) {
    p.appendChild(el('h2', { text: 'Portfolio' }));
    var sel = el('select', { 'aria-label': 'Kategorie filtern', onchange: function () { st.filter = sel.value; render(); } });
    sel.appendChild(el('option', { value: 'all', text: 'Alle Kategorien' }));
    allCats().forEach(function (c) { sel.appendChild(el('option', { value: c, text: catName(c) })); });
    sel.value = st.filter;
    p.appendChild(el('div', { class: 'a-toolbar' }, [
      el('button', { type: 'button', class: 'btn btn-primary', text: '+ Neues Werk', onclick: function () { openWorkEditor(-1); } }), sel,
      el('span', { class: 'a-note', text: st.content.works.length + ' Werke · Reihenfolge = Reihenfolge auf der Seite' })
    ]));
    var grid = el('div', { class: 'a-grid' });
    st.content.works.forEach(function (w, idx) {
      if (st.filter !== 'all' && w.cat !== st.filter) return;
      var title = lget(w.title, 'de') || '(ohne Titel)';
      grid.appendChild(el('div', { class: 'a-card' }, [
        el('img', { src: thumbUrl('images/portfolio/' + w.file), alt: '', loading: 'lazy' }),
        el('h3', { text: title }),
        el('p', { class: 'a-meta' }, [el('span', { class: 'a-badge', text: catName(w.cat) }), ' ' + w.file + ((w.images || []).length ? ' +' + w.images.length : '')]),
        el('div', { class: 'a-row' }, [
          el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Bearbeiten', onclick: function () { openWorkEditor(idx); } }),
          el('button', { type: 'button', class: 'btn btn-outline btn-small', 'aria-label': 'nach vorne', text: '↑', onclick: function () { move(st.content.works, idx, -1); } }),
          el('button', { type: 'button', class: 'btn btn-outline btn-small', 'aria-label': 'nach hinten', text: '↓', onclick: function () { move(st.content.works, idx, 1); } })
        ])
      ]));
    });
    p.appendChild(grid);
  }

  function move(arr, idx, d) {
    var j = idx + d; if (j < 0 || j >= arr.length) return;
    var t = arr[idx]; arr[idx] = arr[j]; arr[j] = t;
    setDirty(true); render();
  }

  function renderServices(p) {
    p.appendChild(el('h2', { text: 'Leistungen' }));
    p.appendChild(el('div', { class: 'a-toolbar' }, [
      el('button', { type: 'button', class: 'btn btn-primary', text: '+ Neue Leistung', onclick: function () { openServiceEditor(-1); } })
    ]));
    var list = el('div', { class: 'a-list' });
    st.content.services.forEach(function (s, idx) {
      list.appendChild(el('div', { class: 'a-card' }, [
        el('div', {}, [
          el('h3', { text: lget(s.title, 'de') || '(ohne Titel)' }),
          el('p', { class: 'a-meta', text: lget(s.price, 'de') || 'kein Preis' + (s.inquiry === false ? ' · ohne Anfrage-Knopf' : '') })
        ]),
        el('div', { class: 'a-row' }, [
          el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Bearbeiten', onclick: function () { openServiceEditor(idx); } }),
          el('button', { type: 'button', class: 'btn btn-outline btn-small', 'aria-label': 'nach oben', text: '↑', onclick: function () { move(st.content.services, idx, -1); } }),
          el('button', { type: 'button', class: 'btn btn-outline btn-small', 'aria-label': 'nach unten', text: '↓', onclick: function () { move(st.content.services, idx, 1); } })
        ])
      ]));
    });
    p.appendChild(list);
  }

  /* ------------------------------ Editor: Werk ------------------------------ */
  function openEditor(build) {
    var d = $('editor'); d.textContent = '';
    build(d);
    if (!d.open) d.showModal();
  }
  function closeEditor() { var d = $('editor'); if (d.open) d.close(); }

  function openWorkEditor(idx) {
    var isNew = idx < 0;
    var orig = isNew ? null : st.content.works[idx];
    // Bilder: [{file, blob, url}], Index 0 = Titelbild
    var imgs = [];
    if (orig) {
      imgs.push({ file: orig.file, blob: null, url: thumbUrl('images/portfolio/' + orig.file) });
      (orig.images || []).forEach(function (f) { imgs.push({ file: f, blob: null, url: thumbUrl('images/portfolio/' + f) }); });
    }
    var origFiles = imgs.map(function (i) { return i.file; });

    openEditor(function (d) {
      d.appendChild(el('h2', { text: isNew ? 'Neues Werk' : 'Werk bearbeiten' }));

      // Kategorie
      var catSel = el('select', { id: 'w-cat' });
      allCats().forEach(function (c) { catSel.appendChild(el('option', { value: c, text: catName(c) })); });
      if (isNew) catSel.appendChild(el('option', { value: '__new', text: '+ Neue Kategorie …' }));
      catSel.value = orig ? orig.cat : (st.filter !== 'all' ? st.filter : catSel.options[0].value);
      if (orig) catSel.disabled = true;
      var newCat = langField('Name der neuen Kategorie', emptyL());
      newCat.root.hidden = true;
      catSel.addEventListener('change', function () { newCat.root.hidden = catSel.value !== '__new'; });
      d.appendChild(el('label', { for: 'w-cat', text: 'Kategorie' }));
      d.appendChild(catSel);
      if (orig) d.appendChild(el('p', { class: 'a-hint', text: 'Die Kategorie lässt sich nicht ändern. Dafür Werk neu anlegen.' }));
      d.appendChild(newCat.root);

      // Position (nur neu)
      var posSel = el('select', { id: 'w-pos' }, [
        el('option', { value: 'start', text: 'Am Anfang (neuestes zuerst)' }),
        el('option', { value: 'end', text: 'Am Ende' })
      ]);
      if (isNew) { d.appendChild(el('label', { for: 'w-pos', text: 'Position im Portfolio' })); d.appendChild(posSel); }

      // Bilder
      var imgBox = el('div', { class: 'a-imgs' });
      var fileIn = el('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
      var replaceIn = el('input', { type: 'file', accept: 'image/*', hidden: true });
      var replaceIdx = 0;
      function drawImgs() {
        imgBox.textContent = '';
        imgs.forEach(function (im, i) {
          imgBox.appendChild(el('div', { class: 'a-img' }, [
            el('img', { src: im.url, alt: '' }),
            el('small', { text: i === 0 ? 'Titelbild' : 'Bild ' + (i + 1) }),
            el('div', { class: 'a-row' }, [
              el('button', { type: 'button', 'aria-label': 'ersetzen', title: 'Ersetzen', text: '⟳', onclick: function () { replaceIdx = i; replaceIn.click(); } }),
              el('button', { type: 'button', 'aria-label': 'nach vorne', title: 'Nach vorne', text: '←', onclick: function () { if (i > 0) { var t = imgs[i]; imgs[i] = imgs[i - 1]; imgs[i - 1] = t; drawImgs(); } } }),
              el('button', { type: 'button', 'aria-label': 'entfernen', title: 'Entfernen', text: '×', onclick: function () { imgs.splice(i, 1); drawImgs(); } })
            ])
          ]));
        });
        imgBox.appendChild(el('button', { type: 'button', class: 'btn btn-outline btn-small', text: '+ Bild hinzufügen', onclick: function () { fileIn.click(); } }));
      }
      async function addFiles(files, replaceAt) {
        for (var i = 0; i < files.length; i++) {
          try {
            var blob = await processImage(files[i]);
            var item = { file: null, blob: blob, url: URL.createObjectURL(blob) };
            if (replaceAt !== undefined) {
              var oldItem = imgs[replaceAt];
              item.file = oldItem.file;             // gleicher Dateiname wird überschrieben
              imgs[replaceAt] = item;
            } else imgs.push(item);
            toast(files[i].name + ' → WebP, ' + Math.round(blob.size / 1024) + ' KB', 'ok');
          } catch (e) { toast('Bild konnte nicht gelesen werden: ' + files[i].name, 'err'); }
        }
        drawImgs();
      }
      fileIn.addEventListener('change', function () { addFiles(Array.from(fileIn.files)); fileIn.value = ''; });
      replaceIn.addEventListener('change', function () { if (replaceIn.files[0]) addFiles([replaceIn.files[0]], replaceIdx); replaceIn.value = ''; });
      d.appendChild(el('div', { class: 'a-section' }, [
        el('h3', { text: 'Bilder' }),
        el('p', { class: 'a-hint', text: 'Das erste Bild ist das Titelbild im Raster. Weitere Bilder (z. B. Fortschritt) erscheinen in der Grossansicht als Serie. Der Dateiname wird automatisch vergeben (z. B. illustration-04.webp).' }),
        imgBox, fileIn, replaceIn
      ]));
      drawImgs();

      // Texte
      var fTitle = langField('Titel', orig ? orig.title : emptyL());
      var fDesc = langField('Beschreibung', orig ? orig.desc : emptyL(), { multiline: true, hint: 'Leerzeile = neuer Absatz. Optional Links im Text: [Text](https://…)' });
      d.appendChild(el('div', { class: 'a-section' }, [el('h3', { text: 'Texte' }), fTitle.root, fDesc.root]));
      var fields = [fTitle, fDesc, newCat];
      d.appendChild(translateBar(fields));

      // Social-Links
      var linkInputs = {};
      var linkGrid = el('div', { class: 'a-links-grid' });
      function addLink(key, val) {
        if (linkInputs[key]) return;
        var i = el('input', { type: 'url', placeholder: 'https://…', id: 'lk-' + key });
        i.value = val || '';
        linkInputs[key] = i;
        linkGrid.appendChild(el('label', { for: 'lk-' + key, text: SOCIAL_NAMES[key] || key }));
        linkGrid.appendChild(i);
      }
      var shown = KNOWN_SOCIAL.filter(function (k) { return (SITE.social && SITE.social[k]) || (orig && orig.links && orig.links[k]); });
      if (!shown.length) shown = ['instagram', 'behance', 'deviantart'];
      shown.forEach(function (k) { addLink(k, orig && orig.links && orig.links[k]); });
      var more = el('select', { 'aria-label': 'Weitere Plattform', onchange: function () { if (more.value) { addLink(more.value, ''); more.value = ''; } } },
        [el('option', { value: '', text: '+ weitere Plattform …' })]);
      KNOWN_SOCIAL.forEach(function (k) { more.appendChild(el('option', { value: k, text: SOCIAL_NAMES[k] })); });
      d.appendChild(el('div', { class: 'a-section' }, [
        el('h3', { text: 'Dieses Werk auch auf (Social-Links)' }),
        el('p', { class: 'a-hint', text: 'Link zum Post dieses Werks. Leer lassen = kein Icon. Es erscheinen nur Plattformen mit Link.' }),
        linkGrid, more
      ]));

      // Anfrage-Knopf
      var inq = el('input', { type: 'checkbox', id: 'w-inq' }); inq.checked = orig ? orig.inquiry !== false : true;
      d.appendChild(el('div', { class: 'a-section' }, [el('label', { class: 'check', for: 'w-inq' }, [inq, 'Knopf „Anfrage zu diesem Werk“ zeigen'])]));

      // Knöpfe
      var actions = el('div', { class: 'a-actions' });
      if (!isNew) actions.appendChild(el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Werk löschen', onclick: function () {
        if (!confirm('Dieses Werk samt Bildern wirklich löschen? (Nach dem Veröffentlichen ist es weg, nur über den GitHub-Verlauf zurückholbar.)')) return;
        deleteWork(idx); closeEditor();
      } }));
      actions.appendChild(el('span', { style: 'flex:1' }));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Abbrechen', onclick: closeEditor }));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-primary btn-small', text: 'Übernehmen', onclick: function () {
        try {
          applyWork(idx, { imgs: imgs, origFiles: origFiles, catSel: catSel, newCat: newCat, posSel: posSel, fTitle: fTitle, fDesc: fDesc, linkInputs: linkInputs, inq: inq });
          closeEditor();
        } catch (e) { toast(e.message, 'err'); }
      } }));
      d.appendChild(actions);
    });
  }

  function nextNumber(cat) {
    var max = 0;
    st.content.works.forEach(function (w) {
      var m = w.id.match(/^(.*)-(\d+)$/);
      if (m && m[1] === cat) max = Math.max(max, parseInt(m[2], 10));
    });
    return max + 1;
  }
  function slugify(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  function queueFile(path, blob) {
    st.newFiles[path] = blob;
    delete st.delFiles[path];
    st.urls[path] = URL.createObjectURL(blob);
  }
  function queueDelete(path) {
    if (st.newFiles[path] && !st.existing[path]) { delete st.newFiles[path]; delete st.urls[path]; return; }
    delete st.newFiles[path]; delete st.urls[path];
    if (st.existing[path]) st.delFiles[path] = true;
  }

  function applyWork(idx, f) {
    var isNew = idx < 0;
    if (!f.imgs.length) throw new Error('Mindestens ein Bild wird gebraucht.');
    // Links prüfen
    var links = {};
    Object.keys(f.linkInputs).forEach(function (k) {
      var v = f.linkInputs[k].value.trim();
      if (!v) return;
      if (!isHttp(v)) throw new Error('Der Link bei ' + (SOCIAL_NAMES[k] || k) + ' muss mit https:// beginnen.');
      links[k] = v;
    });
    // Kategorie
    var cat = f.catSel.value;
    if (cat === '__new') {
      var lab = f.newCat.getAll();
      if (!lab.de) throw new Error('Bitte einen Namen für die neue Kategorie eintragen.');
      cat = slugify(lab.de);
      if (!cat) throw new Error('Der Kategoriename braucht Buchstaben oder Zahlen.');
      if (allCats().indexOf(cat) !== -1) throw new Error('Diese Kategorie gibt es schon (' + catName(cat) + ').');
      st.content.categories.push({ id: cat, label: { de: lab.de, fr: lab.fr || lab.de, en: lab.en || lab.de } });
    }
    var work = isNew ? { id: cat + '-' + pad(nextNumber(cat)), cat: cat } : st.content.works[idx];
    // Dateinamen vergeben
    var used = {};
    f.imgs.forEach(function (im) { if (im.file) used[im.file] = true; });
    var extraMax = 1;
    f.imgs.forEach(function (im) { var m = (im.file || '').match(/-(\d+)\.[a-z0-9]+$/i); if (m && im.file !== work.file && (im.file || '').indexOf(work.id + '-') === 0) extraMax = Math.max(extraMax, parseInt(m[1], 10)); });
    f.imgs.forEach(function (im, i) {
      if (!im.file) {
        im.file = i === 0 ? work.id + '.webp' : work.id + '-' + (++extraMax) + '.webp';
        // falls der Name schon belegt ist (z. B. Titelbild getauscht), nächste freie Nummer
        while (used[im.file] && i > 0) im.file = work.id + '-' + (++extraMax) + '.webp';
        used[im.file] = true;
      }
      if (im.blob) queueFile('images/portfolio/' + im.file, im.blob);
    });
    // entfernte Bilder löschen
    var keep = {}; f.imgs.forEach(function (im) { keep[im.file] = true; });
    f.origFiles.forEach(function (fn) { if (!keep[fn]) queueDelete('images/portfolio/' + fn); });

    work.file = f.imgs[0].file;
    work.images = f.imgs.slice(1).map(function (im) { return im.file; });
    work.title = f.fTitle.getAll();
    work.desc = f.fDesc.getAll();
    work.links = links;
    work.inquiry = f.inq.checked;
    if (isNew) {
      if (f.posSel.value === 'start') st.content.works.unshift(work); else st.content.works.push(work);
    }
    setDirty(true); render();
    toast('Übernommen. Mit „Veröffentlichen“ geht es online.', 'ok');
  }

  function deleteWork(idx) {
    var w = st.content.works[idx];
    queueDelete('images/portfolio/' + w.file);
    (w.images || []).forEach(function (fn) { queueDelete('images/portfolio/' + fn); });
    st.content.works.splice(idx, 1);
    setDirty(true); render();
  }

  /* ------------------------------ Editor: Leistung ------------------------------ */
  function openServiceEditor(idx) {
    var isNew = idx < 0;
    var s = isNew ? { title: emptyL(), text: emptyL(), price: emptyL(), meta: emptyL(), inquiry: true, style: '' } : st.content.services[idx];
    openEditor(function (d) {
      d.appendChild(el('h2', { text: isNew ? 'Neue Leistung' : 'Leistung bearbeiten' }));
      var fTitle = langField('Titel der Leistung', s.title);
      var fText = langField('Was ist die Leistung genau?', s.text, { multiline: true });
      var fPrice = langField('Preis', s.price, { hint: 'z. B. „ab 50 €“ oder „Auf Anfrage“. Leer = kein Preis.' });
      var fMeta = langField('Zusatzzeile (optional)', s.meta, { hint: 'z. B. Lieferzeit. Leer = Standardtext der Seite („Lieferzeit & Korrekturrunden nach Absprache“).' });
      d.appendChild(fTitle.root); d.appendChild(fText.root); d.appendChild(fPrice.root); d.appendChild(fMeta.root);
      d.appendChild(translateBar([fTitle, fText, fPrice, fMeta]));
      var inq = el('input', { type: 'checkbox', id: 's-inq' }); inq.checked = s.inquiry !== false;
      var hl = el('input', { type: 'checkbox', id: 's-hl' }); hl.checked = s.style === 'idea';
      d.appendChild(el('div', { class: 'a-section' }, [
        el('label', { class: 'check', for: 's-inq' }, [inq, 'Knopf „Anfrage schicken“ zeigen']),
        el('label', { class: 'check', for: 's-hl' }, [hl, 'Karte hervorheben (gestrichelter Rand, ohne Zusatzzeile)'])
      ]));
      var actions = el('div', { class: 'a-actions' });
      if (!isNew) actions.appendChild(el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Leistung löschen', onclick: function () {
        if (!confirm('Diese Leistung wirklich löschen?')) return;
        st.content.services.splice(idx, 1); setDirty(true); render(); closeEditor();
      } }));
      actions.appendChild(el('span', { style: 'flex:1' }));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-outline btn-small', text: 'Abbrechen', onclick: closeEditor }));
      actions.appendChild(el('button', { type: 'button', class: 'btn btn-primary btn-small', text: 'Übernehmen', onclick: function () {
        var t = fTitle.getAll();
        if (!t.de) { toast('Bitte einen deutschen Titel eintragen.', 'err'); return; }
        var obj = { title: t, text: fText.getAll(), price: fPrice.getAll(), meta: fMeta.getAll(), inquiry: inq.checked, style: hl.checked ? 'idea' : '' };
        if (isNew) st.content.services.push(obj); else st.content.services[idx] = obj;
        setDirty(true); render(); closeEditor();
        toast('Übernommen. Mit „Veröffentlichen“ geht es online.', 'ok');
      } }));
      d.appendChild(actions);
    });
  }

  /* ------------------------------ Veröffentlichen (ein Commit) ------------------------------ */
  async function publish() {
    var btn = $('publish-btn'); btn.disabled = true; btn.textContent = 'Veröffentliche …';
    try {
      // Wurde content.js inzwischen anderswo geändert?
      var cur = await gh(repoPath('/contents/data/content.js?ref=' + encodeURIComponent(st.branch)));
      if (cur.sha !== st.contentSha) throw new Error('Die Inhalte wurden zwischenzeitlich anderswo geändert (z. B. in VS Code). Bitte die Seite neu laden und deine Änderung nochmal machen.');

      var ref = await gh(repoPath('/git/ref/heads/' + encodeURIComponent(st.branch)));
      var headSha = ref.object.sha;
      var commit = await gh(repoPath('/git/commits/' + headSha));
      var tree = [];

      var paths = Object.keys(st.newFiles);
      for (var i = 0; i < paths.length; i++) {
        var b = await gh(repoPath('/git/blobs'), { method: 'POST', body: { content: await blobToB64(st.newFiles[paths[i]]), encoding: 'base64' } });
        tree.push({ path: paths[i], mode: '100644', type: 'blob', sha: b.sha });
      }
      var cb = await gh(repoPath('/git/blobs'), { method: 'POST', body: { content: textToB64(serializeContent(st.content)), encoding: 'base64' } });
      tree.push({ path: 'data/content.js', mode: '100644', type: 'blob', sha: cb.sha });
      Object.keys(st.delFiles).forEach(function (p) { tree.push({ path: p, mode: '100644', type: 'blob', sha: null }); });

      var newTree = await gh(repoPath('/git/trees'), { method: 'POST', body: { base_tree: commit.tree.sha, tree: tree } });
      var nc = await gh(repoPath('/git/commits'), { method: 'POST', body: {
        message: 'Admin: Inhalte aktualisiert', tree: newTree.sha, parents: [headSha] } });
      await gh(repoPath('/git/refs/heads/' + encodeURIComponent(st.branch)), { method: 'PATCH', body: { sha: nc.sha } });

      // Zustand zurücksetzen
      var f = await gh(repoPath('/contents/data/content.js?ref=' + encodeURIComponent(st.branch)));
      st.contentSha = f.sha;
      st.orig = clone(st.content); registerExisting(st.content);
      st.newFiles = {}; st.delFiles = {};
      setDirty(false); render();
      toast('Veröffentlicht! In 1 bis 2 Minuten ist es online (dann Ctrl+F5 auf der Seite).', 'ok');
    } catch (e) {
      toast('Veröffentlichen fehlgeschlagen: ' + e.message, 'err');
    } finally { btn.disabled = false; btn.textContent = 'Veröffentlichen'; }
  }

  function discard() {
    if (!confirm('Alle ungespeicherten Änderungen verwerfen?')) return;
    st.content = clone(st.orig); st.newFiles = {}; st.delFiles = {}; st.urls = {};
    setDirty(false); render();
  }

  /* ------------------------------ Start ------------------------------ */
  document.querySelectorAll('.a-tabs button').forEach(function (b) {
    b.addEventListener('click', function () { st.tab = b.dataset.tab; render(); });
  });
  $('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var msg = $('login-msg'); msg.textContent = 'Melde an …';
    try { await login($('token').value, $('remember').checked); msg.textContent = ''; }
    catch (err) {
      msg.textContent = err.status === 401 ? 'Token ungültig oder abgelaufen.'
        : err.status === 404 ? 'Repository oder data/content.js nicht gefunden. Stimmt der Token-Zugriff auf „' + GH.repo + '“? Ist data/content.js hochgeladen?'
        : err.message;
    }
  });
  $('logout').addEventListener('click', logout);
  $('publish-btn').addEventListener('click', publish);
  $('discard').addEventListener('click', discard);
  var saved = '';
  try { saved = localStorage.getItem('dlw-admin-token') || sessionStorage.getItem('dlw-admin-token') || ''; } catch (e) {}
  if (saved) {
    $('login-msg').textContent = 'Melde an …';
    login(saved, !!localStorage.getItem('dlw-admin-token')).then(function () { $('login-msg').textContent = ''; })
      .catch(function (err) { $('login-msg').textContent = 'Gespeicherte Anmeldung hat nicht geklappt: ' + err.message; });
  }
})();

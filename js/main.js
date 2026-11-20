/* =====================================================================
   main.js  -  das einzige Skript der Seite. Es macht drei Dinge:

   1) SPRACHE   : Texte aus translations.js einsetzen (DE / FR / EN)
   2) BILDER    : Bilder anhand ihrer Dateinamen automatisch finden und zeigen
   3) KLEINKRAM : Formular-Adresse, Footer-Links, Lightbox, Jahreszahl

   Es braucht keine Bibliothek und keinen Server: du kannst index.html
   direkt per Doppelklick im Browser öffnen.
   ===================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE;               // Einstellungen aus config.js
  var TEXTS = window.TRANSLATIONS;      // Texte aus translations.js
  var LANGS = ['de', 'fr', 'en'];
  var lang = SITE.defaultLang;

  /* Inhalte aus data/content.js (wird vom Admin geschrieben): Werke, Titel, Beschreibungen,
     Social-Links, eigene Kategorien und Leistungen. Fehlt die Datei, funktioniert die Seite
     wie vorher mit config.js und den Dateinamen. */
  var CONTENT = window.CONTENT || null;
  var manifest = !!(CONTENT && CONTENT.works && CONTENT.works.length);
  // Seitentexte aus dem Admin (Tab "Seite") überschreiben die Texte aus translations.js
  if (CONTENT && CONTENT.texts) {
    Object.keys(CONTENT.texts).forEach(function (k) {
      LANGS.forEach(function (L) {
        var v = CONTENT.texts[k] && CONTENT.texts[k][L];
        if (v && TEXTS[L]) TEXTS[L][k] = v;
      });
    });
  }
  // Bilder der Bereiche (hero, about, manga) aus dem Admin; fehlen sie, werden sie wie bisher nach Dateinamen gesucht
  var slotsData = (CONTENT && CONTENT.slots) || null;
  if (CONTENT) {
    SITE.titles = SITE.titles || {}; SITE.descriptions = SITE.descriptions || {}; SITE.links = SITE.links || {};
    (CONTENT.works || []).forEach(function (w) {
      SITE.titles[w.id] = w.title || {};
      SITE.descriptions[w.id] = w.desc || {};
      SITE.links[w.id] = w.links || {};
    });
    // Reihenfolge der Kategorien: so, wie sie im Admin sortiert wurden; unbekannte Standard-Kategorien dahinter
    var catOrder = (CONTENT.categories || []).map(function (c) { return c.id; });
    SITE.categories.forEach(function (c) { if (catOrder.indexOf(c) === -1) catOrder.push(c); });
    SITE.categories = catOrder;
  }

  /* =================================================================
     1) SPRACHE
     ================================================================= */

  // Sprache wählen, in dieser Reihenfolge:
  //   a) ?lang=fr in der Adresse   b) zuletzt gewählte Sprache
  //   c) Sprache des Browsers      d) defaultLang aus config.js
  function pickLanguage() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;

    try {
      var saved = localStorage.getItem('dlw-lang');
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* localStorage kann blockiert sein: dann einfach weiter */ }

    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (LANGS.indexOf(browser) !== -1) return browser;

    return SITE.defaultLang;
  }

  // Einen Text holen. Fehlt er in der gewählten Sprache, nimmt das Skript
  // die Standardsprache, und zuletzt den Schlüssel selbst (so siehst du Tippfehler).
  function t(key) {
    if (TEXTS[lang] && TEXTS[lang][key] !== undefined) return TEXTS[lang][key];
    if (TEXTS[SITE.defaultLang] && TEXTS[SITE.defaultLang][key] !== undefined) return TEXTS[SITE.defaultLang][key];
    return key;
  }

  // Gibt es diesen Schlüssel in translations.js für die gewählte Sprache?
  function has(key) { return !!(TEXTS[lang] && TEXTS[lang][key] !== undefined); }

  // Name einer Kategorie. Steht er in translations.js (z. B. 'cat.fanart'), wird er genommen.
  // Fehlt er, zeigt die Seite den Dateinamen-Anfang mit grossem Anfangsbuchstaben ("Fanart")
  // und NICHT mehr den rohen Schlüssel "cat.fanart".
  function catLabel(cat) {
    var own = CONTENT && (CONTENT.categories || []).filter(function (c) { return c.id === cat; })[0];
    if (own && own.label && (own.label[lang] || own.label[SITE.defaultLang])) return own.label[lang] || own.label[SITE.defaultLang];
    if (has('cat.' + cat)) return t('cat.' + cat);
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  // Eingebaute Texte für die Blätterleiste (falls sie in translations.js fehlen)
  var UI = {
    de: { prev: 'Vorherige Seite', next: 'Nächste Seite', page: 'Seite {n} von {total}', swipe: '‹ Wische nach links oder rechts zum Blättern ›' },
    fr: { prev: 'Page précédente', next: 'Page suivante',  page: 'Page {n} sur {total}', swipe: '‹ Glisse vers la gauche ou la droite pour changer de page ›' },
    en: { prev: 'Previous page',   next: 'Next page',       page: 'Page {n} of {total}', swipe: '‹ Swipe left or right to change page ›' }
  };
  function ui(key) { return has('portfolio.' + key) ? t('portfolio.' + key) : UI[lang][key]; }

  // Aus {de:'..', fr:'..', en:'..'} den Text der aktuellen Sprache holen.
  // Gibt es ihn nicht, wird der Text der Standardsprache genommen, sonst ''.
  function pick(obj) {
    if (!obj) return '';
    return obj[lang] || obj[SITE.defaultLang] || '';
  }

  // Alle Texte der Seite in der gewählten Sprache setzen
  function applyLanguage(newLang) {
    lang = newLang;
    document.documentElement.lang = lang;          // <html lang="..."> für Screenreader/Suchmaschinen

    // Normale Texte:  <p data-i18n="hero.text">
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.hasAttribute('data-rich')) renderRich(el, t(el.dataset.i18n));
      else el.textContent = t(el.dataset.i18n);
    });
    // Platzhalter in Formularfeldern:  data-i18n-placeholder="..."
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    // Beschriftung für Screenreader:  data-i18n-aria="..."
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    // Alt-Texte der Bilder in Slots (hero, about)
    document.querySelectorAll('[data-slot] img').forEach(function (img) {
      img.alt = t(img.closest('[data-slot]').dataset.alt);
    });

    // Seitentitel und Beschreibung für den Browser-Tab / Google
    document.title = t('meta.title');
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('meta.description'));

    // Der gewählte Sprachknopf wird hervorgehoben
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    // Sprache ans Formular hängen (du siehst in der E-Mail, welche Sprache der Besucher nutzt)
    var langField = document.getElementById('f-lang');
    if (langField) langField.value = lang;

    // Dinge, die nicht im HTML stehen, sondern vom Skript gebaut sind:
    buildServices();
    refreshGalleryTexts();
    refreshPlaceholderHints();

    try { localStorage.setItem('dlw-lang', lang); } catch (e) { /* egal */ }
  }

  /* =================================================================
     2) BILDER AUTOMATISCH FINDEN
     Die Seite "probiert", ob eine Datei existiert, indem sie versucht,
     sie zu laden. Klappt es: Bild anzeigen. Klappt es nicht: nächste Endung.
     ================================================================= */

  // Zahl mit führender Null:  1 -> "01"
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Versucht, EINE Adresse als Bild zu laden. Ergebnis: die Adresse oder null.
  function probe(url) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload  = function () { resolve(url); };
      img.onerror = function () { resolve(null); };
      img.src = url;
    });
  }

  // Sucht "basis" + alle erlaubten Endungen (webp, jpg, jpeg, png).
  // Beispiel: findImage('images/hero') probiert hero.webp, hero.jpg, ...
  async function findImage(base) {
    for (var i = 0; i < SITE.imageExtensions.length; i++) {
      var found = await probe(base + '.' + SITE.imageExtensions[i]);
      if (found) return found;
    }
    return null;
  }

  // --- Platzhalter-Hinweis: "Bild fehlt: hero.jpg" ---
  function makePlaceholder(filename) {
    var box = document.createElement('div');
    box.className = 'placeholder';
    box.dataset.file = filename;
    var small = document.createElement('span');
    small.className = 'ph-label';
    var name = document.createElement('b');
    name.textContent = filename;
    box.appendChild(small);
    box.appendChild(name);
    return box;
  }
  function refreshPlaceholderHints() {
    document.querySelectorAll('.placeholder .ph-label').forEach(function (s) {
      s.textContent = t('placeholder.hint');
    });
  }

  // --- 2a) Einzelbilder: hero, about  (data-slot="hero" -> images/hero.*) ---
  async function loadSlots() {
    var slots = document.querySelectorAll('[data-slot]');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      var name = slot.dataset.slot;
      var url;
      if (slotsData && name in slotsData) url = slotsData[name] ? 'images/' + slotsData[name] : null;
      else url = await findImage('images/' + name);
      if (url) {
        var img = document.createElement('img');
        img.src = url;
        img.alt = t(slot.dataset.alt);
        img.decoding = 'async';
        slot.appendChild(img);
      } else if (SITE.showPlaceholderHints) {
        slot.appendChild(makePlaceholder('images/' + name + '.jpg'));
      } else {
        slot.hidden = true;            // fertige Seite: nichts anzeigen
      }
    }
    refreshPlaceholderHints();
  }

  // --- 2b) Manga: manga-01, manga-02, ... in images/ ---
  async function loadManga() {
    var grid = document.getElementById('manga-grid');
    var count = 0;
    if (slotsData && Array.isArray(slotsData.manga)) {
      // Liste aus dem Admin
      slotsData.manga.forEach(function (file) {
        var img = document.createElement('img');
        img.src = 'images/' + file; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
        grid.appendChild(img);
        count++;
      });
    } else for (var i = 1; i <= SITE.maxManga; i++) {
      var url = await findImage('images/manga-' + pad(i));
      if (!url) break;                 // Lücke in der Nummerierung = Ende
      var img = document.createElement('img');
      img.src = url; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
      grid.appendChild(img);
      count++;
    }
    if (count === 0) {
      if (SITE.showPlaceholderHints) {
        var holder = document.createElement('div');
        holder.className = 'slot';
        holder.appendChild(makePlaceholder('images/manga-01.jpg'));
        grid.appendChild(holder);
        refreshPlaceholderHints();
      } else {
        grid.hidden = true;
      }
    }
  }

  // --- 2c) Portfolio: images/portfolio/<kategorie>-<nr>.<endung> ---
  var works = [];            // alle gefundenen Werke: {id, cat, url, caption-Element}
  var currentFilter = 'all';

  async function loadPortfolio() {
    if (manifest) {
      // Liste aus data/content.js: Reihenfolge, Zusatzbilder usw. stehen dort (Admin pflegt sie)
      works = CONTENT.works.map(function (c) {
        var w = { id: c.id, cat: c.cat, url: 'images/portfolio/' + c.file, inquiry: c.inquiry !== false };
        w.images = [w.url].concat((c.images || []).map(function (f) { return 'images/portfolio/' + f; }));
        w.extrasPromise = Promise.resolve(w.images);
        return w;
      });
    } else {
      // Alle Kategorien gleichzeitig durchsuchen. Pro Kategorie wird von 01 an
      // gezählt und beim ersten fehlenden Bild aufgehört (Nummern lückenlos!).
      var perCategory = await Promise.all(SITE.categories.map(async function (cat) {
        var list = [];
        for (var i = 1; i <= SITE.maxPerCategory; i++) {
          var id = cat + '-' + pad(i);
          var url = await findImage('images/portfolio/' + id);
          if (!url) break;
          list.push({ id: id, cat: cat, url: url });
        }
        return list;
      }));
      works = [].concat.apply([], perCategory);
    }

    var section = document.getElementById('portfolio');
    var gallery = document.getElementById('gallery');
    var filters = document.getElementById('filters');

    // Keine Bilder gefunden?
    if (works.length === 0) {
      if (!SITE.showPlaceholderHints) { section.hidden = true; return; }
      // Aufbau-Modus: sechs Platzhalter mit den erwarteten Dateinamen
      ['illustration-01', 'illustration-02', 'charakter-01', 'charakter-02', 'poster-01', 'branding-01']
        .forEach(function (id) {
          var fig = document.createElement('figure');
          fig.className = 'work is-placeholder';
          var holder = document.createElement('div');
          holder.className = 'slot';
          holder.style.aspectRatio = '4 / 5';
          holder.appendChild(makePlaceholder('images/portfolio/' + id + '.jpg'));
          fig.appendChild(holder);
          gallery.appendChild(fig);
        });
      refreshPlaceholderHints();
      return;
    }

    // Filterknöpfe: "Alle" + jede Kategorie, die mindestens ein Bild hat
    var usedCats = SITE.categories.filter(function (c) {
      return works.some(function (w) { return w.cat === c; });
    });
    if (usedCats.length > 1) {
      ['all'].concat(usedCats).forEach(function (cat) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.filter = cat;
        b.dataset.i18nDyn = cat === 'all' ? 'portfolio.all' : 'cat.' + cat;
        b.addEventListener('click', function () { setFilter(cat); });
        filters.appendChild(b);
      });
    }

    // Bilder in das Raster setzen
    works.forEach(function (w) {
      var fig = document.createElement('figure');
      fig.className = 'work';
      fig.dataset.cat = w.cat;

      var btn = document.createElement('button');
      btn.type = 'button';
      var img = document.createElement('img');
      img.src = w.url; img.loading = 'lazy'; img.decoding = 'async';
      btn.appendChild(img);
      w.badge = document.createElement('span');          // "1/3" bei mehreren Bildern
      w.badge.className = 'work-count';
      w.badge.hidden = true;
      btn.appendChild(w.badge);
      if (w.images && w.images.length > 1) { w.badge.textContent = '1/' + w.images.length; w.badge.hidden = false; }
      btn.addEventListener('click', function () { openLightbox(w); });
      fig.appendChild(btn);

      w.img = img;
      w.cap = document.createElement('figcaption');
      fig.appendChild(w.cap);
      w.fig = fig;
      gallery.appendChild(fig);
    });

    // Blätterknöpfe (vor / zurück)
    document.getElementById('pager-prev').addEventListener('click', function () { goToPage(currentPage - 1); });
    document.getElementById('pager-next').addEventListener('click', function () { goToPage(currentPage + 1); });

    // Wischen im Raster: nach links = nächste Seite, nach rechts = vorherige
    var sx = 0, sy = 0, tracking = false;
    gallery.addEventListener('touchstart', function (e) {
      tracking = e.touches.length === 1;
      if (tracking) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
    }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;   // eher senkrecht = normales Scrollen
      var pages = Math.max(1, Math.ceil(filteredWorks().length / perPage()));
      var target = currentPage + (dx < 0 ? 1 : -1);
      if (target >= 1 && target <= pages) goToPage(target);
    }, { passive: true });

    refreshGalleryTexts();
    setFilter('all');
    works.forEach(loadExtras);        // Zusatzbilder suchen (für das "1/3"-Zeichen)
  }

  // Titel und Beschreibung eines Werks aus js/config.js (titles / descriptions)
  function captionFor(w)     { return pick(SITE.titles && SITE.titles[w.id]); }
  function descriptionFor(w) { return pick(SITE.descriptions && SITE.descriptions[w.id]); }

  // Alle vom Skript gebauten Texte in der aktuellen Sprache setzen
  function refreshGalleryTexts() {
    document.querySelectorAll('#filters button').forEach(function (b) {
      b.textContent = b.dataset.filter === 'all' ? t('portfolio.all') : catLabel(b.dataset.filter);
    });
    works.forEach(function (w) {
      var cap = captionFor(w);
      w.cap.textContent = cap;
      w.cap.hidden = !cap;
      w.img.alt = cap || catLabel(w.cat);
    });
    document.getElementById('pager-prev').setAttribute('aria-label', ui('prev'));
    document.getElementById('pager-next').setAttribute('aria-label', ui('next'));
    if (works.length) render();            // Seitenzahl-Text neu schreiben
    if (openWork) fillLightbox(openWork);  // geöffnete Grossansicht übersetzen
  }

  // --- Filter und Blättern ---
  var currentPage = 1;
  function perPage() { return SITE.perPage > 0 ? SITE.perPage : 8; }

  // Werke der gewählten Kategorie
  function filteredWorks() {
    return works.filter(function (w) { return currentFilter === 'all' || w.cat === currentFilter; });
  }

  // Zeichnet das Raster neu: nur die Werke der aktuellen Seite sind sichtbar
  function render() {
    var list = filteredWorks();
    var per = perPage();
    var pages = Math.max(1, Math.ceil(list.length / per));
    currentPage = Math.min(Math.max(1, currentPage), pages);

    var start = (currentPage - 1) * per;
    works.forEach(function (w) { w.fig.hidden = true; });
    list.slice(start, start + per).forEach(function (w) { w.fig.hidden = false; });

    document.querySelectorAll('#filters button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.filter === currentFilter));
    });

    // Blätterleiste nur zeigen, wenn es mehr als eine Seite gibt
    document.getElementById('pager').hidden = pages <= 1;
    var hint = document.getElementById('swipe-hint');
    hint.hidden = pages <= 1;
    hint.textContent = ui('swipe');
    document.getElementById('pager-prev').disabled = currentPage <= 1;
    document.getElementById('pager-next').disabled = currentPage >= pages;
    document.getElementById('pager-label').textContent =
      ui('page').replace('{n}', currentPage).replace('{total}', pages);
  }

  // Zu einer Seite springen und das Raster wieder an den Anfang scrollen
  function goToPage(n) {
    currentPage = n;
    render();
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Kategorie wählen: immer wieder bei Seite 1 anfangen
  function setFilter(cat) {
    currentFilter = cat;
    currentPage = 1;
    render();
  }

  // --- Lightbox: grosse Ansicht mit Titel und Beschreibung ---
  var openWork = null;                      // welches Werk gerade offen ist

  /* Text mit Links: [Text](https://adresse) wird zu einem anklickbaren Link.
     Alles andere bleibt reiner Text (kein innerHTML, also sicher).
     Nur http:// und https:// sind erlaubt. */
  function setRichText(el, text) {
    el.textContent = '';
    var re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    var last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) addText(el, text.slice(last, m.index));
      var a = document.createElement('a');
      a.href = m[2];
      a.textContent = m[1];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      el.appendChild(a);
      last = re.lastIndex;
    }
    if (last < text.length) addText(el, text.slice(last));
  }

  // Text einsetzen; ein einzelner Zeilenumbruch (\n) wird zu <br>
  function addText(el, text) {
    text.split('\n').forEach(function (line, i) {
      if (i > 0) el.appendChild(document.createElement('br'));
      if (line) el.appendChild(document.createTextNode(line));
    });
  }

  /* Mehrere Absätze: eine Leerzeile im Text (\n\n) trennt Absätze.
     Jeder Absatz darf Links der Form [Text](https://adresse) enthalten. */
  function renderRich(el, text) {
    el.textContent = '';
    String(text || '').split(/\n\s*\n/).forEach(function (para) {
      if (!para.trim()) return;
      var p = document.createElement('p');
      setRichText(p, para.trim());
      el.appendChild(p);
    });
  }

  // Anfrage-Knopf: Kontaktformular mit dem Betreff (Werk oder Leistung) vorbereiten
  function prefillInquiry(subject) {
    var f = document.getElementById('f-type');
    if (f && subject) f.value = subject;
    setTimeout(function () {
      var msg = document.getElementById('f-msg');
      if (msg) msg.focus({ preventScroll: true });
    }, 700);
  }

  // Icon-Link zu einem Profil (Icon aus images/icons/<name>.svg)
  var SOCIAL_NAMES = {
    instagram: 'Instagram', behance: 'Behance', deviantart: 'DeviantArt',
    artstation: 'ArtStation', etsy: 'Etsy', kofi: 'Ko-fi', patreon: 'Patreon',
    tiktok: 'TikTok', youtube: 'YouTube', pinterest: 'Pinterest', threads: 'Threads',
    facebook: 'Facebook', x: 'X', linkedin: 'LinkedIn', discord: 'Discord'
  };
  function isHttp(u) { return /^https?:\/\//i.test(u || ''); }
  function makeIconLink(key, url) {
    var a = document.createElement('a');
    a.className = 'icon-link';
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    var name = SOCIAL_NAMES[key] || key;
    a.setAttribute('aria-label', name); a.title = name;
    var img = document.createElement('img');
    img.src = 'images/icons/' + key + '.svg'; img.alt = ''; img.width = 28; img.height = 28;
    a.appendChild(img);
    return a;
  }

  // Leistungskarten aus translations.js bauen: services.p1, p2, p3 ... und services.idea
  var svcFilter = 'all';
  function buildServices() {
    var box = document.getElementById('services-cards');
    if (!box) return;
    var fbox = document.getElementById('services-filters');
    box.textContent = '';
    if (fbox) { fbox.textContent = ''; fbox.hidden = true; }
    function card(title, text, meta, price, ctaText, highlight, examples) {
      var c = document.createElement('article');
      c.className = 'card' + (highlight ? ' card-idea' : '');
      var h = document.createElement('h3'); h.textContent = title; c.appendChild(h);
      var p = document.createElement('p'); p.textContent = text; c.appendChild(p);
      if (meta)  { var pm = document.createElement('p'); pm.className = 'muted'; pm.textContent = meta; c.appendChild(pm); }
      if (examples && examples.length) {
        var ex = document.createElement('div'); ex.className = 'svc-examples';
        var lab = document.createElement('span'); lab.className = 'svc-ex-label'; lab.textContent = t('services.examples'); ex.appendChild(lab);
        var row = document.createElement('div'); row.className = 'svc-ex-row';
        examples.forEach(function (cw) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'svc-ex';
          var name = pick(cw.title) || catLabel(cw.cat);
          b.setAttribute('aria-label', name); b.title = name;
          var im = document.createElement('img'); im.src = 'images/portfolio/' + cw.file; im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
          b.appendChild(im);
          b.addEventListener('click', function () {
            var w = works.filter(function (x) { return x.id === cw.id; })[0];
            if (w) openLightbox(w);
          });
          row.appendChild(b);
        });
        ex.appendChild(row); c.appendChild(ex);
      }
      if (price) { var pp = document.createElement('p'); pp.className = 'price'; pp.textContent = price; c.appendChild(pp); }
      if (ctaText) {
        var a = document.createElement('a');
        a.className = 'btn btn-outline'; a.href = '#contact'; a.textContent = ctaText;
        a.addEventListener('click', function () { prefillInquiry(title); });
        c.appendChild(a);
      }
      box.appendChild(c);
    }
    // Neu: Leistungen aus data/content.js (vom Admin gepflegt)
    if (CONTENT && CONTENT.services && CONTENT.services.length) {
      var groups = (CONTENT.serviceCategories || []).filter(function (g) {
        return CONTENT.services.some(function (s) { return s.cat === g.id; });
      });
      var byId = {};
      (CONTENT.works || []).forEach(function (w) { byId[w.id] = w; });
      if (svcFilter !== 'all' && !groups.some(function (g) { return g.id === svcFilter; })) svcFilter = 'all';
      function draw(s) {
        var ex = (s.examples || []).map(function (id) { return byId[id]; }).filter(Boolean);
        card(pick(s.title), pick(s.text),
             pick(s.meta) || (s.style === 'idea' ? '' : t('services.meta')),
             pick(s.price),
             s.inquiry === false ? '' : t('services.cta'),
             s.style === 'idea', ex);
      }
      function heading(txt) {
        var h = document.createElement('h3'); h.className = 'svc-group'; h.textContent = txt; box.appendChild(h);
      }
      if (groups.length && fbox) {
        ['all'].concat(groups.map(function (g) { return g.id; })).forEach(function (id) {
          var b = document.createElement('button'); b.type = 'button';
          var g = groups.filter(function (x) { return x.id === id; })[0];
          b.textContent = id === 'all' ? t('portfolio.all') : (pick(g.label) || id);
          b.setAttribute('aria-pressed', String(svcFilter === id));
          b.addEventListener('click', function () { svcFilter = id; buildServices(); });
          fbox.appendChild(b);
        });
        fbox.hidden = false;
      }
      if (!groups.length) { CONTENT.services.forEach(draw); return; }
      if (svcFilter !== 'all') {
        CONTENT.services.filter(function (s) { return s.cat === svcFilter; }).forEach(draw);
        return;
      }
      // "Alle": nach Gruppen geordnet, mit Zwischenüberschrift
      groups.forEach(function (g) {
        var list = CONTENT.services.filter(function (s) { return s.cat === g.id; });
        if (!list.length) return;
        heading(pick(g.label) || g.id); list.forEach(draw);
      });
      var rest = CONTENT.services.filter(function (s) { return !groups.some(function (g) { return g.id === s.cat; }); });
      if (rest.length) { heading(t('services.other')); rest.forEach(draw); }
      return;
    }
    for (var n = 1; has('services.p' + n + '.title'); n++) {
      var k = 'services.p' + n + '.';
      card(t(k + 'title'), t(k + 'text'),
           has(k + 'meta')  ? t(k + 'meta')  : t('services.meta'),
           has(k + 'price') ? t(k + 'price') : t('services.price'));
    }
    if (has('services.idea.title')) {
      card(t('services.idea.title'), t('services.idea.text'), '', '', t('services.idea.cta'), true);
    }
  }

  function fillLightbox(w) {
    var title = captionFor(w);
    var desc = descriptionFor(w);
    var cat = catLabel(w.cat);
    // Mit Titel: Kategorie klein darüber. Ohne Titel: die Kategorie ist der Titel.
    document.getElementById('lb-cat').textContent = title ? cat : '';
    document.getElementById('lb-cat').hidden = !title;
    document.getElementById('lb-title').textContent = title || cat;
    var box = document.getElementById('lb-caption');
    renderRich(box, desc || '');
    box.hidden = !desc;
    document.getElementById('lb-img').alt = title || cat;

    // Icon-Zeile "Dieses Werk auch auf:" (config.js: links)
    var L = (SITE.links && SITE.links[w.id]) || {};
    var icons = document.getElementById('lb-links-icons');
    icons.textContent = '';
    Object.keys(L).forEach(function (key) {
      if (isHttp(L[key])) icons.appendChild(makeIconLink(key, L[key]));
    });
    document.getElementById('lb-links').hidden = !icons.children.length;
    document.getElementById('lb-links-label').textContent = t('lightbox.seeon');

    // Knopf "Anfrage zu diesem Werk"
    var inq = document.getElementById('lb-inquire');
    inq.textContent = t('lightbox.inquire');
    inq.hidden = w.inquiry === false;
  }

  // --- Mehrere Bilder pro Werk: illustration-01-2, -3 ... werden im Hintergrund gesucht ---
  function loadExtras(w) {
    if (w.extrasPromise) return w.extrasPromise;
    w.images = [w.url];
    w.extrasPromise = (async function () {
      var max = SITE.maxExtras > 0 ? SITE.maxExtras : 9;
      for (var n = 2; n <= max + 1; n++) {
        var u = await findImage('images/portfolio/' + w.id + '-' + n);
        if (!u) break;
        w.images.push(u);
      }
      if (w.badge && w.images.length > 1) {
        w.badge.textContent = '1/' + w.images.length;
        w.badge.hidden = false;
      }
      return w.images;
    })();
    return w.extrasPromise;
  }

  var imgIndex = 0;

  function setZoom(on) {
    var stage = document.getElementById('lb-stage');
    stage.classList.toggle('zoomed', on);
    if (!on) { stage.scrollLeft = 0; stage.scrollTop = 0; }
  }

  // Zeigt Bild Nummer i (0 = erstes) und markiert den passenden Punkt
  function showImage(i) {
    if (!openWork) return;
    var list = openWork.images || [openWork.url];
    imgIndex = (i + list.length) % list.length;
    setZoom(false);
    document.getElementById('lb-img').src = list[imgIndex];
    document.querySelectorAll('#lb-dots button').forEach(function (d, n) {
      d.setAttribute('aria-current', String(n === imgIndex));
    });
  }

  // Pfeile und Punkte nur bei mehreren Bildern
  function buildMedia(w) {
    var list = w.images || [w.url];
    var many = list.length > 1;
    document.getElementById('lb-prev').hidden = !many;
    document.getElementById('lb-next').hidden = !many;
    var dots = document.getElementById('lb-dots');
    dots.hidden = !many;
    dots.textContent = '';
    if (many) list.forEach(function (u, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (n + 1) + ' / ' + list.length);
      b.addEventListener('click', function () { showImage(n); });
      dots.appendChild(b);
    });
    showImage(Math.min(imgIndex, list.length - 1));
  }

  function openLightbox(w) {
    var box = document.getElementById('lightbox');
    openWork = w;
    imgIndex = 0;
    fillLightbox(w);
    buildMedia(w);                                   // sofort das Titelbild
    loadExtras(w).then(function () {                 // Zusatzbilder, falls vorhanden
      if (openWork === w) buildMedia(w);
    });
    document.documentElement.classList.add('lb-open');  // Seite hinter dem Bild sperren
    if (box.showModal) box.showModal();
    document.getElementById('lb-stage').scrollTop = 0;
    box.scrollTop = 0;
  }

  // Zoom per Klick, Pfeile, Tastatur und Wischen in der Grossansicht
  function setupLightboxControls(box) {
    var stage = document.getElementById('lb-stage');
    var img = document.getElementById('lb-img');

    // Tippen auf den dunklen Bereich neben dem Bild schliesst die Grossansicht
    stage.addEventListener('click', function (e) {
      if (e.target === stage && !stage.classList.contains('zoomed')) box.close();
    });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });

    // Klick aufs Bild: heranzoomen (an der Klickstelle), nochmal klicken: zurück
    img.addEventListener('click', function (e) {
      if (stage.classList.contains('zoomed')) { setZoom(false); return; }
      var r = img.getBoundingClientRect();
      var fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      setZoom(true);
      stage.scrollLeft = fx * img.offsetWidth  - stage.clientWidth  / 2;
      stage.scrollTop  = fy * img.offsetHeight - stage.clientHeight / 2;
    });

    document.getElementById('lb-prev').addEventListener('click', function () { showImage(imgIndex - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { showImage(imgIndex + 1); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  showImage(imgIndex - 1);
      if (e.key === 'ArrowRight') showImage(imgIndex + 1);
    });

    // Wischen zwischen Bildern (nur wenn nicht gezoomt)
    var sx = 0, sy = 0;
    stage.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (stage.classList.contains('zoomed') || !openWork) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showImage(imgIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* =================================================================
     3) KLEINKRAM
     ================================================================= */
  function setupMisc() {
    // Footer-Jahreszahl
    document.getElementById('year').textContent = new Date().getFullYear();

    // Formular-Adresse aus config.js
    document.getElementById('contact-form').action = SITE.formEndpoint;

    // E-Mail-Link
    var mail = document.getElementById('mail-link');
    mail.href = 'mailto:' + SITE.email;
    mail.textContent = SITE.email;

    // Social-Icons unter dem Manga-Text (config.js: mangaSocials)
    var ms = document.getElementById('manga-socials');
    (SITE.mangaSocials || []).forEach(function (key) {
      if (isHttp(SITE.social[key])) ms.appendChild(makeIconLink(key, SITE.social[key]));
    });
    ms.hidden = !ms.children.length;

    // Burger-Menü (Tablet/Handy)
    var burger = document.getElementById('burger');
    var header = document.querySelector('.site-header');
    function setMenu(open) {
      header.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    }
    burger.addEventListener('click', function () { setMenu(!header.classList.contains('nav-open')); });
    document.querySelectorAll('.main-nav a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    document.addEventListener('click', function (e) { if (!header.contains(e.target)) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024) setMenu(false); });

    // Footer-Links zu den Profilen, mit Icon aus images/icons/<name>.svg.
    // Einträge ohne Adresse in config.js werden übersprungen.
    var nav = document.getElementById('social');
    Object.keys(SITE.social).forEach(function (key) {
      var url = SITE.social[key];
      if (!url) return;
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      var icon = document.createElement('img');
      icon.src = 'images/icons/' + key + '.svg';
      icon.alt = ''; icon.width = 24; icon.height = 24;
      a.appendChild(icon);
      a.appendChild(document.createTextNode(SOCIAL_NAMES[key] || key));
      nav.appendChild(a);
    });

    // Shop-Eintrag im Menü: nur sichtbar, wenn shopUrl in config.js gesetzt ist
    var shop = document.getElementById('nav-shop');
    if (SITE.shopUrl) {
      shop.href = SITE.shopUrl; shop.target = '_blank'; shop.rel = 'noopener';
      shop.hidden = false;
    }

    // Lightbox schliessen: Knopf oder Klick neben das Bild
    var box = document.getElementById('lightbox');
    box.addEventListener('close', function () {
      openWork = null;
      document.documentElement.classList.remove('lb-open');   // Seite darf wieder scrollen
    });
    document.getElementById('lb-close').addEventListener('click', function () { box.close(); });
    document.getElementById('lb-close2').addEventListener('click', function () { box.close(); });
    setupLightboxControls(box);
    document.getElementById('lb-inquire').addEventListener('click', function () {
      var w = openWork;
      var subject = w ? (captionFor(w) || catLabel(w.cat)) : '';
      box.close();
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
      prefillInquiry(subject);
    });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });

    // Sprachknöpfe
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.addEventListener('click', function () { applyLanguage(b.dataset.lang); });
    });
  }

  /* =================================================================
     START
     ================================================================= */
  setupMisc();
  applyLanguage(pickLanguage());   // zuerst die Texte (schnell) ...
  loadSlots();                     // ... dann die Bilder (laden nach und nach)
  loadManga();
  loadPortfolio();
})();

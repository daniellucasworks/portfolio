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
    if (has('cat.' + cat)) return t('cat.' + cat);
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  // Eingebaute Texte für die Blätterleiste (falls sie in translations.js fehlen)
  var UI = {
    de: { prev: 'Vorherige Seite', next: 'Nächste Seite', page: 'Seite {n} von {total}' },
    fr: { prev: 'Page précédente', next: 'Page suivante',  page: 'Page {n} sur {total}' },
    en: { prev: 'Previous page',   next: 'Next page',       page: 'Page {n} of {total}' }
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
      el.textContent = t(el.dataset.i18n);
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
      var url = await findImage('images/' + name);
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
    for (var i = 1; i <= SITE.maxManga; i++) {
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

    refreshGalleryTexts();
    setFilter('all');
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

  function fillLightbox(w) {
    var title = captionFor(w);
    var desc = descriptionFor(w);
    var cat = catLabel(w.cat);
    // Mit Titel: Kategorie klein darüber. Ohne Titel: die Kategorie ist der Titel.
    document.getElementById('lb-cat').textContent = title ? cat : '';
    document.getElementById('lb-cat').hidden = !title;
    document.getElementById('lb-title').textContent = title || cat;
    var p = document.getElementById('lb-caption');
    p.textContent = desc;
    p.hidden = !desc;
    document.getElementById('lb-img').alt = title || cat;
  }

  function openLightbox(w) {
    var box = document.getElementById('lightbox');
    openWork = w;
    document.getElementById('lb-img').src = w.url;
    fillLightbox(w);
    if (box.showModal) box.showModal();
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

    // Manga-Link zeigt auf Instagram
    var mangaLink = document.getElementById('manga-link');
    if (SITE.social.instagram) mangaLink.href = SITE.social.instagram; else mangaLink.hidden = true;

    // Footer-Links zu den Profilen, mit Icon aus images/icons/<name>.svg.
    // Einträge ohne Adresse in config.js werden übersprungen.
    var SOCIAL_NAMES = {
      instagram: 'Instagram', behance: 'Behance', deviantart: 'DeviantArt',
      artstation: 'ArtStation', etsy: 'Etsy', kofi: 'Ko-fi', patreon: 'Patreon',
      tiktok: 'TikTok', youtube: 'YouTube', pinterest: 'Pinterest', threads: 'Threads',
      facebook: 'Facebook', x: 'X', linkedin: 'LinkedIn', discord: 'Discord'
    };
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
    box.addEventListener('close', function () { openWork = null; });
    document.getElementById('lb-close').addEventListener('click', function () { box.close(); });
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

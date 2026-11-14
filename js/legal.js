/* =====================================================================
   legal.js  -  Sprache und Angaben für legal.html (Impressum / Datenschutz)
   - Zeigt nur den Textblock der gewählten Sprache (data-lang-block).
   - Setzt deine Angaben aus js/config.js (SITE.legal, SITE.email) ein.
   - Die Sprachwahl ist dieselbe wie auf der Hauptseite (localStorage 'dlw-lang').
   ===================================================================== */
(function () {
  var LANGS = ['de', 'fr', 'en'];

  function pickLanguage() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    try {
      var saved = localStorage.getItem('dlw-lang');
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (LANGS.indexOf(browser) !== -1) return browser;
    return SITE.defaultLang;
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-block]').forEach(function (b) {
      b.hidden = b.dataset.langBlock !== lang;
    });
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    var titles = { de: 'Impressum & Datenschutz', fr: 'Mentions légales & confidentialité', en: 'Legal notice & privacy' };
    document.title = titles[lang] + ' – Daniel Lucas Works';
    try { localStorage.setItem('dlw-lang', lang); } catch (e) {}
  }

  // Angaben einsetzen: <span data-legal="name"></span> usw.
  function fillData() {
    var L = SITE.legal || {};
    document.querySelectorAll('[data-legal]').forEach(function (el) {
      var key = el.dataset.legal;
      var val = key === 'email' ? SITE.email : L[key];
      if (val) { el.textContent = val; el.classList.remove('todo'); }
      else { el.textContent = '[ ' + key + ' ]'; el.classList.add('todo'); }
    });
    document.querySelectorAll('[data-legal-mail]').forEach(function (a) {
      a.href = 'mailto:' + SITE.email;
      a.textContent = SITE.email;
    });
    document.querySelectorAll('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  }

  fillData();
  apply(pickLanguage());
  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.dataset.lang); });
  });
})();

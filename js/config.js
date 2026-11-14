/* =====================================================================
   config.js  -  DEINE EINSTELLUNGEN
   Hier änderst du alles, was nicht Text ist: Links, Kategorien, Formular.
   Die Texte der Seite stehen in translations.js.
   ===================================================================== */

window.SITE = {

  /* Sprache, die gezeigt wird, wenn der Browser des Besuchers keine
     der drei Sprachen (de, fr, en) verwendet. */
  defaultLang: 'de',

  /* Deine E-Mail-Adresse (wird unter dem Formular als Link gezeigt). */
  email: 'contact@daniellucasworks.com',

  /* Adresse deines Formular-Dienstes.
     Bei Formspree: formspree.io -> neues Formular -> die URL hier einsetzen,
     sie sieht aus wie  https://formspree.io/f/abcdwxyz  */
  formEndpoint: 'https://formspree.io/f/mjywgyzo',


  /* ANGABEN FÜR IMPRESSUM / DATENSCHUTZ (Seite legal.html).
     Trage hier deine echten Daten ein. Sie erscheinen automatisch auf der Seite.
     Leer gelassene Felder zeigt die Seite als [ … ] an, damit du sie nicht vergisst. */
  legal: {
    name:    'Daniel Lucas',                 // dein vollständiger Name
    address: '',                             // Strasse und Nr., z. B. '12, rue Exemple'
    city:    '',                             // z. B. 'L-1234 Luxembourg'
    country: 'Luxembourg',
    phone:   ''                              // optional, darf leer bleiben
  },

  /* Deine Profile (erscheinen im Footer, mit Icon aus deiner Charta).
     Adresse eintragen = Icon erscheint. Leer lassen ('') = nichts wird gezeigt.
     Die Reihenfolge hier ist die Reihenfolge im Footer. */
  social: {
    instagram:  'https://www.instagram.com/daniellucasworks/',
    behance:    'https://www.behance.net/daniellucas09801',
    deviantart: 'https://www.deviantart.com/daniellucasworks',
    artstation: '',
    etsy:       '',
    kofi:       '',
    patreon:    '',
    tiktok:     '',
    youtube:    '',
    pinterest:  '',
    threads:    '',
    facebook:   '',
    x:          '',
    linkedin:   '',
    discord:    ''
  },

  /* SHOP: Adresse deines Shops (Etsy, Ko-fi, Gumroad, eigener Shop ...).
     Leer lassen = kein "Shop"-Eintrag im Menü.
     Sobald du hier eine Adresse einträgst, erscheint "Shop" im Menü. */
  shopUrl: '',

  /* Bildformate, die automatisch gesucht werden (in dieser Reihenfolge).
     Du kannst also hero.webp ODER hero.jpg ODER hero.png hochladen. */
  imageExtensions: ['webp', 'jpg', 'jpeg', 'png'],

  /* Kategorien des Portfolios.
     Jede Kategorie ist der ANFANG des Dateinamens in images/portfolio/
     Beispiel: illustration-01.jpg, illustration-02.jpg, charakter-01.jpg ...
     Eine neue Kategorie hinzufügen: hier eintragen UND in translations.js
     den Namen als  "cat.deinname"  in allen drei Sprachen ergänzen. */
  categories: ['illustration', 'charakter', 'branding', 'poster', 'gerahmte', 'sticker', 'portrait'],

  /* Wie viele Bilder pro Kategorie maximal gesucht werden. */
  /* Werke pro Seite im Portfolio (darüber erscheint die Blätterleiste). */
  perPage: 8,

  maxPerCategory: 40,

  /* Mehrere Bilder pro Werk (wie bei Instagram-Karussells):
     Lege zusätzliche Bilder mit  -2, -3, -4 ...  hinter den Namen:
       illustration-01.webp  (Titelbild im Raster)
       illustration-01-2.webp, illustration-01-3.webp  (weitere Bilder, z. B. Fortschritt)
     In der Grossansicht erscheinen Pfeile, Punkte und man kann wischen.
     Nummern ohne Lücke. Hier steht, wie viele Zusatzbilder maximal gesucht werden. */
  maxExtras: 9,

  /* Welche Profile unter dem Manga-Text als Icons erscheinen (Adressen aus "social"). */
  mangaSocials: ['instagram', 'behance', 'deviantart'],

  /* ADMIN (admin.html): Das Repository, in das der Admin speichert. */
  github: { owner: 'daniellucasworks', repo: 'portfolio', branch: '' },   // branch leer = Standard-Branch

  /* Für die Auto-Übersetzung im Admin (kostenloser Dienst MyMemory).
     Optional eine E-Mail eintragen = höheres Tageslimit. Leer lassen ist ok. */
  translateEmail: '',

  /* Wie viele Manga-Bilder (manga-01.jpg, manga-02.jpg ...) maximal. */
  maxManga: 6,

  /* true  = Wo ein Bild fehlt, steht ein Platzhalter mit dem erwarteten
             Dateinamen (praktisch, solange du die Seite aufbaust).
     false = Fehlende Bilder werden einfach nicht angezeigt (für die fertige Seite). */
  showPlaceholderHints: false,

  /* OPTIONAL: Titel unter den Portfolio-Bildern, pro Sprache.
     Der Schlüssel ist der Dateiname OHNE Endung. Ohne Eintrag = kein Titel.
     Beispiel:
       'illustration-01': { de: 'Kämpfer im Sturm', fr: 'Guerrier dans la tempête', en: 'Warrior in the storm' },
  */
  titles: {
     'illustration-01': { de: 'Böse Seelen absorbierender Gargoyle', fr: 'Gargouille absorbant les âmes maléfiques', en: 'Evil Soul absorbing Gargoyle' },
     'illustration-02': { de: 'Blutiger Werwolf', fr: 'Loup-garou sanglant', en: 'Bloody Werewolf' },
     'charakter-01': { de: 'Hitaro – Triggered', fr: 'Hitaro – Triggered', en: 'Hitaro – Triggered' },
     'charakter-02': { de: 'Landepose Spiderman', fr: '', en: '' },
     'charakter-03': { de: 'Mein Original Charakter (2014)', fr: '', en: '' },
     'charakter-04': { de: 'Mein Original Charakter 2026', fr: '', en: '' },
     'branding-01': { de: 'Afonso Mesquita Mara - Ostheopatin - Visiten Karte', fr: '', en: '' },
     'branding-02': { de: 'Real Constuction - v1 - Visiten Karte', fr: '', en: '' },
     'branding-03': { de: 'Real Constuction - v2 - Visiten Karte', fr: '', en: '' },
     'poster-01': { de: 'Shoto von MHA beim Power-up', fr: '', en: '' },
     'poster-02': { de: 'Fern von Frieren - Stolzepose', fr: '', en: '' },
     'gerahmte-01': { de: 'UV-Painting: Goku Super-Saiyajin', fr: 'Peinture UV : Goku Super Saiyan', en: 'UV Painting: Goku Super Saiyan' },
     'gerahmte-02': { de: 'DBS Managa cover', fr: '', en: '' },
     'gerahmte-03': { de: 'SSJ3 Goku Rosé', fr: '', en: '' },
     'gerahmte-04': { de: 'Weihnachts Sticht als „stainedglass effect“', fr: '', en: '' },
     'gerahmte-05': { de: 'Gabby und Pandy', fr: '', en: '' },
     'gerahmte-06': { de: 'Fröhlicher Cartoon Nicolaus', fr: '', en: '' },
     'sticker-01': { de: 'Handgemalte Pokémon-Sticker', fr: 'Stickers Pokémon peints à la main', en: 'Hand-Painted Pokémon Stickers' },
     'portrait-01': { de: 'Unsere Doggies ❤️', fr: 'Nos loulous ❤️', en: 'Our Doggos ❤️' },
  },
  /* OPTIONAL: Wo man dieses Werk ausserdem sehen kann. Erscheint als Icon-Zeile
     unter der Beschreibung in der Grossansicht (nur die Plattformen, die du einträgst).
     Gleicher Schlüssel wie bei titles. Beispiel:
       'illustration-01': {
         instagram:  'https://www.instagram.com/p/XXXX/',
         behance:    'https://www.behance.net/gallery/XXXX',
         deviantart: 'https://www.deviantart.com/daniellucasworks/art/XXXX'
       },
     Möglich sind alle Namen aus "social" (instagram, behance, deviantart, artstation, ...). */
  links: {
    // 'illustration-01': { instagram: '', behance: '', deviantart: '' },
  },

  /* Mehrere Absätze in einer Beschreibung: eine Leerzeile im Text = neuer Absatz.
     In Anführungszeichen schreibst du dafür \n\n, z. B.  de: 'Erster Absatz.\n\nZweiter Absatz.' */
  descriptions: {      // kurze Erklärung in der Grossansicht (Schlüssel wie bei titles)
    'illustration-01': {
      de: "Digitale Zeichnung in Clip Studio Paint, erstellt für den 49. Internationalen Illustrationswettbewerb, der von CSP organisiert wurde.",
      fr: "Dessin numérique réalisé dans Clip Studio Paint pour le 49e Concours international d'illustration organisé par CSP.",
      en: "Digital drawing in Clip Studio Paint made for the 49th International Illustration Contest organised by CSP."
    },
    'illustration-02': {
      de: "Ich arbeite gerade ein Buch mit 500 Zeichenanregungen (500 zufälligen Wörtern) durch. Das Wort, bei dem ich gelandet bin, war „Fangzähne“ – also habe ich beschlossen, die Fangzähne eines Werwolfs zu zeichnen, der direkt auf den Betrachter zuspringt! Ich wollte unbedingt, dass das Bild dynamisch und richtig cool wirkt.",
      fr: "Je travaille sur un livre qui propose 500 sujets de dessin (500 mots choisis au hasard). Je suis tombé sur le mot « crocs » ; j'ai donc décidé de dessiner les crocs d'un loup-garou en train de bondir droit vers celui qui regarde l'image ! Je voulais vraiment que cette réalisation soit dynamique et percutante.",
      en: "I'm working through a book with 500 drawing prompts (500 random words). The word I landed on was 'Fangs', so I decided to draw the fangs of a werewolf leaping right at the viewer! I really wanted this piece to look dynamic and badass."
    },
    'charakter-01': {
      de: "",
      fr: "",
      en: ""
    },
    'charakter-02': {
      de: "",
      fr: "",
      en: ""
    },
    'charakter-03': {
      de: "",
      fr: "",
      en: ""
    },
    'charakter-04': {
      de: "",
      fr: "",
      en: ""
    },
    'poster-01': {
      de: "",
      fr: "",
      en: ""
    },
    'poster-02': {
      de: "",
      fr: "",
      en: ""
    },
    'gerahmte-01': {
      de: "Handgemaltes UV-Gemälde von Goku als Super-Saiyajin, entstanden während eines gemeinsamen Workshops mit meiner Frau, organisiert von Social Club. Unter Schwarzlicht entfaltet das Artwork seine volle Leuchtkraft und lässt die goldene Aura intensiv erstrahlen.",
      fr: "Peinture UV réalisée à la main représentant Goku en Super Saiyan, créée lors d’un atelier auquel j’ai participé avec ma femme, organisé par Social Club. Sous lumière noire, l’œuvre révèle toute son intensité et fait briller son aura dorée.",
      en: "Hand-painted UV artwork of Goku as a Super Saiyan, created during a workshop I attended with my wife, organized by Social Club. Under blacklight, the piece reveals its full vibrancy and brings his golden aura to life."
    },
    'gerahmte-02': {
      de: "",
      fr: "",
      en: ""
    },
    'gerahmte-03': {
      de: "",
      fr: "",
      en: ""
    },
    'gerahmte-04': {
      de: "",
      fr: "",
      en: ""
    },
    'gerahmte-05': {
      de: "",
      fr: "",
      en: ""
    },
    'gerahmte-06': {
      de: "",
      fr: "",
      en: ""
    },
    'sticker-01': {
      de: "Individuelles, handgemaltes Pokémon-Sticker-Set als Geschenk für meinen Cousin – inklusive eines großen Stickers, der nun seine Xbox Series X ziert.",
      fr: "Set personnalisé de stickers Pokémon peints à la main créé pour mon cousin, dont un grand format qui décore désormais sa Xbox Series X.",
      en: "Custom hand-painted Pokémon sticker set made for my cousin, featuring a large sticker that now customizes his Xbox Series X."
    },
    'portrait-01': {
      de: "Eine liebevolle Erinnerung: Handgemaltes Porträt unserer verstorbenen Hunde im Format 13 × 18 cm.",
      fr: "Un hommage rempli d’émotion : portrait peint à la main de nos chiens disparus, au format 13 × 18 cm.",
      en: "A heartfelt tribute: Hand-painted portrait of our late dogs in a 13 × 18 cm format."
    },
 },
};

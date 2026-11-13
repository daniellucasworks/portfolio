/* =====================================================================
   translations.js  -  ALLE TEXTE DER SEITE in Deutsch, Französisch, Englisch

   So funktioniert es:
   - Im HTML steht z. B.  <h1 data-i18n="hero.title"></h1>
   - Das Skript sucht den Schlüssel "hero.title" in der gewählten Sprache
     und schreibt den Text in das Element.
   - Du änderst einen Text also NUR HIER, nicht im HTML.

   Wichtig:
   - Jeder Schlüssel muss in allen drei Sprachen vorhanden sein.
   - Text in [eckigen Klammern] sind Platzhalter, die du ersetzen musst.
   - Alle Texte sind Entwürfe. Passe sie an deine Worte an.
   ===================================================================== */

window.TRANSLATIONS = {

  /* ----------------------------- DEUTSCH ----------------------------- */
  de: {
    'meta.title':       'Daniel Lucas Works – Illustration, Charaktere, Branding',
    'meta.description': 'Illustration, Anime- und Manga-Charaktere, Poster und kleines Branding aus Luxemburg.',

    'nav.portfolio': 'Portfolio',
    'nav.manga':     'Manga',
    'nav.services':  'Leistungen',
    'nav.about':     'Über mich',
    'nav.shop':      'Shop',
    'nav.contact':   'Kontakt',

    'hero.eyebrow': 'Illustration · Charaktere · Branding',
    'hero.title':   'Illustrationen mit Charakter.',
    'hero.text':    'Anime- und Manga-Illustration, Poster und kleines Branding. Aus Luxemburg, für Kunden in ganz Europa.',
    'hero.cta':     'Anfrage senden',
    'hero.cta2':    'Portfolio ansehen',
    'hero.alt':     'Illustration von Daniel Lucas',

    'portfolio.title':  'Ausgewählte Arbeiten',
    'portfolio.all':    'Alle',
    'cat.illustration': 'Illustration',
    'cat.charakter':    'Charaktere',
    'cat.branding':     'Branding',
    'cat.poster':       'Poster',
    'cat.gerahmte':     'Gerahmte',
    'cat.sticker':      'Sticker',
    'cat.portrait':     'Portraits',


    'services.title': 'Leistungen',
    'services.intro': 'Drei Pakete mit festem Preis. Alles Weitere auf Anfrage.',
    'services.p1.title': 'Charakter-Portrait',
    'services.p1.text':  'Illustration deiner Figur oder deines Porträts im Anime- oder Manga-Stil, digital geliefert.',
    'services.p2.title': 'Poster A3',
    'services.p2.text':  'Illustriertes Poster für Event, Verein oder Wohnzimmer, druckfertig vorbereitet.',
    'services.p3.title': 'Mini-Branding',
    'services.p3.text':  'Logo-Feinschliff, Visitenkarte, E-Mail-Signatur und kurze Charta für kleine Betriebe.',
    'services.meta':     'Lieferzeit & Korrekturrunden nach Absprache',
    'services.price':    'Kostenlos (zzgl. Materialkosten · zeitlich begrenzt)',

    'manga.eyebrow': 'Eigenes Projekt',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'Um seinem Großvater zu beweisen, dass er bereit für seine wahre Bestimmung ist, stellt sich ein junger Kämpfer einem gnadenlosen Kampfkunst-Turnier. Doch im Ring wartet weit mehr als nur der Kampf um den Sieg. Das Storyboard ist fertig, die Seiten entstehen gerade in Clip Studio Paint.',
    'manga.link':    'Fortschritt auf Instagram verfolgen →',

    'about.eyebrow': 'Über mich',
    'about.title':   'Grafikdesigner, der jeden Tag zeichnet.',
    'about.text':    'Bachelor in Grafikdesign, zuhause in Luxemburg. Seit dem 18. Dezember 2025 zeichne ich jeden Tag. [Zwei bis drei Sätze mehr über dich.]',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Konschtfestival Affichen-Concours',
    'about.alt':     'Porträt von Daniel Lucas',

    'contact.title':   'Dein Projekt?',
    'contact.text':    'Erzähl mir kurz, was du brauchst. Ich antworte in der Regel innerhalb von [48 Stunden].',
    'contact.name':    'Name',
    'contact.email':   'E-Mail',
    'contact.type':    'Projektart',
    'contact.type.ph': 'Portrait, Poster, Branding …',
    'contact.message': 'Nachricht',
    'contact.send':    'Anfrage senden',
    'contact.or':      'Oder direkt per E-Mail:',

    'footer.rights':  'Alle Rechte vorbehalten.',
    'lightbox.close': 'Schliessen',
    'placeholder.hint': 'Bild fehlt:'
  },

  /* ---------------------------- FRANÇAIS ----------------------------- */
  fr: {
    'meta.title':       'Daniel Lucas Works – Illustration, personnages, branding',
    'meta.description': 'Illustration, personnages anime et manga, affiches et petit branding, depuis le Luxembourg.',

    'nav.portfolio': 'Portfolio',
    'nav.manga':     'Manga',
    'nav.services':  'Services',
    'nav.about':     'À propos',
    'nav.shop':      'Boutique',
    'nav.contact':   'Contact',

    'hero.eyebrow': 'Illustration · Personnages · Branding',
    'hero.title':   'Des illustrations qui ont du caractère.',
    'hero.text':    'Illustration anime et manga, affiches et petit branding. Depuis le Luxembourg, pour des clients partout en Europe.',
    'hero.cta':     'Envoyer une demande',
    'hero.cta2':    'Voir le portfolio',
    'hero.alt':     'Illustration de Daniel Lucas',

    'portfolio.title': 'Travaux choisis',
    'portfolio.all':   'Tout',
    'cat.illustration': 'Illustration',
    'cat.charakter':    'Personnages',
    'cat.branding':     'Branding',
    'cat.poster':       'Affiches',
    'cat.gerahmte':     'Encadrées',
    'cat.sticker':      'Autocollants',
    'cat.portrait':     'Portraits',

    'services.title': 'Services',
    'services.intro': 'Trois formules à prix fixe. Le reste sur demande.',
    'services.p1.title': 'Portrait de personnage',
    'services.p1.text':  'Illustration de ton personnage ou de ton portrait en style anime ou manga, livrée en numérique.',
    'services.p2.title': 'Affiche A3',
    'services.p2.text':  'Affiche illustrée pour un événement, une association ou ton salon, préparée pour l’impression.',
    'services.p3.title': 'Mini-branding',
    'services.p3.text':  'Finition du logo, carte de visite, signature e-mail et courte charte pour petites entreprises.',
    'services.meta':     'Délai de livraison et révisions sur accord',
    'services.price':    'Gratuit (hors frais de matériel · offre limitée)',

    'manga.eyebrow': 'Projet personnel',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'Pour prouver à son grand-père qu’il est prêt à accomplir sa véritable destinée, un jeune combattant se lance dans un tournoi d’arts martiaux impitoyable. Mais sur le ring, l’enjeu dépasse de loin la simple victoire. Le storyboard est terminé, les pages sont en cours dans Clip Studio Paint.',
    'manga.link':    'Suivre l’avancement sur Instagram →',

    'about.eyebrow': 'À propos',
    'about.title':   'Graphiste, je dessine tous les jours.',
    'about.text':    'Bachelor en design graphique, installé au Luxembourg. Depuis le 18 décembre 2025, je dessine chaque jour. [Deux ou trois phrases de plus sur toi.]',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Concours d’affiches Konschtfestival',
    'about.alt':     'Portrait de Daniel Lucas',

    'contact.title':   'Ton projet ?',
    'contact.text':    'Dis-moi en quelques mots ce dont tu as besoin. Je réponds en général sous [48 heures].',
    'contact.name':    'Nom',
    'contact.email':   'E-mail',
    'contact.type':    'Type de projet',
    'contact.type.ph': 'Portrait, affiche, branding …',
    'contact.message': 'Message',
    'contact.send':    'Envoyer la demande',
    'contact.or':      'Ou directement par e-mail :',

    'footer.rights':  'Tous droits réservés.',
    'lightbox.close': 'Fermer',
    'placeholder.hint': 'Image manquante :'
  },

  /* ----------------------------- ENGLISH ----------------------------- */
  en: {
    'meta.title':       'Daniel Lucas Works – Illustration, characters, branding',
    'meta.description': 'Illustration, anime and manga characters, posters and small-scale branding from Luxembourg.',

    'nav.portfolio': 'Portfolio',
    'nav.manga':     'Manga',
    'nav.services':  'Services',
    'nav.about':     'About',
    'nav.shop':      'Shop',
    'nav.contact':   'Contact',

    'hero.eyebrow': 'Illustration · Characters · Branding',
    'hero.title':   'Illustration with character.',
    'hero.text':    'Anime and manga illustration, posters and small-scale branding. Based in Luxembourg, working with clients across Europe.',
    'hero.cta':     'Send a request',
    'hero.cta2':    'View portfolio',
    'hero.alt':     'Illustration by Daniel Lucas',

    'portfolio.title': 'Selected work',
    'portfolio.all':   'All',
    'cat.illustration': 'Illustration',
    'cat.charakter':    'Characters',
    'cat.branding':     'Branding',
    'cat.poster':       'Posters',
    'cat.gerahmte':     'Framed',
    'cat.sticker':      'Stickers',
    'cat.portrait':     'Portraits',

    'services.title': 'Services',
    'services.intro': 'Three packages at a fixed price. Anything else on request.',
    'services.p1.title': 'Character portrait',
    'services.p1.text':  'An illustration of your character or portrait in anime or manga style, delivered digitally.',
    'services.p2.title': 'A3 poster',
    'services.p2.text':  'An illustrated poster for an event, a club or your living room, prepared for print.',
    'services.p3.title': 'Mini branding',
    'services.p3.text':  'Logo polish, business card, email signature and a short style guide for small businesses.',
    'services.meta':     'Delivery time & revisions by arrangement',
    'services.price':    'Free (excl. material costs · limited time)',

    'manga.eyebrow': 'Personal project',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'To prove to his grandfather that he is ready to fulfill his true destiny, a young fighter enters a ruthless martial arts tournament. Yet inside the arena, far more is at stake than mere victory. The storyboard is finished and the pages are now taking shape in Clip Studio Paint.',
    'manga.link':    'Follow progress on Instagram →',

    'about.eyebrow': 'About',
    'about.title':   'A graphic designer who draws every day.',
    'about.text':    'Bachelor in graphic design, based in Luxembourg. I have drawn every single day since 18 December 2025. [Two or three more sentences about you.]',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Konschtfestival poster competition',
    'about.alt':     'Portrait of Daniel Lucas',

    'contact.title':   'Your project?',
    'contact.text':    'Tell me briefly what you need. I usually reply within [48 hours].',
    'contact.name':    'Name',
    'contact.email':   'Email',
    'contact.type':    'Project type',
    'contact.type.ph': 'Portrait, poster, branding …',
    'contact.message': 'Message',
    'contact.send':    'Send request',
    'contact.or':      'Or write directly:',

    'footer.rights':  'All rights reserved.',
    'lightbox.close': 'Close',
    'placeholder.hint': 'Image missing:'
  }
};

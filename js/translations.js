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
    'cat.gerahmte':     'Gerahmte Werke',
    'cat.sticker':      'Sticker',
    'cat.portrait':     'Porträts',


    'services.title': 'Leistungen',
    'services.intro': 'Das biete ich an. Ich bin vielseitig, vieles ist möglich. Alles Weitere auf Anfrage.',
    'services.p1.title': 'Charakter-Porträt',
    'services.p1.text':  'Illustration deiner Figur oder deines Porträts im Anime- oder Manga-Stil, digital geliefert.',
    'services.p2.title': 'Poster A3',
    'services.p2.text':  'Illustriertes Poster für Event, Verein oder Wohnzimmer, druckfertig vorbereitet.',
    'services.p3.title': 'Mini-Branding',
    'services.p3.text':  'Logo-Feinschliff, Visitenkarte, E-Mail-Signatur und kurze Charta für kleine Betriebe.',
    'services.meta':     'Lieferzeit & Korrekturrunden nach Absprache',
    'services.examples': 'Beispiele',
    'services.other':    'Weitere',
    'services.price':    'Kostenlos (zzgl. Materialkosten · zeitlich begrenzt)',
    'services.idea.title': 'Spontane Idee?',
    'services.idea.text':  'Du hast etwas im Kopf, das hier nicht steht? Ob Sticker, Cover, Tattoo-Vorlage oder etwas ganz Verrücktes: Überrasch mich, ich denke gern mit.',
    'services.idea.cta':   'Idee schicken →',

    'manga.eyebrow': 'Eigenes Projekt',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'Um seinem Großvater zu beweisen, dass er bereit für seine wahre Bestimmung ist, stellt sich ein junger Kämpfer einem gnadenlosen Kampfkunst-Turnier. Doch im Ring wartet weit mehr als nur der Kampf um den Sieg.\n\nDas Storyboard ist fertig, die Seiten entstehen gerade in Clip Studio Paint. Fortschritt auf meinen Socials verfolgen:',
    'manga.link':    'Fortschritt auf Instagram verfolgen →',

    'about.eyebrow': 'Über mich',
    'about.title':   'Grafikdesigner, der jeden Tag zeichnet.',
    'about.text':    'Bachelor in Grafikdesign, zu Hause in Luxemburg. Schon als Kind wollte ich eigene Charaktere erschaffen und Geschichten um sie herum bauen. Nach einer Pause während Studium und Jobsuche habe ich Ende Dezember 2025 wieder angefangen und seitdem jeden Tag gezeichnet. Gerade arbeite ich am ersten Kapitel meines eigenen Mangas, das bis Ende des Jahres fertig werden soll.',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Konschtfestival Affichen-Concours',
    'about.alt':     'Porträt von Daniel Lucas',

    'contact.title':   'Dein Projekt?',
    'contact.text':    'Erzähl mir kurz, was du brauchst. Ich antworte in der Regel innerhalb von 48 Stunden.',
    'contact.name':    'Name',
    'contact.email':   'E-Mail',
    'contact.type':    'Projektart',
    'contact.type.ph': 'Porträt, Poster, Branding …',
    'contact.message': 'Nachricht',
    'contact.message.ph': 'Ich wollte schon immer ein AMV mit meinem Lieblingssong und meinen eigenen Badass-Charakteren erstellen. Wie kann ich bei deinem Traumprojekt helfen?',
    'contact.send':    'Anfrage senden',
    'contact.or':      'Oder direkt per E-Mail:',

    'footer.rights':  'Alle Rechte vorbehalten.',
    'footer.legal':   'Impressum & Datenschutz',
    'lightbox.close': 'Schließen',
    'services.cta': 'Anfrage schicken',
    'lightbox.inquire': 'Anfrage zu diesem Werk',
    'lightbox.seeon': 'Dieses Werk auch auf:',
    'nav.menu': 'Menü',
    'portfolio.swipe': '‹ Wische nach links oder rechts zum Blättern ›',
    'placeholder.hint': 'Bild fehlt:'
  },

  /* ---------------------------- FRANÇAIS ----------------------------- */
  fr: {
    'meta.title':       'Daniel Lucas Works – Illustration, personnages, branding',
    'meta.description': 'Illustration, personnages d’anime et de manga, affiches et petit branding, depuis le Luxembourg.',

    'nav.portfolio': 'Portfolio',
    'nav.manga':     'Manga',
    'nav.services':  'Services',
    'nav.about':     'À propos',
    'nav.shop':      'Boutique',
    'nav.contact':   'Contact',

    'hero.eyebrow': 'Illustration · Personnages · Branding',
    'hero.title':   'Des illustrations qui ont du caractère.',
    'hero.text':    'Illustration de style anime et manga, affiches et petit branding. Depuis le Luxembourg, pour des clients partout en Europe.',
    'hero.cta':     'Envoyer une demande',
    'hero.cta2':    'Voir le portfolio',
    'hero.alt':     'Illustration de Daniel Lucas',

    'portfolio.title': 'Travaux choisis',
    'portfolio.all':   'Tout',
    'cat.illustration': 'Illustration',
    'cat.charakter':    'Personnages',
    'cat.branding':     'Branding',
    'cat.poster':       'Affiches',
    'cat.gerahmte':     'Œuvres encadrées',
    'cat.sticker':      'Autocollants',
    'cat.portrait':     'Portraits',

    'services.title': 'Services',
    'services.intro': 'Voici ce que je propose. Je suis polyvalent, beaucoup de choses sont possibles. Le reste sur demande.',
    'services.p1.title': 'Portrait de personnage',
    'services.p1.text':  'Illustration de ton personnage ou de ton portrait en style anime ou manga, livrée au format numérique.',
    'services.p2.title': 'Affiche A3',
    'services.p2.text':  'Affiche illustrée pour un événement, une association ou ton salon, préparée pour l’impression.',
    'services.p3.title': 'Mini-branding',
    'services.p3.text':  'Finition du logo, carte de visite, signature e-mail et courte charte pour les petites entreprises.',
    'services.meta':     'Délai de livraison et révisions à convenir',
    'services.examples': 'Exemples',
    'services.other':    'Autres',
    'services.price':    'Gratuit (hors frais de matériel · offre limitée)',
    'services.idea.title': 'Une idée spontanée ?',
    'services.idea.text':  'Tu as quelque chose en tête qui n’est pas listé ici ? Sticker, couverture, modèle de tatouage ou projet complètement fou : surprends-moi, j’aime réfléchir avec toi.',
    'services.idea.cta':   'Envoyer une idée →',

    'manga.eyebrow': 'Projet personnel',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'Pour prouver à son grand-père qu’il est prêt à accomplir sa véritable destinée, un jeune combattant se lance dans un tournoi d’arts martiaux impitoyable. Mais sur le ring, l’enjeu dépasse de loin la simple victoire.\n\nLe storyboard est terminé, les pages sont en cours dans Clip Studio Paint. Suis l’avancement sur mes réseaux :',
    'manga.link':    'Suivre l’avancement sur Instagram →',

    'about.eyebrow': 'À propos',
    'about.title':   'Graphiste, je dessine tous les jours.',
    'about.text':    'Bachelor en design graphique, installé au Luxembourg. Enfant déjà, je voulais créer mes propres personnages et bâtir des histoires autour d’eux. Après une pause pendant mes études et ma recherche d’emploi, j’ai repris fin décembre 2025 et je dessine depuis chaque jour. Je travaille actuellement sur le premier chapitre de mon propre manga, qui doit être terminé d’ici la fin de l’année.',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Concours d’affiches Konschtfestival',
    'about.alt':     'Portrait de Daniel Lucas',

    'contact.title':   'Ton projet ?',
    'contact.text':    'Dis-moi en quelques mots ce dont tu as besoin. Je réponds en général sous 48 heures.',
    'contact.name':    'Nom',
    'contact.email':   'E-mail',
    'contact.type':    'Type de projet',
    'contact.type.ph': 'Portrait, affiche, branding …',
    'contact.message': 'Message',
    'contact.message.ph': 'J’ai toujours rêvé de réaliser un AMV avec ma chanson préférée et mes propres personnages badass. Comment puis-je t’aider pour ton projet de rêve ?',
    'contact.send':    'Envoyer la demande',
    'contact.or':      'Ou directement par e-mail :',

    'footer.rights':  'Tous droits réservés.',
    'footer.legal':   'Mentions légales & confidentialité',
    'lightbox.close': 'Fermer',
    'services.cta': 'Envoyer une demande',
    'lightbox.inquire': 'Demande pour cette œuvre',
    'lightbox.seeon': 'Cette œuvre aussi sur :',
    'nav.menu': 'Menu',
    'portfolio.swipe': '‹ Glisse vers la gauche ou la droite pour changer de page ›',
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
    'cat.gerahmte':     'Framed works',
    'cat.sticker':      'Stickers',
    'cat.portrait':     'Portraits',

    'services.title': 'Services',
    'services.intro': 'Here is what I offer. I am versatile, so a lot is possible. Anything else on request.',
    'services.p1.title': 'Character portrait',
    'services.p1.text':  'An illustration of your character or portrait in anime or manga style, delivered digitally.',
    'services.p2.title': 'A3 poster',
    'services.p2.text':  'An illustrated poster for an event, a club or your living room, prepared for print.',
    'services.p3.title': 'Mini branding',
    'services.p3.text':  'Logo polish, business card, email signature and a short style guide for small businesses.',
    'services.meta':     'Delivery time & revisions by arrangement',
    'services.examples': 'Examples',
    'services.other':    'More',
    'services.price':    'Free (excluding material costs · limited time)',
    'services.idea.title': 'A spontaneous idea?',
    'services.idea.text':  'Got something in mind that is not listed here? A sticker, a cover, a tattoo design or something wild: surprise me, I love thinking it through with you.',
    'services.idea.cta':   'Send an idea →',

    'manga.eyebrow': 'Personal project',
    'manga.title':   'Kôngo no Kokoro',
    'manga.text':    'To prove to his grandfather that he is ready to fulfil his true destiny, a young fighter enters a ruthless martial arts tournament. Yet inside the arena, far more is at stake than mere victory.\n\nThe storyboard is finished and the pages are now taking shape in Clip Studio Paint. Follow the progress on my socials:',
    'manga.link':    'Follow progress on Instagram →',

    'about.eyebrow': 'About',
    'about.title':   'A graphic designer who draws every day.',
    'about.text':    'Bachelor’s degree in graphic design, based in Luxembourg. Even as a child, I wanted to create my own characters and build stories around them. After a break during university and my job search, I started drawing again at the end of December 2025 and have drawn every day since. I am currently working on the first chapter of my own manga, which I want to finish by the end of this year.',
    'about.badge1':  '49th International Illustration Contest',
    'about.badge2':  'Konschtfestival poster competition',
    'about.alt':     'Portrait of Daniel Lucas',

    'contact.title':   'Your project?',
    'contact.text':    'Tell me briefly what you need. I usually reply within 48 hours.',
    'contact.name':    'Name',
    'contact.email':   'Email',
    'contact.type':    'Project type',
    'contact.type.ph': 'Portrait, poster, branding …',
    'contact.message': 'Message',
    'contact.message.ph': 'I have always wanted to make an AMV with my favourite song and my own badass characters. How can I help with your dream project?',
    'contact.send':    'Send request',
    'contact.or':      'Or email me directly:',

    'footer.rights':  'All rights reserved.',
    'footer.legal':   'Legal notice & privacy',
    'lightbox.close': 'Close',
    'services.cta': 'Send an inquiry',
    'lightbox.inquire': 'Inquire about this work',
    'lightbox.seeon': 'Also see this work on:',
    'nav.menu': 'Menu',
    'portfolio.swipe': '‹ Swipe left or right to change page ›',
    'placeholder.hint': 'Image missing:'
  }
};

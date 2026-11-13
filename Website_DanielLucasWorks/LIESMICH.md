# Daniel Lucas Works – Website (DE / FR / EN)

Eine einfache Seite aus HTML, CSS und etwas JavaScript. Kein Framework, kein Installieren,
kein Server. **Zum Ausprobieren `index.html` doppelklicken.**

## Was liegt wo?

| Datei / Ordner        | Wofür                                                          |
|-----------------------|----------------------------------------------------------------|
| `index.html`          | Aufbau der Seite (keine Texte darin)                           |
| `js/translations.js`  | **Alle Texte** in DE, FR, EN                                   |
| `js/config.js`        | **Einstellungen**: E-Mail, Formular, Links, Kategorien, Titel  |
| `js/main.js`          | Das Skript (Sprache, Bilder, Filter). Meist musst du es nie anfassen |
| `css/style.css`       | Aussehen, Farben und Schriften deiner Charta                   |
| `images/`             | Deine Bilder (siehe unten)                                     |
| `fonts/`              | Schriften Righteous und DM Sans (siehe unten)                  |

## Bilder: einfach richtig benennen

Du legst die Datei in den richtigen Ordner mit dem richtigen Namen. Das war's.
Erlaubte Endungen: `.webp`, `.jpg`, `.jpeg`, `.png`.

| Wo es erscheint | Dateiname                                   | Ordner             |
|-----------------|---------------------------------------------|--------------------|
| Startbild       | `hero.jpg`                                  | `images/`          |
| Über mich       | `about.jpg`                                 | `images/`          |
| Manga           | `manga-01.jpg`, `manga-02.jpg` … (bis 6)    | `images/`          |
| Portfolio       | `illustration-01.jpg`, `illustration-02.jpg` … | `images/portfolio/` |
|                 | `charakter-01.jpg` …, `branding-01.jpg` …, `poster-01.jpg` … | `images/portfolio/` |

Regeln:
- **Nummern ohne Lücke** (01, 02, 03 …). Fehlt `poster-02.jpg`, werden `poster-03.jpg` und alle danach nicht gezeigt.
- Pro Kategorie zählst du neu bei 01 an.
- Die Filterknöpfe (Alle, Illustration, …) erscheinen von selbst, sobald eine Kategorie Bilder hat.
- **Eigene Kategorie?** In `js/config.js` bei `categories` eintragen, und in `js/translations.js` einen Namen `'cat.deinname'` in allen drei Sprachen ergänzen.
- **Titel unter einem Bild?** In `js/config.js` bei `titles` (Beispiel steht dort). Ohne Eintrag gibt es keinen Titel.
- Solange Bilder fehlen, zeigt die Seite Platzhalter mit dem erwarteten Dateinamen. Für die fertige Seite in `config.js` `showPlaceholderHints: false` setzen.

Bildgrösse: etwa **1600 px an der langen Seite**, als WebP oder JPG, möglichst unter 400 KB pro Bild.
Die Seite lädt alle Portfolio-Bilder gleich beim Start, grosse Dateien machen sie langsam.

## Texte ändern

Alles in `js/translations.js`. Text in `[eckigen Klammern]` sind Platzhalter (Preise, Lieferzeit, Manga-Titel …).
Alle Texte sind **Entwürfe**. Pass sie an deine Worte an.

## Sprachen

- Drei Knöpfe oben rechts (DE / FR / EN). Die Wahl wird gemerkt.
- Beim ersten Besuch nimmt die Seite die Browsersprache, sonst `defaultLang` aus `config.js`.
- Direkt verlinken: `deineseite.lu/?lang=fr`.
- **Vierte Sprache?** In `translations.js` einen ganzen Block kopieren (z. B. `lb: { … }`), in `main.js` bei `LANGS` ergänzen und im HTML einen Knopf `<button data-lang="lb">LB</button>` hinzufügen.
- Hinweis zu Google: Die Texte werden per JavaScript eingesetzt. Für ein Portfolio reicht das. Wenn du später in jeder Sprache einzeln gefunden werden willst, ist die Alternative eine Kopie der Seite pro Sprache (`/de/`, `/fr/`, `/en/`). Das ist mehr Pflegeaufwand.

## Schriften (Righteous + DM Sans)

Lade die Dateien herunter und lege sie in `fonts/` mit **genau diesen Namen**:
- `Righteous-Regular.woff2`
- `DMSans-Variable.woff2`

Quelle: fonts.google.com (Download) oder fontsource.org. Die Seite lädt die Schriften so von deinem
eigenen Server und nicht von Google (besser für den Datenschutz). Solange die Dateien fehlen, nimmt der
Browser eine Ersatzschrift. Alles funktioniert trotzdem.

## Portfolio: Seiten, Titel und Beschreibung

- **Blättern:** Ab mehr als 8 Werken (`perPage` in `js/config.js`) erscheint unter dem Raster eine Leiste mit Pfeilen
  und der Seitenzahl („Seite 1 von 3"). Beim Filtern zählt die Leiste nur die Werke der gewählten Kategorie.
- **Titel und Beschreibung:** In `js/config.js` bei `titles` (Titel unter dem Bild und in der Grossansicht) und
  `descriptions` (kurze Erklärung in der Grossansicht). Schlüssel = Dateiname ohne Endung, z. B. `illustration-01`.
  Ohne Titel zeigt die Grossansicht den Namen der Kategorie, ohne Beschreibung nur den Titel.
- **Eigene Kategorien:** In `categories` eintragen. Der Name im Menü kommt aus `js/translations.js` (`'cat.fanart'` usw.).
  Fehlt er dort, zeigt die Seite einfach den Dateinamen-Anfang mit grossem Anfangsbuchstaben („Fanart").

## Deko-Motive auf den dunklen Abschnitten

Die beiden Linienmotive liegen in `images/deco/` (`deco-1.webp`, `deco-2.webp`, weisse Linien auf durchsichtigem Grund)
und erscheinen abwechselnd hinter Startbereich (1), Leistungen (2) und Kontakt (1).
- **Stärke:** in `css/style.css` `--deco-opacity` ändern (`.25` = 25 %, `0` = aus, `1` = voll).
- **Anderes Motiv oder anderer Abschnitt:** im HTML hat der Abschnitt die Klasse `deco deco-a` (Motiv 1) oder `deco deco-b` (Motiv 2).
  Klasse entfernen = kein Motiv. Eigene Motive: Datei in `images/deco/` ersetzen (gleicher Name).

## Social Media und Shop

- Alle Profile trägst du in `js/config.js` bei `social` ein. Unterstützt sind Instagram, Behance, DeviantArt,
  ArtStation, Etsy, Ko-fi, Patreon, TikTok, YouTube, Pinterest, Threads, Facebook, X, LinkedIn und Discord
  (mit den Icons aus deiner Charta). Leere Einträge werden nicht gezeigt.
- Später ein Shop? Adresse bei `shopUrl` in `js/config.js` eintragen. Dann erscheint **Shop** im Menü
  (Boutique auf Französisch) und führt zu deinem Shop, z. B. Etsy oder Ko-fi.

## Kontaktformular

1. Konto bei **formspree.io** anlegen (Gratisplan, Limits vorher prüfen), neues Formular erstellen.
2. Die Adresse (`https://formspree.io/f/…`) in `js/config.js` bei `formEndpoint` einsetzen.
3. Deine E-Mail in `config.js` bei `email` eintragen.
4. Beim ersten Absenden musst du die Adresse bei Formspree bestätigen.

## Veröffentlichen (kostenlos)

Am einfachsten: **Cloudflare Pages** oder **Netlify** (Ordner per Drag & Drop hochladen) oder
**GitHub Pages**. Danach eine eigene Domain verbinden (kostet beim Domain-Anbieter ein paar Euro im Jahr).
Den ganzen Ordner hochladen, nicht nur einzelne Dateien.

## Gut zu wissen

- In der Browser-Konsole siehst du viele rote Meldungen „Failed to load … 404". **Das ist normal**: Die Seite
  probiert Dateien aus (`hero.webp`, dann `hero.jpg` …), und nicht vorhandene melden einen Fehler.
  Sie schaden nicht.
- Läuft sauber auf dem Handy (getestet bei 390 px Breite).
- **Rechtliches:** Sobald das Formular Daten von Besuchern sammelt, brauchst du eine Datenschutz- und
  Impressumsseite. Und beachte die Fragen zu deiner Nebentätigkeit, bevor du Aufträge annimmst.
  Das ist keine Rechtsberatung.

# Admin-Bereich (admin.html) – Anleitung

Mit `admin.html` änderst du Portfolio und Leistungen im Browser, ohne VS Code.
Adresse online: **https://daniellucasworks.com/admin.html** (nicht auf der Seite verlinkt, für Suchmaschinen gesperrt).

## Schritt 1: Token erstellen (einmalig, ca. 3 Minuten)

Der Token ist dein Schlüssel. Er erlaubt dem Admin, **nur in deinem Repository „portfolio“** Dateien zu ändern.

1. Auf github.com einloggen. Oben rechts auf dein Profilbild → **Settings**.
2. Links ganz unten **Developer settings** → **Personal access tokens** → **Fine-grained tokens**.
3. **Generate new token**.
4. **Token name:** `Admin Webseite`. **Expiration:** z. B. 1 Jahr (danach einfach einen neuen erstellen).
5. **Resource owner:** daniellucasworks.
6. **Repository access:** *Only select repositories* → **portfolio** auswählen.
7. **Permissions** → *Repository permissions* → **Contents: Read and write**. Alles andere bleibt aus (Metadata: Read-only kommt von selbst).
8. **Generate token**. Den Token (beginnt mit `github_pat_`) **sofort kopieren**, GitHub zeigt ihn nur einmal.

## Schritt 2: Anmelden
1. `https://daniellucasworks.com/admin.html` öffnen.
2. Token einfügen → **Anmelden**.
3. Haken bei „angemeldet bleiben“ nur auf deinem eigenen Computer oder Handy. Ohne Haken musst du den Token nach dem Schliessen des Tabs neu einfügen.

## Sicherheit
- Teile den Token nie, poste ihn nirgends. Wer ihn hat, kann dein Repository ändern.
- Die Seite admin.html ist öffentlich erreichbar, aber ohne Token kann niemand etwas ändern.
- Token verloren oder verdächtig? Auf GitHub (Settings → Developer settings → Fine-grained tokens) löschen und einen neuen erstellen.
- Der Token wird nur an GitHub gesendet. Die Auto-Übersetzung schickt nur deine deutschen Texte an den Dienst MyMemory.

## Benutzen
**Portfolio:** *+ Neues Werk* → Kategorie wählen → Bild(er) hinzufügen (werden automatisch in WebP, max. 1600 px, umgewandelt und richtig benannt, z. B. `illustration-04.webp`) → Titel und Beschreibung auf Deutsch → *Aus Deutsch übersetzen* → EN/FR in den Tabs prüfen → Social-Links → *Übernehmen*.
- Mehrere Bilder = Serie/Fortschritt (erstes Bild = Titelbild im Raster).
- Mit ↑ ↓ änderst du die Reihenfolge, mit *Bearbeiten* änderst oder löschst du ein Werk.
- Beschreibung: Leerzeile = neuer Absatz. Links im Text: `[Text](https://…)`.

**Leistungen:** *+ Neue Leistung* → Titel, Beschreibung, Preis (+ optional Zusatzzeile) → übersetzen → *Übernehmen*. Der Anfrage-Knopf öffnet das Kontaktformular mit dem Titel der Leistung.

**Seite (Texte und Bilder der Bereiche):** Im Tab *Seite* bearbeitest du Startbereich (Hero) mit Startbild, Portfolio-Überschrift, Einleitung der Leistungen, Manga (Text und bis zu 6 Bilder), Über mich (Text, Badges, Foto), Kontakt und den Google-Titel. Bilder werden wie beim Portfolio in WebP umgewandelt. Wenn du den deutschen Text änderst, setze bei der Übersetzung den Haken *überschreiben*, sonst bleiben alte EN/FR-Texte stehen.

**Veröffentlichen:** Unten erscheint die Leiste *Veröffentlichen*. Sie schreibt alle Änderungen auf einmal nach GitHub. Nach 1 bis 2 Minuten ist die Seite aktualisiert (Ctrl+F5). Bis dahin ist nichts online, du kannst also in Ruhe ändern oder *Verwerfen*.

## Wichtig
- Seit der Admin läuft, liegen Werke, Titel, Beschreibungen und Leistungen in **`data/content.js`**. Die Einträge `titles`, `descriptions`, `links` in `config.js` und die Leistungstexte in `translations.js` gelten dann nicht mehr für diese Werke.
- **Lade `data/content.js` und die Bilder in `images/portfolio/` nie mehr von Hand aus einem alten ZIP hoch.** Sonst überschreibst du Änderungen vom Admin. Neue Versionen von `index.html`, `css/`, `js/` kannst du weiter hochladen.
- Übersetzungen sind maschinell (nicht perfekt). Prüfe Eigennamen (Charaktere, Titel).
- Etwas ging schief? Auf GitHub unter *Commits* siehst du jede Änderung und kannst zurück.
- Notfall ohne Admin: `data/content.js` in VS Code bearbeiten (Format wie in der Datei, Kommas und Anführungszeichen beachten).

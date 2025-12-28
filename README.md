# Leon Remmert Portfolio - Dokumentation

##  Workflow für Änderungen
1. **VS Code:** Änderungen an `index.html`, `style.css` oder `script.js` vornehmen.
2. **Live Server:** In VS Code unten rechts auf "Go Live" klicken zur Vorschau.
3. **GitHub Desktop:** - Änderungen links prüfen.
   - Summary eingeben (z.B. "Neues Projekt: Faltkarre").
   - "Commit to main" klicken.
   - "Push origin" klicken.
4. **Cache:** Falls die Seite nicht aktuell wirkt, Browser-Cache leeren (Shift + F5).

##  Struktur & Logik
- **Farben & Fonts:** Werden zentral in der `style.css` über `:root` gesteuert.
- **Projekte hinzufügen:** Neue Projektdaten müssen im `script.js` im Objekt `projektDaten` ergänzt werden.
- **Bilder:** Neue Bilder in den entsprechenden Unterordner in `Projektbilder/` ablegen.
- **Videos:** Müssen im `script.js` als `type: 'video'` deklariert werden, damit sie automatisch stummgeschaltet starten.

##  Wichtige Hinweise für Pausen
- **Z-Index:** Die Tabs liegen auf Ebene 5-6. Achte bei neuen Overlays darauf, diesen Wert nicht zu sprengen.
- **CSS-Caching:** Bei großen Design-Änderungen die Versionsnummer im Header der `index.html` erhöhen (z.B. `style.css?v=6`).
- **Responsive Design:** Änderungen an den Tabs müssen oft auch in der `@media (max-width: 992px)` Sektion in der `style.css` angepasst werden.
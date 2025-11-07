# AppsScript Sitemap Monitor

**Überblick**  
Dieses Repository enthält ein Google Apps Script, mit dem sich eine XML-Sitemap direkt in Google Sheets überwachen und analysieren lässt. Mit diesem Tool behalten SEO-Profis und Website-Betreiber automatisch die Übersicht über alle Seiten, die in ihrer Sitemap gelistet sind, und erhalten wertvolle Einblicke zu Status und Auffälligkeiten.

![Screenshot einer TAbelle mit dem aktivierten Skript](https://github.com/seoseb-de/AppsScript-Sitemap-Monitor/blob/main/sitemap_tester_sheet.png)

## Features

- **Automatisierter Sitemap-Check:** Alle URLs der Sitemap werden automatisch überprüft.
- **Status-Codes abfragen:** Erkennt fehlerhafte Seiten (z.B. 404). 
- **Einfaches Setup:** Schnell startklar dank vorgefertigtem Skript. Import direkt in Google Apps Script.
- **Benutzerfreundliche Übersicht:** Ergebnisse werden übersichtlich und filterbar im Spreadsheet angezeigt.

## Installation & Erste Schritte

1. Öffne ein neues Google Sheet.
2. Navigiere zu `Erweiterungen > Apps Script`.
3. Kopiere den Inhalt von `sitemapMonitor.js` aus diesem Repository in das Skript-Fenster.
4. Speichere und schließe das Skript.
5. Füge die URL deiner XML-Sitemap in die erste Spalte des Sheets ein.
6. Starte das Skript und warte auf die Ergebnisse.

## Beispielanwendung

Ein typischer Anwendungsfall:  
Website-Betreiber möchten regelmäßig prüfen, ob alle Seiten im Google-Index enthalten und erreichbar sind. Das Skript unterstützt beim Monitoring und der Fehlererkennung, ideal zur Vorbereitung für SEO-Audits.

## Lizenz

Dieses Projekt steht unter der [MIT License](LICENSE).

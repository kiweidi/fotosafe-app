# FotoSafe Site pflegen

## Architektur

Die neue Site ist ein kleiner statischer Generator:

- Seiteninhalte: `scripts/build-site.js` und `scripts/site-content.js`
- gemeinsames Layout/SEO/Navigation: `scripts/build-site.js`
- Design: `src/site.css`
- Interaktionen: `src/site.js`
- Medien: `assets/`
- Ausgabe: `dist/preview` und `dist/production` (generiert; nicht direkt bearbeiten)

## Texte oder Metadaten ändern

1. Passenden Seiteneintrag bzw. Inhaltsblock in `scripts/build-site.js` oder `scripts/site-content.js` ändern.
2. Title, Description, Pfad, Sprache und `alternate` gemeinsam kontrollieren.
3. `npm run check:preview` und `npm run check:production` ausführen und den jeweils expliziten Ausgabebaum prüfen. `npm run check` bleibt der Legacy-Root-Pipeline vorbehalten.
4. Betroffene Seiten in Desktop, 390 px und 320 px visuell/browserbasiert testen.

## Bilder ändern

- Master/Quelle erhalten; nur abgeleitete Webversionen unter `assets/` ergänzen.
- Breite/Höhe im HTML setzen, moderne Formate verwenden und Herkunft in `ASSET-SOURCES.md` ergänzen.
- Keine privaten Medien, unklar lizenzierten Produktbilder oder erfundenen App-Screens verwenden.
- Nach Build alle referenzierten Bilder mit `complete && naturalWidth > 0` sowie Live-Hashes prüfen.

## Ratgeber oder Übersetzung ergänzen

1. DE- und EN-Gegenstück als zwei `pages`-Einträge mit reziproken `alternate`-Pfaden anlegen.
2. Hilfe-Hubs, Navigation bzw. kontextuelle Links ergänzen.
3. Route in `tests/site-structure.test.js` und ggf. Browsermatrix aufnehmen.
4. `CONTENT-MAP.md` und `SEO-MAP.md` aktualisieren.
5. Canonical, hreflang, H1, Description, JSON-LD, interne Links, Sitemap und 404-Verhalten prüfen.
6. Englische Seiten auf deutschen Resttext und passende lokalisierte Screenshots prüfen.

## Deploymentdisziplin

- Preview über `npm run build:preview`, Produktion über `npm run build:production` bauen.
- `dist/preview` und `dist/production` nie manuell korrigieren; immer aus Quellen neu erzeugen.
- Keine Domain-/DNS-/Produktionsänderung ohne ausdrückliche Freigabe.
- Jeder neue Deployment-Host benötigt frische Live-QA und Hashvergleiche; alte Berichte nicht wiederverwenden.

## Claims, Schema und Assets

- Jede öffentliche Produkt-, Billing-, Privacy-, Operator- oder Kompatibilitätsaussage muss eine aktuelle Zeile in `CLAIMS-REGISTER.md` besitzen; abgelaufene oder geänderte Quellen sperren die Aussage bis zur erneuten verantwortlichen Freigabe.
- App-/Billing-Claims bei jeder Release- oder Play-Änderung, Operator-/Privacy-/Rights-Freigaben spätestens alle 90 Tage und vor jedem Launch erneut prüfen.
- DE/EN-Wortlaut, sichtbarer Inhalt und JSON-LD müssen denselben freigegebenen Claim-Scope verwenden. Keine Ratings, Reviews, Preise, Offers oder Kompatibilität ergänzen, die im Register nicht freigegeben sind.
- Jedes neue öffentliche Asset benötigt vor dem Build eine Zeile in `ASSET-SOURCES.md` und einen bewussten Eintrag in der Build-Allowlist. Source/master retention ist keine Deployfreigabe.

## 30/60/90 days after an approved launch

**Keine automatisierten Jobs / No automated jobs** werden durch diesen Plan angelegt. Termine und Verantwortliche werden erst im freigegebenen Betriebsprozess gesetzt.

- **30 days:** final-host HTTPS, Canonicals, hreflang, Redirects, echte 404-Statuscodes, Indexierungszustand, negative Assetchecks, Drittanfragen und Supportausfälle prüfen.
- **60 days:** fehlende Suchintentionen, Supportfeedback, App-/Geräte-Kompatibilität, öffentliche Play-Fakten und Claim-Quellenfrische reviewen.
- **90 days:** Rechte-, Privacy- und Operatorfreigaben erneuern; strukturierte Daten, Claims, Asset-Allowlist, Rollbackunterlagen und verfügbare Core-Web-Vitals-Felddaten neu auditieren.

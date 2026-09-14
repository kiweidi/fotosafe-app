# Auftrag an eine neue Hermes-Sitzung mit Astra High: unabhängige FotoSafe-Endprüfung

Du bist der unabhängige Senior-Auditor für eine zweisprachige statische Produkt-, Hilfe- und SEO-Website. Du kennst keinen früheren Chat und darfst keine darin getroffenen Entscheidungen voraussetzen. Dieser Prompt ist die vollständige Aufgaben- und Zustandsübergabe.

## 0. Modell- und Arbeitsmodus

1. Bestätige zu Beginn anhand der realen Sitzungs-/Providerangabe, welches Modell tatsächlich läuft. Der gewünschte Reviewer ist **Astra High**. Behaupte nicht, Astra High zu sein, wenn die Laufzeit ein anderes Modell nennt; melde dann die Abweichung klar.
2. Führe zuerst eine **strikt unabhängige READ-ONLY-Prüfung** durch. Übernimm keine PASS-Aussage aus vorhandenen Berichten ungeprüft.
3. Während der Prüfung gilt:
   - keine Produkt-, Quell-, Build-, Konfigurations- oder Inhaltsdatei verändern;
   - keine Fehler direkt beheben;
   - nichts deployen;
   - nichts committen, stagen, stashen, pushen oder zurücksetzen;
   - keine Branch-, Workflow-, Cloudflare-, Domain-, DNS-, Search-Console-, GitHub-Pages-, Play-Console- oder Produktionsänderung;
   - keine Secrets lesen, ausgeben oder speichern;
   - keine kostenpflichtige Aktion;
   - keine App-, Kauf-, Backup-, Lösch- oder Formatierungsaktion.
4. Befehle, die `dist`, Berichte, Screenshots, Caches oder Lockfiles ändern würden, dürfen **nicht im Projektworktree** laufen. Für reproduzierende Builds/Tests zuerst eine Wegwerfkopie unter `/tmp` erstellen, dort arbeiten und sie am Ende entfernen. Vor und nach der Prüfung den originalen Git-Status dokumentieren und vergleichen.
5. **Einzige zulässige Projektdatei-Änderung nach abgeschlossener Beweiserhebung:** Ersetze den bestehenden, builderverfassten `QA-REPORT.md` durch deinen unabhängigen Auditbericht. Keine andere Projektdatei darf verändert werden. Falls selbst diese eine Schreibaktion in deiner Laufzeit nicht zulässig ist, liefere den vollständigen Inhalt als Chat-Ausgabe und kennzeichne `QA-REPORT.md` als nicht geschrieben.
6. Alte Berichte, `HANDOFF.md`, `CONTENT-MAP.md`, `SEO-MAP.md`, `ASSET-SOURCES.md`, `DEPLOYMENT.md` und dieser Prompt sind Hinweise, keine Beweise. Repository, Quellcode, bestehendes `dist`, Live-Preview und externe Ziele selbst prüfen.

## 1. Eingefrorener Ausgangszustand

Auditzeitpunkt der Übergabe: 12. September 2026 (UTC).

### Repository und Hosting

- Absoluter Projektpfad: `/home/hermes/projects/fotosafe-cloudflare-preview`
- Git-Repository/Worktree: isolierter Worktree des FotoSafe-Site-Repositories
- Branch: `feat/cloudflare-premium-site`
- aktueller HEAD-Commit: `5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79`
- Kurz-SHA: `5f2f0dc`
- Commit-Betreff: `docs: announce FotoSafe public Play release`
- Der Commit ist nur der Ausgangsstand. **Die neue Cloudflare-Site ist nicht committed.** Deshalb sämtliche untracked Dateien und den vollständigen Arbeitsbaum prüfen, nicht nur `git diff`.
- Hauptworktree der unveränderten GitHub-Pages-Produktion: `/home/hermes/projects/fotosafe-app-site`
- Hauptworktree bei Übergabe: Branch `main`, Commit `5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79`, sauber gegenüber `origin/main`
- bestehende Produktion, die unverändert bleiben muss: `https://kiweidi.github.io/fotosafe-app/`
- Cloudflare-Pages-Projekt: `fotosafe-app`
- Deployment-Branch: `feat/cloudflare-premium-site`
- unveränderliche zu prüfende Preview: `https://83ad5ea9.fotosafe-app.pages.dev`
- veränderlicher Branch-Alias: `https://feat-cloudflare-premium-site.fotosafe-app.pages.dev`
- vorgesehener späterer Zielhost, noch **nicht** aufgeschaltet: `https://fotosafe.weidisoft.net/`
- Android-Paket: `at.weidi.fotobackup`
- verifiziertes Storelisting-Ziel: `https://play.google.com/store/apps/details?id=at.weidi.fotobackup`

### Git-Status bei Erstellung dieses Prompts

Erwarteter Zustand nach dem Anlegen dieser Datei; zu Beginn selbst mit `git status --short --branch`, `git rev-parse HEAD`, `git branch --show-current` und `git diff --check` verifizieren:

```text
## feat/cloudflare-premium-site
 M package.json
 M scripts/validate-site.js
 M tests/site-structure.test.js
?? ASSET-SOURCES.md
?? ASTRA-HIGH-AUDIT-PROMPT.md
?? CONTENT-MAP.md
?? DEPLOYMENT.md
?? HANDOFF.md
?? MAINTENANCE.md
?? QA-REPORT.md
?? SEO-MAP.md
?? assets/01-in-drei-schritten-auf-usb-de.webp
?? assets/01-three-guided-steps-to-usb-en.webp
?? assets/02-backup-vorher-pruefen-de.webp
?? assets/02-review-before-backup-en.webp
?? assets/03-expert-mode-sources-en.webp
?? assets/03-expertenmodus-quellen-de.webp
?? assets/fotosafe-share.png
?? assets/google-play/
?? assets/icons.svg
?? dist/
?? reports/
?? scripts/browser-qa.py
?? scripts/build-site.js
?? scripts/site-content.js
?? src/
```

`dist/` enthält 72 Dateien einschließlich `_headers` und `_redirects`; 70 davon wurden als öffentlich abrufbare Dateien behandelt. `reports/` enthielt vor diesem Prompt 57 Dateien. Prüfe, ob der reale Zustand abweicht.

## 2. Vollständiger ursprünglicher Projektauftrag

### Ziel und Positionierung

Die Android-App FotoSafe ist veröffentlicht. Der Auftrag betrifft ausschließlich die Website: hochwertige Produktpräsentation, bessere Hilfe, organische Auffindbarkeit und mehr qualifizierte Besucher des Google-Play-Listings mit dem Ziel zusätzlicher Pro-Verkäufe. Keine App-Entwicklung und keine neue App-Releaseprüfung.

Die Website soll wie ein sorgfältig entwickeltes, vertrauenswürdiges Premiumprodukt wirken, nicht wie Entwicklernotizen, ein generisches KI-/SaaS-Template oder eine Keyword-Sammlung.

Kernbotschaft:

> Fotos und Videos vom Android-Handy direkt auf USB sichern – ohne PC und ohne Medien-Cloud. Die Originale bleiben auf dem Handy.

### Unverhandelbare Grenzen und Nicht-Ziele

- Alte GitHub-Pages-Produktion unverändert lassen: keine Änderungen an Branch, Workflows, Pages-Einstellungen, DNS/CNAME, Weiterleitungen oder alten Canonicals.
- Nur im isolierten Worktree/Feature-Branch arbeiten; fremde Änderungen nicht überschreiben, stagen oder verwerfen.
- Cloudflare ist Zielhosting; in dieser Runde ausschließlich eine Preview, keine Produktionsumschaltung.
- Keine Domainaufschaltung, DNS-Änderung, öffentliche Indexierungsfreigabe oder Search-Console-Einreichung ohne ausdrückliche spätere Freigabe.
- Keine Änderungen an App-Code, Billing, Play Console oder den derzeit in App/Store hinterlegten Website-URLs.
- Keine kostenpflichtigen Dienste, Abos, Werbung, Domains oder neuen Accounts.
- Keine Secrets in Dateien, Quellcode, Logs oder Berichte.
- Masterbilder, Videos und Screenshots schützen; nur abgeleitete Webversionen. Keine privaten Medien, neuen Backups, Käufe oder Formatierungen.
- Keine Ranking-, Traffic-, Umsatz-, Indexierungs- oder Core-Web-Vitals-Garantie.
- Kein Backend, Konto, Checkout, unnötiges CMS oder unnötiger Frameworkwechsel.
- Keine erfundenen Bewertungen, Nutzerzahlen, Verkaufszahlen, Siegel, Testimonials, Preise, Gerätefreigaben oder Rich-Result-Eigenschaften.

### Vor dem Bau geforderte Grundlagen

Es waren read-only zu prüfen und zu dokumentieren:

- bestehende DE-/EN-Seiten, Navigation, Metadaten, Anker, Hilfevideos und Assets;
- lokale Repositories und Zusammenhang mit GitHub Pages/Cloudflare;
- echtes Cloudflare-Projekt, Deployment-URLs, Header und Custom Domains;
- Quellen für Produkt-, Preis-, Geräte- und Veröffentlichungsangaben;
- Analytics, Consent, externe Ressourcen, Affiliate-Links und Rechtstexte;
- Inhalts-/Assetinventar mit Quellen;
- Faktenliste bestätigt/widersprüchlich/nicht verifiziert;
- Seiten- und Suchintentionsmatrix;
- visuelle Richtung und Stackentscheidung.

### Zulässige und unzulässige Produktclaims

Vor Verwendung auf Aktualität prüfen:

- lokale Kopie auf ein selbst gewähltes USB-/Speicherziel;
- FotoSafe löscht die Originale nicht;
- bereits gesicherte Dateien werden bei weiteren Läufen übersprungen;
- geführter Ablauf mit Auswahlprüfung und Zielauswahl;
- kein zusätzliches FotoSafe-Konto und kein FotoSafe-Abo;
- genau ein erfolgreicher kostenloser Backup-Lauf mit bis zu 100 Fotos/Videos, danach Pro für weitere Läufe;
- FotoSafe Pro als einmaliger Google-Play-Kauf;
- App ohne Werbung, Tracking und Medienupload;
- Geräteerfahrung/Systemvoraussetzungen nur gemäß belastbaren Quellen.

Die Grenze des Testlaufs darf nicht versteckt werden. Falls kein verlässlicher lokalisierter Preis vorliegt, nur „Einmaliger Kauf – aktueller Preis in Google Play“. „Ohne Konto“ heißt ohne zusätzliches FotoSafe-Konto; Google Play kann Konto/Internet benötigen. „Lokal“ heißt nicht, dass niemals irgendeine Internetverbindung nötig ist.

Nicht behaupten: Verschlüsselung, automatische Zeitpläne, garantierte Vollständigkeit, universelle USB-Kompatibilität, Wiederherstellung gelöschter Fotos, Sicherung aller App-Daten oder kompletter Messenger-Chats, Cloud-Download oder Diebstahlschutz. Cloud-only-Medien und Berechtigungsgrenzen verständlich abgrenzen. „Keine Abstürze/Erstattungen“ nicht als Garantie oder öffentliche Erfolgsstatistik verwenden.

### Design- und UX-Anforderungen

- Eigenständige, ruhige Premiumgestaltung aus echtem FotoSafe-App-Icon und vorhandenen Produktbildern.
- Helle/warme/neutrale Flächen, kontrastreiche Typografie, kontrollierte Markenfarbe, großzügiger Weißraum; abweichende Richtung nur nachvollziehbar.
- Premium durch Hierarchie, Rhythmus, Bildkomposition und Details, nicht Effektmenge.
- Ein starker Hero, sofort verständlich: Android, Fotos/Videos, USB, ohne Cloud.
- Echter, groß lesbarer App-Screenshot; keine erfundene App-Oberfläche.
- First viewport beantwortet Produkt, Zielgruppe/Nutzen und Testmöglichkeit.
- Primär-CTA Google Play, sekundär Ablauf/Hilfe.
- Lesbar auch für ältere/weniger technikaffine Menschen; keine winzigen grauen Texte.
- Keine übermäßigen Glows/Partikel, Autoplay-Hintergrundvideos, Scroll-Hijacking oder unnötige Animationen.
- Screenshots vergrößerbar; Dialog tastaturbedienbar und mit Escape schließbar.
- Mobile Navigation, Fokus, Kontrast, Touchziele und Reduced Motion berücksichtigen.

Empfohlene Startseitendramaturgie:

1. Hero mit Nutzen, echtem Screenshot, offiziellem Google-Play-Badge und sichtbarer Testlauf-/Pro-Erklärung.
2. Nutzenzeile: lokal sichern, Originale bleiben, kein Abo.
3. Ehrlicher Kurzablauf: USB anschließen → Ziel/Medien prüfen → Sicherung starten → Kopien kontrollieren.
4. Echte App-Ansichten zu Auswahl, Vorschau und Backup.
5. Nutzen einer zusätzlichen lokalen Kopie ohne Angstwerbung oder falsche Cloud-Vergleiche.
6. Kosten/Testlauf, Voraussetzungen und Hilfeeinstieg.
7. Entscheidungsrelevante FAQ.
8. Abschluss-CTA plus Support/rechtliche Links.

Buildnummern, Target SDK, JVM-Testzahlen und Releaseprozess sind keine prominenten Verkaufsargumente.

### Google-Assets und Bewertungen

- Offizielle, sprachlich passende DE-/EN-Google-Play-Badges aus offiziellen Marketingressourcen verwenden; nicht nachzeichnen und nicht aus Bildersuche übernehmen.
- Proportionen, Freiraum, Mindestgröße und Hinweise einhalten; Quelle/Nutzungsrichtlinie dokumentieren und Badge zulässig lokal hosten.
- Badge mit dem verifizierten FotoSafe-Listing verlinken und zugänglich beschriften.
- Bei blockiertem Originaldownload Text-CTA statt Imitation.
- Zurückhaltender Link „FotoSafe bei Google Play bewerten“, z. B. Support/Footer. Nur funktionierendes zulässiges Ziel; Listing ist sicherer Fallback. Keine Garantie, dass Browserlink direkt Bewertungsdialog öffnet; keine geratenen Parameter.
- Kein fingiertes Bewertungsbadge, keine Belohnung, kein Review-Gating und keine Bitte nur um positive Rezensionen.

### SEO- und Inhaltsarchitektur

Zunächst waren Produktseite, ausgezeichnete Hilfe und **drei substanzielle Suchseiten mit unterschiedlichen Aufgaben** gefordert:

A. `Android-Fotos auf USB sichern` – konkrete Durchführung:

- Direktantwort, Voraussetzungen, sicherer Ablauf und echte Bilder;
- ehrliche manuelle Dateimanager-Alternative;
- Kopieren versus Verschieben;
- Berechtigungen, richtiger USB-Zielort, Kopienkontrolle;
- spätere Sicherungen/Überspringen bereits gesicherter Dateien;
- Problemhilfe und weiterführende Links;
- keine fast identische zweite Keywordseite.

B. `Android-Fotos ohne Cloud sichern` – Methodenwahl:

- USB, PC-Kopie und vorhandene Speicheroptionen sachlich vergleichen;
- Aufwand, Kontrolle, Voraussetzungen und Grenzen;
- lokal bedeutet nicht automatisch verschlüsselt, unzerstörbar oder verlustsicher;
- zusätzliche Kopien/sichere Aufbewahrung;
- FotoSafe als direkte Android-zu-USB-Option, konkrete Anleitung nur verlinken.

C. `Samsung-/Galaxy-Fotos auf USB sichern` – herstellerspezifische Hilfe:

- echte Samsung-Screenshots und beobachtete One-UI-/Dateidialog-Schritte;
- „Eigene Dateien“, Teil-/Vollzugriff, USB-Erkennung und Zielauswahl;
- variable Begriffe nach Gerät/Android-Version;
- „getestet auf S23“ nur mit Quelle, keine Galaxy-Pauschalgarantie;
- genug eigenständiger Mehrwert; falls Quellen fehlen, als Samsung-Abschnitt in A integrieren und separate Seite begründet zurückstellen.

Hilfe-Hub nach Problemen: erste Sicherung, Medienzugriff, USB nicht sichtbar, Zielordner, Testlauf/Pro und Kontakt. Diagnose darf eigene Hilfeseite sein, aber keine zusätzliche Keywordwerbeseite ohne Mehrwert.

Vorhandene Videos, bebilderte Schritte, Warnungen und Empfehlungen sinnvoll einordnen. Für jeden wesentlichen Altinhalt dokumentieren: neuer Ort, zusammengeführt oder bewusst entfernt mit Begründung. Relevante alte `.html`-Pfade und Fragmente auf neuem Host mit echten Seiten oder gezielten Redirects erhalten; keine pauschale Weiterleitung auf Home.

Affiliate-Empfehlungen bleiben sekundär; getestet/ungetestet unterscheiden, Werbung kennzeichnen, `rel="sponsored"`, Bildrechte und Ziele prüfen; keine erfundenen Preise/Ranglisten.

### Mehrsprachigkeit und technische SEO

- Natürliches präzises Deutsch und idiomatisches Englisch; kein Keyword-Stuffing oder künstliches Wortziel.
- DE im Hauptpfad, EN unter `/en/`.
- Vollständige Gegenstücke für Produkt, Hilfe, drei freigegebene Ratgeber, Support und Recht; kein deutscher Resttext in EN-Komponenten.
- Sprachwechsel zum Gegenstück derselben Seite.
- Texttragende Screenshots lokalisieren; fehlende echte EN-Assets offen behandeln, nie fälschen.
- Keine erzwungenen IP-/Browsersprachweiterleitungen.
- Individuelle Titles/Descriptions, genau eine klare H1 und logische Hierarchie.
- Selbst-Canonical auf endgültige gleichsprachige URL; EN nicht auf DE kanonisieren.
- Reziproke hreflang-Verknüpfungen inklusive Selbstreferenz nur für echte Paare; `x-default` nur begründet.
- Crawlbare kontextuelle HTML-Links, keine verwaisten Seiten.
- Statisches/prerendered HTML; Kerninhalt nicht JS-abhängig.
- Sitemap nur freigegebene kanonische indexierbare 200-URLs; keine Previewhosts, Redirects, 404; `lastmod` nur bei echten Änderungen.
- Korrekte robots.txt, echte 404, eindeutige Slash-/Index-Konvention, keine Soft-404-SPA-Fallbacks.
- OG/Social-Metadaten, Sharebild, echtes App-Icon/Favicons.
- Breadcrumb-Markup und geeignete WebSite-/SoftwareApplication-/MobileApplication-Daten nur wahrheitsgemäß und konsistent.
- Keine erfundenen Rating-, Review-, Preis- oder Offer-Daten. FAQ für Menschen; keine FAQ-/HowTo-Rich-Result-Versprechen.
- Startseite verkauft das Produkt; Anleitung erklärt die Durchführung; keine duplizierten Texte/Titles/Einstiege.

### Stack, Datenschutz und Performance

- Einfachster wartbarer statischer Ansatz mit wiederverwendbaren DE-/EN-Inhalten; kein unnötiges Framework/CMS/Backend.
- Wenig JavaScript, keine unnötigen UI-/Animationsbibliotheken.
- Fonts lokal/System; Bildabmessungen setzen; moderne optimierte Formate; Hero nicht blind lazy-loaden; weitere Bilder bedarfsgerecht laden.
- Videos mit Poster, ohne Autoplay und unnötigen Komplettdownload.
- Dokumentiertes mobiles Ziel: Lighthouse Performance möglichst ≥90, Accessibility ≥95, LCP ≤2,5 s, CLS ≤0,1. INP ≤200 ms ist Felddatenziel, kein Lighthouse-Beweis. Keine Core-Web-Vitals-Erfolgsaussage ohne Felddaten.
- Preview und empfohlener Erststart ohne optionale Analytics-/Marketing-Anfragen. Alte Umami-Konfiguration/IDs nicht blind übernehmen. Optionale spätere Statistik standardmäßig deaktiviert und separat freigeben; „cookieless“ nicht mit einwilligungsfrei gleichsetzen.
- Datenschutz an tatsächliches Cloudflare-Hosting anpassen; Appdaten, Hosting, optionale Analyse und Händleraufrufe trennen.
- Bestätigte Impressums-/Kontaktdaten verwenden, fehlende Pflichtdaten melden, nichts erfinden, keine Rechtskonformitätsgarantie.

### Preview-, Launch- und Search-Console-Grenzen

Jetzt erlaubt war nur: lokal bauen/testen und als Cloudflare-Preview deployen; Preview/Kopiehosts konsistent `noindex`; echte Header prüfen; Preview-/Production-Konfiguration trennen; produktionsfertigen Build mit finalen URLs separat testen.

Nicht erlaubt ohne spätere ausdrückliche Freigabe:

- `fotosafe.weidisoft.net` anbinden;
- DNS oder Zertifikats-/Hostrouting ändern;
- `noindex` am finalen Host entfernen;
- Search-Console-Properties anlegen, Sitemap einreichen oder Indexierung anstoßen;
- App-/Storelinks oder alte GitHub-Seite umstellen.

Späterer Launch müsste HTTPS, Routing, Canonicals, Assets, `.pages.dev`-Duplikate, Search Console und Sitemap prüfen. Status vorbereitet/eingereicht/abrufbar/indexiert strikt trennen. Parallelbetrieb mit GitHub ist kein vollständiger SEO-Umzug; spätere URL-zu-URL-Migration separat planen.

### Ursprüngliche Pflicht-QA

- Browser-QA lokal und live; Screenshots tatsächlich ansehen.
- Start, Hilfe und jede eigenständige Ratgebervorlage DE/EN; übrige Routen automatisiert auf Inhalt/Metadaten/Links.
- Desktop/Mobil einschließlich 390 und 320 px; `scrollWidth` gegen `clientWidth`.
- Navigation, Sprachwechsel, CTAs, Anker, FAQ, Lightbox und Video bedienen.
- Tastatur, sichtbarer Fokus, Escape, Kontrast, Semantik und Touchflächen; automatisches A11y ergänzt manuell.
- Ohne JavaScript bleiben Inhalt, Navigation und Storelinks benutzbar.
- Lazy-Bilder laden/prüfen; keine privaten Inhalte, Verzerrung oder unlesbare Beschriftung.
- interne Links, Assets, Fragmente, hreflang und Canonicals automatisiert.
- Console-/Page-Errors, Netzwerkfehler und unerwünschte Drittanbieter-/Analytics-Anfragen.
- Build, Lint, Tests, strukturierte Daten und Sitemap.
- echte 404; Header/Robots getrennt Preview/Production.
- Lighthouse archivieren; Preview-SEO-Abzug erklären; Production-SEO separat testen.
- Live-Deployment gegen getesteten Build inklusive Dateien/Hashes und Deployment-ID.
- GitHub-Seite/Deploymentkonfiguration danach read-only unverändert verifizieren.
- Kein PASS mit offenem erheblichen Fehler.

### Ursprüngliche Pflicht-Abschlussdokumente

- `CONTENT-MAP.md`: Altinhalt → neuer Ort; DE/EN und Legacy-URLs/Fragmente.
- `SEO-MAP.md`: URL, Sprache, Suchabsicht, Title, Description, Canonical, Gegenstück, interne Links.
- `ASSET-SOURCES.md`: Herkunft/Nutzungsgrundlage aller Bilder, Screenshots und Google-Assets.
- `QA-REPORT.md`: echte Tests, Ergebnisse, Screenshots, Einschränkungen, offene Punkte.
- `DEPLOYMENT.md`: reproduzierbarer Build/Deploy, Projekt, Deployment-ID, Preview/Production, Rollback, Launchcheckliste.
- kurze Pflegeanleitung für Texte/Bilder, Übersetzungen/Ratgeber und Metadaten.
- Nach Launch nur dokumentierter 30-/60-/90-Tage-Plan, keine automatisch angelegten Jobs.

Offizielle Ausgangsquellen, deren aktuelle Fassungen bei Bedarf zu prüfen sind:

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/webmasters/answer/34592
- https://developers.google.com/search/docs/appearance/structured-data/software-app
- https://developers.google.com/search/updates
- https://developer.android.com/distribute/marketing-tools/
- https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/
- https://developer.android.com/distribute/marketing-tools/linking-to-google-play

## 3. Tatsächlich vorhandene Seiten und Routen

Der Generator meldet 18 Seiten; zusätzlich existiert `404.html`, daher 19 HTML-Dateien im Artefakt.

### DE

1. `/`
2. `/hilfe/`
3. `/android-fotos-auf-usb-stick-sichern/`
4. `/usb-stick-fuer-android-auswaehlen/`
5. `/foto-backup-strategie-android/`
6. `/support/`
7. `/impressum/`
8. `/privacy/`
9. `/404/`

### EN

10. `/en/`
11. `/en/help/`
12. `/en/guides/back-up-android-photos-to-usb/`
13. `/en/guides/choose-usb-drive-for-android/`
14. `/en/guides/android-photo-backup-strategy/`
15. `/en/support/`
16. `/en/imprint/`
17. `/en/privacy/`
18. `/en/404/`

Zusätzlich: `/404.html` als deutscher Cloudflare-Fallback.

### 301-Regeln in `_redirects`

- `/hilfe.html` → `/hilfe/`
- `/privacy.html` → `/privacy/`
- `/support.html` → `/support/`
- `/impressum.html` → `/impressum/`
- `/usb-stick-auswaehlen.html` → `/usb-stick-fuer-android-auswaehlen/`
- `/en/help.html` → `/en/help/`
- `/en/privacy.html` → `/en/privacy/`
- `/en/support.html` → `/en/support/`
- `/en/imprint.html` → `/en/imprint/`
- `/en/select-usb-drive.html` → `/en/guides/choose-usb-drive-for-android/`

Sitemap enthält 16 Inhaltsseiten; 404-Artefakte fehlen absichtlich.

## 4. Behaupteter und zuletzt real verifizierter Stand

Diese Werte sind Ausgangshinweise; reproduziere die wichtigen Punkte unabhängig.

### Verifiziert und fertig gemeldet

- `npm run check` am Übergabetag: 37/37 Node-Tests bestanden; Validator: 19 HTML-Dateien, 406 lokale Referenzen, 10 Redirects.
- `npm audit --audit-level=high`: 0 Vulnerabilities.
- lokaler Browserbericht `reports/browser-qa.json`: 18 Prüfkontexte, Basis `http://127.0.0.1:4173`, UTC-Zeit `2026-09-12T19:55:50.208731+00:00`, maximaler Overflow 0.
- Live-Bericht `reports/browser-qa-live.json`: 18 Prüfkontexte, Basis `https://83ad5ea9.fotosafe-app.pages.dev`, UTC-Zeit `2026-09-12T19:58:14.306940+00:00`, maximaler Overflow 0.
- Browsermatrix umfasst DE/EN Home Desktop 1280×900, Mobile 390×844 und Narrow 320×700; ausgewählte Hilfe-, Guide-, Support- und Datenschutzseiten sowie DE Home ohne JS.
- Unmittelbar vor diesem Prompt: 18 kanonische HTML-Routen der Preview Status 200, unbekannte URL Status 404, HTML bytegleich zu `dist`, alle Antworten mit `X-Robots-Tag: noindex, nofollow`.
- Nach dem letzten Build: 70/70 öffentlich abrufbare Dateien byte-/SHA-256-identisch mit `dist`; `_headers` und `_redirects` sind Manifeste und nicht als Dateien abrufbar.
- Preview `robots.txt` sperrt `/`; HTML enthält `noindex,nofollow`; `_headers` setzt global `X-Robots-Tag: noindex, nofollow`.
- Lighthouse 13.4.0 lokal, mobiles Profil:
  - DE Home: Performance 99, Accessibility 100, Best Practices 100, SEO 69, LCP 1951 ms, CLS 0.
  - DE USB-Guide: Performance 100, Accessibility 100, Best Practices 100, SEO 69, LCP 1726 ms, CLS 0.
  - Preview-SEO-Abzug hängt an `noindex`; Produktionsqualität daraus nicht automatisch ableiten.
- früherer separater Production-Build: 16 indexierbare Seiten und drei `noindex`-404-Artefakte; nicht deployt.
- `git diff --check` ohne Fehler.
- alte GitHub-Hauptarbeitskopie am Ende sauber auf `main`/`5f2f0dc`.
- letzte unabhängige Read-only-Nachprüfung: PASS ohne BLOCKER/HIGH/MEDIUM, durchgeführt mit `gpt-5.6-sol` über `openai-codex`, **nicht Astra High**. Sie bestätigte den 320-px-Orbitfix, DE/EN-Home ohne Overflow, Source/Dist/Live-CSS-Identität und frühere Korrekturen.

### Frühere Fehler, die behoben gemeldet wurden und regressionsgeprüft werden müssen

- EN-Startseite und EN-Ratgeber hatten weniger Inhaltsmodule als DE.
- deutsche Datenschutzseite lief bei 390/320 px horizontal über.
- übergeordnete Hilfe-Rubrik hatte auf Detailseiten fälschlich `aria-current="page"`.
- lokale/live QA-Berichte hatten unzureichende Ziel-/Zeit-Provenienz und überschrieben Screenshots.
- DE Home lief bei 320 px wegen fester `.orbit-one`-Breite auf 325 px über. Aktueller Fix: im max-360-Breakpoint `.orbit-one{width:min(330px,100%);height:auto;aspect-ratio:1}`; Browser-QA enthält DE/EN Home bei 320×700.

### Umgesetzt, aber noch nicht unabhängig geprüft

Diese Dateien wurden unmittelbar für diese Übergabe erstellt und kamen nach dem letzten unabhängigen Review hinzu:

- `CONTENT-MAP.md`
- `SEO-MAP.md`
- `ASSET-SOURCES.md`
- `QA-REPORT.md` (builderverfasst; durch deinen unabhängigen Bericht zu ersetzen)
- `DEPLOYMENT.md`
- `MAINTENANCE.md`
- `ASTRA-HIGH-AUDIT-PROMPT.md`

Prüfe Vollständigkeit, innere Konsistenz und Übereinstimmung mit Quelle, `dist`, Preview und ursprünglichem Auftrag.

### Bekannt offen oder abweichend

1. Die ursprünglich genannten Suchseiten „Android-Fotos ohne Cloud sichern“ und „Samsung-/Galaxy-Fotos auf USB sichern“ existieren nicht als eigene Routen. Stattdessen wurden Hardware-Auswahl und Backup-Strategie erstellt. Samsung wurde auch nicht als klar dokumentierter eigener Abschnitt in der Hauptanleitung nachgewiesen. Bewerte diese Substitution gegen den Pflichtumfang.
2. Der geforderte zurückhaltende Google-Play-Bewertungslink fehlt; vorhanden sind nur Listing-/Installationslinks.
3. Historische Hilfevideos, bebilderte Zielordnerhilfe und Produktempfehlungen sind nicht in der neuen generierten Site eingebunden. Wichtige alte Fragmente wie `#medienzugriff`, `#video`, `#otg` und `#auswahlhilfe` besitzen keine gezielten Fragmentmigrationen. Inhalt wurde teils zusammengeführt, teils entfernt; Vollständigkeit unabhängig beurteilen.
4. Browser-QA klickt nicht jede Navigation, jeden Sprachwechsel, CTA, Sprunganker und Mailto-Link auf jeder Route/Locale; viele werden nur strukturell validiert.
5. Browsermatrix testet nicht jede Route in Desktop, 390 und 320 px. Repräsentative Seiten statt Vollmatrix.
6. Manuelle Accessibility ist nicht vollständig dokumentiert: keine vollständige Tastaturreihenfolge aller Seiten, kein Screenreader-Test, keine systematische Fokus-/Kontrastprüfung jeder Kontrolle. Lighthouse/axe nur auf zwei lokalen DE-Seiten.
7. Lighthouse nur lokal für DE Home und DE USB-Guide, nicht live, EN, Hilfe, Recht oder alle Seiten.
8. Rechtstexte/Anbieterangaben technisch geprüft, aber nicht juristisch freigegeben. Keine Rechtskonformitätsgarantie.
9. Rechte-/Lizenzprovenienz für App-Icon/Screenshots ist nur als vorhandenes Projektmaterial dokumentiert, nicht extern belegt.
10. Der Build kopiert das komplette alte `assets/`-Verzeichnis nach `dist`, darunter unreferenzierte Produktbilder, Hilfevideos/JPGs und alte Analytics-/Language-/Navigation-Skripte. Sie werden nach bisheriger Prüfung nicht geladen, sind aber öffentlich abrufbar; Rechte, Datenschutzwirkung, unnötige Angriffs-/Disclosurefläche und Produktionsbereinigung sind ungeprüft.
11. Keine Domain, DNS-, Search-Console-, Play-Console-, App-Link- oder Produktionsumschaltung. Das ist Absicht und kein Implementierungsfehler.
12. Gesamte neue Site ist uncommitted/untracked. Es gibt keinen Commit, der das Deployment reproduzierbar enthält.
13. Kein echtes Astra-High-Review wurde bisher durchgeführt.

### Unbekannt oder nicht verifiziert

- vollständige juristische Richtigkeit von Impressum/Datenschutz nach österreichischem/EU-Recht;
- unabhängige Belege für alle App-Funktionsclaims, aktuelle Gerätekompatibilität und Store-/Releasezustand außerhalb der verfügbaren Quellen;
- tatsächliche Produktionswirkung am noch nicht verbundenen `fotosafe.weidisoft.net`;
- Search-Console-Status, Indexierung und Felddaten/Core Web Vitals;
- echte Conversion-/Verkaufswirkung;
- vollständige Lizenz-/Rechtekette aller kopierten historischen Assets;
- Verhalten in Safari/iOS, Firefox und echten assistiven Technologien;
- Qualität jeder Route in jedem denkbaren Zwischenbreakpoint;
- Branch-Alias-Identität nach einem zukünftigen Deployment; maßgeblich ist die unveränderliche URL.

## 5. Konkreter unabhängiger Prüfauftrag

### Phase A – Zustand einfrieren

1. Prüfe absoluten Pfad, Root, Branch, HEAD, Remotes, Upstream, Commitzeit und vollständigen Status einschließlich untracked Dateien.
2. Erfasse Dateiinventar; prüfe alle code-, build-, test-, workflow-, content- und dokumentationsrelevanten Dateien. Ignoriere untracked Dateien nicht.
3. Prüfe Hauptworktree und alte GitHub-Produktion read-only auf eigene Änderungen; keine Veröffentlichung oder Reparatur.
4. Halte Auditzeit UTC, Modell/Provider und genaue Preview-URL fest.

### Phase B – Anforderungsmatrix

Erstelle für **jede Anforderung aus Abschnitt 2** eine Matrix mit:

- eindeutiger ID;
- Anforderung;
- Status `PASS`, `PARTIAL`, `FAIL` oder `NOT VERIFIED`;
- Beleg mit `datei:zeile`, Route/URL, HTTP-Messung oder Testartefakt;
- kurze Begründung und ggf. Lücke.

Gruppiere mindestens: Scope/Grenzen, Fakten/Claims, Design/UX, Startseite, Google-Assets/Reviews, Seiten/SEO, Mehrsprachigkeit, Technik, Datenschutz/Recht, Performance, Preview/Production, QA und Abschlussdokumente.

### Phase C – Source/Build/Live

1. Lies Generator, Inhaltsdaten, CSS, JS, package scripts, Tests und Validator vollständig.
2. Prüfe vorhandenes `dist` direkt. Wenn Build/Test reproduziert werden, nur in `/tmp`; vergleiche das temporäre Ergebnis hashbasiert mit originalem `dist`.
3. Inventarisiere alle 19 HTML-Dateien, 18 Routen, Redirects, Sitemap, robots und Header.
4. Prüfe jede lokale interne Referenz und jedes Fragment korrekt relativ zum Dokument.
5. Prüfe alle 18 Live-Routen sowie unbekannte DE-/EN-URLs, Redirectquellen und Zielstatus. Achte auf echte 404 statt Soft-404.
6. Vergleiche lokale öffentliche Artefakte mit Live-Bytes/Hashes. Berichte Match/Abweichung und Methodik. Prüfe auch CSS, JS, XML, robots, Bilder und andere ausgelieferte Assets, nicht nur HTML.
7. Prüfe Live-Response-Header, Content Types, Cacheverhalten, Cookies, CSP/Sicherheitsheader und unerwartete externe Requests.
8. Prüfe, ob ein erfolgreiches Projekt-Testskript wirklich die neue Site testet oder teils nur alte GitHub-Seiten/Analytics-Code. Markiere vacuous/irrelevante Tests.
9. Führe einen Dependency-/Supply-Chain-Basischeck in der Wegwerfkopie durch.

### Phase D – alle Seiten, Links und Inhalte

1. Öffne und prüfe jede DE-/EN-Seite; nicht nur Home und Hauptguide.
2. Prüfe natürliche, vollständige und inhaltlich gleichwertige DE-/EN-Texte, keine deutschen Reste, fehlenden Module oder unpassenden Screenshots.
3. Prüfe Sprachewechsel auf das echte Gegenstück, Navigation, Breadcrumbs, Footer, Hilfe-Karten, kontextuelle Links, Sprunganker, FAQ/Details, Lightbox und 404-Navigation.
4. Prüfe jeden Google-Play-CTA und das endgültige Listingziel. Prüfe `target`, `rel`, zugängliche Bezeichnung und lokalisierte Badges. Stelle fest, dass ein Bewertungslink fehlt oder vorhanden ist.
5. Prüfe Support-Mailto und alle verwendeten Kontaktadressen. Bekannte Adressen des Betreibers sind `support@weidisoft.net`, `fotosafe@weidisoft.net` und `privacy@weidisoft.net`; nicht jede muss zwingend eingesetzt werden, aber Verwendung und Zweck müssen konsistent sein.
6. Prüfe Produktclaims, Testlaufgrenze, Pro-Kauf, Konto-/Internetnuance, keine falsche Universal-/Sicherheitsgarantie und klare Cloud-/Berechtigungsgrenzen.
7. Prüfe, ob die drei verlangten Suchintentionen wirklich abgedeckt sind oder die Substitution eine Lücke erzeugt.
8. Vergleiche wesentliche alte Inhalte/Fragmente/Assets mit `CONTENT-MAP.md`; melde stille Verluste und unzureichende Redirects.

### Phase E – Responsive und visuell

Nutze einen echten Browser und mehrere Viewports. Mindestens:

- Desktop 1440×900 und 1280×900;
- Tablet/Breakpointnähe, z. B. 768×1024 und um den Header-Breakpoint;
- Mobile 390×844;
- Narrow 320×700.

Für alle 18 Routen mindestens 1280 und 390; für Home, Hilfe, alle sechs Ratgeber, Support, Datenschutz und Impressum zusätzlich 320. Prüfe gezielt:

- `documentElement.scrollWidth === clientWidth`;
- Elemente außerhalb des Viewports, abgeschnittene Texte, Tabellen, lange Wörter/E-Mail-Adressen, Orbit/Dekorationen;
- Header/Nav offen/geschlossen, Sprachelink im Menü, mindestens 44-px-Touchziele;
- Lesbarkeit, Hierarchie, Weißraum, Screenshotgröße/-schärfe/-stretching und lange Seitenrhythmen;
- Dialog/Lightbox mit Maus und Tastatur, Fokus und Escape;
- FAQ, Anker, CTA und Rücknavigation;
- JS deaktiviert: Inhalt, Navigation, Sprachwechsel und Storelinks;
- Reduced Motion;
- Consoleexceptions, Page-Errors, failed network requests und defekte/lazy Bilder.

Frische Screenshots ausschließlich nach `/tmp` schreiben und tatsächlich visuell ansehen. Keine vorhandenen Bilder als aktuelle Laufbeweise übernehmen.

### Phase F – Accessibility

Mindestens:

- Semantik, genau eine H1, Heading-Hierarchie, Landmarken, Skiplink;
- Tastaturreihenfolge, sichtbarer Fokus, Fokusfalle/-rückgabe des Dialogs, Escape;
- Menu-ARIA und `aria-current` nur auf tatsächlicher aktueller URL;
- Alttexte, dekorative Bilder, zugängliche Namen, Linkzweck;
- Touchziele;
- Farbkontrast inklusive Fokuszustände;
- Zoom/Reflow bei 200 % bzw. 320 CSS px;
- Reduced Motion;
- automatischer axe/Lighthouse-Scan auf repräsentativen DE/EN-, Guide-, Hilfe- und Rechtseiten, plus manuelle Prüfung;
- mögliche Probleme des `<dialog>` und der Lightbox für Screenreader dokumentieren.

### Phase G – SEO und strukturierte Daten

Prüfe pro Inhaltsroute:

- Status 200, Sprache, Title, Description, H1;
- self-canonical zum endgültigen Zielhost;
- reziprokes hreflang DE/EN plus begründetes `x-default`;
- OG/Twitter einschließlich Bildstatus/Dimensionen und konsistente URL;
- Sitemapdeckung exakt gegen 16 indexierbare Inhaltsseiten;
- robots/Meta/X-Robots getrennt Preview und hypothetischer Production-Build;
- echte 404 und Slash-/Redirectkonvention;
- interne Crawlpfade/Orphans;
- JSON-LD-Syntax und fachliche Eignung/Wahrheit; konsistente App-Entität; keine erfundenen Ratings/Offers;
- erwartbaren Lighthouse-SEO-Abzug durch Preview-noindex, aber eigenständige Production-Build-Prüfung in `/tmp`;
- keine falsche Behauptung, dass `.pages.dev` indexierbar/Produktionshost ist.

### Phase H – Datenschutz, Recht und Assets

1. Prüfe Source und Browsernetzwerk auf Analytics, Marketing, Remote-Fonts, Scripts, Beacons, Cookies, Storage, Forms, Iframes und Drittanbieterrequests beim Laden und bei Interaktionen.
2. Trenne Appclaim, Seitenruntime, Hosting und Klickziele. Website kann keine App-internen Datenschutzclaims beweisen.
3. Prüfe Cloudflare-Hinweis, keine falsche GitHub-Hosting-Aussage, App/Website-Trennung, Google Play, Betroffenenrechte/Kontakt und Konsistenz DE/EN.
4. Prüfe Impressum und Kontaktwerte auf Konsistenz; keine juristische Freigabe simulieren.
5. Inventarisiere **alle** Dateien unter `assets` und `dist/assets`, markiere referenziert/unreferenziert und prüfe dokumentierte Herkunft/Lizenz.
6. Prüfe offizielle Google-Badges gegen aktuelle Richtlinien, Dateiorigin soweit belegbar, Proportionen, Mindestgröße/Freiraum und Verlinkung.
7. Prüfe FotoSafe-Icon, Sharebild und App-Screenshots auf Quellenbeleg, Sprachparität, private Inhalte, Abmessungen, Kompression und Echtheit. Fehlender Rechtebeleg = nicht automatisch PASS.
8. Bewerte die öffentliche Auslieferung unreferenzierter alter Produktbilder, Hilfevideos und Analytics-Skripte.

### Phase I – Abschlussdokumente

Prüfe `CONTENT-MAP.md`, `SEO-MAP.md`, `ASSET-SOURCES.md`, `DEPLOYMENT.md`, `MAINTENANCE.md`, `HANDOFF.md` und den bestehenden `QA-REPORT.md` auf:

- Vollständigkeit gegenüber ursprünglichem Auftrag;
- reale Pfade, URLs, Commands, Branch/Commit/Status;
- Widerspruchsfreiheit zu Source, `dist` und Live;
- Rollback und Preview/Production-Trennung;
- alle Altinhalte, Legacy-URLs und Fragmente;
- Assetquellen und Nutzungsgrundlage;
- bekannte Lücken statt falscher PASS-Aussagen;
- reproduzierbare Pflege- und Deploymentanweisungen.

## 6. Ergebnisformat und `QA-REPORT.md`

Nach vollständiger read-only Prüfung schreibe als einzige zulässige Projektänderung `/home/hermes/projects/fotosafe-cloudflare-preview/QA-REPORT.md` neu. Der Bericht muss eigenständig verständlich sein und mindestens enthalten:

1. **Audit-Metadaten**
   - UTC-Zeit;
   - tatsächliches Modell und Provider;
   - Pfad, Branch, HEAD, Remotes;
   - Anfangs-/End-Git-Status;
   - geprüfte lokale und Live-Ziele;
   - klare Erklärung der einzigen Berichtsschreibaktion.
2. **Executive Summary**
   - abschließendes Urteil `PASS`, `CONDITIONAL PASS` oder `FAIL`;
   - kurze Begründung;
   - keine Gleichsetzung von grünem Build mit Gesamt-PASS.
3. **Anforderungsmatrix**
   - jede Anforderung mit `PASS`, `PARTIAL`, `FAIL` oder `NOT VERIFIED` und konkretem Beleg.
4. **Prüfprotokoll**
   - Commands/Methoden und reale Ergebnisse für Repository, Build/Test in `/tmp`, Links, Browser/Responsive, Accessibility, SEO, Datenschutz, Assets und Livehashes.
5. **Befunde nach Priorität**
   - `P0`: Launch-/Sicherheits-/Datenverlust-/Rechtsblocker;
   - `P1`: erheblicher Pflichtumfangs-, Funktions-, Accessibility-, Datenschutz- oder SEO-Fehler;
   - `P2`: relevante Qualitäts-/Vollständigkeitslücke;
   - `P3`: kleine Optimierung/Dokumentation.
6. **Jeder Fehler vollständig**
   - eindeutige ID und Priorität;
   - betroffene Seite(n)/Route(n) und `datei:zeile`;
   - Reproduktionsschritte;
   - erwartetes Verhalten;
   - tatsächliches Verhalten;
   - Auswirkung;
   - empfohlene konkrete Korrektur;
   - Status `OPEN`, nicht selbst beheben.
7. **Verifiziert fertig / umgesetzt, nicht unabhängig verifiziert / offen-fehlerhaft / unbekannt** als vier klar getrennte Listen.
8. **Konkrete Builder-Liste**
   - geordnete, ausführbare Arbeiten für einen nachfolgenden Builder-Durchgang;
   - pro Punkt Akzeptanzkriterien und nötige Regressionstests;
   - keine Änderung selbst ausführen.
9. **Launchgrenzen**
   - explizit bestätigen, dass nichts deployt, keine Domain/DNS/Produktion/Search Console geändert und nichts committed/gepusht wurde.

Urteilsregel:

- `FAIL`, wenn P0 oder P1 offen ist oder wesentlicher Pflichtumfang fehlt.
- `CONDITIONAL PASS`, wenn kein P0/P1 offen ist, aber relevante P2-Lücken oder nicht abschließend verifizierbare Freigaben bestehen.
- `PASS` nur, wenn alle Muss-Kriterien belegt sind und keine offenen P0/P1/P2-Befunde bestehen; P3 muss transparent bleiben.

## 7. Abschluss im Chat

Nach dem Schreiben von `QA-REPORT.md`:

- prüfe read-only, dass nur `QA-REPORT.md` gegenüber dem Anfangszustand absichtlich geändert wurde und keine Testartefakte im Projekt verblieben sind;
- gib kurz tatsächliches Modell, Urteil, Zahl der P0/P1/P2/P3-Befunde, Pfad zu `QA-REPORT.md`, Preview-URL und Bestätigung der unveränderten Produktions-/DNS-/Deploymentgrenzen aus;
- führe keine Korrekturen durch und deploye nichts.

Beginne jetzt ohne Rückfrage mit der unabhängigen Prüfung.
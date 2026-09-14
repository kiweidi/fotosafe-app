# FotoSafe — unabhängiger Abschlussaudit

## 1. Executive Summary

**Gesamturteil: FAIL / REQUEST_CHANGES. Keine Launch-, Merge- oder Produktionsfreigabe.**

Die Preview ist technisch gut lauffähig, schnell und im untersuchten Seitenruntimepfad trackingfrei. Dennoch fehlen bestellte Suchintentionen und wesentliche Hilfe, bestehende Deep-Links verlieren ihre Abschnitte, und ein erfolgreicher Test verändert den Production-Build wieder zu Preview. Drei Responsive-Überläufe und weitere Qualitäts-/Freigabelücken schließen einen Gesamt-PASS aus. Grüne Tests und hohe Lighthouse-Werte ändern daran nichts.

**19 deduplizierte OPEN-Befunde:** P0: 0, P1: 4, P2: 11, P3: 4. P0=0 bedeutet kein nachgewiesener akuter Fehler dieser Klasse, nicht juristisch/technisch garantiert risikofrei.

**Positiv unabhängig reproduziert:** 37/37 Tests; Validator: 19 HTML-Dateien, 406 lokale Referenzen, 10 Redirects; Preview-Rebuild 72/72 Dateien identisch; 70/70 öffentliche Previewdateien bytegleich; 21/21 geprüfte Legacy-Produktionsdateien bytegleich. Browser: 18 Routen, 89 Responsive-Kontexte; 268 interne Klickprüfungen und 25 Google-Play-CTA-Klicks.

**Nächste Entscheidung:** zunächst F01–F04 beheben, danach F05–F15 abarbeiten bzw. belegte Freigaben einholen; F16–F19 als kleinere Optimierungen. Anschließend denselben neuen Kandidaten unabhängig nachprüfen. Dieser Bericht ist kein Auftrag, jetzt zu deployen oder Produktionskonfiguration zu ändern.

## 2. Audit-Metadaten und Integritätsgrenze

| Feld | Wert |
| --- | --- |
| Baseline UTC | 2026-09-13T05:47:51.456415+00:00 |
| Berichtskonsolidierung UTC | 2026-09-13T09:59:53.641066+00:00 |
| Tatsächliches Modell / Provider | gpt-6-astra / openai-codex laut aktiver Sitzungsangabe |
| Gewünschter Reviewer | Astra High; Modellfamilie Astra bestätigt, gesonderter High-Reasoning-Level nicht in der Laufzeit ausgewiesen. Keine Behauptung einer verifizierten High-Stufe. |
| Prüfworktree | /home/hermes/projects/fotosafe-cloudflare-preview |
| Branch | feat/cloudflare-premium-site |
| HEAD | 5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79 |
| Commitdatum/Betreff | 5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79 2026-08-18T05:20:36+00:00 docs: announce FotoSafe public Play release |
| Remote | origin	https://github.com/kiweidi/fotosafe-app.git (fetch)<br>origin	https://github.com/kiweidi/fotosafe-app.git (push) |
| Geschützte Arbeitskopie | /home/hermes/projects/fotosafe-app-site — main / origin/main, gleicher HEAD; initial sauber |
| Preview | https://83ad5ea9.fotosafe-app.pages.dev/ |
| Branch-Alias | https://feat-cloudflare-premium-site.fotosafe-app.pages.dev/ |
| Zielhost, NICHT aufgeschaltet | https://fotosafe.weidisoft.net/ — DNS-Auflösung aus Prüfumgebung fehlgeschlagen |
| Geschützte Produktion | https://kiweidi.github.io/fotosafe-app/ |
| Cloudflare-Projektkennung | fotosafe-app laut Host/Übergabe; keine private Konfigurationsänderung |
| Store | https://play.google.com/store/apps/details?id=at.weidi.fotobackup |
| Lokale geprüfte Ausgaben | http://127.0.0.1:43171/ Preview; http://127.0.0.1:43172/ Production; nur temporäre Server |
| Wegwerfkopie | /tmp/fotosafe-independent-audit-fs1vi_cg/copy; gesonderte preview-dist und production-dist |
| Browser | Chromium 148.0.7778.96; Playwright mit separaten Headless-Kontexten; kein Benutzerprofil |
| Lighthouse / axe | Lighthouse 13.4.0, axe-core 4.11.0 |
| Dateiumfang | 216 Originaldateien inkl. untracked, bestehendem dist/reports; 80 Dateien der Hauptkopie |
| Ausschlüsse | .git-Inhalte, node_modules/.cache/.venv und Credential-/Secret-/Token-/PEM-/Env-Namensmuster nicht gelesen; Dateiliste/Status unabhängig erfasst. |
| Einzige zulässige Projektänderung | QA-REPORT.md wird nach Beweiserhebung vollständig ersetzt. Keine Änderung anderer Quelldateien, Artefakte, Reports, Tests, Lockfiles oder Konfiguration. |

Die neue Site ist NICHT Bestandteil des HEAD-Commits. Sie liegt als absichtlich uncommitteter Kandidat vor. Der Bericht bindet die Beurteilung deshalb an das vollständige Baseline-SHA-256-Inventar und Livebytes, nicht nur an den Commit. Subagentberichte waren Hinweise; Ergebnisse wurden konsolidiert, mit realen Ausgaben abgeglichen und nicht doppelt gezählt.

**Vor der Berichtsschreibaktion erneut verifiziert:** beide Inventare exakt gleich zur Baseline (einschließlich altem QA-REPORT), keine neuen/fehlenden Dateien, Gitstatus/Branch/HEAD/Remotes/Log/diff-check unverändert. Der endgültige Nach-Schreib-/Cleanupstatus steht in Abschnitt 9.

<details>
<summary>Vollständiger Anfangs-Git-Status des Prüfworktrees</summary>

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
?? assets/google-play/get-it-on-google-play-de.png
?? assets/google-play/get-it-on-google-play-en.png
?? assets/icons.svg
?? dist/404.html
?? dist/404/index.html
?? dist/_headers
?? dist/_redirects
?? dist/android-fotos-auf-usb-stick-sichern/index.html
?? dist/assets/01-in-drei-schritten-auf-usb-de.png
?? dist/assets/01-in-drei-schritten-auf-usb-de.webp
?? dist/assets/01-three-guided-steps-to-usb-en.png
?? dist/assets/01-three-guided-steps-to-usb-en.webp
?? dist/assets/02-backup-vorher-pruefen-de.png
?? dist/assets/02-backup-vorher-pruefen-de.webp
?? dist/assets/02-review-before-backup-en.png
?? dist/assets/02-review-before-backup-en.webp
?? dist/assets/03-expert-mode-sources-en.png
?? dist/assets/03-expert-mode-sources-en.webp
?? dist/assets/03-expertenmodus-quellen-de.png
?? dist/assets/03-expertenmodus-quellen-de.webp
?? dist/assets/analytics-config.js
?? dist/assets/fotosafe-app-icon.png
?? dist/assets/fotosafe-share.png
?? dist/assets/google-play/get-it-on-google-play-de.png
?? dist/assets/google-play/get-it-on-google-play-en.png
?? dist/assets/icons.svg
?? dist/assets/language-core.js
?? dist/assets/language.js
?? dist/assets/navigation.css
?? dist/assets/navigation.js
?? dist/assets/privacy-analytics-core.js
?? dist/assets/privacy-analytics.js
?? dist/assets/products/a57.webp
?? dist/assets/products/honor600.webp
?? dist/assets/products/otg_cable.webp
?? dist/assets/products/otg_set.webp
?? dist/assets/products/otg_small.webp
?? dist/assets/products/s26.webp
?? dist/assets/products/tested-badge-de.webp
?? dist/assets/products/usba_128.webp
?? dist/assets/products/usba_256.webp
?? dist/assets/products/usba_64.webp
?? dist/assets/products/usbc_128.webp
?? dist/assets/products/usbc_256.webp
?? dist/assets/products/usbc_64.webp
?? dist/assets/screenshot-expert-de.jpg
?? dist/assets/screenshot-result-de.jpg
?? dist/assets/screenshot-start-de.jpg
?? dist/assets/site.css
?? dist/assets/site.js
?? dist/assets/usb-hilfe/01-sicherungsort-aendern.jpg
?? dist/assets/usb-hilfe/02-falscher-speicher.jpg
?? dist/assets/usb-hilfe/03-usb-nicht-erkannt.jpg
?? dist/assets/usb-hilfe/otg-adapter-erklaert-mobil.svg
?? dist/assets/usb-hilfe/otg-adapter-erklaert.svg
?? dist/assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4
?? dist/assets/usb-hilfe/usb-ordnerwahl-video-poster.webp
?? dist/en/404/index.html
?? dist/en/guides/android-photo-backup-strategy/index.html
?? dist/en/guides/back-up-android-photos-to-usb/index.html
?? dist/en/guides/choose-usb-drive-for-android/index.html
?? dist/en/help/index.html
?? dist/en/imprint/index.html
?? dist/en/index.html
?? dist/en/privacy/index.html
?? dist/en/support/index.html
?? dist/foto-backup-strategie-android/index.html
?? dist/hilfe/index.html
?? dist/impressum/index.html
?? dist/index.html
?? dist/privacy/index.html
?? dist/robots.txt
?? dist/sitemap.xml
?? dist/support/index.html
?? dist/usb-stick-fuer-android-auswaehlen/index.html
?? reports/browser-qa-live.json
?? reports/browser-qa.json
?? reports/lighthouse/guide.json
?? reports/lighthouse/home.json
?? reports/screenshots/contact-sheet.png
?? reports/screenshots/guide-de-desktop.png
?? reports/screenshots/guide-de-mobile.png
?? reports/screenshots/guide-desktop.png
?? reports/screenshots/guide-en-desktop.png
?? reports/screenshots/guide-en-mobile.png
?? reports/screenshots/guide-mobile.png
?? reports/screenshots/help-de-desktop.png
?? reports/screenshots/help-de-mobile.png
?? reports/screenshots/help-en-desktop.png
?? reports/screenshots/home-de-desktop.png
?? reports/screenshots/home-de-mobile.png
?? reports/screenshots/home-desktop.png
?? reports/screenshots/home-en-desktop.png
?? reports/screenshots/home-en-mobile.png
?? reports/screenshots/home-mobile.png
?? reports/screenshots/live/guide-de-desktop.png
?? reports/screenshots/live/guide-de-mobile.png
?? reports/screenshots/live/guide-en-desktop.png
?? reports/screenshots/live/guide-en-mobile.png
?? reports/screenshots/live/help-de-desktop.png
?? reports/screenshots/live/help-de-mobile.png
?? reports/screenshots/live/help-en-desktop.png
?? reports/screenshots/live/home-de-desktop.png
?? reports/screenshots/live/home-de-mobile.png
?? reports/screenshots/live/home-de-narrow.png
?? reports/screenshots/live/home-en-desktop.png
?? reports/screenshots/live/home-en-mobile.png
?? reports/screenshots/live/home-en-narrow.png
?? reports/screenshots/live/privacy-de-mobile.png
?? reports/screenshots/live/privacy-de-narrow.png
?? reports/screenshots/live/privacy-en-desktop.png
?? reports/screenshots/live/support-de-desktop.png
?? reports/screenshots/local/guide-de-desktop.png
?? reports/screenshots/local/guide-de-mobile.png
?? reports/screenshots/local/guide-en-desktop.png
?? reports/screenshots/local/guide-en-mobile.png
?? reports/screenshots/local/help-de-desktop.png
?? reports/screenshots/local/help-de-mobile.png
?? reports/screenshots/local/help-en-desktop.png
?? reports/screenshots/local/home-de-desktop.png
?? reports/screenshots/local/home-de-mobile.png
?? reports/screenshots/local/home-de-narrow.png
?? reports/screenshots/local/home-en-desktop.png
?? reports/screenshots/local/home-en-mobile.png
?? reports/screenshots/local/home-en-narrow.png
?? reports/screenshots/local/privacy-de-mobile.png
?? reports/screenshots/local/privacy-de-narrow.png
?? reports/screenshots/local/privacy-en-desktop.png
?? reports/screenshots/local/support-de-desktop.png
?? reports/screenshots/privacy-en-desktop.png
?? reports/screenshots/review-fixes.png
?? reports/screenshots/support-de-desktop.png
?? scripts/browser-qa.py
?? scripts/build-site.js
?? scripts/site-content.js
?? src/site.css
?? src/site.js
```

</details>

<details>
<summary>Anfangs-Git-Status der geschützten Hauptkopie</summary>

```text
## main...origin/main
```

</details>

## 3. Vollständige Anforderungsmatrix

149 einzeln bewertete Anforderungen. Aggregation: PASS: 75, PARTIAL: 65, FAIL: 8, NOT VERIFIED: 1. PASS gilt jeweils nur für den genannten Prüfgegenstand und Scope, nicht die ganze Website. PARTIAL trennt vorhandene Umsetzung von offenen Teilen; NOT VERIFIED ist kein Defektnachweis.

### Scope/Grenzen

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| S01 | Ausschließlich Website; keine Appentwicklung oder neue App-Releaseprüfung | PASS | Auditaktionen und Dateimanifest: nur statische Site, keine Appoperation. |
| S02 | Hauptworktree/GitHub-Produktion, Branch und Workflows unverändert | PASS | Baseline-/Endvergleich und 21/21 gemessene Legacy-Live-Dateien; authentifizierte historische Providerkonfiguration nicht vollständig einsehbar. |
| S03 | Isolierter Featureworktree, untracked Dateien mitprüfen, fremde Änderungen schützen | PASS | 216 Baseline-Dateien; vollständiger Status/Hashvergleich im Anhang. |
| S04 | Cloudflare nur Preview, keine Domain/DNS/Search Console/Indexierungsfreigabe | PASS | Keine schreibenden Provideraktionen; Preview-Header noindex; finaler Host nicht auflösbar. Kein Beweis aller privaten Accountsettings. |
| S05 | Keine App-/Billing-/Play-Console-/Store-URL-Änderung | PASS | Nur öffentliches Listing gelesen/angeklickt; keine Installation/Käufe. |
| S06 | Keine kostenpflichtigen Dienste, Abos, Domains oder Accounts | PASS | Nur vorhandene lokale Werkzeuge und öffentliche GET-Abfragen genutzt. |
| S07 | Keine Secrets lesen/ausgeben/speichern; keine privaten Medien veröffentlichen | PASS | Keine Credentialdateien oder privaten Profile gelesen; gesichtete öffentliche Assets, keine Veröffentlichung. Keine Vollgarantie aller Medienmetadaten/Rechte, F09. |
| S08 | Master schützen; keine Backups/Löschungen/Formatierung/Käufe | PASS | Originalquellen per Hash geschützt; nur eigene temporäre Auditkopie am Ende entfernt. |
| S09 | Keine Ranking-/Traffic-/Umsatz-/Indexierungs-/CWV-Garantie | PASS | Inhaltsreview und dieser Bericht; Labordaten ausdrücklich begrenzt. |
| S10 | Kein Backend/Konto/Checkout/CMS/Frameworkwechsel | PASS | package.json:1–12, scripts/build-site.js; statischer Node-Generator. |
| S11 | Keine erfundenen Bewertungen/Zahlen/Siegel/Preise/Gerätefreigaben | PARTIAL | Keine erfundenen Rating-/Offer-Daten in HTML/Schema gefunden; vollständige App-/Assetfreigaben nicht nachgewiesen, F09/F13. |
| S12 | Audit erst read-only, Tests ausschließlich /tmp, einziger Projektwrite QA-REPORT | PASS | Baseline-/Finalintegrität, verwendete Auditpfade/Commands; Berichtsschreibaktion separat protokolliert. |

### Vorarbeiten

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| V01 | Bestehende DE/EN-Seiten, Anker, Hilfevideos, Assets inventarisieren | PASS | Vollständiges Alt-/Neu-Dateiinventar, Legacy-Fragmentauswertung, 49 Dist-Assets im Anhang; Verluste F02/F03. |
| V02 | Repositoryzusammenhang GitHub/Cloudflare read-only erfassen | PASS | Gitroot, Branch, HEAD, Remotes, Uploadworkflow und Livehashes; F12. |
| V03 | Echtes Cloudflare-Projekt, Deployments, Header, Custom Domains verifizieren | PARTIAL | Unveränderliche Preview und Alias HTTP/livehash geprüft; authentifizierte Projekt-/Custom-Domain-/Rollbackdaten nicht neu unabhängig bestätigt. |
| V04 | Produkt-, Preis-, Geräte-, Veröffentlichungsquellen erheben | PARTIAL | Aktuelles öffentliches Play-Listing DE/EN HTTP 200, Legacytexte; kein Appbinary-/Gerätetest, F13. |
| V05 | Analytics/Consent/externe Ressourcen/Affiliates/Recht inventarisieren | PASS | Source-/Netzwerk-/Header-/Linkanalyse und Privacyreview; aktuelle Site ohne Affiliate-Requests. |
| V06 | Inhalts-/Assetinventar mit Quellen und Faktenliste bestätigt/widersprüchlich/unverifiziert | PARTIAL | CONTENT-/ASSET-MAP vorhanden; Quellenregister/Rechtefreigaben nicht vollständig, F09/F13/F14. |
| V07 | Seiten-/Suchintentionsmatrix | PARTIAL | SEO-MAP bildet reale Routen, nicht vollständig beauftragte Intentionen ab, F01/F02. |
| V08 | Visuelle Richtung und begründete Stackentscheidung | PASS | src/site.css und MAINTENANCE.md:3–12; statischer, kleiner Stack, heller Markenauftritt. |

### Claims

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| C01 | Lokale Kopie auf selbst gewähltes USB-/Speicherziel | PARTIAL | Home/Guide/Playtext stimmen im Grundclaim überein; Appverhalten nicht selbst verifiziert, F13. |
| C02 | FotoSafe löscht Originale nicht | PARTIAL | Sichtbar auf Home und Privacy, keine gegenteilige Websitebehauptung; Website kann Nichtlöschen nicht beweisen. |
| C03 | Bereits Gesichertes bei Folgeläufen überspringen | PARTIAL | Home/Guide/Play-Listing als öffentliche Quelle; reale Wiederholung nicht im Audit erlaubt. |
| C04 | Geführter Ablauf mit Auswahlprüfung und Zielauswahl | PARTIAL | Echte vorhandene Appkompositionen und Text; Hilfeschritte unvollständig, F02/F07. |
| C05 | Kein zusätzliches FotoSafe-Konto und kein FotoSafe-Abo | PASS | Home/Preis-/Privacytexte differenzieren FotoSafe und Google Play; keine Websitekonto-Funktion. |
| C06 | Genau ein erfolgreicher kostenloser Lauf mit bis zu 100 Fotos/Videos, danach Pro | PASS | Home DE/EN Trialnote/Preisabschnitt und öffentliche Listingtexte; keine Wiederholungsfreigabe behauptet. Sichtbarkeit mobil F05. |
| C07 | Pro einmaliger Google-Play-Kauf; aktueller Preis bei Google Play | PASS | Home DE/EN, Installationsziel geprüft; keine erfundene feste Preisangabe. |
| C08 | Werbe-/Tracking-/Medienuploadfreiheit der App nur belegt behaupten | PARTIAL | Store-Selbstauskunft/Websitecopy vorhanden; keine App-interne Prüfung, F13. Website-Runtime separat bestätigt. |
| C09 | Geräte/Systemvoraussetzungen nur mit belastbarer Quelle | PARTIAL | Keine pauschale Galaxy-/USB-Freigabe gefunden; aktuelle Geräte-/Releaseevidenz nicht unabhängig bestätigt. |
| C10 | Testgrenze nicht verstecken, Konto-/Internetnuance verständlich | PARTIAL | Trialnote vorhanden, Google Play Account/Kauf getrennt; 390er First-Viewport zeigt nicht komplette Erklärung, F05. |
| C11 | Keine Verschlüsselung/Zeitpläne/Vollständigkeits-/USB-/Diebstahlschutzgarantie | PASS | Inhaltsreview Home/Guides/Privacy: keine solche universelle Garantie gefunden; lokale Risiken ausdrücklich erwähnt. |
| C12 | Keine Wiederherstellung gelöschter Fotos, aller Appdaten/Chats oder Cloud-Downloads versprechen | PASS | Guide-/FAQ-/Privacytexte begrenzen lokale Medien; keine behauptete Vollgerätesicherung. |
| C13 | Cloud-only und Teilberechtigungen verständlich abgrenzen | PARTIAL | DE kennt lokale/Cloud-/Teilzugriffsgrenzen; EN weniger genaue Vollzugriffsschritte, F02/F07. |
| C14 | Keine Absturz-/Erstattungsstatistik als Garantie | PASS | Neue sichtbare Site/Schema enthält keine solche öffentliche Erfolgsgarantie. |

### Design/UX

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| U01 | Eigenständig, ruhig, premium; kein generisches Effekt-/Keywordtemplate | PASS | Frische Browseransichten, src/site.css; ruhige Blau-/Weiß-/Neutralflächen, Produkt statt Entwicklerkennzahlen. |
| U02 | Echtes FotoSafe-Icon und vorhandene Produktbilder als Basis | PARTIAL | 512×512-Icon/1080×1920-Kompositionen, lokaler/live Hash; exakte aktuelle APK-Identität/Rechte nicht unabhängig belegt, F09/F13. |
| U03 | Helle warme/neutrale Flächen, Kontrast, Weißraum, klare Hierarchie | PARTIAL | Visuell grundsätzlich stimmig; F05 Reflow und F06 Fokuskontrast. |
| U04 | Starker Hero erklärt Android, Fotos/Videos, USB, ohne Cloud | PASS | Home DE/EN H1/Eyebrow/Lead; keine Cloudverwechslung im sichtbaren Nutzen. |
| U05 | Echter groß lesbarer Screenshot, keine erfundene UI | PARTIAL | Vorhandene lokalisierte Appkompositionen, Lightbox mit 1080×1920; mobil klein/spät, keine unabhängige Geräteherkunftsfreigabe. |
| U06 | First viewport beantwortet Produkt/Zielgruppe/Nutzen/Testmöglichkeit | PARTIAL | DE 390er Screenshot: Nutzen/Play vorhanden, Trial/Pro-Erklärung reicht über 844px; F05. |
| U07 | Primär Google Play, sekundär Ablauf/Hilfe | PASS | Home und Klickprüfung aller 25 Store-CTAs; 268 interne Klickinstanzen ohne falsches Ziel. |
| U08 | Lesbarkeit für ältere/weniger technikaffine Nutzer, keine winzigen grauen Texte | PARTIAL | Basis 16–17px, Lead groß; Screenshotinnenbeschriftung/First-Viewport und Touch/Fokus F05/F06. |
| U09 | Keine übermäßigen Glows/Partikel/Autoplay/Scroll-Hijacking/Animationen | PASS | Source/Browser: keine solche Runtime, nur dekorative Orbits und CSS-Smoothscroll. |
| U10 | Screenshots vergrößerbar, Tastatur/Escape, Fokus | PASS | src/site.js:25–48; Enter öffnet, Close/Escape schließen, Triggerfokus zurück. Background inert bestätigt; Screenreader separat NOT VERIFIED. |
| U11 | Mobile Nav, offener/geschlossener Zustand, Menü-Sprachlink | PASS | 18-Routenmatrix, aria-expanded/Escape/Fokusrückgabe/Boundingboxcontainment; kein früherer aria-current-Elternfehler mehr. |
| U12 | 44px-Touchziele, Fokuskontrast, Reduced Motion | PARTIAL | Navigation ausreichend, TOC/Footer kleiner und heller Fokus zu schwach F06; Reduced-Motion-CSS vorhanden/Browserprofil geprüft. |

### Startseite

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| H01 | Hero mit offiziellem Badge und ehrlicher Test-/Pro-Erklärung | PARTIAL | Alle Elemente vorhanden DE/EN; F05 mobile Hierarchie. |
| H02 | Nutzenzeile lokal/Originale/kein Abo | PASS | Home DE/EN Trust-/Nutzenabschnitte. |
| H03 | USB anschließen → Ziel/Medien prüfen → starten → Kopien kontrollieren | PARTIAL | Ablauf-/FAQmodule vorhanden, konkrete Systemschritte in Anleitung unvollständig F02. |
| H04 | Echte Ansichten Auswahl/Vorschau/Backup | PARTIAL | Drei Sprachpaare eingebunden; Quelle Projektmaterial, nicht unabhängig aktuelle App-Releasebeweise. |
| H05 | Zusätzliche lokale Kopie ohne Angstwerbung/falschen Cloudvergleich | PASS | Home/Strategie nennt lokale Kopie und Grenzen ohne Verlust-/Sicherheitsgarantie. |
| H06 | Kosten/Testlauf/Voraussetzungen/Hilfe-Einstieg | PASS | Preis-/Help-/Guidepfade und Trialnote DE/EN vorhanden. |
| H07 | Entscheidungsrelevante FAQ | PARTIAL | 17 Details-Instanzen bedient; EN-Help FAQ-Umfang geringer F07. |
| H08 | Abschluss-CTA, Support und Recht | PASS | Footer/Header und finale Home-CTAs geklickt/geprüft. |
| H09 | Keine prominenten Buildnummern/TargetSDK/JVM-/Releaseprozessargumente | PASS | Home-Verkaufsnarrativ statt Entwicklerstatus. |

### Google/Reviews

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| G01 | Offizielle sprachpassende DE-/EN-Badges, kein Nachzeichnen/Bildersuche | PASS | Beide Google-Dateien HTTP 200, SHA-256 identisch zum ausgelieferten Badge; Hashes im Anhang. |
| G02 | Badge-Proportionen/Mindestgröße/Freiraum | PARTIAL | 646×250 Original, 194×75 Darstellung proportional, lokale Einbettung; vollständige Markenfreigabe und alle Clear-Space-Konstellationen nicht zertifiziert. |
| G03 | Quellen/Nutzungsrichtlinie dokumentiert; lokales Hosting | PASS | ASSET-SOURCES.md und frisch abgerufene Google Marketing-/Badge-/Linkingquellen; neue Runtime lokal. |
| G04 | Badge richtiges Listing/zugaengliche Bezeichnung/Tabschutz | PASS | Alle 25 realen Instanzen im Browser, Package at.weidi.fotobackup; aria/alt, noopener+noreferrer, Neuer-Tab-Hinweis. |
| G05 | Bei blockiertem Originaldownload Text-CTA statt Imitation | PASS | Bedingung nicht eingetreten: offizielle Downloads erfolgreich; keine Imitation nötig. |
| G06 | Dezenter Bewertungslink DE/EN auf verlässliches Ziel | FAIL | F08; Installationslink ist nicht der beauftragte Bewertungsaufruf. |
| G07 | Keine geratenen Bewertungsparameter/Dialoggarantie/Gating/Belohnung/Fakebadge | PASS | Keine entsprechenden Mechanismen; fehlender Reviewlink separat F08. |

### Seiten/Intentionen

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| I01 | Produkt, ausgezeichnete Hilfe und drei eigenständige Suchaufgaben | FAIL | F01/F02; Hardware/3-2-1 ersetzen Methodenwahl/Samsung nicht vollständig. |
| I02 | USB-Anleitung: Direktantwort, Voraussetzungen, sicherer Ablauf, echte Bilder | PARTIAL | Vorhanden, aber entscheidende Zielordnerdetails fehlen F02. |
| I03 | Ehrliche manuelle Dateimanageralternative; Kopieren versus Verschieben | PARTIAL | DE substanzieller Vergleich, EN nur Kurzabsatz F07; keine Aufforderung Originale zu verschieben. |
| I04 | Berechtigungen, richtiges USB-Ziel, Kopienkontrolle | PARTIAL | Grundbegriffe/Richtig-Falsch DE vorhanden, Vollständigkeit F02/F07. |
| I05 | Folgesicherungen/Überspringen, Problemhilfe und Links | PASS | Guide-/Home-Text und interne Links; Appverhalten nicht getestet. |
| I06 | Keine fast identische zweite USB-Keywordseite | PASS | Hardware/Strategie haben eigenständige Themen; fehlenden Pflichtumfang heilt das nicht. |
| I07 | Ohne-Cloud-Methodenwahl USB/PC/vorhandene Speicheroptionen vergleichen | FAIL | F01; Strategie allein ersetzt keine Methodenentscheidung. |
| I08 | Methodenwahl nennt Aufwand/Kontrolle/Voraussetzungen/Grenzen | FAIL | F01; entsprechende übergreifende Entscheidungsmatrix fehlt. |
| I09 | Lokal nicht automatisch verschlüsselt/unzerstörbar; zusätzliche Kopien sicher lagern | PASS | Strategie-/Risikoinhalte DE/EN; keine Vollsicherheitsgarantie. |
| I10 | FotoSafe als Android-USB-Option, Durchführung nur passend verlinken | PARTIAL | USB-Verlinkung vorhanden; umfassende Methodenwahl fehlt F01. |
| I11 | Samsung: reale Screens, One UI, Eigene Dateien, Medien-/USB-/Zielauswahl | FAIL | F02: kein neuer Samsung-/Galaxy-/My-Files-Abschnitt. |
| I12 | Variable Samsung-Begriffe, S23 nur mit Quelle, keine Galaxy-Pauschalgarantie | PARTIAL | Keine unzulässige neue Pauschalgarantie gefunden; verlangte spezifische Hilfe fehlt F02. |
| I13 | Samsung sonst als begründeter Abschnitt in Hauptanleitung zurückstellen | FAIL | Zurückstellung genannt, verlangter eingebetteter Ersatz nicht vorhanden, F02. |
| I14 | Problemorientierter Hilfehub: Start/Medien/USB/Ziel/Test-Pro/Kontakt | PARTIAL | Karten/FAQs/Support vorhanden, Diagnoseführung an kritischen Stellen zu dünn F02. |
| I15 | Diagnose nur als sinnvolle Hilfeseite, keine dünne Werbe-Keywordseite | PASS | Kein zusätzlicher duplizierter Diagnosewerbepfad. |
| I16 | Vorhandene Videos/Bildschritte/Warnungen/Empfehlungen sinnvoll einordnen | FAIL | F02/F03/F09; wichtige Hilfe entfällt, Medien dennoch öffentlich kopiert. Produktwerbung bewusst weggelassen, nicht ungeprüft restaurieren. |
| I17 | Jeden wesentlichen Altinhalt neuer Ort/zusammengeführt/entfernt mit Grund | PARTIAL | CONTENT-MAP vorhanden, unvollständige fachliche Migration/Fragmentliste F14. |
| I18 | Alte .html-Pfade/Fragmente gezielt erhalten, nicht pauschal Home | PARTIAL | Zehn richtige 301-Zielrouten, aber relevante Fragmente gebrochen F03. |
| I19 | Affiliates sekundär/markiert/sponsored, getestet unterscheiden, Bildrechte/Ziele | PARTIAL | Keine Affiliate-Einbindung in neuer Runtime; Empfehlungen bewusst entfallen. Kopierte Produktbilder weiterhin Rechteproblem F09; alte Händlerziele nicht sämtlich neu live gecheckt. |

### Mehrsprachigkeit

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| L01 | Natürliches präzises Deutsch/idiomatisches Englisch ohne Stuffing/Wortziel | PASS | Vollständiger Textreview; unterschiedliche natürliche Formulierungen, keine künstlichen Wortmengentests als Qualitätspass. |
| L02 | DE Root, EN unter /en/, vollständige Gegenstücke inkl. Recht | PARTIAL | Neun reale Paare und funktionierende Switches; fehlende Pflichtintentionen und Inhaltsparität F01/F02/F07. |
| L03 | Sprachwechsel zur selben Seite statt Home | PASS | 18 Seiten, reziproke Pfade und tatsächliche Klicks; 404-Unbekanntfall F15 separat. |
| L04 | Kein deutscher Resttext in EN-Komponenten/Screenshots | PARTIAL | Lokalisierte Badges/6 WebP und sichtbare EN-Inhalte geprüft; EN-No-JS-404 deutsch F15, automatische Bildsprachtests schwach F10. |
| L05 | Fehlende echte EN-Assets offen behandeln, nie fälschen | PARTIAL | Neue Kompositionen paarweise vorhanden; alte DE-Video-/Systemdialoghilfe ohne sichtbaren EN-Ersatz entfallen F02. |
| L06 | Keine IP-/Browsersprachzwangsweiterleitung | PASS | src/site.js und Templates; nur pfadbasierter EN-404-JS-Fallback, keine Sprachpräferenzverfolgung. |

### Technisches SEO

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| T01 | Individuelle Titles/Descriptions, eine H1, logische Hierarchie | PASS | 18 eindeutige Routentitles/Descriptions, keine Heading-Skips; 404.html absichtliche Fallbackkopie. |
| T02 | Gleichsprachiges Self-Canonical zum finalen Host | PASS | Alle 19 HTML-Metadaten geprüft; keine EN→DE-Kanonisierung. Finale HTTP-Erreichbarkeit separat noch nicht gegeben. |
| T03 | Reziproke hreflang inkl. Selbstreferenz nur echte Paare | PASS | 19 HTML-Prüfung/18 Routen; echte Sprachpaare. Inhaltliche Qualitätsunterschiede F07. |
| T04 | x-default nur begründet | PARTIAL | Jeweils DE als Default; technisch konsistent, bewusste Fallbackentscheidung nur schwach dokumentiert F14. |
| T05 | Crawlbare kontextuelle HTML-Links, keine Orphans | PASS | Parser/Crawlgraph: keine verwaisten Inhaltsseiten; 268 Browserlinkprüfungen. |
| T06 | Statischer Kerninhalt, Navigation/Storelinks ohne JS | PASS | Alle 18 No-JS-Routen, sichtbare Navigation und Gegenstückklick; Layout-/EN404-Ausnahmen F05/F15. |
| T07 | Sitemap exakt freigegebene kanonische 200-Inhalte, keine 404/Redirects/Previewhosts | PASS | 16 finale Inhalts-URLs, keine fehlenden/zusätzlichen; Previewseite selbst absichtlich noindex. Production-Build separat geprüft. |
| T08 | lastmod nur echte Änderungen | PASS | Keine unbelegten lastmod-Werte in aktueller Sitemap. |
| T09 | robots, echte 404, Slash-/Index-Konvention, kein SPA-Soft404 | PARTIAL | Unbekannte Pfade initial 404, Index/Slash 308, Legacy 301; EN-Fehlerlokalisierung JS-abhängig F15. |
| T10 | OG/Twitter/Sharebild/Icon/Favicon konsistent | PARTIAL | OG-Titles/URLs/1200×630-Sharebild und Icon lokal/live vorhanden; finaler OG-Bildhost noch nicht aktiv, spätere Social-Fetches nicht verifiziert. |
| T11 | Wahrheitsgemäßes Breadcrumb-/WebSite-/App-Markup, konsistente Appentität | PARTIAL | Gültiges JSON, keine Fakeclaims, aber Vorlagen-/Sprachpaarkonsistenz F17. |
| T12 | Keine erfundenen Rating/Review/Price/Offer-Daten | PASS | Alle JSON-LD-Blöcke und sichtbaren Inhalte geprüft. |
| T13 | FAQ für Menschen, keine FAQ-/HowTo-Rich-Result-Versprechen | PASS | Details bedienbar, keine solche Garantie; HowTo-Syntax ist keine Rich-Result-Freigabe. |
| T14 | Home verkauft, Guide erklärt; keine duplizierten Titles/Einstiege | PASS | Eindeutige Metadaten und eigenständige Module; Scope-Lücken separat F01/F02. |

### Stack/Performance

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| P01 | Einfacher wartbarer statischer Ansatz mit wiederverwendbaren DE/EN-Inhalten | PASS | Node-Generator/Contentmodule/Layout; keine Frameworkabhängigkeiten. |
| P02 | Wenig JS/keine unnötigen UI-/Animationslibraries | PASS | Neue site.js 1.647 Bytes, DOM-only; ältere unbenutzte Scripts F09. |
| P03 | Fonts lokal/System, keine Remote-Fonts | PASS | CSS-Systemstack und 89 Browserkontexte ohne Third-Party-Ladeanfragen. |
| P04 | Bildabmessungen/moderne Formate/Hero-Priorität/Lazy-Bilder | PARTIAL | WebP/width-height/fetchpriority/lazy vorhanden; weitere Größenoptimierung F19. |
| P05 | Videos mit Poster, ohne Autoplay/Komplettdownload | PARTIAL | Keine Videos eingebunden, daher kein Autoplay/Download; bestellte hilfreiche Videos fehlen F02, kein funktionaler Videoplayer-PASS. |
| P06 | Mobiles Lighthouse Performance möglichst ≥90, A11y ≥95 | PASS | Sieben frische Läufe, Performance 98–100, Accessibility 100; Labor, kein vollständiger A11y-Nachweis. |
| P07 | LCP ≤2,5s, CLS ≤0,1 als dokumentiertes Ziel | PASS | Gemessene Läufe LCP bis 2408,361ms und CLS 0; keine Allroute-/Felddatengarantie. |
| P08 | INP ≤200ms nur Felddatenziel, kein Lighthousebeweis | NOT VERIFIED | Keine Felddaten/CrUX/Search Console; TBT 0 ersetzt INP nicht. |
| P09 | Keine CWV-Erfolgsaussage ohne Felddaten | PASS | Bericht und geprüfte Site grenzen Labor-/Launchstatus ab. |

### Datenschutz/Recht

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| D01 | Preview/Erststart ohne optionale Analytics-/Marketinganfragen | PASS | Source und 89 Browserkontexte: keine Fremdrequests beim Laden; Store erst nach Klick. |
| D02 | Alte Umami-Konfiguration/IDs nicht blind übernehmen | PARTIAL | Nicht in neuer Runtime geladen; alte öffentlich kopierte Dateien bleiben F09. |
| D03 | Spätere Statistik standardmäßig aus und separat freigeben; cookieless nicht einwilligungsfrei | PASS | Keine aktuelle Statistikaktivierung/Consentbehauptung; spätere Freigabe ausdrücklich offen. |
| D04 | Privacy an Cloudflare anpassen, App/Hosting/Play/Analyse/Händler trennen | PARTIAL | Cloudflare korrekt benannt, Google Play/Appdaten getrennt, keine Händler im neuen Runtimepfad; fachliche Freigabe F13. |
| D05 | Bestätigte Impressums-/Kontaktdaten, Pflichtlücken melden, nichts erfinden | PARTIAL | Konsistent zu Legacy/gegebenen Kontakten, keine unabhängige juristische/Betreiberbestätigung F13. |
| D06 | Betroffenenrechte/Privacykontakt konsistent DE/EN | PASS | privacy@weidisoft.net, Auskunft/Berichtigung/Löschung/Einschränkung/Widerspruch/Behörde in beiden Texten; rechtliche Vollständigkeit nicht garantiert. |
| D07 | Keine Cookies/Storage/Forms/Iframes/Beacons ohne dokumentierten Bedarf | PASS | Neue Runtime-/Netzwerkprüfung ohne solche optionalen Mechanismen; Hostingverarbeitung nicht durch Browser ausschließbar. |
| D08 | Support-/Kontaktzwecke konsistent, Mailto funktioniert | PASS | 8 Links per Klick abgefangen: FotoSafe-Support und Impressum fotosafe@, Datenschutz privacy@; kein Versand/keine Zustellprüfung, support@ muss nicht genutzt werden. |

### Preview/Launch

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| B01 | Lokale und Live-Preview-QA; tatsächliche Header und konsistentes noindex | PASS | 70/70 Live-Dateien, globale X-Robots/Meta/robots; fünf Live-Lighthouseziele. |
| B02 | Preview-/Production-Konfiguration und finaler Build separat testen | PARTIAL | Separater Production-Build gelungen, aber Test überschreibt Modus F04; hostabhängige spätere Trennung nicht bewiesen. |
| B03 | Keine Domain/HTTPS-/DNS-/Zertifikats-/Routingaufschaltung jetzt | PASS | Keine entsprechende Aktion; geplanter Host nicht auflösbar aus Prüfumgebung. |
| B04 | Kein Entfernen von noindex, keine Search-Console-Einreichung | PASS | Keine Änderung/Einreichung; Accountstatus selbst NOT VERIFIED. |
| B05 | Keine App-/Storelinks/alte GitHub-URLs umstellen | PASS | Hauptworktree und gemessene Legacybytes unverändert, keine Consoleaktion. |
| B06 | Später HTTPS/Routing/Canonical/Assets/pages.dev-Duplikate/Search Console/Sitemap prüfen | PARTIAL | Runbook mit Gates vorhanden, Hosttrennung/Commands lückenhaft F04/F11/F14. |
| B07 | Vorbereitet/eingereicht/abrufbar/indexiert trennen | PASS | Dieser Bericht: Preview abrufbar; final nicht aufgeschaltet; nichts eingereicht, Indexierung unbekannt. |
| B08 | Parallelbetrieb nicht vollständiger SEO-Umzug; spätere URL-Migration separat | PARTIAL | Grenzen vorhanden; echte Fragmentmigration fehlt F03 und spätere Migration gesondert freizugeben. |

### Pflicht-QA

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| Q01 | Browser lokal/live, Screenshots frisch erstellen und wirklich ansehen | PASS | Neue Audit-Screenshots in /tmp, frische Einzelbilder und Kontaktbögen; keine Builderbilder als aktuelle Beweise übernommen. |
| Q02 | Home/Hilfe/jede Guidevorlage DE/EN; übrige Routen automatisiert | PASS | Alle 18 Routen im Browser und kompletter HTML-/Link-/Metadatenparser. |
| Q03 | Desktop 1280/1440, Tablet/Breakpoint, 390 und 320 samt Overflow | PARTIAL | 89 Kontexte, Vollmatrix 18×1280/390/320 plus Zusatzbreiten; reale Fehler F05, daher kein Qualitäts-PASS. |
| Q04 | Nav/Switch/CTA/Anker/FAQ/Lightbox/Video bedienen | PARTIAL | 268 interne Links, 25 Storelinks, 17 FAQs, 11 Screenshotinstanzen ergänzend, Mailto abgefangen; kein Videoplayer vorhanden F02. |
| Q05 | Keyboard/Fokus/Escape/Kontrast/Semantik/Touch plus Auto-A11y | PARTIAL | 18 Tastaturfolgen, axe 12 Routen, Lighthouse; F06/F16. Kein echter Screenreader/nativer Browserzoom. |
| Q06 | Ohne JS Inhalt/Nav/Store benutzbar | PARTIAL | 18 No-JS-Routen, funktionierende Links; Hardwareoverflow/englischer unbekannter Fehlerpfad F05/F15. |
| Q07 | Lazy-Bilder/Privatinhalte/Stretching/Lesbarkeit prüfen | PARTIAL | Bilder geladen/dekodiert/visuell betrachtet; keine Vollfreigabe aller unbenutzten Video-Frames/Metadaten/Rechte, F09. |
| Q08 | Alle internen Referenzen/Assets/Fragmente/hreflang/Canonical | PARTIAL | Neue 406 Referenzen ohne Defekte; alte verwaiste Fragmentziele F03. |
| Q09 | Konsole/Pageerrors/Netzwerk/Third Parties | PASS | 89 Kontexte: 0 Errors, 0 failed requests, 0 Third-Party-Ladeziele; explizite Storeklicks separat. |
| Q10 | Build/Lint/Tests/Schema/Sitemap/Dependencycheck | PARTIAL | 37/37, Validator/JSON/Sitemap, npm audit 0; kein eigenes Lintscript, Legacyanteil/Modefehler F04/F10. |
| Q11 | Echte 404/Robots/Header Preview und Production | PARTIAL | Initiale Live-404 und isolierter Production-Build bestätigt; EN-Fallback/Hosttrennung F04/F15. |
| Q12 | Lighthouse archivieren; noindex-Abzug erklären; Production-SEO extra | PARTIAL | Sieben neue Läufe, Production-SEO 100; Metriken/Hashes im Bericht, rohe /tmp-Artefakte gemäß Auftrag am Ende entfernt, keine dauerhafte Roharchivierung vorgetäuscht. |
| Q13 | Live gegen Build alle Dateien/Hashes und Deployment-ID | PARTIAL | 72/72 Rebuild und 70/70 öffentliche Livebytes; immutable Hostkennung 83ad5ea9 bestätigt, volle authentifizierte Deployment-UUID nicht erneut geprüft. |
| Q14 | GitHub-Seite und Deploymentkonfiguration danach read-only unverändert | PARTIAL | Hauptworktreehashes/Workflow unverändert; 21 Legacydateien live passend. Private historische Cloudflare-/Pages-Settings nicht vollständig einsehbar. |
| Q15 | Kein PASS bei erheblichem offenem Fehler | PASS | Gesamturteil FAIL aufgrund F01–F04; grüne Tests getrennt. |

### Abschlussdokumente

| ID | Anforderung | Status | Konkreter Beleg / Grenze |
| --- | --- | --- | --- |
| A01 | CONTENT-MAP vollständige Altinhalt-/Legacy-/Fragment-/Sprachmigration | PARTIAL | Vorhanden, zentrale Verluste F02/F03/F14 nicht ausreichend gelöst/inventarisiert. |
| A02 | SEO-MAP URLs/Sprachen/Intention/Titles/Descriptions/Canonical/Gegenstücke/Links | PARTIAL | Reale Routen/Metadaten stimmen weitgehend; fehlende bestellte Intentionen und vollständige Linkmatrix F01/F14. |
| A03 | ASSET-SOURCES Herkunft/Nutzungsbasis aller Bilder/Google-Assets | PARTIAL | Google-Origin bestätigt, umfassende Rechtekette/öffentliche Altassets offen F09. |
| A04 | QA-REPORT echte Tests/Ergebnisse/Bilder/Limits/offene Punkte | PASS | Dieser unabhängige Ersatzbericht, vollständige Tabellen/Befunde und ehrliche Grenzen; Rohscreenshots werden auftragsgemäß entfernt. |
| A05 | DEPLOYMENT reproduzierbare Commands/ID/Modi/Rollback/Launchcheckliste | FAIL | F04/F11/F14; fehlende Scripts und unzuverlässiger Modusablauf. |
| A06 | Kurze Pflege für Texte/Bilder/Übersetzung/Ratgeber/Metadaten | PARTIAL | MAINTENANCE.md:14–42 hilfreich; Build-/QA-Betriebslücken F04/F10/F11. |
| A07 | 30-/60-/90-Tage-Plan dokumentiert, keine automatischen Jobs | PARTIAL | Keine Jobs angelegt; vollständiger abgestimmter Nachlaunchplan nicht unabhängig als geliefert bestätigt, F14. |
| A08 | HANDOFF/Auditprompt aktuell und nicht als Eigenbeweis verwenden | PARTIAL | Hinweise geprüft statt PASS übernommen; Handoff-Lücken F14. Modellkennung gpt-6-astra/openai-codex, High-Stufe nicht nachgewiesen. |

## 4. Reales Prüfprotokoll

### 4.1 Repository, Rebuild und Tests

Gitkommandos wurden nur lesend in den Originalworktrees ausgeführt. Build/Test/npm audit und eigene Fixture-Mutationen liefen ausschließlich unter /tmp. Die Baseline-Kopie umfasst tracked und untracked Dateien; keine Stash-/Reset-/Stage-/Commit-/Pushoperation.

| Befehl / Methode | Ziel | Ergebnis |
| --- | --- | --- |
| git status --short --branch --untracked-files=all; git rev-parse HEAD; git remote -v; git diff --check | beide Originalworktrees | vor Bericht vollständig identisch zur Baseline; abschließende Integrität §9 |
| npm run check | temporäre copy | Exit 0; npm test: 37 pass, 0 fail/skipped/cancelled; Validator 19 HTML / 406 Referenzen / 10 Redirects |
| npm audit --audit-level=high --json --cache <audit>/npm-cache | temporäre copy | Exit 0; 0 gemeldete Schwachstellen; sehr kleiner dependencyfreier Sitestack, kein umfassender Sicherheitspass |
| npm run build:production | temporäre copy | Exit 0; 18 Routen; 16 Inhalte index,follow; drei 404-HTML-Artefakte noindex,nofollow |
| SHA-256 Rebuild gegen bestehendes dist | preview-dist | 72 Dateien; 0 fehlend, 0 zusätzlich, 0 unterschiedlich |
| build:production → npm test → Robots erneut lesen | separater temporärer Reproduktionstest | Exit 0, aber index,follow → noindex,nofollow; F04 |
| npm run validate / npm run serve | temporäre copy | beide Exit 1, Missing script; F11 |
| Node-18-Teilprüfung eines Reviewers | temporäre copy | 36/37; toSorted fehlt in Node 18; vorgesehene Node-22-Umgebung liefert 37/37. Kein Sitebug aus diesem Umgebungsfehler abgeleitet. |
| EN-WebP-Negativfixture | temporäre Kopie, kein Originalwrite | deutscher WebP-Pfad vom bestehenden Lokalisierungstest akzeptiert; F10 |
| python3 http_audit.py / browser_audit.py, Erstversuch | /tmp mit System-Python | Exit 1: bs4 bzw. playwright fehlen; Wiederholung mit bestehendem Hermes-venv-Python erfolgreich, keine erfundene Ersatzantwort |

<details>
<summary>Reale Kommandoausgabe: npm run check</summary>

```text

> check
> npm test && node scripts/validate-site.js


> test
> npm run build && node --test tests/*.test.js


> build
> node scripts/build-site.js

Built 18 pages for preview in /tmp/fotosafe-independent-audit-fs1vi_cg/copy/dist
TAP version 13
# Subtest: analytics configuration defaults to privacy-preserving Umami settings
ok 1 - analytics configuration defaults to privacy-preserving Umami settings
  ---
  duration_ms: 0.978943
  type: 'test'
  ...
# Subtest: all planned browser events have an allowlist schema
ok 2 - all planned browser events have an allowlist schema
  ---
  duration_ms: 0.28325
  type: 'test'
  ...
# Subtest: configuration never includes visible product names or affiliate target URLs
ok 3 - configuration never includes visible product names or affiliate target URLs
  ---
  duration_ms: 0.408555
  type: 'test'
  ...
# Subtest: every German public page has a directly corresponding English page
ok 4 - every German public page has a directly corresponding English page
  ---
  duration_ms: 12.733554
  type: 'test'
  ...
# Subtest: page pairs expose canonical and reciprocal hreflang metadata
ok 5 - page pairs expose canonical and reciprocal hreflang metadata
  ---
  duration_ms: 7.083764
  type: 'test'
  ...
# Subtest: every page pair has accessible corresponding-language links
ok 6 - every page pair has accessible corresponding-language links
  ---
  duration_ms: 5.261632
  type: 'test'
  ...
# Subtest: English pages keep local navigation inside /en and contain no German screenshot assets
ok 7 - English pages keep local navigation inside /en and contain no German screenshot assets
  ---
  duration_ms: 2.61687
  type: 'test'
  ...
# Subtest: English pages contain no residual German user-facing copy
ok 8 - English pages contain no residual German user-facing copy
  ---
  duration_ms: 4.280485
  type: 'test'
  ...
# Subtest: shared language selector honours manual preference and only auto-selects English from German routes
ok 9 - shared language selector honours manual preference and only auto-selects English from German routes
  ---
  duration_ms: 1.127472
  type: 'test'
  ...
# Subtest: English home uses the three matching English FotoSafe screenshots
ok 10 - English home uses the three matching English FotoSafe screenshots
  ---
  duration_ms: 1.323588
  type: 'test'
  ...
# Subtest: provider requires an enabled HTTPS script and UUID website id
ok 11 - provider requires an enabled HTTPS script and UUID website id
  ---
  duration_ms: 2.117986
  type: 'test'
  ...
# Subtest: first visit and rejection never append the Umami script
ok 12 - first visit and rejection never append the Umami script
  ---
  duration_ms: 0.670716
  type: 'test'
  ...
# Subtest: acceptance loads one strictly configured script and GPC overrides it
ok 13 - acceptance loads one strictly configured script and GPC overrides it
  ---
  duration_ms: 0.962702
  type: 'test'
  ...
# Subtest: events are allowlisted and only sent after provider readiness
ok 14 - events are allowlisted and only sent after provider readiness
  ---
  duration_ms: 0.575557
  type: 'test'
  ...
# Subtest: withdrawing consent reloads an active tracker but first-time rejection does not
ok 15 - withdrawing consent reloads an active tracker but first-time rejection does not
  ---
  duration_ms: 0.263013
  type: 'test'
  ...
# Subtest: provider readiness is refused when consent or privacy state changes during loading
ok 16 - provider readiness is refused when consent or privacy state changes during loading
  ---
  duration_ms: 0.285785
  type: 'test'
  ...
# Subtest: a failed provider load can be retried without bypassing consent
ok 17 - a failed provider load can be retried without bypassing consent
  ---
  duration_ms: 0.268794
  type: 'test'
  ...
# Subtest: consent is accepted only when version, choice and expiry are valid
ok 18 - consent is accepted only when version, choice and expiry are valid
  ---
  duration_ms: 0.995273
  type: 'test'
  ...
# Subtest: GPC and DNT are treated as privacy signals
ok 19 - GPC and DNT are treated as privacy signals
  ---
  duration_ms: 0.274043
  type: 'test'
  ...
# Subtest: event sanitizing keeps only schema values and rejects URL-like data
ok 20 - event sanitizing keeps only schema values and rejects URL-like data
  ---
  duration_ms: 1.097405
  type: 'test'
  ...
# Subtest: campaign extraction only returns centrally allowed values
ok 21 - campaign extraction only returns centrally allowed values
  ---
  duration_ms: 1.473479
  type: 'test'
  ...
# Subtest: referrers are reduced to controlled source classes
ok 22 - referrers are reduced to controlled source classes
  ---
  duration_ms: 0.310361
  type: 'test'
  ...
# Subtest: before-send payload strips query, hash, raw title and raw referrer
ok 23 - before-send payload strips query, hash, raw title and raw referrer
  ---
  duration_ms: 0.314138
  type: 'test'
  ...
# Subtest: build emits the complete DE/EN route inventory
ok 24 - build emits the complete DE/EN route inventory
  ---
  duration_ms: 11.253191
  type: 'test'
  ...
# Subtest: every page has one h1, language metadata, canonical and no third-party runtime
ok 25 - every page has one h1, language metadata, canonical and no third-party runtime
  ---
  duration_ms: 7.61551
  type: 'test'
  ...
# Subtest: preview is blocked from indexing at document and HTTP-manifest level
ok 26 - preview is blocked from indexing at document and HTTP-manifest level
  ---
  duration_ms: 4.712073
  type: 'test'
  ...
# Subtest: DE and EN navigation, locale pairing and touch controls are present
ok 27 - DE and EN navigation, locale pairing and touch controls are present
  ---
  duration_ms: 1.688121
  type: 'test'
  ...
# Subtest: English pages use only English-localised app screenshots
ok 28 - English pages use only English-localised app screenshots
  ---
  duration_ms: 3.000809
  type: 'test'
  ...
# Subtest: English counterparts preserve the substantive module structure
ok 29 - English counterparts preserve the substantive module structure
  ---
  duration_ms: 1.904236
  type: 'test'
  ...
# Subtest: aria-current marks only the actual current navigation URL
ok 30 - aria-current marks only the actual current navigation URL
  ---
  duration_ms: 2.328691
  type: 'test'
  ...
# Subtest: guides state the safety-critical workflow and use structured data
ok 31 - guides state the safety-critical workflow and use structured data
  ---
  duration_ms: 1.408969
  type: 'test'
  ...
# Subtest: support and privacy reflect the no-form, no-analytics architecture
ok 32 - support and privacy reflect the no-form, no-analytics architecture
  ---
  duration_ms: 2.022447
  type: 'test'
  ...
# Subtest: all meaningful images have dimensions and alternative text attributes
ok 33 - all meaningful images have dimensions and alternative text attributes
  ---
  duration_ms: 3.648612
  type: 'test'
  ...
# Subtest: legacy routes redirect to stable new paths
ok 34 - legacy routes redirect to stable new paths
  ---
  duration_ms: 0.879717
  type: 'test'
  ...
# Subtest: project-hosted 404 routes English unknown paths to the English error page
ok 35 - project-hosted 404 routes English unknown paths to the English error page
  ---
  duration_ms: 0.812752
  type: 'test'
  ...
# Subtest: Pages deployment runs the site checks before uploading
ok 36 - Pages deployment runs the site checks before uploading
  ---
  duration_ms: 0.979153
  type: 'test'
  ...
# Subtest: Pages deployment requires a configured analytics website id
ok 37 - Pages deployment requires a configured analytics website id
  ---
  duration_ms: 0.358852
  type: 'test'
  ...
1..37
# tests 37
# suites 0
# pass 37
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 105.809168
Site validation passed: 19 HTML files, 406 local references, 10 redirects.
```

</details>

<details>
<summary>Reale Kommandoausgabe: npm audit --audit-level=high --json --cache /tmp/fotosafe-independent-audit-fs1vi_cg/npm-cache</summary>

```text
{
  "auditReportVersion": 2,
  "vulnerabilities": {},
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 0,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 0
    },
    "dependencies": {
      "prod": 1,
      "dev": 0,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "total": 0
    }
  }
}
```

</details>

### 4.2 HTTP, Links und ausgelieferte Identität

Alle 70 öffentlich abrufbaren Dateien des 72-Dateien-dist geprüft; `_headers` und `_redirects` sind Hostkonfiguration, keine normalen öffentlichen Assets. Livehashes stimmen vollständig. HTML-Fallback/Slashnormalisierung kann 308 vorschalten; Tabelle zeigt Endstatus. Zehn .html-Migrationen antworten gezielt 301, aber Inhaltsfragmente fehlen (F03). Unbekannte DE/EN-Pfade antworten initial 404, keine pauschale SPA-Homeantwort.

Branch-Alias: HTTP 200, Homehash identisch, `X-Robots-Tag: noindex, nofollow`. Zielhost: DNS-Auflösungsfehler zum Messzeitpunkt; keine Aussage über sämtliche privaten DNSsettings. HTML/Assets mit `nosniff`, `strict-origin-when-cross-origin`, Permissions-Policy gegen Kamera/Mikrofon/Geolocation. Kein Set-Cookie in den erfassten Seitenantworten. CSP fehlt (F18).

268 interne Linkinstanzen wurden tatsächlich bedient und erreichten das erwartete URL-/Fragmentziel der NEUEN Site. Diese Aussage umfasst NICHT verlorene alte Fragment-IDs. Alle 25 Store-CTA-Instanzen öffneten das richtige FotoSafe-Listing; keine Installation/Kaufaktion. Acht Mailtolinks auf sechs Routen wurden per Klick geprüft, der externe Mailclient-Aufruf absichtlich abgefangen; kein Versand und keine Zustellgarantie.

### 4.3 Browser, visuelle Prüfung und Interaktion

Alle 18 Routen bei 1280×900, 390×844 und 320×700; zusätzliche Home-/Hardware-/Breakpunktkontexte ergeben 89. Frische Screenshots wurden nur nach /tmp geschrieben und Einzelbilder/Kontaktbögen wirklich angesehen. Jede Bildressource vor Decodeprüfung in den Viewport gescrollt. Netzwerk-/DOMmetriken ersetzen nicht visuelle Interpretation.

| Route | Viewport | scrollWidth / clientWidth | Befund |
| --- | --- | --- | --- |
| /usb-stick-fuer-android-auswaehlen/ | [390, 844] | 412 / 390 | F05 |
| /usb-stick-fuer-android-auswaehlen/ | [320, 700] | 343 / 320 | F05 |
| / | [901, 900] | 961 / 901 | F05 |

Die frühere DE-Home-320px-Orbitkorrektur ist wirksam; der neu gefundene 901px-Fall ist ein anderer Grenzbereich. Hardware-DE ist sowohl visuell angeschnitten als auch geometrisch zu breit. Ansonsten ruhige Gestaltung, lokalisierte Produktbilder und funktionierende Vergrößerung. Kein angeblicher visueller PASS für jede mögliche Schrift-, Betriebssystem- oder Zoomkombination.

FAQ-Details wurden geöffnet/geschlossen; mobile Navigation einschließlich Escape, Fokus und geometrischer Sprachlinkcontainment geprüft; aktive Elternrubrik nicht fälschlich aria-current=page. 18 No-JS-Routen mit Kerninhalt/Navigation/Sprachlinks geprüft; F05 und EN-unbekanntes-404 F15 bleiben Ausnahmen. Reduced-Motion-Profil berücksichtigt.

Lightbox: 11 ergänzende Bildinstanzen geöffnet, Bildabmessungen und Close geprüft; Tastatur Enter/Escape und Fokusrückgabe getestet. Die erste simple backTrap-Messung war false. Gezielter Nachtest DE/EN zeigt jedoch: Tab kann Browserchrome fokussieren (document.hasFocus=false, activeElement=BODY), aber Hintergrund-Link lässt sich bei offenem modalem Dialog nicht fokussieren. Deshalb KEIN behaupteter Fokusfluchtfehler in den Seitenhintergrund. Echter Screenreadervergleich bleibt offen.

### 4.4 Accessibility und Grenzen

axe-core 4.11.0 auf 12 repräsentativen Routen, Lighthouse zusätzlich auf sieben Zielen. Zwei Home-Landmarkwarnungen und leerer DE-Tabellenkopf (F16). H1/Heading/Alt-/Namens-/Skiplink-/ARIA-Prüfungen ergänzen die Automatiken. Heller Fokusorange-Kontrast unter 3:1 und mehrere <44px-Ziele (F06); 44px ist hier Projektanforderung, nicht pauschal die WCAG-AA-Minimumregel.

320-CSS-px-Reflow geprüft und teilweise fehlgeschlagen. Zusätzlich CSS zoom=2 auf Privacy ohne gemessenen Overflow; das war ausdrücklich KEIN nativer 200%-Browserzoom. Kein NVDA/JAWS/VoiceOver-/TalkBack-Nachweis, keine Crossbrowser-Safari-/Firefox-/Realgerät-Zertifizierung. Kein uneingeschränkter WCAG-Konformitätspass. Halbtransparente Farbwerte nicht als solide Kontrastbeweise übernehmen.

### 4.5 SEO / Lighthouse

19 HTML-Dateien entsprechen 18 logischen Routen plus identischem 404-Fallback. 18 eindeutige Titles und Descriptions, je eine H1, keine gemessenen Hierarchiesprünge. 16 Sitemap-Inhaltsziele exakt, keine Orphans/Metadatenparserfehler. Canonicals/OG zeigen auf noch nicht aktiven finalen Host; Referenzziele im Previewartefakt geprüft, zukünftige Abrufbarkeit am finalen Host nicht behauptet. JSON-LD gültig, keine erfundenen Ratings/Offers; F17 semantische Konsistenz.

| Lauf / URL | UTC | Perf. | A11y | Best Pr. | SEO | LCP ms | CLS | TBT ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| local-preview-home — http://127.0.0.1:43171/ | 2026-09-13T05:57:19.681Z | 99 | 100 | 100 | 69 | 1951.475 | 0 | 0 |
| local-production-home — http://127.0.0.1:43172/ | 2026-09-13T05:57:30.568Z | 99 | 100 | 100 | 100 | 1951.207 | 0 | 0 |
| live-home — https://83ad5ea9.fotosafe-app.pages.dev/ | 2026-09-13T05:57:41.364Z | 98 | 100 | 100 | 69 | 2408.361 | 0 | 0 |
| live-en — https://83ad5ea9.fotosafe-app.pages.dev/en/ | 2026-09-13T05:57:52.464Z | 99 | 100 | 100 | 69 | 2250.276 | 0 | 0 |
| live-help — https://83ad5ea9.fotosafe-app.pages.dev/hilfe/ | 2026-09-13T05:58:03.636Z | 100 | 100 | 100 | 69 | 1207.054 | 0 | 0 |
| live-en-guide — https://83ad5ea9.fotosafe-app.pages.dev/en/guides/back-up-android-photos-to-usb/ | 2026-09-13T05:58:14.648Z | 100 | 100 | 100 | 69 | 1220.378 | 0 | 0 |
| live-privacy — https://83ad5ea9.fotosafe-app.pages.dev/privacy/ | 2026-09-13T05:58:25.668Z | 100 | 100 | 100 | 69 | 1260 | 0 | 0 |

Der Preview-SEO-Wert 69 ist konkret mit Lighthouse `is-crawlable: 0` belegt: Meta-noindex, Live-X-Robots und robots-Disallow. Nicht bloß vermutet. Lokaler Production-SEO-Wert 100 zeigt den korrekt gebauten hypothetischen Modus, nicht dessen sichere Pipeline oder Deploymentfreigabe. Keine Felddaten/INP-/Core-Web-Vitals-/Ranking-/Indexierungsgarantie; TBT 0 beweist kein INP.

### 4.6 Datenschutz, Recht und Assetprüfung

Source plus 89 Browserkontexte wurden auf externe Ladungen, Cookies/Storage/Forms/Iframes/Fonts/Scripts geprüft. Neue Runtime lädt lokal, keine beobachteten automatischen Drittanbieteranfragen, Console/Pageerrors oder fehlgeschlagenen Requests in dieser Matrix. Storeklicks kontaktieren Google ausdrücklich nach Aktion. Hosting verarbeitet zwangsläufig HTTP-Anfragen; keine Aussage, dass Cloudflare keine IP-/Sicherheitslogs verarbeitet. Appclaims bleiben außerhalb des Websitebeweises.

49 ausgelieferte Assets sind vollständig im Anhang aufgeführt; 36 unreferenziert, 5.307.327 Bytes. Unreferenziert schützt nicht vor direktem Zugriff. Google-Badgebytes stimmen mit den offiziellen abgerufenen DE/EN-Dateien überein; Bildproportionen, eingebundene Sprache und Storeziel geprüft. Keine vollständige juristische Asset-/Impressums-/Datenschutzfreigabe simuliert. Vorhandene Produkt-/Videodateien nicht allein wegen Altbestand als rechtsgeklärt behandelt.

## 5. Priorisierte Befunde und verbindliche Builder-Liste

Alle folgenden Befunde sind **OPEN**. Nichts davon wurde durch diesen Audit repariert. Die Nummerierung ist zugleich die vorgeschlagene Arbeitsreihenfolge; zusammengehörige Änderungen zuerst in einer getrennten Builder-Runde planen. P0 = akuter Launch-/Sicherheits-/Datenverlust-/Rechtsblocker; P1 = erheblicher Pflichtumfangs-/Funktionsfehler; P2 = relevante Qualitäts-/Freigabelücke; P3 = kleine Optimierung. Fehlende juristische Evidenz allein wird nicht als nachgewiesene Rechtsverletzung/P0 bezeichnet.

### F01 — P1 — Pflicht-Suchintention „ohne Cloud“ durch anderes Thema ersetzt — OPEN
- **Ort/Beleg:** `/foto-backup-strategie-android/`, EN-Gegenstück; `scripts/site-content.js:23,41`; `CONTENT-MAP.md:46–48`; beide generierten Guide-Dateien `:5`.
- **Reproduktion:** Strategie-Ratgeber DE/EN vollständig lesen und mit der geforderten Methodenwahl USB versus PC-Kopie versus vorhandene Speicheroptionen vergleichen.
- **Erwartet:** eigenständige, sachliche Entscheidungshilfe mit Aufwand, Kontrolle, Voraussetzungen und Grenzen; konkrete USB-Durchführung nur verlinkt.
- **Tatsächlich:** 3-2-1, Rhythmus, Kontrolle und Risiken sind vorhanden, aber kein substantieller Methodenvergleich. Die Hardwareseite ist nützlich, erfüllt diese Suchintention ebenfalls nicht. Drei Ratgeber-URLs sind kein Beweis für die drei bestellten Aufgaben.
- **Auswirkung:** wesentlicher beauftragter Inhalt und Einstieg für unentschlossene Nutzer fehlen; Auftrag nicht abnahmefähig.
- **Korrektur/Builder-Akzeptanz:** DE/EN-Methodenwahl mit konkreter Vergleichsmatrix, PC- und weiteren tatsächlich verfügbaren Optionen, Aufbewahrung/Verlustgrenzen erstellen oder Strategie-Ratgeber entsprechend fundiert erweitern. Hardwarebeitrag darf zusätzlich bleiben. Keine neue dünne Keywordkopie. Route/Title/Description/Sitemap/Links und CONTENT-/SEO-MAP zusammen aktualisieren.
- **Regression:** inhaltliche Checkliste je Methode/Locale, separate Einstiege zur Produktseite und Anleitung, Crawl-/hreflang-/Canonical-Tests; manuelle Prüfung, dass keine Option pauschal als sicher/verschlüsselt gilt.

### F02 — P1 — Wesentliche reale Zielordnerhilfe und Samsung-Fallback fehlen — OPEN
- **Ort/Beleg:** `/hilfe/`, `/en/help/`, beide USB-Anleitungen; alt `hilfe.html:364–451`, `en/help.html:365–449`; neu `scripts/build-site.js:56–63`, besonders `:58`; `scripts/site-content.js:37`; `CONTENT-MAP.md:11,40–48`.
- **Reproduktion:** von Hilfe zur USB-Anleitung gehen; Zielauswahl und Vollzugriff mit der alten Schrittfolge vergleichen. In allen 19 HTML-Dateien nach Samsung/Galaxy/Eigene Dateien/My Files suchen.
- **Erwartet:** verständlicher kompletter Systemdialogablauf, richtigen/falschen Speicher unterscheiden, Ordner erstellen/verwenden und Freigabe bestätigen; Samsung-spezifische Hilfe mit belastbaren Quellen oder begründet eingebetteter Samsung-Abschnitt statt eigener Route.
- **Tatsächlich:** DE endet im Zielschritt weitgehend bei „Wähle dort den USB-Datenträger“; Ordner erstellen/verwenden/Zulassen fehlen. EN ist noch knapper. Keine der 19 HTML-Dateien enthält den geforderten Samsung-Abschnitt. Die existierenden S23-Zielordnerbilder, OTG-Grafiken und das DE-Hilfevideo werden nicht eingebunden. Ihre Existenz beweist keine aktuelle Universalkompatibilität, erlaubt aber auch nicht, die fehlende Hilfe als vollständig zu deklarieren.
- **Auswirkung:** weniger technikaffine Nutzer können gerade am entscheidenden Android-Dialog nicht nachvollziehbar bis zur Kopie geführt werden. Wesentlicher Altinhalt und Pflichtumfang verloren.
- **Korrektur/Builder-Akzeptanz:** reale, nichtdestruktiv belegte Zielordnerschritte und Fehlerzustände DE/EN zurückführen. Bestehende Medien erst auf Aktualität, Rechte und Privatinhalte prüfen; EN fehlende lokalisierte Medien offen kennzeichnen statt fälschen. Samsung-Abschnitt mit variablen One-UI-Begriffen und Quellen, oder separate Seite nur bei genügend Eigenwert. S23-Beobachtung nicht auf alle Galaxy-Geräte übertragen.
- **Regression:** Ende-zu-Ende-Lesetest bis „Ordner verwenden/Zulassen“, Teil-/Vollzugriff, USB nicht erkannt, anschließende Kopienkontrolle; Medien-Decode, Video-Poster/kein Autoplay, Keyboard, 320/390/Desktop und DE/EN-Entscheidungsparität.

### F03 — P1 — Legacy-Hilfe-Deep-Links verlieren ihre Ziele — OPEN
- **Ort/Beleg:** `dist/_redirects:1,6`; `hilfe.html:350–355,364–467,481–485`, `en/help.html:351–356,365–464,478–482`; `src/site.js:1–48`; `CONTENT-MAP.md:41–45`.
- **Reproduktion:** Preview `/hilfe.html#medienzugriff`, `#video`, `#otg`, `#auswahlhilfe` sowie `/en/help.html#media-access` und `#anleitung` öffnen. Nach 301 den Hash gegen `document.getElementById(decodeURIComponent(location.hash.slice(1)))` prüfen.
- **Erwartet:** alter Link erreicht den passenden übernommenen Abschnitt oder eine gezielte fachlich passende Ersatzstelle; auch ohne JavaScript sinnvoll.
- **Tatsächlich:** Redirect führt nur zum neuen Hub; Browser behält das Fragment, aber das Zielelement fehlt. 20/20 tatsächlich benutzte Legacy-Hilfe-Navigationsanker fehlen im neuen Ziel. 76/76 alte IDs der zehn migrierten Altpfade fehlen insgesamt; diese größere Zahl enthält auch Layout-/ARIA-IDs und ist ausdrücklich NICHT mit 76 kaputten Nutzerlinks gleichzusetzen.
- **Auswirkung:** alte App-/Store-/Support-/Suchlinks verlieren ihre inhaltliche Zielgenauigkeit. Ein 301 mit anschließendem 200 beweist keine Fragmentmigration.
- **Korrektur/Builder-Akzeptanz:** alle relevanten Altfragmente je Sprache inventarisieren; kompatible IDs an geeigneten neuen Inhalten oder gezielte echte Legacy-Seiten/Weiterleitungen verwenden. Fragmente werden nicht an HTTP-Server gesendet; keine behauptete serverseitige Hash-Regel. Keine pauschale Home-Umleitung.
- **Regression:** Browsernavigation sämtlicher 20 bekannter Hilfe-Links, mit/ohne JS, exakter Zielabschnitt und sinnvoller Viewport; weitere Altpfade gezielt prüfen. CONTENT-MAP pro Fragment mit Umsetzung statt Absicht.

### F04 — P1 — Erfolgreicher Test ersetzt Production-Artefakt durch Preview — OPEN
- **Ort/Beleg:** `package.json:6–9`; `scripts/build-site.js:8,35–40,78–91`; `DEPLOYMENT.md` Production-Abschnitt; temporärer Reproduktionstest `production_test_overwrites`.
- **Reproduktion (nur Wegwerfkopie):** `npm run build:production`; Robots-Meta prüfen; danach `npm test`; dasselbe Artefakt erneut lesen.
- **Erwartet:** Tests validieren exakt das Production-Artefakt, ohne es still in einen anderen Deploymentmodus umzubauen; spätere Hostingtrennung bleibt überprüfbar.
- **Tatsächlich:** vorher `index,follow`, `npm test` Exit 0, nachher `noindex,nofollow`. `test` ruft unbedingtes Preview-`build` auf. Umgebungsweit erzwungene Production-Ausführung steht zudem im Konflikt mit Preview-Erwartungen der Tests. Ein eigener Production-Build funktioniert, der dokumentierte Prüf-/Veröffentlichungsablauf ist trotzdem nicht sicher.
- **Auswirkung:** nach grünem Test könnte das falsche Artefakt veröffentlicht werden. Umgekehrt ist eine indexierbare `.pages.dev`-Kopie bei künftigem Production-Upload nicht hostseitig ausgeschlossen. Im Audit wurde nichts davon deployt.
- **Korrektur/Builder-Akzeptanz:** Buildmodus explizit und unveränderlich durch Pipeline führen; Tests eines bestehenden Artefakts von dessen Erzeugung trennen; Preview-/Production-Ausgaben und Hostingregeln getrennt verifizieren. `.pages.dev`-noindex darf beim späteren finalen Hostlaunch nicht versehentlich entfallen. Keine Produktionsumschaltung ohne neue Freigabe.
- **Regression:** Hashes und Meta/Header/Sitemap vor/nach jeder Teststufe, 16 Production-Inhaltsseiten indexierbar nur im isolierten Build, drei 404-Artefakte weiterhin noindex; Preview-Hosts noindex unabhängig vom späteren Zielhost. Negativtests für falschen Modus.

### F05 — P2 — Drei Responsive-Überläufe, mobiler Hero zu lang — OPEN
- **Ort/Beleg:** `src/site.css:1–2`, Selektoren `.article-hero-grid`, `.article-hero h1`, `.orbit-one`, `.hero`; DE Hardwareguide und `/`; Browsermatrix und frische Screenshots.
- **Reproduktion:** Hardwareseite mit 390×844 und 320×700; DE Home mit 901×900. `document.documentElement.scrollWidth` mit `clientWidth` vergleichen.
- **Erwartet:** kein horizontaler Dokumentoverflow; vollständige Wörter/Karten, lesbare H1; erster Viewport erklärt Testmöglichkeit vollständig.
- **Tatsächlich:** Hardware 412/390 bzw. 343/320; Home 961/901. Hardware-H1 „zusammenpassen“ und Kurzantwortkarte ragen sichtbar hinaus. 901 liegt unmittelbar oberhalb des 900er Layoutbreakpoints. Der 320er Home-Orbitfix funktioniert, löst aber nicht diesen anderen Breakpoint. Auf DE Home bei 390 beginnt die Testinformation erst tief im ersten Viewport; die vollständige Pro-Erklärung reicht unter 844 px, der Produktscreenshot folgt darunter.
- **Auswirkung:** mobile Lesbarkeit/Reflow verletzt; Umbruch an langen deutschen Wörtern und Zwischenbreiten nicht robust. Hero-Information auf kleinsten Geräten unnötig spät.
- **Korrektur/Builder-Akzeptanz:** intrinsische Grid-/Min-Width-Ursache und langes Wort sinnvoll umbrechen; Orbit relativ zum Container skalieren, nicht nur Overflow verstecken. Hero-Abstände/Typografie so gewichten, dass Test-/Pro-Grenze früh sichtbar bleibt.
- **Regression:** alle 18 Routen 1280/390/320; Home/Hardware um 680 und 900 ±1 px, 768 und 1440; No-JS, lange Texte/Adressen, 200%-Browserzoom. Breiten-Gleichheit UND visuelle Kontrolle ohne abgeschnittenen Inhalt.

### F06 — P2 — Fokuskontrast und ausdrücklich verlangte 44-px-Ziele nicht durchgängig erfüllt — OPEN
- **Ort/Beleg:** `src/site.css:1–2`; globale `:focus-visible`, `.toc a`, `.footer-brand`, Breadcrumb-Links; alle Routen.
- **Reproduktion:** mit Tab Navigation/TOC/Supportlinks durchlaufen; Outlinefarbe und Hintergrund messen. Bei 390 px Linkrechtecke auslesen.
- **Erwartet:** klar sichtbarer Fokus auf allen Flächen; mindestens 3:1 Nichttext-Kontrast als Prüfmaßstab; projektseitig geforderte 44-px-Touchflächen für eigenständige Kontrollen.
- **Tatsächlich:** Orange `#e99b24` auf Weiß 2,2879:1, auf `#f5f8fa` 2,1452:1. TOC-Zeilen sind 40 px hoch, Footer-Brand 40 px; Breadcrumblinks circa 23,8 px hoch. Hauptnavigation/Menu sind ausreichend groß. Kleine Inline-/Breadcrumblinks sind nicht pauschal ein WCAG-2.2-AA-Verstoß, aber die strengere Projektanforderung ist nicht überall erfüllt.
- **Auswirkung:** schwacher Tastaturfokus auf hellen Seiten und kleinere als bestellte Touchflächen.
- **Korrektur/Builder-Akzeptanz:** kontraststarker oder zweifarbiger Fokus, gemessen gegen tatsächliche Nachbarfarben; eigenständige TOC-/Footer-/Bedienelemente mindestens 44×44 CSS px oder nachvollziehbar dokumentierte Ausnahme für Fließtext.
- **Regression:** helle/dunkle/Hover-/Fokuszustände, Tab/Shift+Tab, Mobile und Zoom; Kontrastberechnung mit Alpha-Compositing. Die Auditwerte für halbtransparenten dekorativen Prozessnummerntext sind NICHT als belastbarer Kontrastnachweis verwendet.

### F07 — P2 — DE/EN-Module sind nicht vollständig entscheidungsgleich — OPEN
- **Ort/Beleg:** DE USB `scripts/build-site.js:58,60`; EN `scripts/site-content.js:37`; Hilfe `scripts/site-content.js:15–19,35`; `HANDOFF.md:29,35,52`.
- **Reproduktion:** beide USB-Anleitungen und Hilfe-Hubs abschnittsweise vergleichen, nicht nur Zahl der Sections zählen.
- **Erwartet:** vollständige natürliche Gegenstücke mit denselben wesentlichen Entscheidungen und Hilfen.
- **Tatsächlich:** EN lässt gegenüber DE den konkreten Vollzugriff-Einstellungsweg, Richtig/Falsch-Zielvergleich und die ausführliche FotoSafe/Dateimanager-Tabelle einschließlich Kosten weg. Hilfe hat DE vier FAQs, EN drei. Die EN-Texte sind lesbar und die neuen WebP-Screens sind lokalisiert, aber Strukturparität ist keine Inhaltsparität.
- **Auswirkung:** englischsprachige Nutzer erhalten weniger entscheidungsrelevante Unterstützung; Handoff-PASS zu weitreichend.
- **Korrektur/Builder-Akzeptanz:** semantische Modul-/Entscheidungsmatrix DE↔EN aufbauen und fehlende Inhalte idiomatisch ergänzen; keine identische Wortzahl erzwingen. Supportverlinkung bleibt auch unabhängig von FAQ verfügbar.
- **Regression:** menschlicher Pair-Review, medienbezogene Sprache, Preis-/Berechtigungsnuancen und alle Gegenstücklinks; Inhaltstest muss fehlende Vergleichs-/Zielmodule erkennen.

### F08 — P2 — Geforderter zurückhaltender Bewertungslink fehlt — OPEN
- **Ort/Beleg:** Footer `scripts/build-site.js:28–32`, Supportseiten; Listingkonstante `:9`, Badge `:24`, EN `scripts/site-content.js:31`.
- **Reproduktion:** alle Links in 19 HTML-Dateien auf Bewertung/Review durchsuchen; Footer/Support DE/EN öffnen.
- **Erwartet:** neutraler Link „FotoSafe bei Google Play bewerten“ beziehungsweise EN-Entsprechung, ohne positive Vorauswahl oder Dialoggarantie.
- **Tatsächlich:** 25 CTA-Instanzen auf 18 Routen sind Installations-/Listinglinks; zusätzlicher identischer Link im 404-Fallback. Kein ausdrücklicher Bewertungsaufruf.
- **Auswirkung:** kleiner, aber ausdrücklich bestellter Conversion-/Feedbackpfad fehlt.
- **Korrektur/Builder-Akzeptanz:** dezenter lokalisierter Footer-/Supportlink auf das bestätigte Listing, ohne erratene Parameter; keine Belohnung, Review-Gating oder Behauptung eines direkten Bewertungsdialogs.
- **Regression:** Klick bis Listing, zugänglicher Name, `_blank`-Hinweis/rel sofern verwendet; keine automatische externe Anfrage vor Klick.

### F09 — P2 — Unreferenzierte Altassets öffentlich, Rechtefreigaben nicht vollständig — OPEN
- **Ort/Beleg:** `scripts/build-site.js:78–80`; `ASSET-SOURCES.md:27–45`; vollständiges Assetinventar im Anhang.
- **Reproduktion:** alle Dateien in `assets/` und `dist/assets/` gegen aus HTML/CSS/JS erreichbare Referenzen abgleichen; unbenutzte Pfade direkt von Preview laden.
- **Erwartet:** nur beabsichtigte, freigegebene Webassets ausliefern; Herkunft UND Nutzungsgrundlage dokumentieren; Master schützen.
- **Tatsächlich:** kompletter Altordner wird kopiert. 49 Dist-Assets, davon 36 unreferenziert mit insgesamt 5.307.327 Bytes, darunter Produktempfehlungsbilder, Hilfevideo/JPGs, PNG-Masterderivate und alte Analytics-/Sprach-/Navigationsscripts. Direkt abrufbar und livehash-identisch. Dokumentation benennt vorhandenes Projektmaterial, belegt aber nicht jede Bildrechtekette. Offizielle Google-Badges sind gesondert positiv verifiziert.
- **Auswirkung:** unnötige öffentliche Lizenz-/Disclosurefläche und Deploymentballast. Unreferenziert bedeutet nicht privat. Keine aktive Trackingwirkung aus bloßer Verfügbarkeit ableiten: neue Seiten laden diese Scripts nicht.
- **Korrektur/Builder-Akzeptanz:** explizite Build-Asset-Allowlist; ungebrauchte Kopien aus Ausgabe ausschließen, Quellen/Master nicht löschen. Pro Bild Urheber/Quelle/Nutzung/Freigabe erfassen; ungeklärte Produktbilder nicht veröffentlichen. Rechtebereinigte Hilfemedien aus F02 bewusst wieder zulassen.
- **Regression:** Ausgabe-Pfadsettest, Negativ-HTTP-Test für ausgeschlossene Dateien bei neuem Deployment, Quellen unverändert, keine Third-Party-Requests, alle benötigten Bilder/Videos intakt.

### F10 — P2 — Grüne Tests überschätzen neue Site; EN-Screenshot-Test wirkungslos gegen WebP — OPEN
- **Ort/Beleg:** `tests/site-structure.test.js:6–152`, besonders `:60–64`; `tests/localization.test.js:6–16,87–104`; drei Analytics-Testdateien; `tests/workflow.test.js:5–15`; `scripts/validate-site.js:39–64`; `scripts/browser-qa.py`.
- **Reproduktion:** Testimports/Assertions nach Prüfgegenstand zählen; in einer Wegwerfkopie EN-Screenshot-Referenz durch existierendes deutsches WebP ersetzen und betreffenden Test ohne vorherigen Neubuild ausführen.
- **Erwartet:** klar getrennte Legacy-/Preview-Abdeckung; Negativtests erfassen echte neue Assetformate, Pflichtmodule, Fragmente und kritische Breakpoints.
- **Tatsächlich:** 37 Fälle = 12 neue Site, 23 Legacy, 2 Workflow. Der Lokalisierungstest lehnt nur passende deutsche PNG-Pfade ab, akzeptiert aber deutsches WebP im EN-Fixture. Validator prüft aktuelle Referenzen, nicht verschwundene Altfragmente. Bestehende Builder-Browsermatrix findet die neu gemessenen Hardware-/901px-Fehler nicht.
- **Auswirkung:** irreführende Sicherheit trotz grüner Checks; Regressionen können unbemerkt passieren.
- **Korrektur/Builder-Akzeptanz:** Suites benennen/trennen, WebP/PNG/JPG/SVG sprachbezogen testen, Missing-Module-/Legacy-/Viewport-Negativtests ergänzen; keine Entfernung nützlicher Legacytests nötig. Testfixture nur temporär.
- **Regression:** jede neue Negativmutation muss reproduzierbar rot werden; anschließend unverändertes Original grün. Node 22 festhalten, nicht Node-18-`toSorted`-Fehler als Produktbug ausgeben.

### F11 — P2 — Dokumentierte Prüf-/Serverbefehle existieren nicht — OPEN
- **Ort/Beleg:** `DEPLOYMENT.md:19–38`; `package.json:5–10`; `scripts/browser-qa.py:13–17`.
- **Reproduktion:** in sauberer Wegwerfkopie `npm run validate` und `npm run serve` ausführen.
- **Erwartet:** dokumentierter Weg baut, validiert und startet den richtigen Ausgabebaum; Live-QA hat explizite Basis/Dateinamen.
- **Tatsächlich:** beide Exit 1 „Missing script“. Browser-QA erwartet standardmäßig bereits laufenden Server auf 4173; der dokumentierte Start funktioniert nicht. Live-Base/Reportlabel müssen explizit gesetzt werden.
- **Auswirkung:** Nachfolger kann QA nicht nach Anleitung reproduzieren; Gefahr falscher/staler Ziele.
- **Korrektur/Builder-Akzeptanz:** tatsächlich vorhandene Befehle dokumentieren oder in eigener Builder-Runde passende Scripts ergänzen; lokaler Server bindet nur localhost; Preview/Production-Modus aus F04 beachten. Live-QA-Beispiel mit exaktem `QA_BASE_URL`, `QA_REPORT`, `QA_RUN_LABEL` und Screenshotpfaden.
- **Regression:** Runbook in frischer temporärer Kopie von Anfang bis Ende ausführen, URL/Title/Artefakthash prüfen; kein Deployment dafür nötig.

### F12 — P2 — GitHub-Workflow würde anderes Artefakt hochladen als geprüft — OPEN
- **Ort/Beleg:** `.github/workflows/pages.yml:29–40`; `package.json:6–9`; `tests/workflow.test.js:7–15`.
- **Reproduktion:** Workflow statisch verfolgen: `npm run check` baut/validiert `dist`, Upload nutzt `path: .`; Analytics-ID-Pflicht wird nur als vorhandener Text getestet.
- **Erwartet:** später klar getrennter GitHub-Legacy-/Cloudflare-Prozess, keine unabsichtliche Umstellung der geschützten Produktion.
- **Tatsächlich:** bestehender Workflow selbst unverändert, aber geänderte Paketcommands verändern seinen Prüfgegenstand; bei künftigem Merge/Trigger würde Root statt ausschließlich der geprüften neuen Site hochgeladen. Kein aktueller Produktionsschaden festgestellt.
- **Auswirkung:** Integrationsrisiko bei späterer Übernahme; grüner Workflowtest bestätigt weder richtige Ausgabe noch funktionsfähige Analytics-Konfiguration.
- **Korrektur/Builder-Akzeptanz:** Cloudflare- und Legacy-Pipelines ausdrücklich trennen und spätere Merge-Auswirkung dokumentieren. Den geschützten Produktionsworkflow in dieser Runde NICHT ändern; Änderung nur mit gesonderter Freigabe.
- **Regression:** Offline-/Fixtureprüfung der gewählten Uploadpfade; kein Trigger, keine Workflowdispatches; Hauptworktree/Liveproduktion weiterhin unverändert.

### F13 — P2 — Produkt-/Rechtsfreigaben bleiben belegpflichtig, kein Gesamt-Rechte-PASS — OPEN
- **Ort/Beleg:** neue `/privacy/`, `/en/privacy/`, `/impressum/`, `/en/imprint/`; `scripts/site-content.js:43–64`; Play-Listing; `ASSET-SOURCES.md:27–45`.
- **Reproduktion:** Verantwortlicher/Kontakte/Cloudflare-Hinweis und öffentliche Funktionsclaims lesen; nach unabhängigen aktuellen App-/Geräte-/Rechte-/Hostingfreigaben suchen.
- **Erwartet:** bestätigte Anbieterangaben und tatsächliche Datenflüsse, keine erfundenen rechtlichen oder technischen Garantien; explizite offene Freigaben vor Launch.
- **Tatsächlich:** DE/EN nennen konsistent Peter Weitgasser, Bsuch 123, A-5760 Saalfelden, Österreich, FotoSafe-/Privacy-Mail. Hosting wird korrekt Cloudflare zugeordnet. Texte nennen IP-/Sicherheitsdaten, Google-Play-Kauf und Betroffenenrechte. Website-Source und Store-Selbstauskunft beweisen aber nicht App-internes Nichttracking/Nichtlöschen, aktuelle Gerätefreigaben, Inhaberdaten oder vollständige Rechts-/Lizenzkette. Konkrete Hosting-Rollen/Vertrags-/Transfer-/Aufbewahrungsgrundlagen sind nicht unabhängig freigegeben.
- **Auswirkung:** noch keine belastbare Gesamt-Launchfreigabe. Das ist kein Nachweis einer Rechtsverletzung und kein Anlass, Adresse oder Pflichtdaten zu erfinden.
- **Korrektur/Builder-Akzeptanz:** Claimsregister mit Quelle/Datum/Scope, verantwortliche Bestätigung der Anbieterangaben und fachliche Datenschutz-/Impressumsprüfung der realen Cloudflare-Konfiguration; nötige Texte DE/EN synchron. Appnachweise nur read-only aus zulässigen Releasequellen, keine Backup-/Kauf-/Geräteaktionen allein fürs Marketing.
- **Regression:** Rechts-/Kontaktparität, keine falsche GitHub-Hostingangabe, keine Preis-/Kompatibilitätsgarantie, Website-/App-/Store-Datenflüsse getrennt; Freigaben als externe Gate-Ergebnisse ausweisen.

### F14 — P2 — Handoff/Maps und reproduzierbare Freigabekette unvollständig — OPEN
- **Ort/Beleg:** `HANDOFF.md:27–35,52`; `CONTENT-MAP.md:40–48`; `SEO-MAP.md`; `DEPLOYMENT.md`; alter builderverfasster `QA-REPORT.md` (Baseline-SHA im Inventar).
- **Reproduktion:** Abschlussaussagen mit diesem unabhängigen Ergebnis und Originalpflichtumfang vergleichen; nach vollständiger Altinhalt-/Fragmentmatrix, offener Freigabeliste und einem Site-enthaltenden Commit suchen.
- **Erwartet:** ehrliche Liste fertig/offen/unbekannt, vollständige Migration und eindeutig reproduzierbares geprüftes Deployment.
- **Tatsächlich:** Dokumente sind vorhanden und viele Pfade/Metadaten stimmen. Handoff suggeriert vollständige Anleitung/EN-Parität, ohne alle oben genannten Defizite. SEO-MAP bildet die vorhandenen statt aller bestellten Suchintentionen ab. Der HEAD enthält die neue Site nicht; sämtliche neuen Inhalte liegen uncommitted/untracked. Ein Commit ist im Audit verboten und wird ausdrücklich nicht verlangt, bevor der Owner ihn separat freigibt. Der 8-stellige Previewhost plus Livehash beweist das ausgelieferte Artefakt, nicht alle authentifizierten Cloudflare-Projekt-/Rollbackeinstellungen.
- **Auswirkung:** nächste Person könnte unfertig als freigegeben übernehmen; Ausgangscommit allein reproduziert die Preview nicht.
- **Korrektur/Builder-Akzeptanz:** Maps/Handoff/Runbook an tatsächlichen Scope anpassen; vollständiges Quell-/Artefaktmanifest und klare Restpunkte führen; versionierten Stand später nur mit Commitfreigabe schaffen. 30-/60-/90-Tage-Plan dokumentieren, keine Jobs anlegen. Rollbackziel und nötige Freigabe nennen, nicht testen durch Deploy.
- **Regression:** unabhängiger Dokument-Source-Dist-Live-Abgleich nach Änderungen, exakte URLs/Hashes, keine veralteten PASS-Aussagen; alle ursprünglichen Altabschnitte und Suchintentionen zugeordnet.

### F15 — P2 — Englische unbekannte URLs liefern ohne JS deutsche Fehlerseite — OPEN
- **Ort/Beleg:** `scripts/site-content.js:66`; `scripts/build-site.js:86`; `dist/404.html`; unbekannte Previewroute `/en/audit-unknown-final/`.
- **Reproduktion:** unbekannte EN-URL mit und ohne JavaScript öffnen.
- **Erwartet:** verständliche lokalisierte Fehlernavigation ohne JS; echte 404-Antwort nicht durch Home-Fallback verschleiert.
- **Tatsächlich:** initial HTTP 404 in beiden Fällen. Mit JS Navigation zu `/en/404/` (statische 200-Seite, noindex); ohne JS bleibt das deutsche 404-Dokument auf unbekanntem EN-Pfad. Kein Soft-404-SPA-Fallback der ursprünglichen unbekannten Anfrage, aber Sprachwechsel der Fehlerbehandlung hängt von JS ab.
- **Auswirkung:** EN-Nutzer ohne JS verlieren Sprachkonsistenz. Die allgemeine Behauptung vollständiger EN-/No-JS-Parität umfasst diesen Fall nicht.
- **Korrektur/Builder-Akzeptanz:** geeigneter lokalisierter oder sichtbarer bilingualer statischer 404-Fallback mit sicheren absoluten Hilfe-/Homepfaden; falls Routingänderung nötig, erst nach separater Hostingfreigabe. Keine automatische IP-/Browserspracherkennung.
- **Regression:** zufällige und verschachtelte DE/EN-Pfade mit/ohne JS, initial/final HTTP-Status und Sprache getrennt protokollieren; keine offene Weiterleitung und keine Indexierung der Fehlerseiten.

### F16 — P3 — Axe-Best-Practice-Warnungen in Home und DE-Tabelle — OPEN
- **Ort/Beleg:** `/`, `/en/` und DE USB-Anleitung; `scripts/build-site.js:60` sowie TOC/aside-Templates; generierte HTML-Dateien.
- **Reproduktion:** axe-core 4.11 auf diesen Routen ausführen.
- **Erwartet:** sinnvolle Landmarken und verständliche Tabellenkopfbezeichnungen.
- **Tatsächlich:** beide Homes `landmark-complementary-is-top-level`; DE-Anleitung `empty-table-header` für `<th></th>` am Tabellenanfang. Andere gescannte Hilfe/Rechts-/Supportseiten ohne axe-Verstöße.
- **Auswirkung:** kleine Semantik-/Orientierungslücke; Lighthouse 100 Accessibility schließt solche Best-Practice-Befunde nicht aus. Kein Nachweis vollständiger Screenreader-Kompatibilität.
- **Korrektur/Builder-Akzeptanz:** verschachtelte Ergänzungs-Landmarke fachlich korrekt auszeichnen; leeren Tabellenkopf sinnvoll benennen oder geeignete Zellenstruktur verwenden.
- **Regression:** axe auf repräsentativen DE/EN-Seiten plus manuelle Tabellen-/Landmarknavigation mit Screenreader.

### F17 — P3 — Strukturierte Daten zwischen Gegenstücken unnötig uneinheitlich — OPEN
- **Ort/Beleg:** `scripts/build-site.js:56–63`, `scripts/site-content.js:33,37` und übrige `pages`-Daten; HTML-JSON-LD-Anhang.
- **Reproduktion:** JSON-LD aller Inhaltsseiten parsen und DE/EN-Entitäten paarweise vergleichen.
- **Erwartet:** dieselbe FotoSafe-App konsistent referenziert; Breadcrumbs und geeignete WebSite-/App-/Article-Daten nur passend zur sichtbaren Seite.
- **Tatsächlich:** DE Home `MobileApplication`, EN Home `SoftwareApplication`; USB DE Graph mit weiterem Markup, EN `HowTo`; Breadcrumb-Markup nicht konsequent über Guide-Gegenstücke. JSON ist gültig; keine erfundenen Ratings/Offers. Die genannten App-Typen sind nicht per se widersprüchlich oder ungültig, aber die Entitäts-/Vorlagenkonsistenz ist unnötig schwach.
- **Auswirkung:** Wartungs-/semantische Paritätslücke, keine belegte Rankingstrafe und keine Rich-Result-Garantie.
- **Korrektur/Builder-Akzeptanz:** gemeinsam gepflegte App-ID/Typ/Fakten, passende BreadcrumbList je wirklicher Breadcrumbnavigation, sichtbare Schritte konsistent. Keine Ratings/Preise erfinden, um Rich-Result-Pflichtfelder zu füllen.
- **Regression:** JSON-Syntax, Entitäts-/Sprachpaar-Abgleich, sichtbarer Inhalt versus Schema, offizieller Validator als Zusatz; keine FAQ-/HowTo-Erfolgsaussage.

### F18 — P3 — Sicherheitsheader-Härtung nicht vollständig — OPEN
- **Ort/Beleg:** `dist/_headers:1–5`; Liveantworten für alle öffentlichen Dateien; Generator-Headerausgabe.
- **Reproduktion:** HTTPS-GET-Responseheader für Home, Assets und 404 prüfen.
- **Erwartet:** sinnvolle dokumentierte Headerpolitik für statischen Inhalt, ohne Funktion/Storelinks zu beschädigen.
- **Tatsächlich:** noindex, nosniff, Referrer-Policy und Permissions-Policy vorhanden. Keine ausgelieferte Content-Security-Policy in den geprüften Antworten; daher keine CSP-`frame-ancestors`-/Ressourcenbegrenzung. Kein exploitierbarer XSS-/Datenverlustfall nachgewiesen.
- **Auswirkung:** optionale Defense-in-Depth fehlt, nicht automatisch ein Sicherheits-/Launch-P0.
- **Korrektur/Builder-Akzeptanz:** minimal passende CSP einschließlich Frames/Basis/Objekten entwerfen; Inline-JSON-LD/Initialisierung/404-Script berücksichtigen und nicht blind brechen. Preview-Headeränderung erst in Builder-Runde, Deployment gesondert freigeben.
- **Regression:** Menü, Lightbox, No-JS, Storepopup und 404, CSP-Konsole und erlaubte Netzwerkziele; keine Lockerung auf unnötige Drittanbieter.

### F19 — P3 — Bildauslieferung kann schlanker werden — OPEN
- **Ort/Beleg:** Hero-/Icon-Bildmarkups in `scripts/build-site.js`, `scripts/site-content.js`; Lighthouse `image-delivery-insight`.
- **Reproduktion:** mobiles Lighthouse und intrinsische versus dargestellte Bildgrößen prüfen.
- **Erwartet:** passende responsive Derivate, hochwertige Vergrößerung separat, keine Mastermanipulation.
- **Tatsächlich:** 1080×1920-WebP für wesentlich kleinere Vorschau und 512×512-Icon für 44-px-Header; Lighthouse meldet Einsparpotenzial. Gemessene Performanceziele werden dennoch erreicht. Keine Bildverzerrung in den geprüften Darstellungen.
- **Auswirkung:** vermeidbarer Datentransfer, vor allem mobil. Unbenutzte Assetbytes aus F09 werden nicht beim normalen Seitenladen heruntergeladen und dürfen nicht zu diesem Laufzeitbudget addiert werden.
- **Korrektur/Builder-Akzeptanz:** geeignete srcset/sizes bzw. kleine Iconderivate erzeugen, großes Bild für Lightbox behalten; offizielle Badges nicht unzulässig verändern.
- **Regression:** visuelle Schärfe auf Standard/HiDPI, naturalWidth/Decode, Seitenverhältnis, LCP/CLS und lokale/live Hashparität. Keine Performance-/CWV-Garantie ableiten.

## 6. Vier klar getrennte Abschlusslisten

### Verifiziert fertig
- Statischer Preview-Build und 37/37 vorgesehene Tests mit den beschriebenen Abdeckungsgrenzen; identisches 72-Dateien-Rebuild.
- 70/70 öffentliche Previewbytes und 21/21 geprüfte Legacy-Produktionsbytes identisch; Preview-noindex und initial echte 404.
- 18 reale Routen/Sprachgegenstücke, individuelle Metadaten, 16 Sitemap-Inhaltsziele, funktionierende neue interne Links und Store-CTAs.
- Lokale neue Runtime ohne beobachtete automatische Tracking-/Font-/Marketingrequests; offizielle lokalisierte Badge-Dateien bestätigt.
- Gemessene Labor-Performanceziele erreicht; funktionierende mobile Navigation, Lightbox und FAQ im getesteten Umfang.

### Umgesetzt, nicht unabhängig vollständig verifiziert
- Appinterne Behauptungen zu Datenschutz, Nichtlöschen, Wiederholung und Test-/Kaufverhalten: mit öffentlichen Quellen abgeglichen, nicht am Binary/Gerät nachgestellt.
- Anbieter-/Lizenz-/Hostingvertragsangaben: Texte vorhanden, keine juristische oder vollständige Rechtefreigabe.
- Hypothetischer finaler Host/Launch-/Rollbackablauf beschrieben; authentifizierte Providerkonfiguration und voller Deploymentdatensatz nicht neu belegt.
- Screenshotkompositionen vorhanden und lokalisiert; keine eigenständige Freigabe ihrer aktuellen APK-/Geräteidentität.

### Offen / fehlerhaft
- Alle F01–F19 sind OPEN; insbesondere Pflichtintentionen, komplette Hilfe, Fragmente und modeerhaltende Pipeline.
- Responsive-/Fokus-/Touch-/EN-Paritäts- und No-JS-404-Mängel.
- Reviewlink, Assets/Allowlist/Rechte, tatsächliche neue Testabdeckung und belastbare Handoff-/Runbook-/Workflowtrennung.

### Unbekannt / NOT VERIFIED
- Separat ausgewiesene High-Reasoning-Stufe des gewünschten Reviewers.
- Echter Screenreader-/Crossbrowser-/Realgeräte-/nativer 200%-Browserzoom-PASS.
- Finale Domain-HTTP-/Zertifikats-/Socialcrawlerfunktion, private DNS-/Search-Console-/Cloudflare-Konfigurationshistorie und spätere Indexierung.
- INP/CrUX/CWV-Felddaten, Rankings, Traffic, Umsatz und künftige Kompatibilität.
- Vollständige juristische Rechte-/Datenflussfreigabe, Mailzustellung und alle ungenutzten Video-Frames/Medienmetadaten.

## 7. Builder-Reihenfolge und spätere Launchgrenzen

| Reihenfolge | Arbeiten | Gate |
| --- | --- | --- |
| 1 | F01/F02: Pflichtinhalte, echte komplette Zielordner-/Samsunghilfe DE/EN | Fachlicher Review beider Sprachversionen, keine erfundenen Systemschritte/Medien |
| 2 | F03: relevante Legacyfragmente und Altinhalte migrieren | alle bekannten Nutzerfragmente sinnvoll, JS/No-JS und Live nach späterer Previewfreigabe |
| 3 | F04/F11/F12: reproduzierbare getrennte Build-/Prüf-/Hostingpfade | Tests dürfen Production nicht verändern; geschützten Workflow ohne Freigabe nicht anfassen |
| 4 | F05/F06/F07/F15/F16: Layout, Fokus, Touch, EN-Parität, 404 und Semantik | vollständige Responsive-/A11y-/No-JS-Matrix, native Zoom-/Screenreaderprüfung ergänzen |
| 5 | F08/F09/F13/F14: Reviewpfad, Assetrechte/Allowlist, Freigaben, Maps/Handoff | Claims-/Rechtefreigabe; eindeutige Restpunkte und späterer 30/60/90-Plan ohne Jobs |
| 6 | F10/F17/F18/F19: Negativtests, Schema, Härtung, Bildoptimierung | reale rote Regressionfixtures, danach grüner neuer Gesamtkandidat |
| 7 | Erneuter unabhängiger Audit genau dieses neuen Kandidaten | kein Gesamt-PASS bei wesentlichen offenen Fehlern; gesonderte Freigabe für Commit/Previewdeploy/Launch |

Akzeptanzkriterien und konkrete Regressionstests stehen bei jedem Befund. Es wurden KEINE Fehler behoben, keine neue Preview veröffentlicht, kein Commit erzeugt und nichts gestaged/stashed/reset/gepusht. Domain/DNS/Cloudflare-/GitHub-Pages-Konfiguration, Search Console, Play Console, App und Produktionslinks wurden nicht geändert. Keine Käufe, Backups, Formatierung oder kostenpflichtigen Aktionen.

Spätere Veröffentlichung erfordert getrennte Ownerfreigabe: geprüfter finaler Kandidat, korrektes final-host-only Indexierungsverhalten, HTTPS/Canonical/Asset-/Redirect-/404-Recheck, belegtes Rollbackziel. Search-Console vorbereiten, einreichen, abrufbar und indexiert sind verschiedene Zustände. Diese Runde hat nichts eingereicht. Parallelbetrieb ist kein abgeschlossener SEO-Umzug.

## 8. Selbständige Evidenztabellen

Rohdaten wurden in /tmp erhoben. Gemäß Auftrag wird die Wegwerfkopie einschließlich dortiger Screenshots/Rohreports am Ende entfernt. Die folgenden Resultate, Zeitangaben, Hashes und Reproduktionsschritte bleiben im einzigen zulässigen Projektbericht erhalten. Dateinamen im Evidenzinventar sind historische Aufnahmebezeichnungen, keine versprochenen dauerhaft abrufbaren Downloads. Keine separaten neuen Projekt-Screenshots oder Logarchive.

### 8.1 Vollständige Live-Dateiprüfung

| Dist-Datei | HTTP final | Bytes | SHA-256 lokal=live | X-Robots |
| --- | --- | --- | --- | --- |
| 404.html | 200 | 3593 | 74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1 | noindex, nofollow |
| index.html | 200 | 13056 | da9bc26de60fedcdea6044d03f15abc431ee5cabed5492216dbc73ae079f7625 | noindex, nofollow |
| sitemap.xml | 200 | 1301 | 0c2cb53a0b7ef8adcc09e60d4e605caf15e561514648fa52f6652b0ce51d97ca | noindex, nofollow |
| robots.txt | 200 | 26 | 331ea9090db0c9f6f597bd9840fd5b171830f6e0b3ba1cb24dfa91f0c95aedc1 | noindex, nofollow |
| android-fotos-auf-usb-stick-sichern/index.html | 200 | 13134 | 9ae4019df997727d98700fe136522da47263551549f40a0a50341d3cdebc01df | noindex, nofollow |
| privacy/index.html | 200 | 6229 | 11c12104fe8601b43e186d56fd5b065337f10224dfaeee3a9023a4de73087b0c | noindex, nofollow |
| hilfe/index.html | 200 | 5985 | 98ffdfa48e5afa07a0216ae7226d8a01bde4548931f9992c97d5cf197f6bd3b9 | noindex, nofollow |
| impressum/index.html | 200 | 3834 | d2a4059a81c58adc88ba7b6fcdc8972bb0e43dd32a5c010ee707fe10cc803c2f | noindex, nofollow |
| support/index.html | 200 | 4413 | e029288009ac4044b13e936ea7ed5ff201c03d7c0b0cf385ace0ad6aa9976158 | noindex, nofollow |
| usb-stick-fuer-android-auswaehlen/index.html | 200 | 8098 | 6951b6feb04552d5062c766979d4b80718eedc10a191a36e7ecc2e85902172c4 | noindex, nofollow |
| foto-backup-strategie-android/index.html | 200 | 7664 | 0bb447da9e823e931547cda8b97caa68be4192e0d7683a37d4acf859664b62d9 | noindex, nofollow |
| 404/index.html | 200 | 3593 | 74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1 | noindex, nofollow |
| en/index.html | 200 | 11881 | fabe838ff8a389885dfcb7b8fb81641b6fb2911f6f3ed9a8a63b649ab5a7f3f0 | noindex, nofollow |
| en/guides/choose-usb-drive-for-android/index.html | 200 | 7032 | 81eb67e073229389689661eed8adb8c4e7ff18afdd110c5f8e5292840c0f3f60 | noindex, nofollow |
| en/guides/back-up-android-photos-to-usb/index.html | 200 | 8344 | 4a7c0eb54b110bf7270f46dc11b46cfb927e87041532366ae4687b285a743d02 | noindex, nofollow |
| en/guides/android-photo-backup-strategy/index.html | 200 | 6765 | 2e3bdeb315656ffb9881a9f7c883d69733bd6e754c8af104f6f93cad67e70adc | noindex, nofollow |
| en/privacy/index.html | 200 | 5612 | 24d100fdb876a5ec3cca9d70044cf93f41ee41759885f5d30b14270d32d88048 | noindex, nofollow |
| en/help/index.html | 200 | 5470 | 103f084b676252e6880f14469d418a0f4a030d0c51b93c051490f865411e7741 | noindex, nofollow |
| en/support/index.html | 200 | 4146 | f66fb049f21761f089af969db6c7b058d22c4366d62a34c1493746d24cc85e5c | noindex, nofollow |
| en/imprint/index.html | 200 | 3766 | 08e9e4267950f56201c2d2847e7800bd4b336fa009dcfe05ff3f50c0d334b4e5 | noindex, nofollow |
| en/404/index.html | 200 | 3380 | 82428907fd474d01db8ba9192f468b9f172c942bdf49f99eb6dfa20689f75d9d | noindex, nofollow |
| assets/02-backup-vorher-pruefen-de.webp | 200 | 109710 | 9394a9f6bb68fe456abbe1a3c0e575b286e09e211107dd636f0984b89a3c5fd1 | noindex, nofollow |
| assets/icons.svg | 200 | 2114 | a3d29ce6695e57ef7d3e57c2238098eefbbcd3557a586588a494cf680b345bdf | noindex, nofollow |
| assets/navigation.css | 200 | 8397 | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 | noindex, nofollow |
| assets/fotosafe-app-icon.png | 200 | 59304 | 512d1b5e6aff99ce41807cc59bfcd4206191205ef4a3b7e4828c8100a33774a3 | noindex, nofollow |
| assets/privacy-analytics.js | 200 | 17804 | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 | noindex, nofollow |
| assets/02-review-before-backup-en.webp | 200 | 110084 | c31d155c1e7db690e59470fde834fded413619b394f52765a1976a43d1c50dcc | noindex, nofollow |
| assets/navigation.js | 200 | 1677 | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 | noindex, nofollow |
| assets/language.js | 200 | 1387 | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 | noindex, nofollow |
| assets/privacy-analytics-core.js | 200 | 6102 | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b | noindex, nofollow |
| assets/02-review-before-backup-en.png | 200 | 482961 | e41eb5eb49d4a503d684533e98c7e37ae2f6fbabcfd1ea05460fbddeac765146 | noindex, nofollow |
| assets/language-core.js | 200 | 1659 | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a | noindex, nofollow |
| assets/screenshot-expert-de.jpg | 200 | 77920 | f7b8d55fe8c4dc878eeb00867100716344469b9e88a30a9374ba085a53e28e5f | noindex, nofollow |
| assets/01-three-guided-steps-to-usb-en.png | 200 | 465023 | 3d2dad1e747ac6060380403e15674e61c789b581a677273cf61587eb49652f03 | noindex, nofollow |
| assets/02-backup-vorher-pruefen-de.png | 200 | 477814 | 180dbd05938eced91181e6f258d6cd0851b2045989a1289190aedfb36a1f5093 | noindex, nofollow |
| assets/03-expertenmodus-quellen-de.webp | 200 | 111098 | 9039b2ab18771bac1b34f99ca681e6cce33e80ef6c8eeb73fe00aee671fabe08 | noindex, nofollow |
| assets/analytics-config.js | 200 | 3992 | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 | noindex, nofollow |
| assets/fotosafe-share.png | 200 | 376258 | 3d7ba925e2d85250fd8d3231efe69014362db2fea9b3f380956247327053e262 | noindex, nofollow |
| assets/screenshot-start-de.jpg | 200 | 71791 | 1d18008cf6be8a26c28209758b6611f1cd18d49d49282d3f4666531b4817041b | noindex, nofollow |
| assets/01-in-drei-schritten-auf-usb-de.png | 200 | 466247 | 6e7818a0c9dfdcbc05e1138a7592536ea5d011c906ca108cd7baa141efdfa30b | noindex, nofollow |
| assets/site.js | 200 | 1647 | 13dd5a46b08cc86d6823ff9313d1d24d2b8661bcb74daf60468012d49a6dbead | noindex, nofollow |
| assets/03-expert-mode-sources-en.webp | 200 | 106824 | 33dbacdfe95224c1a63af9385283f8ea6226848957269df133d04994cfe1b754 | noindex, nofollow |
| assets/site.css | 200 | 18855 | 6d2982c09c790e5131474ba5a00a6c24265b113e9f70a260cdc3bf57e89b3f0d | noindex, nofollow |
| assets/03-expertenmodus-quellen-de.png | 200 | 500592 | 46a6c9b7a06d3c5cf4d1e492cc6b14ffc3b2c4cd6f5900418d598d0d09e43e06 | noindex, nofollow |
| assets/01-in-drei-schritten-auf-usb-de.webp | 200 | 105426 | 459faec86fe0d03655bc2cdbb4715cc6ba3dd3df00f1edf4fa064b60e93771d3 | noindex, nofollow |
| assets/screenshot-result-de.jpg | 200 | 76312 | b13b185919dd2678814b15e4fd4ffa5995ac5a83423584745b806b7c7588782b | noindex, nofollow |
| assets/03-expert-mode-sources-en.png | 200 | 486618 | 824585c0398c2b207f16b7e0dec688c2c74c10572ab7b15d32cc1943f46af97a | noindex, nofollow |
| assets/01-three-guided-steps-to-usb-en.webp | 200 | 104648 | d333a19c8b19dd9a635a4665bf63866c666ed4ee20c4773ae8c0fb51568b2c21 | noindex, nofollow |
| assets/google-play/get-it-on-google-play-en.png | 200 | 4904 | f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849 | noindex, nofollow |
| assets/google-play/get-it-on-google-play-de.png | 200 | 15496 | 6760aac0db8d24da21f4fd803a06c6ef26c8849e0bd623420973a5666fd3a4c4 | noindex, nofollow |
| assets/usb-hilfe/otg-adapter-erklaert.svg | 200 | 3867 | cfef63fb6214060e62d0aa5996eba7d0b887d45c85a1812b9f150f8c165cb42b | noindex, nofollow |
| assets/usb-hilfe/usb-ordnerwahl-video-poster.webp | 200 | 44184 | 464341cb175641c25d119f3bce1096602960170bc9693a21410774029fd55d6e | noindex, nofollow |
| assets/usb-hilfe/02-falscher-speicher.jpg | 200 | 38682 | 84185a46fc5e59477eec2eeea793b905ebfc1bcd6d47b0ee9578fb99611ba956 | noindex, nofollow |
| assets/usb-hilfe/01-sicherungsort-aendern.jpg | 200 | 82293 | 73a918b0ad006060343e58c4e56a1dc1a8cc1b83149c3577d0c750bc2e9e4e3c | noindex, nofollow |
| assets/usb-hilfe/03-usb-nicht-erkannt.jpg | 200 | 73527 | 1716335aa8515f77fb3bb0212987ff06899b127e72cb97690f3506217d50c95f | noindex, nofollow |
| assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4 | 200 | 1248716 | 68ae5631c0f4a9e360e11364ade7d95e500297f5011418907374d93a057b9a01 | noindex, nofollow |
| assets/usb-hilfe/otg-adapter-erklaert-mobil.svg | 200 | 3376 | 4f5461cd5561b4668f8af8d125c9d9e1ff78cfd9090df1cc3ea63280c2fb08cf | noindex, nofollow |
| assets/products/usbc_64.webp | 200 | 83912 | ff4feb3f1d4467a2eb30d05a709ecb30481d1d34b28e329c2b419ddc182128f5 | noindex, nofollow |
| assets/products/tested-badge-de.webp | 200 | 55690 | e97989bfa4b80b77ca12fece824832fdc0ffb02be9b8565157a50b7a9df6f17d | noindex, nofollow |
| assets/products/honor600.webp | 200 | 66588 | 6512527e03b14c5de844a17990dc99011ef9faa043a18b2a04ab618874ffe7d5 | noindex, nofollow |
| assets/products/otg_cable.webp | 200 | 24170 | 070202055fd21c5ad971543561a94a3902295bbfbaf032cf67664d38469c4a4a | noindex, nofollow |
| assets/products/s26.webp | 200 | 71328 | 32cee31239fa618d12385bbc5ad42ea68eea0dcf1a5a20a687ad339521ddfe54 | noindex, nofollow |
| assets/products/usba_64.webp | 200 | 13726 | ad8a0d1641a4c328214f84f899fde708f0d71d6506585b29ff1e5e1f895b7dae | noindex, nofollow |
| assets/products/usba_256.webp | 200 | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 | noindex, nofollow |
| assets/products/usba_128.webp | 200 | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 | noindex, nofollow |
| assets/products/usbc_128.webp | 200 | 84324 | e1e7dbeba811d36c1ae20a224901b137c5cf558fa3c44e002a0a93ae7d3ce4ee | noindex, nofollow |
| assets/products/otg_small.webp | 200 | 112370 | b02ee37c357b9d0f8bcdbdd502fb699add314eb482d04707ba10f4fbe2b9b377 | noindex, nofollow |
| assets/products/usbc_256.webp | 200 | 83324 | c0ad199e1a01b322b534303e890c124f72edf106c4a812aa683c1d78676542b9 | noindex, nofollow |
| assets/products/otg_set.webp | 200 | 28026 | c2754d8d0456446e30a1adc2f9608f858961b4e4dff0c631152590c1e0ac0d3c | noindex, nofollow |
| assets/products/a57.webp | 200 | 18184 | 98991345b2e303e4d02a0915e17c0260c64f3e34adcdbbd17f88719c75846980 | noindex, nofollow |

### 8.2 Legacy-Produktion: tatsächlich geprüfte Dateien

| Datei | HTTP | SHA-256 lokal=live |
| --- | --- | --- |
| /home/hermes/projects/fotosafe-app-site/support.html | 200 | e0a4d70bc6a8dff9fad5e183e27369c6b6bab087061ba3a8bb8af9d5122b0250 |
| /home/hermes/projects/fotosafe-app-site/usb-stick-auswaehlen.html | 200 | 9e7c0f06db08a6e01c7feefff3444c083a3ba400f18cc19aeb39269bd2e6f7d5 |
| /home/hermes/projects/fotosafe-app-site/404.html | 200 | ecbf8e7b66a320747de6bd4b1fc105a789d3a1f8fcf58d552b3d44a417cb8d8e |
| /home/hermes/projects/fotosafe-app-site/impressum.html | 200 | 8c7cbb2d35d8fe462caab95b7dbac23628583021df5336b90c4808909d523b23 |
| /home/hermes/projects/fotosafe-app-site/index.html | 200 | 8a232f734bae08d6a92982c57b7557174606ed6d30c356b669288483aab2f83b |
| /home/hermes/projects/fotosafe-app-site/privacy.html | 200 | f566afea406bad455a54d9f870960ed12ebf3bd104c7c50515003535451a2936 |
| /home/hermes/projects/fotosafe-app-site/hilfe.html | 200 | 5167e9c05df1c1aff36b9a754a1e1e7119f471bc9ef88ce6aa6e6f6a74c523b7 |
| /home/hermes/projects/fotosafe-app-site/en/support.html | 200 | 6e1ca719d749b77367b6d2a4b84f5e467e5dd0d2ab1f8672f9ab0f938337dc88 |
| /home/hermes/projects/fotosafe-app-site/en/imprint.html | 200 | 5e768ba6315dfeb9cbd6917b9b53eed9f9563112541524456bee68319f54da2f |
| /home/hermes/projects/fotosafe-app-site/en/select-usb-drive.html | 200 | 17ca40904611caca398fce52fd3b5664889c7b5a21eb1920402456e264f23d5e |
| /home/hermes/projects/fotosafe-app-site/en/404.html | 200 | 97c93c0b8aa9fa24f96a9fa07ba2963b11cb49cff98a7d35ed1b516ec74c13f8 |
| /home/hermes/projects/fotosafe-app-site/en/help.html | 200 | 25875d31b7dba755aaff9d7a03e7f97211c8b9c789e1c3019cd0c86fae24fd09 |
| /home/hermes/projects/fotosafe-app-site/en/index.html | 200 | 4df72259306557fc5f246b7d7739cca30fa7343102a91a9af22cfbdab4448851 |
| /home/hermes/projects/fotosafe-app-site/en/privacy.html | 200 | ba63444999e6cc0ead764a38e437ade6c4bbe4d09bf891a8db76d27851a62417 |
| /home/hermes/projects/fotosafe-app-site/assets/privacy-analytics.js | 200 | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 |
| /home/hermes/projects/fotosafe-app-site/assets/navigation.js | 200 | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 |
| /home/hermes/projects/fotosafe-app-site/assets/language.js | 200 | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 |
| /home/hermes/projects/fotosafe-app-site/assets/privacy-analytics-core.js | 200 | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b |
| /home/hermes/projects/fotosafe-app-site/assets/language-core.js | 200 | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a |
| /home/hermes/projects/fotosafe-app-site/assets/analytics-config.js | 200 | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 |
| /home/hermes/projects/fotosafe-app-site/assets/navigation.css | 200 | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 |

### 8.3 Vollständige Browsermatrix

| Route | Viewport | HTTP | scroll/client | Errors | Failed | Third-Party | Screenshotname |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /404/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | 404-1280.png |
| /404/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | 404-390.png |
| /404/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | 404-320.png |
| /android-fotos-auf-usb-stick-sichern/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | android-fotos-auf-usb-stick-sichern-1280.png |
| /android-fotos-auf-usb-stick-sichern/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | android-fotos-auf-usb-stick-sichern-390.png |
| /android-fotos-auf-usb-stick-sichern/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | android-fotos-auf-usb-stick-sichern-320.png |
| /en/404/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__404-1280.png |
| /en/404/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__404-390.png |
| /en/404/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__404-320.png |
| /en/guides/android-photo-backup-strategy/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__guides__android-photo-backup-strategy-1280.png |
| /en/guides/android-photo-backup-strategy/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__guides__android-photo-backup-strategy-390.png |
| /en/guides/android-photo-backup-strategy/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__guides__android-photo-backup-strategy-320.png |
| /en/guides/back-up-android-photos-to-usb/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__guides__back-up-android-photos-to-usb-1280.png |
| /en/guides/back-up-android-photos-to-usb/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__guides__back-up-android-photos-to-usb-390.png |
| /en/guides/back-up-android-photos-to-usb/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__guides__back-up-android-photos-to-usb-320.png |
| /en/guides/choose-usb-drive-for-android/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__guides__choose-usb-drive-for-android-1280.png |
| /en/guides/choose-usb-drive-for-android/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__guides__choose-usb-drive-for-android-390.png |
| /en/guides/choose-usb-drive-for-android/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__guides__choose-usb-drive-for-android-320.png |
| /en/help/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__help-1280.png |
| /en/help/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__help-390.png |
| /en/help/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__help-320.png |
| /en/imprint/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__imprint-1280.png |
| /en/imprint/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__imprint-390.png |
| /en/imprint/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__imprint-320.png |
| /en/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en-1280.png |
| /en/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en-390.png |
| /en/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en-320.png |
| /en/privacy/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__privacy-1280.png |
| /en/privacy/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__privacy-390.png |
| /en/privacy/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__privacy-320.png |
| /en/support/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | en__support-1280.png |
| /en/support/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | en__support-390.png |
| /en/support/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | en__support-320.png |
| /foto-backup-strategie-android/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | foto-backup-strategie-android-1280.png |
| /foto-backup-strategie-android/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | foto-backup-strategie-android-390.png |
| /foto-backup-strategie-android/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | foto-backup-strategie-android-320.png |
| /hilfe/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | hilfe-1280.png |
| /hilfe/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | hilfe-390.png |
| /hilfe/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | hilfe-320.png |
| /impressum/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | impressum-1280.png |
| /impressum/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | impressum-390.png |
| /impressum/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | impressum-320.png |
| / | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | home-1280.png |
| / | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | home-390.png |
| / | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | home-320.png |
| /privacy/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | privacy-1280.png |
| /privacy/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | privacy-390.png |
| /privacy/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | privacy-320.png |
| /support/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | support-1280.png |
| /support/ | [390, 844] | 200 | 390/390 | 0 | 0 | 0 | support-390.png |
| /support/ | [320, 700] | 200 | 320/320 | 0 | 0 | 0 | support-320.png |
| /usb-stick-fuer-android-auswaehlen/ | [1280, 900] | 200 | 1280/1280 | 0 | 0 | 0 | usb-stick-fuer-android-auswaehlen-1280.png |
| /usb-stick-fuer-android-auswaehlen/ | [390, 844] | 200 | 412/390 | 0 | 0 | 0 | usb-stick-fuer-android-auswaehlen-390.png |
| /usb-stick-fuer-android-auswaehlen/ | [320, 700] | 200 | 343/320 | 0 | 0 | 0 | usb-stick-fuer-android-auswaehlen-320.png |
| / | [1440, 900] | 200 | 1440/1440 | 0 | 0 | 0 | home-1440.png |
| / | [768, 1024] | 200 | 768/768 | 0 | 0 | 0 | — |
| / | [679, 900] | 200 | 679/679 | 0 | 0 | 0 | — |
| / | [680, 900] | 200 | 680/680 | 0 | 0 | 0 | — |
| / | [681, 900] | 200 | 681/681 | 0 | 0 | 0 | home-681.png |
| / | [900, 900] | 200 | 900/900 | 0 | 0 | 0 | — |
| / | [901, 900] | 200 | 961/901 | 0 | 0 | 0 | — |
| /en/ | [1440, 900] | 200 | 1440/1440 | 0 | 0 | 0 | en-1440.png |
| /en/ | [768, 1024] | 200 | 768/768 | 0 | 0 | 0 | — |
| /en/ | [679, 900] | 200 | 679/679 | 0 | 0 | 0 | — |
| /en/ | [680, 900] | 200 | 680/680 | 0 | 0 | 0 | — |
| /en/ | [681, 900] | 200 | 681/681 | 0 | 0 | 0 | en-681.png |
| /en/ | [900, 900] | 200 | 900/900 | 0 | 0 | 0 | — |
| /en/ | [901, 900] | 200 | 901/901 | 0 | 0 | 0 | — |
| /hilfe/ | [1440, 900] | 200 | 1440/1440 | 0 | 0 | 0 | hilfe-1440.png |
| /hilfe/ | [768, 1024] | 200 | 768/768 | 0 | 0 | 0 | — |
| /hilfe/ | [679, 900] | 200 | 679/679 | 0 | 0 | 0 | — |
| /hilfe/ | [680, 900] | 200 | 680/680 | 0 | 0 | 0 | — |
| /hilfe/ | [681, 900] | 200 | 681/681 | 0 | 0 | 0 | hilfe-681.png |
| /hilfe/ | [900, 900] | 200 | 900/900 | 0 | 0 | 0 | — |
| /hilfe/ | [901, 900] | 200 | 901/901 | 0 | 0 | 0 | — |
| /en/help/ | [1440, 900] | 200 | 1440/1440 | 0 | 0 | 0 | en__help-1440.png |
| /en/help/ | [768, 1024] | 200 | 768/768 | 0 | 0 | 0 | — |
| /en/help/ | [679, 900] | 200 | 679/679 | 0 | 0 | 0 | — |
| /en/help/ | [680, 900] | 200 | 680/680 | 0 | 0 | 0 | — |
| /en/help/ | [681, 900] | 200 | 681/681 | 0 | 0 | 0 | en__help-681.png |
| /en/help/ | [900, 900] | 200 | 900/900 | 0 | 0 | 0 | — |
| /en/help/ | [901, 900] | 200 | 901/901 | 0 | 0 | 0 | — |
| /android-fotos-auf-usb-stick-sichern/ | [1440, 900] | 200 | 1440/1440 | 0 | 0 | 0 | android-fotos-auf-usb-stick-sichern-1440.png |
| /android-fotos-auf-usb-stick-sichern/ | [768, 1024] | 200 | 768/768 | 0 | 0 | 0 | — |
| /android-fotos-auf-usb-stick-sichern/ | [679, 900] | 200 | 679/679 | 0 | 0 | 0 | — |
| /android-fotos-auf-usb-stick-sichern/ | [680, 900] | 200 | 680/680 | 0 | 0 | 0 | — |
| /android-fotos-auf-usb-stick-sichern/ | [681, 900] | 200 | 681/681 | 0 | 0 | 0 | android-fotos-auf-usb-stick-sichern-681.png |
| /android-fotos-auf-usb-stick-sichern/ | [900, 900] | 200 | 900/900 | 0 | 0 | 0 | — |
| /android-fotos-auf-usb-stick-sichern/ | [901, 900] | 200 | 901/901 | 0 | 0 | 0 | — |

### 8.4 Assetinventar

| Dist-Asset | Bytes | Referenziert | Format/Abmessung | SHA-256 |
| --- | --- | --- | --- | --- |
| assets/01-in-drei-schritten-auf-usb-de.png | 466247 | False | PNG 1080×1920 | 6e7818a0c9dfdcbc05e1138a7592536ea5d011c906ca108cd7baa141efdfa30b |
| assets/01-in-drei-schritten-auf-usb-de.webp | 105426 | True | WEBP 1080×1920 | 459faec86fe0d03655bc2cdbb4715cc6ba3dd3df00f1edf4fa064b60e93771d3 |
| assets/01-three-guided-steps-to-usb-en.png | 465023 | False | PNG 1080×1920 | 3d2dad1e747ac6060380403e15674e61c789b581a677273cf61587eb49652f03 |
| assets/01-three-guided-steps-to-usb-en.webp | 104648 | True | WEBP 1080×1920 | d333a19c8b19dd9a635a4665bf63866c666ed4ee20c4773ae8c0fb51568b2c21 |
| assets/02-backup-vorher-pruefen-de.png | 477814 | False | PNG 1080×1920 | 180dbd05938eced91181e6f258d6cd0851b2045989a1289190aedfb36a1f5093 |
| assets/02-backup-vorher-pruefen-de.webp | 109710 | True | WEBP 1080×1920 | 9394a9f6bb68fe456abbe1a3c0e575b286e09e211107dd636f0984b89a3c5fd1 |
| assets/02-review-before-backup-en.png | 482961 | False | PNG 1080×1920 | e41eb5eb49d4a503d684533e98c7e37ae2f6fbabcfd1ea05460fbddeac765146 |
| assets/02-review-before-backup-en.webp | 110084 | True | WEBP 1080×1920 | c31d155c1e7db690e59470fde834fded413619b394f52765a1976a43d1c50dcc |
| assets/03-expert-mode-sources-en.png | 486618 | False | PNG 1080×1920 | 824585c0398c2b207f16b7e0dec688c2c74c10572ab7b15d32cc1943f46af97a |
| assets/03-expert-mode-sources-en.webp | 106824 | True | WEBP 1080×1920 | 33dbacdfe95224c1a63af9385283f8ea6226848957269df133d04994cfe1b754 |
| assets/03-expertenmodus-quellen-de.png | 500592 | False | PNG 1080×1920 | 46a6c9b7a06d3c5cf4d1e492cc6b14ffc3b2c4cd6f5900418d598d0d09e43e06 |
| assets/03-expertenmodus-quellen-de.webp | 111098 | True | WEBP 1080×1920 | 9039b2ab18771bac1b34f99ca681e6cce33e80ef6c8eeb73fe00aee671fabe08 |
| assets/analytics-config.js | 3992 | False |  × | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 |
| assets/fotosafe-app-icon.png | 59304 | True | PNG 512×512 | 512d1b5e6aff99ce41807cc59bfcd4206191205ef4a3b7e4828c8100a33774a3 |
| assets/fotosafe-share.png | 376258 | True | PNG 1200×630 | 3d7ba925e2d85250fd8d3231efe69014362db2fea9b3f380956247327053e262 |
| assets/google-play/get-it-on-google-play-de.png | 15496 | True | PNG 646×250 | 6760aac0db8d24da21f4fd803a06c6ef26c8849e0bd623420973a5666fd3a4c4 |
| assets/google-play/get-it-on-google-play-en.png | 4904 | True | PNG 646×250 | f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849 |
| assets/icons.svg | 2114 | True |  × | a3d29ce6695e57ef7d3e57c2238098eefbbcd3557a586588a494cf680b345bdf |
| assets/language-core.js | 1659 | False |  × | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a |
| assets/language.js | 1387 | False |  × | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 |
| assets/navigation.css | 8397 | False |  × | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 |
| assets/navigation.js | 1677 | False |  × | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 |
| assets/privacy-analytics-core.js | 6102 | False |  × | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b |
| assets/privacy-analytics.js | 17804 | False |  × | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 |
| assets/products/a57.webp | 18184 | False | WEBP 721×900 | 98991345b2e303e4d02a0915e17c0260c64f3e34adcdbbd17f88719c75846980 |
| assets/products/honor600.webp | 66588 | False | WEBP 675×900 | 6512527e03b14c5de844a17990dc99011ef9faa043a18b2a04ab618874ffe7d5 |
| assets/products/otg_cable.webp | 24170 | False | WEBP 800×800 | 070202055fd21c5ad971543561a94a3902295bbfbaf032cf67664d38469c4a4a |
| assets/products/otg_set.webp | 28026 | False | WEBP 800×737 | c2754d8d0456446e30a1adc2f9608f858961b4e4dff0c631152590c1e0ac0d3c |
| assets/products/otg_small.webp | 112370 | False | WEBP 675×900 | b02ee37c357b9d0f8bcdbdd502fb699add314eb482d04707ba10f4fbe2b9b377 |
| assets/products/s26.webp | 71328 | False | WEBP 675×900 | 32cee31239fa618d12385bbc5ad42ea68eea0dcf1a5a20a687ad339521ddfe54 |
| assets/products/tested-badge-de.webp | 55690 | False | WEBP 240×228 | e97989bfa4b80b77ca12fece824832fdc0ffb02be9b8565157a50b7a9df6f17d |
| assets/products/usba_128.webp | 12372 | False | WEBP 800×546 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_256.webp | 12372 | False | WEBP 800×546 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_64.webp | 13726 | False | WEBP 800×662 | ad8a0d1641a4c328214f84f899fde708f0d71d6506585b29ff1e5e1f895b7dae |
| assets/products/usbc_128.webp | 84324 | False | WEBP 675×900 | e1e7dbeba811d36c1ae20a224901b137c5cf558fa3c44e002a0a93ae7d3ce4ee |
| assets/products/usbc_256.webp | 83324 | False | WEBP 675×900 | c0ad199e1a01b322b534303e890c124f72edf106c4a812aa683c1d78676542b9 |
| assets/products/usbc_64.webp | 83912 | False | WEBP 675×900 | ff4feb3f1d4467a2eb30d05a709ecb30481d1d34b28e329c2b419ddc182128f5 |
| assets/screenshot-expert-de.jpg | 77920 | False | JPEG 520×1126 | f7b8d55fe8c4dc878eeb00867100716344469b9e88a30a9374ba085a53e28e5f |
| assets/screenshot-result-de.jpg | 76312 | False | JPEG 520×1126 | b13b185919dd2678814b15e4fd4ffa5995ac5a83423584745b806b7c7588782b |
| assets/screenshot-start-de.jpg | 71791 | False | JPEG 520×1126 | 1d18008cf6be8a26c28209758b6611f1cd18d49d49282d3f4666531b4817041b |
| assets/site.css | 18855 | True |  × | 6d2982c09c790e5131474ba5a00a6c24265b113e9f70a260cdc3bf57e89b3f0d |
| assets/site.js | 1647 | True |  × | 13dd5a46b08cc86d6823ff9313d1d24d2b8661bcb74daf60468012d49a6dbead |
| assets/usb-hilfe/01-sicherungsort-aendern.jpg | 82293 | False | JPEG 720×1030 | 73a918b0ad006060343e58c4e56a1dc1a8cc1b83149c3577d0c750bc2e9e4e3c |
| assets/usb-hilfe/02-falscher-speicher.jpg | 38682 | False | JPEG 720×687 | 84185a46fc5e59477eec2eeea793b905ebfc1bcd6d47b0ee9578fb99611ba956 |
| assets/usb-hilfe/03-usb-nicht-erkannt.jpg | 73527 | False | JPEG 720×887 | 1716335aa8515f77fb3bb0212987ff06899b127e72cb97690f3506217d50c95f |
| assets/usb-hilfe/otg-adapter-erklaert-mobil.svg | 3376 | False |  × | 4f5461cd5561b4668f8af8d125c9d9e1ff78cfd9090df1cc3ea63280c2fb08cf |
| assets/usb-hilfe/otg-adapter-erklaert.svg | 3867 | False |  × | cfef63fb6214060e62d0aa5996eba7d0b887d45c85a1812b9f150f8c165cb42b |
| assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4 | 1248716 | False |  × | 68ae5631c0f4a9e360e11364ade7d95e500297f5011418907374d93a057b9a01 |
| assets/usb-hilfe/usb-ordnerwahl-video-poster.webp | 44184 | False | WEBP 720×1560 | 464341cb175641c25d119f3bce1096602960170bc9693a21410774029fd55d6e |

### 8.5 Metadaten je logischer Route

| Route | Sprache | Title | Description | Canonical | H1 |
| --- | --- | --- | --- | --- | --- |
| /404/ | de | Seite nicht gefunden \| FotoSafe | Die angeforderte FotoSafe-Seite wurde nicht gefunden. | https://fotosafe.weidisoft.net/404/ | ['Diese Seite ist falsch abgebogen.'] |
| /404.html | de | Seite nicht gefunden \| FotoSafe | Die angeforderte FotoSafe-Seite wurde nicht gefunden. | https://fotosafe.weidisoft.net/404/ | ['Diese Seite ist falsch abgebogen.'] |
| /android-fotos-auf-usb-stick-sichern/ | de | Android-Fotos auf USB-Stick sichern – ohne PC \| FotoSafe | Android-Fotos direkt auf einen USB-Stick kopieren: Voraussetzungen, sicherer Ablauf, Zielauswahl, Kontrolle und ehrliche Dateimanager-Alternative. | https://fotosafe.weidisoft.net/android-fotos-auf-usb-stick-sichern/ | ['Android-Fotos auf USB-Stick sichern – ohne PC'] |
| /en/404/ | en | Page not found \| FotoSafe | The requested FotoSafe page was not found. | https://fotosafe.weidisoft.net/en/404/ | ['This page took the wrong USB turn.'] |
| /en/guides/android-photo-backup-strategy/ | en | Android photo backup strategy \| FotoSafe | Build a resilient Android photo backup routine with a USB copy, verification and the 3-2-1 principle. | https://fotosafe.weidisoft.net/en/guides/android-photo-backup-strategy/ | ['Android photo backup: turn one copy into a resilient strategy'] |
| /en/guides/back-up-android-photos-to-usb/ | en | Back up Android photos to USB \| FotoSafe | Copy Android photos to USB safely: requirements, destination selection, verification and troubleshooting. | https://fotosafe.weidisoft.net/en/guides/back-up-android-photos-to-usb/ | ['Back up Android photos to a USB drive — without a computer'] |
| /en/guides/choose-usb-drive-for-android/ | en | Choose a USB drive for Android \| FotoSafe | Check USB-C, OTG, data support, capacity and file-system compatibility for Android photo backups. | https://fotosafe.weidisoft.net/en/guides/choose-usb-drive-for-android/ | ['Choose a USB drive for Android: five compatibility checks'] |
| /en/help/ | en | FotoSafe help and guides | Guides for FotoSafe, Android USB backups, compatible drives and a resilient backup strategy. | https://fotosafe.weidisoft.net/en/help/ | ['Help that gets you all the way to a verified copy.'] |
| /en/imprint/ | en | Imprint \| FotoSafe | Provider information and contact details for FotoSafe. | https://fotosafe.weidisoft.net/en/imprint/ | ['Imprint'] |
| /en/ | en | FotoSafe — back up Android photos to USB | Copy photos and videos straight from Android to USB without a computer, a FotoSafe media cloud or deleting originals. | https://fotosafe.weidisoft.net/en/ | ['Your photos. Your copy. Your USB drive.'] |
| /en/privacy/ | en | Privacy Policy \| FotoSafe | Privacy Policy for the locally operating FotoSafe app and static FotoSafe website. | https://fotosafe.weidisoft.net/en/privacy/ | ['Privacy Policy for the FotoSafe app and website'] |
| /en/support/ | en | FotoSafe support | FotoSafe troubleshooting and direct email support without a web form. | https://fotosafe.weidisoft.net/en/support/ | ['How can we help?'] |
| /foto-backup-strategie-android/ | de | Foto-Backup-Strategie für Android \| FotoSafe | Eine robuste Strategie für Android-Fotos mit USB-Kopie, Kontrolle, Backup-Rhythmus und 3-2-1-Prinzip. | https://fotosafe.weidisoft.net/foto-backup-strategie-android/ | ['Foto-Backup auf Android: So wird aus einer Kopie eine Strategie'] |
| /hilfe/ | de | FotoSafe Hilfe & Ratgeber | Anleitungen für FotoSafe, Android-USB-Backups, kompatible USB-Sticks und eine verlässliche Sicherungsstrategie. | https://fotosafe.weidisoft.net/hilfe/ | ['Hilfe, die dich wirklich bis zur Kopie bringt.'] |
| /impressum/ | de | Impressum \| FotoSafe | Anbieterinformationen und Kontakt für FotoSafe. | https://fotosafe.weidisoft.net/impressum/ | ['Impressum'] |
| / | de | FotoSafe – Android-Fotos auf USB sichern, ohne Cloud | Fotos und Videos direkt vom Android-Handy auf USB sichern – ohne PC, ohne Medien-Cloud und ohne Löschen der Originale. | https://fotosafe.weidisoft.net/ | ['Deine Fotos. Deine Kopie. Dein USB-Stick.'] |
| /privacy/ | de | Datenschutzerklärung \| FotoSafe | Datenschutzerklärung für die lokal arbeitende FotoSafe-App und die statische FotoSafe-Website. | https://fotosafe.weidisoft.net/privacy/ | ['Datenschutzerklärung für FotoSafe-App und Website'] |
| /support/ | de | FotoSafe Support | FotoSafe Support mit Fehlerhilfe und direktem E-Mail-Kontakt ohne Webformular. | https://fotosafe.weidisoft.net/support/ | ['Wie können wir dir helfen?'] |
| /usb-stick-fuer-android-auswaehlen/ | de | USB-Stick für Android auswählen \| FotoSafe | USB-C, OTG, Kapazität und Dateisystem: So wählst du einen passenden USB-Stick für Android-Backups. | https://fotosafe.weidisoft.net/usb-stick-fuer-android-auswaehlen/ | ['USB-Stick für Android auswählen: Was wirklich zusammenpassen muss'] |

### 8.6 Offizielle Quellen / Abrufresultate

- https://play.google.com/store/apps/details?id=at.weidi.fotobackup&hl=en — HTTP 200; Endziel https://play.google.com/store/apps/details?id=at.weidi.fotobackup&hl=en; Textextrakt-SHA-256 feac0c148772079fbd852bb7869367f4da34dd98567402ffe433f16cb2d417c5
- https://play.google.com/store/apps/details?id=at.weidi.fotobackup&hl=de — HTTP 200; Endziel https://play.google.com/store/apps/details?id=at.weidi.fotobackup&hl=de; Textextrakt-SHA-256 77e9483e0a45385779fb8255914f566f65a3256031f3b4f76064d52015b6ee9c
- https://developer.android.com/distribute/marketing-tools/ — HTTP 200; Endziel https://developer.android.com/distribute/marketing-tools/; Textextrakt-SHA-256 5cf807b69773fe101690b1ad9a89766e95e385eefa366743f1a9276991cee4d4
- https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/ — HTTP 200; Endziel https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/; Textextrakt-SHA-256 66df124d2c9033f82957a13d904b23b032591fe45207f7c6e16b7259deab8d8a
- https://developer.android.com/distribute/marketing-tools/linking-to-google-play — HTTP 200; Endziel https://developer.android.com/distribute/marketing-tools/linking-to-google-play; Textextrakt-SHA-256 1efedca7a395b477ce8ff3cc3874652349c334d0280a0cae1f9df16579461039
- https://developers.google.com/search/docs/specialty/international/localized-versions — HTTP 200; Endziel https://developers.google.com/search/docs/specialty/international/localized-versions; Textextrakt-SHA-256 3a7a9e73a89052c5ce7bc41846a9752f6924207acb185d4150bc43e3720069fe
- https://developers.google.com/search/docs/appearance/structured-data/software-app — HTTP 200; Endziel https://developers.google.com/search/docs/appearance/structured-data/software-app; Textextrakt-SHA-256 3feea09fe7468138af8ff7d644a0e5c4a5b47a51b6986c423d786208d88b987e
- https://www.cloudflare.com/privacypolicy/ — HTTP 200; Endziel https://www.cloudflare.com/privacypolicy/; Textextrakt-SHA-256 b04d961f23d2ef0545c12c08495e10e44b8d15190d5e7ebb4b6a8d22d92612f0

| Offizielles Badge | HTTP | SHA-256 = ausgeliefert |
| --- | --- | --- |
| https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png | 200 | f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849 |
| https://play.google.com/intl/en_us/badges/static/images/badges/de_badge_web_generic.png | 200 | 6760aac0db8d24da21f4fd803a06c6ef26c8849e0bd623420973a5666fd3a4c4 |

### 8.7 Relevante maschinenlesbare Resultate

<details>
<summary>live-routing.json (unabhängiger Lauf)</summary>

```json
[
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/hilfe/"
    },
    "sets_cookie": false,
    "bytes": 22,
    "sha256": "9f6307f6d98f4a84dc2b43a2eb2500b41bb1eb7db28f11ee0ce2b9e17a102b44"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/privacy.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/privacy.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/privacy/"
    },
    "sets_cookie": false,
    "bytes": 24,
    "sha256": "4b7d32a342447420ba2d1272a7c865dbaaac3a85444c6e8843655cdd0fd7b683"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/support.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/support.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/support/"
    },
    "sets_cookie": false,
    "bytes": 24,
    "sha256": "91c216f12b986b490d792c571b4eed18e608dfd3a37c72b1c80cbf904b790d77"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/impressum.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/impressum.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/impressum/"
    },
    "sets_cookie": false,
    "bytes": 26,
    "sha256": "7a599948efc588862a89e0571f0e92bfbef20faf7cab3cc9a7d384ef9a3ee649"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/usb-stick-auswaehlen.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/usb-stick-auswaehlen.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/usb-stick-fuer-android-auswaehlen/"
    },
    "sets_cookie": false,
    "bytes": 50,
    "sha256": "32e6735ee4a68fb0a1d2619957256550955f8feeb75d29db324bc8d733854da5"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/help.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/help.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/help/"
    },
    "sets_cookie": false,
    "bytes": 24,
    "sha256": "ef880322c602573fbb1840771b8187af565d32d51f04006f6fd227d74b9ddfcf"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/privacy.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/privacy.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/privacy/"
    },
    "sets_cookie": false,
    "bytes": 27,
    "sha256": "17b72b1fd27a596b565a3b5e19361e785be56873708915a822a3b398f2a8a38f"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/support.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/support.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/support/"
    },
    "sets_cookie": false,
    "bytes": 27,
    "sha256": "627ac8f67304d2429f0671d475fc0905d414206fe8f5ceb45a4ca9f9aaa31a35"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/imprint.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/imprint.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/imprint/"
    },
    "sets_cookie": false,
    "bytes": 27,
    "sha256": "e31f9cd2f108627d12e0cb0d315b6f89143b2ec15537e7aa91646ac59ba63a81"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/select-usb-drive.html",
    "status": 301,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/select-usb-drive.html",
    "history": [],
    "headers": {
      "content-type": "text/plain;charset=UTF-8",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/guides/choose-usb-drive-for-android/"
    },
    "sets_cookie": false,
    "bytes": 55,
    "sha256": "ac56127f14bd09d0118477d6abc92af7e70b276017de8530b86ae8af040fbb8c"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/not-an-audit-page/",
    "status": 404,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/not-an-audit-page/",
    "history": [],
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare"
    },
    "sets_cookie": false,
    "bytes": 3593,
    "sha256": "74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1",
    "lang": "de",
    "title": "Seite nicht gefunden | FotoSafe"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/not-an-audit-page/",
    "status": 404,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/not-an-audit-page/",
    "history": [],
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare"
    },
    "sets_cookie": false,
    "bytes": 3593,
    "sha256": "74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1",
    "lang": "de",
    "title": "Seite nicht gefunden | FotoSafe"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/nested/not-an-audit-page.html",
    "status": 404,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/nested/not-an-audit-page.html",
    "history": [],
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare"
    },
    "sets_cookie": false,
    "bytes": 3593,
    "sha256": "74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1",
    "lang": "de",
    "title": "Seite nicht gefunden | FotoSafe"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/nested/not-an-audit-page.html",
    "status": 404,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/nested/not-an-audit-page.html",
    "history": [],
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare"
    },
    "sets_cookie": false,
    "bytes": 3593,
    "sha256": "74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1",
    "lang": "de",
    "title": "Seite nicht gefunden | FotoSafe"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/index.html",
    "status": 308,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/index.html",
    "history": [],
    "headers": {
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/"
    },
    "sets_cookie": false,
    "bytes": 0,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe",
    "status": 308,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe",
    "history": [],
    "headers": {
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/hilfe/"
    },
    "sets_cookie": false,
    "bytes": 0,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe/index.html",
    "status": 308,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe/index.html",
    "history": [],
    "headers": {
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/hilfe/"
    },
    "sets_cookie": false,
    "bytes": 0,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/index.html",
    "status": 308,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/en/index.html",
    "history": [],
    "headers": {
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/en/"
    },
    "sets_cookie": false,
    "bytes": 0,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  },
  {
    "url": "https://83ad5ea9.fotosafe-app.pages.dev/404.html",
    "status": 308,
    "final": "https://83ad5ea9.fotosafe-app.pages.dev/404.html",
    "history": [],
    "headers": {
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare",
      "location": "/404"
    },
    "sets_cookie": false,
    "bytes": 0,
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
]
```

</details>

<details>
<summary>legacy-fragment-links.json (unabhängiger Lauf)</summary>

```json
[
  [
    "support.html",
    29,
    "#inhalt"
  ],
  [
    "support.html",
    55,
    "hilfe.html#probleme"
  ],
  [
    "usb-stick-auswaehlen.html",
    24,
    "#inhalt"
  ],
  [
    "usb-stick-auswaehlen.html",
    36,
    "hilfe.html#auswahlhilfe"
  ],
  [
    "404.html",
    20,
    "#inhalt"
  ],
  [
    "impressum.html",
    79,
    "#inhalt"
  ],
  [
    "index.html",
    35,
    "#inhalt"
  ],
  [
    "index.html",
    114,
    "hilfe.html#medienzugriff"
  ],
  [
    "index.html",
    115,
    "hilfe.html#auswahlhilfe"
  ],
  [
    "privacy.html",
    3,
    "#inhalt"
  ],
  [
    "hilfe.html",
    332,
    "#inhalt"
  ],
  [
    "hilfe.html",
    350,
    "#anleitung"
  ],
  [
    "hilfe.html",
    351,
    "#medienzugriff"
  ],
  [
    "hilfe.html",
    352,
    "#video"
  ],
  [
    "hilfe.html",
    353,
    "#otg"
  ],
  [
    "hilfe.html",
    354,
    "#probleme"
  ],
  [
    "hilfe.html",
    355,
    "#auswahlhilfe"
  ],
  [
    "hilfe.html",
    429,
    "#otg"
  ],
  [
    "hilfe.html",
    439,
    "#probleme"
  ],
  [
    "hilfe.html",
    460,
    "#otg"
  ],
  [
    "hilfe.html",
    482,
    "#cat-otg"
  ],
  [
    "hilfe.html",
    483,
    "#cat-usbc"
  ],
  [
    "hilfe.html",
    484,
    "#cat-usba"
  ],
  [
    "hilfe.html",
    485,
    "#cat-phone"
  ],
  [
    "en/support.html",
    29,
    "#content"
  ],
  [
    "en/support.html",
    55,
    "help.html#probleme"
  ],
  [
    "en/imprint.html",
    70,
    "#content"
  ],
  [
    "en/select-usb-drive.html",
    25,
    "#content"
  ],
  [
    "en/select-usb-drive.html",
    37,
    "help.html#auswahlhilfe"
  ],
  [
    "en/404.html",
    20,
    "#content"
  ],
  [
    "en/help.html",
    332,
    "#inhalt"
  ],
  [
    "en/help.html",
    351,
    "#anleitung"
  ],
  [
    "en/help.html",
    352,
    "#media-access"
  ],
  [
    "en/help.html",
    353,
    "#video"
  ],
  [
    "en/help.html",
    354,
    "#otg"
  ],
  [
    "en/help.html",
    355,
    "#probleme"
  ],
  [
    "en/help.html",
    356,
    "#auswahlhilfe"
  ],
  [
    "en/help.html",
    426,
    "#otg"
  ],
  [
    "en/help.html",
    436,
    "#probleme"
  ],
  [
    "en/help.html",
    457,
    "#otg"
  ],
  [
    "en/help.html",
    479,
    "#cat-otg"
  ],
  [
    "en/help.html",
    480,
    "#cat-usbc"
  ],
  [
    "en/help.html",
    481,
    "#cat-usba"
  ],
  [
    "en/help.html",
    482,
    "#cat-phone"
  ],
  [
    "en/index.html",
    26,
    "#content"
  ],
  [
    "en/index.html",
    105,
    "help.html#media-access"
  ],
  [
    "en/index.html",
    106,
    "help.html#auswahlhilfe"
  ],
  [
    "en/privacy.html",
    3,
    "#content"
  ]
]
```

</details>

<details>
<summary>hosts.json (unabhängiger Lauf)</summary>

```json
{
  "alias": {
    "url": "https://feat-cloudflare-premium-site.fotosafe-app.pages.dev/",
    "status": 200,
    "final": "https://feat-cloudflare-premium-site.fotosafe-app.pages.dev/",
    "history": [],
    "headers": {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-robots-tag": "noindex, nofollow",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
      "server": "cloudflare"
    },
    "sets_cookie": false,
    "bytes": 13056,
    "sha256": "da9bc26de60fedcdea6044d03f15abc431ee5cabed5492216dbc73ae079f7625",
    "match": true,
    "file": "index.html",
    "lang": "de",
    "title": "FotoSafe – Android-Fotos auf USB sichern, ohne Cloud"
  },
  "final": {
    "url": "https://fotosafe.weidisoft.net/",
    "error": "HTTPSConnectionPool(host='fotosafe.weidisoft.net', port=443): Max retries exceeded with url: / (Caused by NameResolutionError(\"HTTPSConnection(host='fotosafe.weidisoft.net', port=443): Failed to resolve 'fotosafe.weidisoft.net' ([Errno -2] Name or service not known)\"))"
  }
}
```

</details>

<details>
<summary>nojs.json (unabhängiger Lauf)</summary>

```json
[
  {
    "route": "/404/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/404/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/404/",
      "title": "Seite nicht gefunden | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 1320,
      "h1": [
        "Diese Seite ist falsch abgebogen."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/404/"
  },
  {
    "route": "/android-fotos-auf-usb-stick-sichern/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/guides/back-up-android-photos-to-usb/",
    "storeLinks": 2,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/android-fotos-auf-usb-stick-sichern/",
      "title": "Android-Fotos auf USB-Stick sichern – ohne PC | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 10465,
      "h1": [
        "Android-Fotos auf USB-Stick sichern – ohne PC"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/01-in-drei-schritten-auf-usb-de.webp",
          "alt": "FotoSafe-Startansicht mit Schritten zur Auswahl von Speicher und Medien",
          "natural": 1080,
          "complete": true,
          "width": 296,
          "height": 526.21875
        },
        {
          "src": "/assets/02-backup-vorher-pruefen-de.webp",
          "alt": "FotoSafe-Vorschau mit Anzahl neuer und bereits gesicherter Medien",
          "natural": 1080,
          "complete": true,
          "width": 296,
          "height": 526.21875
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 72,
          "height": 72
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-de.png",
          "alt": "Jetzt bei Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Startseite",
          "cls": "",
          "href": "/",
          "w": 64.734375,
          "h": 23.765625
        },
        {
          "text": "Voraussetzungen",
          "cls": "",
          "href": "#voraussetzungen",
          "w": 296,
          "h": 40
        },
        {
          "text": "Schritt für Schritt",
          "cls": "",
          "href": "#schritte",
          "w": 296,
          "h": 40
        },
        {
          "text": "Kopie kontrollieren",
          "cls": "",
          "href": "#kontrolle",
          "w": 296,
          "h": 40
        },
        {
          "text": "Alternative Dateimanager",
          "cls": "",
          "href": "#dateimanager",
          "w": 296,
          "h": 40
        },
        {
          "text": "Später erneut sichern",
          "cls": "",
          "href": "#weitere-sicherung",
          "w": 296,
          "h": 40
        },
        {
          "text": "Häufige Probleme",
          "cls": "",
          "href": "#probleme",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/back-up-android-photos-to-usb/"
  },
  {
    "route": "/en/404/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/404/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/404/",
      "title": "Page not found | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 1312,
      "h1": [
        "This page took the wrong USB turn."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/404/"
  },
  {
    "route": "/en/guides/android-photo-backup-strategy/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/foto-backup-strategie-android/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/android-photo-backup-strategy/",
      "title": "Android photo backup strategy | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 4585,
      "h1": [
        "Android photo backup: turn one copy into a resilient strategy"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Home",
          "cls": "",
          "href": "/en/",
          "w": 40.328125,
          "h": 23.765625
        },
        {
          "text": "Guides",
          "cls": "",
          "href": "/en/help/",
          "w": 47.53125,
          "h": 23.765625
        },
        {
          "text": "3-2-1",
          "cls": "",
          "href": "#start",
          "w": 296,
          "h": 40
        },
        {
          "text": "Routine",
          "cls": "",
          "href": "#routine",
          "w": 296,
          "h": 40
        },
        {
          "text": "Verification",
          "cls": "",
          "href": "#verify",
          "w": 296,
          "h": 40
        },
        {
          "text": "Risks",
          "cls": "",
          "href": "#risks",
          "w": 296,
          "h": 40
        },
        {
          "text": "Your next backup",
          "cls": "",
          "href": "#next",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/foto-backup-strategie-android/"
  },
  {
    "route": "/en/guides/back-up-android-photos-to-usb/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/android-fotos-auf-usb-stick-sichern/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/back-up-android-photos-to-usb/",
      "title": "Back up Android photos to USB | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 5962,
      "h1": [
        "Back up Android photos to a USB drive — without a computer"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/02-review-before-backup-en.webp",
          "alt": "FotoSafe backup preview showing media counts and destination",
          "natural": 1080,
          "complete": true,
          "width": 216,
          "height": 384
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Home",
          "cls": "",
          "href": "/en/",
          "w": 40.328125,
          "h": 23.765625
        },
        {
          "text": "Guides",
          "cls": "",
          "href": "/en/help/",
          "w": 47.53125,
          "h": 23.765625
        },
        {
          "text": "Requirements",
          "cls": "",
          "href": "#start",
          "w": 296,
          "h": 40
        },
        {
          "text": "Five steps",
          "cls": "",
          "href": "#steps",
          "w": 296,
          "h": 40
        },
        {
          "text": "Verify the copy",
          "cls": "",
          "href": "#verify",
          "w": 296,
          "h": 40
        },
        {
          "text": "File-manager alternative",
          "cls": "",
          "href": "#alternative",
          "w": 296,
          "h": 40
        },
        {
          "text": "Back up again",
          "cls": "",
          "href": "#repeat",
          "w": 296,
          "h": 40
        },
        {
          "text": "Troubleshooting",
          "cls": "",
          "href": "#problems",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/android-fotos-auf-usb-stick-sichern/"
  },
  {
    "route": "/en/guides/choose-usb-drive-for-android/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/usb-stick-fuer-android-auswaehlen/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/choose-usb-drive-for-android/",
      "title": "Choose a USB drive for Android | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 4683,
      "h1": [
        "Choose a USB drive for Android: five compatibility checks"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Home",
          "cls": "",
          "href": "/en/",
          "w": 40.328125,
          "h": 23.765625
        },
        {
          "text": "Guides",
          "cls": "",
          "href": "/en/help/",
          "w": 47.53125,
          "h": 23.765625
        },
        {
          "text": "Quick check",
          "cls": "",
          "href": "#start",
          "w": 296,
          "h": 40
        },
        {
          "text": "Connection",
          "cls": "",
          "href": "#connect",
          "w": 296,
          "h": 40
        },
        {
          "text": "Storage",
          "cls": "",
          "href": "#storage",
          "w": 296,
          "h": 40
        },
        {
          "text": "Test first",
          "cls": "",
          "href": "#test",
          "w": 296,
          "h": 40
        },
        {
          "text": "Troubleshooting",
          "cls": "",
          "href": "#problems",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/usb-stick-fuer-android-auswaehlen/"
  },
  {
    "route": "/en/help/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/hilfe/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/help/",
      "title": "FotoSafe help and guides",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 3344,
      "h1": [
        "Help that gets you all the way to a verified copy."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/en/help/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe/"
  },
  {
    "route": "/en/imprint/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/impressum/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/imprint/",
      "title": "Imprint | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 2114,
      "h1": [
        "Imprint"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "fotosafe@weidisoft.net",
          "cls": "",
          "href": "mailto:fotosafe@weidisoft.net",
          "w": 174.34375,
          "h": 20
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/impressum/"
  },
  {
    "route": "/en/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/",
    "storeLinks": 4,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/",
      "title": "FotoSafe — back up Android photos to USB",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 8418,
      "h1": [
        "Your photos.\nYour copy.\nYour USB drive."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-en.png",
          "alt": "Get it on Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/01-three-guided-steps-to-usb-en.webp",
          "alt": "FotoSafe start screen showing the three-step USB backup flow",
          "natural": 1080,
          "complete": true,
          "width": 190,
          "height": 337.765625
        },
        {
          "src": "/assets/01-three-guided-steps-to-usb-en.webp",
          "alt": "FotoSafe guided USB backup start screen",
          "natural": 1080,
          "complete": true,
          "width": 0,
          "height": 0
        },
        {
          "src": "/assets/02-review-before-backup-en.webp",
          "alt": "FotoSafe review screen with destination and media counts",
          "natural": 1080,
          "complete": true,
          "width": 260,
          "height": 462.21875
        },
        {
          "src": "/assets/03-expert-mode-sources-en.webp",
          "alt": "FotoSafe Expert mode source selection",
          "natural": 1080,
          "complete": true,
          "width": 0,
          "height": 0
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-en.png",
          "alt": "Get it on Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-en.png",
          "alt": "Get it on Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Read help and guides first",
          "cls": "",
          "href": "/en/help/",
          "w": 205.28125,
          "h": 26.390625
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/en/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/"
  },
  {
    "route": "/en/privacy/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/privacy/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/privacy/",
      "title": "Privacy Policy | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 4049,
      "h1": [
        "Privacy Policy for the FotoSafe app and website"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "privacy@weidisoft.net",
          "cls": "",
          "href": "mailto:privacy@weidisoft.net",
          "w": 168.078125,
          "h": 20
        },
        {
          "text": "Cloudflare Privacy Policy",
          "cls": "",
          "href": "https://www.cloudflare.com/privacypolicy/",
          "w": 187.96875,
          "h": 20
        },
        {
          "text": "privacy@weidisoft.net",
          "cls": "",
          "href": "mailto:privacy@weidisoft.net",
          "w": 168.078125,
          "h": 20
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/privacy/"
  },
  {
    "route": "/en/support/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/support/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/en/support/",
      "title": "FotoSafe support",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 2190,
      "h1": [
        "How can we help?"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/en/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/en/support/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/support/"
  },
  {
    "route": "/foto-backup-strategie-android/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/guides/android-photo-backup-strategy/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/foto-backup-strategie-android/",
      "title": "Foto-Backup-Strategie für Android | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 5107,
      "h1": [
        "Foto-Backup auf Android: So wird aus einer Kopie eine Strategie"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Startseite",
          "cls": "",
          "href": "/",
          "w": 64.734375,
          "h": 23.765625
        },
        {
          "text": "Ratgeber",
          "cls": "",
          "href": "/hilfe/",
          "w": 61.6875,
          "h": 23.765625
        },
        {
          "text": "3-2-1-Prinzip",
          "cls": "",
          "href": "#start",
          "w": 296,
          "h": 40
        },
        {
          "text": "Rhythmus",
          "cls": "",
          "href": "#rhythmus",
          "w": 296,
          "h": 40
        },
        {
          "text": "Kontrolle",
          "cls": "",
          "href": "#kontrolle",
          "w": 296,
          "h": 40
        },
        {
          "text": "Risiken",
          "cls": "",
          "href": "#risiken",
          "w": 296,
          "h": 40
        },
        {
          "text": "Checkliste",
          "cls": "",
          "href": "#checkliste",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/android-photo-backup-strategy/"
  },
  {
    "route": "/hilfe/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/help/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/hilfe/",
      "title": "FotoSafe Hilfe & Ratgeber",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 3549,
      "h1": [
        "Hilfe, die dich wirklich bis zur Kopie bringt."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/hilfe/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/help/"
  },
  {
    "route": "/impressum/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/imprint/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/impressum/",
      "title": "Impressum | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 2252,
      "h1": [
        "Impressum"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "fotosafe@weidisoft.net",
          "cls": "",
          "href": "mailto:fotosafe@weidisoft.net",
          "w": 174.34375,
          "h": 20
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/imprint/"
  },
  {
    "route": "/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/",
    "storeLinks": 4,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/",
      "title": "FotoSafe – Android-Fotos auf USB sichern, ohne Cloud",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 8944,
      "h1": [
        "Deine Fotos.\nDeine Kopie.\nDein USB-Stick."
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-de.png",
          "alt": "Jetzt bei Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/01-in-drei-schritten-auf-usb-de.webp",
          "alt": "FotoSafe-Startansicht mit drei Schritten zur USB-Sicherung",
          "natural": 1080,
          "complete": true,
          "width": 190,
          "height": 337.765625
        },
        {
          "src": "/assets/01-in-drei-schritten-auf-usb-de.webp",
          "alt": "FotoSafe zeigt den geführten Ablauf zur Sicherung",
          "natural": 1080,
          "complete": true,
          "width": 0,
          "height": 0
        },
        {
          "src": "/assets/02-backup-vorher-pruefen-de.webp",
          "alt": "FotoSafe zeigt die Backup-Vorschau vor dem Start",
          "natural": 1080,
          "complete": true,
          "width": 260,
          "height": 462.21875
        },
        {
          "src": "/assets/03-expertenmodus-quellen-de.webp",
          "alt": "FotoSafe zeigt zusätzliche auswählbare Medienquellen",
          "natural": 1080,
          "complete": true,
          "width": 0,
          "height": 0
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-de.png",
          "alt": "Jetzt bei Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/google-play/get-it-on-google-play-de.png",
          "alt": "Jetzt bei Google Play",
          "natural": 646,
          "complete": true,
          "width": 176,
          "height": 68.109375
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Vorher die Anleitung lesen",
          "cls": "",
          "href": "/android-fotos-auf-usb-stick-sichern/",
          "w": 210.390625,
          "h": 26.390625
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/"
  },
  {
    "route": "/privacy/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/privacy/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/privacy/",
      "title": "Datenschutzerklärung | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 4723,
      "h1": [
        "Datenschutzerklärung für FotoSafe-App und Website"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "privacy@weidisoft.net",
          "cls": "",
          "href": "mailto:privacy@weidisoft.net",
          "w": 168.078125,
          "h": 20
        },
        {
          "text": "privacy@weidisoft.net",
          "cls": "",
          "href": "mailto:privacy@weidisoft.net",
          "w": 168.078125,
          "h": 20
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/privacy/"
  },
  {
    "route": "/support/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/support/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/support/",
      "title": "FotoSafe Support",
      "width": 320,
      "client": 320,
      "scroll": 320,
      "height": 2459,
      "h1": [
        "Wie können wir dir helfen?"
      ],
      "outside": [],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [
        {
          "href": "/support/",
          "value": "page"
        }
      ],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/support/"
  },
  {
    "route": "/usb-stick-fuer-android-auswaehlen/",
    "status": 200,
    "navVisible": true,
    "toggleHidden": true,
    "mainVisible": true,
    "languageHref": "/en/guides/choose-usb-drive-for-android/",
    "storeLinks": 1,
    "measure": {
      "url": "https://83ad5ea9.fotosafe-app.pages.dev/usb-stick-fuer-android-auswaehlen/",
      "title": "USB-Stick für Android auswählen | FotoSafe",
      "width": 320,
      "client": 320,
      "scroll": 343,
      "height": 5392,
      "h1": [
        "USB-Stick für Android auswählen: Was wirklich zusammenpassen muss"
      ],
      "outside": [
        {
          "tag": "DIV",
          "cls": "",
          "text": "Startseite\n/\nRatgeber\n\nHARDWARE-RATGEBER\n\nUSB-Stick für Android auswäh",
          "rect": {
            "x": 12,
            "y": 296.5,
            "width": 331.390625,
            "height": 620.15625,
            "top": 296.5,
            "right": 343.390625,
            "bottom": 916.65625,
            "left": 12
          }
        },
        {
          "tag": "NAV",
          "cls": "breadcrumbs",
          "text": "Startseite\n/\nRatgeber",
          "rect": {
            "x": 12,
            "y": 296.5,
            "width": 331.390625,
            "height": 23.765625,
            "top": 296.5,
            "right": 343.390625,
            "bottom": 320.265625,
            "left": 12
          }
        },
        {
          "tag": "P",
          "cls": "eyebrow",
          "text": "HARDWARE-RATGEBER",
          "rect": {
            "x": 12,
            "y": 348.265625,
            "width": 331.390625,
            "height": 21.65625,
            "top": 348.265625,
            "right": 343.390625,
            "bottom": 369.921875,
            "left": 12
          }
        },
        {
          "tag": "H1",
          "cls": "",
          "text": "USB-Stick für Android auswählen: Was wirklich zusammenpassen muss",
          "rect": {
            "x": 12,
            "y": 389.921875,
            "width": 331.390625,
            "height": 253.96875,
            "top": 389.921875,
            "right": 343.390625,
            "bottom": 643.890625,
            "left": 12
          }
        },
        {
          "tag": "P",
          "cls": "hero-lead",
          "text": "Nicht jeder Stecker garantiert eine funktionierende Datenverbindung. M",
          "rect": {
            "x": 12,
            "y": 671.890625,
            "width": 331.390625,
            "height": 119,
            "top": 671.890625,
            "right": 343.390625,
            "bottom": 790.890625,
            "left": 12
          }
        },
        {
          "tag": "DIV",
          "cls": "article-actions",
          "text": "Anleitung starten\nLesedauer: etwa 6 Minuten",
          "rect": {
            "x": 12,
            "y": 820.890625,
            "width": 331.390625,
            "height": 95.765625,
            "top": 820.890625,
            "right": 343.390625,
            "bottom": 916.65625,
            "left": 12
          }
        },
        {
          "tag": "DIV",
          "cls": "direct-answer",
          "text": "Kurzantwort: Prüfe Anschluss, OTG-Unterstützung, Datenfähigkeit des Ad",
          "rect": {
            "x": 12,
            "y": 961.65625,
            "width": 331.390625,
            "height": 260.953125,
            "top": 961.65625,
            "right": 343.390625,
            "bottom": 1222.609375,
            "left": 12
          }
        }
      ],
      "images": [
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 44,
          "height": 44
        },
        {
          "src": "/assets/fotosafe-app-icon.png",
          "alt": "",
          "natural": 512,
          "complete": true,
          "width": 40,
          "height": 40
        }
      ],
      "touch": [
        {
          "text": "Startseite",
          "cls": "",
          "href": "/",
          "w": 64.734375,
          "h": 23.765625
        },
        {
          "text": "Ratgeber",
          "cls": "",
          "href": "/hilfe/",
          "w": 61.6875,
          "h": 23.765625
        },
        {
          "text": "Schnellcheck",
          "cls": "",
          "href": "#start",
          "w": 296,
          "h": 40
        },
        {
          "text": "Anschluss & OTG",
          "cls": "",
          "href": "#anschluss",
          "w": 296,
          "h": 40
        },
        {
          "text": "Kapazität & Dateisystem",
          "cls": "",
          "href": "#speicher",
          "w": 296,
          "h": 40
        },
        {
          "text": "Vor dem Backup testen",
          "cls": "",
          "href": "#testen",
          "w": 296,
          "h": 40
        },
        {
          "text": "Wenn nichts erscheint",
          "cls": "",
          "href": "#probleme",
          "w": 296,
          "h": 40
        },
        {
          "text": "FotoSafe",
          "cls": "brand footer-brand",
          "href": "/",
          "w": 131.796875,
          "h": 40
        }
      ],
      "ariaCurrent": [],
      "storage": {
        "local": [],
        "session": []
      },
      "font": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
      "bodySize": "16px"
    },
    "languageClick": "https://83ad5ea9.fotosafe-app.pages.dev/en/guides/choose-usb-drive-for-android/"
  }
]
```

</details>

<details>
<summary>axe.json (unabhängiger Lauf)</summary>

```json
[
  {
    "violations": [
      {
        "id": "landmark-complementary-is-top-level",
        "impact": "moderate",
        "tags": [
          "cat.semantics",
          "best-practice"
        ],
        "description": "Ensure the complementary landmark or aside is at top level",
        "help": "Aside should not be contained in another landmark",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/landmark-complementary-is-top-level?application=axeAPI",
        "nodes": [
          {
            "any": [
              {
                "id": "landmark-is-top-level",
                "data": {
                  "role": null
                },
                "relatedNodes": [],
                "impact": "moderate",
                "message": "The null landmark is contained in another landmark."
              }
            ],
            "all": [],
            "none": [],
            "impact": "moderate",
            "html": "<aside class=\"safety-note\">",
            "target": [
              "aside"
            ],
            "failureSummary": "Fix any of the following:\n  The null landmark is contained in another landmark."
          }
        ]
      }
    ],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".chip-local"
          ],
          [
            ".chip-copy"
          ],
          [
            "li:nth-child(1) > span"
          ],
          [
            "li:nth-child(2) > span"
          ],
          [
            "li:nth-child(3) > span"
          ],
          [
            ".price-section > div:nth-child(1) > .kicker"
          ],
          [
            ".price-section > div:nth-child(1) > h2"
          ]
        ]
      }
    ],
    "passes": 38,
    "route": "/",
    "reducedMotion": "auto"
  },
  {
    "violations": [
      {
        "id": "landmark-complementary-is-top-level",
        "impact": "moderate",
        "tags": [
          "cat.semantics",
          "best-practice"
        ],
        "description": "Ensure the complementary landmark or aside is at top level",
        "help": "Aside should not be contained in another landmark",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/landmark-complementary-is-top-level?application=axeAPI",
        "nodes": [
          {
            "any": [
              {
                "id": "landmark-is-top-level",
                "data": {
                  "role": null
                },
                "relatedNodes": [],
                "impact": "moderate",
                "message": "The null landmark is contained in another landmark."
              }
            ],
            "all": [],
            "none": [],
            "impact": "moderate",
            "html": "<aside class=\"safety-note\"><span><svg aria-hidden=\"true\" viewBox=\"0 0 24 24\"><use href=\"/assets/icons.svg#shield\"></use></svg></span><h3>Copy first, verify second</h3><p>Open several photos and large videos from the USB drive before deleting anything from another device or location.</p></aside>",
            "target": [
              "aside"
            ],
            "failureSummary": "Fix any of the following:\n  The null landmark is contained in another landmark."
          }
        ]
      }
    ],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".chip-local"
          ],
          [
            ".chip-copy"
          ],
          [
            "li:nth-child(1) > span"
          ],
          [
            "li:nth-child(2) > span"
          ],
          [
            "li:nth-child(3) > span"
          ],
          [
            ".price-section > div:nth-child(1) > .kicker"
          ],
          [
            ".price-section > div:nth-child(1) > h2"
          ]
        ]
      }
    ],
    "passes": 38,
    "route": "/en/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 36,
    "route": "/hilfe/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 36,
    "route": "/en/help/",
    "reducedMotion": "auto"
  },
  {
    "violations": [
      {
        "id": "empty-table-header",
        "impact": "minor",
        "tags": [
          "cat.name-role-value",
          "best-practice"
        ],
        "description": "Ensure table headers have discernible text",
        "help": "Table header text should not be empty",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/empty-table-header?application=axeAPI",
        "nodes": [
          {
            "any": [
              {
                "id": "has-visible-text",
                "data": null,
                "relatedNodes": [],
                "impact": "minor",
                "message": "Element does not have text that is visible to screen readers"
              }
            ],
            "all": [],
            "none": [],
            "impact": "minor",
            "html": "<th></th>",
            "target": [
              "thead > tr > th:nth-child(1)"
            ],
            "failureSummary": "Fix any of the following:\n  Element does not have text that is visible to screen readers"
          }
        ]
      }
    ],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".breadcrumbs > a[href=\"/\"]"
          ],
          [
            "span:nth-child(3)"
          ],
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ],
          [
            ".article-actions > span"
          ],
          [
            "tr:nth-child(1) > td:nth-child(3)"
          ],
          [
            "tr:nth-child(2) > td:nth-child(3)"
          ],
          [
            "tr:nth-child(3) > td:nth-child(3)"
          ],
          [
            "tr:nth-child(4) > td:nth-child(3)"
          ]
        ]
      }
    ],
    "passes": 48,
    "route": "/android-fotos-auf-usb-stick-sichern/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".breadcrumbs > a[href$=\"en/\"]"
          ],
          [
            ".breadcrumbs > a[href$=\"help/\"]"
          ],
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ],
          [
            ".article-actions > span"
          ]
        ]
      }
    ],
    "passes": 38,
    "route": "/en/guides/back-up-android-photos-to-usb/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 37,
    "route": "/privacy/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 37,
    "route": "/en/privacy/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 35,
    "route": "/impressum/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 35,
    "route": "/en/imprint/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 37,
    "route": "/support/",
    "reducedMotion": "auto"
  },
  {
    "violations": [],
    "incomplete": [
      {
        "id": "color-contrast",
        "impact": "serious",
        "nodes": [
          [
            ".eyebrow"
          ],
          [
            "h1"
          ],
          [
            ".hero-lead"
          ]
        ]
      }
    ],
    "passes": 37,
    "route": "/en/support/",
    "reducedMotion": "auto"
  }
]
```

</details>

<details>
<summary>final-checks.json (unabhängiger Lauf)</summary>

```json
{
  "utc": "2026-09-13T09:44:42.440028+00:00",
  "dialogs": [
    {
      "route": "/",
      "sequence": [
        {
          "key": "Shift+Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        },
        {
          "key": "Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        },
        {
          "key": "Shift+Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Shift+Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        }
      ],
      "backgroundFocusLanded": false
    },
    {
      "route": "/en/",
      "sequence": [
        {
          "key": "Shift+Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        },
        {
          "key": "Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        },
        {
          "key": "Shift+Tab",
          "tag": "BODY",
          "cls": "",
          "inside": false,
          "focused": false
        },
        {
          "key": "Shift+Tab",
          "tag": "BUTTON",
          "cls": "lightbox-close",
          "inside": true,
          "focused": true
        }
      ],
      "backgroundFocusLanded": false
    }
  ],
  "mail": [
    {
      "route": "/support/",
      "targets": [
        "mailto:fotosafe@weidisoft.net?subject=FotoSafe%20Support"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    },
    {
      "route": "/en/support/",
      "targets": [
        "mailto:fotosafe@weidisoft.net?subject=FotoSafe%20Support"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    },
    {
      "route": "/impressum/",
      "targets": [
        "mailto:fotosafe@weidisoft.net"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    },
    {
      "route": "/en/imprint/",
      "targets": [
        "mailto:fotosafe@weidisoft.net"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    },
    {
      "route": "/privacy/",
      "targets": [
        "mailto:privacy@weidisoft.net",
        "mailto:privacy@weidisoft.net"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    },
    {
      "route": "/en/privacy/",
      "targets": [
        "mailto:privacy@weidisoft.net",
        "mailto:privacy@weidisoft.net"
      ],
      "method": "Click captured; external mail-client dispatch prevented; no email sent."
    }
  ]
}
```

</details>

### 8.8 Baseline-Identität sämtlicher geprüfter Originaldateien

SHA-256 von QA-REPORT.md ist hier absichtlich der ALTE builderverfasste Bericht als Teil des Reviewsubjects; der neue Bericht ist das nachträgliche Auditergebnis und nicht sein eigener Input. Identische Pfadsets und Bytes wurden vor dem Bericht nochmals geprüft. Secretmuster/Dependencycaches sind ausgeschlossen wie §2 dokumentiert.

#### Prüfworktree

| Pfad | Bytes | Baseline-SHA-256 |
| --- | --- | --- |
| .github/workflows/pages.yml | 944 | 70ba30837c598a64cbbca29e863af7a3a86f2676eb10b79895bfa2b2bac4404a |
| .gitignore | 11 | f162171ded7ff8c1d6032f7cb50317bc19cc4d1bbd4757be9f8ea75cdec540f1 |
| 404.html | 3770 | ecbf8e7b66a320747de6bd4b1fc105a789d3a1f8fcf58d552b3d44a417cb8d8e |
| ASSET-SOURCES.md | 4010 | 228a20dbd9801752110d545353be8e55718bffa2e2d96ddeae392d214cb24113 |
| ASTRA-HIGH-AUDIT-PROMPT.md | 39138 | 84c499714a083023f5a5777f0fb899fdf42e9562145013281582f3925f06dba9 |
| CONTENT-MAP.md | 3352 | 77b34a7625903a4c2d0a743cf9cb8726d94def7c2c0bc473b4e0e36eef60d512 |
| DEPLOYMENT.md | 4067 | c7b481272a3ffd3a2b10b4c2ba83b1cb57811e3c12cb605643359b7092914505 |
| HANDOFF.md | 5019 | d75dc69c1d5a5b63483e104af66d937e86870fdbed96116d68e388ce91db6426 |
| MAINTENANCE.md | 1994 | 7faf469501a17d6735f5cdafa388ae709cde6d48abb8db33a536d0971820c1f4 |
| QA-REPORT.md | 5185 | 417e0ef0834bf3f3ed5ebe355300f8b6f26094d7fafea2b30da645748c6c66c3 |
| README.md | 1090 | ff96f078e6a09d16feec4443498e17be5d182f75b891fde2d0a09fe9637ab6fa |
| SEO-MAP.md | 4192 | 38828ba4f7c9f30be1ccc7f12164f220d95178b8cbf57b6314b25c27ef49fb7f |
| assets/01-in-drei-schritten-auf-usb-de.png | 466247 | 6e7818a0c9dfdcbc05e1138a7592536ea5d011c906ca108cd7baa141efdfa30b |
| assets/01-in-drei-schritten-auf-usb-de.webp | 105426 | 459faec86fe0d03655bc2cdbb4715cc6ba3dd3df00f1edf4fa064b60e93771d3 |
| assets/01-three-guided-steps-to-usb-en.png | 465023 | 3d2dad1e747ac6060380403e15674e61c789b581a677273cf61587eb49652f03 |
| assets/01-three-guided-steps-to-usb-en.webp | 104648 | d333a19c8b19dd9a635a4665bf63866c666ed4ee20c4773ae8c0fb51568b2c21 |
| assets/02-backup-vorher-pruefen-de.png | 477814 | 180dbd05938eced91181e6f258d6cd0851b2045989a1289190aedfb36a1f5093 |
| assets/02-backup-vorher-pruefen-de.webp | 109710 | 9394a9f6bb68fe456abbe1a3c0e575b286e09e211107dd636f0984b89a3c5fd1 |
| assets/02-review-before-backup-en.png | 482961 | e41eb5eb49d4a503d684533e98c7e37ae2f6fbabcfd1ea05460fbddeac765146 |
| assets/02-review-before-backup-en.webp | 110084 | c31d155c1e7db690e59470fde834fded413619b394f52765a1976a43d1c50dcc |
| assets/03-expert-mode-sources-en.png | 486618 | 824585c0398c2b207f16b7e0dec688c2c74c10572ab7b15d32cc1943f46af97a |
| assets/03-expert-mode-sources-en.webp | 106824 | 33dbacdfe95224c1a63af9385283f8ea6226848957269df133d04994cfe1b754 |
| assets/03-expertenmodus-quellen-de.png | 500592 | 46a6c9b7a06d3c5cf4d1e492cc6b14ffc3b2c4cd6f5900418d598d0d09e43e06 |
| assets/03-expertenmodus-quellen-de.webp | 111098 | 9039b2ab18771bac1b34f99ca681e6cce33e80ef6c8eeb73fe00aee671fabe08 |
| assets/analytics-config.js | 3992 | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 |
| assets/fotosafe-app-icon.png | 59304 | 512d1b5e6aff99ce41807cc59bfcd4206191205ef4a3b7e4828c8100a33774a3 |
| assets/fotosafe-share.png | 376258 | 3d7ba925e2d85250fd8d3231efe69014362db2fea9b3f380956247327053e262 |
| assets/google-play/get-it-on-google-play-de.png | 15496 | 6760aac0db8d24da21f4fd803a06c6ef26c8849e0bd623420973a5666fd3a4c4 |
| assets/google-play/get-it-on-google-play-en.png | 4904 | f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849 |
| assets/icons.svg | 2114 | a3d29ce6695e57ef7d3e57c2238098eefbbcd3557a586588a494cf680b345bdf |
| assets/language-core.js | 1659 | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a |
| assets/language.js | 1387 | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 |
| assets/navigation.css | 8397 | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 |
| assets/navigation.js | 1677 | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 |
| assets/privacy-analytics-core.js | 6102 | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b |
| assets/privacy-analytics.js | 17804 | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 |
| assets/products/a57.webp | 18184 | 98991345b2e303e4d02a0915e17c0260c64f3e34adcdbbd17f88719c75846980 |
| assets/products/honor600.webp | 66588 | 6512527e03b14c5de844a17990dc99011ef9faa043a18b2a04ab618874ffe7d5 |
| assets/products/otg_cable.webp | 24170 | 070202055fd21c5ad971543561a94a3902295bbfbaf032cf67664d38469c4a4a |
| assets/products/otg_set.webp | 28026 | c2754d8d0456446e30a1adc2f9608f858961b4e4dff0c631152590c1e0ac0d3c |
| assets/products/otg_small.webp | 112370 | b02ee37c357b9d0f8bcdbdd502fb699add314eb482d04707ba10f4fbe2b9b377 |
| assets/products/s26.webp | 71328 | 32cee31239fa618d12385bbc5ad42ea68eea0dcf1a5a20a687ad339521ddfe54 |
| assets/products/tested-badge-de.webp | 55690 | e97989bfa4b80b77ca12fece824832fdc0ffb02be9b8565157a50b7a9df6f17d |
| assets/products/usba_128.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_256.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_64.webp | 13726 | ad8a0d1641a4c328214f84f899fde708f0d71d6506585b29ff1e5e1f895b7dae |
| assets/products/usbc_128.webp | 84324 | e1e7dbeba811d36c1ae20a224901b137c5cf558fa3c44e002a0a93ae7d3ce4ee |
| assets/products/usbc_256.webp | 83324 | c0ad199e1a01b322b534303e890c124f72edf106c4a812aa683c1d78676542b9 |
| assets/products/usbc_64.webp | 83912 | ff4feb3f1d4467a2eb30d05a709ecb30481d1d34b28e329c2b419ddc182128f5 |
| assets/screenshot-expert-de.jpg | 77920 | f7b8d55fe8c4dc878eeb00867100716344469b9e88a30a9374ba085a53e28e5f |
| assets/screenshot-result-de.jpg | 76312 | b13b185919dd2678814b15e4fd4ffa5995ac5a83423584745b806b7c7588782b |
| assets/screenshot-start-de.jpg | 71791 | 1d18008cf6be8a26c28209758b6611f1cd18d49d49282d3f4666531b4817041b |
| assets/usb-hilfe/01-sicherungsort-aendern.jpg | 82293 | 73a918b0ad006060343e58c4e56a1dc1a8cc1b83149c3577d0c750bc2e9e4e3c |
| assets/usb-hilfe/02-falscher-speicher.jpg | 38682 | 84185a46fc5e59477eec2eeea793b905ebfc1bcd6d47b0ee9578fb99611ba956 |
| assets/usb-hilfe/03-usb-nicht-erkannt.jpg | 73527 | 1716335aa8515f77fb3bb0212987ff06899b127e72cb97690f3506217d50c95f |
| assets/usb-hilfe/otg-adapter-erklaert-mobil.svg | 3376 | 4f5461cd5561b4668f8af8d125c9d9e1ff78cfd9090df1cc3ea63280c2fb08cf |
| assets/usb-hilfe/otg-adapter-erklaert.svg | 3867 | cfef63fb6214060e62d0aa5996eba7d0b887d45c85a1812b9f150f8c165cb42b |
| assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4 | 1248716 | 68ae5631c0f4a9e360e11364ade7d95e500297f5011418907374d93a057b9a01 |
| assets/usb-hilfe/usb-ordnerwahl-video-poster.webp | 44184 | 464341cb175641c25d119f3bce1096602960170bc9693a21410774029fd55d6e |
| dist/404.html | 3593 | 74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1 |
| dist/404/index.html | 3593 | 74b855bf56c0d0c42cb9c7c0b6b07d2aec63023ad64ca8dc27f28baeb473d2a1 |
| dist/_headers | 185 | 5c0c49fff51400d335bad6701a178e5a25e609f6a264ad15ed28ff8bd97c3e23 |
| dist/_redirects | 380 | d4ac7fbd565903b1d6241c7694ece3fbbd99df7396077fbb7b8a500e2e896bb3 |
| dist/android-fotos-auf-usb-stick-sichern/index.html | 13134 | 9ae4019df997727d98700fe136522da47263551549f40a0a50341d3cdebc01df |
| dist/assets/01-in-drei-schritten-auf-usb-de.png | 466247 | 6e7818a0c9dfdcbc05e1138a7592536ea5d011c906ca108cd7baa141efdfa30b |
| dist/assets/01-in-drei-schritten-auf-usb-de.webp | 105426 | 459faec86fe0d03655bc2cdbb4715cc6ba3dd3df00f1edf4fa064b60e93771d3 |
| dist/assets/01-three-guided-steps-to-usb-en.png | 465023 | 3d2dad1e747ac6060380403e15674e61c789b581a677273cf61587eb49652f03 |
| dist/assets/01-three-guided-steps-to-usb-en.webp | 104648 | d333a19c8b19dd9a635a4665bf63866c666ed4ee20c4773ae8c0fb51568b2c21 |
| dist/assets/02-backup-vorher-pruefen-de.png | 477814 | 180dbd05938eced91181e6f258d6cd0851b2045989a1289190aedfb36a1f5093 |
| dist/assets/02-backup-vorher-pruefen-de.webp | 109710 | 9394a9f6bb68fe456abbe1a3c0e575b286e09e211107dd636f0984b89a3c5fd1 |
| dist/assets/02-review-before-backup-en.png | 482961 | e41eb5eb49d4a503d684533e98c7e37ae2f6fbabcfd1ea05460fbddeac765146 |
| dist/assets/02-review-before-backup-en.webp | 110084 | c31d155c1e7db690e59470fde834fded413619b394f52765a1976a43d1c50dcc |
| dist/assets/03-expert-mode-sources-en.png | 486618 | 824585c0398c2b207f16b7e0dec688c2c74c10572ab7b15d32cc1943f46af97a |
| dist/assets/03-expert-mode-sources-en.webp | 106824 | 33dbacdfe95224c1a63af9385283f8ea6226848957269df133d04994cfe1b754 |
| dist/assets/03-expertenmodus-quellen-de.png | 500592 | 46a6c9b7a06d3c5cf4d1e492cc6b14ffc3b2c4cd6f5900418d598d0d09e43e06 |
| dist/assets/03-expertenmodus-quellen-de.webp | 111098 | 9039b2ab18771bac1b34f99ca681e6cce33e80ef6c8eeb73fe00aee671fabe08 |
| dist/assets/analytics-config.js | 3992 | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 |
| dist/assets/fotosafe-app-icon.png | 59304 | 512d1b5e6aff99ce41807cc59bfcd4206191205ef4a3b7e4828c8100a33774a3 |
| dist/assets/fotosafe-share.png | 376258 | 3d7ba925e2d85250fd8d3231efe69014362db2fea9b3f380956247327053e262 |
| dist/assets/google-play/get-it-on-google-play-de.png | 15496 | 6760aac0db8d24da21f4fd803a06c6ef26c8849e0bd623420973a5666fd3a4c4 |
| dist/assets/google-play/get-it-on-google-play-en.png | 4904 | f72611e2df8e88204009fd896d05d5e8e83c77009c63943bbffa169559934849 |
| dist/assets/icons.svg | 2114 | a3d29ce6695e57ef7d3e57c2238098eefbbcd3557a586588a494cf680b345bdf |
| dist/assets/language-core.js | 1659 | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a |
| dist/assets/language.js | 1387 | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 |
| dist/assets/navigation.css | 8397 | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 |
| dist/assets/navigation.js | 1677 | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 |
| dist/assets/privacy-analytics-core.js | 6102 | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b |
| dist/assets/privacy-analytics.js | 17804 | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 |
| dist/assets/products/a57.webp | 18184 | 98991345b2e303e4d02a0915e17c0260c64f3e34adcdbbd17f88719c75846980 |
| dist/assets/products/honor600.webp | 66588 | 6512527e03b14c5de844a17990dc99011ef9faa043a18b2a04ab618874ffe7d5 |
| dist/assets/products/otg_cable.webp | 24170 | 070202055fd21c5ad971543561a94a3902295bbfbaf032cf67664d38469c4a4a |
| dist/assets/products/otg_set.webp | 28026 | c2754d8d0456446e30a1adc2f9608f858961b4e4dff0c631152590c1e0ac0d3c |
| dist/assets/products/otg_small.webp | 112370 | b02ee37c357b9d0f8bcdbdd502fb699add314eb482d04707ba10f4fbe2b9b377 |
| dist/assets/products/s26.webp | 71328 | 32cee31239fa618d12385bbc5ad42ea68eea0dcf1a5a20a687ad339521ddfe54 |
| dist/assets/products/tested-badge-de.webp | 55690 | e97989bfa4b80b77ca12fece824832fdc0ffb02be9b8565157a50b7a9df6f17d |
| dist/assets/products/usba_128.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| dist/assets/products/usba_256.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| dist/assets/products/usba_64.webp | 13726 | ad8a0d1641a4c328214f84f899fde708f0d71d6506585b29ff1e5e1f895b7dae |
| dist/assets/products/usbc_128.webp | 84324 | e1e7dbeba811d36c1ae20a224901b137c5cf558fa3c44e002a0a93ae7d3ce4ee |
| dist/assets/products/usbc_256.webp | 83324 | c0ad199e1a01b322b534303e890c124f72edf106c4a812aa683c1d78676542b9 |
| dist/assets/products/usbc_64.webp | 83912 | ff4feb3f1d4467a2eb30d05a709ecb30481d1d34b28e329c2b419ddc182128f5 |
| dist/assets/screenshot-expert-de.jpg | 77920 | f7b8d55fe8c4dc878eeb00867100716344469b9e88a30a9374ba085a53e28e5f |
| dist/assets/screenshot-result-de.jpg | 76312 | b13b185919dd2678814b15e4fd4ffa5995ac5a83423584745b806b7c7588782b |
| dist/assets/screenshot-start-de.jpg | 71791 | 1d18008cf6be8a26c28209758b6611f1cd18d49d49282d3f4666531b4817041b |
| dist/assets/site.css | 18855 | 6d2982c09c790e5131474ba5a00a6c24265b113e9f70a260cdc3bf57e89b3f0d |
| dist/assets/site.js | 1647 | 13dd5a46b08cc86d6823ff9313d1d24d2b8661bcb74daf60468012d49a6dbead |
| dist/assets/usb-hilfe/01-sicherungsort-aendern.jpg | 82293 | 73a918b0ad006060343e58c4e56a1dc1a8cc1b83149c3577d0c750bc2e9e4e3c |
| dist/assets/usb-hilfe/02-falscher-speicher.jpg | 38682 | 84185a46fc5e59477eec2eeea793b905ebfc1bcd6d47b0ee9578fb99611ba956 |
| dist/assets/usb-hilfe/03-usb-nicht-erkannt.jpg | 73527 | 1716335aa8515f77fb3bb0212987ff06899b127e72cb97690f3506217d50c95f |
| dist/assets/usb-hilfe/otg-adapter-erklaert-mobil.svg | 3376 | 4f5461cd5561b4668f8af8d125c9d9e1ff78cfd9090df1cc3ea63280c2fb08cf |
| dist/assets/usb-hilfe/otg-adapter-erklaert.svg | 3867 | cfef63fb6214060e62d0aa5996eba7d0b887d45c85a1812b9f150f8c165cb42b |
| dist/assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4 | 1248716 | 68ae5631c0f4a9e360e11364ade7d95e500297f5011418907374d93a057b9a01 |
| dist/assets/usb-hilfe/usb-ordnerwahl-video-poster.webp | 44184 | 464341cb175641c25d119f3bce1096602960170bc9693a21410774029fd55d6e |
| dist/en/404/index.html | 3380 | 82428907fd474d01db8ba9192f468b9f172c942bdf49f99eb6dfa20689f75d9d |
| dist/en/guides/android-photo-backup-strategy/index.html | 6765 | 2e3bdeb315656ffb9881a9f7c883d69733bd6e754c8af104f6f93cad67e70adc |
| dist/en/guides/back-up-android-photos-to-usb/index.html | 8344 | 4a7c0eb54b110bf7270f46dc11b46cfb927e87041532366ae4687b285a743d02 |
| dist/en/guides/choose-usb-drive-for-android/index.html | 7032 | 81eb67e073229389689661eed8adb8c4e7ff18afdd110c5f8e5292840c0f3f60 |
| dist/en/help/index.html | 5470 | 103f084b676252e6880f14469d418a0f4a030d0c51b93c051490f865411e7741 |
| dist/en/imprint/index.html | 3766 | 08e9e4267950f56201c2d2847e7800bd4b336fa009dcfe05ff3f50c0d334b4e5 |
| dist/en/index.html | 11881 | fabe838ff8a389885dfcb7b8fb81641b6fb2911f6f3ed9a8a63b649ab5a7f3f0 |
| dist/en/privacy/index.html | 5612 | 24d100fdb876a5ec3cca9d70044cf93f41ee41759885f5d30b14270d32d88048 |
| dist/en/support/index.html | 4146 | f66fb049f21761f089af969db6c7b058d22c4366d62a34c1493746d24cc85e5c |
| dist/foto-backup-strategie-android/index.html | 7664 | 0bb447da9e823e931547cda8b97caa68be4192e0d7683a37d4acf859664b62d9 |
| dist/hilfe/index.html | 5985 | 98ffdfa48e5afa07a0216ae7226d8a01bde4548931f9992c97d5cf197f6bd3b9 |
| dist/impressum/index.html | 3834 | d2a4059a81c58adc88ba7b6fcdc8972bb0e43dd32a5c010ee707fe10cc803c2f |
| dist/index.html | 13056 | da9bc26de60fedcdea6044d03f15abc431ee5cabed5492216dbc73ae079f7625 |
| dist/privacy/index.html | 6229 | 11c12104fe8601b43e186d56fd5b065337f10224dfaeee3a9023a4de73087b0c |
| dist/robots.txt | 26 | 331ea9090db0c9f6f597bd9840fd5b171830f6e0b3ba1cb24dfa91f0c95aedc1 |
| dist/sitemap.xml | 1301 | 0c2cb53a0b7ef8adcc09e60d4e605caf15e561514648fa52f6652b0ce51d97ca |
| dist/support/index.html | 4413 | e029288009ac4044b13e936ea7ed5ff201c03d7c0b0cf385ace0ad6aa9976158 |
| dist/usb-stick-fuer-android-auswaehlen/index.html | 8098 | 6951b6feb04552d5062c766979d4b80718eedc10a191a36e7ecc2e85902172c4 |
| en/404.html | 3735 | 97c93c0b8aa9fa24f96a9fa07ba2963b11cb49cff98a7d35ed1b516ec74c13f8 |
| en/help.html | 61352 | 25875d31b7dba755aaff9d7a03e7f97211c8b9c789e1c3019cd0c86fae24fd09 |
| en/imprint.html | 9099 | 5e768ba6315dfeb9cbd6917b9b53eed9f9563112541524456bee68319f54da2f |
| en/index.html | 15441 | 4df72259306557fc5f246b7d7739cca30fa7343102a91a9af22cfbdab4448851 |
| en/privacy.html | 16560 | ba63444999e6cc0ead764a38e437ade6c4bbe4d09bf891a8db76d27851a62417 |
| en/select-usb-drive.html | 2608 | 17ca40904611caca398fce52fd3b5664889c7b5a21eb1920402456e264f23d5e |
| en/support.html | 7071 | 6e1ca719d749b77367b6d2a4b84f5e467e5dd0d2ab1f8672f9ab0f938337dc88 |
| hilfe.html | 63030 | 5167e9c05df1c1aff36b9a754a1e1e7119f471bc9ef88ce6aa6e6f6a74c523b7 |
| impressum.html | 9074 | 8c7cbb2d35d8fe462caab95b7dbac23628583021df5336b90c4808909d523b23 |
| index.html | 15591 | 8a232f734bae08d6a92982c57b7557174606ed6d30c356b669288483aab2f83b |
| package-lock.json | 149 | 4d0a16977d22f268d81a752c28c9cd1e8b3cf542be9d6cdbe810d4521655a9c3 |
| package.json | 466 | 611456f3478129e7271ae98b4a6834eb9202d79a62acf3f45604881e852bea16 |
| privacy.html | 17293 | f566afea406bad455a54d9f870960ed12ebf3bd104c7c50515003535451a2936 |
| reports/browser-qa-live.json | 13569 | b373a6667a0afbd817418f7174e61ab6fe4170e34c7df1ba01c21ff439cbad5f |
| reports/browser-qa.json | 13552 | fbcd90eb6ad540358b37ad9574c7fed37bd978f1683c537fb0debf05d5f0102e |
| reports/lighthouse/guide.json | 630533 | 80802e1aa35ef085b34997b19a66da0613478534564875b4d5687f8e8932cdb9 |
| reports/lighthouse/home.json | 578857 | 451f0b586425d0a4072b3a753fa593aefc5a02991e1d2b006f16b0f99c1207f5 |
| reports/screenshots/contact-sheet.png | 810128 | b51be7056c8142900d000e85f83f4355c64b4d6da257e3bc27a1a070883793c4 |
| reports/screenshots/guide-de-desktop.png | 1191213 | 08ce8eddb5e7da23167924d068347337269e460aa1a127338faedc4d6ca2bf7e |
| reports/screenshots/guide-de-mobile.png | 877414 | 0808e84b67c3bf71f44b272b0ff05cf48cb2d36804ceb5572164597af8ff8ea2 |
| reports/screenshots/guide-desktop.png | 1143134 | 3cea3f7cad2a29721d7f8fe7486f13ff509c3a2f1b5edbf6df004d55abb0c826 |
| reports/screenshots/guide-en-desktop.png | 947226 | 9f8a0ba872f21553c54334e3342f71f3dfae56c727a16563ab09c7b95d7472c0 |
| reports/screenshots/guide-en-mobile.png | 462134 | 34120a89d55c8f6d9d058cc09d96f36474b27af76e66d546c4801cb9e76ecd1f |
| reports/screenshots/guide-mobile.png | 832479 | 4ac73cc211183c79113672d2b64f2fd916dca419f08032ee085466770f45ae62 |
| reports/screenshots/help-de-desktop.png | 394819 | ecbe69f8d32fdc0f955674786b63f3eadfc84bb30ee006aa64d1a5fa217cfb80 |
| reports/screenshots/help-de-mobile.png | 249303 | a2a0c06786d5690ae67c15a1f66c392d1d0b9c09e584b9a85e2552ae3ee47a8d |
| reports/screenshots/help-en-desktop.png | 351883 | 8e6a94eec3f79f9e99c62a2ce4e4ef430e285829e6aa56c47b33847c1a080b3f |
| reports/screenshots/home-de-desktop.png | 1168064 | c29fc0a30ebcbb0a48694f226416af0210dfe494577e71ee276d0437fa1bbb02 |
| reports/screenshots/home-de-mobile.png | 677094 | 44fbe30783d87d3c6a8a3688539ec5e5ab9c2e8d2d01de1dfc9f93b25bab9629 |
| reports/screenshots/home-desktop.png | 1093241 | 76a50cf0a28db0c7dd322e3d4d905ad5b46c628f6c671f548aa1027985c782da |
| reports/screenshots/home-en-desktop.png | 602185 | f39ccf47abcfe4cb43f549f5369c1f3f5079712b98dd36279dd89ea0f45051f7 |
| reports/screenshots/home-en-mobile.png | 394836 | 6170c42242844623a17c6f0f51429ffdf53ec90276c569dcfb9b6da07b9f72ee |
| reports/screenshots/home-mobile.png | 657936 | ebb8710e4d158705a5c826574a57c12a1f9d4d8490391a25d41bde1f6fd3d879 |
| reports/screenshots/live/guide-de-desktop.png | 1191208 | 316bf24870d6a39ca24c67e849b79ab945480aa47b37cb606422cbded11b0f31 |
| reports/screenshots/live/guide-de-mobile.png | 879308 | 508fc43d9d2a6740f3a2cfbf7a7632cfeeda202a569397dc96554fd8cb5630ff |
| reports/screenshots/live/guide-en-desktop.png | 992199 | a5f3ee0d166ff6d76a7fdee9eea570d281384d704227857b04f11fa3f28fee61 |
| reports/screenshots/live/guide-en-mobile.png | 495333 | 3d170fc8e487b73e1ae53257fbafef86dd2bf9e9629f009b2b4c567c5bc6aaa3 |
| reports/screenshots/live/help-de-desktop.png | 394819 | 80c87268811fefd377c7e55c068dd2c03c50041ef3c9ef65d9ecd1513af5bd9d |
| reports/screenshots/live/help-de-mobile.png | 249303 | a2a0c06786d5690ae67c15a1f66c392d1d0b9c09e584b9a85e2552ae3ee47a8d |
| reports/screenshots/live/help-en-desktop.png | 351869 | 02edbd8610bbea3d408c16ea97f776cf4a6bc2016c56f03afd6c036b3dcf3326 |
| reports/screenshots/live/home-de-desktop.png | 1168062 | 896693946357edcaac685347b89f070e83a332483f0be93f7b0b6ace629ca67e |
| reports/screenshots/live/home-de-mobile.png | 676776 | 40b9ee5eac27df77172bb4d07179685e54bc5e19506b8b553675bc6db9e4de22 |
| reports/screenshots/live/home-de-narrow.png | 648038 | 090b272bd855870bb9087d4f2f700dafe085c43a3d33fb89c9fb02ac098cf9fa |
| reports/screenshots/live/home-en-desktop.png | 1062493 | 196ff659e70b0450b0262060d44856b9ac60c32af3b902be10c2ad036b2b8028 |
| reports/screenshots/live/home-en-mobile.png | 609965 | ae2f0216da515b2712a32b635f4e196140a272dd5a6ed48576997c5b43ce9e9b |
| reports/screenshots/live/home-en-narrow.png | 576513 | 16b2de853b4ae8a38101311afeb0f5eaa6a186a0027e36533b7a9976109ba3d3 |
| reports/screenshots/live/privacy-de-mobile.png | 368775 | 34297e9946f1f59c9157e65e11ca014c38656b73dad20a3e93d95f8bba1b5abc |
| reports/screenshots/live/privacy-de-narrow.png | 357206 | 60a83f05b5577dd59037b141774254bcde6c9dd241237761d03d9407a58e7527 |
| reports/screenshots/live/privacy-en-desktop.png | 502226 | bce4ff254546fad4615931c01a7df0a29190a465ba91b7441849acd56949f5f3 |
| reports/screenshots/live/support-de-desktop.png | 324163 | 90d351271b65cf010ae6c15487b0e59a7484b099ca0a5033a6ecb0ca0fde5704 |
| reports/screenshots/local/guide-de-desktop.png | 1191213 | 08ce8eddb5e7da23167924d068347337269e460aa1a127338faedc4d6ca2bf7e |
| reports/screenshots/local/guide-de-mobile.png | 877572 | a7203cde79571c13cedf2f48bf79ccbd710b28c0090ca0395b5e0d45b23c766e |
| reports/screenshots/local/guide-en-desktop.png | 992199 | a5f3ee0d166ff6d76a7fdee9eea570d281384d704227857b04f11fa3f28fee61 |
| reports/screenshots/local/guide-en-mobile.png | 495574 | f6ecd15b3c3b93e1a492c036489305dae2fd1ce1affea7ac308390ea8854f3b7 |
| reports/screenshots/local/help-de-desktop.png | 394819 | ecbe69f8d32fdc0f955674786b63f3eadfc84bb30ee006aa64d1a5fa217cfb80 |
| reports/screenshots/local/help-de-mobile.png | 249303 | a2a0c06786d5690ae67c15a1f66c392d1d0b9c09e584b9a85e2552ae3ee47a8d |
| reports/screenshots/local/help-en-desktop.png | 351874 | 225f8e7002c9444a422e13cfcb96688879d29807358c69fde8b08e7b48cf53bd |
| reports/screenshots/local/home-de-desktop.png | 1168064 | c29fc0a30ebcbb0a48694f226416af0210dfe494577e71ee276d0437fa1bbb02 |
| reports/screenshots/local/home-de-mobile.png | 677180 | c09f6755cac9026498c457d6fa5726b2b0fd4877bfdcbdbba719c0c8aad7e9ce |
| reports/screenshots/local/home-de-narrow.png | 648675 | a81f3efd5b09e9c4a363c9ffe363e9737cb69d9aa903f14b4cd6449ca73c9a1e |
| reports/screenshots/local/home-en-desktop.png | 1062312 | ad6bcc901a690fe653a3f41900d5ac3fa18210d23a8d536db3513c7a42f05a7b |
| reports/screenshots/local/home-en-mobile.png | 608647 | b6cb07170d8f540065be9aa5b666ad51f8744439526d197a26e86fa794374c1f |
| reports/screenshots/local/home-en-narrow.png | 579111 | 9eac2d9d1dbe89f24dffb7a1080ce71dfe69bbc1302073bdbaa62b656731d4b4 |
| reports/screenshots/local/privacy-de-mobile.png | 368775 | 34297e9946f1f59c9157e65e11ca014c38656b73dad20a3e93d95f8bba1b5abc |
| reports/screenshots/local/privacy-de-narrow.png | 357206 | 60a83f05b5577dd59037b141774254bcde6c9dd241237761d03d9407a58e7527 |
| reports/screenshots/local/privacy-en-desktop.png | 502226 | bce4ff254546fad4615931c01a7df0a29190a465ba91b7441849acd56949f5f3 |
| reports/screenshots/local/support-de-desktop.png | 324202 | 59e57335755109db56931106545d53657558874975f2506e24805413d4721977 |
| reports/screenshots/privacy-en-desktop.png | 502226 | bce4ff254546fad4615931c01a7df0a29190a465ba91b7441849acd56949f5f3 |
| reports/screenshots/review-fixes.png | 232900 | 0d07ef5c236ec1be8ec05ea880c49c9eaa7956294d1f165dcd00472c364e2b5c |
| reports/screenshots/support-de-desktop.png | 324202 | 59e57335755109db56931106545d53657558874975f2506e24805413d4721977 |
| scripts/browser-localization-qa.js | 16215 | ec6966c50d00a4aa010ef808945205e3f5c920cf0317f52d9c1363d7c6625253 |
| scripts/browser-qa.py | 9605 | 2e7502bbc667fc284089a98a280450625b73514429a671a108400bd707826862 |
| scripts/build-site.js | 24330 | f8a936a6da2067466b5368ec30e70fa3f748bd66d629b2bb5943b7c7419bf030 |
| scripts/site-content.js | 40075 | 415563cc6240d20ed0a7485d54113adba5d8752473a98efac7d9c86ebbb65ede |
| scripts/validate-site.js | 3325 | 959d5638ede196560db5479e186413dade1ff3db1e3f02c11045a7fe33d1ae1f |
| src/site.css | 18855 | 6d2982c09c790e5131474ba5a00a6c24265b113e9f70a260cdc3bf57e89b3f0d |
| src/site.js | 1647 | 13dd5a46b08cc86d6823ff9313d1d24d2b8661bcb74daf60468012d49a6dbead |
| support.html | 7103 | e0a4d70bc6a8dff9fad5e183e27369c6b6bab087061ba3a8bb8af9d5122b0250 |
| tests/analytics-config.test.js | 1741 | 700787d4901715feb22e38922dea5cad654012bff84f4454a919dae5aae7f5d8 |
| tests/localization.test.js | 5833 | ca17b0af070b12d0fcc10356d841056188484923a10b8aee890a3ba590d125f9 |
| tests/privacy-analytics-controller.test.js | 5134 | 09c812a94b014c05f0a554c8863336545e3206635145a5c19d3d6df90c4b054a |
| tests/privacy-analytics-core.test.js | 3969 | e68b14f22197f774677cf66f738addf2ffa8aaf6c8a229fb550a263de2ad4055 |
| tests/site-structure.test.js | 7933 | c60141f64ae32615f153b3c0f3e8cdbdc4d09201c3a7f7eef9d8c4e983faa47a |
| tests/workflow.test.js | 713 | b2b6b95e6e928cef11b3b6d9aaeab6665b9efe9a722f613f046a4cc6f7518d7c |
| usb-stick-auswaehlen.html | 2572 | 9e7c0f06db08a6e01c7feefff3444c083a3ba400f18cc19aeb39269bd2e6f7d5 |

#### Geschützte Hauptkopie

| Pfad | Bytes | Baseline-SHA-256 |
| --- | --- | --- |
| .github/workflows/pages.yml | 944 | 70ba30837c598a64cbbca29e863af7a3a86f2676eb10b79895bfa2b2bac4404a |
| .gitignore | 11 | f162171ded7ff8c1d6032f7cb50317bc19cc4d1bbd4757be9f8ea75cdec540f1 |
| 404.html | 3770 | ecbf8e7b66a320747de6bd4b1fc105a789d3a1f8fcf58d552b3d44a417cb8d8e |
| README.md | 1090 | ff96f078e6a09d16feec4443498e17be5d182f75b891fde2d0a09fe9637ab6fa |
| artifacts/localization-qa/LOCAL-PASS.md | 1627 | dffc5c040d3716bc288976d2932f661260c4b60517f656d03ac85f25c6ec1c88 |
| artifacts/localization-qa/de-help-1440.png | 3821188 | 788ec90d40bdbda59e05be51de9b657692530acd708e9a921988060b10eb77fc |
| artifacts/localization-qa/de-help-390.png | 3296176 | e9c914850ac7470c81f9228ca2656915ee1e1723336318ad0767e72ab780f860 |
| artifacts/localization-qa/de-home-1440.png | 1032188 | 2dbb38d62245c30f176d6128176b7174a91e9d34c206974172e7557dee3ab50f |
| artifacts/localization-qa/de-home-390.png | 844635 | 6f2e35644c52bfbbb74735e904bd1369728b45be42a2515eb2bc51e0f823587b |
| artifacts/localization-qa/en-help-1440.png | 3128726 | 58de7820399247cabca055c7e5cca497974ffde72c270fc02be7a3085e02b8ed |
| artifacts/localization-qa/en-help-390.png | 2847798 | 3775d1da5651e68bc524296b60da8522976833f1ec5c750aedbfe9a31d4d5f3b |
| artifacts/localization-qa/en-home-1440.png | 1013973 | 59d79380c8ad740772c7f28cfcd35e0957afb01d6c1fe11659435bb903d8e38c |
| artifacts/localization-qa/en-home-390.png | 805299 | cf52d3e516776d450e640289ba8e5414e0bf88bc891cb3562a911d0f7a3b8492 |
| artifacts/localization-qa/help-desktop-comparison.png | 3769648 | d8aaaa4bb534b2b140c2c7c5096b06b7fe077a875080e62c66db676d0bc85d1d |
| artifacts/localization-qa/help-mobile-comparison.png | 9388590 | 77d376ba51aa9f35ddd35868b363f5d46b67523c335aea7da0e0a745a21cb956 |
| artifacts/localization-qa/home-desktop-comparison.png | 963102 | 4d4a71f0fdb8c85e2ad6c91f152455018de9850214c4cbcbd4263d666cad731c |
| artifacts/localization-qa/home-mobile-comparison.png | 2522031 | b5f046086d8e29f2c5555208cb021e3b8ee01403b17f64bed93bcccee67d233b |
| artifacts/screenshot-parity/01-de-en.png | 682370 | 6f89f7fc9a08facaed7c09e9c5eafbeb766dc4b080e0d7b9a8fb0551b6b091b7 |
| artifacts/screenshot-parity/02-de-en.png | 767898 | b451ce26caf7682eba2f85e3ebc81109a85010fbf493801a7762aeede35d49b8 |
| artifacts/screenshot-parity/03-de-en.png | 722559 | 3b27401afefe8b2332dcbc502c61786c3fc2bf0c0c7bbaf7cefffbc555d9e778 |
| assets/01-in-drei-schritten-auf-usb-de.png | 466247 | 6e7818a0c9dfdcbc05e1138a7592536ea5d011c906ca108cd7baa141efdfa30b |
| assets/01-three-guided-steps-to-usb-en.png | 465023 | 3d2dad1e747ac6060380403e15674e61c789b581a677273cf61587eb49652f03 |
| assets/02-backup-vorher-pruefen-de.png | 477814 | 180dbd05938eced91181e6f258d6cd0851b2045989a1289190aedfb36a1f5093 |
| assets/02-review-before-backup-en.png | 482961 | e41eb5eb49d4a503d684533e98c7e37ae2f6fbabcfd1ea05460fbddeac765146 |
| assets/03-expert-mode-sources-en.png | 486618 | 824585c0398c2b207f16b7e0dec688c2c74c10572ab7b15d32cc1943f46af97a |
| assets/03-expertenmodus-quellen-de.png | 500592 | 46a6c9b7a06d3c5cf4d1e492cc6b14ffc3b2c4cd6f5900418d598d0d09e43e06 |
| assets/analytics-config.js | 3992 | 31c1c77f71dc96246f818aa1082ae588fab41fde35bbe8033676cedcb95a9f72 |
| assets/fotosafe-app-icon.png | 59304 | 512d1b5e6aff99ce41807cc59bfcd4206191205ef4a3b7e4828c8100a33774a3 |
| assets/language-core.js | 1659 | 6f1a20bd77368506b90d80c58127e4c1f7985886b77e0f7f7e9f9f1faab0e94a |
| assets/language.js | 1387 | 869857a5b2dcb97010b5800c2fe1c6e9700f1e8260126bdc189024190cd9d249 |
| assets/navigation.css | 8397 | 8bf2a12aa488f6fe36acd79d547a7eed1556d506c9d25e3e2628e9d5fade2ad3 |
| assets/navigation.js | 1677 | 6389930166491909398135a0b0a259beacdbe886626b35aab0e65d8da0cf4f18 |
| assets/privacy-analytics-core.js | 6102 | d8417d0b1a24f28890505fa8e9eb4b21d1623d30c2903578e812707c12eb3d4b |
| assets/privacy-analytics.js | 17804 | 59e9de4dace99869e5dcf723d6e77c11d1ffd9692d0b8d0e39265c5f274f7b92 |
| assets/products/a57.webp | 18184 | 98991345b2e303e4d02a0915e17c0260c64f3e34adcdbbd17f88719c75846980 |
| assets/products/honor600.webp | 66588 | 6512527e03b14c5de844a17990dc99011ef9faa043a18b2a04ab618874ffe7d5 |
| assets/products/otg_cable.webp | 24170 | 070202055fd21c5ad971543561a94a3902295bbfbaf032cf67664d38469c4a4a |
| assets/products/otg_set.webp | 28026 | c2754d8d0456446e30a1adc2f9608f858961b4e4dff0c631152590c1e0ac0d3c |
| assets/products/otg_small.webp | 112370 | b02ee37c357b9d0f8bcdbdd502fb699add314eb482d04707ba10f4fbe2b9b377 |
| assets/products/s26.webp | 71328 | 32cee31239fa618d12385bbc5ad42ea68eea0dcf1a5a20a687ad339521ddfe54 |
| assets/products/tested-badge-de.webp | 55690 | e97989bfa4b80b77ca12fece824832fdc0ffb02be9b8565157a50b7a9df6f17d |
| assets/products/usba_128.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_256.webp | 12372 | 8cbd11f6980a257cad783489f481bd7832b0d43d050fdc0484b3bc67a9a6fb85 |
| assets/products/usba_64.webp | 13726 | ad8a0d1641a4c328214f84f899fde708f0d71d6506585b29ff1e5e1f895b7dae |
| assets/products/usbc_128.webp | 84324 | e1e7dbeba811d36c1ae20a224901b137c5cf558fa3c44e002a0a93ae7d3ce4ee |
| assets/products/usbc_256.webp | 83324 | c0ad199e1a01b322b534303e890c124f72edf106c4a812aa683c1d78676542b9 |
| assets/products/usbc_64.webp | 83912 | ff4feb3f1d4467a2eb30d05a709ecb30481d1d34b28e329c2b419ddc182128f5 |
| assets/screenshot-expert-de.jpg | 77920 | f7b8d55fe8c4dc878eeb00867100716344469b9e88a30a9374ba085a53e28e5f |
| assets/screenshot-result-de.jpg | 76312 | b13b185919dd2678814b15e4fd4ffa5995ac5a83423584745b806b7c7588782b |
| assets/screenshot-start-de.jpg | 71791 | 1d18008cf6be8a26c28209758b6611f1cd18d49d49282d3f4666531b4817041b |
| assets/usb-hilfe/01-sicherungsort-aendern.jpg | 82293 | 73a918b0ad006060343e58c4e56a1dc1a8cc1b83149c3577d0c750bc2e9e4e3c |
| assets/usb-hilfe/02-falscher-speicher.jpg | 38682 | 84185a46fc5e59477eec2eeea793b905ebfc1bcd6d47b0ee9578fb99611ba956 |
| assets/usb-hilfe/03-usb-nicht-erkannt.jpg | 73527 | 1716335aa8515f77fb3bb0212987ff06899b127e72cb97690f3506217d50c95f |
| assets/usb-hilfe/otg-adapter-erklaert-mobil.svg | 3376 | 4f5461cd5561b4668f8af8d125c9d9e1ff78cfd9090df1cc3ea63280c2fb08cf |
| assets/usb-hilfe/otg-adapter-erklaert.svg | 3867 | cfef63fb6214060e62d0aa5996eba7d0b887d45c85a1812b9f150f8c165cb42b |
| assets/usb-hilfe/usb-ordner-richtig-waehlen-s23.mp4 | 1248716 | 68ae5631c0f4a9e360e11364ade7d95e500297f5011418907374d93a057b9a01 |
| assets/usb-hilfe/usb-ordnerwahl-video-poster.webp | 44184 | 464341cb175641c25d119f3bce1096602960170bc9693a21410774029fd55d6e |
| en/404.html | 3735 | 97c93c0b8aa9fa24f96a9fa07ba2963b11cb49cff98a7d35ed1b516ec74c13f8 |
| en/help.html | 61352 | 25875d31b7dba755aaff9d7a03e7f97211c8b9c789e1c3019cd0c86fae24fd09 |
| en/imprint.html | 9099 | 5e768ba6315dfeb9cbd6917b9b53eed9f9563112541524456bee68319f54da2f |
| en/index.html | 15441 | 4df72259306557fc5f246b7d7739cca30fa7343102a91a9af22cfbdab4448851 |
| en/privacy.html | 16560 | ba63444999e6cc0ead764a38e437ade6c4bbe4d09bf891a8db76d27851a62417 |
| en/select-usb-drive.html | 2608 | 17ca40904611caca398fce52fd3b5664889c7b5a21eb1920402456e264f23d5e |
| en/support.html | 7071 | 6e1ca719d749b77367b6d2a4b84f5e467e5dd0d2ab1f8672f9ab0f938337dc88 |
| hilfe.html | 63030 | 5167e9c05df1c1aff36b9a754a1e1e7119f471bc9ef88ce6aa6e6f6a74c523b7 |
| impressum.html | 9074 | 8c7cbb2d35d8fe462caab95b7dbac23628583021df5336b90c4808909d523b23 |
| index.html | 15591 | 8a232f734bae08d6a92982c57b7557174606ed6d30c356b669288483aab2f83b |
| package-lock.json | 149 | 4d0a16977d22f268d81a752c28c9cd1e8b3cf542be9d6cdbe810d4521655a9c3 |
| package.json | 256 | dd824b7438d0cce9abef8d42f10c6339a2a78b0d44e12cbbb726c98d29b81501 |
| privacy.html | 17293 | f566afea406bad455a54d9f870960ed12ebf3bd104c7c50515003535451a2936 |
| scripts/browser-localization-qa.js | 16215 | ec6966c50d00a4aa010ef808945205e3f5c920cf0317f52d9c1363d7c6625253 |
| scripts/validate-site.js | 2631 | e2dc7b00b808f6e69d7737a40b7e47f0c80a5a47ed17cc1eac7da319ee272c0d |
| support.html | 7103 | e0a4d70bc6a8dff9fad5e183e27369c6b6bab087061ba3a8bb8af9d5122b0250 |
| tests/analytics-config.test.js | 1741 | 700787d4901715feb22e38922dea5cad654012bff84f4454a919dae5aae7f5d8 |
| tests/localization.test.js | 5833 | ca17b0af070b12d0fcc10356d841056188484923a10b8aee890a3ba590d125f9 |
| tests/privacy-analytics-controller.test.js | 5134 | 09c812a94b014c05f0a554c8863336545e3206635145a5c19d3d6df90c4b054a |
| tests/privacy-analytics-core.test.js | 3969 | e68b14f22197f774677cf66f738addf2ffa8aaf6c8a229fb550a263de2ad4055 |
| tests/site-structure.test.js | 6883 | 8dd7e2be3040bb43752f0331413865b39319734a46a81957d08f9c10efd0660a |
| tests/workflow.test.js | 713 | b2b6b95e6e928cef11b3b6d9aaeab6665b9efe9a722f613f046a4cc6f7518d7c |
| usb-stick-auswaehlen.html | 2572 | 9e7c0f06db08a6e01c7feefff3444c083a3ba400f18cc19aeb39269bd2e6f7d5 |

### 8.9 Frische Screenshot- und Auditdatensatz-Identitäten

| Temporäres Beweisartefakt | Bytes | SHA-256 |
| --- | --- | --- |
| screens/404-1280.png | 262765 | de205c0b871b565c746002026790dcc04de6f44fc8588e6e943a06e80f50c3c5 |
| screens/404-320.png | 106512 | c412d64728f2f2f924400ff1ca9e988f6056e0fb0bc1ccb5dfdf44896c18759f |
| screens/404-390.png | 122715 | 5b9aabb608a5c4471491efebafb3e8c45e540da28861d9d3e9cc21a01f2c65c2 |
| screens/android-fotos-auf-usb-stick-sichern-1280.png | 1192958 | d3402616fd9395bcdd942403f9c7361d08fe866295305920773c616fd7cf0260 |
| screens/android-fotos-auf-usb-stick-sichern-1440.png | 1230637 | 40570298fa69a8ce9915ff0458401648309e8dfa9bf7d9277fc0a157f071b5dd |
| screens/android-fotos-auf-usb-stick-sichern-320.png | 888636 | 309b27e82a35c108406c223b3ca86415711f7b3e24e212bd457505d74d1a87e2 |
| screens/android-fotos-auf-usb-stick-sichern-390.png | 912444 | a4c827bd1206c23d775af2974ec60900b2a09657eef5d705d12e9ec47885b5a4 |
| screens/android-fotos-auf-usb-stick-sichern-681.png | 1037712 | 09cf47614509216b13549b76bb2e9ba21531390c61431b07410ce1d9fa0f4069 |
| screens/en-1280.png | 1060984 | 1bc03a35f347fc36a3cb2792a8a4af7af31626f69399ac81341b2770eba4283a |
| screens/en-1440.png | 1102572 | 47cd4b4a802ca56c47caf6a9da283dae9d7e351943e7d1b233aa8d526270e692 |
| screens/en-320.png | 576683 | 2f14dc27609c57233c56291dcb731f290760de56b1255b252b181d039631d709 |
| screens/en-390.png | 608256 | 50c36fa091f20064b47303e52c6a4074ece045474581fc5b9ba501bdcaf0f954 |
| screens/en-681.png | 762502 | 72b7817d7bc363dac002b61858c6ee51cc5fd9bf02443c675abbd616c3b846ef |
| screens/en__404-1280.png | 243240 | 4feed314e99cef9df170fe834e818e5e70e8c0c32805133536bda5cd9b244859 |
| screens/en__404-320.png | 102727 | 361f2dc056cefc87b36f6a31efdad7f653eeca26f541b7628d67ff1a09f3d387 |
| screens/en__404-390.png | 115529 | a82e709b540ffaad786ced21a67a76fbc94bb164a43a5395f27589d1681a55c0 |
| screens/en__guides__android-photo-backup-strategy-1280.png | 514487 | 3bd04405f7bceddfcaecd30475d1f6059b3970fae71e7a7a57fdd91c3ce5bac9 |
| screens/en__guides__android-photo-backup-strategy-320.png | 315429 | 60eda91f0c62c143d3580d5c199657c8fb40e6463d4a91eb16a42d9ffd09e03f |
| screens/en__guides__android-photo-backup-strategy-390.png | 325945 | 7bec437fbe778e822a8e32f7bdf181df33f0733ad19f25a884b79b8de97cda95 |
| screens/en__guides__back-up-android-photos-to-usb-1280.png | 995282 | 77fefc47b7ad1c3c5451e4fd7349d0983effac0241ef0f0bebd0b5191ba7b3e3 |
| screens/en__guides__back-up-android-photos-to-usb-320.png | 454990 | 5f984d00840e6beeeec28dcb50f243d2111bc63783ed09b01d85ec3b8324893a |
| screens/en__guides__back-up-android-photos-to-usb-390.png | 492325 | 75f9b5e30e34381d3f8d7597dd736035e5585d12263c97358cc48b84fb50389c |
| screens/en__guides__choose-usb-drive-for-android-1280.png | 492247 | 27c67ba34f4c13f001f63e3321b910ea8b9331f3e066b18e088a6ba3a532741f |
| screens/en__guides__choose-usb-drive-for-android-320.png | 313501 | 6794746cd8101a398a51d411903bed67b7a4b1ea0d18305e537ec1a54bf43ea9 |
| screens/en__guides__choose-usb-drive-for-android-390.png | 325201 | 726b44e263920cb231499a35a47d5292a9238dcf8ff072db4e6dd2470dce71eb |
| screens/en__help-1280.png | 350981 | 6ac4ae7ca51e005dccb5fa467964843a13ea55869955f2468531fe7afd5fe01a |
| screens/en__help-1440.png | 368815 | 287d5a529f1064c5c7407023b270b44650f21946ab436f13a22d5739170c7b90 |
| screens/en__help-320.png | 208804 | 98078633e06e2699e0b7211312bb2b8cd36d89e67649d8c4f6a3b088745d5678 |
| screens/en__help-390.png | 218072 | 61be40d52b696d1d30a0de199febd209096c0ae75332fe919da58776de3a93d1 |
| screens/en__help-681.png | 276791 | 26b7136559e4d73ff65174659de2eefb310186b4d1892821b9e25234dc2bac88 |
| screens/en__imprint-1280.png | 223977 | c11e40a14e2c31041c39a1b3a4a7ab176f8d68428f9ee1e29b3bf4ef8a302857 |
| screens/en__imprint-320.png | 118136 | f300a964922e63c19e414bb8aa92b7591c3f9373a7e5ca9d3d604f9c6f8b6fe6 |
| screens/en__imprint-390.png | 130350 | 7a80226c414b7e5699112268fd853f82204a05486e7edcd49279776f24582c3f |
| screens/en__privacy-1280.png | 501785 | 6d00aa8a92ac7fa4318b861e189f9e2406e5e4c440c15ec88cc074ea2923d5d1 |
| screens/en__privacy-320.png | 294410 | 05b890d25af568ba753a8e1b113482911c1293de64ee2eaa091f3ae1b2b62c18 |
| screens/en__privacy-390.png | 302592 | e73785b2f85fb254296bf77495f661ec0a170d195966c666bb09517815f5cf27 |
| screens/en__support-1280.png | 267717 | 5215fc0fe5e3bfb07cec6bcdd1a316960da32dc70493b38aaa748dc033013197 |
| screens/en__support-320.png | 148944 | 73f50d23ebac347f656f6213ba9c57b6748a65e31107cd096ae01be0ccee7aa4 |
| screens/en__support-390.png | 159235 | 6df79c62b8dd930b94e1a1abced8c098e1f5574cd7993f51e5f1594ac0508275 |
| screens/focus-home.png | 332219 | 43f270b0dc6db5445bdb18076aa470f621e6a4917201c8feb51db3bbe474e6f9 |
| screens/foto-backup-strategie-android-1280.png | 576815 | 6721202ef5cc97411818cd4d24de417e44a820ff7d6574d0b47a4620b1513c0e |
| screens/foto-backup-strategie-android-320.png | 364997 | 26dfd4833d880e97c1cb17c4d2707a6260633c21907a662353dbe92f6f7e6669 |
| screens/foto-backup-strategie-android-390.png | 375481 | d2520f8359c46a1506dde70be29ea1a7b2bc8867d310a2ba2f8c0154d77be13b |
| screens/hilfe-1280.png | 394694 | 156d1acac451d172f92bab6ea828477005dc8b7bc96b21554122a9c41906d481 |
| screens/hilfe-1440.png | 414121 | c9974f4337f32ced1c8cedc7d9fd907283300c3abe8d19bbbbad6eda8924a292 |
| screens/hilfe-320.png | 232804 | 876c3575aa6730bd623544540235d450d7133b00160f0c3ada36ea1360389840 |
| screens/hilfe-390.png | 248426 | 4c0a341e2125586e09cc2c4795214f9ace46a357a59c79b53639bce8388cdb45 |
| screens/hilfe-681.png | 298216 | 2245a12b85edfcfad52fb3e6c560262c5fa21f24035864f44b68900523e4579b |
| screens/home-1280.png | 1168407 | eca3fdc991188754bb4e75d7629200fa5a095e57bb68a24219c68bdb751d742a |
| screens/home-1440.png | 1205634 | 15ad709b874fe9f3ec9bc1e2d6e28034d4758e83a091388af695978273243ecf |
| screens/home-320.png | 648207 | 3cf2235a45ca5e743f8c1ae08a05045a1603e50d89ada07380916351a8142b84 |
| screens/home-390.png | 677991 | fef8f16476a33899fd69878fdf192ed62e1f53d0152b853d27d60eee357a7b08 |
| screens/home-681.png | 851653 | 394e6e87c5d22592b77823e6f98906bff90a615b1aefb46a042ef7200e463e02 |
| screens/home-901-fresh.png | 222358 | dfc8cda2ef58b0ed47c1809b679c9f3fd74f1b89467bb348be7690af7f59d03c |
| screens/impressum-1280.png | 258414 | 4a90d78c57f43ed985df1b8af9bca859675cf692e337c256ec2e1339b08634e6 |
| screens/impressum-320.png | 132742 | 6f0ad37c35adb4cf99a7e983bcf7643b4a6a072a45c4600d83ad338e9596ba6c |
| screens/impressum-390.png | 143952 | fa53ed0b4ad4dbd1dbb7f79255bfa71b471e6de9e2ce2762c182d61ace664522 |
| screens/privacy-1280.png | 574799 | 73d7fbdb0a5836f5e373a04324cb28b26bfe4d1d381232e2bfbaa5e7e2e37cdc |
| screens/privacy-320.png | 357056 | f9d16c64cfdf817a9fb217b23a4eaf0449c2a35e9e4ecb11e6e5fbf559cff7f4 |
| screens/privacy-390.png | 369171 | 7ff466068f5cba4499165b326376a470fba39e9b604f800b8c939fadcaa2b372 |
| screens/privacy-css-zoom.png | 253551 | f89b2f3021b0cb8c196048f4e05b8e7d0c0fed2a450d3a63646bbfdca43bc6e6 |
| screens/support-1280.png | 323505 | 3258940b397718a0566c5a0b88327162918786b2a9974f7f7cc8928775338631 |
| screens/support-320.png | 172922 | 6d39d399de04cef92083884647608c3740943106c51a051f0bbb317f4c2496a5 |
| screens/support-390.png | 182561 | 9c86b12da502c84e8231626559c764949d6c89da4defef9663e333d6a9704cee |
| screens/usb-stick-fuer-android-auswaehlen-1280.png | 618047 | 3a11e9de61384739f69b5f52c99a7921ae1972eab439dfd9ca1303a8e68a5549 |
| screens/usb-stick-fuer-android-auswaehlen-320.png | 390237 | 4668474db525533460e3b1a442ada0d64ef43c524c4990250d9fd8816cc29fae |
| screens/usb-stick-fuer-android-auswaehlen-390.png | 416985 | 33c5060c3a88db84a5970ccc4f6ff2d3483da8b7aaa19d8c98b98c9e3fcad0de |
| visual/assets-1.jpg | 323589 | 5738f84b59c17157e8ce75affaf906c2eeedb7ab6a65b0be9bf39925acb06528 |
| visual/assets-2.jpg | 278800 | a819eaa86fe5de8bd93bb0c780832a02b7514af835b021cca38733cc3143c343 |
| visual/assets-3.jpg | 343808 | a3427048c413bb5a83a526188dfda5457e80abe06bf67ca5390e8e768defa7c1 |
| visual/en-1280-top.png | 219854 | 2c0b099bffec5b514b239c1dbd2510634ddf080bf7a14f7741956148b626b31d |
| visual/en-390-top.png | 109760 | 143682ee452bff3f385e17870703dcc821e967feba39a7441494db4f85a46ba0 |
| visual/home-1280-top.png | 249988 | 27f95863c81cbceb14d0b9ddcd7df6e4da06f0ea1e1ac44353e5078907cf3d59 |
| visual/home-390-top.png | 114685 | 51011a39d9a434f0fb9412dcfb68afcfa7a3c3bbc90567556b4a2e5114e628c5 |
| visual/routes-1.jpg | 154740 | 2d579d5dd22ffe40a3a2d3d63c34cf415a6871b6cbd387333db64e4cd97857dd |
| visual/routes-2.jpg | 269257 | 5884ec4ceb156256153e45e7c07e4a8ede76012b2acce5624740c34b0fa56be3 |
| visual/routes-3.jpg | 217654 | 317ab3bf175ebc52b48ae4a7ec9bc9922cb6d3702ff4a20d6e704322590aff4f |
| visual/routes-4.jpg | 262782 | 042a7f5b3cec30250c6b7e8d70a48338c313adce20b54c4050077b92a0e13460 |
| visual/routes-5.jpg | 227934 | a60acb2dbb2b13d7de5abfd6a6cd7a0822cdabac21619b5214cbae705a489221 |
| visual/routes-6.jpg | 280301 | 7655a2e2efb3adfa66444cf48104b1c14093fef3d299f2bf72651e5cef7d09ee |
| visual/usb-stick-fuer-android-auswaehlen-320-top.png | 136223 | 28903f38d7a459f1ca9aba7047a7a5796b5f8fcf77717a55451ec24d1ca267ff |
| visual/usb-stick-fuer-android-auswaehlen-390-top.png | 154189 | 11482d13baa7dac7c80c830ae2be5090dd164c15b8831e2d751bf8af7200ce1f |
| assets.json | 13690 | 8c2e973b0beb1e26ea1dab30e9a44fe74902fd38e15bef481f31cb0aa1a709c9 |
| axe.json | 9541 | 126d9d3fb37439da261ae46fe392c3debeabd56c7b40e517823ee8a72f1c3125 |
| baseline.json | 59266 | a8aca005dcee0bb43f63b037077d4f4c787e9c7ee59eed6a80dbb1d8dd3d7c1d |
| browser-matrix.json | 241157 | e89f9d7d52b71ab27888ab3e5ef6ae509f43ace5d797c3ca933304db84718d21 |
| browser-provenance.json | 219 | ec85b78bea1c478bde096ff5685bbc5e4b91780c3ff4e604cccadca0e0216444 |
| cache-revalidation.json | 18 | a9c913eba2a8914fcff21f4a51d8319406ca323a16a9df771dae1bc5ec751c68 |
| commands.json | 8829 | 990bddab0c7443bc6bdf66b8be633806e17e86da1fd8c0610bc995f565dc456c |
| external.json | 2544 | bf284066acf2e6a1f3838b965ec699c5091154e527ef6964b16df984da2e6bb9 |
| final-checks.json | 3478 | 2e1d4d872e21079f18d1594d529d4fc24ab21849fa60e2b3333b89ae38252dc4 |
| hosts.json | 1204 | 48b3e3b18332986c1b16eda85158d6425022ab7a4724f675f5ccaffbb8da7612 |
| interactions.json | 84560 | fdf3db771bc6fc00268398a5902a342d7a7c915d7a1123e5a8293d07c55d8a5b |
| legacy-baseline-verification.json | 55 | 03b71caf4901216f33021f9bf41fb2fe989002ea4def03345d0f5bcd18309f1f |
| legacy-fragment-links.json | 2666 | 17c2a91654155c16b8d28e9902ab7feade48d5e97b83c727532e2cc3f2c1b6cf |
| legacy-metrics.json | 26611 | df1fbf2ac6601184c1ac5b0c4f652a1099ba824196e06cc25b70648f9f854565 |
| lighthouse-summary.json | 58920 | 35166ee7588247b37bd084b566f8929020bd034218c0535b1295a32ccd38a9fe |
| live-files.json | 58767 | 42a723e53e0f9719526eec3773bdef96287cfbcdd778965584641553d42223fc |
| live-routing.json | 12756 | b97857ff8d08114b69fb5fa14da0620ef08183abbc0dbbad788773def7d6af06 |
| metadata.json | 89396 | 6f6803668f1e6bf3488c72e0249fa7cae147bc380907d40ba063903487c8ee11 |
| nojs.json | 42035 | dee34aa891187a076ff61f97bd42f82a9fb0456c4d9a8f91f7ba99847d1de3bb |
| old-live.json | 16084 | 6cb02563cdc6d6a8866b9f4a841a625bfcda4ad8aeca54545e5e58dfe7d7195b |
| production-command.json | 208 | 2e6f30cdb9b71567c2ece05938a3b194d02b58afc0fb780811678cddac90ff3c |
| production.json | 4647 | 312277194d91b03524076f307c96565e100e36eebdcc234e11ca23c3279450f8 |
| rebuild.json | 7702 | d53e13ed30fd7cd74da050194d8149cd53a3812889c6ee1ef6124d26563e7532 |
| references.json | 108290 | 54ff720eb3ea4e764b23eca1bfd7fae7a04f7ba0a9eac8857233e392eb34293b |
| routes.json | 434 | 5d0b9da03dd09dcb02727d959e5f32987a1e47799c6c614f72665ffd9d27fcfa |
| seo-extra.json | 11734 | a0e77322ec8824a1e7a518719530a83e2589213d0779975368fe1b97765f54c3 |
| structural-errors.json | 2 | 4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945 |
| supplement.json | 99297 | b29b1201dbac6801631f6a93f39a8b95321f9a560c4bd3e7237237e05c2da13c |

## 9. Endintegrität und Cleanup

**Endprüfung tatsächlich ausgeführt: 2026-09-13T10:00:58.275229+00:00.**

- Prüfworktree: 216 Dateien, exakt identisches Pfadset zur Baseline; **einzige Byteänderung `QA-REPORT.md`**, alle 215 anderen Dateien unverändert. Bestehendes `dist`, Quellen, Tests, Konfiguration, Lockfiles, übrige Berichte und untracked Assets unverändert.
- Geschützte Hauptkopie: **80/80 Dateien unverändert**, keine zusätzlichen oder fehlenden Dateien.
- Vollständiger Gitstatus beider Worktrees identisch zum unter Abschnitt 2 dokumentierten Anfangsstatus; Branch, HEAD, Remotes, letzter Commit und `git diff --check` ebenfalls identisch. Weil `QA-REPORT.md` bereits vorher untracked war, ändert sich seine `??`-Statuszeile beim Ersetzen nicht; die erlaubte Inhaltsänderung wurde deshalb zusätzlich per SHA-256 festgestellt.
- Bericht direkt nach Schreiben bytegleich zum konsolidierten unabhängigen Ergebnis. Diese abschließende Attestation ergänzt ausschließlich denselben Bericht und ist nicht Teil des ursprünglich geprüften Reviewsubjects.
- Beide eigenen temporären HTTP-Server beendet; Ports **43171/43172 nicht mehr erreichbar**. Keine anderen Prozesse beendet.
- **Cleanup bestätigt: 2026-09-13T10:00:58.321590+00:00.** `/tmp/fotosafe-independent-audit-fs1vi_cg` einschließlich Wegwerfquellen, Builds, Caches, Rohreports und Screenshots entfernt. Eigene Bootstrapdatei `/tmp/fotosafe-audit-bootstrap.py` und Pfadzeiger `/tmp/fotosafe-audit-path.txt` ebenfalls entfernt. Die Evidenztabellen dieses Berichts bleiben erhalten; dort genannte temporäre Beweisdateien sind keine verbleibenden Downloadlinks.
- Keine Produktkorrektur, kein Deployment, kein Commit/Stage/Stash/Reset/Push; keine Domain-, DNS-, Cloudflare-, GitHub-Pages-, Search-Console-, Play-Console- oder Produktionsänderung. **Audit abgeschlossen; alle 19 Befunde bleiben OPEN.**

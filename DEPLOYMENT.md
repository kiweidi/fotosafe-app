# FotoSafe Deployment

## Aktueller Zustand

- Projektpfad: `/home/hermes/projects/fotosafe-cloudflare-preview`
- Git-Branch: `feat/cloudflare-premium-site`
- Cloudflare-Pages-Projekt: `fotosafe-app`
- unveränderliche geprüfte Preview: `https://83ad5ea9.fotosafe-app.pages.dev`
- Branch-Alias: `https://feat-cloudflare-premium-site.fotosafe-app.pages.dev`
- Deployment-Branch: `feat/cloudflare-premium-site`
- Zielhost nach separater Freigabe: `https://fotosafe.weidisoft.net/`

Die neue Site ist auf dem Kandidatenbranch versioniert, aber nicht gepusht. Die jeweilige Übergabe muss den exakten Commit und das zugehörige Hashmanifest aus dem externen Evidenzpaket nennen; diese Datei enthält absichtlich keine selbstreferenzielle Commit-SHA. Das frühere Deployment erfolgte manuell aus dem lokalen `dist`-Verzeichnis. Die URL-Komponente `83ad5ea9` ist dessen verfügbare unveränderliche Deployment-Kennung und kein Nachweis für einen später neu gebauten Kandidaten.

## Reproduzierbarer Build und lokale Prüfung

Voraussetzung: Node.js 22 und installierte npm-Abhängigkeiten.

```bash
npm ci
# Neue Cloudflare-Kandidaten: Build, Modustests und Validator gegen denselben Baum
npm run check:preview
npm run check:production
```

`npm run check` bleibt absichtlich der geschützten GitHub-Pages-Legacy-Pipeline vorbehalten: Es prüft die Root-Site, die `.github/workflows/pages.yml` unverändert mit `path: .` hochladen würde. `npm run test` führt Legacy- und Preview-Tests gemeinsam aus, setzt aber einen bereits frisch erzeugten Preview-Baum voraus. Die eindeutigen Kandidaten-Gates sind deshalb `check:preview` und `check:production`.

Lokale Vorschau:

```bash
npm run serve
```

Der Server bindet ausschließlich an `http://127.0.0.1:4173` und liefert `dist/preview`. Er läuft im Vordergrund; mit `Ctrl+C` beenden. In einem zweiten Terminal kann die genaue Kandidatenidentität geprüft werden:

```bash
curl --fail http://127.0.0.1:4173/ | grep '<title>'
sha256sum dist/preview/index.html
```

Browser-QA setzt einen Chromium-CDP-Endpunkt auf `http://127.0.0.1:9222` und das Python-Modul `websocket-client` voraus:

```bash
QA_BASE_URL=http://127.0.0.1:4173 \
QA_REPORT=reports/candidate-browser-qa.json \
QA_RUN_LABEL=local-preview-candidate \
npm run test:browser
```

Der JSON-Bericht wird unter `reports/candidate-browser-qa.json`, Screenshots werden unter `reports/screenshots/local-preview-candidate/` abgelegt. Diese Pfade vor einem neuen Lauf bewusst neu benennen oder leeren; keinen alten Bericht als Beleg für einen neu gebauten Kandidaten verwenden.

## Preview gegenüber Production

- Standardbuild ohne `DEPLOY_ENV=production`: alle HTML-Seiten `noindex,nofollow`; `robots.txt` sperrt `/`; `_headers` setzt global `X-Robots-Tag: noindex, nofollow`.
- Production-Build: `npm run build:production`; Inhaltsseiten `index,follow`; 404 bleibt `noindex`; `robots.txt` erlaubt Crawling und nennt die Sitemap.
- Canonicals zeigen in beiden Modi auf `https://fotosafe.weidisoft.net`, nicht auf `.pages.dev`.

Preview und Production werden getrennt nach `dist/preview` beziehungsweise `dist/production` gebaut; keiner der beiden Befehle überschreibt den anderen Ausgabebaum.

Vor jeder externen Übergabe muss der exakte Commit zusammen mit einem vollständigen **Quellmanifest / source manifest** mit SHA-256 erfasst werden; zusätzlich ist für den exakten Ausgabebaum ein sortiertes Dateihashmanifest zu erzeugen. Ältere Baseline- oder Zwischen-Commits reproduzieren den Kandidaten nicht. Hashinventare werden erst nach der letzten Quelländerung erstellt und gemeinsam mit Test-, Browser- und Axe-Berichten benannt.

## Manuelles Cloudflare-Preview-Deployment

Nur nach erneuter Prüfung von Account und Projekt; keine Secrets dokumentieren:

```bash
npx wrangler pages deploy dist/preview --project-name fotosafe-app --branch feat/cloudflare-premium-site
```

Danach müssen eindeutige Deployment-URL, Response-Header, 404, Browsermatrix und Dateihashes erneut geprüft werden. Ein neues Deployment erzeugt eine neue unveränderliche URL; alte QA-Berichte gelten nicht automatisch dafür.

## Rollback

Da nur eine Branch-Preview bekannt ist, wäre ein Rückfall erst nach erneuter Erfassung einer vollständigen vorherigen Deployment-ID und Cloudflare-Domainzuordnung planbar. Das konkrete Rollbackziel ist derzeit **nicht authentifiziert verifiziert**. Jede Rollback-Aktivierung benötigt eine separate Ownerfreigabe; keinen Rollback durch ein Testdeployment simulieren.

## Launch-Checkliste – nur nach ausdrücklicher Freigabe

1. Unabhängiges Audit abschließen und P0/P1/P2-Befunde beheben bzw. ausdrücklich akzeptieren.
2. Alle Änderungen reviewen, gezielt committen und sichere Quell-/Deploymentstrategie festlegen.
3. Rechts-/Kontaktangaben und Assetrechte freigeben.
4. Produktionsbuild frisch erzeugen; alle Tests, vollständige Linkprüfung, A11y/Responsive, Lighthouse und Hashinventar wiederholen.
5. Im Cloudflare-Account prüfen, dass ausschließlich `fotosafe.weidisoft.net` angebunden wird; Rootdomain, E-Mail-DNS und andere Produkte unberührt lassen.
6. HTTPS, Zertifikat, 404, Header, Canonicals, hreflang, Sitemap, robots und Assets am finalen Host prüfen.
7. `noindex` nur am finalen Produktionshost entfernen; `.pages.dev`-Duplikate nach geprüftem Hostkonzept ausgeschlossen lassen.
8. Bestehende Search-Console-Properties prüfen; nur mit Google-Zugriff/Einwilligung Sitemap einreichen und wichtige URLs inspizieren.
9. Status korrekt als vorbereitet/eingereicht/abrufbar/indexiert unterscheiden.
10. App-, Play-Store- und alte GitHub-Links erst in einem separaten freigegebenen Schritt umstellen; URL-zu-URL-Migrationsplan erstellen.

## Unveränderte Systeme

- GitHub-Pages-Produktion: `https://kiweidi.github.io/fotosafe-app/`
- Hauptworktree: `/home/hermes/projects/fotosafe-app-site`, Branch `main`, Commit `5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79`, sauber gegenüber `origin/main` bei der letzten Prüfung.
- Keine Änderungen an DNS, Custom Domain, Search Console, Play Console, App-Code oder Produktionsworkflow.

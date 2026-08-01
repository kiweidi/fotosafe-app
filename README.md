# FotoSafe App Site

Öffentliche Support-, Hilfe- und Datenschutzseiten für FotoSafe.

- Website: https://kiweidi.github.io/fotosafe-app/
- Hilfe: https://kiweidi.github.io/fotosafe-app/hilfe.html
- Support: https://kiweidi.github.io/fotosafe-app/support.html
- Datenschutz: https://kiweidi.github.io/fotosafe-app/privacy.html

## Datenschutzfreundliche Website-Statistik

Die Android-App bleibt vollständig trackingfrei. Die öffentliche Website lädt Umami erst nach einer freiwilligen Statistik-Zustimmung. Ablehnung, Widerruf sowie GPC/DNT blockieren den Anbieter. Eventnamen und Eventwerte sind in `assets/analytics-config.js` zentral erlaubt; freie Texte, vollständige Ziel-URLs und unbekannte Kampagnenwerte werden verworfen.

Die Umami-Website-ID ist öffentlich und kein Zugangsschlüssel. Passwörter und API-Tokens gehören niemals in dieses Repository.

## Lokale Prüfung

Voraussetzung: Node.js 22.

```bash
npm run check
```

Vor einem Deployment verlangt der GitHub-Pages-Workflow zusätzlich eine vollständig konfigurierte Umami-Website-ID (`REQUIRE_ANALYTICS_ID=1`).

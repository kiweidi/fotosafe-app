# FotoSafe Asset Sources

Stand: 2026-09-12. Diese Datei dokumentiert Herkunft und Evidenzgrenzen; sie ist keine Rechtsberatung.

## Explizite Publish-Allowlist und Freigabestatus

| Asset | Herkunft | Verwendung / Grundlage | Verifiziert |
|---|---|---|---|
| `assets/fotosafe-app-icon.png` | FotoSafe-Projektmaterial / Anbieter | Header, Footer, Favicon | Technisch geprüft; **Owner-/Rechtsfreigabe offen** |
| `assets/fotosafe-app-icon-40.png`, `assets/fotosafe-app-icon-44.png`, `assets/fotosafe-app-icon-72.png`, `assets/fotosafe-app-icon-80.png`, `assets/fotosafe-app-icon-88.png`, `assets/fotosafe-app-icon-144.png` | deterministische Größenableitungen von `fotosafe-app-icon.png` | Header, Footer und Artikel-CTA in 1×/2× | Herkunft/Freigabe folgt dem unveränderten Master; **Owner-/Rechtsfreigabe offen** |
| `assets/fotosafe-share.png` | lokal aus FotoSafe-Markenmaterial erstellt | Open Graph | Technisch geprüft; Freigabe folgt App-Icon; **Owner-/Rechtsfreigabe offen** |
| `assets/01-in-drei-schritten-auf-usb-de.webp` | WebP-Derivat eines vorhandenen DE-App-Screenshots | DE Hero/Galerie/Anleitung | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/02-backup-vorher-pruefen-de.webp` | WebP-Derivat eines vorhandenen DE-App-Screenshots | DE Galerie/Anleitung | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/03-expertenmodus-quellen-de.webp` | WebP-Derivat eines vorhandenen DE-App-Screenshots | DE Galerie | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/01-three-guided-steps-to-usb-en.webp` | WebP-Derivat eines vorhandenen EN-App-Screenshots | EN Hero/Galerie/Anleitung | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/02-review-before-backup-en.webp` | WebP-Derivat eines vorhandenen EN-App-Screenshots | EN Galerie/Anleitung | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/03-expert-mode-sources-en.webp` | WebP-Derivat eines vorhandenen EN-App-Screenshots | EN Galerie | Privatinhaltsprüfung erforderlich; **Owner-/Rechtsfreigabe offen** |
| `assets/01-in-drei-schritten-auf-usb-de-360.webp`, `assets/01-in-drei-schritten-auf-usb-de-540.webp`, `assets/02-backup-vorher-pruefen-de-360.webp`, `assets/02-backup-vorher-pruefen-de-540.webp`, `assets/03-expertenmodus-quellen-de-360.webp`, `assets/03-expertenmodus-quellen-de-540.webp` | deterministische 360-/540-px-Ableitungen der gleichnamigen DE-WebP-Master | responsive DE-Vorschauen; 1080-px-Master bleibt Lightboxziel | Herkunft/Privatinhaltsfreigabe folgt den unveränderten Mastern; **Owner-/Rechtsfreigabe offen** |
| `assets/01-three-guided-steps-to-usb-en-360.webp`, `assets/01-three-guided-steps-to-usb-en-540.webp`, `assets/02-review-before-backup-en-360.webp`, `assets/02-review-before-backup-en-540.webp`, `assets/03-expert-mode-sources-en-360.webp`, `assets/03-expert-mode-sources-en-540.webp` | deterministische 360-/540-px-Ableitungen der gleichnamigen EN-WebP-Master | responsive EN-Vorschauen; 1080-px-Master bleibt Lightboxziel | Herkunft/Privatinhaltsfreigabe folgt den unveränderten Mastern; **Owner-/Rechtsfreigabe offen** |
| `assets/google-play/get-it-on-google-play-de.png` | offizielles Google-Play-Markenasset | DE Listinglink | Herkunft und lokale Datei geprüft; Nutzung bleibt an aktuelle Google-Richtlinien gebunden |
| `assets/google-play/get-it-on-google-play-en.png` | offizielles Google-Play-Markenasset | EN Listinglink | Herkunft und lokale Datei geprüft; Nutzung bleibt an aktuelle Google-Richtlinien gebunden |
| `assets/icons.svg` | projektspezifisches lokales Symbolblatt | dekorative UI-Symbole | Technisch geprüft; **Owner-/Rechtsfreigabe offen** |
| `src/site.css`, Systemschriften | neu erstelltes lokales Designsystem; keine Remote-Fonts | Layout und Typografie | Quellcode vorhanden; keine externen Fontlizenzen nötig |

Offizielle Referenzen:

- Google Marketing Resources: https://developer.android.com/distribute/marketing-tools/
- Google Play Badges: https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/
- Google Play Linking: https://developer.android.com/distribute/marketing-tools/linking-to-google-play
- FotoSafe Listing: https://play.google.com/store/apps/details?id=at.weidi.fotobackup

## Quellen/Master bleiben erhalten, werden aber nicht veröffentlicht

Die Buildlogik kopiert ausschließlich die oben einzeln benannten Allowlist-Dateien. Alte Produktbilder, USB-Hilfe-JPGs/SVGs/MP4, PNG-Master und frühere Scripts bleiben als Quellen im Repository erhalten, werden aber nicht in neue Preview- oder Production-Artefakte kopiert.

Betroffene Gruppen:

- `assets/products/*`
- `assets/usb-hilfe/*`
- ältere `assets/screenshot-*.jpg`
- PNG-Master der sechs neuen WebP-Screenshots
- alte `analytics-config.js`, `privacy-analytics*.js`, `language*.js`, `navigation.*`

Für diese ausgeschlossenen Altassets ist die vollständige Rechte-/Lizenzprovenienz in diesem Branch nicht dokumentiert. Sie dürfen nicht als freigegeben oder veröffentlicht betrachtet werden. Eine spätere Wiederaufnahme benötigt eine bewusste Allowlist-Änderung und eine neue Rechte-/Privatinhaltsprüfung.

## Klare Grenzen

- Keine Stockfotos und keine Remote-Fonts werden von den neuen Seiten geladen.
- Keine Lizenzprüfung beweist hier Eigentum an FotoSafe-App, Screenshots oder Marke; sie dokumentiert nur die bekannte Projektquelle.
- Google-Badges dürfen nur gemäß den jeweils aktuellen Google-Richtlinien eingesetzt werden; Abstände, Mindestgröße und Verlinkung sind unabhängig zu prüfen.

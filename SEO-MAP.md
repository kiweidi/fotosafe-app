# FotoSafe SEO Map

Zielhost aller Canonicals: `https://fotosafe.weidisoft.net`. Die Cloudflare-Vorschau bleibt global `noindex, nofollow`.

## Angeforderte Suchintentionen / Requested search intentions

| Intention | Derzeitige Abdeckung | Status |
|---|---|---|
| Android-Fotos auf USB sichern | eigener DE/EN-Ratgeber | umgesetzt |
| Android-Fotos ohne Cloud sichern | Produktseite plus DE/EN-Methodenvergleich im Strategie-Ratgeber | zusammengeführt; kein eigener Pfad |
| Samsung/Galaxy USB-Backup | begrenztes Samsung/One-UI-Beispiel in der Zielordnerhilfe | teilweise; keine eigenständige Geräte-/Quellenbasis |
| USB-Stick/OTG für Android auswählen | eigener DE/EN-Hardware-Ratgeber | umgesetzt |

Deutsch ist `x-default`, weil die kanonische Root-Informationsarchitektur deutsch ist und keine automatische Standort-/IP-Auswahl erfolgt. Das ist eine dokumentierte Projektentscheidung, keine Behauptung über die Sprache einzelner Besucher.

| URL | Lang | Suchabsicht | Title | Description (gekürzt) | Gegenstück |
|---|---|---|---|---|---|
| `/` | de | Produkt / Android auf USB | FotoSafe – Android-Fotos auf USB sichern, ohne Cloud | Fotos und Videos direkt vom Android-Handy auf USB sichern … | `/en/` |
| `/en/` | en | Product / Android to USB | FotoSafe — back up Android photos to USB | Copy photos and videos straight from Android to USB … | `/` |
| `/hilfe/` | de | Hilfe auswählen | FotoSafe Hilfe & Ratgeber | Anleitungen für FotoSafe, Android-USB-Backups … | `/en/help/` |
| `/en/help/` | en | Choose help | FotoSafe help and guides | Guides for FotoSafe, Android USB backups … | `/hilfe/` |
| `/android-fotos-auf-usb-stick-sichern/` | de | Konkreter Sicherungsablauf | Android-Fotos auf USB-Stick sichern – ohne PC \| FotoSafe | Voraussetzungen, Ablauf, Zielauswahl und Kontrolle … | `/en/guides/back-up-android-photos-to-usb/` |
| `/en/guides/back-up-android-photos-to-usb/` | en | Concrete backup workflow | Back up Android photos to USB \| FotoSafe | Requirements, destination, verification and troubleshooting … | DE USB-Anleitung |
| `/usb-stick-fuer-android-auswaehlen/` | de | Hardware-/OTG-Auswahl | USB-Stick für Android auswählen \| FotoSafe | USB-C, OTG, Kapazität und Dateisystem … | `/en/guides/choose-usb-drive-for-android/` |
| `/en/guides/choose-usb-drive-for-android/` | en | Hardware/OTG selection | Choose a USB drive for Android \| FotoSafe | USB-C, OTG, data support, capacity and file system … | DE Hardware-Ratgeber |
| `/foto-backup-strategie-android/` | de | Backup-Methode und Routine | Foto-Backup-Strategie für Android \| FotoSafe | USB-Kopie, Kontrolle, Rhythmus und 3-2-1-Prinzip … | `/en/guides/android-photo-backup-strategy/` |
| `/en/guides/android-photo-backup-strategy/` | en | Backup method and routine | Android photo backup strategy \| FotoSafe | USB copy, verification and 3-2-1 principle … | DE Strategie |
| `/support/` | de | Supportkontakt | FotoSafe Support | Fehlerhilfe und direkter E-Mail-Kontakt … | `/en/support/` |
| `/en/support/` | en | Support contact | FotoSafe support | Troubleshooting and direct email support … | `/support/` |
| `/impressum/` | de | Anbieterinformation | Impressum \| FotoSafe | Anbieterinformationen und Kontakt … | `/en/imprint/` |
| `/en/imprint/` | en | Provider information | Imprint \| FotoSafe | Provider information and contact details … | `/impressum/` |
| `/privacy/` | de | Datenschutz | Datenschutzerklärung \| FotoSafe | App- und Website-Datenschutz … | `/en/privacy/` |
| `/en/privacy/` | en | Privacy | Privacy Policy \| FotoSafe | Privacy for app and static website … | `/privacy/` |

`/404/`, `/en/404/` und `404.html` sind `noindex` und nicht in der Sitemap.

## Technische Regeln

- Eine kanonische, abschließende Slash-Konvention für öffentliche Inhaltsseiten.
- Reziproke `de`/`en`-Alternates plus `x-default` werden vom Generator erzeugt.
- `sitemap.xml` enthält 16 Inhaltsseiten, keine 404 und keine Redirect-Quellen.
- JSON-LD: Mobile/SoftwareApplication auf den Startseiten, HowTo auf den USB-Anleitungen, Article auf weiteren Ratgebern, CollectionPage auf Hilfe-Hubs.
- Hauptverlinkung: Header → Start/Hilfe/Support/Play; Footer → Hilfe/Support/Datenschutz/Impressum; Hilfe-Hub → drei Ratgeber; Ratgeber → Start/Hilfe und kontextuelle Ziele.
- Preview: Meta-Robots und `X-Robots-Tag` = `noindex, nofollow`, `robots.txt` = `Disallow: /`.
- Produktionsbuild: Inhaltsseiten `index,follow`, `robots.txt` erlaubt Crawling und nennt die Sitemap; 404 bleibt `noindex`.

## Nicht umgesetzt / unabhängig zu prüfen

- Keine eigene Route für „Android-Fotos ohne Cloud sichern“ und keine Samsung-/Galaxy-Seite; die zusammengeführte/teilweise Abdeckung bleibt oben sichtbar.
- Der neutrale Google-Play-Bewertungslink ist umgesetzt, aber Click-through/Store-Verhalten ist noch nicht unabhängig geprüft.
- `x-default`-Entscheidung, strukturierte Daten und tatsächliche Produktions-SEO-Tauglichkeit müssen unabhängig fachlich geprüft werden.
- Lighthouse SEO liegt in der Preview wegen `noindex` bei 69; ein früher separater Produktionsbuild wurde geprüft, aber nicht deployt.

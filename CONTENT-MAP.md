# FotoSafe Content Map

Stand: 2026-09-12. Diese Zuordnung beschreibt die neue Cloudflare-Vorschau; die bestehende GitHub-Pages-Site bleibt unverändert.

## DE/EN-Seitenpaare

| Zweck | Deutsch | Englisch |
|---|---|---|
| Produktseite | `/` | `/en/` |
| Hilfe-Hub | `/hilfe/` | `/en/help/` |
| Vollständige USB-Anleitung | `/android-fotos-auf-usb-stick-sichern/` | `/en/guides/back-up-android-photos-to-usb/` |
| Hardware-/OTG-Ratgeber | `/usb-stick-fuer-android-auswaehlen/` | `/en/guides/choose-usb-drive-for-android/` |
| Backup-Strategie | `/foto-backup-strategie-android/` | `/en/guides/android-photo-backup-strategy/` |
| Support | `/support/` | `/en/support/` |
| Impressum | `/impressum/` | `/en/imprint/` |
| Datenschutz | `/privacy/` | `/en/privacy/` |
| Fehlerseite | `/404/` | `/en/404/` |

Zusätzlich wird `404.html` als Cloudflare-Fallback aus der deutschen 404-Seite erzeugt.

## Legacy-URL-Zuordnung auf dem neuen Host

| Alter Pfad | Neuer Pfad | Status |
|---|---|---|
| `/hilfe.html` | `/hilfe/` | 301 |
| `/privacy.html` | `/privacy/` | 301 |
| `/support.html` | `/support/` | 301 |
| `/impressum.html` | `/impressum/` | 301 |
| `/usb-stick-auswaehlen.html` | `/usb-stick-fuer-android-auswaehlen/` | 301 |
| `/en/help.html` | `/en/help/` | 301 |
| `/en/privacy.html` | `/en/privacy/` | 301 |
| `/en/support.html` | `/en/support/` | 301 |
| `/en/imprint.html` | `/en/imprint/` | 301 |
| `/en/select-usb-drive.html` | `/en/guides/choose-usb-drive-for-android/` | 301 |

## Alte Inhalte und Fragmente

Die 301-Regeln behalten URL-Fragmente im Browser. Deshalb existieren die Ziele auf den neuen Hilfe-Hubs statisch und ohne JavaScript; jeder Eintrag verweist weiter auf den exakten heutigen Abschnitt.

| Bisheriger Inhalt | Neuer Ort / Entscheidung | Status |
|---|---|---|
| Produktnutzen, lokale USB-Kopie, Originale bleiben | Produktseiten und USB-Anleitungen DE/EN; Aussagen unter `CLAIMS-REGISTER.md` | migriert; extern freigabepflichtig |
| DE `#anleitung` | `/hilfe/#anleitung` → `/android-fotos-auf-usb-stick-sichern/#schritte` | migriert |
| DE `#medienzugriff` | `/hilfe/#medienzugriff` → `/android-fotos-auf-usb-stick-sichern/#zielordner` | migriert |
| DE `#video` | `/hilfe/#video` → gepflegte Textanleitung `#zielordner`; alte Aufnahme nicht publiziert | migriert; Medien bewusst ausgelassen |
| DE `#otg` | `/hilfe/#otg` → Hardware-Ratgeber `#anschluss` | migriert |
| DE `#probleme` | `/hilfe/#probleme` → USB-Anleitung `#probleme` | migriert |
| DE `#auswahlhilfe` | `/hilfe/#auswahlhilfe` → Hardware-Ratgeber `#start` | migriert |
| DE `#cat-otg`, `#cat-usbc`, `#cat-usba` | gleichnamige Ziele auf `/hilfe/` → Hardware-Ratgeber `#anschluss` | migriert |
| DE `#cat-phone` | `/hilfe/#cat-phone` → Hardware-Ratgeber `#start` | migriert |
| EN `#anleitung` | `/en/help/#anleitung` → `/en/guides/back-up-android-photos-to-usb/#steps` | migrated |
| EN `#media-access` | `/en/help/#media-access` → USB guide `#destination-folder` | migrated |
| EN `#video` | `/en/help/#video` → maintained text guide `#destination-folder`; old capture not published | migrated; media intentionally omitted |
| EN `#otg` | `/en/help/#otg` → hardware guide `#connect` | migrated |
| EN `#probleme` | `/en/help/#probleme` → USB guide `#problems` | migrated |
| EN `#auswahlhilfe` | `/en/help/#auswahlhilfe` → hardware guide `#start` | migrated |
| EN `#cat-otg`, `#cat-usbc`, `#cat-usba` | same IDs on `/en/help/` → hardware guide `#connect` | migrated |
| EN `#cat-phone` | `/en/help/#cat-phone` → hardware guide `#start` | migrated |
| Zielordner-/System-Picker-Hilfe | DE `#zielordner`, EN `#destination-folder`, mit begrenztem Samsung/One-UI-Beispiel | migrated; device evidence gate open |
| Affiliate-/Produktempfehlungen und Produktbilder | Nicht publiziert: Rechte, Aktualität und Ziele nicht neu verifiziert | bewusst ausgelassen / intentionally omitted |
| freiwillige Umami-Statistik | In der neuen Site nicht enthalten; Legacy-Root bleibt getrennt | bewusst ausgelassen / intentionally omitted |
| Samsung-/Galaxy-Suchintention | Kein eigener Pfad; begrenzte Hilfe im Zielordnerabschnitt | zusammengeführt; eigenständige Quellenbasis offen |
| „Android-Fotos ohne Cloud sichern“ | Suchintention in Produktseite und Methodenvergleich der Backup-Strategie | zusammengeführt, nicht als eigener Pfad |
| Google-Play-Bewertungslink | Neutraler lokalisierter Footer-Link zum bestätigten Listing | migrated |

## Bekannte Abweichung vom ursprünglichen Zielumfang

Der ursprüngliche Auftrag verlangte drei substanzielle Suchseiten und nannte USB-Anleitung, „ohne Cloud“ sowie Samsung/Galaxy. Umgesetzt wurden stattdessen USB-Anleitung, Hardware-Auswahl und Backup-Strategie, jeweils DE/EN. Ob diese Substitution den Auftrag ausreichend erfüllt, ist unabhängig zu bewerten.

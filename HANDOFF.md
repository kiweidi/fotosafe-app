# FotoSafe Website — Builder Handoff

Stand: 2026-09-14. Builder-Follow-up nach GPT-5.6-Readjudication, keine unabhängige Endabnahme des danach geänderten Kandidaten.

## Frozen independent verdict

- Maßgebliche Evidenz: `QA-REPORT.md`, SHA-256 `2589b24fdd3794973ac2db0de973f6e64e5080759e321f3c5b4bfdfe71f1a94a`.
- Ergebnis des eingefrorenen Audits: **FAIL / REQUEST_CHANGES**, **19 findings OPEN** (F01–F19).
- Die spätere read-only `GPT56-FINAL-READJUDICATION-2026-09-13.md` bewertete den eingefrorenen reparierten Kandidaten mit **REQUEST_CHANGES**: F10 war der einzige lokale Blocker; F09/F13/F14 und Launch blieben extern beziehungsweise nicht abschließend verifiziert.
- Nach dieser Readjudication wurde F10 im Builder-Worktree repariert und ein zusätzlich entdeckter Kontrastfehler der großen Prozessziffern behoben. Diese neuen Bytes waren nicht Gegenstand des eingefrorenen GPT-5.6-Reviews und sind daher noch kein unabhängiger PASS.
- `QA-REPORT.md` bleibt unverändert. Lokale Builder-Ergebnisse stehen ausschließlich in `BUILDER-REPORT.md`.
- Frühere PASS-Aussagen und Berichte beziehen sich auf ältere Zwischenstände und sind kein Freigabebeleg für diesen Kandidaten.

## Working context

- Worktree: `/home/hermes/projects/fotosafe-cloudflare-preview`
- Branch: `feat/cloudflare-premium-site`
- Baseline HEAD: `5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79`
- Canonical target: `https://fotosafe.weidisoft.net/`
- The audited and repaired site is versioned on the candidate branch; **the historical baseline commit cannot reproduce the candidate**. The exact handoff commit and subject-manifest hash must be taken from the external frozen evidence bundle.
- The protected main copy, GitHub Pages production and `.github/workflows/pages.yml` must remain unchanged in this builder round.

## Done

- Bilingual static generator with 18 logical pages plus the static fallback artifact.
- Local preview and production build trees are isolated as `dist/preview` and `dist/production`.
- GitHub legacy-root checks and Cloudflare candidate checks are separate npm lanes.
- GPT-5.6 schloss F01–F08, F11–F12 und F15–F19 für den eingefrorenen lokalen Kandidaten; F09/F13/F14 blieben wegen externer Nachweise, Claims und Provenienz begrenzt.
- F10 wurde danach testgetrieben geschlossen: `src`, `srcset`, `<source>` und relevante CSS-URLs werden im tatsächlichen `SITE_DIR` geprüft; auch Derivate wie `-de-540.webp` werden erkannt. Der dokumentierte EN→DE-WebP-Mutant scheitert jetzt wie erwartet.
- Die vier lokalen Gates (`npm run test`, `npm run check`, `npm run check:preview`, `npm run check:production`) liefen danach in einer frischen Wegwerfkopie mit Gesamt-Exitcode 0.
- Ein gezielter axe-core-4.13.0-Lauf über 36 Route-/Viewport-Kombinationen meldete 0 Contrast-Violations. Die verbleibenden Incompletes wurden nach Ursache getrennt und manuell gegen die tatsächlichen Farben geprüft; ein realer 1,61:1-Fehler der großen Prozessziffern wurde auf 3,20:1 angehoben und durch einen RED/GREEN-Test abgesichert.
- Der dokumentierte lokale Browserlauf `reports/post-gpt56-browser-qa.json` lief gegen `dist/preview` mit Exitcode 0; alle Bilder dekodierten, alle geprüften Seiten hatten genau eine H1 und 0 Dokumentoverflow.
- Known legacy fragment destinations are static, unique, link to exact relevant sections and work without JavaScript at document level.
- Published media is restricted by an explicit allowlist; excluded masters remain in the source tree.

## Open

- Kein bekannter lokaler Codeblocker aus der GPT-5.6-Readjudication ist nach dem Builder-Follow-up noch offen; das ist ausdrücklich ein Builderstatus, kein unabhängiges Gesamturteil.
- Der Commit-Gate ist lokal abgeschlossen; F14 bleibt bis zu einem finalen Hashmanifest und einer frischen unabhängigen READ-ONLY-Nachprüfung des exakt eingefrorenen Commits **PARTIAL**.
- F09/F13 bleiben für Veröffentlichung blockiert, bis Rechte-, App-/Release-, Billing-, Operator- sowie Datenschutz-/Rechtsclaims von den zuständigen Personen belegt und freigegeben sind.
- Native Screenreader, reale Androidgeräte, HiDPI/Cross-Browser, nativer 200%-Zoom und die tatsächlichen Cloudflare-/Finalhost-Header sind weiterhin nicht verifiziert.
- No overall launch result has been issued by the builder.

## Unknown

- Current Cloudflare account/project bindings, retention and authenticated rollback controls were not inspected in this round.
- Actual app internals, release behaviour, repeat-run behaviour, device compatibility and billing behaviour were not proven by destructive device, backup or purchase tests.
- Native screen-reader, real-device, 200% zoom, Search Console and production-host behaviour are not verified for this candidate.
- Current rights ownership and legal sufficiency are not established by repository files alone.

## Externally gated

Each gate is separate and requires explicit owner action; approval of one does not imply another:

1. **commit gate — completed locally** — the reviewed source and evidence state is versioned on the candidate branch; the external bundle pins the exact commit and hashes.
2. **preview deployment gate — still open** — upload one exact manifest-identified preview artifact only after independent review and explicit owner approval.
3. **final-host launch gate** — approve the exact production artifact and final-host verification.
4. **DNS/domain gate** — change Cloudflare/custom-domain/DNS/certificate configuration.
5. **indexability gate** — allow production indexing and any Search Console submission.
6. Rights, operator facts, privacy/legal text, app/release claims and billing claims remain the accountable gates listed in `CLAIMS-REGISTER.md`.

The user explicitly authorized the local commit/freeze/review sequence on 2026-09-14. No push, merge, reset, workflow trigger, deployment, preview publication, DNS/domain/certificate/Search Console/Play Console/production change, purchase or destructive device action is authorized by this handoff.

## Reproducibility chain

1. Start from the exact versioned candidate commit named by the frozen evidence bundle; the historical baseline SHA is insufficient.
2. Run `npm ci`, `npm run check`, `npm run check:preview`, and `npm run check:production` as described in `DEPLOYMENT.md`.
3. Generate the final source/output SHA-256 inventory after the last change, not before.
4. Serve only `dist/preview` on `127.0.0.1:4173`; run browser and axe checks against that exact server and uniquely named reports/screenshots.
5. Record what was tested as local technical evidence, what is implemented but not independently reviewed, what is externally gated, and what remains not verified.
6. Give the exact candidate plus this frozen audit to a fresh READ-ONLY reviewer. Do not promote builder GREEN to an independent PASS.

## Relevant records

- `QA-REPORT.md` — frozen independent findings
- `/home/hermes/reviews/fotosafe/GPT56-FINAL-READJUDICATION-2026-09-13.md` — maßgebliche spätere Readjudication des eingefrorenen Kandidaten
- `BUILDER-REPORT.md` — per-finding builder RED/GREEN ledger
- `CLAIMS-REGISTER.md` — public claims, evidence inputs and approval gates
- `ASSET-SOURCES.md` — public asset allowlist and rights status
- `CONTENT-MAP.md`, `SEO-MAP.md` — route, migration and search-intent mapping
- `DEPLOYMENT.md`, `MAINTENANCE.md` — local reproduction, future gates and 30/60/90 review plan

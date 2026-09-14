# FotoSafe Builder Verification Report

Builder/remediation record for the local candidate. This file does not replace or modify the frozen independent `QA-REPORT.md`, and it is not an independent acceptance verdict.

## Baseline

- Builder worktree: `/home/hermes/projects/fotosafe-cloudflare-preview`
- Branch: `feat/cloudflare-premium-site`
- Starting HEAD: `5f2f0dcff2abd9dd48a24aca3ea32a3f76e17b79`
- Starting status hash: `9d47686221aaf7bfd192356d3da165f34695b89b9321493f29150dd51f1931c7`
- Node: `v22.23.0`; npm: `10.9.8`
- Frozen audit: 245029 bytes, SHA-256 `2589b24fdd3794973ac2db0de973f6e64e5080759e321f3c5b4bfdfe71f1a94a`
- Protected main copy verified clean at the same HEAD: `## main...origin/main`
- Baseline `git diff --check`: exit 0 in both worktrees.

## Finding ledger

### F01 — CLOSED locally

- **State:** The DE/EN strategy guides discussed 3-2-1, routine, checking and risks, but lacked a substantive offline-method decision aid.
- **RED:** `node --test --test-name-pattern='F01' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped. Expected failure: DE output lacked `Methodenvergleich`.
- **Change:** Added idiomatic DE/EN comparison tables for FotoSafe-to-USB, Android file manager, PC copy over USB and microSD where supported. Each compares effort, control, requirements and loss limits, avoids blanket security/encryption claims, and links separately to the product and full USB guide. Updated route titles/descriptions.
- **GREEN:** `npm run build && node --test --test-name-pattern='F01' tests/audit-remediation.test.js` — build emitted 18 preview pages; 1 test, 1 pass, 0 fail, 0 skipped.
- **Residual boundary:** Editorial pair review remains appropriate. Device availability varies; microSD is explicitly conditional. This local content check does not certify any method as failure-proof or encrypted.

### F02 — CLOSED locally

- **State:** Both USB guides stopped at selecting the USB volume and omitted the final Android folder grant, wrong-target recovery, error states, and bounded Samsung guidance.
- **RED:** `node --test --test-name-pattern='F02' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected failure on missing final picker labels.
- **Change:** Added complete DE/EN steps through “Diesen Ordner verwenden”/“Use this folder” and “Zulassen”/“Allow”; correct/wrong storage cues; disabled-root, denied-permission and unrecognised-USB recovery; full-media-access settings guidance; and a bounded Samsung/One UI fallback. Existing German Galaxy-S23 captures/poster were visually inspected: no accounts, filenames, notifications or other private data were visible, but date/currentness and cross-device parity were not provable, so they are not presented as universal evidence and no new private media was used.
- **GREEN:** `node --test --test-name-pattern='F02' tests/audit-remediation.test.js` — 1 test, 1 pass, 0 fail, 0 skipped.
- **Residual boundary:** Real current-device screenshots, exact wording across Android/manufacturer versions, and English visual parity remain independent/device-evidence gates; text explicitly limits those claims.

### F03 — CLOSED locally

- **State:** The 301s retained fragments, but the replacement help hubs had no matching targets for the 20 known DE/EN legacy fragments.
- **RED:** `node --test --test-name-pattern='F03' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected failure at DE `#anleitung`.
- **Change:** Added all 10 DE and 10 EN static compatibility targets to the replacement hubs, each with a relevant explanation and valid onward link. No server-side fragment-routing claim is made; normal fragment retention is used.
- **GREEN:** focused F03 test — 1 pass, 0 fail, 0 skipped; validator — 19 HTML files, 434 local references, 10 redirects, 0 failures; CDP browser matrix — 40 checks (20 fragments with JavaScript and the same 20 without JavaScript), 0 failures, with every retained hash resolving to a matching static element and meaningful heading.
- **Residual boundary:** The local static server exercised final routes directly; Cloudflare's deployed handling of the existing fragment-preserving 301 rules remains an external hosting/re-audit check.

### F04 — CLOSED locally

- **State:** All builds wrote to `dist`, and `npm test` silently ran a preview build, so testing could overwrite a production artifact with noindex output.
- **RED:** `node --test --test-name-pattern='F04' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected `ENOENT` because `OUTPUT_DIR` was ignored.
- **Change:** Build mode is validated as `preview` or `production`; `OUTPUT_DIR` is honored; npm preview/production builds write to `dist/preview` and `dist/production`; tests and validator read an explicit/default `SITE_DIR`; `npm test` no longer builds.
- **GREEN:** isolated F04 test — 1 pass, 0 fail, 0 skipped; isolated preview candidate remained noindex, production content was indexable, and production 404 remained noindex.
- **Residual boundary:** Deployment documentation and both hosting pipelines are handled under F11/F12; no artifact has been uploaded.
### F05 — CLOSED locally

- **State:** The hardware-guide grid retained a 396 px intrinsic minimum at 390/320 px, the fixed 520 px hero orbit overflowed immediately above the 900 px breakpoint, and the complete DE trial/Pro note ended below the 390×844 viewport.
- **RED:** permanent CDP regression `assert_page('/usb-stick-fuer-android-auswaehlen/',390,844,...)` failed with `overflow: 23`; the focused four-viewport probe measured hardware 413/390 and 343/320, Home 946/886 at requested 901 px, and the trial note at y=868 for 390×844 (exit 1).
- **Change:** Grid children can shrink, long article headings use language-aware wrapping, the single-column breakpoint now covers 901 px, and the narrow Home hero uses tighter but still visible typography/spacing. Added permanent 390/320 hardware and 901 Home checks plus a first-viewport trial-note assertion to `scripts/browser-qa.py`.
- **GREEN:** isolated preview build emitted 18 pages; focused CDP matrix ran 4 checks, 0 failures: all three overflow values were 0 and the 390 px trial-note bottom was y=821 (within 844 px).
- **Residual boundary:** Browser 200% zoom and visual hierarchy still require the final matrix and independent review; no content was hidden to obtain these measurements.
### F06 — CLOSED locally

- **State:** The orange focus ring measured only 2.2879:1 on white and 2.1452:1 on mist; TOC links were 40 px high and the standalone footer brand had no 44 px minimum.
- **RED:** `SITE_DIR=dist/preview node --test --test-name-pattern='F06' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected failure reported 2.2878955941495933:1 on white.
- **Change:** Added a two-colour focus treatment (opaque `#005ea8` ring plus white separation ring) and 44 px minima for TOC links and footer brand. Breadcrumbs remain ordinary inline text links and are documented as the WCAG/project flowing-text exception.
- **GREEN:** focused Node test — 1 pass, 0 fail, 0 skipped. CDP at 390×844 measured TOC 358×44 and footer brand 140.30×44 CSS px, each focused with `rgb(0,94,168)` outline and white 6 px ring. Calculated outline contrast is 6.80:1 on white and 6.38:1 on mist.
- **Residual boundary:** Native screen-reader and platform-specific high-contrast-mode behavior remain `NOT VERIFIED`; final Tab/Shift+Tab and visual checks are still required.
### F07 — CLOSED locally

- **State:** English USB guidance had only a short file-manager paragraph while German included a decision table; English Help had three FAQs versus four in German.
- **RED:** `SITE_DIR=dist/preview node --test --test-name-pattern='F07' tests/audit-remediation.test.js` — exit 1, initially exposing an overly literal German matcher; after correcting that test wording, exit 1 on the substantive missing English `Cost` decision.
- **Change:** Added an idiomatic English FotoSafe/file-manager comparison covering workflow, repeat runs, control, cost, media-access implications and the one-time Pro nuance; added the fourth English support FAQ and matching TOC link.
- **GREEN:** `node --test --test-name-pattern='F07' tests/audit-remediation.test.js` — 1 test, 1 pass, 0 fail, 0 skip.
- **Residual boundary:** Content parity is locally asserted; independent bilingual editorial review remains outside this builder verdict.
- **Local status:** **CLOSED**.
### F08 — CLOSED locally

- **State:** No explicit review link existed; all Play links were install/listing CTAs.
- **RED:** `node --test --test-name-pattern='F08' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail (`index.html lacks the localized accessible review link`).
- **Change:** Added a restrained localized footer link to the confirmed listing URL, with `_blank`, `noopener noreferrer`, and screen-reader disclosure that Google Play controls the next screen. No review parameter, reward, sentiment filter or dialog promise was added.
- **GREEN:** Preview rebuild plus focused test — 1 pass, 0 fail, 0 skip.
- **Residual boundary:** No store interaction was performed; click-through to the current public listing remains part of final browser QA.
- **Local status:** **CLOSED**.

### F09 — CLOSED locally; rights gate remains external

- **State:** The build recursively published all 47 source assets, producing 49 output assets including generated CSS/JS; 36 historical assets were unreferenced.
- **RED:** `node --test --test-name-pattern='F09' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail; the path-set diff listed every extra PNG/JPG/SVG/MP4/product/script asset.
- **Change:** Replaced recursive copying with an explicit 11-source-asset allowlist; generated `site.css` and `site.js` remain separate. Updated `ASSET-SOURCES.md` per published image/icon/badge and kept all source masters untouched.
- **GREEN:** Preview rebuild produced exactly 13 output assets; focused test — 1 pass, 0 fail, 0 skip; excluded USB-help master remained readable in the source tree.
- **Residual boundary:** App icon, share image, screenshots and local symbol provenance are explicitly **Owner-/Rechtsfreigabe offen**. This external gate is not represented as technically closed.
- **Local status:** **CLOSED** for allowlisting; external rights approval **BLOCKED/OWNER GATE**.
### F10 — CLOSED locally

- **State:** Existing happy-path checks could pass even when a localized asset used the wrong language, a mandatory content module or legacy fragment was absent, or browser QA omitted a critical viewport.
- **RED:** `node --test tests/negative-fixtures.test.js` first failed because `scripts/audit-checks.js` did not exist. After adding a deliberately non-detecting stub, the meaningful functional RED remained: 4 tests, 0 pass, 4 fail, proving each intentionally broken fixture escaped the stub.
- **Change:** Added focused detectors for localized asset-language mismatches across WebP/PNG/JPG/SVG, missing mandatory modules, missing legacy fragments, and missing critical route/viewport combinations. Added four intentionally broken fixtures that must be rejected.
- **GREEN:** `node --test tests/negative-fixtures.test.js` — 4 tests, 4 pass, 0 fail, 0 skipped.
- **Residual boundary:** These are bounded mutation fixtures, not a full mutation-testing system. Browser correctness still depends on executing the separately defined browser matrix against the exact candidate.
- **Local status:** **CLOSED**.

### F11 — CLOSED locally

- **State:** `DEPLOYMENT.md` named `npm run validate` and `npm run serve`, but the documented candidate, bind address, browser base URL, report path and run label were not all executable and explicit; `serve` was absent.
- **RED:** `node --test --test-name-pattern='F11' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected failure: `package.json` had no `serve` script.
- **Change:** Added `npm run serve` for `dist/preview` bound only to `127.0.0.1:4173`. Updated the local runbook to build `dist/preview`, identify the exact candidate, and name `QA_BASE_URL`, `QA_REPORT`, `QA_RUN_LABEL` and the screenshot directory explicitly.
- **GREEN:** focused F11 test — 1 pass, 0 fail, 0 skipped; `npm run validate` — 19 HTML files, 435 local references and 10 redirects, 0 failures.
- **Residual boundary:** A final end-to-end run still has to start the documented server, execute the complete browser matrix against that exact process and stop it. No hosted preview or production endpoint was exercised.
- **Local status:** **CLOSED** for command/runbook consistency.

### F12 — CLOSED locally; protected workflow unchanged

- **State:** The unchanged GitHub Pages workflow runs `npm run check` and uploads the repository root, while the modified package command built and validated `dist/preview`; a future merge could therefore validate different bytes from those uploaded.
- **RED:** `node --test --test-name-pattern='F12' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped. Expected failure: `check` was `npm run build:preview && npm test && npm run validate` instead of the required legacy-root gate.
- **Change:** Added explicit `legacy:*`, `cloudflare:*`, `check:preview` and `check:production` lanes. `npm run check` now delegates only to the legacy root tests/validator that match `path: .`; the original analytics-configuration gate was preserved in a dedicated legacy validator. Preview and production lanes build, test and validate their own explicit output directory and indexing mode. The protected workflow itself was not edited.
- **GREEN:** focused F12 test — 1 pass, 0 fail, 0 skipped; `npm run check` — 18 legacy tests plus 14 HTML/298-reference validation passed; `npm run check:preview` — 18-page build, 33 tests and 19 HTML/435-reference/10-redirect validation passed; `npm run check:production` — the same 33 tests and validator passed against `dist/production` with production indexing policy.
- **Residual boundary:** No workflow was triggered and no artifact uploaded. Integrating the new site into either hosted pipeline, changing an upload path or retiring the legacy root remains a separate owner-approved action.
- **Local status:** **CLOSED** for pipeline separation; hosting integration remains an **OWNER GATE**.

### F13 — PARTIAL; accountable approvals remain external

- **State:** Public product, billing, privacy, operator, compatibility and media-rights statements existed across pages and store-derived copy without one accountable source/date/scope/approval record; repository text could be mistaken for proof.
- **RED:** `node --test --test-name-pattern='F13' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; expected `ENOENT` for the absent `CLAIMS-REGISTER.md`.
- **Change:** Added C01–C14 with DE/EN wording, scope, source/date, evidence owner, approval status, review deadline, allowed surfaces and limitations. App/release, billing/product, operator, privacy/legal and rights gates are explicit; prohibited guarantee groups are retained as guardrails.
- **GREEN:** focused F13 test — 1 pass, 0 fail, 0 skipped; all 14 IDs, required columns and accountable gate classes present, with an explicit statement that source/store text is not independent proof.
- **Residual boundary:** The builder cannot approve operator facts, legal/privacy sufficiency, app internals, compatibility, billing or rights. Those rows remain **EXTERNAL APPROVAL REQUIRED** rather than CLOSED.
- **Local status:** **PARTIAL** — register implemented; external approvals **BLOCKED/OWNER GATE**.

### F14 — PARTIAL pending final manifests and independent re-audit

- **State:** Handoff/maps contained stale PASS-oriented claims, omitted the complete fragment/content migration, blurred requested search intentions with implemented routes, lacked the approval chain and had no 30/60/90 maintenance plan.
- **RED:** `node --test --test-name-pattern='F14' tests/audit-remediation.test.js` — 1 test, 0 pass, 1 fail, 0 skipped; first expected failure was the missing frozen `FAIL / REQUEST_CHANGES` verdict in `HANDOFF.md`.
- **Change:** Rewrote the handoff around done/open/unknown/externally-gated categories, frozen audit identity and five separate operational gates. Expanded the full DE/EN legacy-fragment/content map, separated requested search intentions, documented why DE is `x-default`, corrected pipeline/rollback language, and added claim/schema/asset expiry rules plus a non-automated 30/60/90 plan.
- **GREEN:** focused F14 test — 1 pass, 0 fail, 0 skipped; frozen verdict/count, status categories, migration tokens, search-intent rationale, manifest/rollback requirements and 30/60/90 checks all present.
- **Residual boundary:** Final source/output manifests, report hashes and end-state counts must be generated only after F15–F19 and the last build. The baseline commit still cannot reproduce this uncommitted candidate. An independent document/source/dist comparison remains outstanding.
- **Local status:** **PARTIAL** until final evidence freeze; commit/versioning remains an **OWNER GATE**.

### F15 — CLOSED locally

- **State:** The generic host fallback was a copy of the German `/404/` document and depended on an inline `location.replace()` heuristic to recover English requests.
- **RED actually run:** `node --test --test-name-pattern='F15' tests/audit-remediation.test.js` — **exit 1**; the fallback had neither static `lang="de"`/`lang="en"` sections nor a usable no-JavaScript English path and still contained the redirect script.
- **Change:** `scripts/site-content.js` now emits a dedicated bilingual `404.html` with static DE and EN sections plus home/help links in both languages. The locale redirect script was removed, and `scripts/build-site.js` no longer overwrites the file with the DE route.
- **GREEN actually run:** `npm run build:preview && node --test --test-name-pattern='F15' tests/audit-remediation.test.js && npm run validate` — **exit 0**; 1/1 focused test passed and validation reported 19 HTML files, 437 references, 10 redirects.
- **Residual boundary:** This proves static candidate bytes and no-JS usefulness. Actual unknown-path fallback behavior depends on the hosting configuration and remains for local HTTP/browser probing and independent review.

### F16 — implemented locally; runtime axe recheck pending

- **State:** Both homepages used a nested `<aside class="safety-note">`, creating an extra complementary landmark in axe, and the DE comparison table had an empty corner header plus headers without explicit row/column scope.
- **RED actually run:** `node --test --test-name-pattern='F16' tests/audit-remediation.test.js` — **exit 1** on the generated homepage’s nested complementary landmark.
- **Change:** Safety notes are now neutral containers with `role="note"`. The comparison table has a named `Entscheidung` column header, `scope="col"` on all columns, and `scope="row"` on row headers.
- **GREEN actually run:** `npm run build:preview && node --test --test-name-pattern='F16' tests/audit-remediation.test.js && npm run validate` — **exit 0**; 1/1 focused test passed and validation reported 19 HTML files, 437 references, 10 redirects.
- **Residual boundary:** Static semantics are fixed; closure of the original axe finding still requires a fresh axe run against this exact candidate. Native screen-reader behavior is not verified.
### F17 — CLOSED locally; external schema interpretation not claimed

- **State:** The DE homepage emitted `MobileApplication` while EN emitted `SoftwareApplication`, with different OS strings and no shared entity identifier. Guide schema types and breadcrumbs were inconsistent, and some generated breadcrumb items were not reflected by visible links.
- **RED actually run:** `node --test --test-name-pattern='F17' tests/audit-remediation.test.js` — **exit 1**; the paired DE/EN app entity comparison and guide breadcrumb contract failed on the pre-change output.
- **Change:** Added shared `appStructuredData()` and `breadcrumbStructuredData()` generators. Both homepages now identify the same `MobileApplication` at `https://fotosafe.weidisoft.net/#app` with the same category, OS and install URL. All six guide counterparts emit an `Article` plus a localized `BreadcrumbList`; the final item deliberately omits `item`, while linked ancestors correspond to visible navigation destinations. Unsupported ratings, offers and prices are not emitted.
- **GREEN actually run:** `npm run build:preview && node --test --test-name-pattern='F17' tests/audit-remediation.test.js && npm run validate` — **exit 0**; 1/1 focused test passed and validation reported 19 HTML files, 437 references, 10 redirects.
- **Residual boundary:** JSON parses and the local pairwise contract passes. No official search-engine/schema service was queried, and no rich-result eligibility or search-display effect is claimed.

### F18 — implemented locally; served-header/CSP-console check pending

- **State:** Generated `_headers` contained no CSP. Inline document initialization meant a blanket script prohibition would also have broken progressive enhancement.
- **RED actually run:** `node --test --test-name-pattern='F18' tests/audit-remediation.test.js` — **exit 1**; expected failure: `_headers` did not match `Content-Security-Policy:`.
- **Change:** Added a minimal generated policy for preview and production: self-only defaults/styles/fonts/media, `data:` only for images, no objects/connections, self base/form action, no framing, HTTPS upgrade and scripts restricted to self plus the computed SHA-256 of the one fixed inline initialization statement. No `unsafe-inline`, `unsafe-eval`, wildcard script source or new third-party origin was added.
- **GREEN actually run:** Preview build + focused F18 + validator and production build + focused F18 + validator — **exit 0** in both lanes; each focused test passed and each validator reported 19 HTML files, 437 references and 10 redirects.
- **Residual boundary:** `_headers` is a hosting manifest and the Python localhost server does not apply it. Enforcement, menu/lightbox behavior, console violations and external Store navigation must still be checked on a server that applies these exact headers or during independent hosted review. No exploit finding is claimed.

### F19 — implemented locally; browser decode/visual recheck pending

- **State:** Every preview loaded a 1080×1920 screenshot even at much smaller rendered widths, and brand marks loaded the 512×512 master for 40/44/72-px slots.
- **RED actually run:** `node --test --test-name-pattern='F19' tests/audit-remediation.test.js` — **exit 1**; expected failure: the generated hero lacked the `-540.webp` preview and responsive `srcset`/`sizes`. A subsequent first GREEN attempt exposed and corrected a test-harness-only `siteDir is not defined` typo before acceptance.
- **Change:** Generated deterministic 360×640 and 540×960 WebP derivatives for all six localized screenshot masters and 1×/2× PNG derivatives for the 40-, 44- and 72-px icon slots. Preview `<img>` elements now use 360/540/1080-width `srcset` plus `sizes`, while each lightbox anchor retains the untouched 1080×1920 master. Official Google Play badges were not transformed. All new derivatives were added to the explicit publish allowlist and rights/provenance register.
- **GREEN actually run:** Preview build followed by focused F09/F19 tests and validator — **exit 0**; 2/2 tests passed, validation reported 19 HTML files, 437 references and 10 redirects. `identify` confirmed twelve screenshot derivatives at 360×640/540×960 and icon derivatives at 40, 44, 72, 80, 88 and 144 square pixels.
- **Residual boundary:** Source dimensions, path selection and master preservation are proved. Fresh browser `naturalWidth`/decode, standard/HiDPI sharpness, LCP/CLS/Lighthouse and local/live hash parity remain pending; no CWV improvement or production bandwidth figure is claimed.

## Post-GPT-5.6 builder follow-up — 2026-09-14

This section records changes made **after** the immutable candidate reviewed in `GPT56-FINAL-READJUDICATION-2026-09-13.md`. It is builder evidence, not a retroactive change to that review and not an independent PASS.

### F10 — CLOSED locally after readjudication

- **Review blocker:** A realistic English-page mutation to `/assets/01-in-drei-schritten-auf-usb-de-540.webp` passed the previous suite because the helper only recognized a locale suffix immediately before the extension and the generated `SITE_DIR` tree was not parsed comprehensively.
- **RED actually run:** A derivative-path regression covering `-de-540.webp`/`-en-540.webp` and an extractor contract for `src`, comma-separated `srcset`, `<source>` and CSS `url(...)` each failed before implementation (focused Node runs, exit 1).
- **Change:** `scripts/audit-checks.js` now exports a normalized asset extractor and recognizes opposite-locale markers before either a derivative suffix or the extension. `tests/site-structure.test.js` invokes it across every generated HTML document in the actual `SITE_DIR`. Negative fixtures cover WebP/PNG/JPG/SVG masters and derivatives plus all required reference forms.
- **GREEN actually run:** The two focused F10 tests passed. In a copied candidate the exact English→German `-de-540.webp` mutation made the generated-tree test fail (exit 1), which is the required rejection behavior.
- **Full gates:** `npm run test`, `npm run check`, `npm run check:preview`, and `npm run check:production` then ran in a fresh disposable copy with aggregate exit 0.
- **Residual boundary:** This closes the reproduced local blindspot. It does not approve asset rights or substitute for a fresh independent review of the post-change bytes.

### F06 follow-up — axe contrast incompletes resolved by cause

- **Detailed runtime probe:** axe-core 4.13.0 ran the `color-contrast` rule over all 18 logical routes at 390 and 1280 CSS px: 36 runs, 0 violations. The remaining incomplete rule instances were caused by gradient backgrounds, horizontally scrollable table cells reported as partially obscured, and proof chips containing SVG image nodes.
- **Manual colour bounds:** Against every endpoint of the relevant gradients, the worst ratios are `ink` 13.96:1, `blue` 5.72:1, and `muted` 5.42:1. Table body text is 15.70:1 on paper. These exceed the applicable 4.5:1/3:1 thresholds.
- **Additional real issue found:** The large decorative process numerals were white at alpha `.16` on `#07182b`, only 1.61:1. A focused regression test first failed with that exact value. The alpha is now `.35`, yielding 3.20:1 for the 48 px bold text; the same test passes.
- **Post-fix axe result:** The 36-route/viewport contrast probe still reports 0 violations, and process numerals no longer occur among incomplete nodes. Automation limitations remain recorded rather than being mislabeled as an axe PASS.
- **Residual boundary:** Native screen-reader, forced-colours/high-contrast mode, cross-browser, real-device and native 200% zoom behavior remain not verified.

### Fresh local browser evidence

- **Final fresh-copy gates after all follow-up edits:** `npm ci` found 0 vulnerabilities; `npm run test` passed its 18-test legacy lane and 42-test candidate lane; `npm run check` passed 18/18; `npm run check:preview` built 19 preview pages and passed 42/42; `npm run check:production` built 19 production pages and passed 42/42. Every command exited 0 in one newly created disposable copy, which was then removed.
- `QA_BASE_URL=http://127.0.0.1:4173 QA_REPORT=reports/post-gpt56-browser-qa.json QA_RUN_LABEL=post-gpt56-f10-a11y npm run test:browser` — exit 0 on 2026-09-14.
- Every checked document had exactly one H1 and zero document overflow; all checked responsive screenshot/icon assets decoded, including localized `-540.webp` selections; the no-JavaScript mobile navigation fallback remained usable.
- This loopback run does not apply Cloudflare `_headers` and therefore does not verify deployed CSP, redirect, cache, DNS or certificate behavior.

## Owner and external gates

No commit, stage, stash, push, merge, reset, workflow trigger/change, deployment, preview publication, DNS/domain/certificate/Search Console/Play Console/production change, purchase, backup, formatting or destructive device action is authorized by this builder record.

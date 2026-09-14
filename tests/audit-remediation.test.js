import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, readFile, readdir, rm} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const projectRoot = new URL('..', import.meta.url).pathname;
const root = resolve(projectRoot, process.env.SITE_DIR || 'dist/preview');
const load = (name) => readFile(join(root, name), 'utf8');
const execFileAsync = promisify(execFile);

function visibleText(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
}

test('F01 DE and EN strategy guides compare offline backup methods and their limits', async () => {
  const pairs = [
    ['foto-backup-strategie-android/index.html', {
      labels: [/Methodenvergleich/i, /FotoSafe.*USB/i, /Dateimanager/i, /PC.*USB-Kabel/i, /microSD/i],
      dimensions: [/Aufwand/i, /Kontrolle/i, /Voraussetzungen/i, /Verlustgrenze/i],
      guide: 'href="/android-fotos-auf-usb-stick-sichern/"',
      product: 'href="/"',
    }],
    ['en/guides/android-photo-backup-strategy/index.html', {
      labels: [/method comparison/i, /FotoSafe.*USB/i, /file manager/i, /PC.*USB cable/i, /microSD/i],
      dimensions: [/Effort/i, /Control/i, /Requirements/i, /Loss limit/i],
      guide: 'href="/en/guides/back-up-android-photos-to-usb/"',
      product: 'href="/en/"',
    }],
  ];

  for (const [name, expected] of pairs) {
    const html = await load(name);
    const text = visibleText(html);
    for (const pattern of [...expected.labels, ...expected.dimensions]) assert.match(text, pattern, `${name}: ${pattern}`);
    assert.match(html, new RegExp(expected.guide), `${name}: USB guide link`);
    assert.match(html, new RegExp(expected.product), `${name}: product link`);
    assert.doesNotMatch(text, /(?:jede|all) (?:Methode|method).*(?:sicher|secure)|(?:vollständig|fully) verschlüsselt|encrypted by default/i, `${name}: blanket security claim`);
  }
});

test('F02 DE and EN USB guides complete the system-picker decision flow', async () => {
  const de = await load('android-fotos-auf-usb-stick-sichern/index.html');
  const en = await load('en/guides/back-up-android-photos-to-usb/index.html');

  for (const phrase of [
    'Diesen Ordner verwenden', 'Zulassen', 'falsche Speicherwahl',
    'USB nicht angezeigt', 'Einstellungen', 'Fotos und Videos',
    'One.?UI', 'Galaxy S23 ist nur ein Beispiel'
  ]) assert.match(de, new RegExp(phrase, 'i'), `DE picker guidance is missing ${phrase}`);

  for (const phrase of [
    'Use this folder', 'Allow', 'wrong storage', 'USB is not listed',
    'Settings', 'Photos and videos', 'One.?UI', 'Galaxy S23 is only an example'
  ]) assert.match(en, new RegExp(phrase, 'i'), `EN picker guidance is missing ${phrase}`);

  assert.match(de, /interner Speicher[\s\S]*USB|USB[\s\S]*interner Speicher/i);
  assert.match(en, /internal storage[\s\S]*USB|USB[\s\S]*internal storage/i);
});

test('F03 all known legacy help fragments resolve to static relevant content', async () => {
  const cases = [
    ['hilfe/index.html', {
      anleitung:'/android-fotos-auf-usb-stick-sichern/#schritte', medienzugriff:'/android-fotos-auf-usb-stick-sichern/#zielordner',
      video:'/android-fotos-auf-usb-stick-sichern/#zielordner', probleme:'/android-fotos-auf-usb-stick-sichern/#probleme',
      otg:'/usb-stick-fuer-android-auswaehlen/#anschluss', auswahlhilfe:'/usb-stick-fuer-android-auswaehlen/#start',
      'cat-otg':'/usb-stick-fuer-android-auswaehlen/#anschluss', 'cat-usbc':'/usb-stick-fuer-android-auswaehlen/#anschluss',
      'cat-usba':'/usb-stick-fuer-android-auswaehlen/#anschluss', 'cat-phone':'/usb-stick-fuer-android-auswaehlen/#start'
    }],
    ['en/help/index.html', {
      anleitung:'/en/guides/back-up-android-photos-to-usb/#steps', 'media-access':'/en/guides/back-up-android-photos-to-usb/#destination-folder',
      video:'/en/guides/back-up-android-photos-to-usb/#destination-folder', probleme:'/en/guides/back-up-android-photos-to-usb/#problems',
      otg:'/en/guides/choose-usb-drive-for-android/#connect', auswahlhilfe:'/en/guides/choose-usb-drive-for-android/#start',
      'cat-otg':'/en/guides/choose-usb-drive-for-android/#connect', 'cat-usbc':'/en/guides/choose-usb-drive-for-android/#connect',
      'cat-usba':'/en/guides/choose-usb-drive-for-android/#connect', 'cat-phone':'/en/guides/choose-usb-drive-for-android/#start'
    }],
  ];

  for (const [file, entries] of cases) {
    const html = await load(file);
    for (const [id, href] of Object.entries(entries)) {
      assert.equal((html.match(new RegExp(`id=["']${id}["']`, 'g')) || []).length, 1, `${file} must contain #${id} exactly once`);
      assert.match(html, new RegExp(`id=["']${id}["'][\\s\\S]{0,800}href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`), `${file} #${id} must link to ${href}`);
      const [path, fragment] = href.slice(1).split('#');
      const destination = await load(`${path}${path.endsWith('/') ? '' : '/'}index.html`);
      assert.equal((destination.match(new RegExp(`id=["']${fragment}["']`, 'g')) || []).length, 1, `${href} target must exist exactly once`);
    }
  }
});

test('F04 preview and production builds stay isolated and tests never rebuild', async () => {
  const workspace = await mkdtemp(join(tmpdir(), 'fotosafe-build-modes-'));
  const previewOut = join(workspace, 'preview');
  const productionOut = join(workspace, 'production');
  try {
    await execFileAsync(process.execPath, ['scripts/build-site.js'], {
      cwd: new URL('..', import.meta.url),
      env: {...process.env, DEPLOY_ENV: 'preview', OUTPUT_DIR: previewOut},
    });
    await execFileAsync(process.execPath, ['scripts/build-site.js'], {
      cwd: new URL('..', import.meta.url),
      env: {...process.env, DEPLOY_ENV: 'production', OUTPUT_DIR: productionOut},
    });
    assert.match(await readFile(join(previewOut, 'index.html'), 'utf8'), /content="noindex,nofollow"/);
    assert.match(await readFile(join(productionOut, 'index.html'), 'utf8'), /content="index,follow"/);
    assert.match(await readFile(join(productionOut, '404.html'), 'utf8'), /content="noindex,nofollow"/);
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.doesNotMatch(pkg.scripts.test, /\b(?:npm run )?build\b/, 'npm test must not rewrite a candidate');
  } finally {
    await rm(workspace, {recursive: true, force: true});
  }
});

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

test('F06 focus indicator contrasts on light and dark surfaces and standalone targets are 44px', async () => {
  const css = await readFile(new URL('../src/site.css', import.meta.url), 'utf8');
  const focus = css.match(/a:focus-visible[^{]*\{([^}]+)\}/)?.[1] || '';
  const color = focus.match(/outline:[^#]*(#[a-f\d]{6})/i)?.[1].slice(1);
  assert.ok(color, 'focus outline needs an explicit opaque color');
  assert.ok(contrast(color, 'ffffff') >= 3, `focus/white contrast was ${contrast(color, 'ffffff')}`);
  assert.ok(contrast(color, 'f5f8fa') >= 3, `focus/mist contrast was ${contrast(color, 'f5f8fa')}`);
  assert.match(focus, /box-shadow:[^}]*#fff/i, 'dark surfaces need a contrasting inner/outer focus ring');
  assert.match(css, /\.toc a\{[^}]*min-height:44px/);
  assert.match(css, /\.footer-brand\{[^}]*min-height:44px/);
});

test('F06 process step numbers meet the 3:1 large-text contrast threshold', async () => {
  const css = await readFile(new URL('../src/site.css', import.meta.url), 'utf8');
  const background = css.match(/--ink-deep:#([a-f\d]{6})/i)?.[1];
  const rule = css.match(/\.process-grid li>span\{([^}]+)\}/)?.[1] || '';
  const alpha = Number(rule.match(/color:rgba\(255,255,255,([\d.]+)\)/)?.[1]);
  assert.ok(background && Number.isFinite(alpha), 'step number foreground/background colors must be explicit');
  const backgroundChannels = background.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16));
  const foreground = backgroundChannels
    .map((channel) => Math.round(255 * alpha + channel * (1 - alpha)).toString(16).padStart(2, '0'))
    .join('');
  assert.ok(contrast(foreground, background) >= 3, `step-number contrast was ${contrast(foreground, background)}`);
});

test('F07 DE and EN expose equivalent USB decisions and help depth', async () => {
  const deGuide = visibleText(await load('android-fotos-auf-usb-stick-sichern/index.html'));
  const enGuideHtml = await load('en/guides/back-up-android-photos-to-usb/index.html');
  const enGuide = visibleText(enGuideHtml);
  for (const pattern of [/FotoSafe/i, /Dateimanager/i, /Kosten/i, /einmaliger Pro-Kauf/i, /vollständigen Medienzugriff/i, /richtige Speicherwahl/i]) {
    assert.match(deGuide, pattern, `DE decision missing ${pattern}`);
  }
  for (const pattern of [/FotoSafe/i, /file manager/i, /Cost/i, /one-time Pro purchase/i, /full media access/i, /correct storage choice/i]) {
    assert.match(enGuide, pattern, `EN decision missing ${pattern}`);
  }
  assert.match(enGuideHtml, /aria-label="Comparison of FotoSafe and file manager"/);
  const deHelp = await load('hilfe/index.html');
  const enHelp = await load('en/help/index.html');
  assert.equal((deHelp.match(/<details>/g) || []).length, 4);
  assert.equal((enHelp.match(/<details>/g) || []).length, 4);
  assert.match(enHelp, /personal help[\s\S]*support/i);
});

test('F08 localized review links use the confirmed listing without review gating', async () => {
  const listing = 'https://play.google.com/store/apps/details?id=at.weidi.fotobackup';
  for (const [file, label] of [['index.html', 'FotoSafe bei Google Play bewerten'], ['en/index.html', 'Review FotoSafe on Google Play']]) {
    const html = await load(file);
    const link = html.match(new RegExp(`<a class="review-link" href="([^"]+)" target="_blank" rel="noopener noreferrer">${label}<span class="sr-only">`));
    assert.ok(link, `${file} lacks the localized accessible review link`);
    assert.equal(link[1], listing);
  }
  for (const file of ['index.html', 'en/index.html']) {
    const text = visibleText(await load(file));
    assert.doesNotMatch(text, /only if|nur wenn|reward|Belohnung|five.star|fünf Sterne/i);
  }
});

test('F09 build publishes only the explicit rights-documented asset allowlist', async () => {
  const screenshotStems = [
    '01-in-drei-schritten-auf-usb-de', '01-three-guided-steps-to-usb-en',
    '02-backup-vorher-pruefen-de', '02-review-before-backup-en',
    '03-expertenmodus-quellen-de', '03-expert-mode-sources-en'
  ];
  const expected = [
    ...screenshotStems.flatMap(stem => [`${stem}.webp`, `${stem}-360.webp`, `${stem}-540.webp`]),
    'fotosafe-app-icon.png', ...[40, 44, 72, 80, 88, 144].map(size => `fotosafe-app-icon-${size}.png`), 'fotosafe-share.png',
    'google-play/get-it-on-google-play-de.png', 'google-play/get-it-on-google-play-en.png',
    'icons.svg', 'site.css', 'site.js'
  ];
  const actual = [];
  for (const entry of await readdir(join(root, 'assets'), {withFileTypes:true})) {
    if (entry.isDirectory()) {
      for (const child of await readdir(join(root, 'assets', entry.name))) actual.push(`${entry.name}/${child}`);
    } else actual.push(entry.name);
  }
  assert.deepEqual(actual.sort(), expected.sort());
  assert.equal(await readFile(join(projectRoot, 'assets/usb-hilfe/01-sicherungsort-aendern.jpg')).then(() => true), true, 'source master must remain');
  const evidence = await readFile(join(projectRoot, 'ASSET-SOURCES.md'), 'utf8');
  for (const asset of expected.filter((name) => !['site.css', 'site.js'].includes(name))) {
    assert.ok(evidence.includes(asset), `missing rights row for ${asset}`);
  }
  assert.match(evidence, /Owner-\/Rechtsfreigabe offen/);
});

test('F11 npm commands and localhost runbook name the exact candidate and QA outputs', async () => {
  const pkg = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.validate, 'SITE_DIR=dist/preview node scripts/validate-site.js');
  assert.match(pkg.scripts.serve, /127\.0\.0\.1/);
  assert.match(pkg.scripts.serve, /dist\/preview/);
  const runbook = await readFile(join(projectRoot, 'DEPLOYMENT.md'), 'utf8');
  assert.match(runbook, /QA_BASE_URL=http:\/\/127\.0\.0\.1:4173/);
  assert.match(runbook, /QA_REPORT=reports\/candidate-browser-qa\.json/);
  assert.match(runbook, /QA_RUN_LABEL=local-preview-candidate/);
  assert.match(runbook, /127\.0\.0\.1:4173/);
});

test('F12 legacy Pages and Cloudflare candidate pipelines validate the artifacts they publish', async () => {
  const pkg = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.check, 'npm run legacy:check', 'protected Pages workflow must keep checking the root artifact it uploads');
  assert.match(pkg.scripts['legacy:check'] || '', /legacy:test[\s\S]*legacy:validate/);
  assert.match(pkg.scripts['legacy:validate'] || '', /validate-legacy-site\.js/);
  assert.match(pkg.scripts['check:preview'] || '', /build:preview[\s\S]*cloudflare:test:preview[\s\S]*cloudflare:validate:preview/);
  assert.match(pkg.scripts['check:production'] || '', /build:production[\s\S]*cloudflare:test:production[\s\S]*cloudflare:validate:production/);
  const workflow = await readFile(join(projectRoot, '.github/workflows/pages.yml'), 'utf8');
  assert.match(workflow, /run:\s*npm run check/);
  assert.match(workflow, /path:\s*\./);
  const legacyValidator = await readFile(join(projectRoot, 'scripts/validate-legacy-site.js'), 'utf8');
  assert.match(legacyValidator, /REQUIRE_ANALYTICS_ID/);
  assert.match(legacyValidator, /isProviderConfigured/);
});

test('F13 claims register assigns evidence, scope and accountable external gates', async () => {
  const claims = await readFile(join(projectRoot, 'CLAIMS-REGISTER.md'), 'utf8');
  for (const column of ['ID', 'DE wording', 'EN wording', 'Scope', 'Source', 'Source date/version', 'Evidence owner', 'Approval status', 'Review-by date', 'Allowed surfaces', 'Notes/limitations']) {
    assert.match(claims, new RegExp(column.replace('/', '\\/'), 'i'), `missing claims column ${column}`);
  }
  for (let index = 1; index <= 14; index += 1) assert.match(claims, new RegExp(`\\| C${String(index).padStart(2, '0')} \\|`));
  for (const gate of ['Operator gate', 'Privacy/legal gate', 'Rights gate', 'App/release owner', 'Billing/product owner']) assert.match(claims, new RegExp(gate, 'i'));
  assert.match(claims, /not independent proof|kein unabhängiger Nachweis/i);
  assert.doesNotMatch(claims, /overall rights pass|Gesamt-Rechte-PASS/i);
});

test('F14 handoff and maps preserve the frozen verdict, migration scope and 30/60/90 gates', async () => {
  const [handoff, content, seo, maintenance, deployment] = await Promise.all([
    'HANDOFF.md', 'CONTENT-MAP.md', 'SEO-MAP.md', 'MAINTENANCE.md', 'DEPLOYMENT.md'
  ].map((name) => readFile(join(projectRoot, name), 'utf8')));
  assert.match(handoff, /FAIL\s*\/\s*REQUEST_CHANGES/);
  assert.match(handoff, /19[^\n]*OPEN/i);
  for (const heading of ['Done', 'Open', 'Unknown', 'Externally gated']) assert.match(handoff, new RegExp(`## ${heading}`, 'i'));
  assert.match(handoff, /baseline commit[^\n]*cannot reproduce|Ausgangscommit[^\n]*nicht reproduzier/i);
  for (const gate of ['commit', 'preview deployment', 'final-host launch', 'DNS/domain', 'indexability']) assert.match(handoff, new RegExp(gate, 'i'));
  for (const fragment of ['anleitung','medienzugriff','media-access','video','otg','probleme','auswahlhilfe','cat-otg','cat-usbc','cat-usba','cat-phone']) assert.match(content, new RegExp(`#${fragment}`));
  assert.match(content, /migrated|migriert/i);
  assert.match(content, /intentionally omitted|bewusst ausgelassen/i);
  assert.match(seo, /Requested search intentions|Angeforderte Suchintentionen/i);
  assert.match(seo, /x-default[^\n]*(?:German|Deutsch|DE)/i);
  for (const day of ['30 days','60 days','90 days']) assert.match(maintenance, new RegExp(day, 'i'));
  assert.match(maintenance, /No automated jobs|Keine automatisierten Jobs/i);
  assert.match(deployment, /source manifest|Quellmanifest/i);
  assert.match(deployment, /rollback[^\n]*approval|Rollback[^\n]*Freigabe/i);
});

test('F15 static fallback is bilingual and useful for unknown EN paths without JavaScript', async () => {
  const fallback = await load('404.html');
  const text = visibleText(fallback);
  assert.match(fallback, /<section[^>]+lang="de"/i);
  assert.match(fallback, /<section[^>]+lang="en"/i);
  assert.match(text, /Diese Adresse gibt es nicht/i);
  assert.match(text, /The address does not exist/i);
  for (const href of ['/', '/hilfe/', '/en/', '/en/help/']) assert.match(fallback, new RegExp(`href="${href.replaceAll('/', '\\/')}"`));
  assert.doesNotMatch(fallback, /location\.(?:replace|assign)|location\.href|window\.open/i);
  assert.match(fallback, /<meta name="robots" content="noindex,nofollow">/i);
});

test('F16 home notes are not nested complementary landmarks and comparison headers are named', async () => {
  for (const page of ['index.html', 'en/index.html']) {
    const html = await load(page);
    assert.doesNotMatch(html, /<aside\b[^>]*class="[^"]*safety-note/i, `${page}: nested complementary landmark`);
    assert.match(html, /<(?:div|section)\b[^>]*class="[^"]*safety-note[^>]*\brole="note"/i, `${page}: semantic safety note`);
  }
  const guide = await load('android-fotos-auf-usb-stick-sichern/index.html');
  assert.doesNotMatch(guide, /<th(?:\s[^>]*)?>\s*<\/th>/i);
  assert.match(guide, /<th scope="col">Entscheidung<\/th>/i);
  for (const row of ['Ablauf', 'Weitere Läufe', 'Kontrolle', 'Kosten']) assert.match(guide, new RegExp(`<th scope="row">${row}<\\/th>`));
});

test('F17 localized counterparts share one app entity and guide breadcrumbs match visible links', async () => {
  const jsonLd = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const appFields = entity => Object.fromEntries(['@type', '@id', 'name', 'applicationCategory', 'operatingSystem', 'installUrl'].map(key => [key, entity[key]]));
  const deApp = jsonLd(await load('index.html'))[0];
  const enApp = jsonLd(await load('en/index.html'))[0];
  assert.deepEqual(appFields(enApp), appFields(deApp));
  assert.equal(deApp['@id'], 'https://fotosafe.weidisoft.net/#app');

  const guides = [
    'android-fotos-auf-usb-stick-sichern/index.html', 'usb-stick-fuer-android-auswaehlen/index.html',
    'foto-backup-strategie-android/index.html', 'en/guides/back-up-android-photos-to-usb/index.html',
    'en/guides/choose-usb-drive-for-android/index.html', 'en/guides/android-photo-backup-strategy/index.html'
  ];
  for (const file of guides) {
    const html = await load(file);
    const schemas = jsonLd(html);
    const graph = schemas.flatMap(schema => schema['@graph'] ?? [schema]);
    const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList');
    assert.ok(breadcrumb, `${file}: BreadcrumbList missing`);
    for (const item of breadcrumb.itemListElement) {
      if (item.item) assert.match(html, new RegExp(`href="${item.item.replace('https://fotosafe.weidisoft.net', '').replaceAll('/', '\\/')}"`));
    }
    assert.doesNotMatch(JSON.stringify(schemas), /aggregateRating|offers|price/i);
  }
});

test('F18 generated headers enforce a minimal static-site CSP without broad script exceptions', async () => {
  const headers = await load('_headers');
  assert.match(headers, /Content-Security-Policy:/);
  for (const directive of [
    "default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'",
    "form-action 'self'", "img-src 'self' data:", "style-src 'self'", "connect-src 'none'",
    "font-src 'self'", "media-src 'self'", "script-src 'self' 'sha256-Du+OJKJSbdUgz5nrHeWWINvez6XKDDU/tyj/5c2uvwo='"
  ]) assert.ok(headers.includes(directive), `missing CSP directive: ${directive}`);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval|script-src[^\n;]*\*/i);
});

test('F19 previews and app icons use responsive derivatives while lightboxes retain masters', async () => {
  const home = await load('index.html');
  assert.match(home, /href="\/assets\/01-in-drei-schritten-auf-usb-de\.webp"[^>]*data-lightbox/);
  assert.match(home, /src="\/assets\/01-in-drei-schritten-auf-usb-de-540\.webp"/);
  assert.match(home, /srcset="\/assets\/01-in-drei-schritten-auf-usb-de-360\.webp 360w, \/assets\/01-in-drei-schritten-auf-usb-de-540\.webp 540w, \/assets\/01-in-drei-schritten-auf-usb-de\.webp 1080w"/);
  assert.match(home, /sizes="\(max-width: 480px\) 68vw, \(max-width: 900px\) 44vw, 280px"/);
  assert.doesNotMatch(home, /<img src="\/assets\/fotosafe-app-icon\.png"/);
  for (const size of [40, 44, 72, 80, 88, 144]) {
    const data = await readFile(resolve(root, `assets/fotosafe-app-icon-${size}.png`));
    assert.ok(data.length > 0, `missing icon derivative ${size}`);
  }
  for (const stem of ['01-in-drei-schritten-auf-usb-de', '02-backup-vorher-pruefen-de', '03-expertenmodus-quellen-de', '01-three-guided-steps-to-usb-en', '02-review-before-backup-en', '03-expert-mode-sources-en']) {
    for (const width of [360, 540]) {
      const data = await readFile(resolve(root, `assets/${stem}-${width}.webp`));
      assert.ok(data.length > 0, `missing screenshot derivative ${stem}-${width}`);
    }
  }
});

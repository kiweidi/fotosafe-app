import test from 'node:test';
import assert from 'node:assert/strict';
import {access, readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const pairs = [
  ['index.html', 'en/index.html'],
  ['hilfe.html', 'en/help.html'],
  ['support.html', 'en/support.html'],
  ['privacy.html', 'en/privacy.html'],
  ['impressum.html', 'en/imprint.html'],
  ['404.html', 'en/404.html'],
  ['usb-stick-auswaehlen.html', 'en/select-usb-drive.html'],
];
const origin = 'https://kiweidi.github.io/fotosafe-app/';

async function source(path) {
  return readFile(join(root, path), 'utf8');
}

test('every German public page has a directly corresponding English page', async () => {
  for (const [de, en] of pairs) {
    await access(join(root, de));
    await access(join(root, en));
    assert.match(await source(de), /<html lang="de">/i, de);
    assert.match(await source(en), /<html lang="en">/i, en);
  }
});

test('page pairs expose canonical and reciprocal hreflang metadata', async () => {
  for (const [de, en] of pairs.filter(([name]) => name !== '404.html')) {
    const deSource = await source(de);
    const enSource = await source(en);
    const deUrl = new URL(de, origin).href;
    const enUrl = new URL(en, origin).href;
    for (const [page, html, canonical] of [[de, deSource, deUrl], [en, enSource, enUrl]]) {
      assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), `${page} canonical`);
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="de" href="${deUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), `${page} de alternate`);
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${enUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`), `${page} en alternate`);
    }
  }
});

test('every page pair has accessible corresponding-language links', async () => {
  for (const [de, en] of pairs) {
    const deSource = await source(de);
    const enSource = await source(en);
    assert.match(deSource, /class="fs-language-link is-active"[^>]*aria-current="page"[^>]*>DE</i, `${de} active DE`);
    assert.match(deSource, new RegExp(`href="${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:#[^"]*)?"[^>]*data-language="en"`), `${de} EN partner`);
    assert.match(enSource, /class="fs-language-link is-active"[^>]*aria-current="page"[^>]*>EN</i, `${en} active EN`);
    const deFromEn = `../${de}`;
    assert.match(enSource, new RegExp(`href="${deFromEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:#[^"]*)?"[^>]*data-language="de"`), `${en} DE partner`);
  }
});

test('English pages keep local navigation inside /en and contain no German screenshot assets', async () => {
  for (const [, en] of pairs) {
    const html = await source(en);
    assert.doesNotMatch(html, /(?:src|srcset)="[^"]*(?:-de\.|tested-badge-de|sicherungsort-aendern|falscher-speicher|usb-nicht-erkannt)/i, en);
    for (const href of html.matchAll(/href="([^"]+\.html(?:#[^"]*)?)"/gi)) {
      const target = href[1];
      if (target.startsWith('../') || /^https?:\/\//i.test(target)) continue;
      assert.doesNotMatch(target, /(?:^|\/)(?:hilfe|datenschutz|impressum|usb-stick-auswaehlen)\.html/i, `${en}: ${target}`);
    }
  }
});

test('English pages contain no residual German user-facing copy', async () => {
  const germanCopy = /\b(?:Startseite|Datenschutzerklärung|Impressum|Hauptnavigation|Hauptmenü|Direkt zum Inhalt|Sicherungsort|Sicherung|Auswahlhilfe|Ablehnen|Statistik erlauben)\b/i;
  for (const [, en] of pairs) {
    const html = await source(en);
    const withoutCode = html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(?:style|script)\b[\s\S]*?<\/(?:style|script)>/gi, ' ');
    const visibleText = withoutCode.replace(/<[^>]+>/g, ' ');
    const translatedAttributes = [...withoutCode.matchAll(/\b(?:alt|title|aria-label|placeholder)="([^"]*)"/gi)]
      .map((match) => match[1])
      .join(' ');
    assert.doesNotMatch(`${visibleText} ${translatedAttributes}`, germanCopy, en);
  }
  const analytics = await source('assets/privacy-analytics.js');
  assert.match(analytics, /The choice is yours\./);
  assert.match(analytics, /Allow statistics/);
});

test('shared language selector honours manual preference and only auto-selects English from German routes', async () => {
  const core = await import('../assets/language-core.js');
  assert.equal(core.selectAutomaticLanguage({stored: 'de', languages: ['en-US'], isEnglishRoute: false}), 'de');
  assert.equal(core.selectAutomaticLanguage({stored: 'en', languages: ['de-AT'], isEnglishRoute: false}), 'en');
  assert.equal(core.selectAutomaticLanguage({stored: null, languages: ['en-GB', 'de'], isEnglishRoute: false}), 'en');
  assert.equal(core.selectAutomaticLanguage({stored: null, languages: ['de-AT', 'en'], isEnglishRoute: false}), 'de');
  assert.equal(core.selectAutomaticLanguage({stored: null, languages: ['en-US'], isEnglishRoute: true}), null);
  assert.equal(core.englishPartnerPath('/fotosafe-app/privacy.html', '/fotosafe-app/privacy.html'), '/fotosafe-app/en/privacy.html');
  assert.equal(core.englishPartnerPath('/fotosafe-app/', '/fotosafe-app/'), '/fotosafe-app/en/index.html');
  assert.equal(core.englishPartnerPath('/fotosafe-app/missing-page', '/fotosafe-app/'), '/fotosafe-app/en/index.html');
  assert.equal(core.englishPartnerPath('/fotosafe-app/missing/privacy.html', '/fotosafe-app/', 'en/404.html'), '/fotosafe-app/en/404.html');
});

test('English home uses the three matching English FotoSafe screenshots', async () => {
  const html = await source('en/index.html');
  for (const file of ['01-three-guided-steps-to-usb-en.png', '02-review-before-backup-en.png', '03-expert-mode-sources-en.png']) {
    assert.match(html, new RegExp(`\.\./assets/${file}`));
  }
});

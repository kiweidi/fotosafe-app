import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

const projectRoot = new URL('..', import.meta.url).pathname;
const root = resolve(projectRoot, process.env.SITE_DIR || 'dist/preview');
const origin = 'https://fotosafe.weidisoft.net';

const load = name => readFile(join(root, name), 'utf8');
const visibleText = html => html
  .replace(/<(?:style|script)\b[\s\S]*?<\/(?:style|script)>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replaceAll('&amp;', '&')
  .replace(/\s+/g, ' ')
  .trim();
const bodyHtml = html => html.slice(html.indexOf('<body'), html.indexOf('</body>'));
const occurrences = (text, phrase) => text.toLocaleLowerCase().split(phrase.toLocaleLowerCase()).length - 1;
const meta = (html, attribute, key) => html.match(new RegExp(`<meta ${attribute}="${key}" content="([^"]+)"`))?.[1];
const jsonLd = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

const pages = [
  {
    file: 'index.html',
    url: `${origin}/`,
    h1: 'Android-Fotos direkt auf USB sichern.',
    claim: 'Deine Fotos. Deine Kopie. Dein USB-Stick.',
    description: 'Fotos und Videos direkt vom Android-Handy auf USB sichern – ohne PC und ohne Medien-Cloud. Originale bleiben erhalten. FotoSafe kostenlos testen.',
    note: 'Kostenlos installieren · Testlauf bis 100 Medien · kein Abo',
    guide: 'Android-Fotos auf USB-Stick sichern – Anleitung',
    phrases: ['Android-Fotos auf USB sichern', 'Fotos auf USB sichern', 'Fotos vom Handy auf USB-Stick sichern', 'Foto-Backup ohne Cloud', 'Fotos sichern ohne PC'],
  },
  {
    file: 'en/index.html',
    url: `${origin}/en/`,
    h1: 'Back up Android photos directly to USB.',
    claim: 'Your photos. Your copy. Your USB drive.',
    description: 'Back up photos and videos directly from your Android phone to USB — without a PC or media cloud. Your originals stay untouched. Try FotoSafe for free.',
    note: 'Install for free · Test up to 100 media files · no subscription',
    guide: 'Back up Android photos to a USB drive — guide',
    phrases: ['back up Android photos to USB', 'save photos to a USB drive', 'transfer photos from your phone to a USB drive', 'photo backup without cloud storage', 'back up photos without a PC'],
  },
];

test('localized home metadata and MobileApplication data use the production domain', async () => {
  for (const page of pages) {
    const html = await load(page.file);
    assert.equal(meta(html, 'name', 'description'), page.description, `${page.file}: description`);
    assert.equal(meta(html, 'property', 'og:description'), page.description, `${page.file}: og description`);
    assert.equal(meta(html, 'name', 'twitter:description'), page.description, `${page.file}: twitter description`);
    assert.equal(meta(html, 'property', 'og:url'), page.url, `${page.file}: og url`);
    for (const value of [
      meta(html, 'property', 'og:image'),
      meta(html, 'name', 'twitter:image'),
    ]) assert.match(value, /^https:\/\/fotosafe\.weidisoft\.net\/assets\//, `${page.file}: social image`);

    const app = jsonLd(html).find(entry => entry['@type'] === 'MobileApplication');
    assert.ok(app, `${page.file}: MobileApplication`);
    assert.equal(app.url, page.url);
    assert.equal(app.description, page.description);
    assert.match(app.image, /^https:\/\/fotosafe\.weidisoft\.net\/assets\//);
    assert.deepEqual(app.offers, {'@type': 'Offer', price: '0', priceCurrency: 'EUR'});
    assert.doesNotMatch(JSON.stringify(app), /aggregateRating|review/i);
  }
});

test('localized home hero, first Play CTA and search copy follow the contract', async () => {
  for (const page of pages) {
    const html = await load(page.file);
    const h1s = [...html.matchAll(/<h1>([\s\S]*?)<\/h1>/g)];
    assert.equal(h1s.length, 1, `${page.file}: one H1`);
    assert.equal(visibleText(h1s[0][1]), page.h1, `${page.file}: H1`);
    const escapedClaim = page.claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(html, new RegExp(`<\\/h1>\\s*<p class="hero-claim">${escapedClaim}<\\/p>`), `${page.file}: adjacent claim`);
    const escapedNote = page.note.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.match(html, new RegExp(`<div class="play-cta">[\\s\\S]*?play\\.google\\.com[\\s\\S]*?<p class="store-note">${escapedNote}<\\/p>[\\s\\S]*?<\\/div>`), `${page.file}: first Play CTA note`);
    assert.match(html, new RegExp(`<a[^>]+href="[^"]+"[^>]*>${page.guide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?<\\/a>`), `${page.file}: guide link text`);
    const text = visibleText(bodyHtml(html));
    for (const phrase of page.phrases) assert.equal(occurrences(text, phrase), 1, `${page.file}: ${phrase}`);
  }
});

test('every generated absolute SEO URL stays on the production origin', async () => {
  for (const page of pages) {
    const html = await load(page.file);
    const seoHead = html.slice(0, html.indexOf('</head>'));
    const urls = [...seoHead.matchAll(/https:\/\/[^"<]+/g)].map(match => match[0]);
    for (const url of urls.filter(value => !value.startsWith('https://schema.org') && !value.startsWith('https://play.google.com'))) {
      assert.ok(url.startsWith(`${origin}/`), `${page.file}: unexpected SEO origin ${url}`);
    }
  }
});
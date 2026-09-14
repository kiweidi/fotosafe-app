import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;

async function source(path) {
  return readFile(join(root, path), 'utf8');
}

function metaContent(html, key, value) {
  const match = html.match(new RegExp(`<meta\\s+${key}="${value}"\\s+content="([^"]+)"`, 'i'));
  return match?.[1] ?? '';
}

function mobileApplication(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)];
  return scripts.map((match) => JSON.parse(match[1])).find((entry) => entry['@type'] === 'MobileApplication');
}

test('localized home metadata and MobileApplication data describe the verified offer', async () => {
  const pages = [
    {
      path: 'index.html',
      description: 'Fotos und Videos direkt vom Android-Handy auf USB sichern – ohne PC und ohne Medien-Cloud. Originale bleiben erhalten. FotoSafe kostenlos testen.',
      url: 'https://kiweidi.github.io/fotosafe-app/index.html',
    },
    {
      path: 'en/index.html',
      description: 'Back up photos and videos directly from your Android phone to USB — without a PC or media cloud. Your originals stay untouched. Try FotoSafe for free.',
      url: 'https://kiweidi.github.io/fotosafe-app/en/index.html',
    },
  ];

  for (const page of pages) {
    const html = await source(page.path);
    assert.equal(metaContent(html, 'name', 'description'), page.description, `${page.path} description`);
    assert.equal(metaContent(html, 'property', 'og:description'), page.description, `${page.path} Open Graph description`);
    assert.equal(metaContent(html, 'name', 'twitter:description'), page.description, `${page.path} Twitter description`);
    assert.ok(page.description.length >= 120 && page.description.length <= 160, `${page.path} description length`);

    const app = mobileApplication(html);
    assert.ok(app, `${page.path} MobileApplication JSON-LD`);
    assert.equal(app.url, page.url);
    assert.equal(app.description, page.description);
    assert.match(app.image, /^https:\/\/.+fotosafe-app-icon\.png$/);
    assert.deepEqual(app.offers, {'@type': 'Offer', price: '0', priceCurrency: 'EUR'});
  }
});

function visibleText(html) {
  return html
    .replace(/<(?:style|script)\b[\s\S]*?<\/(?:style|script)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function occurrences(text, phrase) {
  return text.toLocaleLowerCase().split(phrase.toLocaleLowerCase()).length - 1;
}

test('localized home hero and search phrases follow the conversion copy contract', async () => {
  const pages = [
    {
      path: 'index.html',
      h1: 'Android-Fotos direkt auf USB sichern.',
      claim: 'Deine Fotos. Deine Kopie. Dein USB-Stick.',
      note: 'Kostenlos installieren · Testlauf bis 100 Medien · kein Abo',
      guide: 'Android-Fotos auf USB-Stick sichern – Anleitung',
      phrases: [
        'Android-Fotos auf USB sichern',
        'Fotos auf USB sichern',
        'Fotos vom Handy auf USB-Stick sichern',
        'Foto-Backup ohne Cloud',
        'Fotos sichern ohne PC',
      ],
    },
    {
      path: 'en/index.html',
      h1: 'Back up Android photos directly to USB.',
      claim: 'Your photos. Your copy. Your USB drive.',
      note: 'Install for free · Test up to 100 media files · no subscription',
      guide: 'Back up Android photos to a USB drive — guide',
      phrases: [
        'back up Android photos to USB',
        'save photos to a USB drive',
        'transfer photos from your phone to a USB drive',
        'photo backup without cloud storage',
        'back up photos without a PC',
      ],
    },
  ];

  for (const page of pages) {
    const html = await source(page.path);
    const h1s = [...html.matchAll(/<h1>([\s\S]*?)<\/h1>/gi)];
    assert.equal(h1s.length, 1, `${page.path} H1 count`);
    assert.equal(visibleText(h1s[0][1]), page.h1, `${page.path} H1`);
    assert.match(html, new RegExp(`<\/h1>\\s*<p class="claim">${page.claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/p>`), `${page.path} claim follows H1`);
    assert.match(html, new RegExp(`<div class="play-cta">[\\s\\S]*?<a[^>]+play\\.google\\.com[\\s\\S]*?<p class="store-note">${page.note.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/p>[\\s\\S]*?<\/div>`), `${page.path} first Play CTA note`);
    assert.match(html, new RegExp(`<a href="[^"]+#auswahlhilfe">${page.guide.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/a>`), `${page.path} USB guide link`);

    const text = visibleText(html);
    for (const phrase of page.phrases) {
      assert.equal(occurrences(text, phrase), 1, `${page.path} phrase: ${phrase}`);
    }
  }
});

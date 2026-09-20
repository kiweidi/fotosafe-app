import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const redirects = new Map([
  ['index.html', 'https://fotosafe.weidisoft.net/'],
  ['privacy.html', 'https://fotosafe.weidisoft.net/privacy/'],
  ['impressum.html', 'https://fotosafe.weidisoft.net/impressum/'],
  ['en/index.html', 'https://fotosafe.weidisoft.net/en/'],
  ['en/privacy.html', 'https://fotosafe.weidisoft.net/en/privacy/'],
  ['en/imprint.html', 'https://fotosafe.weidisoft.net/en/imprint/'],
]);

for (const [file, target] of redirects) {
  test(`${file} is a minimal migration stub for ${target}`, async () => {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    const lang = file.startsWith('en/') ? 'en' : 'de';

    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.match(html, /<meta name="robots" content="noindex,follow">/);
    assert.match(html, new RegExp(`<link rel="canonical" href="${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0; url=${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.match(html, /target\.hash = window\.location\.hash/);
    assert.match(html, /window\.location\.replace\(target\.href\)/);
    assert.match(html, new RegExp(`<a href="${target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
    assert.doesNotMatch(html, /analytics|consent|site\.css|site\.js|fonts\.googleapis|googletagmanager/i);
    assert.doesNotMatch(html, /kiweidi\.github\.io\/fotosafe-app\/(?:index|privacy|impressum|en\/index|en\/privacy|en\/imprint)\.html/);
  });
}

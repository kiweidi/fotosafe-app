import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const redirects = new Map([
  ['hilfe.html', 'https://fotosafe.weidisoft.net/hilfe/'],
  ['usb-stick-auswaehlen.html', 'https://fotosafe.weidisoft.net/usb-stick-fuer-android-auswaehlen/'],
  ['support.html', 'https://fotosafe.weidisoft.net/support/'],
  ['en/help.html', 'https://fotosafe.weidisoft.net/en/help/'],
  ['en/select-usb-drive.html', 'https://fotosafe.weidisoft.net/en/guides/choose-usb-drive-for-android/'],
  ['en/support.html', 'https://fotosafe.weidisoft.net/en/support/'],
]);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

test('legacy in-app help URLs redirect to their canonical Cloudflare destinations', async () => {
  for (const [path, destination] of redirects) {
    const html = await readFile(join(root, path), 'utf8');
    const escaped = escapeRegex(destination);

    assert.match(html, /<meta name="robots" content="noindex,follow">/i, `${path}: robots`);
    assert.match(html, new RegExp(`<meta http-equiv="refresh" content="0; url=${escaped}">`, 'i'), `${path}: no-JS redirect`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${escaped}">`, 'i'), `${path}: canonical`);
    assert.match(html, new RegExp(`<a href="${escaped}"`), `${path}: visible fallback link`);
    assert.match(html, /target\.hash = window\.location\.hash;/, `${path}: fragment preservation`);
    assert.match(html, /window\.location\.replace\(target\.href\);/, `${path}: history-safe redirect`);
    assert.doesNotMatch(html, /privacy-analytics|analytics-config|umami/i, `${path}: no analytics on redirect page`);
  }
});

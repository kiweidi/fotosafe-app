import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const siteDir = process.env.SITE_DIR || 'dist/preview';
const canonicalBase = 'https://fotosafe.weidisoft.net';

async function page(path) {
  return readFile(join(root, siteDir, path), 'utf8');
}

async function htmlFiles(dir = join(root, siteDir)) {
  const entries = await readdir(dir, {withFileTypes: true});
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? htmlFiles(join(dir, entry.name))
    : entry.name.endsWith('.html') ? [join(dir, entry.name)] : []));
  return nested.flat();
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function imprintSections(html) {
  return [...html.matchAll(/<section\s+data-imprint-section="([^"]+)"/gi)]
    .map((match) => match[1]);
}

function address(html) {
  return html.match(/<address\b[^>]*>([\s\S]*?)<\/address>/i)?.[1] || '';
}

test('imprint exposes complete confirmed identity and two immediate contact routes', async () => {
  for (const path of ['impressum/index.html', 'en/imprint/index.html']) {
    const html = await page(path);
    const contact = address(html);

    assert.match(contact, /Peter Weitgasser/, `${path}: owner`);
    assert.match(contact, /Bsuch 123/, `${path}: street`);
    assert.match(contact, /A-5760 Saalfelden/, `${path}: postcode and city`);
    assert.match(contact, /(?:Österreich|Austria)/, `${path}: country`);
    assert.match(contact, /href="mailto:fotosafe@weidisoft\.net"/, `${path}: email belongs to the contact address`);
    const phone = contact.match(/href="tel:([^"]+)"[^>]*>([^<]+)<\/a>/i);
    assert.ok(phone, `${path}: confirmed phone contact`);
    const normalizedVisiblePhone = phone[2].replace(/[^+\d]/g, '');
    assert.equal(phone[1], normalizedVisiblePhone, `${path}: tel URI matches the visible phone number`);
    assert.doesNotMatch(phone[1], /\*/, `${path}: tel URI must not contain redaction placeholders`);

    const immediateRoutes = count(html, /href="mailto:fotosafe@weidisoft\.net"/gi)
      + count(html, /href="tel:[^"]+"/gi)
      + count(html, /<form\b[^>]*\baction="(?!mailto:)[^"]+"/gi);
    assert.ok(immediateRoutes >= 2, `${path}: § 5 ECG needs email plus another immediate contact route`);
  }
});

test('personal operator identity is limited to legal pages', async () => {
  const legalPages = new Set([
    join(root, siteDir, 'privacy/index.html'),
    join(root, siteDir, 'impressum/index.html'),
    join(root, siteDir, 'en/privacy/index.html'),
    join(root, siteDir, 'en/imprint/index.html'),
  ]);

  for (const file of await htmlFiles()) {
    const html = await readFile(file, 'utf8');
    if (legalPages.has(file)) assert.match(html, /Peter Weitgasser/, `${file}: approved legal identity`);
    else assert.doesNotMatch(html, /Peter Weitgasser/, `${file}: unnecessary personal data`);
  }
});

test('German and English imprints have matching legal sections and statements', async () => {
  const de = await page('impressum/index.html');
  const en = await page('en/imprint/index.html');
  const expectedSections = ['identity-contact', 'media-direction', 'language'];

  assert.deepEqual(imprintSections(de), expectedSections, 'German legal section contract');
  assert.deepEqual(imprintSections(en), expectedSections, 'English legal section contract');
  assert.match(de, /Grundlegende Richtung/);
  assert.match(en, /Basic editorial direction/);
  assert.match(de, /deutsche Fassung maßgeblich/);
  assert.match(en, /German version prevails/);

  for (const value of ['Peter Weitgasser', 'Bsuch 123', 'A-5760 Saalfelden', 'fotosafe@weidisoft.net']) {
    assert.ok(de.includes(value), `German imprint contains ${value}`);
    assert.ok(en.includes(value), `English imprint contains ${value}`);
  }
});

test('imprint metadata is reciprocal and stale legal boilerplate is absent', async () => {
  const de = await page('impressum/index.html');
  const en = await page('en/imprint/index.html');
  const deUrl = `${canonicalBase}/impressum/`;
  const enUrl = `${canonicalBase}/en/imprint/`;

  for (const [path, html, canonical] of [
    ['impressum/index.html', de, deUrl],
    ['en/imprint/index.html', en, enUrl],
  ]) {
    assert.equal(count(html, /<h1\b/gi), 1, `${path}: one h1`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`));
    assert.match(html, new RegExp(`<link rel="alternate" hreflang="de" href="${deUrl}">`));
    assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${enUrl}">`));
    assert.doesNotMatch(html, /ec\.europa\.eu\/(?:consumers\/)?odr|OS-Plattform|ODR platform/i);
    assert.doesNotMatch(html, /keine Haftung|Haftungsausschluss|no liability|disclaimer of liability/i);
  }
});

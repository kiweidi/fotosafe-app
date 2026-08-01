import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const pages = ['index.html', 'hilfe.html', 'support.html', 'privacy.html', 'impressum.html', '404.html'];

async function html(name) {
  return readFile(join(root, name), 'utf8');
}

test('every public page declares a stable page id and loads the consent module locally', async () => {
  for (const page of pages) {
    const source = await html(page);
    assert.match(source, /<body[^>]*data-page-id="[a-z0-9_:-]+"/i, `${page} has no stable page id`);
    assert.match(source, /<script type="module" src="assets\/privacy-analytics\.js"><\/script>/, `${page} has no analytics module`);
    assert.doesNotMatch(source, /<script[^>]+src="https:\/\//i, `${page} preloads a third-party script`);
  }
});

test('privacy page distinguishes the tracking-free app from optional website statistics', async () => {
  const source = await html('privacy.html');
  assert.match(source, /FotoSafe-App[^<]*(?:trackingfrei|keine[^<]+Tracking)/i);
  assert.match(source, /Websiteanalyse/i);
  assert.match(source, /Umami/i);
  assert.match(source, /Einwilligung/i);
  assert.match(source, /Datenschutz-Einstellungen/i);
  assert.match(source, /Umami Software, Inc\./);
  assert.match(source, /https:\/\/umami\.is\/dpa/);
  assert.match(source, /Standardvertragsklauseln/);
  assert.match(source, /IP-Adresse/);
});

test('help products use stable non-text identifiers and sponsored links', async () => {
  const source = await html('hilfe.html');
  const cards = [...source.matchAll(/<article class="product-card"[^>]*>/g)].map((match) => match[0]);
  assert.equal(cards.length, 12);
  for (const card of cards) {
    assert.match(card, /data-product-id="[a-z0-9_:-]+"/);
    assert.match(card, /data-position-id="[a-z0-9_:-]+"/);
    assert.match(card, /data-evidence-id="(?:tested|plausible|manufacturer)"/);
  }
  const affiliateLinks = [...source.matchAll(/<a class="affiliate-link"[^>]*>/g)].map((match) => match[0]);
  assert.equal(affiliateLinks.length, 12);
  for (const link of affiliateLinks) assert.match(link, /rel="[^"]*sponsored[^"]*"/);
});

test('support page has no form and does not collect support messages', async () => {
  const source = await html('support.html');
  assert.doesNotMatch(source, /<form\b/i);
  assert.match(source, /mailto:fotosafe\.app@gmail\.com/i);
  assert.match(source, /<footer[\s\S]*?support\.html" aria-current="page"/i);
});

test('consent controls are styled, keyboard-focusable and visually balanced', async () => {
  const source = await readFile(join(root, 'assets/navigation.css'), 'utf8');
  for (const selector of ['.fs-consent', '.fs-consent__accept', '.fs-consent__reject', '.fs-privacy-settings']) {
    assert.match(source, new RegExp(selector.replace('.', '\\\.')));
  }
  assert.match(source, /\.fs-consent__actions[^}]*grid-template-columns\s*:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(source, /\.fs-consent[^}]*:focus-visible/);
  assert.match(source, /\.fs-consent\{[^}]*max-height:[^}]*overflow-y:auto/);
  const homeSource = await html('index.html');
  assert.match(homeSource, /\.faq-grid\{[^}]*align-items:start/);
});

test('manual pageview sends the raw browser referrer only through the before-send sanitizer', async () => {
  const source = await readFile(join(root, 'assets/privacy-analytics.js'), 'utf8');
  assert.match(source, /window\.umami\?\.track\(\{[\s\S]*?referrer:\s*document\.referrer,[\s\S]*?url:\s*`\/p\/\$\{pageId\}`/);
  assert.match(source, /fotoSafeAnalyticsBeforeSend\s*=\s*\(type,\s*payload\)\s*=>\s*sanitizePayload/);
  assert.match(source, /if \(readyState !== 'ready'\) return;/);
  assert.match(source, /if \(controller\.track\('help_article_view'/);
  assert.match(source, /if \(controller\.track\('affiliate_impression'/);
  assert.match(source, /if \(controller\.track\('scroll_depth'/);
  assert.match(source, /visibleProducts\.has\(product\)/);
  assert.match(source, /document\.visibilityState !== 'visible'/);
  assert.match(source, /visibilitychange/);
});

test('404 page is excluded from indexing', async () => {
  const source = await html('404.html');
  assert.match(source, /<meta name="robots" content="noindex,follow">/i);
  assert.match(source, /<base href="\/fotosafe-app\/">/i);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const contentPages = ['404.html'];

async function html(name) {
  return readFile(join(root, name), 'utf8');
}

test('every local content page declares a stable page id and loads the consent module locally', async () => {
  for (const page of contentPages) {
    const source = await html(page);
    assert.match(source, /<body[^>]*data-page-id="[a-z0-9_:-]+"/i, `${page} has no stable page id`);
    assert.match(source, /<script type="module" src="assets\/privacy-analytics\.js"><\/script>/, `${page} has no analytics module`);
    assert.doesNotMatch(source, /<script[^>]+src="https:\/\//i, `${page} preloads a third-party script`);
  }
});

test('consent controls are styled, keyboard-focusable and visually balanced', async () => {
  const source = await readFile(join(root, 'assets/navigation.css'), 'utf8');
  for (const selector of ['.fs-consent', '.fs-consent__accept', '.fs-consent__reject', '.fs-privacy-settings']) {
    assert.match(source, new RegExp(selector.replace('.', '\\\.')));
  }
  assert.match(source, /\.fs-consent__actions[^}]*grid-template-columns\s*:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(source, /\.fs-consent[^}]*:focus-visible/);
  assert.match(source, /\.fs-consent\{[^}]*max-height:[^}]*overflow-y:auto/);
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

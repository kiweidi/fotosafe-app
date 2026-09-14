import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

const projectRoot = new URL('..', import.meta.url).pathname;
const siteRoot = resolve(projectRoot, process.env.SITE_DIR || 'dist/production');
const load = (path) => readFile(join(siteRoot, path), 'utf8');

test('first-visit consent UI is a bilingual floating pill with a compact detail card', async () => {
  const [de, en, css] = await Promise.all([
    load('index.html'),
    load('en/index.html'),
    load('assets/site.css'),
  ]);

  assert.match(de, /data-privacy-prompt[^>]*hidden[^>]*>Optionale Statistik – auswählen</);
  assert.match(en, /data-privacy-prompt[^>]*hidden[^>]*>Optional statistics – choose</);
  assert.match(de, /Hilf uns mit datensparsamer Statistik, die Website zu verbessern\./);
  assert.match(de, /Es werden keine Fotos, Videos, Supporttexte oder vollständigen URLs erfasst\./);
  assert.match(en, /Help us improve the website with privacy-friendly statistics\./);
  assert.match(de, /href="\/privacy\/"[^>]*>Datenschutzerklärung</);
  assert.match(en, /href="\/en\/privacy\/"[^>]*>Privacy policy</);
  assert.ok(de.indexOf('data-privacy-reject') < de.indexOf('data-privacy-allow'), 'reject must be as immediate as allow');

  assert.match(css, /\.privacy-prompt\{[^}]*position:fixed/);
  assert.match(css, /\.privacy-prompt\{[^}]*min-height:44px/);
  assert.match(css, /\.privacy-prompt\{[^}]*max-width:calc\(100vw - 24px\)/);
  assert.match(css, /\.privacy-panel\{[^}]*position:fixed/);
  assert.match(css, /\.privacy-panel\{[^}]*bottom:calc\([^}]*env\(safe-area-inset-bottom\)/);
  assert.doesNotMatch(css, /\.privacy-panel\{[^}]*(?:inset:0|background:rgb\(4 20 38)/);
  assert.match(css, /\.privacy-panel-card\{[^}]*max-width:(?:500|520)px/);
});

test('generated pages cache-bust source assets and force deployment revalidation', async () => {
  const [html, headers] = await Promise.all([load('index.html'), load('_headers')]);
  assert.match(html, /href="\/assets\/site\.css\?v=[0-9a-f]{12}"/);
  assert.match(html, /src="\/assets\/privacy-analytics\.js\?v=[0-9a-f]{12}"/);
  assert.match(headers, /\/assets\/\*\n\s+Cache-Control: public, max-age=0, must-revalidate/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const workerUrl = new URL('../scripts/cloudflare-worker.js', import.meta.url);
const CSP = "default-src 'self'; script-src 'self'";
let createWorker;
try {
  ({createWorker} = await import(workerUrl));
} catch {
  createWorker = undefined;
}

test('an unknown English path returns a secured English 404 document with a real 404 status', async () => {
  assert.equal(typeof createWorker, 'function', 'Cloudflare worker factory is missing');
  const worker = createWorker({mode: 'production', csp: CSP});
  const calls = [];
  const env = {ASSETS: {fetch: async input => {
    const path = new URL(input.url).pathname;
    calls.push(path);
    if (path === '/en/404/') return new Response('<!doctype html><html lang="en"><title>Page not found</title>', {status: 200, headers: {'Content-Type': 'text/html'}});
    return new Response('<!doctype html><html lang="de"><title>Seite nicht gefunden</title>', {status: 404, headers: {'Content-Type': 'text/html'}});
  }}};

  const response = await worker.fetch(new Request('https://fotosafe.weidisoft.net/en/does-not-exist'), env);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get('Content-Language'), 'en');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal(response.headers.get('Content-Security-Policy'), CSP);
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
  assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=2592000');
  assert.match(await response.text(), /<html lang="en">/);
  assert.deepEqual(calls, ['/en/does-not-exist', '/en/404/']);
});

test('a normal preview page keeps preview indexing and security headers', async () => {
  const worker = createWorker({mode: 'preview', csp: CSP});
  const env = {ASSETS: {fetch: async () => new Response('<!doctype html><html lang="en">', {
    status: 200,
    headers: {'Content-Type': 'text/html'},
  })}};

  const response = await worker.fetch(new Request('https://preview.example.pages.dev/en/'), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Security-Policy'), CSP);
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal(response.headers.get('Strict-Transport-Security'), null);
});

test('an asset response keeps the explicit revalidation cache policy', async () => {
  const worker = createWorker({mode: 'production', csp: CSP});
  const env = {ASSETS: {fetch: async () => new Response(new Uint8Array([1, 2, 3]), {
    status: 200,
    headers: {'Content-Type': 'image/png'},
  })}};

  const response = await worker.fetch(new Request('https://fotosafe.weidisoft.net/assets/fotosafe-app-icon.png'), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=0, must-revalidate');
  assert.equal(response.headers.get('Content-Security-Policy'), CSP);
  assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=2592000');
});

test('an English fallback ignores validators belonging to the missing URL', async () => {
  const worker = createWorker({mode: 'production', csp: CSP});
  const fallbackValidators = [];
  const env = {ASSETS: {fetch: async input => {
    const path = new URL(input.url).pathname;
    if (path !== '/en/404/') return new Response('missing', {status: 404});
    fallbackValidators.push(input.headers.get('If-None-Match'));
    if (input.headers.has('If-None-Match')) return new Response(null, {status: 304, headers: {ETag: '"en404"'}});
    return new Response('<!doctype html><html lang="en">English fallback', {status: 200, headers: {ETag: '"en404"'}});
  }}};
  const request = new Request('https://fotosafe.weidisoft.net/en/missing', {headers: {'If-None-Match': '"en404"'}});

  const response = await worker.fetch(request, env);
  assert.equal(response.status, 404);
  assert.match(await response.text(), /English fallback/);
  assert.deepEqual(fallbackValidators, [null]);
});

test('the built worker receives the deployment mode and exact generated CSP', async () => {
  const siteDir = process.env.SITE_DIR;
  assert.ok(siteDir, 'SITE_DIR is required');
  const workerPath = resolve(siteDir, '_worker.js');
  const source = await readFile(workerPath, 'utf8');
  assert.doesNotMatch(source, /__DEPLOYMENT_MODE__|__CONTENT_SECURITY_POLICY__/);
  const builtWorker = (await import(`${pathToFileURL(workerPath).href}?test=${Date.now()}`)).default;
  const env = {ASSETS: {fetch: async () => new Response('<html>', {status: 200})}};
  const response = await builtWorker.fetch(new Request('https://fotosafe.weidisoft.net/'), env);
  const staticHeaders = await readFile(resolve(siteDir, '_headers'), 'utf8');
  const expectedCsp = staticHeaders.match(/  Content-Security-Policy: (.+)/)?.[1];
  assert.equal(response.headers.get('Content-Security-Policy'), expectedCsp);
  if (process.env.SITE_MODE === 'preview') {
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('Strict-Transport-Security'), null);
  } else {
    assert.equal(response.headers.get('X-Robots-Tag'), null);
    assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=2592000');
  }
});

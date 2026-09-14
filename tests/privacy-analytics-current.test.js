import test from 'node:test';
import assert from 'node:assert/strict';
import {ANALYTICS_CONFIG} from '../src/analytics-config.js';
import {createAnalyticsController} from '../src/privacy-analytics.js';

const accepted = () => ({
  version: ANALYTICS_CONFIG.consent.version,
  choice: 'accepted',
  decidedAt: 1_000,
  expiresAt: 1_000 + 180 * 86400000,
});

function harness({stored = null, host = 'fotosafe.weidisoft.net', signals = {}} = {}) {
  const scripts = [];
  const sent = [];
  let record = stored;
  let reloads = 0;
  const controller = createAnalyticsController(ANALYTICS_CONFIG, {
    now: () => 2_000,
    pageId: 'help',
    lang: 'de',
    location: {protocol: 'https:', hostname: host, port: ''},
    privacySignals: () => signals,
    readConsent: () => record,
    writeConsent: (value) => { record = value; },
    appendScript: (attributes) => scripts.push(attributes),
    send: (payload) => sent.push(payload),
    reloadPage: () => { reloads += 1; },
  });
  return {controller, scripts, sent, get record() { return record; }, get reloads() { return reloads; }};
}

test('undecided state makes no provider request', () => {
  const run = harness();
  assert.equal(run.controller.start(), 'needs_consent');
  assert.equal(run.scripts.length, 0);
  assert.equal(run.sent.length, 0);
});

test('rejected state remains request-free after reload', () => {
  const run = harness();
  assert.equal(run.controller.reject(), 'rejected');
  assert.equal(run.controller.start(), 'rejected');
  assert.equal(run.scripts.length, 0);
  assert.equal(run.sent.length, 0);
});

test('accepted state loads exactly one script and sends one sanitized page view', () => {
  const run = harness();
  assert.equal(run.controller.accept(), 'loading');
  assert.equal(run.scripts.length, 1);
  assert.deepEqual(run.scripts[0], {
    src: 'https://cloud.umami.is/script.js',
    'data-website-id': 'af35025a-85d6-4c77-8306-1a7619779366',
    'data-host-url': 'https://gateway.umami.is',
    'data-auto-track': 'false',
    'data-auto-pageview': 'false',
    'data-exclude-search': 'true',
    'data-exclude-hash': 'true',
    'data-do-not-track': 'true',
    onload: run.scripts[0].onload,
    onerror: run.scripts[0].onerror,
  });
  assert.equal(run.controller.markReady(), 'ready');
  assert.equal(run.controller.markReady(), 'ready');
  assert.equal(run.scripts.length, 1);
  assert.deepEqual(run.sent, [{website: ANALYTICS_CONFIG.provider.websiteId, url: '/p/help', title: 'help', referrer: ''}]);
});

test('DNT, GPC, localhost and preview hosts never load Umami', () => {
  for (const options of [
    {signals: {doNotTrack: '1'}},
    {signals: {globalPrivacyControl: true}},
    {host: 'localhost'},
    {host: 'preview.fotosafe-app.pages.dev'},
  ]) {
    const run = harness(options);
    assert.notEqual(run.controller.accept(), 'loading', JSON.stringify(options));
    assert.equal(run.scripts.length, 0);
    assert.equal(run.sent.length, 0);
  }
});

test('only allowlisted minimal events are sent and free-form URL data is rejected', () => {
  const run = harness({stored: accepted()});
  assert.equal(run.controller.start(), 'loading');
  run.controller.markReady();
  assert.equal(run.controller.track('play_store_click', {page_id: 'help', position_id: 'hero', lang: 'de'}), true);
  assert.equal(run.controller.track('support_click', {page_id: 'help', position_id: 'footer', channel_id: 'email', lang: 'de'}), true);
  assert.equal(run.controller.track('help_article_open', {article_id: 'usb_backup', lang: 'de'}), true);
  assert.equal(run.controller.track('support_click', {page_id: 'help', position_id: 'footer', channel_id: 'email', lang: 'de', url: 'https://private.test/?email=x'}), true);
  assert.equal(run.controller.track('affiliate_click', {page_id: 'help'}), false);
  assert.deepEqual(run.sent.slice(1), [
    {name: 'play_store_click', data: {page_id: 'help', position_id: 'hero', lang: 'de'}},
    {name: 'support_click', data: {page_id: 'help', position_id: 'footer', channel_id: 'email', lang: 'de'}},
    {name: 'help_article_open', data: {article_id: 'usb_backup', lang: 'de'}},
    {name: 'support_click', data: {page_id: 'help', position_id: 'footer', channel_id: 'email', lang: 'de'}},
  ]);
});

test('withdrawal reloads after activation and stops later events', () => {
  const run = harness({stored: accepted()});
  run.controller.start();
  run.controller.markReady();
  const before = run.sent.length;
  assert.equal(run.controller.withdraw(), 'rejected');
  assert.equal(run.reloads, 1);
  assert.equal(run.controller.track('support_click', {page_id: 'help', position_id: 'footer', channel_id: 'email', lang: 'de'}), false);
  assert.equal(run.sent.length, before);
});

test('blocked provider load is non-fatal and retryable', () => {
  const run = harness();
  assert.equal(run.controller.accept(), 'loading');
  assert.equal(run.controller.markLoadError(), 'load_error');
  assert.equal(run.controller.accept(), 'loading');
  assert.equal(run.scripts.length, 2);
});

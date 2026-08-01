import test from 'node:test';
import assert from 'node:assert/strict';

import {createAnalyticsController, isProviderConfigured} from '../assets/privacy-analytics.js';
import {ANALYTICS_CONFIG} from '../assets/analytics-config.js';

function configured(overrides = {}) {
  return {
    ...ANALYTICS_CONFIG,
    provider: {
      ...ANALYTICS_CONFIG.provider,
      websiteId: '123e4567-e89b-12d3-a456-426614174000',
      ...overrides,
    },
  };
}

function harness({config = configured(), stored = null, privacy = false} = {}) {
  const scripts = [];
  const sent = [];
  let reloads = 0;
  let privacyEnabled = privacy;
  let record = stored;
  const env = {
    now: () => Date.UTC(2026, 7, 1),
    pageId: 'help',
    lang: 'de',
    hostname: 'kiweidi.github.io',
    referrer: 'https://www.google.at/search?q=private',
    search: '?gclid=secret',
    privacySignals: () => ({globalPrivacyControl: privacyEnabled, doNotTrack: '0'}),
    readConsent: () => record,
    writeConsent: (value) => { record = value; },
    appendScript: (attributes) => { scripts.push(attributes); },
    send: (...args) => { sent.push(args); },
    reloadPage: () => { reloads += 1; },
  };
  return {
    controller: createAnalyticsController(config, env),
    scripts,
    sent,
    getRecord: () => record,
    getReloads: () => reloads,
    setPrivacy: (value) => { privacyEnabled = value; },
  };
}

test('provider requires an enabled HTTPS script and UUID website id', () => {
  assert.equal(isProviderConfigured(configured()), true);
  assert.equal(isProviderConfigured(configured({websiteId: ''})), false);
  assert.equal(isProviderConfigured(configured({websiteId: 'placeholder'})), false);
  assert.equal(isProviderConfigured(configured({scriptUrl: 'http://cloud.umami.is/script.js'})), false);
});

test('first visit and rejection never append the Umami script', () => {
  const {controller, scripts, getRecord} = harness();
  assert.equal(controller.start(), 'needs_consent');
  assert.equal(scripts.length, 0);

  controller.reject();
  assert.equal(getRecord().choice, 'rejected');
  assert.equal(scripts.length, 0);
  assert.equal(controller.start(), 'rejected');
});

test('acceptance loads one strictly configured script and GPC overrides it', () => {
  const allowed = harness();
  assert.equal(allowed.controller.accept(), 'loading');
  assert.equal(allowed.scripts.length, 1);
  assert.deepEqual(allowed.scripts[0], {
    src: 'https://cloud.umami.is/script.js',
    websiteId: '123e4567-e89b-12d3-a456-426614174000',
    autoTrack: 'false',
    excludeSearch: 'true',
    excludeHash: 'true',
    doNotTrack: 'true',
    beforeSend: 'fotoSafeAnalyticsBeforeSend',
  });
  assert.equal(allowed.controller.start(), 'loading');
  assert.equal(allowed.scripts.length, 1);

  const blocked = harness({privacy: true});
  assert.equal(blocked.controller.accept(), 'privacy_signal');
  assert.equal(blocked.scripts.length, 0);
});

test('events are allowlisted and only sent after provider readiness', () => {
  const {controller, sent} = harness();
  controller.accept();
  assert.equal(controller.track('support_click', {page_id: 'help', position_id: 'help_troubleshooting_email', channel_id: 'email', lang: 'de'}), false);
  controller.markReady();
  assert.equal(controller.track('support_click', {page_id: 'help', position_id: 'help_troubleshooting_email', channel_id: 'email', lang: 'de', email: 'person@example.test'}), true);
  assert.equal(controller.track('unknown_event', {url: 'https://private.test'}), false);
  assert.deepEqual(sent, [['support_click', {page_id: 'help', position_id: 'help_troubleshooting_email', channel_id: 'email', lang: 'de'}]]);
});

test('withdrawing consent reloads an active tracker but first-time rejection does not', () => {
  const active = harness();
  active.controller.accept();
  active.controller.markReady();
  active.controller.reject();
  assert.equal(active.getReloads(), 1);
  assert.equal(active.getRecord().choice, 'rejected');

  const fresh = harness();
  fresh.controller.reject();
  assert.equal(fresh.getReloads(), 0);
});

test('provider readiness is refused when consent or privacy state changes during loading', () => {
  const accepted = {
    version: ANALYTICS_CONFIG.consent.version,
    choice: 'accepted',
    decidedAt: Date.UTC(2026, 7, 1),
    expiresAt: Date.UTC(2026, 7, 1) + 86400000,
  };

  const privacyRace = harness({stored: accepted});
  assert.equal(privacyRace.controller.start(), 'loading');
  privacyRace.setPrivacy(true);
  assert.equal(privacyRace.controller.markReady(), 'privacy_signal');

  const rejectionRace = harness({stored: accepted});
  assert.equal(rejectionRace.controller.start(), 'loading');
  rejectionRace.controller.reject();
  assert.equal(rejectionRace.controller.markReady(), 'rejected');
});

test('a failed provider load can be retried without bypassing consent', () => {
  const runtime = harness();
  assert.equal(runtime.controller.accept(), 'loading');
  assert.equal(runtime.controller.markLoadError(), 'load_error');
  assert.equal(runtime.controller.accept(), 'loading');
  assert.equal(runtime.scripts.length, 2);
});

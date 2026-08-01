import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildConsentRecord,
  classifyReferrer,
  extractCampaign,
  hasPrivacySignal,
  isConsentAccepted,
  sanitizeEvent,
  sanitizePayload,
} from '../assets/privacy-analytics-core.js';

const schemas = {
  affiliate_click: {
    product_id: ['otg_adapter_01', 'usb_c_64'],
    category_id: ['otg_adapter', 'usb_c_storage'],
    lang: ['de', 'en'],
  },
};

test('consent is accepted only when version, choice and expiry are valid', () => {
  const now = Date.UTC(2026, 7, 1);
  const accepted = buildConsentRecord('accepted', 'v1', now, 180);

  assert.equal(isConsentAccepted(accepted, 'v1', now + 1), true);
  assert.equal(isConsentAccepted({...accepted, choice: 'rejected'}, 'v1', now + 1), false);
  assert.equal(isConsentAccepted(accepted, 'v2', now + 1), false);
  assert.equal(isConsentAccepted(accepted, 'v1', accepted.expiresAt + 1), false);
  assert.equal(isConsentAccepted({...accepted, expiresAt: accepted.decidedAt + (181 * 86400000)}, 'v1', now + 1), false);
  assert.equal(isConsentAccepted({...accepted, decidedAt: Number.NaN}, 'v1', now + 1), false);
});

test('GPC and DNT are treated as privacy signals', () => {
  assert.equal(hasPrivacySignal({globalPrivacyControl: true, doNotTrack: '0'}), true);
  assert.equal(hasPrivacySignal({globalPrivacyControl: false, doNotTrack: '1'}), true);
  assert.equal(hasPrivacySignal({globalPrivacyControl: false, doNotTrack: 1}), true);
  assert.equal(hasPrivacySignal({msDoNotTrack: '1'}), true);
  assert.equal(hasPrivacySignal({windowDoNotTrack: 'yes'}), true);
  assert.equal(hasPrivacySignal({globalPrivacyControl: false, doNotTrack: '0'}), false);
});

test('event sanitizing keeps only schema values and rejects URL-like data', () => {
  assert.deepEqual(
    sanitizeEvent('affiliate_click', {
      product_id: 'otg_adapter_01',
      category_id: 'otg_adapter',
      lang: 'de',
      target_url: 'https://example.test/product?email=person@example.test',
    }, schemas),
    {
      name: 'affiliate_click',
      data: {
        product_id: 'otg_adapter_01',
        category_id: 'otg_adapter',
        lang: 'de',
      },
    },
  );

  assert.equal(sanitizeEvent('unknown_event', {}, schemas), null);
  assert.equal(sanitizeEvent('affiliate_click', {product_id: 'https://evil.test'}, schemas), null);
});

test('campaign extraction only returns centrally allowed values', () => {
  const allowlist = {
    source: ['newsletter'],
    medium: ['email'],
    campaign: ['launch_de'],
  };

  assert.deepEqual(
    extractCampaign('?utm_source=newsletter&utm_medium=email&utm_campaign=launch_de&gclid=secret', allowlist),
    {campaign_source_id: 'newsletter', campaign_medium_id: 'email', campaign_id: 'launch_de'},
  );
  assert.equal(extractCampaign('?utm_source=Peter%40example.test', allowlist), null);
});

test('referrers are reduced to controlled source classes', () => {
  assert.equal(classifyReferrer('', 'kiweidi.github.io'), 'direct');
  assert.equal(classifyReferrer('https://kiweidi.github.io/fotosafe-app/hilfe.html?x=1', 'kiweidi.github.io'), 'internal');
  assert.equal(classifyReferrer('https://www.google.at/search?q=private', 'kiweidi.github.io'), 'search_google');
  assert.equal(classifyReferrer('https://unknown.example/path?email=x@y.test', 'kiweidi.github.io'), 'external_other');
});

test('before-send payload strips query, hash, raw title and raw referrer', () => {
  const payload = sanitizePayload({
    website: 'site-id',
    url: '/hilfe.html?email=person@example.test#problem',
    title: 'Visible title with user text',
    referrer: 'https://unknown.example/path?secret=1',
    name: 'faq_open',
    data: {faq_id: 'usb_not_found'},
  }, {pageId: 'help', hostname: 'kiweidi.github.io'});

  assert.deepEqual(payload, {
    website: 'site-id',
    url: '/p/help',
    title: 'help',
    referrer: 'external_other',
    name: 'faq_open',
    data: {faq_id: 'usb_not_found'},
  });
});

import test from 'node:test';
import assert from 'node:assert/strict';

import {ANALYTICS_CONFIG} from '../assets/analytics-config.js';

const requiredEvents = [
  'campaign_land',
  'help_article_view',
  'nav_click',
  'faq_open',
  'support_click',
  'play_store_click',
  'affiliate_impression',
  'affiliate_detail_open',
  'affiliate_click',
  'outbound_click',
  'scroll_depth',
  'not_found',
  'consent_accept',
];

test('analytics configuration defaults to privacy-preserving Umami settings', () => {
  assert.equal(ANALYTICS_CONFIG.provider.scriptUrl, 'https://cloud.umami.is/script.js');
  assert.equal(ANALYTICS_CONFIG.provider.autoTrack, false);
  assert.equal(ANALYTICS_CONFIG.provider.excludeSearch, true);
  assert.equal(ANALYTICS_CONFIG.provider.excludeHash, true);
  assert.equal(ANALYTICS_CONFIG.provider.doNotTrack, true);
  assert.equal(ANALYTICS_CONFIG.consent.maxAgeDays, 180);
  assert.match(ANALYTICS_CONFIG.consent.version, /^[a-z0-9_:-]+$/);
});

test('all planned browser events have an allowlist schema', () => {
  for (const event of requiredEvents) {
    assert.ok(ANALYTICS_CONFIG.events[event], `missing schema for ${event}`);
    assert.ok(Array.isArray(ANALYTICS_CONFIG.events[event].required));
    assert.ok(ANALYTICS_CONFIG.events[event].properties);
  }
  assert.equal('consent_reject' in ANALYTICS_CONFIG.events, false);
});

test('configuration never includes visible product names or affiliate target URLs', () => {
  const serialized = JSON.stringify({
    products: ANALYTICS_CONFIG.values.products,
    campaigns: ANALYTICS_CONFIG.campaigns,
    events: ANALYTICS_CONFIG.events,
  });
  assert.doesNotMatch(serialized, /https:\/\/link\.|@[a-z0-9]|UGREEN|SanDisk|Samsung Galaxy|HONOR 600/i);
});

import {ANALYTICS_CONFIG} from './analytics-config.js';
import {buildConsentRecord, hasPrivacySignal, isConsentAccepted, sanitizeEvent} from './privacy-analytics-core.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const productionHost = 'fotosafe.weidisoft.net';

export function isProviderConfigured(config = ANALYTICS_CONFIG) {
  return Boolean(config.provider.enabled && UUID.test(config.provider.websiteId)
    && /^https:\/\//.test(config.provider.scriptUrl)
    && /^https:\/\//.test(config.provider.collectionUrl));
}

export function isEligibleHost(location = globalThis.location) {
  return Boolean(location && location.protocol === 'https:' && location.hostname === productionHost
    && !location.port);
}

export function createAnalyticsController(config = ANALYTICS_CONFIG, env = {}) {
  const now = env.now || (() => Date.now());
  const readConsent = env.readConsent || (() => null);
  const writeConsent = env.writeConsent || (() => {});
  const appendScript = env.appendScript || (() => {});
  const privacySignals = env.privacySignals || (() => ({
    globalPrivacyControl: globalThis.navigator?.globalPrivacyControl === true,
    doNotTrack: globalThis.navigator?.doNotTrack || globalThis.doNotTrack,
  }));
  const location = env.location || globalThis.location;
  const pageId = env.pageId || 'home';
  const lang = env.lang || 'de';
  const send = env.send || ((payload) => globalThis.umami?.track?.(payload));
  const reloadPage = env.reloadPage || (() => globalThis.location.reload());
  let status = 'idle';
  let scriptRequested = false;
  let pageviewSent = false;

  const privacyBlocked = () => hasPrivacySignal(privacySignals());
  const consent = () => readConsent();
  const accepted = () => isConsentAccepted(consent(), config.consent.version, now());
  const eligible = () => isProviderConfigured(config) && isEligibleHost(location);
  const markReady = () => {
    if (!accepted()) { status = 'rejected'; return status; }
    if (privacyBlocked()) { status = 'privacy_signal'; return status; }
    status = 'ready';
    if (!pageviewSent) {
      pageviewSent = true;
      try { send({website: config.provider.websiteId, url: `/p/${pageId}`, title: pageId, referrer: ''}); } catch {}
    }
    return status;
  };
  const markLoadError = () => { scriptRequested = false; status = 'load_error'; return status; };
  const load = () => {
    if (!eligible()) { status = 'ineligible'; return status; }
    if (privacyBlocked()) { status = 'privacy_signal'; return status; }
    if (!accepted()) { status = consent()?.choice === 'rejected' ? 'rejected' : 'needs_consent'; return status; }
    if (status === 'ready' || status === 'loading') return status;
    status = 'loading';
    if (!scriptRequested) {
      scriptRequested = true;
      appendScript({
        src: config.provider.scriptUrl,
        'data-website-id': config.provider.websiteId,
        'data-host-url': config.provider.collectionUrl,
        'data-auto-track': 'false',
        'data-auto-pageview': 'false',
        'data-exclude-search': 'true',
        'data-exclude-hash': 'true',
        'data-do-not-track': 'true',
        onload: markReady,
        onerror: markLoadError,
      });
    }
    return status;
  };
  function track(name, data) {
    if (status !== 'ready' || privacyBlocked() || !accepted()) return false;
    const event = sanitizeEvent(name, data, config.events);
    if (!event) return false;
    try { send({name: event.name, data: event.data}); return true; } catch { return false; }
  }
  const setConsent = (choice) => {
    writeConsent(buildConsentRecord(choice, config.consent.version, now(), config.consent.maxAgeDays));
    if (choice === 'accepted') return load();
    const hadRuntime = scriptRequested || status === 'ready' || status === 'loading';
    status = 'rejected';
    if (hadRuntime) reloadPage();
    return status;
  };
  return {
    start() { return load(); },
    accept() { return setConsent('accepted'); },
    reject() { return setConsent('rejected'); },
    withdraw() { return setConsent('rejected'); },
    markReady,
    markLoadError,
    track,
    getStatus: () => status,
    isEligible: eligible,
  };
}

function browserEnvironment() {
  const root = document.documentElement;
  const body = document.body;
  const pageId = body.dataset.pageId || 'home';
  const lang = root.lang === 'en' ? 'en' : 'de';
  const storage = () => {
    try { return window.localStorage; } catch { return null; }
  };
  return {
    pageId,
    lang,
    location: window.location,
    readConsent: () => { try { return JSON.parse(storage()?.getItem(ANALYTICS_CONFIG.consent.storageKey) || 'null'); } catch { return null; } },
    writeConsent: (record) => { try { storage()?.setItem(ANALYTICS_CONFIG.consent.storageKey, JSON.stringify(record)); } catch {} },
    privacySignals: () => ({globalPrivacyControl: navigator.globalPrivacyControl === true, doNotTrack: navigator.doNotTrack || window.doNotTrack}),
    appendScript: (attributes) => {
      const script = document.createElement('script');
      for (const [key, value] of Object.entries(attributes)) {
        if (key === 'onload' || key === 'onerror') script[key] = value;
        else if (value != null) script.setAttribute(key, value);
      }
      script.async = true;
      document.head.append(script);
    },
    send: (event) => window.umami?.track(event),
    reloadPage: () => window.location.reload(),
  };
}

function isUiBlocked(controller) {
  return !controller.isEligible() || hasPrivacySignal({globalPrivacyControl: navigator.globalPrivacyControl === true, doNotTrack: navigator.doNotTrack || window.doNotTrack});
}

function showSettings(controller, trigger) {
  const panel = document.querySelector('[data-privacy-panel]');
  if (!panel) return;
  const prompt = document.querySelector('[data-privacy-prompt]');
  const blocked = isUiBlocked(controller);
  panel.dataset.returnFocus = trigger === prompt ? 'prompt' : 'settings';
  prompt && (prompt.hidden = true);
  panel.hidden = false;
  panel.querySelector('[data-privacy-allow]').hidden = blocked;
  panel.querySelector('[data-privacy-blocked]').hidden = !blocked;
  panel.querySelector('[data-privacy-reject]').hidden = blocked;
  (blocked ? panel.querySelector('[data-privacy-close]') : panel.querySelector('[data-privacy-reject]'))?.focus();
}

function closeSettings(controller) {
  const panel = document.querySelector('[data-privacy-panel]');
  const prompt = document.querySelector('[data-privacy-prompt]');
  if (!panel || panel.hidden) return;
  const returnToPrompt = panel.dataset.returnFocus === 'prompt';
  panel.hidden = true;
  if (controller.getStatus() === 'needs_consent') prompt.hidden = false;
  const target = returnToPrompt ? prompt : document.querySelector('[data-privacy-settings]');
  target?.focus();
}

function positionFor(link) {
  if (link.closest('header')) return 'nav';
  if (link.closest('footer')) return 'footer';
  if (link.closest('.support')) return 'support';
  if (link.closest('.hero')) return 'hero';
  return 'content';
}

if (typeof document !== 'undefined') {
  const controller = createAnalyticsController(ANALYTICS_CONFIG, browserEnvironment());
  const settings = document.querySelectorAll('[data-privacy-settings]');
  const panel = document.querySelector('[data-privacy-panel]');
  const prompt = document.querySelector('[data-privacy-prompt]');
  settings.forEach((button) => button.addEventListener('click', () => showSettings(controller, button)));
  prompt?.addEventListener('click', () => showSettings(controller, prompt));
  panel?.querySelector('[data-privacy-allow]')?.addEventListener('click', () => { controller.accept(); panel.hidden = true; prompt.hidden = true; });
  panel?.querySelector('[data-privacy-reject]')?.addEventListener('click', () => { controller.reject(); panel.hidden = true; prompt.hidden = true; });
  panel?.querySelector('[data-privacy-close]')?.addEventListener('click', () => closeSettings(controller));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel && !panel.hidden) { event.preventDefault(); closeSettings(controller); }
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const pageId = document.body.dataset.pageId || 'home';
    const lang = document.documentElement.lang === 'en' ? 'en' : 'de';
    if (/^https:\/\/play\.google\.com\/store\/apps\/details\?id=at\.weidi\.fotobackup$/.test(href)) {
      controller.track('play_store_click', {page_id: pageId, position_id: positionFor(link), lang});
    } else if (/^mailto:fotosafe@weidisoft\.net(?:\?|$)/i.test(href)) {
      controller.track('support_click', {page_id: pageId, position_id: positionFor(link), channel_id: 'email', lang});
    } else {
      const article = {'/android-fotos-auf-usb-stick-sichern/': 'usb_backup', '/usb-stick-fuer-android-auswaehlen/': 'usb_selection', '/foto-backup-strategie-android/': 'backup_strategy', '/en/guides/back-up-android-photos-to-usb/': 'usb_backup', '/en/guides/choose-usb-drive-for-android/': 'usb_selection', '/en/guides/android-photo-backup-strategy/': 'backup_strategy'}[new URL(href, window.location.href).pathname];
      if (article) controller.track('help_article_open', {article_id: article, lang});
    }
  }, true);
  document.querySelectorAll('details').forEach((details, index) => details.addEventListener('toggle', () => {
    if (details.open) controller.track('faq_open', {faq_id: `faq_${index + 1}`, page_id: document.body.dataset.pageId || 'home', lang: document.documentElement.lang === 'en' ? 'en' : 'de'});
  }));
  if (controller.start() === 'needs_consent' && prompt) prompt.hidden = false;
}

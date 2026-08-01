import {ANALYTICS_CONFIG} from './analytics-config.js';
import {
  buildConsentRecord,
  extractCampaign,
  hasPrivacySignal,
  isConsentAccepted,
  isConsentCurrent,
  sanitizeEvent,
  sanitizePayload,
} from './privacy-analytics-core.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isProviderConfigured(config) {
  const provider = config?.provider;
  if (!provider?.enabled || !UUID.test(provider.websiteId || '')) return false;
  try {
    return new URL(provider.scriptUrl).protocol === 'https:';
  } catch {
    return false;
  }
}

export function createAnalyticsController(config, env) {
  let state = 'idle';

  const privacyBlocked = () => hasPrivacySignal(env.privacySignals());
  const currentConsent = () => env.readConsent();

  const load = () => {
    if (privacyBlocked()) return 'privacy_signal';
    if (!isProviderConfigured(config)) return 'unavailable';
    if (state === 'loading' || state === 'ready') return state;
    state = 'loading';
    env.appendScript({
      src: config.provider.scriptUrl,
      websiteId: config.provider.websiteId,
      autoTrack: String(config.provider.autoTrack),
      excludeSearch: String(config.provider.excludeSearch),
      excludeHash: String(config.provider.excludeHash),
      doNotTrack: String(config.provider.doNotTrack),
      beforeSend: 'fotoSafeAnalyticsBeforeSend',
    });
    return state;
  };

  return {
    start() {
      if (!isProviderConfigured(config)) return 'unavailable';
      if (privacyBlocked()) return 'privacy_signal';
      const consent = currentConsent();
      if (!isConsentCurrent(consent, config.consent.version, env.now(), config.consent.maxAgeDays)) return 'needs_consent';
      if (!isConsentAccepted(consent, config.consent.version, env.now(), config.consent.maxAgeDays)) return 'rejected';
      return load();
    },
    accept() {
      env.writeConsent(buildConsentRecord('accepted', config.consent.version, env.now(), config.consent.maxAgeDays));
      return load();
    },
    reject() {
      const providerWasActive = state === 'loading' || state === 'ready';
      env.writeConsent(buildConsentRecord('rejected', config.consent.version, env.now(), config.consent.maxAgeDays));
      state = 'rejected';
      if (providerWasActive) env.reloadPage?.();
      return state;
    },
    markReady() {
      if (state === 'loading') {
        if (privacyBlocked()) state = 'privacy_signal';
        else if (!isConsentAccepted(currentConsent(), config.consent.version, env.now(), config.consent.maxAgeDays)) state = 'rejected';
        else state = 'ready';
      }
      return state;
    },
    markLoadError() {
      if (state === 'loading') state = 'load_error';
      return state;
    },
    track(name, rawData) {
      if (state !== 'ready' || privacyBlocked()) return false;
      if (!isConsentAccepted(currentConsent(), config.consent.version, env.now(), config.consent.maxAgeDays)) return false;
      const event = sanitizeEvent(name, rawData, config.events);
      if (!event) return false;
      env.send(event.name, event.data);
      return true;
    },
    getState() {
      return state;
    },
  };
}

function browserEnvironment(config, onReady, onLoadError) {
  const pageId = document.body?.dataset.pageId || '';
  const lang = document.documentElement.lang?.slice(0, 2) || 'de';
  let volatileConsent = null;

  return {
    now: () => Date.now(),
    pageId,
    lang,
    hostname: location.hostname,
    referrer: document.referrer,
    search: location.search,
    privacySignals: () => ({
      globalPrivacyControl: navigator.globalPrivacyControl === true,
      doNotTrack: navigator.doNotTrack,
      msDoNotTrack: navigator.msDoNotTrack,
      windowDoNotTrack: window.doNotTrack,
    }),
    readConsent: () => {
      try {
        const value = localStorage.getItem(config.consent.storageKey);
        return value ? JSON.parse(value) : volatileConsent;
      } catch {
        return volatileConsent;
      }
    },
    writeConsent: (record) => {
      volatileConsent = record;
      try {
        localStorage.setItem(config.consent.storageKey, JSON.stringify(record));
      } catch {
        // The decision remains valid for this page even if storage is unavailable.
      }
    },
    appendScript: (attributes) => {
      const script = document.createElement('script');
      script.src = attributes.src;
      script.async = true;
      script.dataset.websiteId = attributes.websiteId;
      script.dataset.autoTrack = attributes.autoTrack;
      script.dataset.excludeSearch = attributes.excludeSearch;
      script.dataset.excludeHash = attributes.excludeHash;
      script.dataset.doNotTrack = attributes.doNotTrack;
      script.dataset.beforeSend = attributes.beforeSend;
      script.addEventListener('load', onReady, {once: true});
      script.addEventListener('error', () => {
        script.remove();
        onLoadError();
      }, {once: true});
      document.head.append(script);
    },
    send: (name, data) => window.umami?.track(name, data),
    reloadPage: () => location.reload(),
  };
}

const CONSENT_COPY = {
  de: {
    settings: 'Datenschutz-Einstellungen', eyebrow: 'Optionale Website-Statistik', title: 'Du entscheidest.',
    description: 'Mit deiner Zustimmung hilft uns eine datensparsame Statistik, Hilfeartikel und gekennzeichnete Affiliate-Empfehlungen zu verbessern. Keine Fotos, Videos, Supporttexte oder vollständigen Ziel-URLs werden erfasst. Die FotoSafe-App bleibt trackingfrei.',
    privacySignal: 'Dein Browser sendet ein Datenschutzsignal (GPC/DNT). Statistik bleibt deshalb ausgeschaltet.',
    current: 'Aktuelle Auswahl:', accepted: 'Statistik erlaubt', rejected: 'Statistik abgelehnt', details: 'Details in der Datenschutzerklärung', deny: 'Ablehnen', accept: 'Statistik erlauben', privacyHref: 'privacy.html#websiteanalyse',
  },
  en: {
    settings: 'Privacy settings', eyebrow: 'Optional website statistics', title: 'The choice is yours.',
    description: 'With your consent, privacy-friendly statistics help us improve help articles and clearly labelled affiliate recommendations. No photos, videos, support messages or full destination URLs are collected. The FotoSafe app remains tracking-free.',
    privacySignal: 'Your browser is sending a privacy signal (GPC/DNT), so statistics remain disabled.',
    current: 'Current choice:', accepted: 'Statistics allowed', rejected: 'Statistics declined', details: 'Details in the privacy notice', deny: 'Decline', accept: 'Allow statistics', privacyHref: 'privacy.html#website-analytics',
  },
};

function localizedConsentCopy() {
  return CONSENT_COPY[document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'de'];
}

function appendSettingsButton(openSettings) {
  const footer = document.querySelector('.footer-links, footer, .footer');
  if (!footer) return null;
  const existing = footer.querySelector('.fs-privacy-settings');
  if (existing) return existing;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'fs-privacy-settings';
  button.textContent = localizedConsentCopy().settings;
  button.addEventListener('click', openSettings);
  footer.append(button);
  return button;
}

function createConsentPanel({onAccept, onReject, privacySignal, existingChoice, returnFocus}) {
  document.querySelector('.fs-consent')?.remove();
  const panel = document.createElement('section');
  panel.className = 'fs-consent';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'fs-consent-title');
  // The template contains only static application copy; the one displayed status is
  // selected by a strict accepted/rejected branch and never interpolates stored text.
  const copy = localizedConsentCopy();
  panel.innerHTML = `
    <div class="fs-consent__content">
      <div>
        <p class="fs-consent__eyebrow">${copy.eyebrow}</p>
        <h2 id="fs-consent-title">${copy.title}</h2>
        <p>${copy.description}</p>
        ${privacySignal ? `<p class="fs-consent__signal" role="status">${copy.privacySignal}</p>` : ''}
        ${existingChoice ? `<p class="fs-consent__status">${copy.current} <strong>${existingChoice === 'accepted' ? copy.accepted : copy.rejected}</strong></p>` : ''}
        <a href="${copy.privacyHref}">${copy.details}</a>
      </div>
      <div class="fs-consent__actions">
        <button class="fs-consent__reject" type="button">${copy.deny}</button>
        <button class="fs-consent__accept" type="button" ${privacySignal ? 'disabled aria-disabled="true"' : ''}>${copy.accept}</button>
      </div>
    </div>`;
  const close = (action) => {
    action();
    panel.remove();
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
  };
  panel.querySelector('.fs-consent__reject').addEventListener('click', () => close(onReject));
  panel.querySelector('.fs-consent__accept').addEventListener('click', () => close(onAccept));
  document.body.append(panel);
  panel.querySelector(privacySignal ? '.fs-consent__reject' : '.fs-consent__accept').focus({preventScroll: true});
}

function routeClass() {
  const path = location.pathname;
  if (/\/[^/]+\.html$/.test(path)) return 'root_file';
  if (path.split('/').filter(Boolean).length > 2) return 'nested_path';
  return 'unknown';
}

function installEventBindings(controller, {pageId, lang}) {
  const common = {page_id: pageId, lang};
  let refreshObservers = () => {};
  let refreshScroll = () => {};

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const product = link.closest('.product-card');
    if (product && link.classList.contains('affiliate-link')) {
      controller.track('affiliate_click', {
        product_id: product.dataset.productId,
        category_id: product.dataset.categoryId,
        position_id: product.dataset.positionId,
        evidence_id: product.dataset.evidenceId,
        cta_id: 'amazon_primary',
        ...common,
      });
      return;
    }

    if (link.dataset.destinationId) {
      controller.track('outbound_click', {
        destination_id: link.dataset.destinationId,
        destination_type: 'manufacturer',
        position_id: link.dataset.positionId,
        ...common,
      });
      return;
    }

    if (link.protocol === 'mailto:') {
      controller.track('support_click', {
        position_id: link.dataset.positionId || 'footer_support',
        channel_id: 'email',
        ...common,
      });
      return;
    }

    if (link.dataset.toPageId && link.dataset.positionId) {
      controller.track('nav_click', {
        from_page_id: pageId,
        to_page_id: link.dataset.toPageId,
        position_id: link.dataset.positionId,
        lang,
      });
    }
  });

  document.querySelectorAll('details[data-faq-id]').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (details.open) controller.track('faq_open', {faq_id: details.dataset.faqId, ...common});
    });
  });

  if ('IntersectionObserver' in window) {
    try {
      const seenArticles = new Set();
      const visibleArticles = new WeakSet();
      const articles = [...document.querySelectorAll('[data-article-id]')];
      let articleObserver;
      const recordArticle = (article) => {
        if (document.visibilityState !== 'visible' || !visibleArticles.has(article) || seenArticles.has(article)) return;
        if (controller.track('help_article_view', {article_id: article.dataset.articleId, ...common})) {
          seenArticles.add(article);
          articleObserver.unobserve(article);
        }
      };
      articleObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) visibleArticles.add(entry.target);
          else visibleArticles.delete(entry.target);
          recordArticle(entry.target);
        }
      }, {threshold: 0.5});
      articles.forEach((node) => articleObserver.observe(node));

      const seenProducts = new Set();
      const productTimers = new WeakMap();
      const visibleProducts = new WeakSet();
      const products = [...document.querySelectorAll('.product-card[data-product-id]')];
      let productObserver;
      const clearProductTimer = (product) => {
        clearTimeout(productTimers.get(product));
        productTimers.delete(product);
      };
      const scheduleProduct = (product) => {
        clearProductTimer(product);
        const key = product.dataset.productId;
        if (document.visibilityState !== 'visible' || !visibleProducts.has(product) || seenProducts.has(key)) return;
        const timer = setTimeout(() => {
          productTimers.delete(product);
          if (document.visibilityState !== 'visible' || !visibleProducts.has(product) || seenProducts.has(key)) return;
          if (controller.track('affiliate_impression', {
            product_id: key,
            category_id: product.dataset.categoryId,
            position_id: product.dataset.positionId,
            ...common,
          })) {
            seenProducts.add(key);
            visibleProducts.delete(product);
            productObserver.unobserve(product);
          }
        }, 1000);
        productTimers.set(product, timer);
      };
      productObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const product = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) visibleProducts.add(product);
          else visibleProducts.delete(product);
          scheduleProduct(product);
        }
      }, {threshold: [0, 0.5]});
      products.forEach((node) => productObserver.observe(node));
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') {
          products.forEach(clearProductTimer);
          return;
        }
        articles.forEach(recordArticle);
        products.forEach(scheduleProduct);
      });
      refreshObservers = () => {
        articles.filter((node) => !seenArticles.has(node)).forEach((node) => {
          articleObserver.unobserve(node);
          articleObserver.observe(node);
        });
        products.filter((node) => !seenProducts.has(node.dataset.productId)).forEach((node) => {
          productObserver.unobserve(node);
          productObserver.observe(node);
        });
      };
    } catch {
      // Optional metrics fail closed and never affect page functionality.
    }
  }

  const articleId = document.body.dataset.scrollArticleId;
  if (articleId) {
    const sentDepths = new Set();
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total <= 0) return;
      const percent = Math.round((scrollY / total) * 100);
      for (const depth of ['50', '90']) {
        if (percent >= Number(depth) && !sentDepths.has(depth)) {
          if (controller.track('scroll_depth', {article_id: articleId, depth, lang})) sentDepths.add(depth);
        }
      }
    };
    addEventListener('scroll', onScroll, {passive: true});
    refreshScroll = onScroll;
  }

  return () => {
    refreshObservers();
    refreshScroll();
  };
}

function initializeBrowser() {
  if (!isProviderConfigured(ANALYTICS_CONFIG)) {
    document.documentElement.dataset.analyticsState = 'unconfigured';
    return;
  }

  const pageId = document.body?.dataset.pageId || '';
  const lang = document.documentElement.lang?.slice(0, 2) || 'de';
  let acceptedNow = false;
  let controller;
  let refreshVisibilityMetrics = () => {};
  const onReady = () => {
    const readyState = controller.markReady();
    document.documentElement.dataset.analyticsState = readyState;
    if (readyState !== 'ready') return;
    window.umami?.track({
      website: ANALYTICS_CONFIG.provider.websiteId,
      hostname: location.hostname,
      language: lang,
      referrer: document.referrer,
      url: `/p/${pageId}`,
      title: pageId,
    });
    if (acceptedNow) controller.track('consent_accept', {consent_version: ANALYTICS_CONFIG.consent.version, lang});
    const campaign = extractCampaign(location.search, ANALYTICS_CONFIG.campaigns);
    if (campaign) controller.track('campaign_land', {...campaign, page_id: pageId, lang});
    if (pageId === 'not_found') controller.track('not_found', {route_class: routeClass(), lang});
    refreshVisibilityMetrics();
  };
  const onLoadError = () => {
    document.documentElement.dataset.analyticsState = controller.markLoadError();
  };
  const env = browserEnvironment(ANALYTICS_CONFIG, onReady, onLoadError);
  controller = createAnalyticsController(ANALYTICS_CONFIG, env);

  window.fotoSafeAnalyticsBeforeSend = (type, payload) => sanitizePayload(payload, {
    pageId,
    hostname: location.hostname,
    eventSchemas: ANALYTICS_CONFIG.events,
  });

  const privacySignal = hasPrivacySignal(env.privacySignals());
  let settingsButton;
  const showSettings = () => createConsentPanel({
    privacySignal,
    existingChoice: env.readConsent()?.choice || null,
    onAccept: () => { acceptedNow = true; controller.accept(); },
    onReject: () => controller.reject(),
    returnFocus: settingsButton,
  });
  settingsButton = appendSettingsButton(showSettings);
  refreshVisibilityMetrics = installEventBindings(controller, {pageId, lang});

  const status = controller.start();
  document.documentElement.dataset.analyticsState = status;
  if (status === 'needs_consent') showSettings();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeBrowser, {once: true});
  else initializeBrowser();
}

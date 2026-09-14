import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {extname, join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root = resolve(new URL('..', import.meta.url).pathname);
const siteRoot = resolve(root, process.env.SITE_DIR || 'dist/production');
const baseUrl = process.env.QA_BASE_URL || 'https://fotosafe.weidisoft.net';
const realSite = process.env.QA_REAL_SITE === '1';
const cacheBust = process.env.QA_CACHE_BUST || '';
const moduleName = process.env.PLAYWRIGHT_MODULE || 'playwright';
const {chromium} = await import(moduleName.startsWith('/') ? pathToFileURL(moduleName).href : moduleName);
const outputDir = resolve(root, process.env.QA_OUTPUT_DIR || 'reports/privacy-consent');
await mkdir(outputDir, {recursive: true});

const contentTypes = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
};

function localPath(url) {
  const parsed = new URL(url);
  let path = decodeURIComponent(parsed.pathname);
  if (path.endsWith('/')) path += 'index.html';
  return join(siteRoot, path.replace(/^\/+/, ''));
}

async function makePage(browser, {width, height, privacySignal, pagePath = '/', serveRealSite = realSite} = {}) {
  const context = await browser.newContext({viewport: {width, height}, reducedMotion: privacySignal === 'reduced' ? 'reduce' : 'no-preference'});
  const providerRequests = [];
  const pageViews = [];
  if (privacySignal === 'dnt' || privacySignal === 'gpc') {
    await context.addInitScript((signal) => {
      if (signal === 'dnt') Object.defineProperty(navigator, 'doNotTrack', {get: () => '1'});
      if (signal === 'gpc') Object.defineProperty(navigator, 'globalPrivacyControl', {get: () => true});
    }, privacySignal);
  }
  if (!serveRealSite) {
    await context.route(`${baseUrl}/**`, async (route) => {
      try {
        const file = localPath(route.request().url());
        await route.fulfill({status: 200, contentType: contentTypes[extname(file)] || 'application/octet-stream', body: await readFile(file)});
      } catch {
        await route.fulfill({status: 404, body: 'Not found'});
      }
    });
  }
  await context.route('https://cloud.umami.is/**', async (route) => {
    providerRequests.push(route.request().url());
    await route.fulfill({status: 200, contentType: 'text/javascript', body: 'window.umami={track:(payload)=>window.__qaPageViews.push(payload)};'});
  });
  await context.route('https://gateway.umami.is/**', async (route) => {
    providerRequests.push(route.request().url());
    await route.fulfill({status: 204, body: ''});
  });
  const page = await context.newPage();
  await page.addInitScript(() => { window.__qaPageViews = []; });
  page.on('pageerror', (error) => { throw error; });
  const separator = pagePath.includes('?') ? '&' : '?';
  const url = `${baseUrl}${pagePath}${cacheBust ? `${separator}qa=${encodeURIComponent(cacheBust)}` : ''}`;
  await page.goto(url, {waitUntil: 'networkidle'});
  await pageViews.push(...await page.evaluate(() => window.__qaPageViews));
  return {context, page, providerRequests, pageViews};
}

async function pillState(page) {
  return page.locator('[data-privacy-prompt]').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      hidden: element.hidden, text: element.textContent.trim(), position: style.position,
      x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
      viewport: {width: innerWidth, height: innerHeight}, active: document.activeElement === element,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      documentHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      animationDuration: style.animationDuration,
    };
  });
}

function check(condition, message, evidence) {
  if (!condition) throw new Error(`${message}: ${JSON.stringify(evidence)}`);
}

const browser = await chromium.launch({headless: true});
const report = {baseUrl, siteRoot, viewports: {}, flows: {}};
try {
  for (const width of [320, 390, 764, 1280]) {
    const height = width >= 764 ? 900 : 760;
    const run = await makePage(browser, {width, height});
    const state = await pillState(run.page);
    check(!state.hidden && state.position === 'fixed', 'pill must be fixed and visible', state);
    check(state.y >= 0 && state.y + state.height <= height, 'pill must be in viewport', state);
    check(state.width <= width - 24 && state.height >= 44, 'pill must fit and remain touchable', state);
    check(state.overflow === 0 && !state.active, 'pill must not overflow or steal focus', state);
    check(run.providerRequests.length === 0, 'provider request before consent', run.providerRequests);
    const hiddenHeight = await run.page.locator('[data-privacy-prompt]').evaluate((element) => {
      element.hidden = true;
      const height = document.documentElement.scrollHeight;
      element.hidden = false;
      return height;
    });
    check(Math.abs(hiddenHeight - state.documentHeight) <= 1, 'pill must not change document height', {visible: state.documentHeight, hidden: hiddenHeight});
    report.viewports[width] = state;
    if (width === 390 || width === 1280) {
      await run.page.waitForTimeout(350);
      await run.page.screenshot({path: join(outputDir, `pill-${width}.png`)});
    }
    await run.context.close();
  }

  const english = await makePage(browser, {width: 390, height: 844, pagePath: '/en/'});
  const englishPrompt = english.page.locator('[data-privacy-prompt]');
  check((await englishPrompt.textContent()).trim() === 'Optional statistics – choose', 'English pill copy must be localized');
  await englishPrompt.click();
  const englishCopy = {
    description: (await english.page.locator('.privacy-panel-card h2 + p').textContent()).trim(),
    reject: (await english.page.locator('[data-privacy-reject]').textContent()).trim(),
    allow: (await english.page.locator('[data-privacy-allow]').textContent()).trim(),
    privacyHref: await english.page.locator('.privacy-panel-card a').getAttribute('href'),
  };
  check(englishCopy.description.includes('No photos, videos, support text or full URLs'), 'English description must state privacy limits', englishCopy);
  check(englishCopy.reject === 'Reject' && englishCopy.allow === 'Allow statistics' && englishCopy.privacyHref === '/en/privacy/', 'English actions and privacy link must be localized', englishCopy);
  report.flows.english = englishCopy;
  await english.context.close();

  const reject = await makePage(browser, {width: 390, height: 844});
  const prompt = reject.page.locator('[data-privacy-prompt]');
  await prompt.click();
  const card = await reject.page.locator('.privacy-panel-card').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height), focus: document.activeElement?.getAttribute('data-privacy-reject') !== null};
  });
  check(card.width <= 500 && card.x >= 12, 'detail card must stay compact', card);
  check(card.focus, 'detail card must focus reject after deliberate opening', card);
  await reject.page.waitForTimeout(300);
  await reject.page.screenshot({path: join(outputDir, 'dialog-390.png')});
  await reject.page.keyboard.press('Escape');
  check(await prompt.isVisible() && await prompt.evaluate((e) => document.activeElement === e), 'Escape must restore prompt focus');
  await prompt.click();
  await reject.page.locator('[data-privacy-reject]').click();
  check(reject.providerRequests.length === 0, 'rejection must not contact provider', reject.providerRequests);
  const rejectedStorage = await reject.page.evaluate(() => localStorage.getItem('fotosafe_statistics_consent'));
  check(JSON.parse(rejectedStorage).choice === 'rejected', 'rejection must be persisted', rejectedStorage);
  await reject.page.reload({waitUntil: 'networkidle'});
  check(!(await prompt.isVisible()), 'rejected choice must suppress prompt after reload');
  report.flows.reject = {card, storage: JSON.parse(rejectedStorage), providerRequests: reject.providerRequests};
  await reject.context.close();

  const accept = await makePage(browser, {width: 1280, height: 900});
  await accept.page.locator('[data-privacy-prompt]').click();
  await accept.page.locator('[data-privacy-allow]').click();
  await accept.page.waitForTimeout(250);
  const acceptedViews = await accept.page.evaluate(() => window.__qaPageViews);
  check(accept.providerRequests.filter((url) => url.includes('script.js')).length === 1, 'acceptance must load provider script exactly once', accept.providerRequests);
  check(acceptedViews.length === 1 && acceptedViews[0].url === '/p/home' && !String(acceptedViews[0].url).includes('?'), 'accepted pageview must be one sanitized view', acceptedViews);
  check(!(await accept.page.locator('[data-privacy-prompt]').isVisible()), 'accepted choice must hide prompt');
  report.flows.accept = {providerRequests: accept.providerRequests, pageViews: acceptedViews};
  await accept.context.close();

  for (const signal of ['dnt', 'gpc']) {
    const blocked = await makePage(browser, {width: 390, height: 844, privacySignal: signal});
    check(!(await blocked.page.locator('[data-privacy-prompt]').isVisible()), `${signal} must suppress automatic prompt`);
    await blocked.page.locator('[data-privacy-settings]').click();
    const state = {
      blockedVisible: await blocked.page.locator('[data-privacy-blocked]').isVisible(),
      allowVisible: await blocked.page.locator('[data-privacy-allow]').isVisible(),
      rejectVisible: await blocked.page.locator('[data-privacy-reject]').isVisible(),
      providerRequests: blocked.providerRequests,
    };
    check(state.blockedVisible && !state.allowVisible && !state.rejectVisible && state.providerRequests.length === 0, `${signal} settings must explain disabled state`, state);
    report.flows[signal] = state;
    await blocked.context.close();
  }

  const footer = await makePage(browser, {width: 764, height: 900});
  await footer.page.evaluate(() => localStorage.setItem('fotosafe_statistics_consent', JSON.stringify({version:'fs_stats_2026_08', choice:'rejected', decidedAt:Date.now(), expiresAt:Date.now()+86400000})));
  await footer.page.reload({waitUntil: 'networkidle'});
  check(!(await footer.page.locator('[data-privacy-prompt]').isVisible()), 'stored rejection must suppress prompt before footer settings');
  await footer.page.locator('[data-privacy-settings]').click();
  check(await footer.page.locator('[data-privacy-panel]').isVisible(), 'footer settings must reopen dialog');
  await footer.page.keyboard.press('Escape');
  check(await footer.page.locator('[data-privacy-settings]').evaluate((e) => document.activeElement === e), 'Escape must restore footer focus');
  report.flows.footer = {restoredFocus: true};
  await footer.context.close();

  const reduced = await makePage(browser, {width: 390, height: 844, privacySignal: 'reduced'});
  const reducedState = await pillState(reduced.page);
  check(parseFloat(reducedState.animationDuration) <= 0.01, 'reduced motion must minimize animation', reducedState);
  report.flows.reducedMotion = {animationDuration: reducedState.animationDuration};
  await reduced.context.close();
} finally {
  await browser.close();
}

await writeFile(join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

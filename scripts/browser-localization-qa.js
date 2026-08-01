import {createServer} from 'node:http';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const cdpHttp = process.env.CDP_HTTP || 'http://127.0.0.1:9222';
const projectRoot = resolve('.');
let site = process.env.SITE_URL || '';
let localServer = null;
const outputDir = resolve('artifacts/localization-qa');
const failures = [];

if (!site) {
  const contentTypes = new Map([
    ['.css', 'text/css; charset=utf-8'], ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'], ['.jpg', 'image/jpeg'],
    ['.png', 'image/png'], ['.svg', 'image/svg+xml'], ['.webp', 'image/webp'],
  ]);
  localServer = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const filePath = resolve(projectRoot, relativePath);
      if (!filePath.startsWith(`${projectRoot}/`)) throw new Error('Invalid path');
      const extension = filePath.slice(filePath.lastIndexOf('.'));
      const content = await readFile(filePath);
      response.writeHead(200, {'content-type': contentTypes.get(extension) || 'application/octet-stream', 'cache-control': 'no-store'});
      response.end(content);
    } catch {
      response.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
      response.end('Not found');
    }
  });
  await new Promise((resolvePromise, reject) => {
    localServer.once('error', reject);
    localServer.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = localServer.address();
  site = `http://127.0.0.1:${address.port}`;
}

class CdpPage {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', ({data}) => {
      const message = JSON.parse(data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
      } else {
        this.events.push(message);
      }
    });
  }
  call(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({id, method, params}));
    return new Promise((resolvePromise, reject) => this.pending.set(id, {resolve: resolvePromise, reject}));
  }
  async evaluate(expression) {
    const result = await this.call('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async navigate(url) {
    this.events.length = 0;
    await this.call('Page.navigate', {url});
    for (let attempt = 0; attempt < 100; attempt += 1) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 50));
      const state = await this.evaluate('document.readyState');
      if (state === 'complete') return;
    }
    throw new Error(`Timed out loading ${url}`);
  }
}

async function openPage() {
  const response = await fetch(`${cdpHttp}/json/new?about:blank`, {method: 'PUT'});
  if (!response.ok) throw new Error(`Could not create CDP tab: ${response.status}`);
  const target = await response.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolvePromise, reject) => {
    ws.addEventListener('open', resolvePromise, {once: true});
    ws.addEventListener('error', reject, {once: true});
  });
  const page = new CdpPage(ws);
  await Promise.all([
    page.call('Page.enable'), page.call('Runtime.enable'), page.call('Network.enable'), page.call('Log.enable'),
  ]);
  return {page, target, close: async () => {
    ws.close();
    await fetch(`${cdpHttp}/json/close/${target.id}`);
  }};
}

function record(condition, message) {
  if (!condition) failures.push(message);
}

const computedSnapshot = `(() => {
  const selectors = ['.fs-header','.fs-nav-shell','.fs-brand','.fs-menu-toggle','.fs-nav','main','h1','.hero','.card','.btn','.site-footer','footer'];
  const properties = ['display','position','maxWidth','minHeight','marginTop','marginBottom','paddingTop','paddingRight','paddingBottom','paddingLeft','gap','fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor','borderRadius','boxShadow'];
  return Object.fromEntries(selectors.map(selector => {
    const node = document.querySelector(selector);
    if (!node) return [selector, null];
    const style = getComputedStyle(node);
    return [selector, Object.fromEntries(properties.map(property => [property, style[property]]))];
  }));
})()`;

async function setPreference(page, language) {
  await page.navigate(`${site}/index.html`);
  await page.evaluate(`(() => {
    localStorage.setItem('fotosafe.language', ${JSON.stringify(language)});
    const now = Date.now();
    localStorage.setItem('fotosafe_statistics_consent', JSON.stringify({choice: 'rejected', version: 'fs_stats_2026_08', decidedAt: now, expiresAt: now + 86400000}));
  })()`);
}

async function viewportAudit(page, path, language, width, height, screenshotName = null) {
  await setPreference(page, language);
  await page.call('Emulation.setDeviceMetricsOverride', {width, height, deviceScaleFactor: 1, mobile: width <= 480});
  await page.navigate(`${site}/${path}`);
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 100));
  await page.evaluate(`(async () => {
    for (const image of document.querySelectorAll('img[loading="lazy"]')) {
      image.loading = 'eager';
      image.scrollIntoView({block: 'center'});
      if (!image.complete) await new Promise(resolve => {
        const done = () => resolve();
        image.addEventListener('load', done, {once: true});
        image.addEventListener('error', done, {once: true});
        setTimeout(done, 2000);
      });
      await image.decode().catch(() => {});
    }
    scrollTo(0, 0);
  })()`);
  const result = await page.evaluate(`(() => ({
    href: location.href,
    lang: document.documentElement.lang,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyTextLength: document.body.innerText.length,
    menuVisible: getComputedStyle(document.querySelector('.fs-menu-toggle')).display !== 'none',
    images: [...document.images].map(img => ({src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth})),
    languageTargets: [...document.querySelectorAll('.fs-language-link')].map(link => {
      const rect = link.getBoundingClientRect();
      return {text: link.textContent.trim(), width: rect.width, height: rect.height};
    }),
    anchors: [...document.querySelectorAll('a[href]')].length,
    styles: ${computedSnapshot}
  }))()`);
  record(result.href === `${site}/${path}`, `${path} redirected unexpectedly at ${width}px: ${result.href}`);
  record(result.lang === language, `${path} has lang=${result.lang}`);
  record(result.scrollWidth === result.clientWidth, `${path} overflows at ${width}px (${result.scrollWidth}/${result.clientWidth})`);
  record(result.bodyTextLength > 100, `${path} has too little visible content at ${width}px`);
  for (const image of result.images) record(image.complete && image.naturalWidth > 0, `${path} image failed: ${image.src}`);
  for (const target of result.languageTargets) record(target.width >= 44 && target.height >= 44, `${path} language target below 44px at ${width}px: ${target.text} ${target.width}x${target.height}`);
  if (width <= 860) record(result.menuVisible, `${path} mobile menu hidden at ${width}px`);
  if (width <= 860) {
    const menu = await page.evaluate(`(() => {
      const toggle = document.querySelector('.fs-menu-toggle');
      const nav = document.querySelector('.fs-nav');
      toggle.click();
      const switcher = document.querySelector('.fs-language-switcher');
      const navRect = nav.getBoundingClientRect();
      const switcherRect = switcher.getBoundingClientRect();
      const opened = toggle.getAttribute('aria-expanded') === 'true' && getComputedStyle(nav).display !== 'none';
      const switcherInsideMenu = switcher.parentElement === nav
        && switcherRect.top >= navRect.top
        && switcherRect.bottom <= navRect.bottom;
      toggle.click();
      const switcherRestored = switcher.parentElement === document.querySelector('.fs-nav-shell');
      return {opened, switcherInsideMenu, switcherRestored, closed: toggle.getAttribute('aria-expanded') === 'false'};
    })()`);
    record(menu.opened && menu.closed, `${path} mobile menu did not open and close correctly at ${width}px`);
    record(menu.switcherInsideMenu, `${path} language switcher is outside the opened mobile menu at ${width}px`);
    record(menu.switcherRestored, `${path} language switcher was not restored after closing the mobile menu at ${width}px`);
  }
  const runtimeErrors = page.events.filter((event) => event.method === 'Runtime.exceptionThrown' || (event.method === 'Log.entryAdded' && event.params.entry.level === 'error'));
  const networkErrors = page.events.filter((event) => event.method === 'Network.responseReceived' && event.params.response.status >= 400);
  record(runtimeErrors.length === 0, `${path} console/runtime errors at ${width}px: ${runtimeErrors.length}`);
  record(networkErrors.length === 0, `${path} network errors at ${width}px: ${networkErrors.map((event) => event.params.response.url).join(', ')}`);
  if (screenshotName) {
    const metrics = await page.call('Page.getLayoutMetrics');
    const size = metrics.cssContentSize || metrics.contentSize;
    const screenshot = await page.call('Page.captureScreenshot', {
      format: 'png', fromSurface: true, captureBeyondViewport: true,
      clip: {x: 0, y: 0, width: Math.ceil(size.width), height: Math.ceil(Math.min(size.height, 30000)), scale: 1},
    });
    await writeFile(resolve(outputDir, screenshotName), Buffer.from(screenshot.data, 'base64'));
  }
  return result;
}

await mkdir(outputDir, {recursive: true});
const session = await openPage();
try {
  const {page} = session;
  await page.call('Emulation.setLocaleOverride', {locale: 'de-AT'});
  const routes = [
    ['index.html', 'de'], ['en/index.html', 'en'], ['hilfe.html', 'de'], ['en/help.html', 'en'],
    ['support.html', 'de'], ['en/support.html', 'en'], ['privacy.html', 'de'], ['en/privacy.html', 'en'],
    ['impressum.html', 'de'], ['en/imprint.html', 'en'],
  ];
  const widths = [1440, 860, 390, 320];
  const snapshots = new Map();
  for (const [path, language] of routes) {
    for (const width of widths) {
      const pageType = path.includes('help') || path.includes('hilfe') ? 'help' : 'home';
      const isComparisonPage = path === 'index.html' || path === 'en/index.html' || path === 'hilfe.html' || path === 'en/help.html';
      const screenshot = isComparisonPage && (width === 1440 || width === 390) ? `${language}-${pageType}-${width}.png` : null;
      snapshots.set(`${path}:${width}`, await viewportAudit(page, path, language, width, width === 1440 ? 1000 : 844, screenshot));
    }
  }

  for (const width of widths) {
    for (const [dePath, enPath] of [['index.html', 'en/index.html'], ['hilfe.html', 'en/help.html']]) {
      const de = snapshots.get(`${dePath}:${width}`);
      const en = snapshots.get(`${enPath}:${width}`);
      for (const selector of Object.keys(de.styles)) {
        if (de.styles[selector] && en.styles[selector]) {
          record(JSON.stringify(de.styles[selector]) === JSON.stringify(en.styles[selector]), `${dePath}/${enPath} design differs for ${selector} at ${width}px`);
        }
      }
    }
  }

  await page.call('Emulation.setDeviceMetricsOverride', {width: 390, height: 844, deviceScaleFactor: 1, mobile: true});
  await page.call('Emulation.setLocaleOverride', {locale: 'en-GB'});
  await page.call('Page.addScriptToEvaluateOnNewDocument', {source: `
    Object.defineProperty(navigator, 'language', {get: () => 'en-GB'});
    Object.defineProperty(navigator, 'languages', {get: () => ['en-GB', 'en']});
  `});
  await page.navigate(`${site}/index.html`);
  await page.evaluate("localStorage.removeItem('fotosafe.language')");
  await page.navigate(`${site}/index.html`);
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
  record((await page.evaluate('location.pathname')).endsWith('/en/index.html'), 'English browser language did not select the English home page');

  await page.evaluate("document.querySelector('a[data-language=de]').click()");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
  record((await page.evaluate('localStorage.getItem(\'fotosafe.language\')')) === 'de', 'Manual DE selection was not stored');
  record((await page.evaluate('location.pathname')).endsWith('/index.html') && !(await page.evaluate('location.pathname')).includes('/en/'), 'Manual DE selection did not open German partner');
  await page.navigate(`${site}/hilfe.html`);
  record((await page.evaluate('location.pathname')).endsWith('/hilfe.html'), 'Stored DE preference did not override English browser language');

  await page.evaluate("document.querySelector('a[data-language=en]').click()");
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
  record((await page.evaluate('localStorage.getItem(\'fotosafe.language\')')) === 'en', 'Manual EN selection was not stored');
  record((await page.evaluate('location.pathname')).endsWith('/en/help.html'), 'Manual EN selection did not open the English partner');
  await page.navigate(`${site}/support.html`);
  await new Promise((resolvePromise) => setTimeout(resolvePromise, 150));
  record((await page.evaluate('location.pathname')).endsWith('/en/support.html'), 'Stored EN preference did not redirect a German partner page');

  await page.navigate(`${site}/en/help.html`);
  record((await page.evaluate('location.pathname')).endsWith('/en/help.html'), 'Direct English URL redirected to German');

  await page.evaluate("document.querySelector('.fs-menu-toggle').focus()");
  await page.call('Input.dispatchKeyEvent', {type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13});
  await page.call('Input.dispatchKeyEvent', {type: 'char', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13});
  await page.call('Input.dispatchKeyEvent', {type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13});
  const keyboardMenu = await page.evaluate(`(() => {
    const toggle = document.querySelector('.fs-menu-toggle');
    return {focused: document.activeElement === toggle, expanded: toggle.getAttribute('aria-expanded') === 'true'};
  })()`);
  record(keyboardMenu.focused && keyboardMenu.expanded, 'Mobile menu is not keyboard operable');
  await page.call('Input.dispatchKeyEvent', {type: 'keyDown', key: 'Escape', code: 'Escape'});
  await page.call('Input.dispatchKeyEvent', {type: 'keyUp', key: 'Escape', code: 'Escape'});
  record((await page.evaluate("document.querySelector('.fs-menu-toggle').getAttribute('aria-expanded')")) === 'false', 'Escape did not close the mobile menu');

  await page.call('Emulation.setScriptExecutionDisabled', {value: true});
  await page.navigate(`${site}/en/help.html`);
  const noJs = await page.evaluate(`({text: document.body.innerText.length, links: document.querySelectorAll('nav a').length, overflow: document.documentElement.scrollWidth === document.documentElement.clientWidth})`);
  record(noJs.text > 1000 && noJs.links >= 7 && noJs.overflow, 'English help is not fully usable without JavaScript');
  await page.call('Emulation.setScriptExecutionDisabled', {value: false});
} finally {
  await session.close();
  if (localServer) await new Promise((resolvePromise) => localServer.close(resolvePromise));
}

if (failures.length) {
  console.error(`Browser localization QA failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Browser localization QA passed. Screenshots: ${outputDir}`);

#!/usr/bin/env python3
"""Small dependency-light CDP browser check for the generated site."""
import base64
import json
import os
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import websocket

CDP_HTTP = os.environ.get("CDP_HTTP", "http://127.0.0.1:9222")
BASE_URL = os.environ.get("QA_BASE_URL", "http://127.0.0.1:4173")
ROOT = Path(__file__).resolve().parents[1]
RUN_LABEL = os.environ.get("QA_RUN_LABEL", "live" if BASE_URL.startswith("https://") else "local")
REPORT = ROOT / "reports" / "screenshots" / RUN_LABEL


class Cdp:
    def __init__(self, url):
        self.ws = websocket.create_connection(
            url, timeout=15, http_proxy_host=None, suppress_origin=True
        )
        self.next_id = 0
        self.events = []

    def call(self, method, params=None):
        self.next_id += 1
        call_id = self.next_id
        self.ws.send(json.dumps({"id": call_id, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == call_id:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})
            self.events.append(msg)

    def evaluate(self, expression):
        result = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        value = result.get("result", {})
        if value.get("subtype") == "error":
            raise RuntimeError(value.get("description", "Runtime evaluation failed"))
        return value.get("value")

    def close(self):
        self.ws.close()


def browser_call(method, params=None):
    with urllib.request.urlopen(f"{CDP_HTTP}/json/version", timeout=10) as response:
        browser_ws = json.load(response)["webSocketDebuggerUrl"]
    client = Cdp(browser_ws)
    try:
        return client.call(method, params)
    finally:
        client.close()


def new_page(width, height, javascript=True):
    target = browser_call("Target.createTarget", {"url": "about:blank"})["targetId"]
    with urllib.request.urlopen(f"{CDP_HTTP}/json/list", timeout=10) as response:
        pages = json.load(response)
    page_info = next(item for item in pages if item.get("id") == target)
    page = Cdp(page_info["webSocketDebuggerUrl"])
    for domain in ("Page.enable", "Runtime.enable", "Network.enable", "Log.enable"):
        page.call(domain)
    page.call("Network.setCacheDisabled", {"cacheDisabled": True})
    page.call("Emulation.setDeviceMetricsOverride", {
        "width": width, "height": height, "deviceScaleFactor": 1, "mobile": width <= 500,
    })
    if not javascript:
        page.call("Emulation.setScriptExecutionDisabled", {"value": True})
    return target, page


def close_page(target, page):
    page.close()
    browser_call("Target.closeTarget", {"targetId": target})


def navigate(page, path):
    page.call("Page.navigate", {"url": f"{BASE_URL}{path}"})
    deadline = time.time() + 15
    while time.time() < deadline:
        if page.evaluate("document.readyState") == "complete":
            break
        time.sleep(0.1)
    else:
        raise RuntimeError(f"Timed out loading {path}")
    time.sleep(0.5)


def screenshot(page, name):
    metrics = page.call("Page.getLayoutMetrics")
    size = metrics["cssContentSize"]
    shot = page.call("Page.captureScreenshot", {
        "format": "png", "captureBeyondViewport": True,
        "clip": {"x": 0, "y": 0, "width": size["width"], "height": size["height"], "scale": 1},
    })
    REPORT.mkdir(parents=True, exist_ok=True)
    (REPORT / name).write_bytes(base64.b64decode(shot["data"]))


def assert_page(path, width, height, name, expected_lang="de"):
    target, page = new_page(width, height)
    try:
        navigate(page, path)
        page.evaluate("""(async()=>{
          document.documentElement.style.scrollBehavior='auto';
          document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager');
          scrollTo(0,document.body.scrollHeight);
          await new Promise(r=>setTimeout(r,700));
          await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>i.complete?Promise.resolve():new Promise(r=>{i.addEventListener('load',r,{once:true});i.addEventListener('error',r,{once:true})})));
          scrollTo(0,0);
        })()""")
        state = page.evaluate("""(() => ({
          title: document.title,
          lang: document.documentElement.lang,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          images: [...document.images].filter(i => i.getAttribute('src')).map(i => ({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})),
          h1: document.querySelectorAll('h1').length,
          bodySize: getComputedStyle(document.body).fontSize,
          bodyLine: getComputedStyle(document.body).lineHeight,
          consoleMarker: 'browser-check'
        }))()""")
        assert state["lang"] == expected_lang, state
        assert state["h1"] == 1, state
        assert state["overflow"] == 0, state
        assert all(image["ok"] for image in state["images"]), state
        assert int(float(state["bodySize"][:-2])) >= 16, state
        if width <= 500:
            menu = page.evaluate("""(() => {const b=document.querySelector('.menu-toggle'); b.click(); const n=document.querySelector('#site-nav'); return {expanded:b.getAttribute('aria-expanded'),visible:getComputedStyle(n).display,links:[...n.querySelectorAll('a')].map(a=>a.getBoundingClientRect().height)}})()""")
            assert menu["expanded"] == "true" and menu["visible"] != "none", menu
            assert min(menu["links"]) >= 44, menu
            page.call("Input.dispatchKeyEvent", {"type":"keyDown","key":"Escape","code":"Escape"})
            page.call("Input.dispatchKeyEvent", {"type":"keyUp","key":"Escape","code":"Escape"})
            assert page.evaluate("document.querySelector('.menu-toggle').getAttribute('aria-expanded')") == "false"
        if page.evaluate("Boolean(document.querySelector('[data-lightbox]'))"):
            opened = page.evaluate("document.querySelector('[data-lightbox]').click(); document.querySelector('.lightbox').open")
            assert opened is True
            page.evaluate("document.querySelector('.lightbox-close').click()")
        failures = [event for event in page.events if event.get("method") in {"Runtime.exceptionThrown", "Network.loadingFailed"}]
        assert not failures, failures
        page.evaluate("document.activeElement?.blur(); document.documentElement.style.scrollBehavior='auto'; scrollTo(0,0)")
        time.sleep(0.1)
        screenshot(page, name)
        return state
    finally:
        close_page(target, page)


def assert_no_js_mobile(path):
    target, page = new_page(390, 844, javascript=False)
    try:
        navigate(page, path)
        state = page.evaluate("""(() => {const b=document.querySelector('.menu-toggle'),n=document.querySelector('#site-nav');return {htmlClass:document.documentElement.className,toggle:getComputedStyle(b).display,nav:getComputedStyle(n).display,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,links:[...n.querySelectorAll('a')].map(a=>a.getBoundingClientRect().height)}})()""")
        assert "js" not in state["htmlClass"], state
        assert state["toggle"] == "none", state
        assert state["nav"] != "none", state
        assert state["overflow"] == 0, state
        assert min(state["links"]) >= 44, state
        return state
    finally:
        close_page(target, page)


def assert_home_hero(width, height, name, expected_lang="de"):
    path = "/" if expected_lang == "de" else "/en/"
    state = assert_page(path, width, height, name, expected_lang)
    target, page = new_page(width, height)
    try:
        navigate(page, path)
        trial_bottom = page.evaluate(
            "Math.round(document.querySelector('.trial-note').getBoundingClientRect().bottom)"
        )
        assert trial_bottom <= height, {
            "trialBottom": trial_bottom, "viewportHeight": height,
        }
        return {**state, "trialBottom": trial_bottom}
    finally:
        close_page(target, page)


if __name__ == "__main__":
    checks = {
        "home-de-desktop": assert_page("/", 1280, 900, "home-de-desktop.png"),
        "home-de-mobile": assert_home_hero(390, 844, "home-de-mobile.png"),
        "home-de-narrow": assert_page("/", 320, 700, "home-de-narrow.png"),
        "home-de-breakpoint-901": assert_page("/", 901, 900, "home-de-breakpoint-901.png"),
        "help-de-desktop": assert_page("/hilfe/", 1280, 900, "help-de-desktop.png"),
        "help-de-mobile": assert_page("/hilfe/", 390, 844, "help-de-mobile.png"),
        "guide-de-desktop": assert_page("/android-fotos-auf-usb-stick-sichern/", 1280, 900, "guide-de-desktop.png"),
        "guide-de-mobile": assert_page("/android-fotos-auf-usb-stick-sichern/", 390, 844, "guide-de-mobile.png"),
        "hardware-de-mobile": assert_page("/usb-stick-fuer-android-auswaehlen/", 390, 844, "hardware-de-mobile.png"),
        "hardware-de-narrow": assert_page("/usb-stick-fuer-android-auswaehlen/", 320, 700, "hardware-de-narrow.png"),
        "support-de-desktop": assert_page("/support/", 1280, 900, "support-de-desktop.png"),
        "home-en-desktop": assert_page("/en/", 1280, 900, "home-en-desktop.png", "en"),
        "home-en-mobile": assert_page("/en/", 390, 844, "home-en-mobile.png", "en"),
        "home-en-narrow": assert_page("/en/", 320, 700, "home-en-narrow.png", "en"),
        "help-en-desktop": assert_page("/en/help/", 1280, 900, "help-en-desktop.png", "en"),
        "guide-en-desktop": assert_page("/en/guides/back-up-android-photos-to-usb/", 1280, 900, "guide-en-desktop.png", "en"),
        "guide-en-mobile": assert_page("/en/guides/back-up-android-photos-to-usb/", 390, 844, "guide-en-mobile.png", "en"),
        "privacy-en-desktop": assert_page("/en/privacy/", 1280, 900, "privacy-en-desktop.png", "en"),
        "privacy-de-mobile": assert_page("/privacy/", 390, 844, "privacy-de-mobile.png"),
        "privacy-de-narrow": assert_page("/privacy/", 320, 700, "privacy-de-narrow.png"),
        "home-mobile-no-js": assert_no_js_mobile("/"),
    }
    payload = {
        "meta": {
            "baseUrl": BASE_URL,
            "auditTimeUtc": datetime.now(timezone.utc).isoformat(),
            "runLabel": RUN_LABEL,
        },
        "checks": checks,
    }
    rendered = json.dumps(payload, indent=2, ensure_ascii=False)
    if report_path := os.environ.get("QA_REPORT"):
        destination = ROOT / report_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)

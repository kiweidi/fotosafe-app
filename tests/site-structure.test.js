import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';
import {extractAssetPaths, findLocalizedAssetMismatches} from '../scripts/audit-checks.js';

const projectRoot = new URL('..', import.meta.url).pathname;
const root = resolve(projectRoot, process.env.SITE_DIR || 'dist/preview');
const expected = [
  'index.html','404.html','404/index.html','hilfe/index.html','support/index.html','privacy/index.html','impressum/index.html',
  'android-fotos-auf-usb-stick-sichern/index.html','usb-stick-fuer-android-auswaehlen/index.html','foto-backup-strategie-android/index.html',
  'en/index.html','en/404/index.html','en/help/index.html','en/support/index.html','en/privacy/index.html','en/imprint/index.html',
  'en/guides/back-up-android-photos-to-usb/index.html','en/guides/choose-usb-drive-for-android/index.html','en/guides/android-photo-backup-strategy/index.html'
];
const load = name => readFile(join(root, name), 'utf8');

async function htmlFiles(dir=root) {
  const entries = await readdir(dir,{withFileTypes:true});
  const nested = await Promise.all(entries.map(e => e.isDirectory() ? htmlFiles(join(dir,e.name)) : e.name.endsWith('.html') ? [join(dir,e.name)] : []));
  return nested.flat();
}

test('build emits the complete DE/EN route inventory', async()=>{
  const actual=(await htmlFiles()).map(p=>relative(root,p)).sort();
  assert.deepEqual(actual,expected.toSorted());
});

test('every page has one h1, language metadata, canonical and consent-gated analytics runtime', async()=>{
  for(const name of expected){
    const source=await load(name);
    const lang=name.startsWith('en/')?'en':'de';
    assert.match(source,new RegExp(`<html lang="${lang}"`),name);
    assert.equal((source.match(/<h1\b/g)||[]).length,1,`${name}: h1`);
    assert.match(source,/<title>[^<]{8,}<\/title>/,`${name}: title`);
    assert.match(source,/<meta name="description" content="[^"]{40,}"/,`${name}: description`);
    assert.match(source,/<link rel="canonical" href="https:\/\/fotosafe\.weidisoft\.net\//,`${name}: canonical`);
    assert.match(source,/<link rel="alternate" hreflang="(?:de|en)"/,`${name}: hreflang`);
    assert.doesNotMatch(source,/<script[^>]+src="https?:\/\//i,`${name}: remote script`);
    assert.equal((source.match(/<script type="module" src="\/assets\/privacy-analytics\.js\?v=[0-9a-f]{12}" defer><\/script>/g)||[]).length,1,`${name}: analytics loader`);
    assert.doesNotMatch(source,/<script[^>]+src="https?:\/\//i,`${name}: remote script tag`);
  }
});

test('indexing policy matches the explicit candidate mode',async()=>{
  const mode=process.env.SITE_MODE||'preview';
  if(mode==='preview'){
    for(const name of expected) assert.match(await load(name),/<meta name="robots" content="noindex,?\s*nofollow">/i,name);
    assert.match(await readFile(join(root,'robots.txt'),'utf8'),/Disallow: \/$/m);
    assert.match(await readFile(join(root,'_headers'),'utf8'),/X-Robots-Tag: noindex, nofollow/);
  }else{
    for(const name of expected.filter(name=>!name.includes('404'))) assert.match(await load(name),/<meta name="robots" content="index,follow">/i,name);
    for(const name of expected.filter(name=>name.includes('404'))) assert.match(await load(name),/<meta name="robots" content="noindex,?\s*nofollow">/i,name);
    assert.doesNotMatch(await readFile(join(root,'robots.txt'),'utf8'),/Disallow: \/$/m);
    assert.doesNotMatch(await readFile(join(root,'_headers'),'utf8'),/X-Robots-Tag: noindex, nofollow/);
  }
});

test('DE and EN navigation, locale pairing and touch controls are present',async()=>{
  const de=await load('index.html');
  const en=await load('en/index.html');
  assert.match(de,/href="\/en\/"[^>]*>EN</);
  assert.match(en,/href="\/"[^>]*>DE</);
  assert.match(de,/href="\/hilfe\/"/);
  assert.match(en,/href="\/en\/help\/"/);
  const css=await readFile(join(root,'assets/site.css'),'utf8');
  assert.match(css,/\.site-nav a\{[^}]*min-height:44px/);
  assert.match(css,/\.js \.menu-toggle\{display:flex\}/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('built pages use only matching locale assets across src, srcset, source and inline CSS',async()=>{
  for(const name of expected){
    const source=await load(name);
    const lang=name.startsWith('en/')?'en':'de';
    assert.deepEqual(findLocalizedAssetMismatches(lang,extractAssetPaths(source)),[],name);
  }
  const sharedCss=await readFile(join(root,'assets/site.css'),'utf8');
  const cssAssets=extractAssetPaths(sharedCss);
  assert.deepEqual(findLocalizedAssetMismatches('en',cssAssets),[],'shared CSS contains German-only assets');
  assert.deepEqual(findLocalizedAssetMismatches('de',cssAssets),[],'shared CSS contains English-only assets');
});

test('English counterparts preserve the substantive module structure',async()=>{
  const pairs=[
    ['index.html','en/index.html',9,5],
    ['android-fotos-auf-usb-stick-sichern/index.html','en/guides/back-up-android-photos-to-usb/index.html',6,0],
    ['usb-stick-fuer-android-auswaehlen/index.html','en/guides/choose-usb-drive-for-android/index.html',5,0],
    ['foto-backup-strategie-android/index.html','en/guides/android-photo-backup-strategy/index.html',5,0],
  ];
  for(const [deName,enName,minSections,minFaq] of pairs){
    const [de,en]=await Promise.all([load(deName),load(enName)]);
    assert.ok((en.match(/<section\b/g)||[]).length>=minSections,`${enName}: sections`);
    assert.ok((en.match(/<section\b/g)||[]).length>=(de.match(/<section\b/g)||[]).length-1,`${enName}: DE/EN section parity`);
    assert.ok((en.match(/<details\b/g)||[]).length>=minFaq,`${enName}: FAQ parity`);
  }
  assert.match(await load('en/guides/back-up-android-photos-to-usb/index.html'),/id="repeat"/);
  assert.match(await load('en/guides/choose-usb-drive-for-android/index.html'),/id="problems"/);
  assert.match(await load('en/guides/android-photo-backup-strategy/index.html'),/id="next"/);
});

test('aria-current marks only the actual current navigation URL',async()=>{
  const home=await load('index.html');
  assert.match(home,/href="\/" class="current-section" aria-current="page"/);
  for(const name of ['android-fotos-auf-usb-stick-sichern/index.html','usb-stick-fuer-android-auswaehlen/index.html','foto-backup-strategie-android/index.html']){
    const source=await load(name);
    assert.match(source,/href="\/hilfe\/" class="current-section"/);
    assert.doesNotMatch(source,/href="\/hilfe\/"[^>]*aria-current="page"/);
  }
  for(const name of ['en/guides/back-up-android-photos-to-usb/index.html','en/guides/choose-usb-drive-for-android/index.html','en/guides/android-photo-backup-strategy/index.html']){
    const source=await load(name);
    assert.match(source,/href="\/en\/help\/" class="current-section"/);
    assert.doesNotMatch(source,/href="\/en\/help\/"[^>]*aria-current="page"/);
  }
});

test('guides state the safety-critical workflow and use structured data',async()=>{
  const de=await load('android-fotos-auf-usb-stick-sichern/index.html');
  const en=await load('en/guides/back-up-android-photos-to-usb/index.html');
  for(const source of [de,en]){
    assert.match(source,/application\/ld\+json/);
    assert.match(source,/"@type":"Article"/);
    assert.match(source,/"@type":"BreadcrumbList"/);
    assert.match(source,/Backup|Sicherung/i);
    assert.match(source,/USB/);
  }
  assert.match(de,/Android 14/);
  assert.match(de,/Original(?:e|dateien) bleiben/);
  assert.match(en,/originals (?:stay|remain)/i);
});

test('support and privacy reflect the no-form, consent-gated analytics architecture',async()=>{
  for(const name of ['support/index.html','en/support/index.html']){
    const source=await load(name);
    assert.doesNotMatch(source,/<form\b/i);
    assert.match(source,/mailto:fotosafe@weidisoft\.net/i);
  }
  for(const name of ['privacy/index.html','en/privacy/index.html']){
    const source=await load(name);
    assert.match(source,/Cloudflare Pages/);
    assert.match(source,/privacy@weidisoft\.net/);
    assert.match(source,/Umami/i);
    assert.match(source,/explicit consent|ausdrücklicher Einwilligung/i);
    assert.match(source,/gateway\.umami\.is|cloud\.umami\.is/i);
    assert.match(source,/at\.weidi\.fotobackup/);
  }
});

test('all meaningful images have dimensions and alternative text attributes',async()=>{
  for(const name of expected){
    const source=await load(name);
    for(const image of source.matchAll(/<img\b(?=[^>]*\bsrc=)[^>]*>/g)){
      assert.match(image[0],/\balt="[^"]*"/,`${name}: alt`);
      assert.match(image[0],/\bwidth="\d+"/,`${name}: width`);
      assert.match(image[0],/\bheight="\d+"/,`${name}: height`);
    }
  }
});

test('legacy routes redirect to stable new paths',async()=>{
  const redirects=await readFile(join(root,'_redirects'),'utf8');
  for(const route of ['/hilfe.html','/privacy.html','/support.html','/impressum.html','/en/help.html','/en/privacy.html']){
    assert.match(redirects,new RegExp(`^${route.replace('.','\\.')} \\/`,'m'),route);
  }
});

test('production starts HSTS conservatively without subdomain or preload scope',async()=>{
  const headers=await readFile(join(root,'_headers'),'utf8');
  const mode=process.env.SITE_MODE||'preview';
  if(mode==='production'){
    assert.match(headers,/^  Strict-Transport-Security: max-age=2592000$/m);
    assert.doesNotMatch(headers,/Strict-Transport-Security:[^\n]*(?:includeSubDomains|preload)/i);
  }else{
    assert.doesNotMatch(headers,/Strict-Transport-Security:/i);
  }
});

test('build publishes an RFC 9116 security contact',async()=>{
  const security=await readFile(join(root,'.well-known/security.txt'),'utf8');
  assert.match(security,/^Contact: mailto:support@weidisoft\.net$/m);
  assert.match(security,/^Expires: 2027-09-01T00:00:00Z$/m);
  assert.match(security,/^Preferred-Languages: de, en$/m);
  assert.match(security,/^Canonical: https:\/\/fotosafe\.weidisoft\.net\/\.well-known\/security\.txt$/m);
});

test('project-hosted 404 remains useful in German and English without a script redirect',async()=>{
  const fallback=await load('404.html');
  assert.match(fallback,/<section[^>]+lang="de"/);
  assert.match(fallback,/<section[^>]+lang="en"/);
  assert.match(fallback,/href="\/hilfe\/"/);
  assert.match(fallback,/href="\/en\/help\/"/);
  assert.doesNotMatch(fallback,/location\.replace|path\.startsWith/);
});

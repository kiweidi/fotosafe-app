import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findLocalizedAssetMismatches,
  findMissingModules,
  findMissingLegacyFragments,
  findMissingCriticalViewports
} from '../scripts/audit-checks.js';

test('F10 negative fixture detects DE/EN mixups for every published image type and derivative', () => {
  for (const extension of ['webp', 'png', 'jpg', 'svg']) {
    assert.deepEqual(findLocalizedAssetMismatches('en', [`/assets/screen-de.${extension}`]), [`/assets/screen-de.${extension}`]);
    assert.deepEqual(findLocalizedAssetMismatches('de', [`/assets/screen-en.${extension}`]), [`/assets/screen-en.${extension}`]);
  }
  assert.deepEqual(
    findLocalizedAssetMismatches('en', [
      '/assets/01-in-drei-schritten-auf-usb-de-360.webp',
      '/assets/01-in-drei-schritten-auf-usb-de-540.webp',
      '/assets/01-three-guided-steps-to-usb-en-540.webp'
    ]),
    [
      '/assets/01-in-drei-schritten-auf-usb-de-360.webp',
      '/assets/01-in-drei-schritten-auf-usb-de-540.webp'
    ]
  );
  assert.deepEqual(findLocalizedAssetMismatches('en', ['/assets/screen-en.webp', '/assets/icons.svg']), []);
});

test('F10 extracts image assets from src, srcset, source and CSS URLs', async () => {
  const {extractAssetPaths} = await import('../scripts/audit-checks.js');
  assert.equal(typeof extractAssetPaths, 'function');
  const fixture = `
    <picture>
      <source srcset="/assets/photo-de-360.webp 360w, /assets/photo-de-540.webp 540w">
      <img src="/assets/photo-en-540.webp" srcset="/assets/photo-en.webp 1080w" alt="">
    </picture>
    <style>.hero{background-image:url('/assets/banner-de-540.webp')}</style>
  `;
  assert.deepEqual(extractAssetPaths(fixture), [
    '/assets/photo-de-360.webp',
    '/assets/photo-de-540.webp',
    '/assets/photo-en-540.webp',
    '/assets/photo-en.webp',
    '/assets/banner-de-540.webp'
  ]);
});

test('F10 negative fixture detects missing required page modules', () => {
  const fixture = '<main><section id="steps"></section></main>';
  assert.deepEqual(findMissingModules(fixture, ['steps', 'destination-folder', 'problems']), ['destination-folder', 'problems']);
});

test('F10 negative fixture detects missing legacy fragment targets', () => {
  const fixture = '<article id="anleitung"></article><article id="probleme"></article>';
  assert.deepEqual(findMissingLegacyFragments(fixture, ['anleitung', 'medienzugriff', 'probleme']), ['medienzugriff']);
});

test('F10 negative fixture detects omitted critical responsive widths', () => {
  const actual = [320, 390, 680, 768, 900, 901, 1280, 1440];
  assert.deepEqual(findMissingCriticalViewports(actual), [899]);
  assert.deepEqual(findMissingCriticalViewports([...actual, 899]), []);
});

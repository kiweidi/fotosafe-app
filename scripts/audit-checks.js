const IMAGE_EXTENSION = '(?:webp|png|jpe?g|svg)';

export function findLocalizedAssetMismatches(lang, assetPaths) {
  const opposite = lang === 'en' ? 'de' : 'en';
  const pattern = new RegExp(`-${opposite}(?:-[^./?#]+)*\\.${IMAGE_EXTENSION}(?:[?#].*)?$`, 'i');
  return assetPaths.filter((asset) => pattern.test(asset));
}

export function extractAssetPaths(source) {
  const paths = [];
  const seen = new Set();
  const add = (value) => {
    const path = value.trim();
    if (!new RegExp(`\\.${IMAGE_EXTENSION}(?:[?#].*)?$`, 'i').test(path) || seen.has(path)) return;
    seen.add(path);
    paths.push(path);
  };

  for (const match of source.matchAll(/\b(srcset|src|poster|href)\s*=\s*(["'])(.*?)\2/gi)) {
    if (match[1].toLowerCase() === 'srcset') {
      for (const candidate of match[3].split(',')) add(candidate.trim().split(/\s+/, 1)[0]);
    } else {
      add(match[3]);
    }
  }
  for (const match of source.matchAll(/\burl\(\s*(["']?)(.*?)\1\s*\)/gi)) add(match[2]);
  return paths;
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=["']${escaped}["']`).test(html);
}

export function findMissingModules(html, requiredIds) {
  return requiredIds.filter((id) => !hasId(html, id));
}

export function findMissingLegacyFragments(html, fragmentIds) {
  return fragmentIds.filter((id) => !hasId(html, id));
}

export function findMissingCriticalViewports(actual, required = [320, 390, 680, 768, 899, 900, 901, 1280, 1440]) {
  const present = new Set(actual);
  return required.filter((width) => !present.has(width));
}

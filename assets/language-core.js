export const LANGUAGE_STORAGE_KEY = 'fotosafe.language';

const ENGLISH_PARTNERS = Object.freeze({
  '': 'en/index.html',
  'index.html': 'en/index.html',
  'hilfe.html': 'en/help.html',
  'support.html': 'en/support.html',
  'privacy.html': 'en/privacy.html',
  'impressum.html': 'en/imprint.html',
  '404.html': 'en/404.html',
  'usb-stick-auswaehlen.html': 'en/select-usb-drive.html',
});

export function selectAutomaticLanguage({stored, languages = [], isEnglishRoute}) {
  if (isEnglishRoute) return null;
  if (stored === 'de' || stored === 'en') return stored;
  return String(languages[0] || '').toLowerCase().startsWith('en') ? 'en' : 'de';
}

export function englishPartnerPath(pathname, basePathname, fallbackPartner = ENGLISH_PARTNERS['']) {
  if (!basePathname) throw new TypeError('basePathname is required');
  const normalized = pathname.replace(/\/+$/, '');
  const parts = normalized.split('/');
  const file = parts.at(-1) || '';
  const baseNormalized = basePathname.replace(/\/+$/, '');
  const basePathParts = baseNormalized.split('/');
  const baseFile = basePathParts.at(-1) || '';
  const currentDirectory = file.includes('.') ? parts.slice(0, -1) : parts;
  const baseDirectory = baseFile.includes('.') ? basePathParts.slice(0, -1) : basePathParts;
  const isAtDocumentBase = currentDirectory.join('/') === baseDirectory.join('/');
  const hasPartner = Object.hasOwn(ENGLISH_PARTNERS, file) && isAtDocumentBase;
  const baseParts = hasPartner
    ? currentDirectory
    : baseDirectory;
  const partner = hasPartner ? ENGLISH_PARTNERS[file] : fallbackPartner;
  return `${baseParts.join('/')}/${partner}`.replace(/\/{2,}/g, '/');
}

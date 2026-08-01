import {LANGUAGE_STORAGE_KEY, englishPartnerPath, selectAutomaticLanguage} from './language-core.js';

function readPreference() {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return value === 'de' || value === 'en' ? value : null;
  } catch {
    return null;
  }
}

function persistPreference(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The language link still works when storage is unavailable.
  }
}

const isEnglishRoute = location.pathname.includes('/en/');
const preferredLanguage = selectAutomaticLanguage({
  stored: readPreference(),
  languages: navigator.languages?.length ? navigator.languages : [navigator.language],
  isEnglishRoute,
});

if (preferredLanguage === 'en' && !isEnglishRoute) {
  const target = new URL(location.href);
  const fallbackPartner = document.body.dataset.pageId === 'not_found' ? 'en/404.html' : undefined;
  const partner = englishPartnerPath(location.pathname, new URL(document.baseURI).pathname, fallbackPartner);
  target.pathname = partner;
  if (target.href !== location.href) location.replace(target.href);
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-language]');
  if (!link) return;
  const language = link.dataset.language;
  if (language === 'de' || language === 'en') persistPreference(language);
});

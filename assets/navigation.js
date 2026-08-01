document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.fs-header');
  const toggle = document.querySelector('.fs-menu-toggle');
  const nav = document.querySelector('.fs-nav');
  const shell = header?.querySelector('.fs-nav-shell');
  const languageSwitcher = header?.querySelector('.fs-language-switcher');
  if (!header || !toggle || !nav || !shell) return;

  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const openLabel = isEnglish ? 'Open main menu' : 'Hauptmenü öffnen';
  const closeLabel = isEnglish ? 'Close main menu' : 'Hauptmenü schließen';

  const setOpen = (open) => {
    if (languageSwitcher) {
      if (open && window.matchMedia('(max-width: 860px)').matches) nav.append(languageSwitcher);
      else shell.append(languageSwitcher);
    }
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setOpen(false);
  });
});

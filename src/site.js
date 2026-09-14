const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

if (toggle && nav) {
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

const dialog = document.querySelector('.lightbox');
const dialogImage = dialog?.querySelector('img');
const dialogClose = dialog?.querySelector('.lightbox-close');
let lightboxTrigger = null;

if (dialog && dialogImage && dialogClose && typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-lightbox]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      lightboxTrigger = link;
      const image = link.querySelector('img');
      dialogImage.src = link.href;
      dialogImage.alt = image?.alt || '';
      dialog.showModal();
      dialogClose.focus();
    });
  });
  const closeLightbox = () => dialog.close();
  dialogClose.addEventListener('click', closeLightbox);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener('close', () => lightboxTrigger?.focus());
}

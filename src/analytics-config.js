const pages = ['home', 'help', 'support', 'privacy', 'imprint', 'not_found'];
const languages = ['de', 'en'];
const articleIds = ['usb_backup', 'usb_selection', 'backup_strategy'];
const faqIds = ['faq_1', 'faq_2', 'faq_3', 'faq_4', 'faq_5', 'faq_6', 'faq_7', 'faq_8'];
const positions = ['nav', 'hero', 'footer', 'content', 'support'];

const schema = (required, properties) => ({required, properties});

export const ANALYTICS_CONFIG = Object.freeze({
  provider: Object.freeze({
    enabled: true,
    scriptUrl: 'https://cloud.umami.is/script.js',
    collectionUrl: 'https://gateway.umami.is',
    websiteId: 'af35025a-85d6-4c77-8306-1a7619779366',
    autoTrack: false,
    autoPageview: false,
    excludeSearch: true,
    excludeHash: true,
    doNotTrack: true,
  }),
  consent: Object.freeze({
    storageKey: 'fotosafe_statistics_consent',
    version: 'fs_stats_2026_08',
    maxAgeDays: 180,
  }),
  values: Object.freeze({pages, languages, articleIds, faqIds, positions}),
  events: Object.freeze({
    page_view: schema(['page_id', 'lang'], {page_id: pages, lang: languages}),
    play_store_click: schema(['page_id', 'position_id', 'lang'], {page_id: pages, position_id: positions, lang: languages}),
    support_click: schema(['page_id', 'position_id', 'channel_id', 'lang'], {page_id: pages, position_id: positions, channel_id: ['email'], lang: languages}),
    help_article_open: schema(['article_id', 'lang'], {article_id: articleIds, lang: languages}),
    faq_open: schema(['faq_id', 'page_id', 'lang'], {faq_id: faqIds, page_id: pages, lang: languages}),
  }),
});

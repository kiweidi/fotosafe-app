const pages = ['home', 'help', 'support', 'privacy', 'imprint', 'not_found', 'legacy_select'];
const languages = ['de', 'en'];
const articles = ['help_video', 'help_otg', 'help_steps', 'help_troubleshooting', 'help_selection', 'home_faq'];
const products = [
  'otg_compact_2p', 'otg_cable_15cm', 'otg_set_4p',
  'usbc_dual_64', 'usbc_dual_128', 'usbc_dual_256',
  'usba_64', 'usba_128', 'usba_256',
  'phone_a57', 'phone_s26', 'phone_honor600',
];
const categories = ['otg_adapter', 'usb_c_storage', 'usb_a_storage', 'smartphone'];
const positions = [
  'nav_home', 'nav_help', 'nav_support', 'nav_privacy', 'nav_imprint',
  'hero_help', 'hero_privacy', 'hero_support', 'footer_support', 'help_troubleshooting_email',
  'otg_01', 'otg_02', 'otg_03', 'usbc_01', 'usbc_02', 'usbc_03',
  'usba_01', 'usba_02', 'usba_03', 'phone_01', 'phone_02', 'phone_03',
];
const ctas = ['amazon_primary', 'email_primary', 'play_store_primary'];

const schema = (required, properties) => ({required, properties});

export const ANALYTICS_CONFIG = Object.freeze({
  provider: Object.freeze({
    enabled: true,
    scriptUrl: 'https://cloud.umami.is/script.js',
    websiteId: 'af35025a-85d6-4c77-8306-1a7619779366',
    autoTrack: false,
    excludeSearch: true,
    excludeHash: true,
    doNotTrack: true,
  }),
  consent: Object.freeze({
    storageKey: 'fotosafe_statistics_consent',
    version: 'fs_stats_2026_08',
    maxAgeDays: 180,
  }),
  campaigns: Object.freeze({
    source: [],
    medium: [],
    campaign: [],
  }),
  values: Object.freeze({pages, languages, articles, products, categories, positions, ctas}),
  events: Object.freeze({
    campaign_land: schema(
      ['campaign_source_id', 'campaign_medium_id', 'campaign_id', 'page_id', 'lang'],
      {campaign_source_id: [], campaign_medium_id: [], campaign_id: [], page_id: pages, lang: languages},
    ),
    help_article_view: schema(['article_id', 'page_id', 'lang'], {article_id: articles, page_id: pages, lang: languages}),
    nav_click: schema(['from_page_id', 'to_page_id', 'position_id', 'lang'], {from_page_id: pages, to_page_id: pages, position_id: positions, lang: languages}),
    faq_open: schema(['faq_id', 'page_id', 'lang'], {faq_id: ['media_access', 'usb_folder', 'data_upload', 'pricing', 'large_backup', 'hardware_failure', 'backup_strategy'], page_id: pages, lang: languages}),
    support_click: schema(['page_id', 'position_id', 'channel_id', 'lang'], {page_id: pages, position_id: positions, channel_id: ['email'], lang: languages}),
    play_store_click: schema(['page_id', 'position_id', 'cta_id', 'lang'], {page_id: pages, position_id: positions, cta_id: ctas, lang: languages}),
    affiliate_impression: schema(['product_id', 'category_id', 'position_id', 'page_id', 'lang'], {product_id: products, category_id: categories, position_id: positions, page_id: pages, lang: languages}),
    affiliate_detail_open: schema(['product_id', 'position_id', 'page_id', 'lang'], {product_id: products, position_id: positions, page_id: pages, lang: languages}),
    affiliate_click: schema(['product_id', 'category_id', 'position_id', 'page_id', 'cta_id', 'lang', 'evidence_id'], {product_id: products, category_id: categories, position_id: positions, page_id: pages, cta_id: ctas, lang: languages, evidence_id: ['tested', 'plausible', 'manufacturer']}),
    outbound_click: schema(['destination_id', 'destination_type', 'page_id', 'position_id', 'lang'], {destination_id: ['samsung_a57_specs', 'samsung_s26_specs', 'honor_600_specs'], destination_type: ['manufacturer'], page_id: pages, position_id: positions, lang: languages}),
    scroll_depth: schema(['article_id', 'depth', 'lang'], {article_id: articles, depth: ['50', '90'], lang: languages}),
    not_found: schema(['route_class', 'lang'], {route_class: ['root_file', 'nested_path', 'unknown'], lang: languages}),
    consent_accept: schema(['consent_version', 'lang'], {consent_version: ['fs_stats_2026_08'], lang: languages}),
  }),
});

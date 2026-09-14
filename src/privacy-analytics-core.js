const DAY = 86400000;

export function hasPrivacySignal(signals = {}) {
  return signals.globalPrivacyControl === true
    || signals.doNotTrack === '1' || signals.doNotTrack === 1 || signals.doNotTrack === 'yes'
    || signals.msDoNotTrack === '1' || signals.msDoNotTrack === 1
    || signals.windowDoNotTrack === '1' || signals.windowDoNotTrack === 'yes';
}

export function isConsentAccepted(record, version, now = Date.now()) {
  return Boolean(record && record.version === version && record.choice === 'accepted'
    && Number.isFinite(record.decidedAt) && Number.isFinite(record.expiresAt)
    && record.expiresAt >= now && record.expiresAt >= record.decidedAt
    && record.expiresAt - record.decidedAt <= 180 * DAY);
}

export function buildConsentRecord(choice, version, now = Date.now(), maxAgeDays = 180) {
  return {version, choice, decidedAt: now, expiresAt: now + maxAgeDays * DAY};
}

export function sanitizeEvent(name, data = {}, schemas) {
  const schema = schemas[name];
  if (!schema || !schema.required.every((key) => Object.hasOwn(data, key))) return null;
  const clean = {};
  for (const key of schema.required) {
    const allowed = schema.properties[key];
    if (!Array.isArray(allowed) || !allowed.includes(data[key])) return null;
    clean[key] = data[key];
  }
  return {name, data: clean};
}

export function sanitizePageView(pageId, lang, values) {
  return sanitizeEvent('page_view', {page_id: pageId, lang}, {
    page_view: {required: ['page_id', 'lang'], properties: {page_id: values.pages, lang: values.languages}},
  });
}

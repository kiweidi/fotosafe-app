const DAY_MS = 24 * 60 * 60 * 1000;
const SAFE_ID = /^[a-z0-9][a-z0-9_:-]{0,49}$/;

export function buildConsentRecord(choice, version, now = Date.now(), maxAgeDays = 180) {
  if (!['accepted', 'rejected'].includes(choice)) throw new TypeError('Invalid consent choice');
  if (!SAFE_ID.test(version)) throw new TypeError('Invalid consent version');

  return {
    choice,
    version,
    decidedAt: now,
    expiresAt: now + (maxAgeDays * DAY_MS),
  };
}

function hasValidConsentWindow(record, now, maxAgeDays) {
  return Number.isFinite(record?.decidedAt)
    && Number.isFinite(record?.expiresAt)
    && record.decidedAt <= now
    && record.expiresAt >= now
    && record.expiresAt > record.decidedAt
    && record.expiresAt - record.decidedAt <= maxAgeDays * DAY_MS;
}

export function isConsentAccepted(record, version, now = Date.now(), maxAgeDays = 180) {
  return Boolean(
    record
    && record.choice === 'accepted'
    && record.version === version
    && hasValidConsentWindow(record, now, maxAgeDays),
  );
}

export function isConsentCurrent(record, version, now = Date.now(), maxAgeDays = 180) {
  return Boolean(
    record
    && ['accepted', 'rejected'].includes(record.choice)
    && record.version === version
    && hasValidConsentWindow(record, now, maxAgeDays),
  );
}

export function hasPrivacySignal({
  globalPrivacyControl = false,
  doNotTrack = '0',
  msDoNotTrack = '0',
  windowDoNotTrack = '0',
} = {}) {
  const dntEnabled = [doNotTrack, msDoNotTrack, windowDoNotTrack]
    .some((value) => ['1', 'yes'].includes(String(value).toLowerCase()));
  return globalPrivacyControl === true || dntEnabled;
}

function isAllowedValue(value, allowed) {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') return false;
  const normalized = String(value);
  if (!SAFE_ID.test(normalized)) return false;
  if (Array.isArray(allowed)) return allowed.includes(normalized);
  if (allowed instanceof RegExp) return allowed.test(normalized);
  if (typeof allowed === 'function') return allowed(normalized) === true;
  return false;
}

export function sanitizeEvent(name, rawData = {}, schemas = {}) {
  if (!SAFE_ID.test(name)) return null;
  const rawSchema = schemas[name];
  if (!rawSchema || !rawData || typeof rawData !== 'object' || Array.isArray(rawData)) return null;

  const properties = rawSchema.properties || rawSchema;
  const required = rawSchema.required || Object.keys(properties);
  const data = {};

  for (const [key, allowed] of Object.entries(properties)) {
    if (!SAFE_ID.test(key) || !(key in rawData)) continue;
    if (isAllowedValue(rawData[key], allowed)) data[key] = String(rawData[key]);
  }

  if (required.some((key) => !(key in data))) return null;
  return {name, data};
}

export function extractCampaign(search, allowlist = {}) {
  const params = new URLSearchParams(search || '');
  const mapping = {
    utm_source: ['campaign_source_id', allowlist.source || []],
    utm_medium: ['campaign_medium_id', allowlist.medium || []],
    utm_campaign: ['campaign_id', allowlist.campaign || []],
  };
  const result = {};
  let found = false;

  for (const [queryKey, [outputKey, allowed]] of Object.entries(mapping)) {
    if (!params.has(queryKey)) continue;
    found = true;
    const value = params.get(queryKey) || '';
    if (!SAFE_ID.test(value) || !allowed.includes(value)) return null;
    result[outputKey] = value;
  }

  return found && Object.keys(result).length ? result : null;
}

export function classifyReferrer(referrer, ownHostname) {
  if (!referrer) return 'direct';
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host === String(ownHostname || '').toLowerCase()) return 'internal';
    if (host === 'google.com' || host.endsWith('.google.com') || /^google\.[a-z.]+$/.test(host) || host.includes('.google.')) return 'search_google';
    if (host === 'bing.com' || host.endsWith('.bing.com')) return 'search_bing';
    if (host === 'duckduckgo.com' || host.endsWith('.duckduckgo.com')) return 'search_duckduckgo';
    if (host === 'github.com' || host.endsWith('.github.com')) return 'github';
    if (host === 'facebook.com' || host.endsWith('.facebook.com')) return 'social_facebook';
    if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'social_instagram';
    if (host === 'x.com' || host.endsWith('.x.com') || host === 'twitter.com' || host.endsWith('.twitter.com')) return 'social_x';
    if (host === 'reddit.com' || host.endsWith('.reddit.com')) return 'social_reddit';
    return 'external_other';
  } catch {
    return 'external_other';
  }
}

export function sanitizePayload(payload, {pageId, hostname, eventSchemas} = {}) {
  if (!payload || typeof payload !== 'object' || !SAFE_ID.test(pageId || '')) return null;

  const sanitized = {};
  if (typeof payload.website === 'string' && payload.website.length <= 80) sanitized.website = payload.website;
  sanitized.url = `/p/${pageId}`;
  sanitized.title = pageId;
  sanitized.referrer = classifyReferrer(payload.referrer, hostname);

  if (typeof payload.hostname === 'string' && payload.hostname === hostname) sanitized.hostname = hostname;
  if (typeof payload.language === 'string' && /^[a-z]{2}(-[A-Z]{2})?$/.test(payload.language)) sanitized.language = payload.language;

  if (payload.name) {
    if (eventSchemas) {
      const event = sanitizeEvent(payload.name, payload.data || {}, eventSchemas);
      if (!event) return null;
      sanitized.name = event.name;
      sanitized.data = event.data;
    } else if (SAFE_ID.test(payload.name)) {
      sanitized.name = payload.name;
      if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        const safeData = {};
        for (const [key, value] of Object.entries(payload.data)) {
          if (SAFE_ID.test(key) && isAllowedValue(value, /^[a-z0-9][a-z0-9_:-]{0,49}$/)) safeData[key] = String(value);
        }
        if (Object.keys(safeData).length) sanitized.data = safeData;
      }
    } else {
      return null;
    }
  }

  return sanitized;
}

function securedResponse(response, {mode, csp, url}) {
  const headers = new Headers(response.headers);
  headers.set('Content-Security-Policy', csp);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (mode === 'preview') headers.set('X-Robots-Tag', 'noindex, nofollow');
  if (mode === 'production') headers.set('Strict-Transport-Security', 'max-age=2592000');
  if (url.pathname.startsWith('/assets/')) headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}

export const createWorker = ({mode, csp}) => ({
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const url = new URL(request.url);
    if (response.status !== 404 || !url.pathname.startsWith('/en/') || !['GET', 'HEAD'].includes(request.method)) {
      return securedResponse(response, {mode, csp, url});
    }

    const fallbackUrl = new URL('/en/404/', url.origin);
    const fallbackHeaders = new Headers(request.headers);
    for (const name of ['If-None-Match', 'If-Modified-Since', 'Range', 'If-Range']) fallbackHeaders.delete(name);
    const fallbackRequest = new Request(fallbackUrl, {method: request.method, headers: fallbackHeaders});
    const fallback = await env.ASSETS.fetch(fallbackRequest);
    const headers = new Headers(fallback.headers);
    headers.set('Content-Language', 'en');
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return securedResponse(new Response(request.method === 'HEAD' ? null : fallback.body, {
      status: 404,
      statusText: 'Not Found',
      headers,
    }), {mode, csp, url});
  },
});

export default createWorker({mode: '__DEPLOYMENT_MODE__', csp: '__CONTENT_SECURITY_POLICY__'});

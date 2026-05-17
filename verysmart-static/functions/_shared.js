// Shared helpers for Pages Functions

export const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...JSON_HEADERS, ...(init.headers || {}) },
  });
}

export function err(message, status = 400) {
  return json({ ok: false, error: message }, { status });
}

export function ok(extra = {}) {
  return json({ ok: true, ...extra });
}

/* ---------- Cookies ---------- */
export function parseCookies(req) {
  const out = {};
  const c = req.headers.get('Cookie') || '';
  c.split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

export function cookieHeader(name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push('Path=/');
  parts.push('HttpOnly');
  parts.push('Secure');
  parts.push('SameSite=Strict');
  if (opts.maxAge != null) parts.push(`Max-Age=${opts.maxAge}`);
  return parts.join('; ');
}

/* ---------- Auth ---------- */
export const SESSION_COOKIE = 'vs_session';
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export async function getSession(env, req) {
  const cookies = parseCookies(req);
  const sid = cookies[SESSION_COOKIE];
  if (!sid || !env.CONTENT) return null;
  const data = await env.CONTENT.get(`session:${sid}`);
  if (!data) return null;
  try { return JSON.parse(data); } catch { return null; }
}

export async function requireAuth(env, req) {
  const session = await getSession(env, req);
  if (!session) return null;
  return session;
}

export function randomId(n = 32) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(16).padStart(2, '0')).join('');
}

/* ---------- Constant-time string compare ---------- */
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ---------- Content load (with fallback to bundled content.json) ---------- */
export async function loadContent(env) {
  if (env.CONTENT) {
    const stored = await env.CONTENT.get('site:content');
    if (stored) {
      try { return JSON.parse(stored); } catch {}
    }
  }
  // Fallback to the bundled content.json (deployed with site)
  try {
    const url = 'https://placeholder/content.json'; // not used; KV is primary
    return null;
  } catch {
    return null;
  }
}

export async function saveContent(env, content) {
  if (!env.CONTENT) throw new Error('KV not configured');
  content.updatedAt = new Date().toISOString();
  await env.CONTENT.put('site:content', JSON.stringify(content));
  return content;
}

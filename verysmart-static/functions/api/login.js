// POST /api/login { password } → sets vs_session cookie, returns { ok: true }
// GET  /api/login               → returns { authed: bool }

import { json, err, cookieHeader, randomId, timingSafeEqual,
         SESSION_COOKIE, SESSION_TTL, getSession } from '../_shared.js';

export async function onRequestGet({ env, request }) {
  const session = await getSession(env, request);
  return json({ authed: !!session });
}

export async function onRequestPost({ env, request }) {
  if (!env.CONTENT)        return err('KV namespace CONTENT not bound in Cloudflare Pages.', 500);
  if (!env.ADMIN_PASSWORD) return err('ADMIN_PASSWORD secret not set in Cloudflare Pages.', 500);

  let body;
  try { body = await request.json(); } catch { return err('Invalid JSON', 400); }
  const pw = (body && body.password) || '';

  if (!timingSafeEqual(String(pw), String(env.ADMIN_PASSWORD))) {
    await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
    return err('Wrong password', 401);
  }

  const sid = randomId(24);
  const meta = {
    createdAt: Date.now(),
    ip: request.headers.get('CF-Connecting-IP') || '',
    ua: (request.headers.get('User-Agent') || '').slice(0, 200),
  };
  await env.CONTENT.put(`session:${sid}`, JSON.stringify(meta), { expirationTtl: SESSION_TTL });

  return json({ ok: true }, {
    headers: { 'Set-Cookie': cookieHeader(SESSION_COOKIE, sid, { maxAge: SESSION_TTL }) },
  });
}

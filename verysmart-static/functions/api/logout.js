import { json, parseCookies, cookieHeader, SESSION_COOKIE } from '../_shared.js';

export async function onRequestPost({ env, request }) {
  const cookies = parseCookies(request);
  const sid = cookies[SESSION_COOKIE];
  if (sid && env.CONTENT) {
    await env.CONTENT.delete(`session:${sid}`);
  }
  return json({ ok: true }, {
    headers: { 'Set-Cookie': cookieHeader(SESSION_COOKIE, '', { maxAge: 0 }) },
  });
}

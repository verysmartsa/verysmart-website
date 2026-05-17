// GET  /api/content   → public, returns current content JSON
// POST /api/content   → requires admin session, saves new content

import { json, err, ok, requireAuth, loadContent, saveContent } from '../_shared.js';

export async function onRequestGet({ env, request }) {
  let content = null;
  try { content = await loadContent(env); } catch {}
  if (!content) {
    // Fallback: redirect to static content.json bundled with site
    const url = new URL(request.url);
    url.pathname = '/content.json';
    return Response.redirect(url.toString(), 302);
  }
  return json(content, {
    headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30' },
  });
}

export async function onRequestPost({ env, request }) {
  const session = await requireAuth(env, request);
  if (!session) return err('Unauthorized', 401);

  let body;
  try { body = await request.json(); } catch { return err('Invalid JSON', 400); }
  if (!body || typeof body !== 'object') return err('Invalid body', 400);

  // Basic schema sanity (don't allow gigantic payloads)
  const size = JSON.stringify(body).length;
  if (size > 5 * 1024 * 1024) return err('Payload too large (>5MB). Use image uploads instead.', 413);

  try {
    const saved = await saveContent(env, body);
    return ok({ updatedAt: saved.updatedAt });
  } catch (e) {
    return err('Save failed: ' + e.message, 500);
  }
}

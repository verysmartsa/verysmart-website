// POST /api/upload  { name, type, dataBase64 }  → stores image in KV, returns { url }
// Strategy: store base64 PNG/JPG/WEBP (≤2MB) under "image:<id>" key.
// Site fetches via /api/image/:id (see image.js).
// For higher volume / large files, upgrade to R2 — see README.

import { json, err, requireAuth, randomId } from '../_shared.js';

const MAX_BYTES = 2 * 1024 * 1024;          // 2 MB per image (after decoding)
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

export async function onRequestPost({ env, request }) {
  const session = await requireAuth(env, request);
  if (!session) return err('Unauthorized', 401);
  if (!env.CONTENT) return err('KV not configured', 500);

  let body;
  try { body = await request.json(); } catch { return err('Invalid JSON', 400); }
  const { name = 'upload', type, dataBase64 } = body || {};
  if (!type || !ALLOWED.includes(type)) return err('Unsupported type. Use PNG/JPG/WEBP/SVG.', 400);
  if (!dataBase64 || typeof dataBase64 !== 'string') return err('Missing dataBase64', 400);

  // size estimate
  const cleaned = dataBase64.replace(/^data:[^,]+,/, '');
  const approxBytes = Math.floor(cleaned.length * 0.75);
  if (approxBytes > MAX_BYTES) return err(`Image too large (>${MAX_BYTES/1024/1024}MB). Compress first.`, 413);

  const id = randomId(12);
  const payload = JSON.stringify({ type, name: String(name).slice(0, 80), data: cleaned, createdAt: Date.now() });
  await env.CONTENT.put(`image:${id}`, payload);

  // Public URL goes through /api/image/<id>
  return json({ ok: true, id, url: `/api/image/${id}` });
}

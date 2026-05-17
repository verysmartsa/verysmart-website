// GET /api/image/:id  → serves the uploaded image (public)

export async function onRequestGet({ env, params }) {
  if (!env.CONTENT) return new Response('Not configured', { status: 500 });
  const id = (params.id || '').replace(/[^a-z0-9]/gi, '');
  if (!id) return new Response('Not found', { status: 404 });

  const raw = await env.CONTENT.get(`image:${id}`);
  if (!raw) return new Response('Not found', { status: 404 });

  let payload;
  try { payload = JSON.parse(raw); } catch { return new Response('Bad data', { status: 500 }); }

  const bytes = Uint8Array.from(atob(payload.data), c => c.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      'Content-Type': payload.type || 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Disposition': `inline; filename="${(payload.name || 'image').replace(/[^\w.\-]/g, '_')}"`,
    },
  });
}

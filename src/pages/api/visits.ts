import type { APIRoute } from 'astro';

// V2 pública por slugs (coincide con el dashboard)
const V2 = 'https://api.counterapi.dev/v2';
const WORKSPACE = 'website-visits';          // slug del workspace
const COUNTER = 'website-visits-gonzalo';  // slug del counter

const toCount = (j: any) => {
  // V2: data.{up_count, down_count}  → total = up - down
  const up = j?.data?.up_count ?? j?.up_count ?? 0;
  const down = j?.data?.down_count ?? j?.down_count ?? 0;
  const value = j?.data?.value ?? j?.value ?? j?.count;
  return typeof value === 'number' ? value : Math.max(0, up - down);
};

// GET: leer sin incrementar
export const GET: APIRoute = async () => {
  const r = await fetch(`${V2}/${WORKSPACE}/${COUNTER}`);
  const j = await r.json();
  return new Response(JSON.stringify({ count: toCount(j) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST: incrementar y devolver total
export const POST: APIRoute = async () => {
  const r = await fetch(`${V2}/${WORKSPACE}/${COUNTER}/up`);
  const j = await r.json();
  return new Response(JSON.stringify({ count: toCount(j) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

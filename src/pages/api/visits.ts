import type { APIRoute } from 'astro';

const V2 = 'https://api.counterapi.dev/v2';
const WORKSPACE = 'website-visits';          // slug del workspace
const COUNTER = 'website-visits-gonzalo';  // slug del counter

const toCount = (j: any) => {
  const up = j?.data?.up_count ?? j?.up_count ?? 0;
  const down = j?.data?.down_count ?? j?.down_count ?? 0;
  const val = j?.data?.value ?? j?.value ?? j?.count;
  return typeof val === 'number' ? val : Math.max(0, up - down);
};

export const GET: APIRoute = async ({ url }) => {
  const doUp = url.searchParams.has('up');      // si viene ?up=1 incrementamos
  const r = await fetch(`${V2}/${WORKSPACE}/${COUNTER}${doUp ? '/up' : ''}`);
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

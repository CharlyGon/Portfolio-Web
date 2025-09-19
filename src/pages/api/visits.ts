import type { APIRoute } from 'astro';

const V2 = 'https://api.counterapi.dev/v2';
const WORKSPACE = 'website-visits';
const COUNTER = 'website-visits-gonzalo';

const toCount = (j: any) => {

  const up = j?.data?.up_count ?? j?.up_count ?? 0;
  const down = j?.data?.down_count ?? j?.down_count ?? 0;
  const value = j?.data?.value ?? j?.value ?? j?.count;
  return typeof value === 'number' ? value : Math.max(0, up - down);
};


export const GET: APIRoute = async () => {
  const r = await fetch(`${V2}/${WORKSPACE}/${COUNTER}`);
  const j = await r.json();
  return new Response(JSON.stringify({ count: toCount(j) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};


export const POST: APIRoute = async () => {

  const r = await fetch(`${V2}/${WORKSPACE}/${COUNTER}/up`);
  const j = await r.json();
  return new Response(JSON.stringify({ count: toCount(j) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

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

const noCache = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Netlify-CDN-Cache-Control': 'no-store',
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const doUp = url.searchParams.has('up');           // ?up=1 → suma
    const res = await fetch(`${V2}/${WORKSPACE}/${COUNTER}${doUp ? '/up' : ''}`);
    if (!res.ok) throw new Error(`counterapi ${res.status}`);
    const json = await res.json();
    return new Response(JSON.stringify({ count: toCount(json) }), { headers: noCache });
  } catch (e: any) {
    return new Response(JSON.stringify({ count: 0, error: e?.message || 'error' }), {
      headers: noCache,
      status: 200,
    });
  }
};

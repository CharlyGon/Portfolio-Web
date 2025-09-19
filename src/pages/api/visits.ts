import type { APIRoute } from 'astro';
import { Counter } from 'counterapi';

const counter = new Counter({
  workspace: 'website-visits',
  timeout: 5000,
  debug: true,
});

const SLUG = 'website-visits-gonzalo';

const toCount = (obj: any) => {
  const up = obj?.data?.up_count ?? obj?.up_count ?? 0;
  const down = obj?.data?.down_count ?? obj?.down_count ?? 0;
  const value = obj?.value ?? obj?.count; // por si alguna versión lo trae
  return typeof value === 'number' ? value : Math.max(0, up - down);
};

export const GET: APIRoute = async () => {
  const res = await counter.get(SLUG);
  return new Response(JSON.stringify({ count: toCount(res) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async () => {
  const inc = await counter.up(SLUG);

  return new Response(JSON.stringify({ count: toCount(inc) }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

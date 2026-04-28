// In-memory per-IP token bucket. NOTE: not shared between serverless instances.
// In multi-instance / Vercel production, swap for Upstash (@upstash/ratelimit) or
// a Redis-backed store. The shape of `rateLimit()` is designed so the call sites
// (login, contact) don't need to change when that swap happens.

type Bucket = { count: number; reset: number };
const stores = new Map<string, Map<string, Bucket>>();

export function rateLimit(
  key: string,
  ip: string,
  max: number,
  windowMs: number
): boolean {
  let store = stores.get(key);
  if (!store) {
    store = new Map<string, Bucket>();
    stores.set(key, store);
  }
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || entry.reset < now) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= max;
}

// `x-real-ip` is injected by Vercel/trusted proxies and not spoofable by the
// client. `x-forwarded-for` is a fallback for other deployments.
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

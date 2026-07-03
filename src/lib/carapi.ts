// Thin server-side proxy client for CarAPI (carapi.app).
// Keeps the token/secret off the client and caches the JWT per serverless
// instance (cheap in-memory cache; safe to lose on cold start — we just
// re-authenticate). Swap this for Vercel KV later if request volume grows.

const CARAPI_BASE = "https://carapi.app/api";

let cachedJwt: { token: string; expiresAt: number } | null = null;

async function getJwt(): Promise<string> {
  if (cachedJwt && cachedJwt.expiresAt > Date.now()) return cachedJwt.token;

  const res = await fetch(`${CARAPI_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_token: process.env.CARAPI_TOKEN,
      api_secret: process.env.CARAPI_SECRET,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`CarAPI auth failed: ${res.status}`);
  const token = (await res.text()).replace(/^"|"$/g, "");
  // JWTs from CarAPI are typically valid ~24h; refresh a little early.
  cachedJwt = { token, expiresAt: Date.now() + 1000 * 60 * 60 * 12 };
  return token;
}

export async function carapiFetch(path: string, searchParams?: Record<string, string | number | undefined>) {
  const jwt = await getJwt();
  const url = new URL(`${CARAPI_BASE}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${jwt}` },
    // CarAPI catalog data changes rarely — cache at the edge for an hour.
    next: { revalidate: 3600 },
  });

  if (res.status === 401) {
    // Token expired/invalid server-side — force one retry with a fresh login.
    cachedJwt = null;
    const jwt2 = await getJwt();
    const retry = await fetch(url.toString(), { headers: { Authorization: `Bearer ${jwt2}` } });
    if (!retry.ok) throw new Error(`CarAPI request failed: ${retry.status}`);
    return retry.json();
  }

  if (!res.ok) throw new Error(`CarAPI request failed: ${res.status}`);
  return res.json();
}

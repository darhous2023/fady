// Scrapes real rendered pages on the live site and HEAD-checks a sample of
// the actual <img> URLs they contain -- catches a hotlinked manufacturer
// photo going dead (404, DNS failure, hotlink-protection block) without
// needing any database credentials in CI: every URL checked here is one a
// real visitor's browser would already be loading anyway.
// Usage: npx tsx scripts/image-url-health-check.ts [baseUrl]
export {};

const BASE = process.argv[2] || "https://fady-delta.vercel.app";
const MAX_IMAGES_PER_PAGE = 15;
const MAX_TOTAL_CHECKS = 80;
const CONCURRENCY = 8;

// A representative spread: a few new-cars brand pages (external, hotlinked
// manufacturer photos -- the class of URL that broke before Station 8's
// cars-catalog image adoption) plus the used-cars gateway (Supabase-hosted,
// under our own control, but still worth catching a storage misconfiguration).
const PAGES = [
  "/new/browse",
  "/new/browse?brand=Toyota",
  "/new/browse?brand=GMC",
  "/new/browse?brand=Hyundai",
  "/used",
];

function extractImageUrls(html: string): string[] {
  const urls = new Set<string>();
  const re = /<img[^>]+src="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const src = m[1];
    if (src.startsWith("http") && !src.includes("/_next/")) urls.add(src);
  }
  return Array.from(urls);
}

async function checkUrl(url: string): Promise<{ url: string; ok: boolean; status: number }> {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    // Some CDNs/sites reject HEAD; fall back to a real GET before declaring failure.
    if (!res.ok && res.status !== 405) return { url, ok: res.ok, status: res.status };
    if (res.status === 405) {
      const getRes = await fetch(url, { method: "GET", redirect: "follow" });
      return { url, ok: getRes.ok, status: getRes.status };
    }
    return { url, ok: true, status: res.status };
  } catch {
    return { url, ok: false, status: 0 };
  }
}

async function runPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.log(`Image URL health check against ${BASE}\n`);

  const allUrls = new Set<string>();
  for (const page of PAGES) {
    try {
      const res = await fetch(BASE + page);
      if (!res.ok) {
        console.log(`FAIL  ${res.status}  ${page} (page itself failed to load)`);
        continue;
      }
      const html = await res.text();
      const imgs = extractImageUrls(html).slice(0, MAX_IMAGES_PER_PAGE);
      console.log(`OK    ${res.status}  ${page} (${imgs.length} image URLs found)`);
      imgs.forEach((u) => allUrls.add(u));
    } catch (err) {
      console.log(`FAIL  ERR   ${page} (${(err as Error).message})`);
    }
  }

  const sample = Array.from(allUrls).slice(0, MAX_TOTAL_CHECKS);
  console.log(`\nChecking ${sample.length} unique image URLs (sampled)...\n`);

  const results = await runPool(sample, CONCURRENCY, checkUrl);

  let failures = 0;
  for (const r of results) {
    if (!r.ok) {
      failures++;
      console.log(`FAIL  ${r.status}  ${r.url}`);
    }
  }

  console.log(`\n${results.length - failures}/${results.length} image URLs OK.`);
  if (allUrls.size === 0) {
    console.error("No image URLs found at all -- pages may be broken independent of image health.");
    process.exit(1);
  }
  if (failures > 0) {
    console.error(`${failures} image URL(s) failed.`);
    process.exit(1);
  }
}

main();

// Controlled, read-only load test against a live deployment. Deliberately
// modest (30 concurrent requests x 3 waves on real, cheap-to-render GET
// routes) — this is a real production business site with a real Postgres
// connection pool behind it (see EMAXCONNSESSION history in .ai/DECISIONS.md),
// not a synthetic environment to hammer. The goal is proving the fixed
// connection pool (transaction-mode pooler, port 6543) holds up under
// realistic concurrent traffic, not simulating a DoS.
// Usage: npx tsx scripts/load-test.ts [baseUrl] [concurrency] [waves]

export {};

const BASE = process.argv[2] || "https://fady-delta.vercel.app";
const CONCURRENCY = Number(process.argv[3] || 30);
const WAVES = Number(process.argv[4] || 3);

const ROUTES = ["/", "/used", "/new", "/new/browse", "/api/store-config", "/api/products"];

async function timedFetch(path: string): Promise<{ path: string; status: number; ms: number }> {
  const start = Date.now();
  try {
    const res = await fetch(BASE + path);
    return { path, status: res.status, ms: Date.now() - start };
  } catch {
    return { path, status: 0, ms: Date.now() - start };
  }
}

async function wave(n: number) {
  const requests = Array.from({ length: CONCURRENCY }, (_, i) => ROUTES[i % ROUTES.length]);
  const start = Date.now();
  const results = await Promise.all(requests.map(timedFetch));
  const elapsed = Date.now() - start;

  const ok = results.filter((r) => r.status === 200).length;
  const failed = results.filter((r) => r.status !== 200);
  const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);
  const maxMs = Math.max(...results.map((r) => r.ms));

  console.log(`Wave ${n}: ${ok}/${results.length} OK, avg ${avgMs}ms, max ${maxMs}ms, wall time ${elapsed}ms`);
  if (failed.length > 0) {
    for (const f of failed) console.log(`  FAIL ${f.status || "ERR"}  ${f.path}`);
  }
  return failed.length === 0;
}

async function main() {
  console.log(`Load test: ${CONCURRENCY} concurrent requests x ${WAVES} waves against ${BASE}\n`);
  let allOk = true;
  for (let i = 1; i <= WAVES; i++) {
    const ok = await wave(i);
    allOk = allOk && ok;
  }
  console.log(allOk ? "\nAll waves completed with zero failed requests." : "\nSome requests failed — investigate before considering this a pass.");
  process.exit(allOk ? 0 : 1);
}

main();

// Creates or deletes a throwaway Neon branch for isolated E2E test runs, off
// either of two Neon projects:
//   cars   -> fady-cars-catalog (late-rain-30574215) -- real cars-catalog
//             data, copy-on-write, zero impact on the real CARS_DATABASE_URL.
//   store  -> fady-store-test-harness (super-fire-42038483) -- a dedicated,
//             persistent-but-empty Neon project created solely to serve as a
//             branch-off template for the store's own schema (the store's
//             real production DB lives on Supabase, not Neon, so this is a
//             fresh project, not a clone of production data). Each branch
//             gets Drizzle migrations + better-auth-schema.sql applied fresh
//             by the CI workflow after creation.
//
// Usage:
//   npx tsx scripts/test-env-neon-branch.ts create <cars|store> <branch-name>
//   npx tsx scripts/test-env-neon-branch.ts delete <cars|store> <branch-name>
//
// "create" prints CARS_DATABASE_URL=... or DATABASE_URL=... (matching which
// project) on its own line so a CI step can capture it with `>> $GITHUB_ENV`.
import { config } from "dotenv";
config({ path: ".env.local" });

const PROJECTS = {
  cars: { id: "late-rain-30574215", envVar: "CARS_DATABASE_URL" },
  store: { id: "super-fire-42038483", envVar: "DATABASE_URL" },
} as const;
type ProjectKey = keyof typeof PROJECTS;

const API_BASE = "https://console.neon.tech/api/v2";

function apiKey(): string {
  const key = process.env.NEON_API_KEY;
  if (!key) throw new Error("NEON_API_KEY is not set");
  return key;
}

async function neonFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Neon API ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

async function findBranchByName(projectId: string, name: string) {
  const data = await neonFetch(`/projects/${projectId}/branches`);
  const branches = (data as { branches: { id: string; name: string }[] }).branches ?? [];
  return branches.find(b => b.name === name);
}

async function create(projectKey: ProjectKey, name: string) {
  const { id: projectId, envVar } = PROJECTS[projectKey];
  const existing = await findBranchByName(projectId, name);
  if (existing) {
    console.log(`Branch "${name}" already exists (${existing.id}) -- reusing it.`);
  }

  const data = existing
    ? { branch: existing }
    : await neonFetch(`/projects/${projectId}/branches`, {
        method: "POST",
        // endpoints: auto-provision a read-write compute so the branch is
        // actually connectable -- a branch with no endpoint has no way to
        // serve a connection_uri (this is what failed the first time).
        body: JSON.stringify({ branch: { name }, endpoints: [{ type: "read_write" }] }),
      });

  const branch = (data as { branch: { id: string } }).branch;

  // Fetch (or create) a role + the connection URI for the new branch.
  const rolesData = await neonFetch(`/projects/${projectId}/branches/${branch.id}/roles`);
  const roles = (rolesData as { roles: { name: string }[] }).roles ?? [];
  const roleName = roles[0]?.name;
  if (!roleName) throw new Error("No roles found on the source project to reuse for the test branch");

  const dbsData = await neonFetch(`/projects/${projectId}/branches/${branch.id}/databases`);
  const databases = (dbsData as { databases: { name: string }[] }).databases ?? [];
  const dbName = databases[0]?.name;
  if (!dbName) throw new Error("No databases found on the test branch");

  const connData = await neonFetch(
    `/projects/${projectId}/connection_uri?branch_id=${branch.id}&database_name=${encodeURIComponent(dbName)}&role_name=${encodeURIComponent(roleName)}&pooled=true`,
  );
  const uri = (connData as { uri: string }).uri;

  if (!existing) {
    // A freshly-provisioned endpoint can take a few seconds to actually
    // accept connections (cold start) -- a flat sleep here isn't reliable
    // (confirmed: 5s wasn't always enough in CI). Confirmed via two failed CI
    // runs that this isn't just about the endpoint being "up": a `pg.Client`
    // probe succeeding is not proof `postgres-js` (the library the app and
    // seed scripts actually use, via src/lib/db/drizzle/connection.ts and
    // src/lib/cars/db.ts) can connect too -- the first run's "Bootstrap"
    // step (pg.Client) succeeded while the very next step ("Seed", via
    // postgres-js) got ECONNREFUSED against the same still-warming-up
    // endpoint moments later. Probe with the SAME library the real consumers
    // use, not just any Postgres client.
    await waitUntilConnectable(uri);
  }

  console.log(`Neon test branch ready: ${name} (${branch.id})`);
  console.log(`${envVar}=${uri}`);
}

async function waitUntilConnectable(connectionString: string, maxAttempts = 15) {
  const postgres = (await import("postgres")).default;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const sql = postgres(connectionString, { max: 1, prepare: false, connect_timeout: 5 });
    try {
      await sql`SELECT 1`;
      await sql.end();
      return;
    } catch {
      await sql.end({ timeout: 1 }).catch(() => {});
      if (attempt === maxAttempts) {
        throw new Error(`Endpoint did not become connectable after ${maxAttempts} attempts`);
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function del(projectKey: ProjectKey, name: string) {
  const { id: projectId } = PROJECTS[projectKey];
  const existing = await findBranchByName(projectId, name);
  if (!existing) {
    console.log(`Branch "${name}" not found -- nothing to delete.`);
    return;
  }
  await neonFetch(`/projects/${projectId}/branches/${existing.id}`, { method: "DELETE" });
  console.log(`Deleted Neon test branch: ${name} (${existing.id})`);
}

async function main() {
  const [, , action, projectKey, branchName] = process.argv;
  if (!action || !projectKey || !branchName || !["create", "delete"].includes(action) || !(projectKey in PROJECTS)) {
    console.error("Usage: tsx scripts/test-env-neon-branch.ts <create|delete> <cars|store> <branch-name>");
    process.exit(1);
  }
  if (action === "create") await create(projectKey as ProjectKey, branchName);
  else await del(projectKey as ProjectKey, branchName);
}

main().catch(e => {
  console.error("FAILED:", e);
  process.exit(1);
});

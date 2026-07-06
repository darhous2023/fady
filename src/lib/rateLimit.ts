import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db/drizzle/connection";
import { settings } from "@/lib/db/drizzle/schema";
import { inArray } from "drizzle-orm";

// Real limits live in Upstash Redis only -- deliberately NOT an in-memory
// pre-layer, since Vercel serverless instances don't share memory (a
// per-instance in-memory counter would let a caller bypass the limit just
// by landing on a different cold instance). `@vercel/kv` is a leftover,
// never-configured dependency from the original template (confirmed
// elsewhere in this codebase) -- this is a fresh, dedicated Upstash Redis
// database, not a reuse of that dead integration.
//
// Never throw at import time for a missing/optional env var (same pattern
// as src/lib/cars/db.ts) -- a site with no Upstash configured yet must keep
// working normally, just without rate limiting, until the credentials are
// supplied.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
export const isRateLimitConfigured = Boolean(url && token);

const redis = isRateLimitConfigured ? new Redis({ url: url!, token: token! }) : null;

export type RateLimitRuleName =
  | "login"
  | "booking"
  | "tracking"
  | "search"
  | "reviews"
  | "discount"
  | "upload";

interface RateLimitRule {
  max: number;
  windowSeconds: number;
}

// Fallback values only -- an admin can override every one of these via
// /admin/settings (settings keys `ratelimit_<name>_max` / `_window_sec`),
// per the project's standing "admin controls everything, nothing
// hardcoded" rule. These defaults match the values in TODO.md's Station 7
// spec and only apply when the admin hasn't set an override yet.
const DEFAULT_RULES: Record<RateLimitRuleName, RateLimitRule> = {
  login: { max: 5, windowSeconds: 900 },       // 5 / 15 min, by IP+username
  booking: { max: 3, windowSeconds: 600 },     // 3 / 10 min, by IP + hashed phone
  tracking: { max: 10, windowSeconds: 300 },   // 10 / 5 min, by IP + hashed phone/number
  search: { max: 60, windowSeconds: 60 },      // 60 / min, by IP (client already debounces)
  reviews: { max: 3, windowSeconds: 3600 },    // 3 / hour, by IP
  discount: { max: 10, windowSeconds: 600 },   // 10 / 10 min, by IP
  upload: { max: 10, windowSeconds: 600 },     // 10 / 10 min, by session/admin id
};

const SETTING_KEYS = (Object.keys(DEFAULT_RULES) as RateLimitRuleName[]).flatMap((name) => [
  `ratelimit_${name}_max`,
  `ratelimit_${name}_window_sec`,
]);

let cachedRules: Record<RateLimitRuleName, RateLimitRule> | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 30_000; // short cache -- an admin edit takes effect within 30s, not instantly, without hitting settings on every single request

async function getRules(): Promise<Record<RateLimitRuleName, RateLimitRule>> {
  const now = Date.now();
  if (cachedRules && now - cachedAt < CACHE_TTL_MS) return cachedRules;

  const rules = { ...DEFAULT_RULES };
  try {
    const rows = await db.select().from(settings).where(inArray(settings.key, SETTING_KEYS));
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    for (const name of Object.keys(DEFAULT_RULES) as RateLimitRuleName[]) {
      const max = Number(map[`ratelimit_${name}_max`]);
      const win = Number(map[`ratelimit_${name}_window_sec`]);
      rules[name] = {
        max: Number.isFinite(max) && max > 0 ? max : DEFAULT_RULES[name].max,
        windowSeconds: Number.isFinite(win) && win > 0 ? win : DEFAULT_RULES[name].windowSeconds,
      };
    }
  } catch {
    // A settings-read hiccup must never take rate limiting down with it --
    // fall back to the built-in defaults for this cache window.
  }
  cachedRules = rules;
  cachedAt = now;
  return rules;
}

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: RateLimitRuleName, rule: RateLimitRule): Ratelimit {
  const cacheKey = `${name}:${rule.max}:${rule.windowSeconds}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(rule.max, `${rule.windowSeconds} s`),
      prefix: `elfady:ratelimit:${name}`,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

export interface RateLimitResult {
  limited: boolean;
  retryAfterSeconds?: number;
}

/**
 * Checks (and consumes) one hit against a named rule for the given
 * identifier. Returns `{ limited: false }` if Upstash isn't configured yet,
 * or on any internal error -- rate limiting must degrade to "off", never
 * break real customer traffic. `identifier` must already be a safe,
 * non-PII string (hash phone numbers via `hashIdentifier`, never pass raw
 * digits as part of a Redis key).
 */
export async function checkRateLimit(ruleName: RateLimitRuleName, identifier: string): Promise<RateLimitResult> {
  if (!isRateLimitConfigured) return { limited: false };
  try {
    const rules = await getRules();
    const rule = rules[ruleName];
    const limiter = getLimiter(ruleName, rule);
    const result = await limiter.limit(identifier);
    if (result.success) return { limited: false };
    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return { limited: true, retryAfterSeconds };
  } catch (err) {
    console.error(`[rateLimit:${ruleName}] check failed:`, err);
    return { limited: false };
  }
}

/** SHA-256 hash, truncated -- for using a phone number (or any PII) as part of a Redis key without ever storing/logging the raw value. */
export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/** Best-effort client IP from the headers Vercel's edge network sets. Never throws. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export const RATE_LIMIT_DEFAULTS = DEFAULT_RULES;

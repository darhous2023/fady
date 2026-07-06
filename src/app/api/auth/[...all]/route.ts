import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const { GET, POST: originalPOST } = toNextJsHandler(auth);

export { GET };

// Better Auth's own request handles every auth action (sign-up, sign-in,
// session, social, etc.) through this one catch-all route. Only the actual
// sign-in-with-password action is rate limited here (5 / 15 min, by IP +
// username -- Station 7), rather than configuring Better Auth's built-in
// rate limiter, so this reuses the same Upstash-backed library and admin-
// configurable settings as every other endpoint in this station.
export async function POST(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith("/sign-in/email")) {
    const ip = getClientIp(request);
    let email = "";
    try {
      const body = await request.clone().json();
      email = String(body?.email || "").toLowerCase();
    } catch {
      // Malformed body -- let Better Auth's own handler reject it normally.
    }
    const { limited, retryAfterSeconds } = await checkRateLimit("login", `${ip}:${email}`);
    if (limited) {
      return NextResponse.json(
        { error: "محاولات تسجيل دخول كثيرة جدًا. حاول مرة أخرى بعد قليل." },
        { status: 429, headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined },
      );
    }
  }
  return originalPOST(request);
}

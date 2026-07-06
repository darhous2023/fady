// Registers Sentry for the server and edge runtimes. Without
// NEXT_PUBLIC_SENTRY_DSN set, Sentry.init() is a documented no-op -- this
// file is always safe to load, on Vercel or anywhere else, with or without
// a real Sentry project configured (Station 8).
import * as Sentry from "@sentry/nextjs"

export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,
      // Booking/upload failures and repeated 401s already log via
      // console.error in their own routes; Sentry catches anything that
      // reaches an unhandled exception on top of that.
    })
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.2,
    })
  }
}

export const onRequestError = Sentry.captureRequestError

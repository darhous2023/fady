// Client-side Sentry init. Without NEXT_PUBLIC_SENTRY_DSN set this is a
// documented no-op -- safe in every environment (Station 8).
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.2,
  // Session Replay is deliberately off: this store handles real customer
  // phone numbers/booking data, and enabling it would mean re-litigating
  // the RLS/privacy hardening done in Station 7 for a nice-to-have.
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

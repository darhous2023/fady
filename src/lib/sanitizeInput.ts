// Postgres text columns reject raw NUL/control bytes outright (raises a
// type-cast-style error), so any request-derived string headed into an
// eq()/ilike() comparison must be stripped first -- otherwise a stray
// `%00` in a query string surfaces as a real 500 for what's actually
// harmless bad input (found live: /api/search, /api/discounts/validate,
// /api/orders/track, /api/new-cars/compare all 500'd on a NUL byte).
export function stripControlChars(input: string): string {
  return input.replace(/[\x00-\x1f\x7f]/g, "")
}

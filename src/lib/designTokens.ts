// Design tokens for the two catalog gateways (/new* and /used + /products/[slug]).
// Plain TS constants, not a Tailwind theme -- this codebase stays 100% inline
// style={{}} objects by deliberate decision (see .ai/DECISIONS.md). Scope is
// intentionally narrow: only the two gateways' components use this file, not
// a sitewide refactor. Values here are the site's own already-established
// palette/spacing/motion -- centralized so they're referenced, not retyped
// as magic hex codes across CarCard.tsx, CarFilters.tsx, ProductGrid.tsx, etc.

export const colors = {
  background: "#0A0A0A",
  steel: "#9BA3AA",
  steelMuted: "#6E747A",
  steelLight: "#C9CFD4",
  offWhite: "#F2F0EC",
  white: "#F5F5F5",
  alert: "#A5342C",
  whatsapp: "#25D366",
} as const;

// 8px-based spacing scale already in use across both gateways' components.
export const spacing = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const motion = {
  // The same cubic-bezier already duplicated across NewCarsHero.tsx,
  // CinematicUsedHero.tsx, and UsedCarsHero.tsx.
  ease: [0.22, 1, 0.36, 1] as const,
  duration: {
    fast: 0.25,
    base: 0.5,
    slow: 0.7,
    hero: 0.9,
  },
} as const;

// Comfortable touch-target minimum (accessibility skill: 44x44 for anything
// with real consequence on mis-tap, e.g. remove/delete controls).
export const touchTarget = {
  comfortable: 44,
} as const;

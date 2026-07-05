/**
 * Arabic query normalization + brand/model alias matching for search.
 * Never modifies stored English source data — this only transforms the
 * user's query string before matching against search_index.searchText,
 * and expands a query using admin-editable aliases (carsAliases table).
 */

const ARABIC_DIACRITICS = /[ً-ْٰ]/g;

export function normalizeArabic(input: string): string {
  return input
    .replace(ARABIC_DIACRITICS, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .trim()
    .toLowerCase();
}

export function normalizeQuery(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  // Arabic script present -> apply Arabic-specific normalization only.
  const hasArabic = /[؀-ۿ]/.test(trimmed);
  return hasArabic ? normalizeArabic(trimmed) : trimmed.toLowerCase();
}

/** Seed set of common brand aliases — admin can add more via carsAliases at runtime; this is the fallback when no admin alias row exists yet. */
export const DEFAULT_BRAND_ALIASES: Record<string, string> = {
  "بي ام دبليو": "BMW", "بي إم دبليو": "BMW", "بمو": "BMW",
  "مرسيدس": "Mercedes-Benz", "مرسيدس بنز": "Mercedes-Benz",
  "تويوتا": "Toyota",
  "هيونداي": "Hyundai", "هيوندai": "Hyundai",
  "كيا": "Kia",
  "فولكس واجن": "Volkswagen", "فولكسفاجن": "Volkswagen",
  "شيفروليه": "Chevrolet", "شفروليه": "Chevrolet",
  "اودي": "Audi", "أودي": "Audi",
  "بورش": "Porsche",
  "نيسان": "Nissan",
  "رينو": "Renault",
  "اوبل": "Opel", "أوبل": "Opel",
};

export function expandQueryWithAliases(query: string, extraAliases: Record<string, string> = {}): string {
  const merged = { ...DEFAULT_BRAND_ALIASES, ...extraAliases };
  const normalized = normalizeArabic(query);
  for (const [alias, brand] of Object.entries(merged)) {
    if (normalizeArabic(alias) === normalized || normalized.includes(normalizeArabic(alias))) {
      return brand;
    }
  }
  return query;
}

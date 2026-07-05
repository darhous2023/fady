export type CarsBrandListItem = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  logoUrl: string | null;
  modelCount: number;
};

export type CarsFilters = {
  brandSlug?: string;
  modelSlug?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  drivetrain?: string;
  yearMin?: number;
  yearMax?: number;
  powerHpMin?: number;
  powerHpMax?: number;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: "newest" | "power_desc" | "power_asc" | "name_asc";
};

export type CarsBrowseResult = {
  items: CarsBrowseItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CarsBrowseItem = {
  normalizedKey: string;
  displayName: string;
  brandName: string;
  modelName: string | null;
  year: number | null;
  bodyType: string | null;
  fuelType: string | null;
  powerHp: number | null;
  mainImageUrl: string | null;
};

export type CarsSpecSection = {
  sectionKey: string;
  groupName: string;
  items: { label: string; valueText: string; unit: string | null }[];
};

export type CarsCanonicalDetail = {
  normalizedKey: string;
  displayName: string;
  brand: { id: string; nameEn: string; nameAr: string | null; slug: string } | null;
  model: { id: string; nameEn: string; slug: string } | null;
  generation: { id: string; name: string; productionStart: string | null; productionEnd: string | null } | null;
  trim: { id: string; nameEn: string } | null;
  year: number | null;
  bodyType: string | null;
  doors: number | null;
  seatingCapacity: number | null;
  engine: string | null;
  transmission: string | null;
  fuelType: string | null;
  drivetrain: string | null;
  powerHp: number | null;
  torqueNm: number | null;
  images: { url: string; isMain: boolean; altText: string | null }[];
  specSections: CarsSpecSection[];
  sourceUrl: string | null;
  lastScrapedAt: Date | null;
  publicationEligible: boolean;
  publicationReason: string | null;
};

export type CarsSearchResultItem = {
  normalizedKey: string;
  displayName: string;
  brandName: string;
  modelName: string | null;
  year: number | null;
  mainImageUrl: string | null;
};

export type CarsFacetCounts = {
  bodyType: { value: string; count: number }[];
  fuelType: { value: string; count: number }[];
  transmission: { value: string; count: number }[];
  drivetrain: { value: string; count: number }[];
};

export type CarsPortalStats = {
  publicBrandCount: number;
  publicCarCount: number;
  totalCarCount: number;
  datasetVersion: string | null;
};

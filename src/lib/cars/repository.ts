import { and, asc, desc, eq, gte, lte, sql, ilike, or } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { carsDb } from "./db";
import {
  carsBrands, carsModels, carsGenerations, carsTrims,
  carsCanonical, carsCanonicalImages, carsImages, carsSpecs, carsSearchIndex,
} from "../db/carsCatalog/schema";
import type {
  CarsBrandListItem, CarsFilters, CarsBrowseResult, CarsBrowseItem,
  CarsCanonicalDetail, CarsFacetCounts, CarsPortalStats, CarsSpecSection,
} from "./types";

/** Only brands with real catalog data behind them — never the 314 logo-only rows. */
export async function getPublicBrands(): Promise<CarsBrandListItem[]> {
  const rows = await carsDb
    .select({
      id: carsBrands.id, slug: carsBrands.slug, nameEn: carsBrands.nameEn,
      nameAr: carsBrands.nameAr, logoUrl: carsBrands.logoUrl, modelCount: carsBrands.modelCount,
    })
    .from(carsBrands)
    .where(eq(carsBrands.isPublic, true))
    .orderBy(desc(carsBrands.modelCount));
  return rows;
}

export async function getBrandBySlug(slug: string) {
  const [row] = await carsDb.select().from(carsBrands).where(eq(carsBrands.slug, slug)).limit(1);
  return row ?? null;
}

export async function getModelsForBrand(brandId: string) {
  return carsDb.select().from(carsModels).where(eq(carsModels.brandId, brandId)).orderBy(asc(carsModels.nameEn));
}

export async function getGenerationsForModel(modelId: string) {
  return carsDb.select().from(carsGenerations).where(eq(carsGenerations.modelId, modelId)).orderBy(desc(carsGenerations.productionStart));
}

export async function getTrimsForGeneration(generationId: string) {
  return carsDb.select().from(carsTrims).where(eq(carsTrims.generationId, generationId));
}

function buildBrowseWhere(filters: CarsFilters) {
  const conditions = [eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false)];
  if (filters.bodyType) conditions.push(eq(carsCanonical.bodyType, filters.bodyType));
  if (filters.fuelType) conditions.push(eq(carsCanonical.fuelType, filters.fuelType));
  if (filters.transmission) conditions.push(eq(carsCanonical.transmission, filters.transmission));
  if (filters.drivetrain) conditions.push(eq(carsCanonical.drivetrain, filters.drivetrain));
  if (filters.yearMin) conditions.push(gte(carsCanonical.year, filters.yearMin));
  if (filters.yearMax) conditions.push(lte(carsCanonical.year, filters.yearMax));
  if (filters.powerHpMin) conditions.push(gte(carsCanonical.powerHp, String(filters.powerHpMin)));
  if (filters.powerHpMax) conditions.push(lte(carsCanonical.powerHp, String(filters.powerHpMax)));
  if (filters.q) {
    conditions.push(
      or(
        ilike(carsCanonical.displayName, `%${filters.q}%`),
        sql`${carsCanonical.normalizedKey} IN (
          SELECT canonical_key FROM search_index
          WHERE search_text_en ILIKE ${`%${filters.q}%`} OR search_text_ar ILIKE ${`%${filters.q}%`}
        )`
      )!
    );
  }
  return and(...conditions)!; // always non-empty: publicationEligible/adminHidden are always pushed
}

/**
 * Browse listing — paginated at the SQL level, one row per canonical car
 * with its main image joined in (never N+1: a single query, not one
 * per-row image lookup).
 */
export async function browseCars(filters: CarsFilters): Promise<CarsBrowseResult> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 24));
  const where = buildBrowseWhere(filters);

  const orderBy =
    filters.sort === "power_desc" ? desc(carsCanonical.powerHp)
    : filters.sort === "power_asc" ? asc(carsCanonical.powerHp)
    : filters.sort === "name_asc" ? asc(carsCanonical.displayName)
    : desc(carsCanonical.lastSyncedAt);

  const [countRow] = await carsDb.select({ count: sql<number>`count(*)::int` }).from(carsCanonical).where(where);
  const total = countRow?.count ?? 0;

  const mainImage = carsDb
    .select({
      canonicalKey: carsCanonicalImages.canonicalKey,
      url: carsImages.objectStorageUrl,
      remoteUrl: carsImages.remoteUrl,
    })
    .from(carsCanonicalImages)
    .innerJoin(carsImages, eq(carsCanonicalImages.imageId, carsImages.id))
    .where(eq(carsCanonicalImages.isMain, true))
    .as("main_image");

  const rows = await carsDb
    .select({
      normalizedKey: carsCanonical.normalizedKey,
      displayName: carsCanonical.displayName,
      brandName: carsBrands.nameEn,
      modelName: carsModels.nameEn,
      year: carsCanonical.year,
      bodyType: carsCanonical.bodyType,
      fuelType: carsCanonical.fuelType,
      powerHp: carsCanonical.powerHp,
      mainImageUrl: mainImage.url,
      mainImageRemoteUrl: mainImage.remoteUrl,
    })
    .from(carsCanonical)
    .leftJoin(carsBrands, eq(carsCanonical.brandId, carsBrands.id))
    .leftJoin(carsModels, eq(carsCanonical.modelId, carsModels.id))
    .leftJoin(mainImage, eq(mainImage.canonicalKey, carsCanonical.normalizedKey))
    .where(where)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const items: CarsBrowseItem[] = rows.map((r) => ({
    normalizedKey: r.normalizedKey,
    displayName: r.displayName,
    brandName: r.brandName ?? "",
    modelName: r.modelName,
    year: r.year,
    bodyType: r.bodyType,
    fuelType: r.fuelType,
    powerHp: r.powerHp ? Number(r.powerHp) : null,
    // object storage URL only in production reads; remoteUrl is a documented
    // fallback for local/dev before the image migration step has run
    mainImageUrl: r.mainImageUrl ?? r.mainImageRemoteUrl ?? null,
  }));

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getFacetCounts(baseFilters: CarsFilters): Promise<CarsFacetCounts> {
  async function facet(column: PgColumn) {
    const where = and(eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false), sql`${column} IS NOT NULL`);
    const rows = await carsDb
      .select({ value: column, count: sql<number>`count(*)::int` })
      .from(carsCanonical)
      .where(where)
      .groupBy(column)
      .orderBy(desc(sql`count(*)`));
    return rows.map((r) => ({ value: String(r.value), count: r.count }));
  }

  const [bodyType, fuelType, transmission, drivetrain] = await Promise.all([
    facet(carsCanonical.bodyType),
    facet(carsCanonical.fuelType),
    facet(carsCanonical.transmission),
    facet(carsCanonical.drivetrain),
  ]);

  return { bodyType, fuelType, transmission, drivetrain };
}

const SECTION_LABELS_AR: Record<string, string> = {
  engine: "المحرك", performance: "الأداء", transmission: "ناقل الحركة", fuel: "الوقود والانبعاثات",
  dimensions: "الأبعاد", weight: "الأوزان", suspension: "التعليق", brakes: "الفرامل",
  steering: "التوجيه", wheels: "الإطارات والجنوط", electric: "الكهربائي والهجين", other: "مواصفات إضافية",
};

export function sectionLabelAr(sectionKey: string): string {
  return SECTION_LABELS_AR[sectionKey] ?? sectionKey;
}

/** Full car-detail read — only ever returns fields that have real data; empty sections/images are simply absent, never rendered as placeholders. */
export async function getCanonicalCarDetail(normalizedKey: string): Promise<CarsCanonicalDetail | null> {
  const [car] = await carsDb.select().from(carsCanonical).where(eq(carsCanonical.normalizedKey, normalizedKey)).limit(1);
  if (!car) return null;

  const [brand, model, generation, trim, images, specRows] = await Promise.all([
    car.brandId ? carsDb.select().from(carsBrands).where(eq(carsBrands.id, car.brandId)).limit(1).then((r) => r[0] ?? null) : null,
    car.modelId ? carsDb.select().from(carsModels).where(eq(carsModels.id, car.modelId)).limit(1).then((r) => r[0] ?? null) : null,
    car.generationId ? carsDb.select().from(carsGenerations).where(eq(carsGenerations.id, car.generationId)).limit(1).then((r) => r[0] ?? null) : null,
    car.trimId ? carsDb.select().from(carsTrims).where(eq(carsTrims.id, car.trimId)).limit(1).then((r) => r[0] ?? null) : null,
    carsDb
      .select({ url: carsImages.objectStorageUrl, remoteUrl: carsImages.remoteUrl, isMain: carsCanonicalImages.isMain, altText: carsCanonicalImages.altText })
      .from(carsCanonicalImages)
      .innerJoin(carsImages, eq(carsCanonicalImages.imageId, carsImages.id))
      .where(eq(carsCanonicalImages.canonicalKey, normalizedKey))
      .orderBy(asc(carsCanonicalImages.order)),
    carsDb.select().from(carsSpecs).where(eq(carsSpecs.canonicalKey, normalizedKey)).orderBy(asc(carsSpecs.sectionKey), asc(carsSpecs.order)),
  ]);

  const sectionsMap = new Map<string, CarsSpecSection>();
  for (const s of specRows) {
    if (!sectionsMap.has(s.sectionKey)) {
      sectionsMap.set(s.sectionKey, { sectionKey: s.sectionKey, groupName: sectionLabelAr(s.sectionKey), items: [] });
    }
    sectionsMap.get(s.sectionKey)!.items.push({ label: s.label, valueText: s.valueText, unit: s.unit });
  }

  return {
    normalizedKey: car.normalizedKey,
    displayName: car.displayName,
    brand: brand ? { id: brand.id, nameEn: brand.nameEn, nameAr: brand.nameAr, slug: brand.slug } : null,
    model: model ? { id: model.id, nameEn: model.nameEn, slug: model.slug } : null,
    generation: generation ? { id: generation.id, name: generation.name, productionStart: generation.productionStart, productionEnd: generation.productionEnd } : null,
    trim: trim ? { id: trim.id, nameEn: trim.nameEn } : null,
    year: car.year,
    bodyType: car.bodyType,
    doors: car.doors,
    seatingCapacity: car.seatingCapacity,
    engine: car.engine,
    transmission: car.transmission,
    fuelType: car.fuelType,
    drivetrain: car.drivetrain,
    powerHp: car.powerHp ? Number(car.powerHp) : null,
    torqueNm: car.torqueNm ? Number(car.torqueNm) : null,
    images: images
      .filter((i) => i.url || i.remoteUrl)
      .map((i) => ({ url: (i.url ?? i.remoteUrl)!, isMain: i.isMain, altText: i.altText })),
    specSections: Array.from(sectionsMap.values()),
    sourceUrl: car.sourceUrl,
    lastScrapedAt: car.lastScrapedAt,
    publicationEligible: car.publicationEligible,
    publicationReason: car.publicationReason,
  };
}

export async function getSimilarCars(normalizedKey: string, limit = 6) {
  const [car] = await carsDb.select().from(carsCanonical).where(eq(carsCanonical.normalizedKey, normalizedKey)).limit(1);
  if (!car?.modelId) return [];
  return browseCars({ page: 1, pageSize: limit }).then((r) =>
    r.items.filter((i) => i.normalizedKey !== normalizedKey)
  );
}

export async function getPortalStats(): Promise<CarsPortalStats> {
  const [[{ count: publicBrandCount }], [{ count: publicCarCount }], [{ count: totalCarCount }]] = await Promise.all([
    carsDb.select({ count: sql<number>`count(*)::int` }).from(carsBrands).where(eq(carsBrands.isPublic, true)),
    carsDb.select({ count: sql<number>`count(*)::int` }).from(carsCanonical).where(and(eq(carsCanonical.publicationEligible, true), eq(carsCanonical.adminHidden, false))),
    carsDb.select({ count: sql<number>`count(*)::int` }).from(carsCanonical),
  ]);
  return { publicBrandCount, publicCarCount, totalCarCount, datasetVersion: null };
}

export { carsSearchIndex };

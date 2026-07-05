/**
 * Admin write-path for the cars catalog. Two different safety rules apply
 * depending on the table:
 *
 * - `brands.name_ar` / `models.name_ar` / `canonical_cars.admin_hidden` /
 *   `canonical_cars.admin_notes` / `models.admin_hidden` are NEVER written
 *   by the sync engine's ON CONFLICT clause (confirmed by reading
 *   scraping/src/sync/steps.ts) — safe to write directly, survives re-sync.
 * - Every other display field on `canonical_cars` (displayName, year,
 *   bodyType, engine, transmission, fuelType, drivetrain, seatingCapacity,
 *   doors, powerHp, torqueNm) IS overwritten by the sync engine on every
 *   re-sync. Admin edits to those go through `admin_overrides` instead,
 *   applied at read time by `applyCarOverrides` in repository.ts — never
 *   written directly into canonical_cars.
 *
 * Rows created by an admin (not by the sync engine) use an `admin-`
 * id/normalizedKey prefix, which the sync engine's source-derived ids
 * (cuids, or `|`-joined normalizedKeys) can never produce — so these rows
 * are safe to hard-delete, unlike synced rows (which just get re-created
 * on the next sync and should be hidden via admin_hidden instead).
 */
import { randomUUID } from "crypto";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { carsDb } from "./db";
import {
  carsBrands, carsModels, carsCanonical, carsAdminOverrides,
} from "../db/carsCatalog/schema";

const OVERRIDABLE_CAR_FIELDS = [
  "displayName", "year", "bodyType", "engine", "transmission",
  "fuelType", "drivetrain", "seatingCapacity", "doors", "powerHp", "torqueNm",
] as const;
export type OverridableCarField = (typeof OVERRIDABLE_CAR_FIELDS)[number];

export function isOverridableCarField(field: string): field is OverridableCarField {
  return (OVERRIDABLE_CAR_FIELDS as readonly string[]).includes(field);
}

function isAdminCreatedId(id: string): boolean {
  return id.startsWith("admin-");
}

// ---------- Brands ----------

export async function adminListBrands() {
  return carsDb.select().from(carsBrands).orderBy(desc(carsBrands.modelCount));
}

export async function adminUpdateBrand(
  id: string,
  patch: { nameAr?: string | null; isPublic?: boolean },
) {
  const [row] = await carsDb
    .update(carsBrands)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(carsBrands.id, id))
    .returning();
  return row ?? null;
}

export async function adminCreateBrand(input: { nameEn: string; nameAr?: string | null; slug: string }) {
  const id = `admin-${randomUUID()}`;
  const [row] = await carsDb
    .insert(carsBrands)
    .values({
      id, slug: input.slug, nameEn: input.nameEn, nameAr: input.nameAr ?? null,
      logoUrl: null, modelCount: 0, isPublic: true,
    })
    .returning();
  return row;
}

export async function adminDeleteBrand(id: string): Promise<{ deleted: boolean; reason?: string }> {
  if (!isAdminCreatedId(id)) return { deleted: false, reason: "not-admin-created" };
  await carsDb.delete(carsBrands).where(eq(carsBrands.id, id));
  return { deleted: true };
}

// ---------- Models ----------

export async function adminListModels(brandId?: string) {
  const where = brandId ? eq(carsModels.brandId, brandId) : undefined;
  return carsDb.select().from(carsModels).where(where).orderBy(desc(carsModels.updatedAt));
}

export async function adminUpdateModel(
  id: string,
  patch: { nameAr?: string | null; adminHidden?: boolean },
) {
  const [row] = await carsDb
    .update(carsModels)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(carsModels.id, id))
    .returning();
  return row ?? null;
}

export async function adminCreateModel(input: { brandId: string; nameEn: string; nameAr?: string | null; slug: string; bodyType?: string | null }) {
  const id = `admin-${randomUUID()}`;
  const [row] = await carsDb
    .insert(carsModels)
    .values({
      id, brandId: input.brandId, slug: input.slug, nameEn: input.nameEn,
      nameAr: input.nameAr ?? null, bodyType: input.bodyType ?? null, adminHidden: false,
    })
    .returning();
  return row;
}

export async function adminDeleteModel(id: string): Promise<{ deleted: boolean; reason?: string }> {
  if (!isAdminCreatedId(id)) return { deleted: false, reason: "not-admin-created" };
  await carsDb.delete(carsModels).where(eq(carsModels.id, id));
  return { deleted: true };
}

// ---------- Canonical cars (listings) ----------

export type AdminCarListFilters = { q?: string; brandId?: string; page?: number; pageSize?: number };

export async function adminListCars(filters: AdminCarListFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 25));
  const conditions = [];
  if (filters.brandId) conditions.push(eq(carsCanonical.brandId, filters.brandId));
  if (filters.q) conditions.push(ilike(carsCanonical.displayName, `%${filters.q}%`));
  const where = conditions.length ? and(...conditions) : undefined;

  const [countRow] = await carsDb.select({ count: sql<number>`count(*)::int` }).from(carsCanonical).where(where);
  const rows = await carsDb
    .select({
      normalizedKey: carsCanonical.normalizedKey,
      displayName: carsCanonical.displayName,
      brandName: carsBrands.nameEn,
      modelName: carsModels.nameEn,
      year: carsCanonical.year,
      publicationEligible: carsCanonical.publicationEligible,
      adminHidden: carsCanonical.adminHidden,
      adminNotes: carsCanonical.adminNotes,
      updatedAt: carsCanonical.updatedAt,
    })
    .from(carsCanonical)
    .leftJoin(carsBrands, eq(carsCanonical.brandId, carsBrands.id))
    .leftJoin(carsModels, eq(carsCanonical.modelId, carsModels.id))
    .where(where)
    .orderBy(desc(carsCanonical.updatedAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { items: rows, total: countRow?.count ?? 0, page, pageSize };
}

export async function adminSetCarHidden(normalizedKey: string, adminHidden: boolean) {
  const [row] = await carsDb
    .update(carsCanonical)
    .set({ adminHidden, updatedAt: new Date() })
    .where(eq(carsCanonical.normalizedKey, normalizedKey))
    .returning();
  return row ?? null;
}

export async function adminSetCarNotes(normalizedKey: string, adminNotes: string | null) {
  const [row] = await carsDb
    .update(carsCanonical)
    .set({ adminNotes, updatedAt: new Date() })
    .where(eq(carsCanonical.normalizedKey, normalizedKey))
    .returning();
  return row ?? null;
}

/** Writes to admin_overrides, never directly to canonical_cars — see file header. */
export async function adminSetCarFieldOverride(
  normalizedKey: string,
  field: OverridableCarField,
  overrideValue: string,
  updatedBy: string,
) {
  const [existingCar] = await carsDb
    .select({ v: sql<string>`1` })
    .from(carsCanonical)
    .where(eq(carsCanonical.normalizedKey, normalizedKey))
    .limit(1);
  if (!existingCar) return null;

  const id = `canonical_car:${normalizedKey}:${field}`;
  await carsDb
    .insert(carsAdminOverrides)
    .values({
      id, entityType: "canonical_car", entityId: normalizedKey, field,
      originalValue: null, overrideValue, reason: null, updatedBy,
    })
    .onConflictDoUpdate({
      target: carsAdminOverrides.id,
      set: { overrideValue, updatedBy, updatedAt: new Date() },
    });
  return { normalizedKey, field, overrideValue };
}

export async function adminClearCarFieldOverride(normalizedKey: string, field: OverridableCarField) {
  await carsDb
    .delete(carsAdminOverrides)
    .where(and(
      eq(carsAdminOverrides.entityType, "canonical_car"),
      eq(carsAdminOverrides.entityId, normalizedKey),
      eq(carsAdminOverrides.field, field),
    ));
}

export async function adminGetCarOverrides(normalizedKey: string) {
  return carsDb
    .select()
    .from(carsAdminOverrides)
    .where(and(eq(carsAdminOverrides.entityType, "canonical_car"), eq(carsAdminOverrides.entityId, normalizedKey)));
}

/** Admin-added listing — not sourced from the scraping project at all. */
export async function adminCreateCar(input: {
  displayName: string; brandId?: string | null; modelId?: string | null;
  year?: number | null; bodyType?: string | null; fuelType?: string | null; transmission?: string | null;
}) {
  const normalizedKey = `admin-${randomUUID()}`;
  const [row] = await carsDb
    .insert(carsCanonical)
    .values({
      normalizedKey,
      sourceCanonicalId: normalizedKey,
      brandId: input.brandId ?? null,
      modelId: input.modelId ?? null,
      displayName: input.displayName,
      year: input.year ?? null,
      bodyType: input.bodyType ?? null,
      fuelType: input.fuelType ?? null,
      transmission: input.transmission ?? null,
      sourceIsCurrent: false,
      sourceReviewStatus: "admin_created",
      publicationEligible: true,
      publicationReason: "admin_created",
      adminHidden: false,
    })
    .returning();
  return row;
}

export async function adminDeleteCar(normalizedKey: string): Promise<{ deleted: boolean; reason?: string }> {
  if (!isAdminCreatedId(normalizedKey)) return { deleted: false, reason: "not-admin-created" };
  await carsDb.delete(carsAdminOverrides).where(and(eq(carsAdminOverrides.entityType, "canonical_car"), eq(carsAdminOverrides.entityId, normalizedKey)));
  await carsDb.delete(carsCanonical).where(eq(carsCanonical.normalizedKey, normalizedKey));
  return { deleted: true };
}

export { isAdminCreatedId };

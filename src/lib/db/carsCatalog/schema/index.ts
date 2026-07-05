export {
  carsBrands,
  selectCarsBrandSchema,
  insertCarsBrandSchema,
  type CarsBrand,
  type InsertCarsBrand,
} from "./brands";

export {
  carsModels,
  carsGenerations,
  carsTrims,
  selectCarsModelSchema,
  insertCarsModelSchema,
  type CarsModel,
  type InsertCarsModel,
  selectCarsGenerationSchema,
  insertCarsGenerationSchema,
  type CarsGeneration,
  type InsertCarsGeneration,
  selectCarsTrimSchema,
  insertCarsTrimSchema,
  type CarsTrim,
  type InsertCarsTrim,
} from "./models";

export {
  carsCanonical,
  selectCarsCanonicalSchema,
  insertCarsCanonicalSchema,
  type CarsCanonical,
  type InsertCarsCanonical,
} from "./canonicalCars";

export {
  carsImages,
  carsCanonicalImages,
  selectCarsImageSchema,
  insertCarsImageSchema,
  type CarsImage,
  type InsertCarsImage,
  selectCarsCanonicalImageSchema,
  insertCarsCanonicalImageSchema,
  type CarsCanonicalImage,
  type InsertCarsCanonicalImage,
} from "./media";

export {
  carsSpecs,
  selectCarsSpecSchema,
  insertCarsSpecSchema,
  type CarsSpec,
  type InsertCarsSpec,
} from "./specs";

export {
  carsSearchIndex,
  carsAliases,
  selectCarsSearchIndexSchema,
  insertCarsSearchIndexSchema,
  type CarsSearchIndexRow,
  type InsertCarsSearchIndexRow,
  selectCarsAliasSchema,
  insertCarsAliasSchema,
  type CarsAlias,
  type InsertCarsAlias,
} from "./search";

export {
  carsAdminOverrides,
  carsSyncRuns,
  selectCarsAdminOverrideSchema,
  insertCarsAdminOverrideSchema,
  type CarsAdminOverride,
  type InsertCarsAdminOverride,
  selectCarsSyncRunSchema,
  insertCarsSyncRunSchema,
  type CarsSyncRun,
  type InsertCarsSyncRun,
} from "./admin";

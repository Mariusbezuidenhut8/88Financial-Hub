// ── Types ──────────────────────────────────────────────────────────────────
export type {
  EstatePlanningUrgency,
  EstateReadinessStatus,
  EstatePlannerOverview,
  EstatePlannerFamilyStep,
  EstatePlannerEstateStep,
  EstatePlannerLiquidityStep,
  EstatePlannerReviewStep,
  EstateAnalysisInput,
  EstateAnalysisOutput,
  EstatePlannerState,
  EstatePlannerResult,
  EstatePlannerMappingResult,
} from "./types/estatePlanner.types";

// ── Initial state ──────────────────────────────────────────────────────────
export { estatePlannerInitialState } from "./data/estatePlannerInitialState";

// ── Mapper ─────────────────────────────────────────────────────────────────
export {
  mapClientProfileToEstatePlanner,
  toAnalysisInput,
  runAnalysisEngine,
} from "./services/estatePlannerMapper";

// ── Analysis engine ────────────────────────────────────────────────────────
export { runEstateAnalysis } from "./services/estateAnalysisEngine";

// ── Builder (convenience assembler) ───────────────────────────────────────
export { buildEstatePlannerResult } from "./services/estatePlannerBuilder";

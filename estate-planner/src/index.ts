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

// ── Steps metadata ─────────────────────────────────────────────────────────
export { estatePlannerSteps } from "./data/estatePlannerSteps";
export type { EstatePlannerStepKey } from "./data/estatePlannerSteps";

// ── Page ───────────────────────────────────────────────────────────────────
export { EstatePlannerPage } from "./pages/EstatePlannerPage";
export type { EstatePlannerPageProps } from "./pages/EstatePlannerPage";

// ── Wizard ─────────────────────────────────────────────────────────────────
export { EstatePlannerWizard } from "./components/estate/EstatePlannerWizard";
export type { EstatePlannerWizardProps } from "./components/estate/EstatePlannerWizard";

// ── Progress header ────────────────────────────────────────────────────────
export { EstateProgressHeader } from "./components/estate/EstateProgressHeader";
export type { EstateProgressHeaderProps } from "./components/estate/EstateProgressHeader";

// ── Step components ────────────────────────────────────────────────────────
export { EstateOverviewStep }  from "./components/estate/EstateOverviewStep";
export { EstateFamilyStep }    from "./components/estate/EstateFamilyStep";
export { EstateValueStep }     from "./components/estate/EstateValueStep";
export { EstateLiquidityStep } from "./components/estate/EstateLiquidityStep";
export { EstateReviewStep }    from "./components/estate/EstateReviewStep";
export { EstateResultsStep }   from "./components/estate/EstateResultsStep";
export { EstateNextStep }      from "./components/estate/EstateNextStep";
export type { EstateOverviewStepProps }  from "./components/estate/EstateOverviewStep";
export type { EstateFamilyStepProps }    from "./components/estate/EstateFamilyStep";
export type { EstateValueStepProps }     from "./components/estate/EstateValueStep";
export type { EstateLiquidityStepProps } from "./components/estate/EstateLiquidityStep";
export type { EstateReviewStepProps }    from "./components/estate/EstateReviewStep";
export type { EstateResultsStepProps }   from "./components/estate/EstateResultsStep";
export type { EstateNextStepProps }      from "./components/estate/EstateNextStep";

// ── Display helpers ────────────────────────────────────────────────────────
export {
  fmtEstateCurrency,
  getReadinessConfig,
  getUrgencyLabel,
  getUrgencyColor,
} from "./components/estate/estateHelpers";
export type { ReadinessConfig } from "./components/estate/estateHelpers";

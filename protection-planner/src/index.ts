// ── Types ──────────────────────────────────────────────────────────────────
export type {
  ProtectionNeedType,
  ProtectionGapSeverity,
  ProtectionReadinessStatus,
  ProtectionPlanningUrgency,
  IncomeProtectionBenefitPeriod,
  ProtectionPlannerOverview,
  ProtectionLifeStep,
  ProtectionIncomeStep,
  ProtectionDreadStep,
  ProtectionDebtStep,
  ProtectionAnalysisInput,
  ProtectionGap,
  ProtectionAnalysisOutput,
  ProtectionPlannerState,
  ProtectionPlannerResult,
  ProtectionPlannerMappingResult,
} from "./types/protectionPlanner.types";

// ── Initial state ──────────────────────────────────────────────────────────
export { protectionPlannerInitialState } from "./data/protectionPlannerInitialState";

// ── Steps metadata ─────────────────────────────────────────────────────────
export { protectionPlannerSteps } from "./data/protectionPlannerSteps";
export type { ProtectionPlannerStepKey } from "./data/protectionPlannerSteps";

// ── Mapper ─────────────────────────────────────────────────────────────────
export {
  mapClientProfileToProtectionPlanner,
  toAnalysisInput,
  runProtectionEngine,
} from "./services/protectionPlannerMapper";

// ── Needs engine ───────────────────────────────────────────────────────────
export { runProtectionAnalysis } from "./services/protectionNeedsEngine";

// ── Builder (convenience assembler) ───────────────────────────────────────
export { buildProtectionPlannerResult } from "./services/protectionPlannerBuilder";

// ── Display helpers ────────────────────────────────────────────────────────
export {
  fmtProtectionCurrency,
  fmtMonthly,
  getSeverityConfig,
  getReadinessConfig,
  getUrgencyLabel,
  getUrgencyColor,
  getNeedTypeLabel,
  getBenefitPeriodLabel,
} from "./services/protectionPlannerHelpers";
export type {
  SeverityConfig,
  ReadinessConfig,
} from "./services/protectionPlannerHelpers";

// ── Page ───────────────────────────────────────────────────────────────────
export { ProtectionPlannerPage } from "./pages/ProtectionPlannerPage";
export type { ProtectionPlannerPageProps } from "./pages/ProtectionPlannerPage";

// ── Wizard ─────────────────────────────────────────────────────────────────
export { ProtectionPlannerWizard } from "./components/protection/ProtectionPlannerWizard";
export type { ProtectionPlannerWizardProps } from "./components/protection/ProtectionPlannerWizard";

// ── Progress header ────────────────────────────────────────────────────────
export { ProtectionProgressHeader } from "./components/protection/ProtectionProgressHeader";
export type { ProtectionProgressHeaderProps } from "./components/protection/ProtectionProgressHeader";

// ── Step components ────────────────────────────────────────────────────────
export { ProtectionOverviewStep }  from "./components/protection/ProtectionOverviewStep";
export { ProtectionLifeStep }      from "./components/protection/ProtectionLifeStep";
export { ProtectionIncomeStep }    from "./components/protection/ProtectionIncomeStep";
export { ProtectionDreadStep }     from "./components/protection/ProtectionDreadStep";
export { ProtectionDebtStep }      from "./components/protection/ProtectionDebtStep";
export { ProtectionResultsStep }   from "./components/protection/ProtectionResultsStep";
export { ProtectionNextStep }      from "./components/protection/ProtectionNextStep";
export type { ProtectionOverviewStepProps }  from "./components/protection/ProtectionOverviewStep";
export type { ProtectionLifeStepProps }      from "./components/protection/ProtectionLifeStep";
export type { ProtectionIncomeStepProps }    from "./components/protection/ProtectionIncomeStep";
export type { ProtectionDreadStepProps }     from "./components/protection/ProtectionDreadStep";
export type { ProtectionDebtStepProps }      from "./components/protection/ProtectionDebtStep";
export type { ProtectionResultsStepProps }   from "./components/protection/ProtectionResultsStep";
export type { ProtectionNextStepProps }      from "./components/protection/ProtectionNextStep";

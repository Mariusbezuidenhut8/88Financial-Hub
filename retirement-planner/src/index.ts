// ── Types ──────────────────────────────────────────────────────────────────
export type {
  RetirementAssumptionPreset,
  RetirementReadinessStatus,
  AssumptionPresetValues,
  RetirementPlannerOverview,
  RetirementPlannerGoals,
  RetirementPlannerPosition,
  RetirementPlannerAssumptions,
  RetirementPlannerState,
  RetirementProjectionInput,
  RetirementProjectionOutput,
  RetirementScenarioInput,
  RetirementStrategyOption,
  RetirementPlannerResult,
  RetirementPlannerMappingResult,
  RetirementPrefill,
} from "./types/retirement-planner.types";

export { getAssumptionPresetValues } from "./types/retirement-planner.types";

// ── Step metadata ──────────────────────────────────────────────────────────
export { RETIREMENT_PLANNER_STEPS } from "./data/retirementPlannerSteps";
export type { RetirementPlannerStepId } from "./data/retirementPlannerSteps";

// ── Initial state ──────────────────────────────────────────────────────────
export { retirementPlannerInitialState } from "./data/retirementPlannerInitialState";

// ── Services ───────────────────────────────────────────────────────────────
export {
  calculateRetirementProjection,
  buildRetirementPlannerResult,
  buildRecommendations,
  buildAdvisorEscalation,
} from "./services/retirementProjection";

export { attachRetirementScenarios } from "./services/retirementScenarios";

export {
  mapClientProfileToRetirementPlanner,
  toProjectionInput,
  runFullProjection,
} from "./services/retirementMapper";

// retirementPresetValues — service-layer alias
export { getAssumptionPresetValues as getPresetValues } from "./services/retirementPresetValues";

// ── Helpers ────────────────────────────────────────────────────────────────
export {
  getReadinessLabel,
  getReadinessConfig,
  fmtCurrency,
  fmtPercent,
} from "./components/retirement/retirementHelpers";
export type { ReadinessConfig } from "./components/retirement/retirementHelpers";

// ── Page ───────────────────────────────────────────────────────────────────
export { RetirementPlannerPage } from "./pages/RetirementPlannerPage";
export type { RetirementPlannerPageProps } from "./pages/RetirementPlannerPage";

// ── Wizard (components/retirement/ — named exports) ───────────────────────
export { RetirementPlannerWizard } from "./components/retirement/RetirementPlannerWizard";
export type { RetirementPlannerWizardProps } from "./components/retirement/RetirementPlannerWizard";

export { RetirementProgressHeader } from "./components/retirement/RetirementProgressHeader";
export type { RetirementProgressHeaderProps } from "./components/retirement/RetirementProgressHeader";

// ── Step components (components/retirement/ — named exports) ───────────────
export { RetirementOverviewStep }    from "./components/retirement/RetirementOverviewStep";
export { RetirementGoalsStep }       from "./components/retirement/RetirementGoalsStep";
export { RetirementPositionStep }    from "./components/retirement/RetirementPositionStep";
export { RetirementAssumptionsStep } from "./components/retirement/RetirementAssumptionsStep";
export { RetirementResultsStep }     from "./components/retirement/RetirementResultsStep";
export { RetirementStrategiesStep }  from "./components/retirement/RetirementStrategiesStep";
export { RetirementNextStep }        from "./components/retirement/RetirementNextStep";

export type { RetirementOverviewStepProps }    from "./components/retirement/RetirementOverviewStep";
export type { RetirementGoalsStepProps }       from "./components/retirement/RetirementGoalsStep";
export type { RetirementPositionStepProps }    from "./components/retirement/RetirementPositionStep";
export type { RetirementAssumptionsStepProps } from "./components/retirement/RetirementAssumptionsStep";
export type { RetirementResultsStepProps }     from "./components/retirement/RetirementResultsStep";
export type { RetirementStrategiesStepProps }  from "./components/retirement/RetirementStrategiesStep";
export type { RetirementNextStepProps }        from "./components/retirement/RetirementNextStep";

// ── Legacy wizard (components/wizard/) — kept for backward compat ──────────
export { default as RetirementWizard } from "./components/wizard/RetirementWizard";
export type { RetirementWizardProps }  from "./components/wizard/RetirementWizard";

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  InvestmentPrimaryGoal,
  InvestmentHorizonBand,
  InvestmentLiquidityNeed,
  InvestmentTaxBand,
  InvestmentContributionStyle,
  InvestmentTFSAUsage,
  InvestmentRecommendationType,
  InvestmentPlannerOverview,
  InvestmentPlannerGoalStep,
  InvestmentPlannerHorizonStep,
  InvestmentPlannerTaxStep,
  InvestmentPlannerState,
  InvestmentDecisionInput,
  InvestmentPlannerReasonBlock,
  InvestmentDecisionOutput,
  InvestmentStrategyOutput,
  InvestmentPlannerResult,
  InvestmentPlannerMappingResult,
  WrapperMeta,
} from "./types/investmentPlanner.types";

export { WRAPPER_META } from "./types/investmentPlanner.types";

// ── Initial state ──────────────────────────────────────────────────────────
export { investmentPlannerInitialState } from "./data/investmentPlannerInitialState";

// ── Mapper ─────────────────────────────────────────────────────────────────
export {
  mapClientProfileToInvestmentPlanner,
  toDecisionInput,
  runDecisionEngine,
} from "./services/investmentPlannerMapper";

// ── Decision engine ────────────────────────────────────────────────────────
export {
  determineInvestmentRecommendation,
  labelRecommendation,
} from "./services/investmentDecisionEngine";

// ── Strategy builder ───────────────────────────────────────────────────────
export { buildInvestmentStrategyDirection } from "./services/investmentStrategyBuilder";

// ── Builder (convenience assembler) ───────────────────────────────────────
export { buildInvestmentPlannerResult } from "./services/investmentPlannerBuilder";

// ── Helpers ────────────────────────────────────────────────────────────────
export {
  labelInvestmentGoal,
  labelInvestmentHorizon,
  labelLiquidityNeed,
  labelTaxBand,
  labelContributionStyle,
  labelWrapperRecommendation,
  fmtInvestmentCurrency,
} from "./services/investmentPlannerHelpers";

// ── Step metadata ──────────────────────────────────────────────────────────
export { investmentPlannerSteps } from "./data/investmentPlannerSteps";
export type { InvestmentPlannerStepKey } from "./data/investmentPlannerSteps";

// ── Page ───────────────────────────────────────────────────────────────────
export { InvestmentPlannerPage } from "./pages/InvestmentPlannerPage";
export type { InvestmentPlannerPageProps } from "./pages/InvestmentPlannerPage";

// ── Wizard ─────────────────────────────────────────────────────────────────
export { InvestmentPlannerWizard } from "./components/investment/InvestmentPlannerWizard";
export type { InvestmentPlannerWizardProps } from "./components/investment/InvestmentPlannerWizard";

export { InvestmentProgressHeader } from "./components/investment/InvestmentProgressHeader";
export type { InvestmentProgressHeaderProps } from "./components/investment/InvestmentProgressHeader";

// ── Step components (named exports) ───────────────────────────────────────
export { InvestmentOverviewStep }       from "./components/investment/InvestmentOverviewStep";
export { InvestmentGoalStep }           from "./components/investment/InvestmentGoalStep";
export { InvestmentHorizonStep }        from "./components/investment/InvestmentHorizonStep";
export { InvestmentTaxStep }            from "./components/investment/InvestmentTaxStep";
export { InvestmentRecommendationStep } from "./components/investment/InvestmentRecommendationStep";
export { InvestmentStrategyStep }       from "./components/investment/InvestmentStrategyStep";
export { InvestmentNextStep }           from "./components/investment/InvestmentNextStep";

export type { InvestmentOverviewStepProps }       from "./components/investment/InvestmentOverviewStep";
export type { InvestmentGoalStepProps }           from "./components/investment/InvestmentGoalStep";
export type { InvestmentHorizonStepProps }        from "./components/investment/InvestmentHorizonStep";
export type { InvestmentTaxStepProps }            from "./components/investment/InvestmentTaxStep";
export type { InvestmentRecommendationStepProps } from "./components/investment/InvestmentRecommendationStep";
export type { InvestmentStrategyStepProps }       from "./components/investment/InvestmentStrategyStep";
export type { InvestmentNextStepProps }           from "./components/investment/InvestmentNextStep";

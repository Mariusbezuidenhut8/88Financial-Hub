/**
 * retirement-planner.types.ts
 *
 * All types for the @88fh/retirement-planner module.
 *
 * Numeric rate convention: percentages stored as integers/decimals
 * e.g. 10 = 10%  —  converted to 0.10 inside services via toDecimal().
 * This makes form field binding trivial and display code clean.
 *
 * Sections:
 *   1. Enums & presets
 *   2. Wizard step state
 *   3. Aggregated wizard state
 *   4. Projection IO types
 *   5. Result type
 *   6. Mapper types
 */

// ── 1. Enums & presets ─────────────────────────────────────────────────────

export type RetirementAssumptionPreset = "conservative" | "balanced" | "growth";

export type RetirementReadinessStatus = "behind" | "on_track" | "ahead" | "unknown";

/**
 * Preset assumption values — all rates stored as integer/decimal percentages.
 * e.g. preRetirementGrowth: 10 means 10% per year.
 */
export interface AssumptionPresetValues {
  preRetirementGrowth: number;
  postRetirementGrowth: number;
  inflation: number;
  planningAge: number;
  sustainableDrawdownRate: number;
}

export function getAssumptionPresetValues(
  preset: RetirementAssumptionPreset,
): AssumptionPresetValues {
  switch (preset) {
    case "conservative":
      return {
        preRetirementGrowth:     8,
        postRetirementGrowth:    6,
        inflation:               5,
        planningAge:             90,
        sustainableDrawdownRate: 4.5,
      };
    case "growth":
      return {
        preRetirementGrowth:     11,
        postRetirementGrowth:    7.5,
        inflation:               5,
        planningAge:             90,
        sustainableDrawdownRate: 5,
      };
    case "balanced":
    default:
      return {
        preRetirementGrowth:     10,
        postRetirementGrowth:    7,
        inflation:               5,
        planningAge:             90,
        sustainableDrawdownRate: 5,
      };
  }
}

// ── 2. Wizard step state ───────────────────────────────────────────────────

/** Step 1 — prefilled from master profile; read-only display */
export interface RetirementPlannerOverview {
  currentAge?: number;
  currentRetirementSavings?: number;
  currentMonthlyContribution?: number;
  monthlyIncome?: number;
}

/** Step 2 — target retirement outcome */
export interface RetirementPlannerGoals {
  targetRetirementAge?: number;
  desiredMonthlyIncome?: number;
  /** Whether desired income is expressed in today's money or future nominal money */
  incomeBasis?: "today_money" | "future_money";
}

/** Step 3 — confirm and refine current savings position */
export interface RetirementPlannerPosition {
  currentRetirementSavings?: number;
  monthlyContribution?: number;
  /** Annual step-up percentage for contributions — e.g. 5 = 5% */
  annualContributionIncrease?: number;
  includeNonRetirementAssets?: boolean;
  nonRetirementAssetsValue?: number;
}

/** Step 4 — planning assumptions (all rates as integer/decimal percentages) */
export interface RetirementPlannerAssumptions {
  preset?: RetirementAssumptionPreset;
  /** Annual nominal growth pre-retirement — e.g. 10 = 10% */
  preRetirementGrowth?: number;
  /** Annual nominal growth in retirement drawdown phase */
  postRetirementGrowth?: number;
  /** Annual CPI inflation — e.g. 5 = 5% */
  inflation?: number;
  /** Age to plan income to (life expectancy proxy) */
  planningAge?: number;
  /** Annual sustainable drawdown rate — e.g. 5 = 5% */
  sustainableDrawdownRate?: number;
}

// ── 3. Aggregated wizard state ─────────────────────────────────────────────

export interface RetirementPlannerState {
  overview:    RetirementPlannerOverview;
  goals:       RetirementPlannerGoals;
  position:    RetirementPlannerPosition;
  assumptions: RetirementPlannerAssumptions;
  result?:     RetirementPlannerResult;
}

// ── 4. Projection IO ───────────────────────────────────────────────────────

/**
 * RetirementProjectionInput
 *
 * Fully resolved, required input for the projection engine.
 * All rates as integer/decimal percentages (e.g. 10 = 10%).
 * Derived from RetirementPlannerState by retirementMapper.ts.
 */
export interface RetirementProjectionInput {
  currentAge:                  number;
  targetRetirementAge:         number;
  currentRetirementSavings:    number;
  monthlyContribution:         number;
  /** Annual step-up percentage — e.g. 5 = 5% */
  annualContributionIncrease:  number;
  includeNonRetirementAssets:  boolean;
  nonRetirementAssetsValue:    number;
  desiredMonthlyIncome:        number;
  incomeBasis:                 "today_money" | "future_money";
  /** Pre-retirement annual nominal growth — e.g. 10 = 10% */
  preRetirementGrowth:         number;
  /** Post-retirement annual nominal growth */
  postRetirementGrowth:        number;
  /** Annual CPI — e.g. 5 = 5% */
  inflation:                   number;
  planningAge:                 number;
  /** Annual drawdown rate — e.g. 5 = 5% */
  sustainableDrawdownRate:     number;
}

export interface RetirementProjectionOutput {
  yearsToRetirement:               number;
  projectedRetirementCapital:      number;
  /** Nominal monthly income the projected capital can sustain */
  estimatedMonthlyIncome:          number;
  /** Target monthly income (nominal, inflated if incomeBasis === "today_money") */
  targetMonthlyIncomeAtRetirement: number;
  /** Positive = shortfall (nominal); 0 if on track or surplus */
  monthlyIncomeGap:                number;
  readinessStatus:                 RetirementReadinessStatus;
}

/** Extended input for scenario calculations — carries baseline metrics */
export interface RetirementScenarioInput extends RetirementProjectionInput {
  baseProjectedMonthlyIncome: number;
  baseMonthlyIncomeGap:       number;
}

// ── 5. Result type ─────────────────────────────────────────────────────────

export interface RetirementStrategyOption {
  title:                  string;
  description:            string;
  projectedMonthlyIncome: number;
  monthlyIncomeGap:       number;
  metadata?:              Record<string, unknown>;
}

export interface RetirementPlannerResult {
  calculatedAt:               string;
  targetRetirementAge:        number;
  desiredMonthlyIncome:       number;
  projectedRetirementCapital: number;
  /** Nominal monthly income estimated at retirement */
  estimatedMonthlyIncome:     number;
  /** Nominal monthly gap (0 if on track or ahead) */
  monthlyIncomeGap:           number;
  readinessStatus:            RetirementReadinessStatus;
  assumptions: {
    preset?:                 RetirementAssumptionPreset;
    preRetirementGrowth:     number;
    postRetirementGrowth:    number;
    inflation:               number;
    planningAge:             number;
    sustainableDrawdownRate: number;
  };
  strategyOptions: {
    saveMore?:     RetirementStrategyOption;
    retireLater?:  RetirementStrategyOption;
    growthOption?: RetirementStrategyOption;
  };
  recommendations: string[];
  suggestAdvisor:  boolean;
  advisorReasons:  string[];
}

// ── 6. Mapper types ────────────────────────────────────────────────────────

export interface RetirementPlannerMappingResult {
  state:           RetirementPlannerState;
  mappingWarnings: string[];
}

// ── 7. Wizard prefill shape ────────────────────────────────────────────────

/**
 * RetirementPrefill
 *
 * Fields extracted from the master client profile (or passed by the host app)
 * to pre-populate the wizard. All fields are optional — the wizard handles
 * missing values gracefully and lets the user fill them in during the steps.
 */
export interface RetirementPrefill {
  currentAge?: number;
  currentRetirementSavings?: number;
  monthlyRetirementContribution?: number;
  monthlyGrossIncome?: number;
  targetRetirementAge?: number;
  desiredMonthlyIncomeAtRetirement?: number;
  riskTolerance?:
    | "conservative"
    | "moderately_conservative"
    | "balanced"
    | "growth"
    | "aggressive";
}

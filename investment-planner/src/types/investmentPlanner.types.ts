/**
 * investmentPlanner.types.ts
 *
 * All types for the @88fh/investment-planner module.
 *
 * Sections:
 *   1. Enums & union types
 *   2. Wizard step state
 *   3. Aggregated wizard state
 *   4. Decision engine input / output
 *   5. Result type
 *   6. Mapper types
 *   7. Wrapper display metadata
 */

// ── 1. Enums & union types ─────────────────────────────────────────────────

/** What the client is ultimately saving or investing for */
export type InvestmentPrimaryGoal =
  | "retirement"
  | "wealth_building"
  | "education"
  | "emergency_reserve"
  | "medium_term_goal"
  | "general_investing";

/** How long the money can remain invested */
export type InvestmentHorizonBand =
  | "under_3"   // under 3 years
  | "3_to_5"    // 3–5 years
  | "5_to_10"   // 5–10 years
  | "10_plus";  // 10 years and beyond

/** How important it is to be able to access the money */
export type InvestmentLiquidityNeed = "high" | "medium" | "low";

/** Broad PAYE / marginal tax band (simplified for v1) */
export type InvestmentTaxBand = "low" | "medium" | "high";

/** Whether a lump sum, monthly, or both funding styles apply */
export type InvestmentContributionStyle = "lump_sum" | "monthly" | "both";

/** Whether the client has used their TFSA allowance */
export type InvestmentTFSAUsage = "yes" | "no" | "not_sure";

/**
 * Primary investment wrapper recommendation.
 * "build_reserve_first" means the client needs to strengthen liquidity
 * before committing to any long-term wrapper.
 */
export type InvestmentRecommendationType =
  | "tfsa"
  | "ra"
  | "discretionary"
  | "endowment"
  | "combination"
  | "build_reserve_first";

// ── 2. Wizard step state ───────────────────────────────────────────────────

/** Step 1 — context pulled from master profile; read-only display */
export interface InvestmentPlannerOverview {
  monthlySavingsCapacity?:        number;
  currentRetirementContribution?: number;
  existingGoals?:                 string[];
  /** Estimated amount held in accessible emergency / cash savings */
  emergencyFundAmount?:           number;
  /** Monthly essential expenses — used for reserve adequacy check */
  monthlyEssentialExpenses?:      number;
}

/** Step 2 — what the investment is for */
export interface InvestmentPlannerGoalStep {
  primaryGoal?:       InvestmentPrimaryGoal;
  targetAmount?:      number;
  contributionStyle?: InvestmentContributionStyle;
}

/** Step 3 — time horizon and access requirements */
export interface InvestmentPlannerHorizonStep {
  horizonBand?:           InvestmentHorizonBand;
  liquidityNeed?:         InvestmentLiquidityNeed;
  /** Can the client commit to leaving this money until retirement? */
  canLockUntilRetirement?: boolean;
  /** Is this money earmarked for a specific planned event? */
  plannedUse?:             boolean;
}

/** Step 4 — contribution amounts and tax context */
export interface InvestmentPlannerTaxStep {
  monthlyContributionAmount?: number;
  lumpSumAmount?:             number;
  /** Does the client already have an active RA? */
  hasExistingRA?:             boolean;
  hasUsedTFSA?:               InvestmentTFSAUsage;
  taxBand?:                   InvestmentTaxBand;
  /** Does the client prioritise access and flexibility over tax efficiency? */
  wantsMaximumFlexibility?:   boolean;
}

// ── 3. Aggregated wizard state ─────────────────────────────────────────────

export interface InvestmentPlannerState {
  overview: InvestmentPlannerOverview;
  goal:     InvestmentPlannerGoalStep;
  horizon:  InvestmentPlannerHorizonStep;
  tax:      InvestmentPlannerTaxStep;
  result?:  InvestmentPlannerResult;
}

// ── 4. Decision engine input / output ─────────────────────────────────────

/**
 * InvestmentDecisionInput
 *
 * Fully resolved, non-optional input consumed by the decision engine.
 * Derived from InvestmentPlannerState by toDecisionInput().
 */
export interface InvestmentDecisionInput {
  primaryGoal:              InvestmentPrimaryGoal;
  horizonBand:              InvestmentHorizonBand;
  liquidityNeed:            InvestmentLiquidityNeed;
  canLockUntilRetirement:   boolean;
  plannedUse:               boolean;
  monthlyContributionAmount: number;
  lumpSumAmount:            number;
  hasExistingRA:            boolean;
  hasUsedTFSA:              InvestmentTFSAUsage;
  taxBand:                  InvestmentTaxBand;
  wantsMaximumFlexibility:  boolean;
  monthlySavingsCapacity:   number;
  emergencyFundAmount:      number;
  monthlyEssentialExpenses: number;
}

/** Shared reason/caution block used by decision output and result */
export interface InvestmentPlannerReasonBlock {
  reasons:  string[];
  cautions: string[];
}

/** Output from the decision engine — wrapper selection + reasons */
export interface InvestmentDecisionOutput extends InvestmentPlannerReasonBlock {
  primaryRecommendation:     InvestmentRecommendationType;
  alternativeRecommendation?: Exclude<InvestmentRecommendationType, "build_reserve_first">;
}

/** Output from the strategy builder */
export interface InvestmentStrategyOutput {
  strategyDirection: string[];
  suggestAdvisor:    boolean;
  advisorReasons:    string[];
}

// ── 5. Result type ─────────────────────────────────────────────────────────

export interface InvestmentPlannerResult extends InvestmentPlannerReasonBlock {
  calculatedAt:              string;
  primaryGoal:               InvestmentPrimaryGoal;
  horizonBand:               InvestmentHorizonBand;
  liquidityNeed:             InvestmentLiquidityNeed;
  primaryRecommendation:     InvestmentRecommendationType;
  alternativeRecommendation?: Exclude<InvestmentRecommendationType, "build_reserve_first">;
  /** Prioritised, plain-language strategy action steps */
  strategyDirection:         string[];
  /** True if an adviser conversation is recommended */
  suggestAdvisor:            boolean;
  advisorReasons:            string[];
}

// ── 6. Mapper types ────────────────────────────────────────────────────────

export interface InvestmentPlannerMappingResult {
  investmentPlannerState: InvestmentPlannerState;
  mappingWarnings:        string[];
}

// ── 7. Wrapper display metadata ────────────────────────────────────────────

export interface WrapperMeta {
  label:       string;
  shortLabel:  string;
  description: string;
}

export const WRAPPER_META: Record<InvestmentRecommendationType, WrapperMeta> = {
  tfsa: {
    label:       "Tax-Free Savings Account",
    shortLabel:  "TFSA",
    description: "Tax-efficient long-term growth with flexible access. Contributions count toward the annual R36 000 / lifetime R500 000 limit.",
  },
  ra: {
    label:       "Retirement Annuity",
    shortLabel:  "RA",
    description: "Retirement-focused wrapper with tax deductions on contributions. Funds are locked until retirement (age 55+).",
  },
  discretionary: {
    label:       "Discretionary Investment",
    shortLabel:  "Discretionary",
    description: "Flexible investing with no contribution limits or lock-in. Growth and income subject to standard tax treatment.",
  },
  endowment: {
    label:       "Endowment",
    shortLabel:  "Endowment",
    description: "Insurer-wrapped investment. Tax is capped at 30% within the wrapper — well suited to high-tax investors with a long horizon.",
  },
  combination: {
    label:       "Combination approach",
    shortLabel:  "Combination",
    description: "Split contributions across two or more wrappers to balance tax efficiency, flexibility, and long-term growth.",
  },
  build_reserve_first: {
    label:       "Build emergency reserve first",
    shortLabel:  "Reserve first",
    description: "Your liquidity position suggests strengthening your emergency fund before committing to long-term investment wrappers.",
  },
};

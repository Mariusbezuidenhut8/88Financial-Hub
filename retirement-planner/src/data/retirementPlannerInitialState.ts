import type { RetirementPlannerState } from "../types/retirement-planner.types";

/**
 * retirementPlannerInitialState
 *
 * Sensible defaults before any profile prefill or user input.
 * All numeric assumptions stored as integer/decimal percentages.
 *
 * The wizard initialises from buildInitialState(prefill) which merges
 * these defaults with values extracted from the master client profile.
 */
export const retirementPlannerInitialState: RetirementPlannerState = {
  overview: {
    currentAge:                 undefined,
    currentRetirementSavings:   undefined,
    currentMonthlyContribution: undefined,
    monthlyIncome:              undefined,
  },
  goals: {
    targetRetirementAge:  65,
    desiredMonthlyIncome: undefined,
    incomeBasis:          "today_money",
  },
  position: {
    currentRetirementSavings:    undefined,
    monthlyContribution:         undefined,
    annualContributionIncrease:  5,
    includeNonRetirementAssets:  false,
    nonRetirementAssetsValue:    0,
  },
  assumptions: {
    preset:                  "balanced",
    preRetirementGrowth:     10,
    postRetirementGrowth:    7,
    inflation:               5,
    planningAge:             90,
    sustainableDrawdownRate: 5,
  },
  result: undefined,
};

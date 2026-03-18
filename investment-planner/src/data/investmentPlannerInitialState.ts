import type { InvestmentPlannerState } from "../types/investmentPlanner.types";

/**
 * investmentPlannerInitialState
 *
 * Sensible defaults before any profile prefill or user input.
 * The mapper merges profile-sourced values on top of these defaults.
 */
export const investmentPlannerInitialState: InvestmentPlannerState = {
  overview: {
    monthlySavingsCapacity:        undefined,
    currentRetirementContribution: undefined,
    existingGoals:                 [],
    emergencyFundAmount:           undefined,
    monthlyEssentialExpenses:      undefined,
  },
  goal: {
    primaryGoal:       undefined,
    targetAmount:      undefined,
    contributionStyle: "monthly",
  },
  horizon: {
    horizonBand:            undefined,
    liquidityNeed:          undefined,
    canLockUntilRetirement: false,
    plannedUse:             false,
  },
  tax: {
    monthlyContributionAmount: undefined,
    lumpSumAmount:             undefined,
    hasExistingRA:             false,
    hasUsedTFSA:               "not_sure",
    taxBand:                   "medium",
    wantsMaximumFlexibility:   false,
  },
  result: undefined,
};

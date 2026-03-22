/**
 * protectionPlannerInitialState.ts
 *
 * Default wizard state for the Protection Planner.
 *
 * Defaults reflect SA best practice:
 *   incomeReplacementYears  — set by mapper from years to retirement
 *   educationFundPerChild   — R200 000 (entry-level university estimate)
 *   desiredLumpSumMonths    — 18 months gross income
 *   waitingPeriodDays       — 30 days (most common SA IP product)
 *   benefitPeriod           — to_age_65
 */

import type { ProtectionPlannerState } from "../types/protectionPlanner.types";

export const protectionPlannerInitialState: ProtectionPlannerState = {
  overview: {
    monthlyGrossIncome:                   undefined,
    monthlyNetIncome:                     undefined,
    yearsToRetirement:                    undefined,
    hasSpouseOrPartner:                   undefined,
    numberOfDependants:                   undefined,
    numberOfChildren:                     undefined,
    totalExistingLifeCover:               undefined,
    totalExistingMonthlyDisabilityBenefit: undefined,
    totalExistingDreadDiseaseCover:       undefined,
    totalCreditLifeCover:                 undefined,
    totalOutstandingDebt:                 undefined,
    existingPoliciesCount:                0,
    hasGroupRiskBenefit:                  undefined,
  },

  life: {
    incomeReplacementYears: undefined, // set by mapper (years to retirement)
    includeDebtInLifeNeed:  true,
    includeEducationFund:   false,
    educationFundPerChild:  200_000,
    additionalCapitalNeed:  undefined,
  },

  income: {
    desiredMonthlyBenefit: undefined, // set by mapper (75% of gross)
    benefitPeriod:         "to_age_65",
    waitingPeriodDays:     30,
    selfEmployed:          false,
  },

  dread: {
    wantsDreadDiseaseCover: undefined,
    desiredLumpSumMonths:   18,
    customLumpSumAmount:    undefined,
  },

  debt: {
    coverHomeLoan:       true,
    coverVehicleFinance: true,
    coverPersonalLoans:  true,
    coverOtherDebt:      false,
    additionalDebtAmount: undefined,
  },

  result: undefined,
};

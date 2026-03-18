/**
 * estatePlannerInitialState.ts
 *
 * Default wizard state for the Estate Planner.
 * Pre-set with SA-standard cost estimates and sensible inclusion flags.
 *
 * SA defaults:
 *   funeralCostsEstimate  = R50 000 (mid-range SA funeral)
 *   executorFeePercent    = 3.5%  (Masters Office-approved tariff, excl. VAT)
 *   estimatedOtherCosts   = R25 000 (conveyancing, Master's Office fees, misc)
 */

import type { EstatePlannerState } from "../types/estatePlanner.types";

export const estatePlannerInitialState: EstatePlannerState = {
  overview: {
    maritalStatus:         undefined,
    hasSpouseOrPartner:    undefined,
    numberOfChildren:      undefined,
    hasMinorChildren:      undefined,
    existingWill:          undefined,
    beneficiariesReviewed: undefined,
  },

  family: {
    hasWill:                 undefined,
    willLastUpdatedKnown:    undefined,
    nominatedGuardian:       undefined,
    hasMinorChildren:        undefined,
    beneficiariesReviewed:   undefined,
    executorChosen:          undefined,
    trustsInPlace:           undefined,
    specialBequests:         undefined,
    businessSuccessionNeeds: undefined,
  },

  estate: {
    includePrimaryResidence:    true,
    includeRetirementAssets:    false, // RA/pension typically excluded from dutiable estate
    includeLifeCover:           true,
    includeDiscretionaryAssets: true,
    includeBusinessAssets:      true,
    additionalAssetValue:       undefined,
    additionalLiabilityValue:   undefined,
  },

  liquidity: {
    funeralCostsEstimate:     50_000,
    executorFeePercent:       3.5,
    estimatedOtherCosts:      25_000,
    liquidityAvailableAtDeath: 0,
  },

  review: {
    beneficiaryNominationsUpdated: undefined,
    estateDistributionComplex:     undefined,
    anySpecialNeedsDependants:     undefined,
    crossBorderAssets:             undefined,
    notes:                         undefined,
  },

  result: undefined,
};

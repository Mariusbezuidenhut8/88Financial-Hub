/**
 * estatePlanner.types.ts
 *
 * All types for the Estate Planner wizard, analysis engine, and results.
 *
 * SA-specific figures baked in:
 *   — Estate duty abatement: R3 500 000
 *   — Estate duty rate:      20%
 *   — Executor fee default:  3.5% of gross estate
 */

// ── Enums ─────────────────────────────────────────────────────────────────

export type EstatePlanningUrgency =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type EstateReadinessStatus =
  | "basic_gaps"
  | "developing"
  | "strong_foundation"
  | "urgent_attention";

// ── Wizard step interfaces ─────────────────────────────────────────────────

/**
 * Overview step — pre-filled from client profile.
 * Read-only summary; no adviser input required.
 */
export interface EstatePlannerOverview {
  maritalStatus?:        string;
  hasSpouseOrPartner?:   boolean;
  numberOfChildren?:     number;
  hasMinorChildren?:     boolean;
  existingWill?:         boolean;
  beneficiariesReviewed?: boolean;
}

/**
 * Family & documents step — will, executor, guardianship, trusts.
 */
export interface EstatePlannerFamilyStep {
  hasWill?:                  boolean;
  willLastUpdatedKnown?:     boolean;
  nominatedGuardian?:        boolean;
  hasMinorChildren?:         boolean;
  beneficiariesReviewed?:    boolean;
  executorChosen?:           boolean;
  trustsInPlace?:            boolean;
  specialBequests?:          boolean;
  businessSuccessionNeeds?:  boolean;
}

/**
 * Estate value step — which asset categories to include in the gross estate.
 */
export interface EstatePlannerEstateStep {
  /** Include primary residence in estate valuation */
  includePrimaryResidence?:      boolean;
  /** Retirement assets (RA/pension) typically excluded from dutiable estate */
  includeRetirementAssets?:      boolean;
  /** Life cover paid into estate (not to a nominated beneficiary) */
  includeLifeCover?:             boolean;
  /** Unit trusts, EFTs, shares, TFSA, endowments */
  includeDiscretionaryAssets?:   boolean;
  /** Business interests / shares */
  includeBusinessAssets?:        boolean;
  /** Any additional assets not captured in profile */
  additionalAssetValue?:         number;
  /** Any additional liabilities not captured in profile */
  additionalLiabilityValue?:     number;
}

/**
 * Liquidity step — costs the estate must settle in cash.
 */
export interface EstatePlannerLiquidityStep {
  funeralCostsEstimate?:     number;
  executorFeePercent?:       number;
  estimatedOtherCosts?:      number;
  /** Cash + liquid assets available to the estate at death */
  liquidityAvailableAtDeath?: number;
}

/**
 * Review step — final complexity flags.
 */
export interface EstatePlannerReviewStep {
  beneficiaryNominationsUpdated?: boolean;
  estateDistributionComplex?:     boolean;
  anySpecialNeedsDependants?:     boolean;
  crossBorderAssets?:             boolean;
  notes?:                         string;
}

// ── Engine input / output ──────────────────────────────────────────────────

/**
 * EstateAnalysisInput — fully resolved values passed to the analysis engine.
 * Derived from EstatePlannerState by the mapper/builder.
 */
export interface EstateAnalysisInput {
  // ── Asset & liability values
  totalAssets:              number;
  totalLiabilities:         number;
  /** Value of retirement assets to EXCLUDE from dutiable estate */
  retirementAssetsExcluded: number;
  /** Life cover that will be paid INTO the estate (not to beneficiaries) */
  lifeCoverForLiquidity:    number;

  // ── Liquidity costs
  funeralCostsEstimate:    number;
  executorFeePercent:      number;
  estimatedOtherCosts:     number;
  liquidityAvailableAtDeath: number;

  // ── Estate documents & complexity flags
  hasWill:                     boolean;
  beneficiariesReviewed:       boolean;
  nominatedGuardian:           boolean;
  hasMinorChildren:            boolean;
  executorChosen:              boolean;
  estateDistributionComplex:   boolean;
  anySpecialNeedsDependants:   boolean;
  crossBorderAssets:           boolean;
}

/**
 * EstateAnalysisOutput — computed by the analysis engine.
 */
export interface EstateAnalysisOutput {
  // ── Valuations
  grossEstateValue:             number;
  netEstateValue:               number;
  estimatedExecutorFees:        number;
  estimatedEstateDuty:          number;

  // ── Liquidity
  estimatedLiquidityNeed:       number;
  estimatedLiquidityAvailable:  number;
  estimatedLiquidityShortfall:  number;

  // ── Assessment
  readinessStatus:  EstateReadinessStatus;
  urgency:          EstatePlanningUrgency;
  reasons:          string[];
  cautions:         string[];
  recommendedActions: string[];
}

// ── Wizard state ───────────────────────────────────────────────────────────

export interface EstatePlannerState {
  overview: EstatePlannerOverview;
  family:   EstatePlannerFamilyStep;
  estate:   EstatePlannerEstateStep;
  liquidity: EstatePlannerLiquidityStep;
  review:   EstatePlannerReviewStep;
  /** Set after analysis engine runs */
  result?:  EstatePlannerResult;
}

// ── Full result ────────────────────────────────────────────────────────────

export interface EstatePlannerResult extends EstateAnalysisOutput {
  calculatedAt: string; // ISO datetime
}

// ── Mapper result ──────────────────────────────────────────────────────────

export interface EstatePlannerMappingResult {
  estatePlannerState: EstatePlannerState;
  mappingWarnings:    string[];
}

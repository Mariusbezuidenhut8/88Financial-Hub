/**
 * protectionPlanner.types.ts
 *
 * All types for the Protection Planner wizard, needs engine, and results.
 *
 * Four pillars:
 *   1. Life cover           — income replacement + debt + education
 *   2. Income protection    — monthly disability income benefit
 *   3. Dread disease        — lump sum on severe illness diagnosis
 *   4. Debt cover           — outstanding liabilities covered at death / disability
 */

// ── Enums ──────────────────────────────────────────────────────────────────

export type ProtectionNeedType =
  | "life_cover"
  | "income_protection"
  | "dread_disease"
  | "debt_cover";

export type ProtectionGapSeverity =
  | "none"
  | "minor"
  | "moderate"
  | "significant"
  | "critical";

export type ProtectionReadinessStatus =
  | "well_covered"
  | "partially_covered"
  | "significant_gaps"
  | "critically_underinsured";

export type ProtectionPlanningUrgency =
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type IncomeProtectionBenefitPeriod =
  | "2_years"
  | "5_years"
  | "to_age_60"
  | "to_age_65";

// ── Wizard step interfaces ─────────────────────────────────────────────────

/**
 * Overview — pre-filled from profile; read-only summary.
 */
export interface ProtectionPlannerOverview {
  monthlyGrossIncome?:                  number;
  monthlyNetIncome?:                    number;
  yearsToRetirement?:                   number;
  hasSpouseOrPartner?:                  boolean;
  numberOfDependants?:                  number;
  numberOfChildren?:                    number;
  totalExistingLifeCover?:              number;
  totalExistingMonthlyDisabilityBenefit?: number;
  totalExistingDreadDiseaseCover?:      number;
  totalCreditLifeCover?:                number;
  totalOutstandingDebt?:                number;
  existingPoliciesCount?:               number;
  hasGroupRiskBenefit?:                 boolean;
}

/**
 * Life cover step — income replacement, debt, education needs.
 */
export interface ProtectionLifeStep {
  /** Number of years to replace income (default: years to retirement) */
  incomeReplacementYears?:  number;
  /** Roll outstanding debt into the life cover need */
  includeDebtInLifeNeed?:   boolean;
  /** Include an education fund per child */
  includeEducationFund?:    boolean;
  /** Estimated education cost per child (default: R200 000) */
  educationFundPerChild?:   number;
  /** Any once-off capital need beyond income + debt + education */
  additionalCapitalNeed?:   number;
}

/**
 * Income protection step — monthly disability income benefit.
 */
export interface ProtectionIncomeStep {
  /**
   * Target monthly benefit.
   * Default: 75% of gross income (SA insurer cap).
   */
  desiredMonthlyBenefit?:  number;
  /** How long the benefit pays — drives product selection */
  benefitPeriod?:          IncomeProtectionBenefitPeriod;
  /** Waiting period before benefit starts (days) */
  waitingPeriodDays?:      7 | 30 | 90 | 180;
  /** Self-employed affects product availability */
  selfEmployed?:           boolean;
}

/**
 * Dread disease step — lump sum on severe illness diagnosis.
 */
export interface ProtectionDreadStep {
  wantsDreadDiseaseCover?:  boolean;
  /**
   * Desired lump sum expressed as months of gross income.
   * Default: 18 months.
   */
  desiredLumpSumMonths?:    number;
  /** Override the months-based calculation with a specific rand amount */
  customLumpSumAmount?:     number;
}

/**
 * Debt cover step — which liabilities to include.
 */
export interface ProtectionDebtStep {
  coverHomeLoan?:       boolean;
  coverVehicleFinance?: boolean;
  coverPersonalLoans?:  boolean;
  coverOtherDebt?:      boolean;
  /** Additional debt not captured in profile */
  additionalDebtAmount?: number;
}

// ── Engine input / output ──────────────────────────────────────────────────

/**
 * ProtectionAnalysisInput — fully resolved values passed to the needs engine.
 */
export interface ProtectionAnalysisInput {
  // ── Income & horizon
  monthlyGrossIncome:       number;
  monthlyNetIncome:         number;
  yearsToRetirement:        number;

  // ── Dependants
  hasSpouseOrPartner:       boolean;
  numberOfDependants:       number;
  numberOfChildren:         number;

  // ── Life cover
  incomeReplacementYears:   number;
  existingLifeCover:        number;
  includeDebtInLifeNeed:    boolean;
  includeEducationFund:     boolean;
  educationFundPerChild:    number;
  additionalCapitalNeed:    number;

  // ── Income protection
  desiredMonthlyBenefit:             number; // monthly (75% of gross cap)
  existingMonthlyDisabilityBenefit:  number;
  benefitPeriod:                     IncomeProtectionBenefitPeriod;
  waitingPeriodDays:                 number;

  // ── Dread disease
  wantsDreadDiseaseCover:    boolean;
  desiredDreadDiseaseLumpSum: number;
  existingDreadDiseaseCover: number;

  // ── Debt cover
  debtToCover:             number; // sum of selected liabilities
  existingCreditLifeCover: number;
  totalOutstandingDebt:    number;

  // ── Context flags
  hasGroupRiskBenefit:     boolean;
}

/**
 * ProtectionGap — single pillar analysis result.
 */
export interface ProtectionGap {
  needType:       ProtectionNeedType;
  totalNeed:      number;
  existingCover:  number;
  gap:            number; // max(0, totalNeed - existingCover)
  severity:       ProtectionGapSeverity;
  reasons:        string[];
  cautions:       string[];
}

/**
 * ProtectionAnalysisOutput — full four-pillar needs analysis result.
 */
export interface ProtectionAnalysisOutput {
  lifeGap:             ProtectionGap;
  incomeProtectionGap: ProtectionGap;
  dreadDiseaseGap:     ProtectionGap;
  debtCoverGap:        ProtectionGap;
  overallReadiness:    ProtectionReadinessStatus;
  urgency:             ProtectionPlanningUrgency;
  reasons:             string[];
  cautions:            string[];
  recommendedActions:  string[];
}

// ── Wizard state ───────────────────────────────────────────────────────────

export interface ProtectionPlannerState {
  overview: ProtectionPlannerOverview;
  life:     ProtectionLifeStep;
  income:   ProtectionIncomeStep;
  dread:    ProtectionDreadStep;
  debt:     ProtectionDebtStep;
  result?:  ProtectionPlannerResult;
}

// ── Full result ────────────────────────────────────────────────────────────

export interface ProtectionPlannerResult extends ProtectionAnalysisOutput {
  calculatedAt: string; // ISO datetime
}

// ── Mapper result ──────────────────────────────────────────────────────────

export interface ProtectionPlannerMappingResult {
  protectionPlannerState: ProtectionPlannerState;
  mappingWarnings:        string[];
}

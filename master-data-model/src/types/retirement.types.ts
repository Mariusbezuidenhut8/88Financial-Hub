import { ID, ISODate, Currency, RiskTolerance } from "./common.types";

/**
 * RetirementVehicleRecord — a single retirement savings vehicle.
 * Stored as an array inside RetirementProfile.
 * Mirrors the same data captured in AssetRecord for retirement assets —
 * but kept here for the retirement engine's direct use.
 */
export interface RetirementVehicleRecord {
  /** REQUIRED */
  vehicleId: ID;

  /** REQUIRED */
  vehicleType:
    | "retirement_annuity"
    | "pension_fund"
    | "provident_fund"
    | "preservation_fund"
    | "living_annuity"
    | "government_pension"
    | "other";

  /** OPTIONAL */
  provider?: string;

  /** OPTIONAL */
  currentValue?: Currency;

  /** OPTIONAL */
  monthlyContribution?: Currency;

  /** OPTIONAL */
  fundGrowthRate?: number;

  /** OPTIONAL */
  notes?: string;
}

export type RetirementReadinessStatus =
  | "unknown"
  | "behind"
  | "slightly_behind"
  | "on_track"
  | "ahead";

/**
 * RetirementProfile — everything the Retirement Architect needs.
 * USED BY: Retirement Architect, Financial Health Score
 */
export interface RetirementProfile {
  // ── Goals ─────────────────────────────────────────────────────────────
  /** REQUIRED for retirement analysis */
  targetRetirementAge?: number;

  /** REQUIRED for retirement analysis — in today's money */
  desiredRetirementIncomeMonthly?: Currency;

  // ── Current state ──────────────────────────────────────────────────────
  /**
   * REQUIRED — aggregate of all retirement vehicle values.
   * Can be computed from retirementVehicles if populated.
   */
  currentRetirementSavings?: Currency;

  /** REQUIRED — total monthly retirement contributions */
  monthlyRetirementContribution?: Currency;

  /** REQUIRED — drives projected growth rate */
  riskTolerance?: RiskTolerance;

  /** OPTIONAL — adviser can override engine default */
  expectedReturnRate?: number;

  /** OPTIONAL — default 6% if absent */
  inflationAssumption?: number;

  /** OPTIONAL — expected years in retirement (default: age 100 minus retirement age) */
  expectedRetirementDuration?: number;

  // ── Vehicles ───────────────────────────────────────────────────────────
  /** REQUIRED (can be empty) — individual retirement savings vehicles */
  retirementVehicles: RetirementVehicleRecord[];

  // ── Status (computed by Retirement Architect) ─────────────────────────
  /** COMPUTED */
  retirementReadinessStatus?: RetirementReadinessStatus;

  /** COMPUTED — projected fund value at target retirement age */
  retirementCapitalProjected?: Currency;

  /** COMPUTED — capital required to fund desired income */
  retirementCapitalRequired?: Currency;

  /** COMPUTED — monthly contribution shortfall to close gap */
  monthlyContributionShortfall?: Currency;

  /** OPTIONAL */
  retirementNotes?: string;
}

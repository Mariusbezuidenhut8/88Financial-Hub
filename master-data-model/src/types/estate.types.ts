import { ISODate, Currency } from "./common.types";

/**
 * EstateProfile — everything the Estate Architect needs.
 * USED BY: Estate Architect, Financial Health Score (hasWill check)
 */
export interface EstateProfile {
  // ── Will ──────────────────────────────────────────────────────────────
  /** REQUIRED for health score */
  hasWill?: boolean;

  /** OPTIONAL — staleness check (>3 years = flag for review) */
  willLastUpdated?: ISODate;

  /** OPTIONAL */
  willStorageLocation?: string;

  // ── Executor ──────────────────────────────────────────────────────────
  /** OPTIONAL */
  executorChosen?: boolean;

  /** OPTIONAL */
  executorName?: string;

  /** OPTIONAL */
  alternateExecutorName?: string;

  // ── Guardianship ──────────────────────────────────────────────────────
  /** OPTIONAL — set if household has minor children */
  nominatedGuardian?: boolean;

  /** OPTIONAL */
  guardianName?: string;

  // ── Beneficiaries ─────────────────────────────────────────────────────
  /** OPTIONAL */
  beneficiariesReviewed?: boolean;

  /** OPTIONAL */
  beneficiaryReviewDate?: ISODate;

  // ── Trusts ────────────────────────────────────────────────────────────
  /** OPTIONAL */
  trustsInPlace?: boolean;

  /** OPTIONAL */
  trustType?: "inter_vivos" | "testamentary";

  /** OPTIONAL */
  trustName?: string;

  // ── Business succession ───────────────────────────────────────────────
  /** OPTIONAL */
  businessSuccessionNeeds?: boolean;

  /** OPTIONAL */
  hasSuccessionPlan?: boolean;

  // ── Special instructions ──────────────────────────────────────────────
  /** OPTIONAL */
  specialBequests?: boolean;

  /** OPTIONAL — free text for adviser notes */
  estateNotes?: string;

  // ── Computed (set by Estate Architect) ───────────────────────────────
  /** COMPUTED */
  estimatedNetEstate?: Currency;

  /** COMPUTED */
  estimatedEstateDuty?: Currency;

  /** COMPUTED */
  estimatedLiquidityNeed?: Currency;

  /** COMPUTED */
  estimatedLiquidityShortfall?: Currency;
}

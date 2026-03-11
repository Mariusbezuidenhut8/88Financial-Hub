import { ID, ISODate, PolicyType, Currency } from "./common.types";

/**
 * ProtectionPolicyRecord — a single insurance policy or medical aid record.
 * All policies are stored as a flat array on ClientProfile.
 *
 * USED BY: Financial Health Score, Protection Planner, Funeral Cover Studio,
 *          Estate Architect (life cover for liquidity), ROA Builder
 */
export interface ProtectionPolicyRecord {
  /** REQUIRED */
  policyId: ID;

  /** REQUIRED */
  policyType: PolicyType;

  /** REQUIRED */
  provider: string;

  /** OPTIONAL — policy reference number */
  policyNumber?: string;

  /** REQUIRED */
  owner: "self" | "spouse" | "employer" | "joint" | "other";

  /**
   * REQUIRED — list of who is covered.
   * Use identifiers like "self", "spouse", "child_1", "parent_1"
   * or the actual memberId from household.dependants.
   */
  livesCovered: string[];

  /** OPTIONAL — total sum assured or cover amount */
  coverAmount?: Currency;

  /** OPTIONAL */
  monthlyPremium?: Currency;

  /** OPTIONAL */
  policyStartDate?: ISODate;

  /** OPTIONAL */
  reviewDate?: ISODate;

  /** OPTIONAL */
  beneficiaryNominated?: boolean;

  /** REQUIRED */
  status: "active" | "lapsed" | "pending" | "paid_up" | "cancelled" | "unknown";

  /** OPTIONAL */
  notes?: string;
}

/**
 * MedicalAidRecord — kept separate from ProtectionPolicyRecord because
 * medical aid has distinct regulatory and planning logic.
 *
 * USED BY: Financial Health Score, Protection Planner
 */
export interface MedicalAidRecord {
  hasMedicalAid: boolean;
  provider?: string;
  planName?: string;
  membershipNumber?: string;
  monthlyPremium?: Currency;
  livesCovered?: number;
  hasGapCover?: boolean;
  gapCoverProvider?: string;
  gapCoverMonthlyPremium?: Currency;
}

import { CurrencyZAR } from "./common.types";

export type PolicyStatus = "active" | "lapsed" | "surrendered" | "paid_up" | "claim_in_progress";

export type ProtectionPolicyType =
  | "life_cover"
  | "funeral_cover"
  | "disability_lump_sum"
  | "disability_income_protection"
  | "severe_illness"
  | "income_protection"
  | "group_life"
  | "group_disability"
  | "credit_life"
  | "other";

export interface ProtectionPolicy {
  id: string;
  policyType: ProtectionPolicyType;
  provider: string;
  policyNumber?: string;
  status: PolicyStatus;
  owner: "self" | "spouse" | "employer";
  livesCovered: ("self" | "spouse" | "child" | "parent" | "extended")[];
  coverAmount: CurrencyZAR;
  monthlyPremium: CurrencyZAR;
  policyStartDate?: string;
  reviewDate?: string;
  beneficiaries?: { name: string; relationship: string; percentage: number }[];
  notes?: string;
}

export interface MedicalAidDetails {
  hasMedicalAid: boolean;
  provider?: string;
  planName?: string;
  membershipNumber?: string;
  monthlyPremium?: CurrencyZAR;
  livesCovered?: number;
  hasGapCover?: boolean;
  gapCoverProvider?: string;
  gapCoverPremium?: CurrencyZAR;
}

export interface Protection {
  policies: ProtectionPolicy[];
  medicalAid: MedicalAidDetails;

  // Computed by Protection Planner (stored here after analysis)
  totalLifeCover?: CurrencyZAR;
  totalFuneralCover?: CurrencyZAR;
  totalDisabilityCover?: CurrencyZAR;
  totalIncomeProtection?: CurrencyZAR;

  // Needs analysis gaps (set by Protection Planner tool)
  lifeCoverShortfall?: CurrencyZAR;
  funeralCoverShortfall?: CurrencyZAR;
  disabilityCoverShortfall?: CurrencyZAR;
  incomeProtectionShortfall?: CurrencyZAR;
}

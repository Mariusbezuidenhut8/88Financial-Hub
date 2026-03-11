import { CurrencyZAR } from "./common.types";

export interface EstatePlanning {
  // Will
  hasWill: boolean;
  willLastUpdated?: string;
  willStorageLocation?: string;
  executorAppointed?: boolean;
  executorName?: string;
  alternateExecutorName?: string;

  // Guardianship
  hasMinorChildren?: boolean;
  guardianAppointed?: boolean;
  guardianName?: string;

  // Beneficiaries
  beneficiariesReviewed?: boolean;
  beneficiaryReviewDate?: string;

  // Trusts
  hasTrust?: boolean;
  trustType?: "inter_vivos" | "testamentary";
  trustName?: string;
  trusteeNames?: string[];
  trustPurpose?: string;

  // Estate duty exposure (computed by Estate Architect)
  estimatedGrossEstate?: CurrencyZAR;
  estimatedEstateDuty?: CurrencyZAR;
  estimatedEstateLiquidityCosts?: CurrencyZAR;
  estimatedEstateLiquidityShortfall?: CurrencyZAR;
  hasLiquidityPlan?: boolean;

  // Business succession
  hasBusinessInterest?: boolean;
  hasSuccessionPlan?: boolean;
  businessSuccessionNotes?: string;

  // Special bequests / notes
  specialBequests?: string;
  estateNotes?: string;
}

import { EmploymentStatus, CurrencyZAR } from "./common.types";

/**
 * Employment — where the client works and how they earn.
 * Separated from CashFlow because it describes identity/context,
 * not money movement.
 *
 * USED BY: Financial Health Score, Protection Planner, Retirement Architect
 */
export interface Employment {
  /** REQUIRED — drives benefit eligibility, group cover checks */
  employmentStatus: EmploymentStatus;

  /** OPTIONAL — used in ROA narrative and advisor context */
  occupation?: string;

  /** OPTIONAL — used for group benefit checks */
  employerName?: string;

  /** REQUIRED — drives tax treatment and business-owner planning flags */
  isSelfEmployed: boolean;

  /** OPTIONAL — for business owners: ownership % used in estate valuation */
  businessOwnershipPercentage?: number;

  /** OPTIONAL — sector context for income stability assessment */
  sector?: "private" | "public" | "ngo" | "self" | "informal";

  /** OPTIONAL — used in retirement projections */
  yearsWithCurrentEmployer?: number;

  /** OPTIONAL — REQUIRED if employed: is there a group pension/provident fund? */
  hasGroupRetirementBenefit?: boolean;

  /** OPTIONAL — REQUIRED if employed: is there group life/disability cover? */
  hasGroupRiskBenefit?: boolean;
}

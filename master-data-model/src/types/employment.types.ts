import { ID, EmploymentStatus, Currency } from "./common.types";

/**
 * IncomeSourceRecord — a single additional income stream beyond primary employment.
 */
export interface IncomeSourceRecord {
  /** REQUIRED */
  sourceId: ID;

  /** REQUIRED */
  type:
    | "salary"
    | "bonus"
    | "rental"
    | "business_income"
    | "commission"
    | "maintenance"
    | "annuity_income"
    | "investment_income"
    | "other";

  /** OPTIONAL */
  description?: string;

  /** OPTIONAL */
  monthlyAmount?: Currency;

  /** OPTIONAL — for non-monthly income, used to compute monthly equivalent */
  frequency?: "monthly" | "quarterly" | "annually" | "ad_hoc";

  /** OPTIONAL — is this income variable or guaranteed? */
  isVariable?: boolean;

  /** OPTIONAL — whose income: client or spouse */
  owner?: "self" | "spouse";
}

/**
 * EmploymentProfile — where income comes from and employment context.
 * Income figures live HERE, not in CashFlow.
 *
 * USED BY: Financial Health Score, Protection Planner, Retirement Architect,
 *          Funeral Cover Studio
 */
export interface EmploymentProfile {
  /** REQUIRED — primary driver of benefit eligibility and planning flags */
  employmentStatus: EmploymentStatus;

  /** OPTIONAL */
  occupation?: string;

  /** OPTIONAL */
  employerName?: string;

  /** OPTIONAL — sector context for income stability and group benefit checks */
  industry?: string;

  /** OPTIONAL — sector type */
  sector?: "private" | "public" | "ngo" | "self" | "informal";

  /** OPTIONAL — clarifies self-employed when employmentStatus isn't explicit */
  selfEmployed?: boolean;

  /** OPTIONAL — for business owners: ownership % used in estate valuation */
  businessOwnershipPercentage?: number;

  /** OPTIONAL — years in current role (used in retirement projections) */
  yearsWithCurrentEmployer?: number;

  /** REQUIRED — primary gross income (before tax) */
  monthlyGrossIncome?: Currency;

  /** REQUIRED — net take-home; used in all affordability calculations */
  monthlyNetIncome?: Currency;

  /** OPTIONAL — income stability flag */
  variableIncome?: boolean;

  /** OPTIONAL — other income streams (rental, business, investment etc.) */
  otherIncomeSources: IncomeSourceRecord[];

  /** OPTIONAL — does employer-paid group pension/provident fund exist? */
  hasGroupRetirementBenefit?: boolean;

  /** OPTIONAL — does employer-paid group life/disability exist? */
  hasGroupRiskBenefit?: boolean;

  /** OPTIONAL — used in household income total and protection planning */
  spouseMonthlyIncome?: Currency;
}

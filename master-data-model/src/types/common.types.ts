/**
 * common.types.ts — shared primitives used across all domains.
 * All monetary values are CurrencyZAR (number, always in ZAR).
 */

/** Unique identifier — always a string */
export type ID = string;

/** ISO 8601 date only: YYYY-MM-DD */
export type ISODate = string;

/** ISO 8601 datetime: YYYY-MM-DDTHH:mm:ssZ */
export type ISODateTime = string;

/** All monetary values are in ZAR (South African Rand) */
export type Currency = number;

/** @deprecated Use Currency instead */
export type CurrencyZAR = number;

// ── Enums ─────────────────────────────────────────────────────────────────

export type MaritalStatus =
  | "single"
  | "married"
  | "married_in_community"
  | "married_out_of_community"
  | "life_partner"
  | "divorced"
  | "widowed"
  | "separated"
  | "unknown";

export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "business_owner"
  | "contractor"
  | "informal_income"
  | "unemployed"
  | "retired"
  | "pensioner"
  | "student"
  | "unknown";

export type Province =
  | "gauteng"
  | "western_cape"
  | "kwazulu_natal"
  | "eastern_cape"
  | "free_state"
  | "limpopo"
  | "mpumalanga"
  | "north_west"
  | "northern_cape"
  | "unknown";

export type PreferredLanguage =
  | "english"
  | "afrikaans"
  | "zulu"
  | "xhosa"
  | "sotho"
  | "tswana"
  | "venda"
  | "tsonga"
  | "pedi"
  | "ndebele"
  | "swati"
  | "other";

export type RiskTolerance =
  | "conservative"
  | "moderate"
  | "balanced"
  | "growth"
  | "aggressive";

export type GoalCategory =
  | "emergency_fund"
  | "retirement"
  | "education"
  | "home_purchase"
  | "debt_reduction"
  | "protection"
  | "estate_planning"
  | "wealth_building"
  | "business"
  | "other";

export type AssetType =
  | "cash"
  | "savings_account"
  | "money_market"
  | "fixed_deposit"
  | "unit_trust"
  | "shares"
  | "etf"
  | "tfsa"
  | "retirement_annuity"
  | "pension_fund"
  | "provident_fund"
  | "preservation_fund"
  | "living_annuity"
  | "endowment"
  | "property"
  | "business"
  | "vehicle"
  | "offshore_investment"
  | "crypto"
  | "other";

export type LiabilityType =
  | "home_loan"
  | "vehicle_finance"
  | "credit_card"
  | "overdraft"
  | "personal_loan"
  | "student_loan"
  | "business_loan"
  | "tax_debt"
  | "other";

export type PolicyType =
  | "life_cover"
  | "funeral_cover"
  | "disability_cover"
  | "severe_illness"
  | "income_protection"
  | "group_life"
  | "group_disability"
  | "credit_life"
  | "medical_aid"
  | "gap_cover"
  | "other";

export type DependantRelationship =
  | "spouse"
  | "partner"
  | "child"
  | "parent"
  | "grandparent"
  | "sibling"
  | "extended_family"
  | "other";

export type HealthScoreBand =
  | "strong"
  | "good_foundation"
  | "needs_attention"
  | "financial_stress_risk"
  | "urgent_action_needed";

export type AdviceCaseType =
  | "financial_health_check"
  | "retirement_planning"
  | "protection_planning"
  | "funeral_cover_planning"
  | "estate_planning"
  | "investment_planning"
  | "roa_generation"
  | "other";

export type AdviceCaseStatus =
  | "draft"
  | "in_progress"
  | "awaiting_client"
  | "awaiting_advisor"
  | "completed"
  | "cancelled";

export type DocumentType =
  | "record_of_advice"
  | "disclosure"
  | "needs_analysis"
  | "quotation"
  | "application_summary"
  | "client_report"
  | "consent_record"
  | "other";

export type AuditEventType =
  | "profile_created"
  | "profile_updated"
  | "tool_started"
  | "tool_completed"
  | "score_generated"
  | "recommendation_generated"
  | "document_created"
  | "disclosure_acknowledged"
  | "consent_captured"
  | "case_created"
  | "case_updated"
  | "advisor_note_added"
  | "other";

// ── Shared interfaces ──────────────────────────────────────────────────────

export interface Address {
  line1?: string;
  line2?: string;
  suburb?: string;
  city?: string;
  province?: Province;
  postalCode?: string;
  country?: string;
}

/** Record-level timestamps and actor tracking */
export interface AuditStamp {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  createdBy?: string;
  updatedBy?: string;
}

/** Simple date range — open-ended if `to` is absent */
export interface DateRange {
  from: ISODate;
  to?: ISODate;
}

import { AuditStamp } from "./common.types";
import { ClientIdentity, ContactDetails } from "./identity.types";
import { Household } from "./household.types";
import { Employment } from "./employment.types";
import { CashFlow } from "./cashflow.types";
import { Assets } from "./assets.types";
import { Protection } from "./protection.types";
import { RetirementPlanning } from "./retirement.types";
import { EstatePlanning } from "./estate.types";
import { Goals } from "./goals.types";

/**
 * ClientProfile — the reusable core of a client's financial life.
 *
 * This is the "capture once, reuse everywhere" layer.
 * Every planning tool reads from this. No tool writes computed
 * outputs back here — those go into PlatformRecord.toolOutputs.
 *
 * Structure mirrors how a good financial adviser thinks:
 * 1. Who are you?          → identity + contact
 * 2. Who depends on you?   → household
 * 3. How do you earn?      → employment
 * 4. What flows in/out?    → cashFlow
 * 5. What do you own?      → assets
 * 6. What do you owe?      → liabilities
 * 7. Are you protected?    → protection
 * 8. What about later?     → retirement
 * 9. What happens at end?  → estate
 * 10. What are you working towards? → goals
 */
export interface ClientProfile {
  // ── 1. Who are you? ───────────────────────────────────────────
  /** REQUIRED to create record */
  identity: ClientIdentity;

  /** REQUIRED to create record */
  contact: ContactDetails;

  // ── 2. Who depends on you? ────────────────────────────────────
  /** REQUIRED — household structure affects every planning domain */
  household: Household;

  // ── 3. How do you earn? ───────────────────────────────────────
  /** REQUIRED — employment context (stability, group benefits, self-employment) */
  employment: Employment;

  // ── 4. What flows in/out? ─────────────────────────────────────
  /** REQUIRED — income, expenses, savings rate, debt load */
  cashFlow: CashFlow;

  // ── 5. What do you own? ───────────────────────────────────────
  /**
   * REQUIRED (can be empty) — all assets by category.
   * Empty arrays are valid — "no assets" is a meaningful data point.
   */
  assets: Assets;

  // ── 6. What do you owe? ───────────────────────────────────────
  /**
   * REQUIRED (can be empty) — all liabilities.
   * Empty array = debt free (valid).
   */
  liabilities: Liability[];

  // ── 7. Are you protected? ─────────────────────────────────────
  /** REQUIRED — existing cover and medical aid; empty policies array is valid */
  protection: Protection;

  // ── 8. What about later? ──────────────────────────────────────
  /** OPTIONAL — populated when retirement planning section is visited */
  retirement?: RetirementPlanning;

  // ── 9. What happens at end? ───────────────────────────────────
  /** OPTIONAL — populated when estate planning section is visited */
  estate?: EstatePlanning;

  // ── 10. What are you working towards? ─────────────────────────
  /** OPTIONAL — populated when goals section is visited */
  goals?: Goals;

  // ── Profile metadata ──────────────────────────────────────────
  /**
   * COMPUTED — 0 to 100. Percentage of non-optional fields completed.
   * Updated on every profile save.
   */
  completionScore?: number;

  /**
   * Tracks which sections the client has visited/completed.
   * Used by onboarding flow and dashboard progress indicators.
   */
  completedSections?: ProfileSection[];

  /** ISO datetime of last profile edit by client or adviser */
  lastUpdatedAt?: string;
}

// ── Liability ─────────────────────────────────────────────────────────────

export interface Liability {
  /** REQUIRED */
  id: string;

  /** REQUIRED */
  type:
    | "home_loan"
    | "vehicle_finance"
    | "personal_loan"
    | "credit_card"
    | "overdraft"
    | "business_debt"
    | "student_loan"
    | "other";

  /** REQUIRED */
  provider: string;

  /** OPTIONAL */
  description?: string;

  /** REQUIRED */
  outstandingBalance: number;

  /** REQUIRED */
  monthlyRepayment: number;

  /** OPTIONAL — used in debt-to-income and estate calculations */
  interestRate?: number;

  /** OPTIONAL */
  remainingTermMonths?: number;

  /** REQUIRED */
  owner: "self" | "spouse" | "joint";

  /** REQUIRED — secured = has collateral (home loan, vehicle finance) */
  isSecured: boolean;

  /** OPTIONAL — asset serving as collateral */
  collateral?: string;
}

// ── Utility types ─────────────────────────────────────────────────────────

/**
 * ProfileSection — the 10 sections of the client profile.
 * Used by onboarding flow, completion tracking, and tool prefill logic.
 */
export type ProfileSection =
  | "identity"
  | "contact"
  | "household"
  | "employment"
  | "cashFlow"
  | "assets"
  | "liabilities"
  | "protection"
  | "retirement"
  | "estate"
  | "goals";

/**
 * PartialClientProfile — used during onboarding and incremental saves.
 * All sections optional so profile can be built progressively.
 */
export type PartialClientProfile = Partial<ClientProfile>;

/**
 * ProfileSectionStatus — per-section completion state for the dashboard.
 */
export interface ProfileSectionStatus {
  section: ProfileSection;
  isComplete: boolean;
  completedFieldCount: number;
  totalRequiredFieldCount: number;
  lastUpdatedAt?: string;
}

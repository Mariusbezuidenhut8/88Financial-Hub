import { AuditStamp } from "./common.types";
import { ClientIdentity, ContactDetails } from "./identity.types";
import { Household } from "./household.types";
import { CashFlow } from "./cashflow.types";
import { Assets } from "./assets.types";
import { Protection } from "./protection.types";
import { RetirementPlanning } from "./retirement.types";
import { EstatePlanning } from "./estate.types";
import { Goals } from "./goals.types";
import { ToolOutputs } from "./tool-outputs.types";
import { AdviceCase } from "./advice-case.types";
import { ComplianceRecord } from "./compliance.types";

/**
 * MasterClientProfile — the single source of truth for a client.
 *
 * Principle: Capture once, reuse everywhere.
 *
 * Separation of concerns:
 * - identity / household / cashflow / assets / protection / retirement / estate / goals
 *   = stable profile facts entered by client or adviser
 * - toolOutputs
 *   = computed results from planning engines (never mix with raw facts)
 * - adviceCases
 *   = traceable advice journeys with snapshots
 * - compliance
 *   = consent, disclosures, audit trail, documents
 */
export interface MasterClientProfile {
  // ── Core profile ──────────────────────────────────────────────
  identity: ClientIdentity;
  contact: ContactDetails;
  household: Household;
  cashFlow: CashFlow;
  assets: Assets;

  // Liabilities are inside assets (bonds, vehicle finance) and cashFlow (repayments)
  // Detailed liability list is here for completeness:
  liabilities: Liability[];

  protection: Protection;
  retirement: RetirementPlanning;
  estate: EstatePlanning;
  goals: Goals;

  // ── Tool outputs (computed, never raw facts) ──────────────────
  toolOutputs: ToolOutputs;

  // ── Advice journeys ───────────────────────────────────────────
  adviceCases: AdviceCase[];

  // ── Compliance & audit ────────────────────────────────────────
  compliance: ComplianceRecord;

  // ── Metadata ──────────────────────────────────────────────────
  audit: AuditStamp;
  profileVersion: number;            // Increment on breaking schema changes
  isArchived: boolean;
}

export interface Liability {
  id: string;
  type:
    | "home_loan"
    | "vehicle_finance"
    | "personal_loan"
    | "credit_card"
    | "overdraft"
    | "business_debt"
    | "student_loan"
    | "other";
  provider: string;
  description?: string;
  outstandingBalance: number;
  monthlyRepayment: number;
  interestRate?: number;
  remainingTermMonths?: number;
  owner: "self" | "spouse" | "joint";
  isSecured: boolean;
  collateral?: string;
}

/** Utility type for partial profile saves — allows incremental form completion */
export type PartialClientProfile = Partial<MasterClientProfile>;

/** Profile section keys — used for completion tracking and navigation */
export type ProfileSection =
  | "identity"
  | "contact"
  | "household"
  | "cashFlow"
  | "assets"
  | "liabilities"
  | "protection"
  | "retirement"
  | "estate"
  | "goals";

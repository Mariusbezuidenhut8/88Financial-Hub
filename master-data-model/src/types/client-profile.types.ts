import { ID, ISODateTime } from "./common.types";
import { Identity, ContactDetails } from "./identity.types";
import { HouseholdProfile } from "./household.types";
import { EmploymentProfile } from "./employment.types";
import { CashFlowProfile } from "./cashflow.types";
import { AssetRecord } from "./assets.types";
import { ProtectionPolicyRecord, MedicalAidRecord } from "./protection.types";
import { RetirementProfile } from "./retirement.types";
import { EstateProfile } from "./estate.types";
import { GoalRecord } from "./goals.types";
import { LiabilityType } from "./common.types";
import { Currency } from "./common.types";

/**
 * LiabilityRecord — a single debt or obligation.
 * Stored as a flat array on ClientProfile.
 *
 * USED BY: Protection Planner (debt-linked life cover), Estate Architect,
 *          Financial Health Score (debt-to-income)
 */
export interface LiabilityRecord {
  /** REQUIRED */
  liabilityId: ID;

  /** REQUIRED */
  liabilityType: LiabilityType;

  /** OPTIONAL */
  provider?: string;

  /** REQUIRED — human-readable label */
  description: string;

  /** OPTIONAL */
  outstandingBalance?: Currency;

  /** OPTIONAL */
  monthlyRepayment?: Currency;

  /** OPTIONAL */
  interestRate?: number;

  /** OPTIONAL */
  remainingTermMonths?: number;

  /** OPTIONAL — home loan, vehicle = secured */
  secured?: boolean;

  /** OPTIONAL */
  collateral?: string;

  /** OPTIONAL */
  owner?: "self" | "spouse" | "joint";

  /** OPTIONAL */
  notes?: string;
}

/**
 * ClientProfile — the reusable core of a client's financial life.
 *
 * This is the "capture once, reuse everywhere" layer.
 * Every planning tool reads from this. No tool writes computed
 * outputs back here — those go into PlatformRecord.toolOutputs.
 *
 * Structure mirrors how a good financial adviser thinks:
 * 1. Who are you?                → identity + contact
 * 2. Who depends on you?         → household
 * 3. How do you earn?            → employment (income lives here)
 * 4. What flows in/out?          → cashFlow (expenses live here)
 * 5. What do you own?            → assets[]
 * 6. What do you owe?            → liabilities[]
 * 7. Are you protected?          → protection[] + medicalAid
 * 8. What about later?           → retirement
 * 9. What happens at end?        → estate
 * 10. What are you working towards? → goals[]
 */
export interface ClientProfile {
  /** REQUIRED — platform-assigned unique identifier */
  clientId: ID;

  /** REQUIRED */
  profileStatus: "draft" | "active" | "archived";

  /** REQUIRED */
  createdAt: ISODateTime;

  /** REQUIRED */
  updatedAt: ISODateTime;

  // ── 1. Who are you? ─────────────────────────────────────────────────
  /** REQUIRED to create record — minimum: firstName + lastName + maritalStatus */
  identity: Identity;

  /** REQUIRED to create record — minimum: mobileNumber or emailAddress */
  contact: ContactDetails;

  // ── 2. Who depends on you? ──────────────────────────────────────────
  /** REQUIRED — household structure affects every planning domain */
  household: HouseholdProfile;

  // ── 3. How do you earn? ─────────────────────────────────────────────
  /**
   * REQUIRED — employmentStatus required; income figures strongly recommended.
   * Income (monthlyGrossIncome, monthlyNetIncome) lives here.
   */
  employment: EmploymentProfile;

  // ── 4. What flows in/out? ───────────────────────────────────────────
  /**
   * REQUIRED — expense figures strongly recommended for health score.
   * All fields optional to allow incremental completion.
   */
  cashFlow: CashFlowProfile;

  // ── 5. What do you own? ─────────────────────────────────────────────
  /**
   * REQUIRED (can be empty array).
   * Flat array of all assets regardless of type.
   * Filter by assetRecord.assetType to get specific categories.
   */
  assets: AssetRecord[];

  // ── 6. What do you owe? ─────────────────────────────────────────────
  /**
   * REQUIRED (can be empty array).
   * Empty array = debt free (valid and meaningful).
   */
  liabilities: LiabilityRecord[];

  // ── 7. Are you protected? ───────────────────────────────────────────
  /**
   * REQUIRED (can be empty array).
   * Flat array of all protection policies.
   * Filter by policyType to get specific cover types.
   */
  protection: ProtectionPolicyRecord[];

  /** OPTIONAL — medical aid is kept separate from protection policies */
  medicalAid?: MedicalAidRecord;

  // ── 8. What about later? ────────────────────────────────────────────
  /** OPTIONAL — populated when Retirement Architect is first visited */
  retirement?: RetirementProfile;

  // ── 9. What happens at end? ─────────────────────────────────────────
  /** OPTIONAL — populated when Estate Architect is first visited */
  estate?: EstateProfile;

  // ── 10. What are you working towards? ───────────────────────────────
  /** OPTIONAL (can be empty array) — populated when Goals section is visited */
  goals?: GoalRecord[];

  // ── Profile metadata ─────────────────────────────────────────────────
  /**
   * COMPUTED — 0 to 100.
   * Percentage of recommended fields that are populated.
   * Updated on every profile save.
   */
  completionScore?: number;

  /**
   * Tracks which sections the client has completed.
   * Used by onboarding progress indicators and tool unlock logic.
   */
  completedSections?: ProfileSection[];
}

// ── Utility types ──────────────────────────────────────────────────────────

/**
 * ProfileSection — the 10 logical sections of the client profile.
 * Used by onboarding flow, completion tracking, and prefill logic.
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
 * PartialClientProfile — all sections optional.
 * Used during onboarding for incremental saves.
 */
export type PartialClientProfile = Partial<ClientProfile>;

/**
 * ProfileSectionStatus — completion state for a single profile section.
 * Used by dashboard progress components.
 */
export interface ProfileSectionStatus {
  section: ProfileSection;
  isComplete: boolean;
  completedFieldCount: number;
  totalRequiredFieldCount: number;
  lastUpdatedAt?: ISODateTime;
}

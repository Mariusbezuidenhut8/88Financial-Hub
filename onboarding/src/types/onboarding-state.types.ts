import type { FinancialHealthScoreResult } from "./financial-health.types";

/**
 * OnboardingState — the lightweight data model used during the onboarding wizard.
 *
 * Principle: collect only what is needed for:
 * 1. Creating a master ClientProfile
 * 2. Calculating a Financial Health Score
 * 3. Routing to the most relevant advice tool
 *
 * This is NOT the full ClientProfile. It is a simplified, user-friendly
 * intermediary that is mapped into ClientProfile by onboardingMapper.ts
 * after completion.
 *
 * Progressive disclosure: each step only adds its own slice.
 * All fields are optional so partial saves work at any step.
 */

export type OnboardingStep =
  | "welcome"
  | "about"
  | "family"
  | "income"
  | "spending"
  | "savings"
  | "protection_estate"
  | "priorities"
  | "results";

export type MaritalStatus =
  | "single"
  | "married"
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
  | "northern_cape";

export type MonthEndPosition =
  | "comfortable_surplus"  // Usually have R1 000+ left over
  | "small_surplus"         // Just enough
  | "break_even"            // About zero
  | "shortfall";             // Usually run short

export type HelpTiming =
  | "exploring"   // Just looking around
  | "soon"         // Want help in the next few weeks
  | "ready_now";   // Ready to act today

export type Priority =
  | "retire_comfortably"
  | "protect_my_family"
  | "reduce_debt"
  | "build_emergency_fund"
  | "invest_better"
  | "plan_my_estate"
  | "fund_education"
  | "prepare_funeral_cover"
  | "improve_cash_flow"
  | "get_medical_cover";

export type BeneficiaryStatus = "yes" | "no" | "not_sure";

// ── Step state slices ──────────────────────────────────────────────────────

export interface AboutState {
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  /** SA ID number — used to derive dateOfBirth and age */
  idNumber?: string;
  /** YYYY-MM-DD — used if idNumber is not provided */
  dateOfBirth?: string;
  /** Derived from idNumber or dateOfBirth */
  age?: number;
  gender?: "male" | "female" | "prefer_not_to_say";
  province?: Province;
  preferredLanguage?: string;
}

export interface FamilyState {
  maritalStatus?: MaritalStatus;
  hasSpouseOrPartner?: boolean;
  numberOfChildren?: number;
  hasMinorChildren?: boolean;
  numberOfDependentAdults?: number;
  parentsSupported?: number;
  extendedFamilySupported?: number;
}

export interface IncomeState {
  employmentStatus?: EmploymentStatus;
  occupation?: string;
  /** Primary monthly take-home after tax */
  monthlyNetIncome?: number;
  /** Before-tax monthly income — optional at onboarding */
  monthlyGrossIncome?: number;
  /** Additional regular income (rental, business, etc.) */
  otherRegularMonthlyIncome?: number;
}

export interface SpendingState {
  monthlyEssentialExpenses?: number;
  monthlyLifestyleExpenses?: number;
  monthlyDebtRepayments?: number;
  /** High-level debt types — exact amounts captured in Protection Planner later */
  debtTypes?: ("home_loan" | "vehicle_finance" | "credit_card" | "personal_loan" | "none")[];
  monthEndPosition?: MonthEndPosition;
}

export interface SavingsState {
  emergencySavingsAmount?: number;
  retirementSavingsTotal?: number;
  monthlyRetirementContribution?: number;
  monthlySavings?: number;
  hasNonRetirementInvestments?: boolean;
  nonRetirementInvestmentsTotal?: number;
}

export interface ProtectionEstateState {
  hasLifeCover?: boolean;
  lifeCoverAmountEstimate?: number;
  hasFuneralCover?: boolean;
  funeralCoverAmountEstimate?: number;
  hasDisabilityOrIncomeProtection?: boolean;
  hasMedicalAid?: boolean;
  hasWill?: boolean;
  beneficiaryNominationsUpdated?: BeneficiaryStatus;
}

export interface PrioritiesState {
  /** Up to 3 selected from Priority type */
  selectedPriorities?: Priority[];
  helpTiming?: HelpTiming;
}

// ── Root onboarding state ──────────────────────────────────────────────────

/**
 * OnboardingState — the full wizard state object.
 * Persisted to localStorage during the session.
 * Mapped to ClientProfile on completion.
 */
export interface OnboardingState {
  /** Current step the user is on */
  currentStep: OnboardingStep;

  /** Steps the user has visited and saved */
  completedSteps: OnboardingStep[];

  /** Step data slices — each populated as user progresses */
  about: AboutState;
  family: FamilyState;
  income: IncomeState;
  spending: SpendingState;
  savings: SavingsState;
  protectionEstate: ProtectionEstateState;
  priorities: PrioritiesState;

  /** Set after results step — never populated during data entry */
  healthScore?: FinancialHealthScoreResult;

  /** Set after routing logic runs */
  recommendedTools?: RecommendedTool[];

  /** ISO datetime — when onboarding was started */
  startedAt?: string;

  /** ISO datetime — when onboarding was completed */
  completedAt?: string;
}

export interface RecommendedTool {
  toolId: "funeral_cover_studio" | "retirement_architect" | "protection_planner" | "estate_architect" | "investment_planner";
  label: string;
  reason: string;
  /** 1 = highest priority */
  priority: 1 | 2 | 3;
  isUrgent: boolean;
}

/** Initial blank onboarding state */
export const INITIAL_ONBOARDING_STATE: OnboardingState = {
  currentStep: "welcome",
  completedSteps: [],
  about: {},
  family: {},
  income: {},
  spending: {},
  savings: {},
  protectionEstate: {},
  priorities: {},
};

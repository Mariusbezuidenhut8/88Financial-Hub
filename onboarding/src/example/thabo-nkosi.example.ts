/**
 * Example: Thabo Nkosi — end-to-end onboarding flow
 *
 * Demonstrates the full intelligence loop:
 *   OnboardingState → calculateHealthScore → recommendTools → mapOnboardingToClientProfile
 *
 * Field-name reference:
 *   about       (not basicInfo)
 *   family      (not household)
 *   spending    (not cashFlow)
 *   spending.debtTypes[]  (not hasVehicleFinance / hasPersonalLoan / hasCreditCardDebt booleans)
 *   savings.monthlySavings  (not monthlyNonRetirementSavings)
 *   about.age   (not basicInfo.derivedAge)
 */

import { INITIAL_ONBOARDING_STATE } from "../types/onboarding-state.types";
import { calculateHealthScore } from "../services/health-score-calculator";
import { recommendTools } from "../services/recommendation-router";
import { mapOnboardingToClientProfile } from "../services/onboarding-mapper";
import type { OnboardingState } from "../types/onboarding-state.types";

// ── Sample state ──────────────────────────────────────────────────────────────

export const thaboNkosiOnboardingState: OnboardingState = {
  ...INITIAL_ONBOARDING_STATE,
  currentStep: "results",
  completedSteps: [
    "welcome", "about", "family", "income",
    "spending", "savings", "protection_estate", "priorities",
  ],
  startedAt: "2026-03-12T09:00:00.000Z",

  // ── 1. About ───────────────────────────────────────────────────────────
  about: {
    firstName: "Thabo",
    lastName: "Nkosi",
    mobileNumber: "0821234567",
    emailAddress: "thabo@example.com",
    age: 41,
    gender: "male",
    province: "gauteng",
    preferredLanguage: "english",
  },

  // ── 2. Family ──────────────────────────────────────────────────────────
  family: {
    maritalStatus: "married",
    hasSpouseOrPartner: true,
    numberOfChildren: 2,
    hasMinorChildren: true,
    numberOfDependentAdults: 0,
    parentsSupported: 0,
    extendedFamilySupported: 0,
  },

  // ── 3. Income ──────────────────────────────────────────────────────────
  income: {
    employmentStatus: "employed",
    occupation: "Senior Engineer",
    monthlyGrossIncome: 45000,
    monthlyNetIncome: 35000,
  },

  // ── 4. Spending ────────────────────────────────────────────────────────
  spending: {
    monthlyEssentialExpenses: 18000,
    monthlyLifestyleExpenses: 10000,
    monthlyDebtRepayments: 6000,
    // Debt types drive the debt quality component of the score
    debtTypes: ["vehicle_finance", "home_loan"],
    monthEndPosition: "small_surplus",
  },

  // ── 5. Savings ─────────────────────────────────────────────────────────
  savings: {
    emergencySavingsAmount: 50000,
    retirementSavingsTotal: 650000,
    monthlyRetirementContribution: 4000,
    monthlySavings: 1500,             // non-retirement discretionary savings
    hasNonRetirementInvestments: true,
    nonRetirementInvestmentsTotal: 80000,
  },

  // ── 6. Protection & estate ─────────────────────────────────────────────
  protectionEstate: {
    hasLifeCover: true,
    hasFuneralCover: true,
    hasDisabilityOrIncomeProtection: false,
    hasMedicalAid: true,
    hasWill: false,
    beneficiaryNominationsUpdated: "no",
  },

  // ── 7. Priorities ──────────────────────────────────────────────────────
  priorities: {
    selectedPriorities: ["retire_comfortably", "protect_my_family", "plan_my_estate"],
    helpTiming: "soon",
  },
};

// ── Run the loop ──────────────────────────────────────────────────────────────

const score = calculateHealthScore(thaboNkosiOnboardingState);
const tools = recommendTools(thaboNkosiOnboardingState, score);
const { clientProfile } = mapOnboardingToClientProfile(thaboNkosiOnboardingState);

export { score, tools, clientProfile };

/*
  Expected score output (approximate):
  {
    calculatedAt: "2026-03-12T...",
    overallScore: 62,
    band: "needs_attention",
    categoryScores: {
      cashFlow: 12,    // small_surplus (7) + savingsRate ~15.7% (10) → capped 20
      debt: 16,        // DTI 17.1% → ratioScore 12 + vehicle_finance only → qualityScore 7
      emergencyFund: 10, // 50000/18000 = 2.8 months → bracket 2–4 months
      protection: 15,  // life✓ hasDependants→6, funeral✓→4, disability✗→0, medical✓→3, no will→0
      retirement: 9    // contribution rate 8.9% (gross) → 7pts; 650k/540k annual = 1.2× vs 4× target→3pts
    },
    priorityActions: [
      "Increase retirement savings and review your long-term plan.",
      "Review your family protection, funeral cover, and risk benefits.",
      "Put a valid will in place and review beneficiary nominations."
    ],
    breakdown: {
      savingsRate: 0.157,           // (4000+1500)/35000
      debtToIncomeRatio: 0.171,     // 6000/35000
      emergencyMonths: 2.78,        // 50000/18000
      retirementContributionRate: 0.089  // 4000/45000
    }
  }
*/

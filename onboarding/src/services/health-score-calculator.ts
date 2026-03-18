import { OnboardingState } from "../types/onboarding-state.types";
import type {
  FinancialHealthBand,
  FinancialHealthScoreResult,
} from "../types/financial-health.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getBand(score: number): FinancialHealthBand {
  if (score >= 80) return "strong";
  if (score >= 65) return "good_foundation";
  if (score >= 50) return "needs_attention";
  if (score >= 35) return "financial_stress_risk";
  return "urgent_action_needed";
}

/** Returns undefined when denominator is zero or missing — avoids /0 errors */
function safeDivide(numerator?: number, denominator?: number): number | undefined {
  if (!numerator || !denominator || denominator <= 0) return undefined;
  return numerator / denominator;
}

// ── Category calculators ──────────────────────────────────────────────────────

/**
 * CASH FLOW SCORE (0–20)
 * - Savings rate component (0–10): how much of net income is saved each month
 * - Month-end resilience component (0–10): subjective month-end position
 */
function calculateCashFlowScore(state: OnboardingState): {
  score: number;
  savingsRate?: number;
} {
  const netIncome = state.income.monthlyNetIncome ?? 0;
  const monthlySavings = state.savings.monthlySavings ?? 0;
  const retirementContribution = state.savings.monthlyRetirementContribution ?? 0;
  const totalSaved = monthlySavings + retirementContribution;
  const savingsRate = safeDivide(totalSaved, netIncome);

  let savingsRateScore = 0;
  const rate = savingsRate ?? 0;
  if (rate >= 0.15) savingsRateScore = 10;
  else if (rate >= 0.10) savingsRateScore = 8;
  else if (rate >= 0.05) savingsRateScore = 5;
  else if (rate > 0) savingsRateScore = 2;

  let monthEndScore = 0;
  switch (state.spending.monthEndPosition) {
    case "comfortable_surplus":
      monthEndScore = 10;
      break;
    case "small_surplus":
      monthEndScore = 7;
      break;
    case "break_even":
      monthEndScore = 4;
      break;
    case "shortfall":
      monthEndScore = 0;
      break;
    default:
      monthEndScore = 4; // unknown — neutral
  }

  return {
    score: clamp(savingsRateScore + monthEndScore, 0, 20),
    savingsRate,
  };
}

/**
 * DEBT SCORE (0–20)
 * - Debt repayment ratio component (0–12): debt repayments as % of income
 * - Debt quality component (0–8): penalises expensive unsecured debt types
 */
function calculateDebtScore(state: OnboardingState): {
  score: number;
  debtToIncomeRatio?: number;
} {
  const netIncome = state.income.monthlyNetIncome ?? 0;
  const debtRepayments = state.spending.monthlyDebtRepayments ?? 0;
  const debtToIncomeRatio = safeDivide(debtRepayments, netIncome);
  const ratio = debtToIncomeRatio ?? 0;

  let ratioScore = 0;
  if (ratio < 0.20) ratioScore = 12;
  else if (ratio < 0.30) ratioScore = 9;
  else if (ratio < 0.40) ratioScore = 5;
  else if (ratio < 0.50) ratioScore = 2;

  const debtTypes = state.spending.debtTypes ?? [];
  let qualityScore = 8;
  if (debtTypes.includes("credit_card")) qualityScore -= 3;
  if (debtTypes.includes("personal_loan")) qualityScore -= 3;
  if (debtTypes.includes("vehicle_finance")) qualityScore -= 1;
  qualityScore = clamp(qualityScore, 0, 8);

  return {
    score: clamp(ratioScore + qualityScore, 0, 20),
    debtToIncomeRatio,
  };
}

/**
 * EMERGENCY FUND SCORE (0–20)
 * Based on months of essential expenses covered by current emergency savings.
 */
function calculateEmergencyFundScore(state: OnboardingState): {
  score: number;
  emergencyMonths?: number;
} {
  const emergencySavings = state.savings.emergencySavingsAmount ?? 0;
  const essentialExpenses = state.spending.monthlyEssentialExpenses ?? 0;
  const emergencyMonths = safeDivide(emergencySavings, essentialExpenses);
  const months = emergencyMonths ?? 0;

  let score = 0;
  if (months >= 6) score = 20;
  else if (months >= 4) score = 15;
  else if (months >= 2) score = 10;
  else if (months >= 1) score = 5;

  return { score, emergencyMonths };
}

/**
 * PROTECTION SCORE (0–20)
 * Not actuarial — practical presence/absence scoring weighted for South African risk profile.
 * Life cover weight is reduced when there are no dependants.
 */
function calculateProtectionScore(state: OnboardingState): { score: number } {
  const { family, protectionEstate } = state;

  const hasDependants =
    (family.hasSpouseOrPartner ?? false) ||
    (family.numberOfChildren ?? 0) > 0 ||
    (family.numberOfDependentAdults ?? 0) > 0 ||
    (family.parentsSupported ?? 0) > 0 ||
    (family.extendedFamilySupported ?? 0) > 0;

  let score = 0;

  // Funeral cover (max 4)
  if (protectionEstate.hasFuneralCover === true) score += 4;
  else if (protectionEstate.hasFuneralCover === undefined) score += 2; // unknown — partial credit

  // Life cover (max 6 with dependants, max 4 without)
  if (hasDependants) {
    if (protectionEstate.hasLifeCover === true) score += 6;
    else if (protectionEstate.hasLifeCover === undefined) score += 2;
  } else {
    if (protectionEstate.hasLifeCover === true) score += 4;
    else score += 3; // not urgent without dependants
  }

  // Disability / income protection (max 4)
  if (protectionEstate.hasDisabilityOrIncomeProtection === true) score += 4;
  else if (protectionEstate.hasDisabilityOrIncomeProtection === undefined) score += 1;

  // Medical aid (max 3)
  if (protectionEstate.hasMedicalAid === true) score += 3;
  else if (protectionEstate.hasMedicalAid === undefined) score += 1;

  // Will + beneficiary nominations (max 3)
  if (
    protectionEstate.hasWill === true &&
    protectionEstate.beneficiaryNominationsUpdated === "yes"
  ) {
    score += 3;
  } else if (
    protectionEstate.hasWill === true ||
    protectionEstate.beneficiaryNominationsUpdated === "yes"
  ) {
    score += 1;
  }

  return { score: clamp(score, 0, 20) };
}

/**
 * RETIREMENT SCORE (0–20)
 * - Contribution rate component (0–10): monthly retirement contribution as % of gross income
 * - Capital progress component (0–10): accumulated savings vs age-bracket benchmark multiple
 *
 * Benchmarks (savings as multiple of annual income):
 *   < 30: 1×  |  30–39: 2×  |  40–49: 4×  |  50–59: 6×  |  60+: 7×
 */
function calculateRetirementScore(state: OnboardingState): {
  score: number;
  retirementContributionRate?: number;
} {
  const grossIncome = state.income.monthlyGrossIncome ?? state.income.monthlyNetIncome ?? 0;
  const retirementContribution = state.savings.monthlyRetirementContribution ?? 0;
  const retirementSavingsTotal = state.savings.retirementSavingsTotal ?? 0;
  const age = state.about.age ?? 0;

  const retirementContributionRate = safeDivide(retirementContribution, grossIncome);
  const rate = retirementContributionRate ?? 0;

  let contributionScore = 0;
  if (rate >= 0.15) contributionScore = 10;
  else if (rate >= 0.10) contributionScore = 7;
  else if (rate >= 0.05) contributionScore = 4;
  else if (rate > 0) contributionScore = 2;

  let progressScore = 0;
  const annualIncome = grossIncome * 12;

  if (!age || !annualIncome) {
    progressScore = 3; // insufficient data — neutral
  } else {
    const multiple = retirementSavingsTotal / annualIncome;
    if (age < 30) {
      progressScore = multiple >= 1 ? 10 : multiple >= 0.5 ? 6 : multiple > 0 ? 3 : 0;
    } else if (age < 40) {
      progressScore = multiple >= 2 ? 10 : multiple >= 1 ? 6 : multiple > 0 ? 3 : 0;
    } else if (age < 50) {
      progressScore = multiple >= 4 ? 10 : multiple >= 2 ? 6 : multiple > 0 ? 3 : 0;
    } else if (age < 60) {
      progressScore = multiple >= 6 ? 10 : multiple >= 3 ? 6 : multiple > 0 ? 3 : 0;
    } else {
      progressScore = multiple >= 7 ? 10 : multiple >= 4 ? 6 : multiple > 0 ? 3 : 0;
    }
  }

  return {
    score: clamp(contributionScore + progressScore, 0, 20),
    retirementContributionRate,
  };
}

// ── Priority actions ──────────────────────────────────────────────────────────

function buildPriorityActions(
  scores: {
    cashFlow: number;
    debt: number;
    emergency: number;
    protection: number;
    retirement: number;
  },
  state: OnboardingState,
): string[] {
  const actions: string[] = [];

  if (scores.retirement <= 12) {
    actions.push("Increase retirement savings and review your long-term plan.");
  }
  if (scores.emergency <= 10) {
    actions.push("Build emergency savings to at least 3 months of essential expenses.");
  }
  if (scores.debt <= 10) {
    actions.push("Reduce expensive debt and improve monthly cash flow resilience.");
  }
  if (scores.protection <= 12) {
    actions.push("Review your family protection, funeral cover, and risk benefits.");
  }
  if (
    state.protectionEstate.hasWill === false ||
    state.protectionEstate.beneficiaryNominationsUpdated !== "yes"
  ) {
    actions.push("Put a valid will in place and review beneficiary nominations.");
  }
  if (scores.cashFlow <= 10) {
    actions.push("Improve your monthly savings rate and reduce financial pressure at month end.");
  }

  return actions.slice(0, 3);
}

// ── Summary ───────────────────────────────────────────────────────────────────

function buildSummary(band: FinancialHealthBand, topAction: string): string {
  switch (band) {
    case "strong":
      return "You have a strong financial foundation. Focus on refining and maintaining your long-term plan.";
    case "good_foundation":
      return "You have a good financial base, with a few areas that could be strengthened further.";
    case "needs_attention":
      return `Your finances show a reasonable base, but some important areas need attention. ${topAction}`.trim();
    case "financial_stress_risk":
      return `Your finances may be under strain in some areas. ${topAction}`.trim();
    case "urgent_action_needed":
      return `Several parts of your financial position need urgent attention. ${topAction}`.trim();
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * calculateHealthScore
 *
 * Scores the client's financial health across 5 categories (each 0–20, total 100).
 * Designed for the onboarding wizard — uses simplified self-reported inputs.
 *
 * The full Financial Health Score engine (built on complete ClientProfile data)
 * will supersede this when the adviser platform is live.
 */
export function calculateHealthScore(state: OnboardingState): FinancialHealthScoreResult {
  const cashFlow = calculateCashFlowScore(state);
  const debt = calculateDebtScore(state);
  const emergency = calculateEmergencyFundScore(state);
  const protection = calculateProtectionScore(state);
  const retirement = calculateRetirementScore(state);

  const overallScore = clamp(
    Math.round(cashFlow.score + debt.score + emergency.score + protection.score + retirement.score),
    0,
    100,
  );

  const band = getBand(overallScore);

  const priorityActions = buildPriorityActions(
    {
      cashFlow: cashFlow.score,
      debt: debt.score,
      emergency: emergency.score,
      protection: protection.score,
      retirement: retirement.score,
    },
    state,
  );

  return {
    calculatedAt: new Date().toISOString(),
    overallScore,
    band,
    categoryScores: {
      cashFlow: cashFlow.score,
      debt: debt.score,
      emergencyFund: emergency.score,
      protection: protection.score,
      retirement: retirement.score,
    },
    priorityActions,
    summary: buildSummary(band, priorityActions[0] ?? ""),
    breakdown: {
      savingsRate: cashFlow.savingsRate,
      debtToIncomeRatio: debt.debtToIncomeRatio,
      emergencyMonths: emergency.emergencyMonths,
      retirementContributionRate: retirement.retirementContributionRate,
    },
  };
}

// Re-export types for convenience
export type { FinancialHealthScoreResult, FinancialHealthBand } from "../types/financial-health.types";

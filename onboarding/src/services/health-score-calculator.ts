import { OnboardingState } from "../types/onboarding-state.types";

export type HealthScoreBand =
  | "strong"
  | "good_foundation"
  | "needs_attention"
  | "financial_stress_risk"
  | "urgent_action_needed";

export interface HealthScoreResult {
  overallScore: number;
  band: HealthScoreBand;
  categoryScores: {
    cashFlow: number;
    debt: number;
    emergencyFund: number;
    protection: number;
    retirement: number;
  };
  priorityActions: string[];
  summary: string;
}

/**
 * calculateHealthScore
 *
 * Scores the client's financial health across 5 categories (each 0–20, total 100).
 * Based on the data captured during onboarding.
 *
 * This is the onboarding-stage calculator — it uses simplified inputs.
 * The full Financial Health Score engine will use the complete ClientProfile.
 */
export function calculateHealthScore(state: OnboardingState): HealthScoreResult {
  const { income, spending, savings, protectionEstate, family } = state;

  const netIncome = income.monthlyNetIncome ?? 0;
  const essential = spending.monthlyEssentialExpenses ?? 0;
  const lifestyle = spending.monthlyLifestyleExpenses ?? 0;
  const debtRepayments = spending.monthlyDebtRepayments ?? 0;
  const monthlySavings = savings.monthlySavings ?? 0;
  const retirementContribution = savings.monthlyRetirementContribution ?? 0;
  const emergencyFund = savings.emergencySavingsAmount ?? 0;
  const retirementTotal = savings.retirementSavingsTotal ?? 0;
  const age = state.about.age ?? 35;

  // ── 1. CASH FLOW score (0–20) ──────────────────────────────────────────
  let cashFlowScore = 0;
  const priorityActions: string[] = [];

  if (netIncome > 0) {
    const totalOut = essential + lifestyle + debtRepayments + monthlySavings + retirementContribution;
    const disposable = netIncome - totalOut;
    const disposableRatio = disposable / netIncome;

    if (disposableRatio >= 0.15) cashFlowScore = 20;
    else if (disposableRatio >= 0.05) cashFlowScore = 15;
    else if (disposableRatio >= 0) cashFlowScore = 10;
    else cashFlowScore = 3;

    if (disposableRatio < 0.05) {
      priorityActions.push("Your monthly cash flow is very tight — review essential vs lifestyle spending");
    }
  } else {
    cashFlowScore = 0;
    priorityActions.push("No income data captured — please complete your income details");
  }

  // ── 2. DEBT score (0–20) ───────────────────────────────────────────────
  let debtScore = 0;

  if (netIncome > 0 && debtRepayments >= 0) {
    const debtRatio = debtRepayments / netIncome;

    if (debtRatio === 0) debtScore = 20;
    else if (debtRatio <= 0.15) debtScore = 17;
    else if (debtRatio <= 0.25) debtScore = 13;
    else if (debtRatio <= 0.35) debtScore = 8;
    else debtScore = 3;

    if (debtRatio > 0.30) {
      priorityActions.push(`High debt load: ${Math.round(debtRatio * 100)}% of income goes to debt repayments`);
    }
  } else {
    debtScore = 10; // Unknown — neutral
  }

  // ── 3. EMERGENCY FUND score (0–20) ────────────────────────────────────
  let emergencyScore = 0;

  if (emergencyFund > 0 && essential > 0) {
    const monthsCovered = emergencyFund / essential;

    if (monthsCovered >= 6) emergencyScore = 20;
    else if (monthsCovered >= 3) emergencyScore = 14;
    else if (monthsCovered >= 1) emergencyScore = 8;
    else emergencyScore = 3;

    if (monthsCovered < 3) {
      priorityActions.push(
        `Emergency fund covers only ${monthsCovered.toFixed(1)} months — target 6 months of essential expenses`
      );
    }
  } else if (emergencyFund === 0) {
    emergencyScore = 0;
    priorityActions.push("No emergency fund — this is your most urgent financial priority");
  } else {
    emergencyScore = 5;
  }

  // ── 4. PROTECTION score (0–20) ────────────────────────────────────────
  let protectionScore = 0;
  const totalDependants =
    (family.numberOfChildren ?? 0) +
    (family.parentsSupported ?? 0) +
    (family.hasSpouseOrPartner ? 1 : 0);

  if (protectionEstate.hasLifeCover) protectionScore += 6;
  if (protectionEstate.hasFuneralCover) protectionScore += 5;
  if (protectionEstate.hasDisabilityOrIncomeProtection) protectionScore += 5;
  if (protectionEstate.hasMedicalAid) protectionScore += 4;

  protectionScore = Math.min(20, protectionScore);

  if (!protectionEstate.hasFuneralCover) {
    priorityActions.push("No funeral cover — this is an affordable and immediate need");
  }
  if (!protectionEstate.hasLifeCover && totalDependants > 0) {
    priorityActions.push("No life cover with dependants — significant financial risk");
  }
  if (!protectionEstate.hasMedicalAid) {
    priorityActions.push("No medical aid — consider at minimum a hospital plan");
  }

  // ── 5. RETIREMENT score (0–20) ────────────────────────────────────────
  let retirementScore = 0;

  if (netIncome > 0) {
    const retirementRate = retirementContribution / netIncome;

    // Benchmark: retirement savings should be ~10x annual income by age 65
    // Rule of thumb: savings_multiple = retirementTotal / (netIncome * 12)
    const savingsMultiple = netIncome > 0 ? retirementTotal / (netIncome * 12) : 0;

    // Age-adjusted target multiple (rough benchmark)
    const targetMultiple = Math.max(0, (age - 22) / (65 - 22)) * 10;

    const onTrackRatio = targetMultiple > 0 ? savingsMultiple / targetMultiple : 0;

    if (retirementRate >= 0.15 && onTrackRatio >= 0.9) retirementScore = 20;
    else if (retirementRate >= 0.10 && onTrackRatio >= 0.7) retirementScore = 16;
    else if (retirementRate >= 0.075 && onTrackRatio >= 0.5) retirementScore = 12;
    else if (retirementRate >= 0.05 || onTrackRatio >= 0.3) retirementScore = 7;
    else retirementScore = 3;

    if (onTrackRatio < 0.7) {
      priorityActions.push("Retirement savings are behind — use the Retirement Architect to close the gap");
    }
  } else {
    retirementScore = 5;
  }

  if (!protectionEstate.hasWill) {
    priorityActions.push("No will in place — critical if you have dependants");
  }

  // ── Overall score ──────────────────────────────────────────────────────
  const overallScore = cashFlowScore + debtScore + emergencyScore + protectionScore + retirementScore;

  // ── Band ───────────────────────────────────────────────────────────────
  let band: HealthScoreBand;
  if (overallScore >= 80) band = "strong";
  else if (overallScore >= 65) band = "good_foundation";
  else if (overallScore >= 50) band = "needs_attention";
  else if (overallScore >= 35) band = "financial_stress_risk";
  else band = "urgent_action_needed";

  // ── Summary ────────────────────────────────────────────────────────────
  const summaryMap: Record<HealthScoreBand, string> = {
    strong: "Your finances are in strong shape. Focus on optimising and protecting what you've built.",
    good_foundation:
      "You have a good foundation. A few targeted improvements will significantly strengthen your position.",
    needs_attention:
      "There are some important gaps in your financial plan. The tools below will help you address them.",
    financial_stress_risk:
      "Your financial situation has some stress points that need attention soon. Start with the highest priorities below.",
    urgent_action_needed:
      "Some urgent financial gaps need immediate attention. We recommend speaking to an advisor.",
  };

  return {
    overallScore,
    band,
    categoryScores: {
      cashFlow: cashFlowScore,
      debt: debtScore,
      emergencyFund: emergencyScore,
      protection: protectionScore,
      retirement: retirementScore,
    },
    priorityActions: priorityActions.slice(0, 5), // top 5 only
    summary: summaryMap[band],
  };
}

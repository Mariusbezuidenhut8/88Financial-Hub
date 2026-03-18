/**
 * Financial Health Score types.
 *
 * Used by the onboarding health score calculator and surfaced in:
 * - OnboardingState.healthScore
 * - ResultsStep UI
 * - Recommendation router
 */

export type FinancialHealthBand =
  | "strong"
  | "good_foundation"
  | "needs_attention"
  | "financial_stress_risk"
  | "urgent_action_needed";

export interface FinancialHealthCategoryScores {
  cashFlow: number;
  debt: number;
  emergencyFund: number;
  protection: number;
  retirement: number;
}

/** Key ratios surfaced alongside the score — useful for the UI and adviser notes */
export interface FinancialHealthScoreBreakdown {
  /** (monthlySavings + monthlyRetirementContribution) / monthlyNetIncome */
  savingsRate?: number;
  /** monthlyDebtRepayments / monthlyNetIncome */
  debtToIncomeRatio?: number;
  /** emergencySavingsAmount / monthlyEssentialExpenses */
  emergencyMonths?: number;
  /** monthlyRetirementContribution / monthlyGrossIncome */
  retirementContributionRate?: number;
}

export interface FinancialHealthScoreResult {
  /** ISO datetime — when the score was calculated */
  calculatedAt: string;
  /** 0–100 */
  overallScore: number;
  band: FinancialHealthBand;
  categoryScores: FinancialHealthCategoryScores;
  /** Top 3 recommended actions, ordered by urgency */
  priorityActions: string[];
  /** Human-readable one-line summary for the results screen */
  summary: string;
  /** Supporting ratios — optional context for the UI */
  breakdown: FinancialHealthScoreBreakdown;
}

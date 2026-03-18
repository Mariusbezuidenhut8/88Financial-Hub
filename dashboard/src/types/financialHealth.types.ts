/**
 * financialHealth.types.ts
 *
 * Local copy of FinancialHealthScoreResult for the dashboard package.
 * Kept in sync with @88fh/onboarding's financial-health.types.ts.
 * The dashboard accepts this type as a prop; the host app bridges between packages.
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

export interface FinancialHealthScoreBreakdown {
  savingsRate?: number;
  debtToIncomeRatio?: number;
  emergencyMonths?: number;
  retirementContributionRate?: number;
}

export interface FinancialHealthScoreResult {
  calculatedAt: string;
  overallScore: number;
  band: FinancialHealthBand;
  categoryScores: FinancialHealthCategoryScores;
  priorityActions: string[];
  summary: string;
  breakdown: FinancialHealthScoreBreakdown;
}

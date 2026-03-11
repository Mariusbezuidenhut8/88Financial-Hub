import { Currency } from "./common.types";

/**
 * CashFlowProfile — money flowing out each month and key financial indicators.
 * Income figures live in EmploymentProfile.
 * This domain is pure expense tracking + derived ratios.
 *
 * USED BY: Financial Health Score, Protection Planner, Retirement Architect,
 *          Funeral Cover Studio
 */
export interface CashFlowProfile {
  // ── Expenses ──────────────────────────────────────────────────────────
  /** REQUIRED — housing, utilities, food, education, medical */
  monthlyEssentialExpenses?: Currency;

  /** REQUIRED — clothing, entertainment, subscriptions, discretionary */
  monthlyLifestyleExpenses?: Currency;

  /** REQUIRED — all loan and credit repayments combined */
  monthlyDebtRepayments?: Currency;

  /** REQUIRED — discretionary savings (TFSA, unit trusts, savings accounts) */
  monthlySavings?: Currency;

  /** REQUIRED — RA, pension, provident contributions */
  monthlyRetirementContributions?: Currency;

  /** OPTIONAL — all insurance premiums combined */
  monthlyInsurancePremiums?: Currency;

  // ── Emergency fund ────────────────────────────────────────────────────
  /** REQUIRED — key health score input; false is a meaningful data point */
  hasEmergencyFund?: boolean;

  /** OPTIONAL — current emergency fund balance */
  emergencyFundAmount?: Currency;

  // ── Computed fields (set by engine, not user) ─────────────────────────
  /** COMPUTED — net income minus all monthly outgoings */
  disposableIncomeEstimate?: Currency;

  /** COMPUTED — (monthlySavings + monthlyRetirementContributions) / monthlyNetIncome */
  savingsRate?: number;

  /** COMPUTED — monthlyDebtRepayments / monthlyNetIncome */
  debtToIncomeRatio?: number;

  /** COMPUTED — emergencyFundAmount / monthlyEssentialExpenses */
  emergencyFundMonthsCovered?: number;
}

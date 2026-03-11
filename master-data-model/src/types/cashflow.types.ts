import { CurrencyZAR } from "./common.types";

/**
 * CashFlow — money moving in and out each month.
 * Employment context (where income comes from) lives in Employment.
 * This domain focuses purely on the numbers.
 *
 * USED BY: Financial Health Score, Retirement Architect, Protection Planner,
 *          Funeral Cover Studio
 */

export interface IncomeSource {
  id: string;
  /** REQUIRED */
  type: "salary" | "business" | "rental" | "investment" | "pension" | "maintenance" | "other";
  /** REQUIRED */
  description: string;
  /** REQUIRED */
  monthlyAmount: CurrencyZAR;
  /** REQUIRED — affects reliability scoring in health score */
  isVariable: boolean;
  /** REQUIRED */
  owner: "self" | "spouse";
}

export interface ExpenseCategory {
  id: string;
  /** REQUIRED */
  category:
    | "housing"
    | "utilities"
    | "food"
    | "transport"
    | "education"
    | "medical"
    | "clothing"
    | "entertainment"
    | "insurance_premiums"
    | "debt_repayments"
    | "savings"
    | "retirement_contributions"
    | "support_payments"
    | "other";
  /** OPTIONAL — label for display */
  description?: string;
  /** REQUIRED */
  monthlyAmount: CurrencyZAR;
  /** REQUIRED — drives essential vs discretionary split in health score */
  isEssential: boolean;
}

export interface CashFlow {
  // ── Income ────────────────────────────────────────────────────
  /** REQUIRED — primary income for affordability and protection calculations */
  monthlyGrossIncome: CurrencyZAR;

  /** REQUIRED — net take-home; used in all calculations */
  monthlyNetIncome: CurrencyZAR;

  /** OPTIONAL — list of side income streams */
  additionalIncomeSources: IncomeSource[];

  /** REQUIRED — household total used in estate and protection planning */
  totalHouseholdMonthlyIncome: CurrencyZAR;

  // ── Expenses ──────────────────────────────────────────────────
  /** REQUIRED — housing, utilities, food, education, medical */
  monthlyEssentialExpenses: CurrencyZAR;

  /** REQUIRED — clothing, entertainment, subscriptions */
  monthlyLifestyleExpenses: CurrencyZAR;

  /** REQUIRED — all loan and credit repayments combined */
  monthlyDebtRepayments: CurrencyZAR;

  /** REQUIRED — discretionary savings (TFSA, unit trusts, savings accounts) */
  monthlySavingsContributions: CurrencyZAR;

  /** REQUIRED — RA, pension, provident contributions */
  monthlyRetirementContributions: CurrencyZAR;

  /** REQUIRED — all insurance premiums combined */
  monthlyInsurancePremiums: CurrencyZAR;

  /** OPTIONAL — detailed expense breakdown; improves health score accuracy */
  expenseBreakdown?: ExpenseCategory[];

  // ── Computed fields (set by engine, not user) ─────────────────
  /** COMPUTED — income minus all outgoings */
  monthlyDisposableIncome?: CurrencyZAR;

  /** COMPUTED — monthlySavings + monthlyRetirement as % of monthlyNetIncome */
  savingsRate?: number;

  /** COMPUTED — monthlyDebtRepayments as % of monthlyNetIncome */
  debtToIncomeRatio?: number;

  // ── Emergency fund ────────────────────────────────────────────
  /** REQUIRED — presence of emergency fund is a key health score input */
  hasEmergencyFund: boolean;

  /** OPTIONAL — amount in emergency fund */
  emergencyFundAmount?: CurrencyZAR;

  /** COMPUTED — emergencyFundAmount / monthlyEssentialExpenses */
  emergencyFundMonthsCovered?: number;
}

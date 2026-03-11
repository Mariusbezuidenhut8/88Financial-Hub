import { EmploymentStatus, CurrencyZAR } from "./common.types";

export interface IncomeSource {
  id: string;
  type: "salary" | "business" | "rental" | "investment" | "pension" | "maintenance" | "other";
  description: string;
  monthlyAmount: CurrencyZAR;
  isVariable: boolean;
  owner: "self" | "spouse";
}

export interface ExpenseCategory {
  id: string;
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
  description?: string;
  monthlyAmount: CurrencyZAR;
  isEssential: boolean;
}

export interface CashFlow {
  employmentStatus: EmploymentStatus;
  occupation?: string;
  employerName?: string;
  isSelfEmployed: boolean;

  // Income
  monthlyGrossIncome: CurrencyZAR;
  monthlyNetIncome: CurrencyZAR;
  additionalIncomeSources: IncomeSource[];
  totalHouseholdMonthlyIncome: CurrencyZAR; // self + spouse

  // Expenses
  monthlyEssentialExpenses: CurrencyZAR;
  monthlyLifestyleExpenses: CurrencyZAR;
  monthlyDebtRepayments: CurrencyZAR;
  monthlySavingsContributions: CurrencyZAR;
  monthlyRetirementContributions: CurrencyZAR;
  monthlyInsurancePremiums: CurrencyZAR;
  expenseBreakdown?: ExpenseCategory[];

  // Derived
  monthlyDisposableIncome?: CurrencyZAR;    // Computed: income - all expenses
  savingsRate?: number;                      // % of income saved
  debtToIncomeRatio?: number;               // % of income going to debt

  // Emergency fund
  hasEmergencyFund: boolean;
  emergencyFundAmount?: CurrencyZAR;
  emergencyFundMonthsCovered?: number;       // Computed
}

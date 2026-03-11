import { CurrencyZAR, RiskTolerance } from "./common.types";

export type RetirementReadinessStatus =
  | "on_track"
  | "slightly_behind"
  | "significantly_behind"
  | "critical"
  | "not_assessed";

export interface RetirementPlanning {
  // Goals
  targetRetirementAge: number;
  currentAge?: number;             // From identity — used in calcs
  yearsToRetirement?: number;      // Computed
  desiredMonthlyRetirementIncome: CurrencyZAR;
  desiredRetirementIncomeInTodaysMoney: CurrencyZAR;

  // Current savings (links to Assets for detail)
  totalCurrentRetirementSavings: CurrencyZAR;  // Aggregated from assets
  monthlyRetirementContribution: CurrencyZAR;  // Aggregated from cashflow

  // Preferences
  riskTolerance: RiskTolerance;
  expectedReturnRate?: number;        // % p.a. — optional adviser input
  inflationAssumption?: number;       // % — default 6%
  retirementIncomeEscalation?: number; // % p.a.

  // Post-retirement
  expectedRetirementDuration?: number; // Years in retirement
  hasAnnuityPlan?: boolean;
  annuityProvider?: string;

  // Status (computed by Retirement Architect)
  projectedRetirementFund?: CurrencyZAR;
  requiredRetirementFund?: CurrencyZAR;
  retirementFundShortfall?: CurrencyZAR;
  replacementRatio?: number;          // % of income replaced
  retirementReadinessStatus: RetirementReadinessStatus;
  retirementNotes?: string;
}

import { ISODateTime, Currency, HealthScoreBand, RiskTolerance } from "./common.types";

/**
 * ToolOutputs — all computed results from planning engines.
 *
 * RULE: These are NEVER populated by user input.
 * RULE: These are NEVER used as the source of truth — always re-computable
 *       from the ClientProfile inputs.
 * RULE: Each output includes calculatedAt so staleness can be detected.
 *
 * Lives at PlatformRecord.toolOutputs, separate from ClientProfile.
 */
export interface ToolOutputs {
  financialHealthScore?: FinancialHealthScoreOutput;
  retirementAnalysis?: RetirementAnalysisOutput;
  protectionAnalysis?: ProtectionAnalysisOutput;
  funeralPlanningAnalysis?: FuneralPlanningAnalysisOutput;
  estateAnalysis?: EstateAnalysisOutput;
  investmentAnalysis?: InvestmentAnalysisOutput;
}

// ── Financial Health Score ─────────────────────────────────────────────────

export interface FinancialHealthScoreOutput {
  /** REQUIRED */
  calculatedAt: ISODateTime;

  /** Overall score: 0–100 */
  overallScore: number;

  /** Qualitative band for display */
  band: HealthScoreBand;

  /** Scores per category (each 0–20, totalling 100) */
  categoryScores: {
    cashFlow: number;
    debt: number;
    emergencyFund: number;
    protection: number;
    retirement: number;
  };

  /** Top 3–5 prioritised action items */
  priorityActions: string[];

  /** Optional narrative summary for the client */
  summary?: string;
}

// ── Retirement Analysis ────────────────────────────────────────────────────

export interface RetirementAnalysisOutput {
  calculatedAt: ISODateTime;
  retirementCapitalProjected?: Currency;
  retirementCapitalRequired?: Currency;
  targetMonthlyIncome?: Currency;
  projectedMonthlyIncome?: Currency;
  incomeGapMonthly?: Currency;
  replacementRatio?: number;
  onTrack: boolean;
  recommendations: string[];
  assumptions?: string[];
}

// ── Protection Analysis ────────────────────────────────────────────────────

export interface ProtectionAnalysisOutput {
  calculatedAt: ISODateTime;
  lifeCoverNeedEstimate?: Currency;
  currentLifeCover?: Currency;
  lifeCoverShortfall?: Currency;
  disabilityCoverGapEstimate?: Currency;
  incomeProtectionNeeded?: boolean;
  funeralCoverAdequacy?: "adequate" | "partial" | "inadequate" | "unknown";
  affordabilityBandMin?: Currency;
  affordabilityBandMax?: Currency;
  recommendations: string[];
  warnings?: string[];
}

// ── Funeral Planning Analysis ──────────────────────────────────────────────

export interface FuneralPlanningAnalysisOutput {
  calculatedAt: ISODateTime;
  estimatedFuneralCost?: Currency;
  existingFuneralCover?: Currency;
  coverShortfall?: Currency;
  recommendedCover?: Currency;
  affordabilityMinPremium?: Currency;
  affordabilityMaxPremium?: Currency;
  familyCoverRecommended?: boolean;
  recommendations: string[];
  warnings?: string[];
}

// ── Estate Analysis ────────────────────────────────────────────────────────

export interface EstateAnalysisOutput {
  calculatedAt: ISODateTime;
  estimatedGrossEstate?: Currency;
  estimatedNetEstate?: Currency;
  estimatedEstateDuty?: Currency;
  estimatedLiquidityNeed?: Currency;
  estimatedLiquidityShortfall?: Currency;
  availableLiquidity?: Currency;
  recommendations: string[];
  warnings?: string[];
}

// ── Investment Analysis ────────────────────────────────────────────────────

export type InvestmentWrapper =
  | "tfsa"
  | "retirement_annuity"
  | "discretionary"
  | "endowment"
  | "combination"
  | "unknown";

export interface InvestmentAnalysisOutput {
  calculatedAt: ISODateTime;
  recommendedWrapper?: InvestmentWrapper;
  recommendedStrategySummary?: string;
  suggestedRiskTolerance?: RiskTolerance;
  recommendations: string[];
  alternativesConsidered?: { wrapper: InvestmentWrapper; reason: string }[];
  assumptions?: string[];
}

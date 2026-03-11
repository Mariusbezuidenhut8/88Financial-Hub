import { CurrencyZAR } from "./common.types";

/** Financial Health Score output */
export interface HealthScoreOutput {
  overallScore: number;            // 0–100
  category: "critical" | "needs_attention" | "fair" | "good" | "excellent";
  categoryScores: {
    cashFlow: number;
    protection: number;
    retirement: number;
    estate: number;
    debtManagement: number;
    emergencyFund: number;
    goals: number;
  };
  topRecommendations: string[];
  generatedAt: string;
}

/** Retirement analysis output */
export interface RetirementAnalysisOutput {
  projectedFundAtRetirement: CurrencyZAR;
  requiredFund: CurrencyZAR;
  shortfall: CurrencyZAR;
  replacementRatio: number;
  monthlyShortfallToClose: CurrencyZAR;
  retirementReadiness: string;
  generatedAt: string;
}

/** Protection analysis output */
export interface ProtectionAnalysisOutput {
  lifeCoverRecommended: CurrencyZAR;
  lifeCoverShortfall: CurrencyZAR;
  funeralCoverRecommended: CurrencyZAR;
  funeralCoverShortfall: CurrencyZAR;
  disabilityCoverRecommended: CurrencyZAR;
  disabilityCoverShortfall: CurrencyZAR;
  incomeProtectionRecommended: CurrencyZAR;
  incomeProtectionShortfall: CurrencyZAR;
  affordabilityBand: { min: CurrencyZAR; max: CurrencyZAR };
  generatedAt: string;
}

/** Estate analysis output */
export interface EstateAnalysisOutput {
  grossEstate: CurrencyZAR;
  totalLiabilities: CurrencyZAR;
  netEstate: CurrencyZAR;
  estimatedEstateDuty: CurrencyZAR;
  estimatedLiquidityCosts: CurrencyZAR;
  totalLiquidityRequired: CurrencyZAR;
  availableLiquidity: CurrencyZAR;
  liquidityShortfall: CurrencyZAR;
  recommendations: string[];
  generatedAt: string;
}

/** Investment wrapper recommendation output */
export interface InvestmentWrapperOutput {
  recommendedWrapper: string;
  reasoning: string[];
  alternativesConsidered: { wrapper: string; reason: string }[];
  generatedAt: string;
}

/** All tool outputs — stored separately from profile facts */
export interface ToolOutputs {
  financialHealthScore?: HealthScoreOutput;
  retirementAnalysis?: RetirementAnalysisOutput;
  protectionAnalysis?: ProtectionAnalysisOutput;
  estateAnalysis?: EstateAnalysisOutput;
  investmentWrapper?: InvestmentWrapperOutput;
}

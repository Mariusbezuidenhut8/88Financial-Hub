import { CurrencyZAR } from "./common.types";

export type AssetOwner = "self" | "spouse" | "joint" | "trust" | "business";

export type AssetLiquidity = "liquid" | "semi_liquid" | "illiquid";

export interface CashAndSavingsAsset {
  id: string;
  type: "savings_account" | "fixed_deposit" | "money_market" | "notice_account" | "cash";
  institution: string;
  description?: string;
  currentValue: CurrencyZAR;
  interestRate?: number;
  owner: AssetOwner;
  liquidity: AssetLiquidity;
}

export interface InvestmentAsset {
  id: string;
  type: "unit_trust" | "etf" | "shares" | "endowment" | "tfsa" | "offshore" | "other";
  provider: string;
  fundName?: string;
  currentValue: CurrencyZAR;
  monthlyContribution?: CurrencyZAR;
  owner: AssetOwner;
  liquidity: AssetLiquidity;
  isOffshore: boolean;
}

export interface RetirementAsset {
  id: string;
  type:
    | "pension_fund"
    | "provident_fund"
    | "retirement_annuity"
    | "preservation_fund"
    | "living_annuity"
    | "government_pension";
  provider: string;
  currentValue: CurrencyZAR;
  monthlyContribution?: CurrencyZAR;
  owner: AssetOwner;
  fundGrowthRate?: number;
}

export interface PropertyAsset {
  id: string;
  type: "primary_residence" | "investment_property" | "commercial" | "vacant_land";
  description: string;
  currentValue: CurrencyZAR;
  outstandingBond?: CurrencyZAR;
  monthlyRentalIncome?: CurrencyZAR;
  owner: AssetOwner;
  hasBodyCorporate?: boolean;
}

export interface BusinessAsset {
  id: string;
  businessName: string;
  ownershipPercentage: number;
  estimatedValue: CurrencyZAR;
  hasValuation: boolean;
  valuationDate?: string;
  hasSuccessionPlan: boolean;
}

export interface VehicleAsset {
  id: string;
  description: string;
  estimatedValue: CurrencyZAR;
  outstandingFinance?: CurrencyZAR;
  owner: AssetOwner;
}

export interface Assets {
  cashAndSavings: CashAndSavingsAsset[];
  investments: InvestmentAsset[];
  retirementAssets: RetirementAsset[];
  properties: PropertyAsset[];
  businessAssets: BusinessAsset[];
  vehicles: VehicleAsset[];
  otherAssets: { id: string; description: string; estimatedValue: CurrencyZAR }[];

  // Computed totals
  totalNetWorth?: CurrencyZAR;
  totalLiquidAssets?: CurrencyZAR;
  totalRetirementAssets?: CurrencyZAR;
  totalPropertyValue?: CurrencyZAR;
}

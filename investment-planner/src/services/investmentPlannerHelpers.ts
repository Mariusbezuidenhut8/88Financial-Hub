/**
 * investmentPlannerHelpers.ts
 *
 * Pure display helpers for the Investment Planner UI and result rendering.
 */

import type {
  InvestmentPrimaryGoal,
  InvestmentHorizonBand,
  InvestmentLiquidityNeed,
  InvestmentTaxBand,
  InvestmentContributionStyle,
  InvestmentRecommendationType,
} from "../types/investmentPlanner.types";

// ── Goal labels ────────────────────────────────────────────────────────────

export function labelInvestmentGoal(goal: InvestmentPrimaryGoal): string {
  switch (goal) {
    case "retirement":       return "Retirement";
    case "wealth_building":  return "Long-term wealth building";
    case "education":        return "Education funding";
    case "emergency_reserve": return "Emergency reserve";
    case "medium_term_goal": return "Medium-term goal";
    case "general_investing": return "General investing";
  }
}

// ── Horizon labels ─────────────────────────────────────────────────────────

export function labelInvestmentHorizon(horizon: InvestmentHorizonBand): string {
  switch (horizon) {
    case "under_3": return "Under 3 years";
    case "3_to_5":  return "3 to 5 years";
    case "5_to_10": return "5 to 10 years";
    case "10_plus": return "10+ years";
  }
}

// ── Liquidity labels ───────────────────────────────────────────────────────

export function labelLiquidityNeed(need: InvestmentLiquidityNeed): string {
  switch (need) {
    case "high":   return "High — I may need access soon";
    case "medium": return "Medium — some access may be needed";
    case "low":    return "Low — I can leave it invested";
  }
}

// ── Tax band labels ────────────────────────────────────────────────────────

export function labelTaxBand(band: InvestmentTaxBand): string {
  switch (band) {
    case "low":    return "Low (income below ~R250k/year)";
    case "medium": return "Medium (income ~R250k–R700k/year)";
    case "high":   return "High (income above ~R700k/year)";
  }
}

// ── Contribution style labels ──────────────────────────────────────────────

export function labelContributionStyle(style: InvestmentContributionStyle): string {
  switch (style) {
    case "lump_sum": return "Once-off lump sum";
    case "monthly":  return "Monthly contributions";
    case "both":     return "Lump sum + monthly contributions";
  }
}

// ── Recommendation label (alias — also in decision engine) ─────────────────

export function labelWrapperRecommendation(
  recommendation: InvestmentRecommendationType,
): string {
  switch (recommendation) {
    case "tfsa":               return "Tax-Free Savings Account";
    case "ra":                 return "Retirement Annuity";
    case "discretionary":      return "Discretionary Investment";
    case "endowment":          return "Endowment";
    case "combination":        return "Combination Approach";
    case "build_reserve_first": return "Build Reserve First";
  }
}

// ── Currency helper ────────────────────────────────────────────────────────

export function fmtInvestmentCurrency(
  value: number | undefined,
  prefix = "R",
): string {
  if (value === undefined || value === null) return "—";
  return `${prefix}${Math.round(value).toLocaleString("en-ZA")}`;
}

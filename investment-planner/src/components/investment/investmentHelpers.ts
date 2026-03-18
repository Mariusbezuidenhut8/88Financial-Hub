/**
 * investmentHelpers.ts  (component-layer)
 *
 * Re-exports the display helpers from services/investmentPlannerHelpers.ts
 * so that step components can import from a local, predictable path.
 */

export {
  labelInvestmentGoal,
  labelInvestmentHorizon,
  labelLiquidityNeed,
  labelTaxBand,
  labelContributionStyle,
  labelWrapperRecommendation,
  fmtInvestmentCurrency,
} from "../../services/investmentPlannerHelpers";

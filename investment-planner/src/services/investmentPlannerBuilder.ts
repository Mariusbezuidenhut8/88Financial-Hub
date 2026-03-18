/**
 * investmentPlannerBuilder.ts
 *
 * Assembles the final InvestmentPlannerResult from a resolved decision input.
 * Orchestrates the decision engine + strategy builder in one call.
 *
 * Usage:
 *   const input = toDecisionInput(state);
 *   if (input) {
 *     const result = buildInvestmentPlannerResult(input);
 *   }
 */

import type {
  InvestmentDecisionInput,
  InvestmentPlannerResult,
} from "../types/investmentPlanner.types";
import { determineInvestmentRecommendation } from "./investmentDecisionEngine";
import { buildInvestmentStrategyDirection }  from "./investmentStrategyBuilder";

/**
 * buildInvestmentPlannerResult
 *
 * Combines the decision engine + strategy builder into a single result object.
 * This is the primary entry point for wizard consumers.
 */
export function buildInvestmentPlannerResult(
  input: InvestmentDecisionInput,
): InvestmentPlannerResult {
  const decision = determineInvestmentRecommendation(input);
  const strategy = buildInvestmentStrategyDirection(
    decision.primaryRecommendation,
    input,
  );

  return {
    calculatedAt:              new Date().toISOString(),
    primaryGoal:               input.primaryGoal,
    horizonBand:               input.horizonBand,
    liquidityNeed:             input.liquidityNeed,
    primaryRecommendation:     decision.primaryRecommendation,
    alternativeRecommendation: decision.alternativeRecommendation,
    reasons:                   decision.reasons,
    cautions:                  decision.cautions,
    strategyDirection:         strategy.strategyDirection,
    suggestAdvisor:            strategy.suggestAdvisor,
    advisorReasons:            strategy.advisorReasons,
  };
}

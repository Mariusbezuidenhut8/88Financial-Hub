/**
 * retirementScenarios.ts
 *
 * Strategy scenario engine.
 *
 * Public API:
 *   attachRetirementScenarios(result, input) → RetirementPlannerResult
 *
 * Scenarios:
 *   saveMore      — increase monthly contribution by 25%
 *   retireLater   — push retirement age forward by 2 years
 *   growthOption  — increase pre-retirement growth by 1.5 percentage points
 *
 * Rate convention: all percentage inputs treated as integer/decimal percentages.
 */

import type {
  RetirementPlannerResult,
  RetirementScenarioInput,
  RetirementStrategyOption,
} from "../types/retirement-planner.types";
import { calculateRetirementProjection } from "./retirementProjection";

// ── Scenario builders ──────────────────────────────────────────────────────

function buildSaveMoreScenario(
  input: RetirementScenarioInput,
): RetirementStrategyOption {
  const revisedMonthlyContribution = input.monthlyContribution * 1.25;

  const projection = calculateRetirementProjection({
    ...input,
    monthlyContribution: revisedMonthlyContribution,
  });

  return {
    title: "Save more",
    description: `Increase your monthly retirement contribution to approximately R${Math.round(
      revisedMonthlyContribution,
    ).toLocaleString("en-ZA")}.`,
    projectedMonthlyIncome: projection.estimatedMonthlyIncome,
    monthlyIncomeGap:       projection.monthlyIncomeGap,
    metadata: { revisedMonthlyContribution },
  };
}

function buildRetireLaterScenario(
  input: RetirementScenarioInput,
): RetirementStrategyOption {
  const revisedRetirementAge = input.targetRetirementAge + 2;

  const projection = calculateRetirementProjection({
    ...input,
    targetRetirementAge: revisedRetirementAge,
  });

  return {
    title: "Retire later",
    description: `Consider retiring at age ${revisedRetirementAge} instead of ${input.targetRetirementAge}.`,
    projectedMonthlyIncome: projection.estimatedMonthlyIncome,
    monthlyIncomeGap:       projection.monthlyIncomeGap,
    metadata: { revisedRetirementAge },
  };
}

function buildGrowthScenario(
  input: RetirementScenarioInput,
): RetirementStrategyOption {
  // Cap at 13% — represents an aggressive equity-heavy portfolio
  const revisedGrowthRate = Math.min(input.preRetirementGrowth + 1.5, 13);

  const projection = calculateRetirementProjection({
    ...input,
    preRetirementGrowth: revisedGrowthRate,
  });

  return {
    title: "Growth-focused strategy",
    description: `Review whether a long-term growth-oriented approach could support a projected return closer to ${revisedGrowthRate.toFixed(
      1,
    )}% before retirement.`,
    projectedMonthlyIncome: projection.estimatedMonthlyIncome,
    monthlyIncomeGap:       projection.monthlyIncomeGap,
    metadata: { revisedGrowthRate },
  };
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * attachRetirementScenarios
 *
 * Runs the three strategy scenarios from baseline inputs and attaches
 * them to an existing RetirementPlannerResult.
 */
export function attachRetirementScenarios(
  result: RetirementPlannerResult,
  input: RetirementScenarioInput,
): RetirementPlannerResult {
  return {
    ...result,
    strategyOptions: {
      saveMore:    buildSaveMoreScenario(input),
      retireLater: buildRetireLaterScenario(input),
      growthOption: buildGrowthScenario(input),
    },
  };
}

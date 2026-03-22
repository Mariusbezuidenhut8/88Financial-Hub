/**
 * investmentPlannerMapper.ts
 *
 * Three responsibilities:
 *
 * 1. mapClientProfileToInvestmentPlanner(clientProfile)
 *    Reads a ClientProfile (extracted from a PlatformRecord) and returns a
 *    prefilled InvestmentPlannerState with mapping warnings.
 *    Returns { investmentPlannerState, mappingWarnings }.
 *
 * 2. toDecisionInput(state)
 *    Validates the wizard state and returns a fully resolved
 *    InvestmentDecisionInput, or null if required fields are missing.
 *
 * 3. runDecisionEngine(input)
 *    Orchestrates the decision engine + strategy builder into a final result.
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  InvestmentPlannerMappingResult,
  InvestmentPlannerState,
  InvestmentDecisionInput,
  InvestmentPlannerResult,
  InvestmentTaxBand,
} from "../types/investmentPlanner.types";
import { investmentPlannerInitialState } from "../data/investmentPlannerInitialState";
import { determineInvestmentRecommendation } from "./investmentDecisionEngine";
import { buildInvestmentStrategyDirection } from "./investmentStrategyBuilder";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

// ── 1. Profile → wizard state ──────────────────────────────────────────────

function inferTaxBand(monthlyGrossIncome?: number): InvestmentTaxBand {
  const annualGross = (monthlyGrossIncome ?? 0) * 12;
  if (annualGross >= 700_000) return "high";
  if (annualGross >= 250_000) return "medium";
  return "low";
}

function mapGoalNames(clientProfile: ClientProfile): string[] {
  return (
    clientProfile.goals?.map(
      (g: { goalName?: string; category?: string }) =>
        g.goalName ?? g.category ?? "unnamed goal",
    ) ?? []
  );
}

/**
 * mapClientProfileToInvestmentPlanner
 *
 * Accepts a ClientProfile (the inner profile from a PlatformRecord).
 * Returns { investmentPlannerState, mappingWarnings }.
 */
export function mapClientProfileToInvestmentPlanner(
  clientProfile: ClientProfile,
): InvestmentPlannerMappingResult {
  const warnings: string[] = [];
  const { cashFlow, retirement, assets, employment } = clientProfile;

  // ── Monthly savings capacity
  //    Preference order: disposable estimate, net − expenses fallback
  const monthlyNet      = employment?.monthlyNetIncome   ?? 0;
  const monthlyExpenses = (cashFlow?.monthlyEssentialExpenses ?? 0) + (cashFlow?.monthlyLifestyleExpenses ?? 0);
  const raContrib       = retirement?.monthlyRetirementContribution
                          ?? cashFlow?.monthlyRetirementContributions
                          ?? 0;
  let monthlySavingsCapacity: number | undefined;
  if (employment?.monthlyNetIncome !== undefined) {
    monthlySavingsCapacity = Math.max(0, monthlyNet - monthlyExpenses - raContrib);
  } else {
    warnings.push("Monthly income is missing — savings capacity could not be estimated.");
  }

  // ── Current retirement contribution
  const currentRetirementContribution =
    retirement?.monthlyRetirementContribution ?? cashFlow?.monthlyRetirementContributions;
  if (!currentRetirementContribution) {
    warnings.push("No retirement contribution found — RA status assumed as none.");
  }

  // ── Emergency fund
  //    Best proxy: sum of cash & savings assets
  const cashAssets = assets?.filter((a) =>
    ["cash", "savings_account", "money_market", "fixed_deposit"].includes(a.assetType),
  ) ?? [];
  const emergencyFundAmount =
    cashAssets.length > 0
      ? cashAssets.reduce(
          (sum: number, a: { currentValue?: number }) => sum + (a.currentValue ?? 0),
          0,
        )
      : undefined;
  if (!emergencyFundAmount) {
    warnings.push("Cash & savings assets missing — emergency fund adequacy could not be assessed.");
  }

  // ── Monthly essential expenses (use total expenses as proxy)
  const monthlyEssentialExpenses = monthlyExpenses || undefined;
  if (!monthlyEssentialExpenses) {
    warnings.push("Monthly expenses missing — reserve adequacy check will be skipped.");
  }

  // ── Existing goals from profile
  const existingGoals = mapGoalNames(clientProfile);

  // ── Has existing RA
  const hasExistingRA = Boolean(
    retirement?.monthlyRetirementContribution || cashFlow?.monthlyRetirementContributions,
  );

  // ── Tax band
  const taxBand = inferTaxBand(employment?.monthlyGrossIncome);
  if (!employment?.monthlyGrossIncome) {
    warnings.push("Gross income missing — tax band defaulted to medium.");
  }

  const investmentPlannerState: InvestmentPlannerState = {
    ...investmentPlannerInitialState,
    overview: {
      monthlySavingsCapacity,
      currentRetirementContribution,
      existingGoals,
      emergencyFundAmount,
      monthlyEssentialExpenses,
    },
    tax: {
      ...investmentPlannerInitialState.tax,
      monthlyContributionAmount: monthlySavingsCapacity,
      hasExistingRA,
      taxBand,
    },
  };

  return { investmentPlannerState, mappingWarnings: warnings };
}

// ── 2. Wizard state → decision input ──────────────────────────────────────

/**
 * toDecisionInput
 *
 * Validates that all engine-required fields are present.
 * Returns null if the wizard is incomplete.
 */
export function toDecisionInput(
  state: InvestmentPlannerState,
): InvestmentDecisionInput | null {
  const { goal, horizon, tax, overview } = state;

  if (
    !goal.primaryGoal    ||
    !horizon.horizonBand ||
    !horizon.liquidityNeed
  ) {
    return null;
  }

  return {
    primaryGoal:              goal.primaryGoal,
    horizonBand:              horizon.horizonBand,
    liquidityNeed:            horizon.liquidityNeed,
    canLockUntilRetirement:   horizon.canLockUntilRetirement  ?? false,
    plannedUse:               horizon.plannedUse              ?? false,
    monthlyContributionAmount: tax.monthlyContributionAmount  ?? 0,
    lumpSumAmount:            tax.lumpSumAmount               ?? 0,
    hasExistingRA:            tax.hasExistingRA               ?? false,
    hasUsedTFSA:              tax.hasUsedTFSA                 ?? "not_sure",
    taxBand:                  tax.taxBand                     ?? "medium",
    wantsMaximumFlexibility:  tax.wantsMaximumFlexibility     ?? false,
    monthlySavingsCapacity:   overview.monthlySavingsCapacity ?? 0,
    emergencyFundAmount:      overview.emergencyFundAmount    ?? 0,
    monthlyEssentialExpenses: overview.monthlyEssentialExpenses ?? 0,
  };
}

// ── 3. Full engine orchestration ───────────────────────────────────────────

/**
 * runDecisionEngine
 *
 * Runs the decision engine + strategy builder and returns a complete result.
 * This is the single orchestration call from the wizard.
 */
export function runDecisionEngine(
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

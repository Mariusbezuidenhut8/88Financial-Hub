/**
 * retirementMapper.ts
 *
 * Three responsibilities:
 *
 * 1. mapClientProfileToRetirementPlanner(record)
 *    Extracts retirement-relevant fields from a PlatformRecord and returns
 *    a prefilled RetirementPlannerState with mapping warnings.
 *
 * 2. toProjectionInput(state)
 *    Merges wizard state into the fully-resolved RetirementProjectionInput.
 *    Returns null if any required field is missing.
 *
 * 3. runFullProjection(input)
 *    Orchestrates projection → scenarios → final RetirementPlannerResult.
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  RetirementPlannerMappingResult,
  RetirementPlannerState,
  RetirementProjectionInput,
  RetirementPlannerResult,
} from "../types/retirement-planner.types";
import { getAssumptionPresetValues } from "../types/retirement-planner.types";
import { retirementPlannerInitialState } from "../data/retirementPlannerInitialState";
import { buildRetirementPlannerResult } from "./retirementProjection";
import { attachRetirementScenarios } from "./retirementScenarios";

// ── 1. Profile → wizard state ──────────────────────────────────────────────

/**
 * mapClientProfileToRetirementPlanner
 *
 * Reads a PlatformRecord and produces a prefilled wizard state.
 * Returns warnings for any fields that could not be populated.
 */
export function mapClientProfileToRetirementPlanner(
  record: PlatformRecord,
): RetirementPlannerMappingResult {
  const warnings: string[] = [];
  const { clientProfile } = record;
  const { identity, cashFlow, retirement, assets, employment } = clientProfile;
  void cashFlow; // income fields are on employment

  // ── Age from date of birth
  let currentAge: number | undefined;
  if (identity.dateOfBirth) {
    const dob = new Date(identity.dateOfBirth);
    const today = new Date();
    const rawAge = today.getFullYear() - dob.getFullYear();
    const hadBirthday =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    currentAge = hadBirthday ? rawAge : rawAge - 1;
  }
  if (!currentAge) warnings.push("Client age is missing — date of birth not set.");

  // ── Monthly income
  const monthlyIncome =
    employment?.monthlyGrossIncome ?? employment?.monthlyNetIncome;
  if (!monthlyIncome) warnings.push("Monthly income is missing.");

  // ── Retirement savings — sum all retirement assets
  const retirementAssets = assets?.filter((a) =>
    ["retirement_annuity", "pension_fund", "provident_fund", "preservation_fund",
     "living_annuity", "government_pension"].includes(a.assetType),
  ) ?? [];
  const currentRetirementSavings =
    retirementAssets.length > 0
      ? retirementAssets.reduce((sum: number, a: { currentValue?: number }) => sum + (a.currentValue ?? 0), 0)
      : undefined;
  if (!currentRetirementSavings) warnings.push("Current retirement savings are missing.");

  // ── Monthly contribution
  const currentMonthlyContribution =
    retirement?.monthlyRetirementContribution ?? cashFlow?.monthlyRetirementContributions;
  if (!currentMonthlyContribution) warnings.push("Monthly retirement contribution is missing.");

  // ── Preset from risk profile
  const riskTolerance = retirement?.riskTolerance;
  const preset =
    riskTolerance === "conservative"
      ? ("conservative" as const)
      : riskTolerance === "growth" || riskTolerance === "aggressive"
      ? ("growth" as const)
      : ("balanced" as const);

  const presetValues = getAssumptionPresetValues(preset);

  const state: RetirementPlannerState = {
    ...retirementPlannerInitialState,
    overview: {
      currentAge,
      currentRetirementSavings,
      currentMonthlyContribution,
      monthlyIncome,
    },
    goals: {
      targetRetirementAge:  retirement?.targetRetirementAge ?? 65,
      desiredMonthlyIncome: retirement?.desiredRetirementIncomeMonthly,
      incomeBasis:          "today_money",
    },
    position: {
      currentRetirementSavings,
      monthlyContribution:        currentMonthlyContribution,
      annualContributionIncrease: 5,
      includeNonRetirementAssets: false,
      nonRetirementAssetsValue:   0,
    },
    assumptions: {
      preset,
      ...presetValues,
    },
  };

  return { state, mappingWarnings: warnings };
}

// ── 2. Wizard state → projection input ────────────────────────────────────

/**
 * toProjectionInput
 *
 * Maps wizard state to fully-resolved projection inputs.
 * Returns null if any required field is missing.
 */
export function toProjectionInput(
  state: RetirementPlannerState,
): RetirementProjectionInput | null {
  const { overview, goals, position, assumptions } = state;

  const currentAge         = overview.currentAge;
  const targetRetirementAge = goals.targetRetirementAge;
  const desiredMonthlyIncome = goals.desiredMonthlyIncome;

  const currentRetirementSavings =
    position.currentRetirementSavings ?? overview.currentRetirementSavings ?? 0;
  const monthlyContribution =
    position.monthlyContribution ?? overview.currentMonthlyContribution ?? 0;
  const annualContributionIncrease = position.annualContributionIncrease ?? 5;
  const includeNonRetirementAssets = position.includeNonRetirementAssets ?? false;
  const nonRetirementAssetsValue   = position.nonRetirementAssetsValue ?? 0;
  const incomeBasis                = goals.incomeBasis ?? "today_money";

  // Preset takes precedence over manual assumption fields
  const preset = assumptions.preset;
  const presetValues = preset ? getAssumptionPresetValues(preset) : undefined;

  const preRetirementGrowth  = presetValues?.preRetirementGrowth  ?? assumptions.preRetirementGrowth;
  const postRetirementGrowth = presetValues?.postRetirementGrowth ?? assumptions.postRetirementGrowth;
  const inflation            = presetValues?.inflation             ?? assumptions.inflation;
  const planningAge          = assumptions.planningAge             ?? presetValues?.planningAge ?? 90;
  const sustainableDrawdownRate =
    presetValues?.sustainableDrawdownRate ?? assumptions.sustainableDrawdownRate;

  // Required field check
  if (
    currentAge             === undefined ||
    targetRetirementAge    === undefined ||
    desiredMonthlyIncome   === undefined ||
    preRetirementGrowth    === undefined ||
    postRetirementGrowth   === undefined ||
    inflation              === undefined ||
    sustainableDrawdownRate=== undefined
  ) {
    return null;
  }

  return {
    currentAge,
    targetRetirementAge,
    currentRetirementSavings,
    monthlyContribution,
    annualContributionIncrease,
    includeNonRetirementAssets,
    nonRetirementAssetsValue,
    desiredMonthlyIncome,
    incomeBasis,
    preRetirementGrowth,
    postRetirementGrowth,
    inflation,
    planningAge,
    sustainableDrawdownRate,
  };
}

// ── 3. Full projection orchestration ──────────────────────────────────────

/**
 * runFullProjection
 *
 * Runs projection + attaches scenarios → final RetirementPlannerResult.
 * This is the single call from the wizard's Assumptions step handler.
 */
export function runFullProjection(
  input: RetirementProjectionInput,
): RetirementPlannerResult {
  const result = buildRetirementPlannerResult(input);

  return attachRetirementScenarios(result, {
    ...input,
    baseProjectedMonthlyIncome: result.estimatedMonthlyIncome,
    baseMonthlyIncomeGap:       result.monthlyIncomeGap,
  });
}

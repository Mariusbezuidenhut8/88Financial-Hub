/**
 * retirementProjection.ts
 *
 * Core retirement projection engine.
 * Pure functions — no side effects.
 *
 * Rate convention: all inputs use integer/decimal percentages (e.g. 10 = 10%).
 * toDecimal() converts to fractional form before use in formulae.
 *
 * Public API:
 *   calculateRetirementProjection(input)  → RetirementProjectionOutput
 *   buildRetirementPlannerResult(input)   → RetirementPlannerResult (no scenarios attached)
 *
 * Projection approach:
 *   FV of current capital (annual compounding)
 * + FV of annual contributions with annual step-up (year-by-year)
 * + FV of non-retirement assets (optional)
 * = projectedRetirementCapital
 *
 * Sustainable monthly income = capital × (drawdownRate% / 100) / 12
 *
 * Gap comparison:
 *   incomeBasis === "today_money"   → inflate target to nominal before comparing
 *   incomeBasis === "future_money"  → compare directly
 */

import type {
  RetirementProjectionInput,
  RetirementProjectionOutput,
  RetirementPlannerResult,
  RetirementReadinessStatus,
} from "../types/retirement-planner.types";

// ── Internal helpers ───────────────────────────────────────────────────────

/** Convert integer/decimal percentage to fractional rate (10 → 0.10) */
function toDecimal(percent: number): number {
  return percent / 100;
}

/** Future value of a lump sum: FV = PV × (1 + r)^n */
function futureValueLumpSum(
  presentValue: number,
  annualRatePercent: number,
  years: number,
): number {
  if (years <= 0) return presentValue;
  const r = toDecimal(annualRatePercent);
  return presentValue * Math.pow(1 + r, years);
}

/**
 * Future value of annual contributions with a step-up.
 *
 * Iterates year-by-year. Each year's contribution (= monthly × 12) is invested
 * for the remaining years at the growth rate.
 * The annual contribution grows by annualContributionIncreasePercent each year.
 */
function futureValueGrowingAnnualContributions(
  monthlyContribution: number,
  annualGrowthRatePercent: number,
  annualContributionIncreasePercent: number,
  years: number,
): number {
  if (years <= 0) return 0;
  const r = toDecimal(annualGrowthRatePercent);
  const g = toDecimal(annualContributionIncreasePercent);

  let total = 0;
  let annualContribution = monthlyContribution * 12;

  for (let year = 0; year < years; year++) {
    const yearsRemaining = years - year - 1;
    total += annualContribution * Math.pow(1 + r, yearsRemaining);
    annualContribution *= 1 + g;
  }

  return total;
}

/**
 * Inflate a present-value amount to nominal at a future date.
 * Used to convert "today's money" income targets to nominal at retirement.
 */
function inflateToNominal(
  realAmount: number,
  inflationPercent: number,
  years: number,
): number {
  if (years <= 0) return realAmount;
  const i = toDecimal(inflationPercent);
  return realAmount * Math.pow(1 + i, years);
}

function getReadinessStatus(
  estimatedMonthlyIncome: number,
  targetMonthlyIncome: number,
): RetirementReadinessStatus {
  if (!targetMonthlyIncome || targetMonthlyIncome <= 0) return "unknown";
  const ratio = estimatedMonthlyIncome / targetMonthlyIncome;
  if (ratio >= 1.05) return "ahead";
  if (ratio >= 0.90) return "on_track";
  return "behind";
}

// ── Core projection ────────────────────────────────────────────────────────

export function calculateRetirementProjection(
  input: RetirementProjectionInput,
): RetirementProjectionOutput {
  const yearsToRetirement = Math.max(
    input.targetRetirementAge - input.currentAge,
    0,
  );

  const fvCapital = futureValueLumpSum(
    input.currentRetirementSavings,
    input.preRetirementGrowth,
    yearsToRetirement,
  );

  const fvContributions = futureValueGrowingAnnualContributions(
    input.monthlyContribution,
    input.preRetirementGrowth,
    input.annualContributionIncrease,
    yearsToRetirement,
  );

  const fvOtherAssets = input.includeNonRetirementAssets
    ? futureValueLumpSum(
        input.nonRetirementAssetsValue,
        input.preRetirementGrowth,
        yearsToRetirement,
      )
    : 0;

  const projectedRetirementCapital = fvCapital + fvContributions + fvOtherAssets;

  const estimatedMonthlyIncome =
    (projectedRetirementCapital * toDecimal(input.sustainableDrawdownRate)) / 12;

  const targetMonthlyIncomeAtRetirement =
    input.incomeBasis === "today_money"
      ? inflateToNominal(input.desiredMonthlyIncome, input.inflation, yearsToRetirement)
      : input.desiredMonthlyIncome;

  const monthlyIncomeGap = Math.max(
    targetMonthlyIncomeAtRetirement - estimatedMonthlyIncome,
    0,
  );

  const readinessStatus = getReadinessStatus(
    estimatedMonthlyIncome,
    targetMonthlyIncomeAtRetirement,
  );

  return {
    yearsToRetirement,
    projectedRetirementCapital,
    estimatedMonthlyIncome,
    targetMonthlyIncomeAtRetirement,
    monthlyIncomeGap,
    readinessStatus,
  };
}

// ── Result builder (no scenarios) ─────────────────────────────────────────

export function buildRetirementPlannerResult(
  input: RetirementProjectionInput,
): RetirementPlannerResult {
  const projection = calculateRetirementProjection(input);
  const recommendations = buildRecommendations(
    projection.readinessStatus,
    input.monthlyContribution,
    projection.yearsToRetirement,
    input.annualContributionIncrease,
  );
  const { suggestAdvisor, advisorReasons } = buildAdvisorEscalation(
    projection.monthlyIncomeGap,
    projection.targetMonthlyIncomeAtRetirement,
    projection.yearsToRetirement,
    input.currentRetirementSavings,
  );

  return {
    calculatedAt:               new Date().toISOString(),
    targetRetirementAge:        input.targetRetirementAge,
    desiredMonthlyIncome:       input.desiredMonthlyIncome,
    projectedRetirementCapital: projection.projectedRetirementCapital,
    estimatedMonthlyIncome:     projection.estimatedMonthlyIncome,
    monthlyIncomeGap:           projection.monthlyIncomeGap,
    readinessStatus:            projection.readinessStatus,
    assumptions: {
      preRetirementGrowth:     input.preRetirementGrowth,
      postRetirementGrowth:    input.postRetirementGrowth,
      inflation:               input.inflation,
      planningAge:             input.planningAge,
      sustainableDrawdownRate: input.sustainableDrawdownRate,
    },
    strategyOptions: {},
    recommendations,
    suggestAdvisor,
    advisorReasons,
  };
}

// ── Recommendation text ────────────────────────────────────────────────────

export function buildRecommendations(
  readinessStatus: RetirementReadinessStatus,
  monthlyContribution: number,
  yearsToRetirement: number,
  annualContributionIncrease: number,
): string[] {
  const recs: string[] = [];

  if (readinessStatus === "behind") {
    recs.push("Consider increasing your monthly retirement contributions.");
    if (yearsToRetirement > 2) {
      recs.push("Retiring slightly later could significantly improve your projected outcome.");
    }
    recs.push("Review your long-term investment strategy and risk profile.");
  } else if (readinessStatus === "on_track") {
    recs.push("You appear reasonably close to your retirement target.");
    recs.push("Keep reviewing your contributions and assumptions at least once a year.");
  } else if (readinessStatus === "ahead") {
    recs.push("You appear ahead of your retirement target under current assumptions.");
    recs.push("Review your strategy periodically to maintain flexibility.");
  }

  if (monthlyContribution === 0) {
    recs.push(
      "Starting retirement contributions now — even a small amount — has a large compounding effect over time.",
    );
  }

  if (annualContributionIncrease === 0) {
    recs.push(
      "Increasing contributions annually in line with salary growth can significantly improve your outcome.",
    );
  }

  if (yearsToRetirement < 10 && readinessStatus === "behind") {
    recs.push(
      "With fewer than 10 years to retirement, options to close a gap are more limited. Professional advice is strongly recommended.",
    );
  }

  return recs;
}

// ── Advisor escalation ─────────────────────────────────────────────────────

export function buildAdvisorEscalation(
  monthlyIncomeGap: number,
  targetMonthlyIncome: number,
  yearsToRetirement: number,
  currentSavings: number,
): { suggestAdvisor: boolean; advisorReasons: string[] } {
  const reasons: string[] = [];
  const gapRatio = targetMonthlyIncome > 0 ? monthlyIncomeGap / targetMonthlyIncome : 0;

  if (gapRatio > 0.4) {
    reasons.push(
      "Your projected retirement income gap is significant and warrants a professional review.",
    );
  }
  if (yearsToRetirement < 7) {
    reasons.push("You are within 7 years of your target retirement age.");
  }
  if (currentSavings === 0) {
    reasons.push("You have not yet started accumulating retirement savings.");
  }

  return { suggestAdvisor: reasons.length > 0, advisorReasons: reasons };
}

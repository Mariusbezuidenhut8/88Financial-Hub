/**
 * estateAnalysisEngine.ts
 *
 * Core estate analysis logic.
 *
 * SA-specific rules baked in:
 *   — Estate duty abatement:  R3 500 000 (s4A of Estate Duty Act)
 *   — Estate duty rate:       20% of dutiable estate
 *   — Executor fee tariff:    configurable, default 3.5% of gross estate
 *
 * Engine signature:
 *   runEstateAnalysis(input: EstateAnalysisInput): EstateAnalysisOutput
 */

import type {
  EstateAnalysisInput,
  EstateAnalysisOutput,
  EstateReadinessStatus,
  EstatePlanningUrgency,
} from "../types/estatePlanner.types";

// ── SA constants ───────────────────────────────────────────────────────────

const ESTATE_DUTY_ABATEMENT = 3_500_000;
const ESTATE_DUTY_RATE      = 0.20;

// ── Calculation helpers ────────────────────────────────────────────────────

function calculateGrossEstate(input: EstateAnalysisInput): number {
  // Gross estate = total assets (retirement excluded separately)
  // retirementAssetsExcluded has already been deducted at input stage
  return Math.max(0, input.totalAssets - input.retirementAssetsExcluded);
}

function calculateNetEstate(grossEstate: number, totalLiabilities: number): number {
  return Math.max(0, grossEstate - totalLiabilities);
}

function estimateExecutorFees(grossEstate: number, percentRate: number): number {
  return grossEstate * (percentRate / 100);
}

function estimateEstateDuty(netEstate: number): number {
  const dutiable = Math.max(0, netEstate - ESTATE_DUTY_ABATEMENT);
  return dutiable * ESTATE_DUTY_RATE;
}

function calculateLiquidityNeed(
  executorFees: number,
  estateDuty: number,
  funeralCosts: number,
  otherCosts: number,
): number {
  return executorFees + estateDuty + funeralCosts + otherCosts;
}

function calculateLiquidityShortfall(
  liquidityNeed: number,
  liquidityAvailable: number,
  lifeCover: number,
): number {
  return Math.max(0, liquidityNeed - (liquidityAvailable + lifeCover));
}

// ── Readiness & urgency assessment ────────────────────────────────────────

function assessReadinessStatus(input: EstateAnalysisInput, shortfall: number): EstateReadinessStatus {
  const noWill         = !input.hasWill;
  const minorNoGuard   = input.hasMinorChildren && !input.nominatedGuardian;
  const hasShortfall   = shortfall > 0;
  const crossBorder    = input.crossBorderAssets;

  if (noWill || minorNoGuard || hasShortfall || crossBorder) {
    return "urgent_attention";
  }

  // Count how many best-practice boxes are ticked
  const score = [
    input.hasWill,
    input.beneficiariesReviewed,
    input.executorChosen,
    !input.hasMinorChildren || input.nominatedGuardian,
  ].filter(Boolean).length;

  if (score === 4) return "strong_foundation";
  if (score >= 2) return "developing";
  return "basic_gaps";
}

function assessUrgency(input: EstateAnalysisInput, shortfall: number): EstatePlanningUrgency {
  if (
    !input.hasWill ||
    (input.hasMinorChildren && !input.nominatedGuardian) ||
    shortfall > 100_000 ||
    input.crossBorderAssets ||
    input.anySpecialNeedsDependants
  ) {
    return "critical";
  }

  if (
    shortfall > 0 ||
    input.estateDistributionComplex ||
    !input.beneficiariesReviewed
  ) {
    return "high";
  }

  if (!input.executorChosen) {
    return "moderate";
  }

  return "low";
}

// ── Reasons & cautions ────────────────────────────────────────────────────

function buildReasons(input: EstateAnalysisInput, shortfall: number): string[] {
  const reasons: string[] = [];

  if (input.hasWill) {
    reasons.push("You have a will in place — your estate can be wound up according to your wishes.");
  }
  if (input.beneficiariesReviewed) {
    reasons.push("Beneficiary nominations are up to date — assets can transfer efficiently.");
  }
  if (input.executorChosen) {
    reasons.push("An executor has been chosen — administration should proceed smoothly.");
  }
  if (!input.hasMinorChildren || input.nominatedGuardian) {
    reasons.push("Guardianship arrangements are in order for any minor children.");
  }
  if (shortfall === 0) {
    reasons.push("Your estate appears to have sufficient liquidity to cover estimated costs.");
  }

  if (reasons.length === 0) {
    reasons.push("Your estate plan is at an early stage — completing the steps below will significantly improve your position.");
  }

  return reasons;
}

function buildCautions(input: EstateAnalysisInput, shortfall: number): string[] {
  const cautions: string[] = [];

  if (!input.hasWill) {
    cautions.push(
      "No will recorded — your estate will be wound up under the Intestate Succession Act, which may not reflect your wishes.",
    );
  }
  if (input.hasMinorChildren && !input.nominatedGuardian) {
    cautions.push(
      "Minor children are present but no guardian has been nominated — the court will decide on guardianship.",
    );
  }
  if (shortfall > 0) {
    cautions.push(
      `Estimated liquidity shortfall of R${shortfall.toLocaleString("en-ZA")} — your estate may need to sell assets to cover costs.`,
    );
  }
  if (input.crossBorderAssets) {
    cautions.push(
      "Cross-border assets require separate winding-up in each jurisdiction — specialist legal advice is essential.",
    );
  }
  if (input.anySpecialNeedsDependants) {
    cautions.push(
      "Special needs dependants may require a testamentary trust with professional trustee arrangements.",
    );
  }
  if (input.estateDistributionComplex) {
    cautions.push(
      "Complex distribution arrangements — consider a detailed will with separate bequests or a trust structure.",
    );
  }

  return cautions;
}

function buildRecommendedActions(
  input: EstateAnalysisInput,
  shortfall: number,
): string[] {
  const actions: string[] = [];

  if (!input.hasWill) {
    actions.push("Draft or update your will with a qualified estate planning attorney.");
  }
  if (input.hasMinorChildren && !input.nominatedGuardian) {
    actions.push("Nominate a guardian for your minor children in your will immediately.");
  }
  if (!input.beneficiariesReviewed) {
    actions.push("Review and update beneficiary nominations on all policies and retirement funds.");
  }
  if (!input.executorChosen) {
    actions.push("Appoint an executor — consider a professional executor or a trusted individual.");
  }
  if (shortfall > 0) {
    actions.push(
      `Increase life cover by approximately R${shortfall.toLocaleString("en-ZA")} to fund the estimated estate liquidity shortfall.`,
    );
  }
  if (input.crossBorderAssets) {
    actions.push("Seek specialist legal advice for cross-border asset planning.");
  }
  if (input.anySpecialNeedsDependants) {
    actions.push("Set up a testamentary trust to provide for special needs dependants.");
  }
  if (input.estateDistributionComplex) {
    actions.push("Consider a living trust or detailed testamentary trust to manage complex distributions.");
  }
  if (actions.length === 0) {
    actions.push("Review your estate plan every 3–5 years or after any major life event.");
  }

  return actions;
}

// ── Engine entry point ─────────────────────────────────────────────────────

/**
 * runEstateAnalysis
 *
 * Pure function — given a fully resolved EstateAnalysisInput, returns a
 * complete EstateAnalysisOutput with all valuations and recommendations.
 */
export function runEstateAnalysis(input: EstateAnalysisInput): EstateAnalysisOutput {
  // ── Valuation
  const grossEstateValue    = calculateGrossEstate(input);
  const netEstateValue      = calculateNetEstate(grossEstateValue, input.totalLiabilities);
  const estimatedExecutorFees = estimateExecutorFees(grossEstateValue, input.executorFeePercent);
  const estimatedEstateDuty   = estimateEstateDuty(netEstateValue);

  // ── Liquidity
  const estimatedLiquidityNeed = calculateLiquidityNeed(
    estimatedExecutorFees,
    estimatedEstateDuty,
    input.funeralCostsEstimate,
    input.estimatedOtherCosts,
  );
  const estimatedLiquidityAvailable = input.liquidityAvailableAtDeath + input.lifeCoverForLiquidity;
  const estimatedLiquidityShortfall = calculateLiquidityShortfall(
    estimatedLiquidityNeed,
    input.liquidityAvailableAtDeath,
    input.lifeCoverForLiquidity,
  );

  // ── Assessment
  const readinessStatus = assessReadinessStatus(input, estimatedLiquidityShortfall);
  const urgency         = assessUrgency(input, estimatedLiquidityShortfall);
  const reasons         = buildReasons(input, estimatedLiquidityShortfall);
  const cautions        = buildCautions(input, estimatedLiquidityShortfall);
  const recommendedActions = buildRecommendedActions(input, estimatedLiquidityShortfall);

  return {
    grossEstateValue,
    netEstateValue,
    estimatedExecutorFees,
    estimatedEstateDuty,
    estimatedLiquidityNeed,
    estimatedLiquidityAvailable,
    estimatedLiquidityShortfall,
    readinessStatus,
    urgency,
    reasons,
    cautions,
    recommendedActions,
  };
}

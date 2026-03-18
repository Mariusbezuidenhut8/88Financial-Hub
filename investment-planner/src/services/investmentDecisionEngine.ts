/**
 * investmentDecisionEngine.ts
 *
 * Rule-based wrapper recommendation engine.
 * Maps a resolved InvestmentDecisionInput to a primary recommendation,
 * optional alternative, reason statements, and cautions.
 *
 * Rule evaluation order (earlier match wins):
 *   1. Build reserve first — reserve weak + high liquidity or short horizon
 *   2. Retirement Annuity — retirement goal + long horizon + can lock
 *   3. Combination (retirement, needs flexibility)
 *   4. TFSA — long/medium horizon, wealth / education / general goals
 *   5. Endowment — high tax band + long horizon + low liquidity
 *   6. Discretionary — short/medium horizon or high flexibility need
 *   7. Combination (default multi-objective fallback)
 *
 * Design principles:
 * - Every reason statement is advisory, not a regulated recommendation
 * - Cautions are honest — the engine acknowledges limitations
 * - No side effects — pure function
 */

import type {
  InvestmentDecisionInput,
  InvestmentDecisionOutput,
  InvestmentRecommendationType,
} from "../types/investmentPlanner.types";

// ── Helpers ────────────────────────────────────────────────────────────────

function addReason(reasons: string[], text: string): void {
  if (!reasons.includes(text)) reasons.push(text);
}

function addCaution(cautions: string[], text: string): void {
  if (!cautions.includes(text)) cautions.push(text);
}

/**
 * calculateEmergencyMonths
 * Returns how many months of essential expenses the emergency fund covers.
 */
function calculateEmergencyMonths(
  emergencyFundAmount:      number,
  monthlyEssentialExpenses: number,
): number {
  if (!monthlyEssentialExpenses || monthlyEssentialExpenses <= 0) return 0;
  return emergencyFundAmount / monthlyEssentialExpenses;
}

/**
 * isReserveWeak
 * Returns true when the emergency fund covers fewer than 2 months of
 * essential expenses — threshold for prioritising liquidity over investing.
 */
function isReserveWeak(input: InvestmentDecisionInput): boolean {
  return calculateEmergencyMonths(
    input.emergencyFundAmount,
    input.monthlyEssentialExpenses,
  ) < 2;
}

// ── Rule 1: Build reserve first ────────────────────────────────────────────

function evaluateReserveFirst(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  if (
    isReserveWeak(input) &&
    (input.liquidityNeed === "high" ||
      input.primaryGoal === "emergency_reserve" ||
      input.horizonBand === "under_3")
  ) {
    addReason(
      reasons,
      "Your current cash reserve may need strengthening before committing too much to long-term investing.",
    );
    addReason(
      reasons,
      "High liquidity needs usually favour accessible cash or flexible savings first.",
    );
    if (input.primaryGoal === "retirement") {
      addCaution(
        cautions,
        "Retirement planning remains important, but short-term resilience may need attention first.",
      );
    }
    return {
      primaryRecommendation:     "build_reserve_first",
      alternativeRecommendation: "discretionary",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 2: Retirement Annuity ─────────────────────────────────────────────

function evaluateRA(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  if (
    input.primaryGoal === "retirement" &&
    input.horizonBand === "10_plus" &&
    input.canLockUntilRetirement &&
    input.liquidityNeed === "low"
  ) {
    addReason(reasons, "Your goal is retirement-focused with a long investment horizon.");
    addReason(reasons, "You indicated that the funds can remain invested until retirement.");
    addReason(
      reasons,
      "A retirement annuity may support long-term retirement discipline and tax efficiency.",
    );

    if (input.wantsMaximumFlexibility) {
      // Flexibility preference overrides pure RA path
      addCaution(
        cautions,
        "Retirement annuities generally reduce access to funds before retirement.",
      );
      return {
        primaryRecommendation:     "combination",
        alternativeRecommendation: "ra",
        reasons,
        cautions,
      };
    }

    return {
      primaryRecommendation:     "ra",
      alternativeRecommendation: "tfsa",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 3: Retirement goal but needs flexibility ──────────────────────────

function evaluateRetirementWithFlexibility(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  if (
    input.primaryGoal === "retirement" &&
    input.horizonBand === "10_plus" &&
    !input.canLockUntilRetirement
  ) {
    addReason(
      reasons,
      "Your goal is retirement-oriented, but you indicated a need for more flexibility.",
    );
    addReason(
      reasons,
      "A combination of retirement and flexible investing may suit this balance better.",
    );
    addCaution(
      cautions,
      "Keeping everything fully flexible may reduce retirement discipline over time.",
    );
    return {
      primaryRecommendation:     "combination",
      alternativeRecommendation: "tfsa",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 4: TFSA ───────────────────────────────────────────────────────────

function evaluateTFSA(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  const isLongOrMedium =
    input.horizonBand === "10_plus" || input.horizonBand === "5_to_10";
  const suitableGoal =
    input.primaryGoal === "wealth_building" ||
    input.primaryGoal === "general_investing" ||
    input.primaryGoal === "education";

  if (
    isLongOrMedium &&
    input.liquidityNeed !== "high" &&
    suitableGoal
  ) {
    addReason(
      reasons,
      "Your long-term horizon supports tax-efficient long-term compounding.",
    );
    addReason(
      reasons,
      "A tax-free savings account may be a strong wrapper for long-term growth.",
    );

    if (input.hasUsedTFSA === "no") {
      addReason(
        reasons,
        "You have not yet used your TFSA allowance — this is typically one of the first tax-efficient tools to consider.",
      );
    }

    if (input.hasUsedTFSA === "yes") {
      addCaution(
        cautions,
        "Check your remaining TFSA lifetime allowance (R500 000) before contributing further.",
      );
      return {
        primaryRecommendation:     "combination",
        alternativeRecommendation: "discretionary",
        reasons,
        cautions,
      };
    }

    return {
      primaryRecommendation:     "tfsa",
      alternativeRecommendation: "discretionary",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 5: Endowment ──────────────────────────────────────────────────────

function evaluateEndowment(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  if (
    input.taxBand === "high" &&
    (input.horizonBand === "5_to_10" || input.horizonBand === "10_plus") &&
    input.liquidityNeed === "low" &&
    !input.wantsMaximumFlexibility
  ) {
    addReason(
      reasons,
      "Your broad tax context suggests that tax-efficient wrapper choices may matter more.",
    );
    addReason(
      reasons,
      "A longer horizon with lower liquidity need may make an endowment worth considering.",
    );
    addCaution(
      cautions,
      "Endowments are typically more suitable only in specific tax and planning contexts.",
    );
    return {
      primaryRecommendation:     "endowment",
      alternativeRecommendation: "combination",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 6: Discretionary ──────────────────────────────────────────────────

function evaluateDiscretionary(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput | null {
  if (
    input.horizonBand === "under_3" ||
    input.horizonBand === "3_to_5"  ||
    input.liquidityNeed === "high"  ||
    input.wantsMaximumFlexibility
  ) {
    addReason(
      reasons,
      "Your time horizon or liquidity needs suggest that flexibility is important.",
    );
    addReason(
      reasons,
      "A discretionary investment approach may be more suitable where access is important.",
    );
    if (input.primaryGoal === "retirement") {
      addCaution(
        cautions,
        "Using only flexible investments for retirement may reduce long-term discipline.",
      );
    }
    return {
      primaryRecommendation:     "discretionary",
      alternativeRecommendation: "tfsa",
      reasons,
      cautions,
    };
  }
  return null;
}

// ── Rule 7: Combination fallback ───────────────────────────────────────────

function evaluateCombination(
  input: InvestmentDecisionInput,
  reasons: string[],
  cautions: string[],
): InvestmentDecisionOutput {
  addReason(
    reasons,
    "Your needs appear to balance long-term growth, tax awareness, and flexibility.",
  );
  addReason(
    reasons,
    "A combination approach may help spread benefits across different wrappers.",
  );
  return {
    primaryRecommendation:     "combination",
    alternativeRecommendation: "tfsa",
    reasons,
    cautions,
  };
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * determineInvestmentRecommendation
 *
 * Evaluates the rule sequence in priority order and returns the primary
 * and alternative wrapper recommendation with reasons and cautions.
 *
 * The result does not include strategyDirection — that is added by
 * buildInvestmentPlannerResult() via the strategy builder.
 */
export function determineInvestmentRecommendation(
  input: InvestmentDecisionInput,
): InvestmentDecisionOutput {
  const reasons:  string[] = [];
  const cautions: string[] = [];

  return (
    evaluateReserveFirst(input, reasons, cautions)          ??
    evaluateRA(input, reasons, cautions)                    ??
    evaluateRetirementWithFlexibility(input, reasons, cautions) ??
    evaluateTFSA(input, reasons, cautions)                  ??
    evaluateEndowment(input, reasons, cautions)             ??
    evaluateDiscretionary(input, reasons, cautions)         ??
    evaluateCombination(input, reasons, cautions)
  );
}

// ── Display helper ─────────────────────────────────────────────────────────

/**
 * labelRecommendation
 * Returns a human-readable label for a wrapper recommendation type.
 */
export function labelRecommendation(
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

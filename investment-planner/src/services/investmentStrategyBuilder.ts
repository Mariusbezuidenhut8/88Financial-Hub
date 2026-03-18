/**
 * investmentStrategyBuilder.ts
 *
 * Translates a wrapper recommendation + decision input into a prioritised,
 * plain-language strategy direction.
 *
 * Each path:
 * - Lists action steps in the order the client should consider them
 * - Surfaces savings capacity figures where available
 * - Signals whether an adviser conversation is advisable
 *
 * Returns InvestmentStrategyOutput including:
 *   - strategyDirection: string[]
 *   - suggestAdvisor: boolean
 *   - advisorReasons: string[]
 */

import type {
  InvestmentDecisionInput,
  InvestmentRecommendationType,
  InvestmentStrategyOutput,
} from "../types/investmentPlanner.types";

// ── Path builders ──────────────────────────────────────────────────────────

function buildReserveFirstStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [
    "Focus first on building a stronger emergency reserve before committing too much to long-term investing.",
    "Aim for 3–6 months of essential expenses in an accessible savings or money-market account.",
    "Keep funds accessible while your short-term resilience is still being strengthened.",
    "Once your reserve is stronger, review longer-term investment options again.",
  ];
  if (input.monthlySavingsCapacity > 0) {
    steps.push(
      `Your estimated monthly savings capacity of R${Math.round(input.monthlySavingsCapacity).toLocaleString("en-ZA")} can start building your reserve immediately.`,
    );
  }
  return { strategyDirection: steps, suggestAdvisor: false, advisorReasons: [] };
}

function buildTFSAStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [
    "Use tax-free investing as a long-term compounding vehicle where appropriate.",
    "Annual contributions are capped at R36 000 — invest consistently to maximise the allowance.",
    "Avoid unnecessary withdrawals if the goal is long-term growth.",
  ];
  if (input.hasExistingRA) {
    steps.push(
      "Your RA is already in place for retirement — your TFSA can complement it as a flexible long-term layer.",
    );
  }
  if (input.monthlySavingsCapacity > 3_000) {
    steps.push(
      "Once your TFSA annual limit is reached, direct additional savings into a discretionary investment account.",
    );
  }
  return { strategyDirection: steps, suggestAdvisor: false, advisorReasons: [] };
}

function buildRAStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [
    "Use retirement investing primarily for long-term retirement funding.",
    "Prioritise contributions consistently over time to strengthen retirement outcomes.",
    "Be comfortable with reduced access before retirement when using retirement-focused wrappers.",
    "Aim to contribute up to 27.5% of taxable income (max R350 000 p.a.) to maximise the tax deduction.",
  ];
  if (!input.hasExistingRA) {
    steps.push("You do not yet have an RA in place — opening one should be the first action step.");
  }
  if (input.monthlySavingsCapacity > input.monthlyContributionAmount) {
    const remaining = input.monthlySavingsCapacity - input.monthlyContributionAmount;
    steps.push(
      `After your RA contribution, consider directing the remaining R${Math.round(remaining).toLocaleString("en-ZA")}/month into a TFSA.`,
    );
  }
  return {
    strategyDirection: steps,
    suggestAdvisor:    !input.hasExistingRA,
    advisorReasons:    !input.hasExistingRA
      ? ["Selecting the right RA structure is an important decision — an adviser can help optimise this."]
      : [],
  };
}

function buildDiscretionaryStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [
    "Use a flexible investment route where access and optionality matter.",
    "Match the investment strategy to the time horizon so funds are not exposed to unnecessary risk.",
  ];
  if (input.plannedUse) {
    steps.push(
      "You have a specific planned use for these funds — reduce portfolio volatility as your target date approaches.",
    );
  }
  steps.push(
    "Review whether some of the contribution should later move into more tax-efficient long-term structures.",
  );
  if (input.taxBand !== "low" && input.horizonBand !== "under_3") {
    steps.push(
      "Consider maxing your TFSA allowance first to reduce the tax drag on growth in a discretionary account.",
    );
  }
  return { strategyDirection: steps, suggestAdvisor: false, advisorReasons: [] };
}

function buildEndowmentStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [
    "Review whether a tax-sensitive wrapper is appropriate for your planning context — confirm with an adviser.",
    "Tax on investment returns inside the endowment is capped at 30%, benefiting investors with a marginal rate above 30%.",
    "Commit to the 5-year restriction period — do not allocate funds you may need to access early.",
    "After the restriction period, withdrawals are tax-free in your hands.",
    "Ensure you maintain separate accessible savings alongside the endowment for liquidity.",
  ];
  return {
    strategyDirection: steps,
    suggestAdvisor:    true,
    advisorReasons:    [
      "Endowment suitability depends on your full tax profile — adviser confirmation is recommended before implementation.",
    ],
  };
}

function buildCombinationStrategy(
  input: InvestmentDecisionInput,
): InvestmentStrategyOutput {
  const steps: string[] = [];

  if (input.primaryGoal === "retirement" || input.hasExistingRA) {
    steps.push(
      "Step 1: prioritise retirement annuity contributions — use the tax deduction to reduce your tax liability.",
      "Step 2: direct remaining monthly savings into a TFSA to build tax-free long-term wealth alongside your RA.",
    );
  } else {
    steps.push(
      "Step 1: allocate to a TFSA up to the annual limit for tax-efficient long-term growth.",
      "Step 2: direct any savings beyond the TFSA limit into a discretionary account for flexibility.",
    );
  }

  if (input.lumpSumAmount > 0) {
    steps.push(
      `For the lump sum of R${Math.round(input.lumpSumAmount).toLocaleString("en-ZA")}, consider splitting between TFSA (up to remaining allowance) and a discretionary or endowment wrapper for the balance.`,
    );
  }

  steps.push(
    "Use the retirement or tax-efficient wrapper for discipline and compounding.",
    "Use the flexible component for optionality, medium-term needs, or overflow contributions.",
    "Review your contribution split annually — as your savings grow, the balance may shift.",
  );

  return {
    strategyDirection: steps,
    suggestAdvisor:    true,
    advisorReasons:    [
      "A combination strategy benefits from professional guidance to allocate contributions optimally across wrappers.",
    ],
  };
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * buildInvestmentStrategyDirection
 *
 * Returns a prioritised strategy direction, adviser flag, and adviser reasons
 * for the given wrapper recommendation and decision input.
 */
export function buildInvestmentStrategyDirection(
  recommendation: InvestmentRecommendationType,
  input:          InvestmentDecisionInput,
): InvestmentStrategyOutput {
  switch (recommendation) {
    case "build_reserve_first": return buildReserveFirstStrategy(input);
    case "tfsa":                return buildTFSAStrategy(input);
    case "ra":                  return buildRAStrategy(input);
    case "discretionary":       return buildDiscretionaryStrategy(input);
    case "endowment":           return buildEndowmentStrategy(input);
    case "combination":         return buildCombinationStrategy(input);
  }
}

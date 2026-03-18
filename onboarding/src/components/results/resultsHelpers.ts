import type { FinancialHealthBand } from "../../types/financial-health.types";

export function getBandLabel(band: FinancialHealthBand): string {
  switch (band) {
    case "strong":                return "Strong";
    case "good_foundation":       return "Good foundation";
    case "needs_attention":       return "Needs attention";
    case "financial_stress_risk": return "Financial stress risk";
    case "urgent_action_needed":  return "Urgent action needed";
  }
}

type CategoryTitle = "Cash Flow" | "Debt" | "Emergency Fund" | "Protection" | "Retirement";

// ── Per-category, 5-tier non-judgmental copy ──────────────────────────────

const INTERPRETATIONS: Record<CategoryTitle, (score: number) => string> = {
  "Cash Flow": (s) => {
    if (s >= 16) return "Your cash flow looks healthy — you appear to have a comfortable surplus each month.";
    if (s >= 12) return "You appear to have some room to save, but there is still space to improve resilience.";
    if (s >= 8)  return "Your cash flow may be under some pressure — small changes could make a big difference.";
    if (s >= 4)  return "Month-end pressure is showing — addressing this could unlock progress across the board.";
    return "Cash flow needs strengthening — this affects your ability to build on everything else.";
  },
  "Debt": (s) => {
    if (s >= 16) return "Your debt load looks manageable relative to your income.";
    if (s >= 12) return "Debt is manageable but worth monitoring as you build towards your goals.";
    if (s >= 8)  return "Debt repayments are taking a significant share of your income — worth reviewing.";
    if (s >= 4)  return "A high portion of your income is going to debt — reducing this would strengthen your position.";
    return "Debt is placing strain on your finances — a structured repayment plan could help considerably.";
  },
  "Emergency Fund": (s) => {
    if (s >= 16) return "You have a solid emergency reserve — this is a strong financial foundation.";
    if (s >= 12) return "Your emergency fund is building well — aim for 6 months of essential expenses.";
    if (s >= 8)  return "Your short-term reserve may need strengthening to protect against unexpected events.";
    if (s >= 4)  return "A limited emergency fund leaves you exposed — building this up is a key next step.";
    return "No emergency reserve was detected — this is typically the most important first step to take.";
  },
  "Protection": (s) => {
    if (s >= 16) return "Your protection looks well set up — you and your family appear well covered.";
    if (s >= 12) return "Your protection is in place but a review may reveal some gaps worth addressing.";
    if (s >= 8)  return "Some protection gaps were detected — reviewing your cover could meaningfully reduce risk.";
    if (s >= 4)  return "Important protection gaps may be leaving you or your family exposed to financial risk.";
    return "Significant protection gaps were found — addressing these should be a priority.";
  },
  "Retirement": (s) => {
    if (s >= 16) return "Your retirement savings trajectory looks strong — keep building on this foundation.";
    if (s >= 12) return "You're building towards retirement — a detailed review may help optimise your plan.";
    if (s >= 8)  return "Retirement readiness may need attention — earlier action makes a meaningful difference.";
    if (s >= 4)  return "Retirement savings appear to be behind where they could be — addressing this soon is important.";
    return "Retirement planning needs attention — the earlier you act, the greater the impact.";
  },
};

export function getCategoryInterpretation(title: CategoryTitle, score: number): string {
  return INTERPRETATIONS[title](score);
}

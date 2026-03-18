import { OnboardingState, RecommendedTool } from "../types/onboarding-state.types";
import type { FinancialHealthScoreResult } from "../types/financial-health.types";
import type { OnboardingRouteResult, NextStepRecommendation } from "../types/onboarding-results.types";

/**
 * recommendation-router.ts
 *
 * Public API:
 *   recommendTools()           → RecommendedTool[]    (simple list, for backward compat)
 *   getOnboardingRouteResult() → OnboardingRouteResult (full result for the Results screen)
 */
function buildToolRecommendations(
  state: OnboardingState,
  score: FinancialHealthScoreResult,
): RecommendedTool[] {
  const recommendations: RecommendedTool[] = [];
  const { protectionEstate, family, priorities } = state;

  const userPriorities = new Set(priorities.selectedPriorities ?? []);
  const totalDependants =
    (family.numberOfChildren ?? 0) +
    (family.parentsSupported ?? 0) +
    (family.hasSpouseOrPartner ? 1 : 0);

  // ── Funeral Cover Studio ───────────────────────────────────────────────
  const funeralUrgent =
    !protectionEstate.hasFuneralCover ||
    userPriorities.has("prepare_funeral_cover") ||
    userPriorities.has("protect_my_family");

  if (!protectionEstate.hasFuneralCover || score.categoryScores.protection < 10) {
    recommendations.push({
      toolId: "funeral_cover_studio",
      label: "Funeral Cover",
      reason: protectionEstate.hasFuneralCover
        ? "Your funeral cover may need reviewing for your family size"
        : "You have no funeral cover — this is one of the most affordable protections available",
      priority: funeralUrgent ? 1 : 3,
      isUrgent: !protectionEstate.hasFuneralCover,
    });
  }

  // ── Protection Planner ────────────────────────────────────────────────
  const protectionUrgent =
    (!protectionEstate.hasLifeCover && totalDependants > 0) ||
    !protectionEstate.hasDisabilityOrIncomeProtection ||
    userPriorities.has("protect_my_family");

  if (score.categoryScores.protection < 15 || protectionUrgent) {
    recommendations.push({
      toolId: "protection_planner",
      label: "Protection Planner",
      reason:
        !protectionEstate.hasLifeCover && totalDependants > 0
          ? "You have dependants but no life cover — this is an urgent gap"
          : "Calculate exactly how much life and disability cover you need",
      priority: protectionUrgent ? 1 : 2,
      isUrgent: !protectionEstate.hasLifeCover && totalDependants > 0,
    });
  }

  // ── Retirement Architect ───────────────────────────────────────────────
  const retirementUrgent =
    score.categoryScores.retirement < 10 ||
    userPriorities.has("retire_comfortably");

  if (score.categoryScores.retirement < 16 || userPriorities.has("retire_comfortably")) {
    recommendations.push({
      toolId: "retirement_architect",
      label: "Retirement Architect",
      reason:
        score.categoryScores.retirement < 10
          ? "Your retirement savings are significantly behind — this needs urgent attention"
          : "See exactly where your retirement is headed and what it takes to get on track",
      priority: retirementUrgent ? 1 : 2,
      isUrgent: score.categoryScores.retirement < 8,
    });
  }

  // ── Estate Architect ──────────────────────────────────────────────────
  const estateUrgent =
    !protectionEstate.hasWill ||
    userPriorities.has("plan_my_estate") ||
    (family.hasMinorChildren ?? false);

  if (!protectionEstate.hasWill || userPriorities.has("plan_my_estate")) {
    recommendations.push({
      toolId: "estate_architect",
      label: "Estate Architect",
      reason:
        !protectionEstate.hasWill
          ? family.hasMinorChildren
            ? "No will with minor children — this is critical"
            : "You don't have a valid will — this should be sorted soon"
          : "Review your estate plan and check for duty or liquidity gaps",
      priority: estateUrgent ? 1 : 3,
      isUrgent: !protectionEstate.hasWill && (family.hasMinorChildren ?? false),
    });
  }

  // ── Investment Planner ────────────────────────────────────────────────
  if (
    userPriorities.has("invest_better") ||
    userPriorities.has("build_emergency_fund") ||
    score.categoryScores.cashFlow >= 15
  ) {
    recommendations.push({
      toolId: "investment_planner",
      label: "Investment Planner",
      reason: userPriorities.has("invest_better")
        ? "You flagged investing better as a priority — find the right wrapper for your situation"
        : "You have good cash flow — explore the most tax-efficient way to invest your surplus",
      priority: 3,
      isUrgent: false,
    });
  }

  recommendations.sort((a, b) => {
    if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
    return a.priority - b.priority;
  });

  return recommendations.slice(0, 3);
}

// ── Advisor signal ────────────────────────────────────────────────────────────

/**
 * Advisor help is recommended when the combination of gaps is complex enough
 * that a human conversation adds more value than self-service tools.
 *
 * Triggers when ANY of:
 *   - overall score < 35  (urgent_action_needed band)
 *   - 2+ recommended tools are flagged isUrgent
 *   - user's helpTiming is "ready_now" AND score < 50
 */
function shouldRecommendAdvisor(
  state: OnboardingState,
  score: FinancialHealthScoreResult,
  tools: RecommendedTool[],
): boolean {
  if (score.overallScore < 35) return true;
  if (tools.filter((t) => t.isUrgent).length >= 2) return true;
  if (state.priorities.helpTiming === "ready_now" && score.overallScore < 50) return true;
  return false;
}

// ── Internal mapping ──────────────────────────────────────────────────────────

const TOOL_KEYS: Record<RecommendedTool["toolId"], string> = {
  funeral_cover_studio: "funeral",
  retirement_architect: "retirement",
  protection_planner:   "protection",
  estate_architect:     "estate",
  investment_planner:   "investment",
};

function toNextStep(tool: RecommendedTool): NextStepRecommendation {
  return {
    key:      TOOL_KEYS[tool.toolId],
    title:    tool.label,
    reason:   tool.reason,
    priority: tool.priority,
  };
}

function deriveComplexityReasons(
  state: OnboardingState,
  score: FinancialHealthScoreResult,
  tools: RecommendedTool[],
): string[] {
  const reasons: string[] = [];
  if (score.overallScore < 35) {
    reasons.push("Your overall financial position needs urgent attention.");
  }
  const urgentTools = tools.filter((t) => t.isUrgent);
  for (const t of urgentTools) {
    reasons.push(t.reason);
  }
  if (state.priorities.helpTiming === "ready_now" && score.overallScore < 50) {
    reasons.push("You indicated you're ready to take action now.");
  }
  return reasons;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * recommendTools — returns the ordered tool list only.
 * Kept for direct use when the full OnboardingRouteResult is not needed.
 */
export function recommendTools(
  state: OnboardingState,
  score: FinancialHealthScoreResult,
): RecommendedTool[] {
  return buildToolRecommendations(state, score);
}

/**
 * getOnboardingRouteResult — primary route API for the Results screen.
 *
 * Returns OnboardingRouteResult including:
 *   - ordered display-ready tool recommendations (NextStepRecommendation[])
 *   - advisor signal (shouldSuggestAdvisor)
 *   - complexity reasons driving the advisor signal (complexityReasons)
 */
export function getOnboardingRouteResult(
  state: OnboardingState,
  score: FinancialHealthScoreResult,
): OnboardingRouteResult {
  const tools = buildToolRecommendations(state, score);
  const shouldSuggestAdvisor = shouldRecommendAdvisor(state, score, tools);
  const complexityReasons = shouldSuggestAdvisor
    ? deriveComplexityReasons(state, score, tools)
    : [];

  return {
    recommendedTools: tools.map(toNextStep),
    shouldSuggestAdvisor,
    complexityReasons,
  };
}

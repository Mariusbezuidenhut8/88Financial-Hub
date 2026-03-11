import { OnboardingState, RecommendedTool } from "../types/onboarding-state.types";
import { HealthScoreResult } from "./health-score-calculator";

/**
 * recommendation-router.ts
 *
 * After the health score is calculated, determine which tools to recommend
 * and in what order. Returns an ordered list of RecommendedTool objects.
 *
 * Logic: score-based + gap-based + priority-based
 */
export function recommendTools(
  state: OnboardingState,
  score: HealthScoreResult
): RecommendedTool[] {
  const recommendations: RecommendedTool[] = [];
  const { protectionEstate, savings, family, spending, priorities } = state;

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

  // Sort: urgent first, then by priority, then deduplicate
  recommendations.sort((a, b) => {
    if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
    return a.priority - b.priority;
  });

  // Return top 3
  return recommendations.slice(0, 3);
}

/**
 * Types for the Results screen data flow.
 *
 * ResultsPageData is the single input shape for both:
 *   - OnboardingResultsPage (full page)
 *   - ResultsStep (wizard step)
 *
 * It binds together the three outputs of the onboarding intelligence loop:
 *   onboardingState → calculateHealthScore → getOnboardingRouteResult
 */

import type { FinancialHealthScoreResult } from "./financial-health.types";

/**
 * NextStepRecommendation — a single tool recommendation for display on the Results screen.
 *
 * Display-oriented shape: uses `key` (string) and `title` (human label)
 * rather than the internal `toolId` union.
 */
export interface NextStepRecommendation {
  /** Stable key used to navigate to the tool e.g. "retirement", "protection" */
  key: string;
  /** Human-readable tool name */
  title: string;
  /** Why this tool is recommended for this client */
  reason: string;
  /** 1 = highest priority */
  priority: number;
}

/**
 * OnboardingRouteResult — the full output of the recommendation router.
 *
 * Richer than a plain NextStepRecommendation[] because it also carries:
 * - an advisor signal (multiple urgent gaps = human help needed)
 * - the reasons driving that signal (shown in the Help Path section)
 */
export interface OnboardingRouteResult {
  /** Top 3 tools, sorted by urgency then priority */
  recommendedTools: NextStepRecommendation[];

  /**
   * True when the combination of gaps is complex enough that
   * a human adviser adds more value than self-service tools.
   *
   * Triggers when:
   *   - overallScore < 35 (urgent_action_needed), OR
   *   - 2 or more tools are flagged isUrgent, OR
   *   - user indicated helpTiming = "ready_now" AND score < 50
   */
  shouldSuggestAdvisor: boolean;

  /**
   * Human-readable reasons explaining why advisor help is suggested.
   * Shown in HelpPathSection as a contextual callout.
   * Empty array when shouldSuggestAdvisor is false.
   */
  complexityReasons: string[];
}

/**
 * ResultsPageData — the single prop bundle for the Results screen.
 *
 * Assembled in OnboardingWizard after the results step is reached:
 *
 *   const score = calculateHealthScore(state);
 *   const routeResult = getOnboardingRouteResult(state, score);
 *
 *   <OnboardingResultsPage
 *     firstName={state.about.firstName}
 *     scoreResult={score}
 *     routeResult={routeResult}
 *   />
 */
export interface ResultsPageData {
  firstName?: string;
  scoreResult: FinancialHealthScoreResult;
  routeResult: OnboardingRouteResult;
}

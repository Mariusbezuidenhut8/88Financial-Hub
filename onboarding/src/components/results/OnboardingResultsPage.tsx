import React from "react";
import type { ResultsPageData } from "../../types/onboarding-results.types";
import ResultsHeader from "./ResultsHeader";
import OverallScoreCard from "./OverallScoreCard";
import CategoryBreakdownGrid from "./CategoryBreakdownGrid";
import PriorityActionsCard from "./PriorityActionsCard";
import RecommendedToolsSection from "./RecommendedToolsSection";
import HelpPathSection from "./HelpPathSection";
import ResultsFooterActions from "./ResultsFooterActions";

interface OnboardingResultsPageProps extends ResultsPageData {
  onOpenTool?: (key: string) => void;
  onGoToDashboard?: () => void;
  onContinueSelfService?: () => void;
  onGuidedHelp?: () => void;
  onAdvisorHelp?: () => void;
}

/**
 * OnboardingResultsPage
 *
 * Full-page composition for the results screen — used when rendered as a
 * standalone route (e.g. /onboard/results). The host app provides its own
 * page shell (header, nav, etc.).
 *
 * Props use ResultsPageData as the canonical data bundle:
 *   { firstName, scoreResult, routeResult }
 *
 * For use inside the wizard flow, use ResultsStep instead.
 */
export default function OnboardingResultsPage({
  firstName,
  scoreResult,
  routeResult,
  onOpenTool = () => {},
  onGoToDashboard,
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}: OnboardingResultsPageProps) {
  const topTool = routeResult.recommendedTools[0];

  const primaryLabel = routeResult.shouldSuggestAdvisor
    ? "Talk to an advisor"
    : topTool
      ? `Start with ${topTool.title}`
      : "Go to my dashboard";

  const primaryClick = routeResult.shouldSuggestAdvisor
    ? (onAdvisorHelp ?? (() => {}))
    : topTool
      ? () => onOpenTool(topTool.key)
      : (onGoToDashboard ?? (() => {}));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* A. Header */}
        <ResultsHeader firstName={firstName ?? "there"} />

        {/* B. Overall Score Card */}
        <OverallScoreCard
          score={scoreResult.overallScore}
          band={scoreResult.band}
          summary={scoreResult.summary}
        />

        {/* C. Category Breakdown */}
        <CategoryBreakdownGrid categoryScores={scoreResult.categoryScores} />

        {/* D. Priorities + Help — 2-column on desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PriorityActionsCard actions={scoreResult.priorityActions} />

          <HelpPathSection
            shouldSuggestAdvisor={routeResult.shouldSuggestAdvisor}
            complexityReasons={routeResult.complexityReasons}
            onContinueSelfService={onContinueSelfService}
            onGuidedHelp={onGuidedHelp}
            onAdvisorHelp={onAdvisorHelp}
          />
        </div>

        {/* E. Recommended Next Steps */}
        <RecommendedToolsSection
          recommendations={routeResult.recommendedTools}
          onOpenTool={onOpenTool}
        />

        {/* F. Footer CTAs */}
        <ResultsFooterActions
          primaryLabel={primaryLabel}
          onPrimaryClick={primaryClick}
          onSecondaryClick={onGoToDashboard}
        />

      </div>
    </main>
  );
}

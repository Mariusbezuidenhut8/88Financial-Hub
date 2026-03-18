import React from "react";
import type { ResultsPageData } from "../../types/onboarding-results.types";
import OverallScoreCard from "../results/OverallScoreCard";
import CategoryBreakdownGrid from "../results/CategoryBreakdownGrid";
import PriorityActionsCard from "../results/PriorityActionsCard";
import RecommendedToolsSection from "../results/RecommendedToolsSection";
import HelpPathSection from "../results/HelpPathSection";
import ResultsFooterActions from "../results/ResultsFooterActions";

interface ResultsStepProps extends ResultsPageData {
  onOpenTool?: (key: string) => void;
  onGoToDashboard?: () => void;
  onContinueSelfService?: () => void;
  onGuidedHelp?: () => void;
  onAdvisorHelp?: () => void;
}

/**
 * ResultsStep — wizard-embedded results view.
 *
 * Composed from the same sub-components as OnboardingResultsPage.
 * Renders in the full-screen wizard shell (no extra max-width wrapper).
 */
export default function ResultsStep({
  firstName,
  scoreResult,
  routeResult,
  onOpenTool = () => {},
  onGoToDashboard,
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}: ResultsStepProps) {
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
    <div className="space-y-7">

      {/* A. Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {firstName ? `Welcome, ${firstName}` : "Your Financial Health Results"}
        </h1>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Here's a snapshot of where you stand — and the steps that will make the biggest difference.
        </p>
      </div>

      {/* B. Score Card */}
      <OverallScoreCard
        score={scoreResult.overallScore}
        band={scoreResult.band}
        summary={scoreResult.summary}
      />

      {/* C. Breakdown */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-gray-700">Category breakdown</h2>
        <CategoryBreakdownGrid categoryScores={scoreResult.categoryScores} />
      </section>

      {/* D. Priorities */}
      {scoreResult.priorityActions.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-gray-700">Your top priorities</h2>
          <PriorityActionsCard actions={scoreResult.priorityActions} />
        </section>
      )}

      {/* E. Next Steps */}
      {routeResult.recommendedTools.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-gray-700">Recommended next steps</h2>
          <RecommendedToolsSection
            recommendations={routeResult.recommendedTools}
            onOpenTool={onOpenTool}
          />
        </section>
      )}

      {/* F. Help */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-semibold text-gray-700">Would you like support?</h2>
        <p className="text-xs text-gray-500">Choose the path that suits you best.</p>
        <HelpPathSection
          shouldSuggestAdvisor={routeResult.shouldSuggestAdvisor}
          complexityReasons={routeResult.complexityReasons}
          onContinueSelfService={onContinueSelfService}
          onGuidedHelp={onGuidedHelp}
          onAdvisorHelp={onAdvisorHelp}
        />
      </section>

      {/* G. Footer */}
      <ResultsFooterActions
        primaryLabel={primaryLabel}
        onPrimaryClick={primaryClick}
        onSecondaryClick={routeResult.shouldSuggestAdvisor ? onGoToDashboard : undefined}
      />

    </div>
  );
}

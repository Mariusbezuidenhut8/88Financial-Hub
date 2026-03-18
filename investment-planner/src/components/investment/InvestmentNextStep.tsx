import React from "react";
import type { InvestmentPlannerState } from "../../types/investmentPlanner.types";
import { labelRecommendation } from "../../services/investmentDecisionEngine";

export interface InvestmentNextStepProps {
  state:                   InvestmentPlannerState;
  onBack:                  () => void;
  onBackToDashboard:       () => void;
  onRequestAdvisorHelp:    () => void;
  onOpenRetirementPlanner?: () => void;
}

export function InvestmentNextStep({
  state,
  onBack,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onOpenRetirementPlanner,
}: InvestmentNextStepProps) {
  const { result } = state;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        What would you like to do next?
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Your investment direction has been assessed. Here are the most useful next
        actions from here.
      </p>

      {/* Current recommendation summary */}
      {result && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Your recommendation
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {labelRecommendation(result.primaryRecommendation)}
          </p>
          {result.strategyDirection.length > 0 && (
            <p className="mt-2 text-sm text-slate-600 leading-5">
              {result.strategyDirection[0]}
            </p>
          )}
        </div>
      )}

      {/* Action cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <ActionCard
          title="Return to dashboard"
          description="Go back to your main planning hub."
          onClick={onBackToDashboard}
        />

        {onOpenRetirementPlanner && (
          <ActionCard
            title="Open Retirement Planner"
            description="Compare this with your retirement projection."
            onClick={onOpenRetirementPlanner}
          />
        )}

        <ActionCard
          title="Talk to an adviser"
          description="Get a tailored review before you act on this plan."
          onClick={onRequestAdvisorHelp}
          highlighted
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
        >
          Back to strategy
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function ActionCard({
  title,
  description,
  onClick,
  highlighted = false,
}: {
  title:        string;
  description:  string;
  onClick:      () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-5 text-left transition",
        highlighted
          ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-white",
      ].join(" ")}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className={`mt-1 text-xs leading-5 ${highlighted ? "text-slate-300" : "text-slate-500"}`}>
        {description}
      </p>
    </button>
  );
}

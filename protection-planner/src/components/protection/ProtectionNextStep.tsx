import React from "react";
import type { ProtectionPlannerState } from "../../types/protectionPlanner.types";
import {
  getReadinessConfig,
  fmtProtectionCurrency,
  fmtMonthly,
} from "../../services/protectionPlannerHelpers";

export interface ProtectionNextStepProps {
  state:                   ProtectionPlannerState;
  onBack:                  () => void;
  onBackToDashboard:        () => void;
  onRequestAdvisorHelp:    () => void;
  onOpenEstatePlanner?:    () => void;
}

export function ProtectionNextStep({
  state,
  onBack,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onOpenEstatePlanner,
}: ProtectionNextStepProps) {
  const { result } = state;
  const readiness  = result ? getReadinessConfig(result.overallReadiness) : null;

  const topLifeGap   = result?.lifeGap.gap ?? 0;
  const topIncomeGap = result?.incomeProtectionGap.gap ?? 0;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        What would you like to do next?
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Your protection gaps have been assessed. Here are the most impactful next actions.
      </p>

      {/* Result summary tile */}
      {result && readiness && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Your protection readiness
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">{readiness.label}</p>

          {/* Top gaps */}
          <div className="mt-3 flex flex-wrap gap-4">
            {topLifeGap > 0 && (
              <div>
                <p className="text-xs text-slate-500">Life cover gap</p>
                <p className="text-sm font-semibold text-red-600">
                  {fmtProtectionCurrency(topLifeGap)}
                </p>
              </div>
            )}
            {topIncomeGap > 0 && (
              <div>
                <p className="text-xs text-slate-500">Income protection gap</p>
                <p className="text-sm font-semibold text-red-600">
                  {fmtMonthly(topIncomeGap)}
                </p>
              </div>
            )}
          </div>

          {result.recommendedActions.length > 0 && (
            <p className="mt-2 text-sm text-slate-600 leading-5">
              {result.recommendedActions[0]}
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

        {onOpenEstatePlanner && (
          <ActionCard
            title="Open Estate Planner"
            description="Ensure your life cover also addresses estate liquidity needs."
            onClick={onOpenEstatePlanner}
          />
        )}

        <ActionCard
          title="Talk to an adviser"
          description="Get product quotes and a full protection review from a licensed adviser."
          onClick={onRequestAdvisorHelp}
          highlighted
        />
      </div>

      {/* Priority action list */}
      {result && result.recommendedActions.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Priority action list</p>
          <ol className="mt-3 space-y-2">
            {result.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
        >
          Back to results
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────

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
      <p
        className={`mt-1 text-xs leading-5 ${
          highlighted ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </button>
  );
}

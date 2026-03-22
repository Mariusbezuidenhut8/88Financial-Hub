import React from "react";
import type { EstatePlannerState } from "../../types/estatePlanner.types";
import { getReadinessConfig, fmtEstateCurrency } from "./estateHelpers";

export interface EstateNextStepProps {
  state:                    EstatePlannerState;
  onBack:                   () => void;
  onBackToDashboard:         () => void;
  onRequestAdvisorHelp:     () => void;
  onOpenProtectionPlanner?: () => void;
}

export function EstateNextStep({
  state,
  onBack,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onOpenProtectionPlanner,
}: EstateNextStepProps) {
  const { result } = state;
  const readiness  = result ? getReadinessConfig(result.readinessStatus) : null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        What would you like to do next?
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Your estate position has been assessed. Here are the most useful next actions.
      </p>

      {/* Result summary tile */}
      {result && readiness && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Your estate readiness
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">{readiness.label}</p>
          {result.estimatedLiquidityShortfall > 0 && (
            <p className="mt-2 text-sm text-red-600">
              Estimated shortfall:{" "}
              <span className="font-semibold">
                {fmtEstateCurrency(result.estimatedLiquidityShortfall)}
              </span>
            </p>
          )}
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

        {onOpenProtectionPlanner && (
          <ActionCard
            title="Open Protection Planner"
            description="Review your life cover to address the estate liquidity shortfall."
            onClick={onOpenProtectionPlanner}
          />
        )}

        <ActionCard
          title="Talk to an adviser"
          description="Get a full estate plan review — wills, trusts, executor arrangements."
          onClick={onRequestAdvisorHelp}
          highlighted
        />
      </div>

      {/* Recommended actions list */}
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

// ── Sub-component ───────────────────────────────────────────────────────────

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

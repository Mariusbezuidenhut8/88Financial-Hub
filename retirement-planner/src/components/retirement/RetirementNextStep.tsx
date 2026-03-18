import React from "react";
import type { RetirementPlannerState } from "../../types/retirement-planner.types";
import { getReadinessLabel } from "./retirementHelpers";

export interface RetirementNextStepProps {
  state: RetirementPlannerState;
  onGoToDashboard?: () => void;
  onRequestAdvisor?: () => void;
  onBack: () => void;
}

export function RetirementNextStep({
  state,
  onGoToDashboard,
  onRequestAdvisor,
  onBack,
}: RetirementNextStepProps) {
  const { result } = state;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 7 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">What happens next?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your retirement plan has been saved. Here's how you can take action.
        </p>
      </div>

      {result && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Your readiness status</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {getReadinessLabel(result.readinessStatus)}
          </p>

          {result.recommendations.length > 0 && (
            <ul className="mt-4 space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {result?.suggestAdvisor && onRequestAdvisor && (
          <button
            type="button"
            onClick={onRequestAdvisor}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Request advice from an adviser
          </button>
        )}

        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Return to dashboard
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
        >
          Back to strategies
        </button>
      </div>
    </div>
  );
}

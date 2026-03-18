import React from "react";
import type { InvestmentPlannerState } from "../../types/investmentPlanner.types";

export interface InvestmentStrategyStepProps {
  state:                InvestmentPlannerState;
  onBack:               () => void;
  onNext:               () => void;
  onRequestAdvisorHelp: () => void;
}

export function InvestmentStrategyStep({
  state,
  onBack,
  onNext,
  onRequestAdvisorHelp,
}: InvestmentStrategyStepProps) {
  const { result } = state;

  if (!result) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">No strategy direction available yet.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Strategy Direction</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This is the broad direction that may help you move forward. These are
        indicative steps, not a finalised financial plan.
      </p>

      {/* Ordered steps */}
      <div className="mt-6 space-y-3">
        {result.strategyDirection.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </div>

      {/* Advisor suggestion */}
      {result.suggestAdvisor && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">
            Professional guidance recommended
          </p>
          <p className="mt-1 text-xs text-amber-800">
            This strategy may benefit from a tailored adviser review before implementation.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequestAdvisorHelp}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Get help with this plan
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

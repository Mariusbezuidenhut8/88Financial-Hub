import React from "react";
import type { RetirementPlannerGoals as RetirementGoalsState } from "../../types/retirement-planner.types";

interface RetirementGoalsStepProps {
  state: RetirementGoalsState;
  onChange: (state: RetirementGoalsState) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function RetirementGoalsStep({
  state,
  onChange,
  onContinue,
  onBack,
}: RetirementGoalsStepProps) {
  const canContinue =
    state.targetRetirementAge !== undefined &&
    state.targetRetirementAge > 0 &&
    state.desiredMonthlyIncome !== undefined &&
    state.desiredMonthlyIncome > 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 2 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your retirement goals</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tell us what you are aiming for. We'll compare this against your projected outcome.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-slate-700">
            Target retirement age
            <span className="ml-1 text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">At what age would you like to stop working?</p>
          <input
            id="retirementAge"
            type="number"
            min={40}
            max={80}
            value={state.targetRetirementAge ?? ""}
            onChange={(e) =>
              onChange({
                ...state,
                targetRetirementAge: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 65"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label htmlFor="desiredIncome" className="block text-sm font-medium text-slate-700">
            Desired monthly income in retirement
            <span className="ml-1 text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            In today's money — what monthly take-home would feel comfortable?
          </p>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="desiredIncome"
              type="number"
              min={0}
              value={state.desiredMonthlyIncome ?? ""}
              onChange={(e) =>
                onChange({
                  ...state,
                  desiredMonthlyIncome: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="e.g. 30 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            This is in today's money — the projection will apply inflation to convert it to the
            future equivalent.
          </p>
        </div>

      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="flex-[2] rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

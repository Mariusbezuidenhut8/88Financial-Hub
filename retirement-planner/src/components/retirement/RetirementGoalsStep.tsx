import React from "react";
import type {
  RetirementPlannerState,
  RetirementPlannerGoals,
} from "../../types/retirement-planner.types";

export interface RetirementGoalsStepProps {
  state: RetirementPlannerState;
  onChange: (goals: RetirementPlannerGoals) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function RetirementGoalsStep({
  state,
  onChange,
  onContinue,
  onBack,
}: RetirementGoalsStepProps) {
  const { goals } = state;

  const canContinue =
    goals.targetRetirementAge !== undefined &&
    goals.targetRetirementAge > 0 &&
    goals.desiredMonthlyIncome !== undefined &&
    goals.desiredMonthlyIncome > 0;

  const set = (patch: Partial<RetirementPlannerGoals>) =>
    onChange({ ...goals, ...patch });

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

        {/* Target retirement age */}
        <div>
          <label htmlFor="targetRetirementAge" className="block text-sm font-medium text-slate-700">
            Target retirement age <span className="text-red-500">*</span>
          </label>
          <p className="mt-0.5 text-xs text-slate-500">At what age would you like to stop working?</p>
          <input
            id="targetRetirementAge"
            type="number"
            min={40}
            max={80}
            value={goals.targetRetirementAge ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set({ targetRetirementAge: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="e.g. 65"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Desired monthly income */}
        <div>
          <label htmlFor="desiredMonthlyIncome" className="block text-sm font-medium text-slate-700">
            Desired monthly income in retirement <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="desiredMonthlyIncome"
              type="number"
              min={0}
              value={goals.desiredMonthlyIncome ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ desiredMonthlyIncome: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 30 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Income basis toggle */}
        <div>
          <p className="text-sm font-medium text-slate-700">Is that amount in today's money?</p>
          <p className="mt-0.5 text-xs text-slate-500">
            "Today's money" means we inflate your target to the equivalent at retirement before comparison.
          </p>
          <div className="mt-2 flex gap-2">
            {(["today_money", "future_money"] as const).map((basis) => (
              <button
                key={basis}
                type="button"
                onClick={() => set({ incomeBasis: basis })}
                className={[
                  "flex-1 rounded-2xl border px-3 py-2.5 text-xs font-medium transition",
                  goals.incomeBasis === basis
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                {basis === "today_money" ? "Today's money" : "Future money"}
              </button>
            ))}
          </div>
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

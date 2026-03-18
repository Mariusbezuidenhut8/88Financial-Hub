import React from "react";
import type {
  InvestmentPlannerState,
  InvestmentPlannerGoalStep,
  InvestmentPrimaryGoal,
  InvestmentContributionStyle,
} from "../../types/investmentPlanner.types";

export interface InvestmentGoalStepProps {
  state:    InvestmentPlannerState;
  onChange: (goal: InvestmentPlannerGoalStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

const GOAL_OPTIONS: { key: InvestmentPrimaryGoal; label: string }[] = [
  { key: "retirement",       label: "Retirement" },
  { key: "wealth_building",  label: "Long-term wealth building" },
  { key: "education",        label: "Education funding" },
  { key: "emergency_reserve", label: "Emergency reserve" },
  { key: "medium_term_goal", label: "Medium-term goal" },
  { key: "general_investing", label: "General investing" },
];

const STYLE_OPTIONS: { key: InvestmentContributionStyle; label: string }[] = [
  { key: "lump_sum", label: "Once-off lump sum" },
  { key: "monthly",  label: "Monthly contributions" },
  { key: "both",     label: "Both" },
];

export function InvestmentGoalStep({
  state,
  onChange,
  onBack,
  onNext,
}: InvestmentGoalStepProps) {
  const { goal } = state;
  const canContinue = Boolean(goal.primaryGoal);

  const set = (patch: Partial<InvestmentPlannerGoalStep>) =>
    onChange({ ...goal, ...patch });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Goal & Purpose</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Tell us what this investment is mainly for. This is the most important
        decision point — everything else will follow from it.
      </p>

      {/* Primary goal selector */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">
          What is this investment for? <span className="text-red-500">*</span>
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GOAL_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => set({ primaryGoal: item.key })}
              className={[
                "rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition",
                goal.primaryGoal === item.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target amount */}
      <div className="mt-5">
        <label htmlFor="targetAmount" className="block text-sm font-medium text-slate-700">
          Target amount (optional)
        </label>
        <p className="mt-0.5 text-xs text-slate-500">
          Leave blank if you do not have a specific target in mind yet.
        </p>
        <div className="mt-2 relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
          <input
            id="targetAmount"
            type="number"
            min={0}
            value={goal.targetAmount ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set({ targetAmount: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="e.g. 500 000"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      {/* Contribution style */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">How do you plan to invest?</p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {STYLE_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => set({ contributionStyle: item.key })}
              className={[
                "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                goal.contributionStyle === item.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

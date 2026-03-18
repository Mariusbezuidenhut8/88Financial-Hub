import React from "react";
import type {
  RetirementPlannerAssumptions,
  RetirementAssumptionPreset,
} from "../../types/retirement-planner.types";
import { getAssumptionPresetValues } from "../../types/retirement-planner.types";

interface RetirementAssumptionsStepProps {
  state: RetirementPlannerAssumptions;
  onChange: (state: RetirementPlannerAssumptions) => void;
  onContinue: () => void;
  onBack: () => void;
}

const PRESET_META: Record<
  RetirementAssumptionPreset,
  { label: string; description: string; selected: string; unselected: string }
> = {
  conservative: {
    label:       "Conservative",
    description: "Lower-risk portfolio. Bonds and balanced funds. Suited to shorter time horizons or lower risk tolerance.",
    selected:    "border-2 border-blue-500 bg-blue-50 text-blue-900",
    unselected:  "border-2 border-slate-200 bg-white text-slate-900 hover:border-slate-300",
  },
  balanced: {
    label:       "Balanced",
    description: "Mix of growth and income assets. Suitable for most long-term investors. Our default assumption.",
    selected:    "border-2 border-slate-900 bg-slate-900 text-white",
    unselected:  "border-2 border-slate-200 bg-white text-slate-900 hover:border-slate-300",
  },
  growth: {
    label:       "Growth",
    description: "Higher equity allocation. Greater short-term volatility but potentially stronger long-term returns.",
    selected:    "border-2 border-emerald-500 bg-emerald-50 text-emerald-900",
    unselected:  "border-2 border-slate-200 bg-white text-slate-900 hover:border-slate-300",
  },
};

export default function RetirementAssumptionsStep({
  state,
  onChange,
  onContinue,
  onBack,
}: RetirementAssumptionsStepProps) {
  const selectedPreset = state.preset ?? "balanced";
  const rates = getAssumptionPresetValues(selectedPreset);

  const handlePreset = (preset: RetirementAssumptionPreset) => {
    const values = getAssumptionPresetValues(preset);
    onChange({
      preset,
      preRetirementGrowth:     values.preRetirementGrowth,
      postRetirementGrowth:    values.postRetirementGrowth,
      inflation:               values.inflation,
      planningAge:             state.planningAge ?? values.planningAge,
      sustainableDrawdownRate: values.sustainableDrawdownRate,
    });
  };

  // Active rates: manual overrides take precedence over preset
  const activeRates = {
    preRetirementGrowth:     state.preRetirementGrowth     ?? rates.preRetirementGrowth,
    postRetirementGrowth:    state.postRetirementGrowth    ?? rates.postRetirementGrowth,
    inflation:               state.inflation               ?? rates.inflation,
    sustainableDrawdownRate: state.sustainableDrawdownRate ?? rates.sustainableDrawdownRate,
    planningAge:             state.planningAge             ?? rates.planningAge,
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 4 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Planning assumptions</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose a growth assumption that reflects your likely investment approach.
          This affects how your projection is calculated.
        </p>
      </div>

      {/* Preset cards */}
      <div className="space-y-3">
        {(["conservative", "balanced", "growth"] as RetirementAssumptionPreset[]).map((preset) => {
          const meta   = PRESET_META[preset];
          const values = getAssumptionPresetValues(preset);
          const active = selectedPreset === preset;

          return (
            <button
              key={preset}
              type="button"
              onClick={() => handlePreset(preset)}
              className={`w-full text-left rounded-2xl p-4 transition ${
                active ? meta.selected : meta.unselected
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{meta.label}</p>
                  <p className={`mt-1 text-xs leading-5 ${active ? "opacity-80" : "text-slate-500"}`}>
                    {meta.description}
                  </p>
                </div>
                <div className={`flex-shrink-0 text-right text-xs ${active ? "opacity-80" : "text-slate-400"}`}>
                  <p>{values.preRetirementGrowth}% growth</p>
                  <p>{values.inflation}% inflation</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active assumption summary */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Assumptions being used</p>
        <p>Pre-retirement growth: {activeRates.preRetirementGrowth}% per year</p>
        <p>Post-retirement growth: {activeRates.postRetirementGrowth}% per year</p>
        <p>Inflation: {activeRates.inflation}% per year</p>
        <p>Sustainable drawdown rate: {activeRates.sustainableDrawdownRate}%</p>
        <p>Planning to age: {activeRates.planningAge}</p>
      </div>

      {/* Planning age override */}
      <div>
        <label htmlFor="planningAge" className="block text-sm font-medium text-slate-700">
          Planning age (optional)
        </label>
        <p className="text-xs text-slate-500 mt-0.5">
          The age we plan your income to cover. Default is 90.
        </p>
        <input
          id="planningAge"
          type="number"
          min={70}
          max={110}
          value={state.planningAge ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({
              ...state,
              planningAge: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="90"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
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
          className="flex-[2] rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Calculate my projection
        </button>
      </div>
    </div>
  );
}

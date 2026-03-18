import React from "react";
import type { RetirementPositionState } from "../../types/retirement-planner.types";

interface RetirementPositionStepProps {
  state: RetirementPositionState;
  onChange: (state: RetirementPositionState) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function RetirementPositionStep({
  state,
  onChange,
  onContinue,
  onBack,
}: RetirementPositionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 3 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your current position</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Confirm or update your current retirement savings and contributions.
          More accurate numbers will produce a more accurate projection.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

        {/* Retirement savings */}
        <div>
          <label htmlFor="retirementSavings" className="block text-sm font-medium text-slate-700">
            Total retirement savings
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Combined value of all retirement annuities, pension and provident fund accounts.
          </p>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="retirementSavings"
              type="number"
              min={0}
              value={state.currentRetirementSavings ?? ""}
              onChange={(e) =>
                onChange({ ...state, currentRetirementSavings: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 850 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Monthly contribution */}
        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-slate-700">
            Monthly contribution to retirement
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Total monthly amount going into retirement vehicles (RA, pension, provident).
          </p>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="monthlyContribution"
              type="number"
              min={0}
              value={state.monthlyContribution ?? ""}
              onChange={(e) =>
                onChange({ ...state, monthlyContribution: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 5 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Annual contribution increase */}
        <div>
          <label htmlFor="annualIncrease" className="block text-sm font-medium text-slate-700">
            Annual contribution increase (optional)
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            By what percentage do you expect to increase contributions each year? (e.g. 5 = 5%)
          </p>
          <div className="mt-2 relative">
            <input
              id="annualIncrease"
              type="number"
              min={0}
              max={30}
              value={
                state.annualContributionIncrease !== undefined
                  ? Math.round(state.annualContributionIncrease * 100)
                  : ""
              }
              onChange={(e) =>
                onChange({
                  ...state,
                  annualContributionIncrease: e.target.value
                    ? Number(e.target.value) / 100
                    : undefined,
                })
              }
              placeholder="e.g. 5"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-sm text-slate-400">%</span>
          </div>
        </div>

        {/* Non-retirement assets */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Include non-retirement assets?
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Do you have savings in TFSAs, unit trusts, or other investments you plan to use for retirement?
          </p>
          <div className="mt-2 flex gap-3">
            {([true, false] as const).map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => onChange({ ...state, includeNonRetirementAssets: val })}
                className={`flex-1 rounded-2xl border py-3 text-sm font-medium transition ${
                  state.includeNonRetirementAssets === val
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>

        {/* Non-retirement assets value */}
        {state.includeNonRetirementAssets && (
          <div>
            <label htmlFor="otherAssets" className="block text-sm font-medium text-slate-700">
              Estimated value of those assets
            </label>
            <div className="mt-2 relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
              <input
                id="otherAssets"
                type="number"
                min={0}
                value={state.nonRetirementAssetsValue ?? ""}
                onChange={(e) =>
                  onChange({
                    ...state,
                    nonRetirementAssetsValue: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder="e.g. 200 000"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        )}

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
          Continue
        </button>
      </div>
    </div>
  );
}

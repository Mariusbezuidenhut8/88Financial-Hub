import React from "react";
import type {
  RetirementPlannerState,
  RetirementPlannerPosition,
} from "../../types/retirement-planner.types";

export interface RetirementPositionStepProps {
  state: RetirementPlannerState;
  onChange: (position: RetirementPlannerPosition) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function RetirementPositionStep({
  state,
  onChange,
  onContinue,
  onBack,
}: RetirementPositionStepProps) {
  const { position, overview } = state;

  // Resolved values — position field takes precedence over overview prefill
  const savings      = position.currentRetirementSavings ?? overview.currentRetirementSavings;
  const contribution = position.monthlyContribution       ?? overview.currentMonthlyContribution;

  const set = (patch: Partial<RetirementPlannerPosition>) =>
    onChange({ ...position, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 3 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your current position</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Confirm or adjust your current retirement savings and contribution details.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">

        {/* Current retirement savings */}
        <div>
          <label htmlFor="currentRetirementSavings" className="block text-sm font-medium text-slate-700">
            Current retirement savings
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Total value of all retirement annuities, pension / provident funds, etc.
          </p>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="currentRetirementSavings"
              type="number"
              min={0}
              value={savings ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ currentRetirementSavings: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 500 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Monthly contribution */}
        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-slate-700">
            Monthly retirement contribution
          </label>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="monthlyContribution"
              type="number"
              min={0}
              value={contribution ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ monthlyContribution: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 5 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {/* Annual contribution increase */}
        <div>
          <label htmlFor="annualContributionIncrease" className="block text-sm font-medium text-slate-700">
            Annual contribution step-up (%)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            By how much do you plan to increase contributions each year? Default is 5%.
          </p>
          <input
            id="annualContributionIncrease"
            type="number"
            min={0}
            max={30}
            value={position.annualContributionIncrease ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set({ annualContributionIncrease: e.target.value ? Number(e.target.value) : undefined })
            }
            placeholder="5"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Include non-retirement assets */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={position.includeNonRetirementAssets ?? false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ includeNonRetirementAssets: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="text-sm font-medium text-slate-700">
              Include other investable assets
            </span>
          </label>
          <p className="mt-1 ml-7 text-xs text-slate-500">
            E.g. discretionary savings, unit trusts, or property equity available at retirement.
          </p>
        </div>

        {position.includeNonRetirementAssets && (
          <div>
            <label htmlFor="nonRetirementAssetsValue" className="block text-sm font-medium text-slate-700">
              Estimated other assets value
            </label>
            <div className="mt-2 relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
              <input
                id="nonRetirementAssetsValue"
                type="number"
                min={0}
                value={position.nonRetirementAssetsValue ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  set({ nonRetirementAssetsValue: e.target.value ? Number(e.target.value) : 0 })
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

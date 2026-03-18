import React from "react";
import type { InvestmentPlannerState } from "../../types/investmentPlanner.types";
import { fmtInvestmentCurrency } from "../../services/investmentPlannerHelpers";

export interface InvestmentOverviewStepProps {
  state:           InvestmentPlannerState;
  mappingWarnings: string[];
  onNext:          () => void;
}

export function InvestmentOverviewStep({
  state,
  mappingWarnings,
  onNext,
}: InvestmentOverviewStepProps) {
  const { overview } = state;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Investment Overview</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        We have used some of your existing financial information to make this process
        quicker. We will now help you identify which investment route may best suit
        your goal.
      </p>

      {/* Summary tiles */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile
          label="Monthly savings capacity"
          value={fmtInvestmentCurrency(overview.monthlySavingsCapacity)}
        />
        <SummaryTile
          label="Retirement contribution"
          value={fmtInvestmentCurrency(overview.currentRetirementContribution)}
        />
        <SummaryTile
          label="Emergency fund"
          value={fmtInvestmentCurrency(overview.emergencyFundAmount)}
        />
      </div>

      {/* Existing goals */}
      {overview.existingGoals && overview.existingGoals.length > 0 && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Goals from your profile</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {overview.existingGoals.map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-white border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mapping warnings */}
      {mappingWarnings.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Some profile information is missing
          </p>
          <ul className="mt-2 space-y-1">
            {mappingWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800">• {w}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-700">
            You can fill in missing information during the next steps.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Let's get started
        </button>
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

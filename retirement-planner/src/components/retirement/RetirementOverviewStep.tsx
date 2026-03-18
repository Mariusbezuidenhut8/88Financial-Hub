import React from "react";
import type { RetirementPlannerState } from "../../types/retirement-planner.types";
import { fmtCurrency } from "./retirementHelpers";

export interface RetirementOverviewStepProps {
  state: RetirementPlannerState;
  mappingWarnings?: string[];
  onContinue: () => void;
}

export function RetirementOverviewStep({
  state,
  mappingWarnings = [],
  onContinue,
}: RetirementOverviewStepProps) {
  const { overview } = state;
  const hasMissing =
    overview.currentRetirementSavings === undefined ||
    overview.currentMonthlyContribution === undefined ||
    overview.currentAge === undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Retirement Planner</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Let's review your retirement readiness
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We already know some of your financial information from your profile.
          We'll use that as a starting point and ask a few more questions to
          estimate your retirement readiness.
        </p>
      </div>

      {/* Prefilled summary card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">What we know so far</h2>
        <dl className="mt-4 space-y-3">
          <SummaryRow
            label="Current age"
            value={overview.currentAge !== undefined ? `${overview.currentAge} years` : "Not provided"}
          />
          <SummaryRow
            label="Monthly income"
            value={fmtCurrency(overview.monthlyIncome)}
          />
          <SummaryRow
            label="Retirement savings"
            value={fmtCurrency(overview.currentRetirementSavings)}
          />
          <SummaryRow
            label="Monthly contribution"
            value={fmtCurrency(overview.currentMonthlyContribution)}
          />
        </dl>

        {hasMissing && (
          <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            Some fields are missing from your profile. You'll be able to fill them in during the next steps.
          </p>
        )}
      </div>

      {/* Mapping warnings */}
      {mappingWarnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900">Profile gaps detected</p>
          <ul className="mt-1.5 space-y-1">
            {mappingWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800">• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Let's get started
      </button>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 text-right">{value}</dd>
    </div>
  );
}

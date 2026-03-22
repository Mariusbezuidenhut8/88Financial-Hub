import React from "react";
import type { RetirementPlannerOverview as RetirementOverviewState } from "../../types/retirement-planner.types";

interface RetirementOverviewStepProps {
  state: RetirementOverviewState;
  onContinue: () => void;
}

function fmt(value: number | undefined, prefix = "R"): string {
  if (value === undefined) return "Not provided";
  return `${prefix}${value.toLocaleString("en-ZA")}`;
}

export default function RetirementOverviewStep({
  state,
  onContinue,
}: RetirementOverviewStepProps) {
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

      {/* Prefilled summary */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">What we know so far</h2>
        <dl className="mt-4 space-y-3">
          <SummaryRow label="Your current age" value={state.currentAge !== undefined ? `${state.currentAge} years` : "Not provided"} />
          <SummaryRow label="Retirement savings" value={fmt(state.currentRetirementSavings)} />
          <SummaryRow label="Monthly contribution" value={fmt(state.currentMonthlyContribution, "R")} />
        </dl>
        {(state.currentRetirementSavings === undefined || state.currentMonthlyContribution === undefined) && (
          <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            Some fields are missing from your profile. You will be able to fill them in during the next steps.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Continue
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

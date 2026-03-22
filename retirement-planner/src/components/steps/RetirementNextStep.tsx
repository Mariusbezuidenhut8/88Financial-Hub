import React from "react";
import type { RetirementPlannerResult } from "../../types/retirement-planner.types";

interface RetirementNextStepProps {
  result?: RetirementPlannerResult;
  onGoToDashboard?: () => void;
  onRequestAdvisor?: () => void;
  onBack: () => void;
}

function currency(value: number): string {
  return `R${Math.round(value).toLocaleString("en-ZA")}`;
}

export default function RetirementNextStep({
  result,
  onGoToDashboard,
  onRequestAdvisor,
  onBack,
}: RetirementNextStepProps) {
  const planSaved = !!result;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 7 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your next step</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your retirement plan has been saved to your dashboard. Here is where you go from here.
        </p>
      </div>

      {/* Summary card */}
      {result && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Plan summary</p>
          <dl className="mt-4 space-y-3">
            <SummaryRow label="Target retirement age" value={String(result.targetRetirementAge)} />
            <SummaryRow label="Desired monthly income" value={currency(result.desiredMonthlyIncome)} />
            <SummaryRow label="Projected monthly income" value={currency(result.estimatedMonthlyIncome)} />
            <SummaryRow
              label="Monthly gap"
              value={
                result.monthlyIncomeGap > 0
                  ? currency(result.monthlyIncomeGap)
                  : "No gap — you're on track"
              }
            />
            <SummaryRow
              label="Status"
              value={
                result.readinessStatus === "ahead"
                  ? "On track"
                  : result.readinessStatus === "on_track"
                  ? "Broadly on track"
                  : "Behind — action needed"
              }
            />
          </dl>
        </div>
      )}

      {/* Next action cards */}
      <div className="space-y-3">
        {onGoToDashboard && (
          <button
            type="button"
            onClick={onGoToDashboard}
            className="w-full text-left rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <p className="text-sm font-semibold text-slate-900">Return to my dashboard</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Your projection has been saved. Review it alongside your other planning tools.
            </p>
          </button>
        )}

        {result?.suggestAdvisor && onRequestAdvisor && (
          <button
            type="button"
            onClick={onRequestAdvisor}
            className="w-full text-left rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:bg-amber-100"
          >
            <p className="text-sm font-semibold text-amber-900">Talk to an advisor</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Your situation may benefit from a structured advice engagement.
            </p>
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="w-full text-left rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:bg-slate-50"
        >
          <p className="text-sm font-semibold text-slate-700">Review strategy options again</p>
          <p className="mt-0.5 text-xs text-slate-500">Go back to explore the three improvement scenarios.</p>
        </button>
      </div>

      {planSaved && (
        <p className="text-center text-xs text-slate-400">
          Your retirement plan has been saved and will appear on your dashboard.
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900 text-right">{value}</dd>
    </div>
  );
}

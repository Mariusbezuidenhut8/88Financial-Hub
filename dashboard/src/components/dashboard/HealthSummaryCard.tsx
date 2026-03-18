import React from "react";
import type { FinancialHealthScoreResult } from "../../types/financialHealth.types";
import { getBandLabel, formatDisplayDate } from "./dashboardHelpers";

interface HealthSummaryCardProps {
  scoreResult?: FinancialHealthScoreResult;
  onViewResults: () => void;
  onRefreshProfile: () => void;
}

export const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  scoreResult,
  onViewResults,
  onRefreshProfile,
}) => {
  if (!scoreResult) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Financial Health Summary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your financial health score is not available yet.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRefreshProfile}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Complete your profile
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">Financial health</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight sm:text-6xl">
              {scoreResult.overallScore}
            </span>
            <span className="pb-2 text-lg text-slate-300">/ 100</span>
          </div>
          <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
            {getBandLabel(scoreResult.band)}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            Last updated {formatDisplayDate(scoreResult.calculatedAt)}
          </p>
        </div>

        <div className="max-w-2xl">
          <p className="text-sm font-medium text-slate-300">What this means</p>
          <p className="mt-2 text-base leading-7 text-slate-100">{scoreResult.summary}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onViewResults}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              View full results
            </button>
            <button
              type="button"
              onClick={onRefreshProfile}
              className="rounded-2xl border border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Refresh profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

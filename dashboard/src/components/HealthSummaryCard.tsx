import React from "react";
import type { DashboardHealthScore } from "../types/dashboard.types";

interface HealthSummaryCardProps {
  healthScore: DashboardHealthScore;
  onViewFullResults?: () => void;
}

const BAND_STYLES: Record<string, { bar: string; label: string; text: string }> = {
  critical:    { bar: "bg-red-500",    label: "bg-red-100 text-red-700",    text: "Critical" },
  at_risk:     { bar: "bg-orange-500", label: "bg-orange-100 text-orange-700", text: "At Risk" },
  developing:  { bar: "bg-yellow-500", label: "bg-yellow-100 text-yellow-700", text: "Developing" },
  established: { bar: "bg-blue-500",   label: "bg-blue-100 text-blue-700",   text: "Established" },
  thriving:    { bar: "bg-emerald-500",label: "bg-emerald-100 text-emerald-700", text: "Thriving" },
};

const CATEGORY_LABELS: Record<string, string> = {
  cashFlow:     "Cash Flow",
  debt:         "Debt",
  emergencyFund:"Emergency Fund",
  protection:   "Protection",
  retirement:   "Retirement",
};

export default function HealthSummaryCard({ healthScore, onViewFullResults }: HealthSummaryCardProps) {
  const style = BAND_STYLES[healthScore.band] ?? BAND_STYLES.developing;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Financial Health Score</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-slate-900">{healthScore.overallScore}</span>
            <span className="text-lg text-slate-400">/100</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.label}`}>
              {style.text}
            </span>
          </div>
          {healthScore.summary && (
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-md">
              {healthScore.summary}
            </p>
          )}
        </div>
        {onViewFullResults && (
          <button
            onClick={onViewFullResults}
            className="flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            View full results
          </button>
        )}
      </div>

      {/* Mini category bars */}
      <div className="mt-5 grid grid-cols-5 gap-2">
        {Object.entries(healthScore.categoryScores).map(([key, score]) => (
          <div key={key} className="flex flex-col items-center gap-1.5">
            <div className="w-full h-1.5 rounded-full bg-slate-100">
              <div
                className={`h-1.5 rounded-full ${style.bar} transition-all`}
                style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 text-center leading-tight">
              {CATEGORY_LABELS[key] ?? key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import type {
  RetirementPlannerResult,
  RetirementReadinessStatus,
} from "../../types/retirement-planner.types";

interface RetirementResultsStepProps {
  result: RetirementPlannerResult;
  onContinue: () => void;
  onBack: () => void;
  onRequestAdvisor?: () => void;
}

const READINESS_CONFIG: Record<
  RetirementReadinessStatus,
  { label: string; bg: string; text: string }
> = {
  ahead:    { label: "On track — surplus",    bg: "bg-emerald-900", text: "text-emerald-200" },
  on_track: { label: "Broadly on track",      bg: "bg-slate-900",   text: "text-slate-200"  },
  behind:   { label: "Behind — gap to close", bg: "bg-orange-900",  text: "text-orange-200" },
  unknown:  { label: "Projection incomplete", bg: "bg-slate-700",   text: "text-slate-300"  },
};

function currency(value: number): string {
  return `R${Math.round(value).toLocaleString("en-ZA")}`;
}

export default function RetirementResultsStep({
  result,
  onContinue,
  onBack,
  onRequestAdvisor,
}: RetirementResultsStepProps) {
  const config = READINESS_CONFIG[result.readinessStatus];
  const hasSurplus = result.monthlyIncomeGap <= 0;
  const surplusOrGap = Math.abs(result.monthlyIncomeGap);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 5 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your retirement projection</h1>
      </div>

      {/* Hero card */}
      <div className={`rounded-3xl ${config.bg} p-6 text-white shadow-sm`}>
        <p className={`text-sm font-medium ${config.text}`}>Readiness status</p>
        <p className="mt-1 text-lg font-semibold">{config.label}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className={`text-xs font-medium ${config.text}`}>Projected monthly income</p>
            <p className="mt-1 text-2xl font-bold">
              {currency(result.estimatedMonthlyIncome)}
            </p>
            <p className={`text-xs mt-1 ${config.text}`}>in today's money</p>
          </div>
          <div>
            <p className={`text-xs font-medium ${config.text}`}>Your target</p>
            <p className="mt-1 text-2xl font-bold">{currency(result.desiredMonthlyIncome)}</p>
          </div>
        </div>

        {surplusOrGap > 0 && (
          <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm font-medium">
              {hasSurplus
                ? `Estimated monthly surplus: ${currency(surplusOrGap)}`
                : `Estimated monthly gap: ${currency(surplusOrGap)}`}
            </p>
          </div>
        )}
      </div>

      {/* Supporting cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Projected retirement capital"
          value={currency(result.projectedRetirementCapital)}
        />
        <StatCard
          label="Years to retirement"
          value={String(result.assumptions.planningAge - result.targetRetirementAge)}
        />
        <StatCard
          label="Target retirement age"
          value={String(result.targetRetirementAge)}
        />
        <StatCard
          label="Drawdown rate used"
          value={`${(result.assumptions.sustainableDrawdownRate * 100).toFixed(1)}%`}
        />
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">What this means for you</h2>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advisor suggestion */}
      {result.suggestAdvisor && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">An adviser may help here</p>
          <ul className="mt-1.5 space-y-1">
            {result.advisorReasons.map((r) => (
              <li key={r} className="text-xs text-amber-800">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View strategy options
        </button>

        {result.suggestAdvisor && onRequestAdvisor && (
          <button
            type="button"
            onClick={onRequestAdvisor}
            className="w-full rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
          >
            Talk to an advisor about this result
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Adjust assumptions
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500 leading-snug">{label}</p>
      <p className="mt-1.5 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}

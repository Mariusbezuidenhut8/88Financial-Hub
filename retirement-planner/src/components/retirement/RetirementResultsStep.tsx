import React from "react";
import type { RetirementPlannerState } from "../../types/retirement-planner.types";
import { fmtCurrency, getReadinessConfig } from "./retirementHelpers";

export interface RetirementResultsStepProps {
  state: RetirementPlannerState;
  onContinue: () => void;
  onBack: () => void;
  onRequestAdvisor?: () => void;
}

export function RetirementResultsStep({
  state,
  onContinue,
  onBack,
  onRequestAdvisor,
}: RetirementResultsStepProps) {
  const { result } = state;

  if (!result) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-500">Step 5 of 7</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Your retirement projection</h1>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">No projection available yet — complete the previous steps.</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to assumptions
        </button>
      </div>
    );
  }

  const config      = getReadinessConfig(result.readinessStatus);
  const hasSurplus  = result.monthlyIncomeGap <= 0;
  const gapOrSurplus = Math.abs(result.monthlyIncomeGap);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 5 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your retirement projection</h1>
      </div>

      {/* Hero card */}
      <div className={`rounded-3xl ${config.heroBg} p-6 text-white shadow-sm`}>
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}>
          {config.label}
        </span>
        <p className={`mt-3 text-xs ${config.heroText} opacity-80`}>{config.sublabel}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className={`text-xs font-medium opacity-70`}>Projected monthly income</p>
            <p className="mt-1 text-2xl font-bold">{fmtCurrency(result.estimatedMonthlyIncome)}</p>
            <p className="mt-0.5 text-xs opacity-60">nominal at retirement</p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Your target</p>
            <p className="mt-1 text-2xl font-bold">{fmtCurrency(result.desiredMonthlyIncome)}</p>
          </div>
        </div>

        {gapOrSurplus > 0 && (
          <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm font-medium">
              {hasSurplus
                ? `Estimated monthly surplus: ${fmtCurrency(gapOrSurplus)}`
                : `Estimated monthly gap: ${fmtCurrency(gapOrSurplus)}`}
            </p>
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Projected retirement capital"
          value={fmtCurrency(result.projectedRetirementCapital)}
        />
        <StatCard
          label="Target retirement age"
          value={`${result.targetRetirementAge} years`}
        />
        <StatCard
          label="Drawdown rate"
          value={`${result.assumptions.sustainableDrawdownRate}%`}
        />
        <StatCard
          label="Planning to age"
          value={String(result.assumptions.planningAge)}
        />
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">What this means for you</h2>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
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
            {result.advisorReasons.map((r, i) => (
              <li key={i} className="text-xs text-amber-800">• {r}</li>
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
            Talk to an adviser about this result
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

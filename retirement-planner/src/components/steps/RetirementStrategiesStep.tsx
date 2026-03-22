import React from "react";
import type {
  RetirementPlannerResult,
  RetirementStrategyOption,
} from "../../types/retirement-planner.types";

interface RetirementStrategiesStepProps {
  result: RetirementPlannerResult;
  onContinue: () => void;
  onBack: () => void;
}

function currency(value: number): string {
  return `R${Math.round(value).toLocaleString("en-ZA")}`;
}


export default function RetirementStrategiesStep({
  result,
  onContinue,
  onBack,
}: RetirementStrategiesStepProps) {
  const { strategyOptions, desiredMonthlyIncome } = result;
  const baselineGap = result.monthlyIncomeGap;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 6 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Strategy options</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Here are three practical levers that could improve your retirement outcome.
          Each one shows what you could achieve if you made that change today.
        </p>
      </div>

      <div className="space-y-4">
        {strategyOptions.saveMore && (
          <StrategyCard
            label="A — Save more"
            icon="💰"
            option={strategyOptions.saveMore}
            desiredMonthlyIncome={desiredMonthlyIncome}
            baselineGap={baselineGap}
            revisedDisplay={currency((strategyOptions.saveMore.metadata?.revisedMonthlyContribution as number) ?? 0) + " / month"}
          />
        )}

        {strategyOptions.retireLater && (
          <StrategyCard
            label="B — Retire later"
            icon="⏱"
            option={strategyOptions.retireLater}
            desiredMonthlyIncome={desiredMonthlyIncome}
            baselineGap={baselineGap}
            revisedDisplay={`Age ${(strategyOptions.retireLater.metadata?.revisedRetirementAge as number) ?? "—"}`}
          />
        )}

        {strategyOptions.growthOption && (
          <StrategyCard
            label="C — Growth-focused strategy"
            icon="📈"
            option={strategyOptions.growthOption}
            desiredMonthlyIncome={desiredMonthlyIncome}
            baselineGap={baselineGap}
            revisedDisplay={`${((strategyOptions.growthOption.metadata?.revisedGrowthRate as number) ?? 0).toFixed(1)}% growth target`}
          />
        )}
      </div>

      <p className="text-xs text-slate-400 leading-5">
        All projections are estimates based on the assumptions you selected.
        Actual returns will vary. Scenarios can be combined for greater impact.
      </p>

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
          Continue to next steps
        </button>
      </div>
    </div>
  );
}

// ── Strategy card ──────────────────────────────────────────────────────────

interface StrategyCardProps {
  label: string;
  icon: string;
  option: RetirementStrategyOption;
  desiredMonthlyIncome: number;
  baselineGap: number;
  revisedDisplay: string;
}

function StrategyCard({
  label,
  icon,
  option,
  desiredMonthlyIncome,
  baselineGap,
  revisedDisplay,
}: StrategyCardProps) {
  const improvement = Math.max(0, baselineGap - option.monthlyIncomeGap);
  const closesGap = option.monthlyIncomeGap <= 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm text-slate-600">{option.description}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-500">Revised value</p>
          <p className="mt-0.5 text-sm font-bold text-slate-900">{revisedDisplay}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-500">Projected income</p>
          <p className="mt-0.5 text-sm font-bold text-slate-900">
            {currency(option.projectedMonthlyIncome)} / mo
          </p>
        </div>
      </div>

      {closesGap ? (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          This scenario closes your income gap completely.
        </p>
      ) : improvement > 0 ? (
        <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
          Reduces monthly gap by {currency(improvement)} — remaining gap {currency(option.monthlyIncomeGap)}.
        </p>
      ) : null}
    </div>
  );
}

import React from "react";
import type {
  RetirementPlannerState,
  RetirementStrategyOption,
} from "../../types/retirement-planner.types";
import { fmtCurrency } from "./retirementHelpers";

export interface RetirementStrategiesStepProps {
  state: RetirementPlannerState;
  onContinue: () => void;
  onBack: () => void;
}

export function RetirementStrategiesStep({
  state,
  onContinue,
  onBack,
}: RetirementStrategiesStepProps) {
  const { result } = state;

  if (!result) {
    return (
      <div className="space-y-6">
        <p className="text-sm font-medium text-slate-500">Step 6 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Strategy options</h1>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">No projection available yet.</p>
        </div>
        <button type="button" onClick={onBack}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Back
        </button>
      </div>
    );
  }

  const { strategyOptions } = result;

  const scenarios: Array<{ key: string; title: string; option?: RetirementStrategyOption }> = [
    { key: "saveMore",     title: "Save more",       option: strategyOptions.saveMore     },
    { key: "retireLater",  title: "Retire later",    option: strategyOptions.retireLater  },
    { key: "growthOption", title: "Higher growth",   option: strategyOptions.growthOption },
  ];

  const available = scenarios.filter((s) => s.option !== undefined);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Step 6 of 7</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Strategy options</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Here are three scenarios that could improve your retirement outcome.
          Each shows how a single change affects your projected monthly income.
        </p>
      </div>

      {available.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">You're ahead of target — no strategy adjustments needed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {available.map(({ key, title, option }) => (
            option && (
              <ScenarioCard
                key={key}
                title={title}
                option={option}
                targetIncome={result.desiredMonthlyIncome}
              />
            )
          ))}
        </div>
      )}

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

interface ScenarioCardProps {
  title:        string;
  option:       RetirementStrategyOption;
  targetIncome: number;
}

function ScenarioCard({ title, option, targetIncome }: ScenarioCardProps) {
  const closesGap = option.monthlyIncomeGap < targetIncome * 0.05; // within 5% of target
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{option.title || title}</p>
          <p className="mt-1 text-xs text-slate-500 leading-5">{option.description}</p>
        </div>
        {closesGap && (
          <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Closes gap
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div>
          <p className="text-xs text-slate-500">Projected income</p>
          <p className="text-base font-bold text-slate-900">{fmtCurrency(option.projectedMonthlyIncome)}</p>
        </div>
        {option.monthlyIncomeGap > 0 && (
          <div>
            <p className="text-xs text-slate-500">Remaining gap</p>
            <p className="text-base font-bold text-orange-700">{fmtCurrency(option.monthlyIncomeGap)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

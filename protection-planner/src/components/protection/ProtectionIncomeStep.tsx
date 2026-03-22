import React from "react";
import type {
  ProtectionPlannerState,
  ProtectionIncomeStep,
  IncomeProtectionBenefitPeriod,
} from "../../types/protectionPlanner.types";
import {
  fmtMonthly,
  getBenefitPeriodLabel,
} from "../../services/protectionPlannerHelpers";

export interface ProtectionIncomeStepProps {
  state:    ProtectionPlannerState;
  onChange: (income: ProtectionIncomeStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

const BENEFIT_PERIODS: IncomeProtectionBenefitPeriod[] = [
  "2_years",
  "5_years",
  "to_age_60",
  "to_age_65",
];

const WAITING_PERIODS: Array<7 | 30 | 90 | 180> = [7, 30, 90, 180];

export function ProtectionIncomeStep({
  state,
  onChange,
  onBack,
  onNext,
}: ProtectionIncomeStepProps) {
  const { income, overview } = state;

  function update(patch: Partial<ProtectionIncomeStep>) {
    onChange({ ...income, ...patch });
  }

  const grossIncome    = overview.monthlyGrossIncome ?? 0;
  const maxBenefit     = Math.floor(grossIncome * 0.75);
  const currentBenefit = income.desiredMonthlyBenefit ?? maxBenefit;
  const existingBenefit = overview.totalExistingMonthlyDisabilityBenefit ?? 0;
  const gap            = Math.max(0, currentBenefit - existingBenefit);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Income Protection</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Income protection replaces a percentage of your income if you are unable to
        work due to illness or injury. SA insurers cap the benefit at 75% of gross
        income to maintain a return-to-work incentive.
      </p>

      <div className="mt-6 space-y-5">
        {/* Desired monthly benefit */}
        <div>
          <label
            htmlFor="monthlyBenefit"
            className="block text-sm font-medium text-slate-700"
          >
            Desired monthly benefit (R)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            SA cap: 75% of gross income = {fmtMonthly(maxBenefit)}.
            The engine will cap at this amount.
          </p>
          <input
            id="monthlyBenefit"
            type="number"
            min={0}
            max={maxBenefit}
            step={500}
            value={currentBenefit}
            onChange={(e) =>
              update({
                desiredMonthlyBenefit: Math.min(Number(e.target.value), maxBenefit),
              })
            }
            className="mt-2 w-48 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Benefit period */}
        <div>
          <p className="text-sm font-medium text-slate-700">Benefit payment period</p>
          <p className="mt-0.5 text-xs text-slate-500">
            How long the insurer pays the benefit during a disability claim.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BENEFIT_PERIODS.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => update({ benefitPeriod: period })}
                className={[
                  "rounded-2xl border p-3 text-left text-xs font-medium transition",
                  (income.benefitPeriod ?? "to_age_65") === period
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white",
                ].join(" ")}
              >
                {getBenefitPeriodLabel(period)}
              </button>
            ))}
          </div>
        </div>

        {/* Waiting period */}
        <div>
          <p className="text-sm font-medium text-slate-700">Waiting period (days)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            The number of days before the benefit starts paying. Longer = lower premium.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {WAITING_PERIODS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => update({ waitingPeriodDays: days })}
                className={[
                  "rounded-xl border px-3 py-2 text-xs font-medium transition",
                  (income.waitingPeriodDays ?? 30) === days
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        {/* Self-employed flag */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Are you self-employed?</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Self-employed / business owners have different product options and documentation requirements.
              </p>
            </div>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => update({ selfEmployed: v })}
                  className={[
                    "rounded-xl px-3 py-1.5 text-xs font-medium transition",
                    (income.selfEmployed ?? false) === v
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {v ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live estimate */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Estimated income protection position
        </p>
        <div className="mt-3 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-slate-500">Desired monthly benefit</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">{fmtMonthly(currentBenefit)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Existing cover</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-700">{fmtMonthly(existingBenefit)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Monthly gap</p>
            <p
              className={[
                "mt-0.5 text-lg font-bold",
                gap > 0 ? "text-red-600" : "text-emerald-600",
              ].join(" ")}
            >
              {gap > 0 ? fmtMonthly(gap) : "No gap"}
            </p>
          </div>
        </div>

        {(income.selfEmployed ?? false) && (
          <p className="mt-3 text-xs text-amber-700">
            Self-employed: look for products that accept business-owner income proof (e.g. management accounts or tax returns).
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

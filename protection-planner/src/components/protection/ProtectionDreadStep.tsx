import React from "react";
import type {
  ProtectionPlannerState,
  ProtectionDreadStep,
} from "../../types/protectionPlanner.types";
import { fmtProtectionCurrency } from "../../services/protectionPlannerHelpers";

export interface ProtectionDreadStepProps {
  state:    ProtectionPlannerState;
  onChange: (dread: ProtectionDreadStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function ProtectionDreadStep({
  state,
  onChange,
  onBack,
  onNext,
}: ProtectionDreadStepProps) {
  const { dread, overview } = state;

  function update(patch: Partial<ProtectionDreadStep>) {
    onChange({ ...dread, ...patch });
  }

  const grossIncome    = overview.monthlyGrossIncome ?? 0;
  const months         = dread.desiredLumpSumMonths ?? 18;
  const monthsBased    = grossIncome * months;
  const lumpSum        = dread.customLumpSumAmount ?? monthsBased;
  const existingCover  = overview.totalExistingDreadDiseaseCover ?? 0;
  const gap            = Math.max(0, lumpSum - existingCover);
  const wantsCover     = dread.wantsDreadDiseaseCover ?? true;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Dread Disease / Severe Illness</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        A severe illness lump sum pays out on diagnosis of a qualifying condition (cancer,
        heart attack, stroke, etc.). It covers treatment costs, lifestyle adjustments, and
        provides a financial bridge while you recover or adapt.
      </p>

      {/* SA stat callout */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs leading-5 text-blue-800">
          <strong>SA context:</strong> Cancer, heart attack, and stroke account for over 80% of
          severe illness claims in South Africa. A typical lump sum of 18 months' gross income
          covers treatment, home adaptation, and a recovery buffer without depleting savings.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {/* Want dread disease cover */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Include dread disease / severe illness in this assessment?
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                You can skip this pillar if you already have adequate cover or choose not to prioritise it now.
              </p>
            </div>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => update({ wantsDreadDiseaseCover: v })}
                  className={[
                    "rounded-xl px-3 py-1.5 text-xs font-medium transition",
                    wantsCover === v
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

        {wantsCover && (
          <>
            {/* Lump sum months */}
            <div>
              <p className="text-sm font-medium text-slate-700">
                Desired lump sum (months of gross income)
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                18 months is the SA standard. Increase to 24–36 months if you have dependants
                or a high-risk lifestyle.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[12, 18, 24, 36].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => update({ desiredLumpSumMonths: m, customLumpSumAmount: undefined })}
                    className={[
                      "rounded-xl border px-3 py-2 text-xs font-medium transition",
                      months === m && !dread.customLumpSumAmount
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                    ].join(" ")}
                  >
                    {m} months
                    <span className="ml-1 opacity-60">
                      ({fmtProtectionCurrency(grossIncome * m)})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom lump sum override */}
            <div>
              <label
                htmlFor="customLumpSum"
                className="block text-sm font-medium text-slate-700"
              >
                Or enter a specific lump sum (R) — optional
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Overrides the months-based calculation above.
              </p>
              <input
                id="customLumpSum"
                type="number"
                min={0}
                step={100_000}
                value={dread.customLumpSumAmount ?? ""}
                onChange={(e) =>
                  update({
                    customLumpSumAmount: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="mt-2 w-48 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder="e.g. 500000"
              />
            </div>

            {/* Live estimate */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Estimated dread disease position
              </p>
              <div className="mt-3 flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-slate-500">Target lump sum</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {fmtProtectionCurrency(lumpSum)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Existing cover</p>
                  <p className="mt-0.5 text-lg font-semibold text-slate-700">
                    {fmtProtectionCurrency(existingCover)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Gap</p>
                  <p
                    className={[
                      "mt-0.5 text-lg font-bold",
                      gap > 0 ? "text-red-600" : "text-emerald-600",
                    ].join(" ")}
                  >
                    {gap > 0 ? fmtProtectionCurrency(gap) : "No gap"}
                  </p>
                </div>
              </div>
            </div>
          </>
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

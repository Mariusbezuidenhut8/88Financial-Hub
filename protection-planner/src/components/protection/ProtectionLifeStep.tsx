import React from "react";
import type {
  ProtectionPlannerState,
  ProtectionLifeStep,
} from "../../types/protectionPlanner.types";
import { fmtProtectionCurrency } from "../../services/protectionPlannerHelpers";

export interface ProtectionLifeStepProps {
  state:    ProtectionPlannerState;
  onChange: (life: ProtectionLifeStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function ProtectionLifeStep({
  state,
  onChange,
  onBack,
  onNext,
}: ProtectionLifeStepProps) {
  const { life, overview } = state;

  function update(patch: Partial<ProtectionLifeStep>) {
    onChange({ ...life, ...patch });
  }

  // Live preview of life cover need
  const monthlyNet             = overview.monthlyNetIncome ?? 0;
  const years                  = life.incomeReplacementYears ?? overview.yearsToRetirement ?? 0;
  const incomeReplacement      = monthlyNet * 12 * years;
  const debtComponent          = (life.includeDebtInLifeNeed ?? true)
    ? (overview.totalOutstandingDebt ?? 0)
    : 0;
  const educationComponent     = (life.includeEducationFund ?? false)
    ? (overview.numberOfChildren ?? 0) * (life.educationFundPerChild ?? 200_000)
    : 0;
  const capitalComponent       = life.additionalCapitalNeed ?? 0;
  const estimatedNeed          = incomeReplacement + debtComponent + educationComponent + capitalComponent;
  const existingCover          = overview.totalExistingLifeCover ?? 0;
  const estimatedGap           = Math.max(0, estimatedNeed - existingCover);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Life Cover</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Life cover ensures your family can maintain their lifestyle if you die. We
        calculate the need using the income replacement method plus any additional capital.
      </p>

      <div className="mt-6 space-y-5">
        {/* Income replacement years */}
        <div>
          <label
            htmlFor="replacementYears"
            className="block text-sm font-medium text-slate-700"
          >
            Income replacement years
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            How many years of income should the cover replace? Default: your remaining
            years to retirement ({overview.yearsToRetirement ?? "—"} years).
          </p>
          <input
            id="replacementYears"
            type="number"
            min={1}
            max={50}
            step={1}
            value={life.incomeReplacementYears ?? overview.yearsToRetirement ?? ""}
            onChange={(e) =>
              update({ incomeReplacementYears: e.target.value ? Number(e.target.value) : undefined })
            }
            className="mt-2 w-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Include debt */}
        <ToggleRow
          label="Include outstanding debt in life cover need"
          hint={`Outstanding debt: ${fmtProtectionCurrency(overview.totalOutstandingDebt)}. Ensures all debt is cleared at death.`}
          value={life.includeDebtInLifeNeed ?? true}
          onChange={(v) => update({ includeDebtInLifeNeed: v })}
        />

        {/* Education fund */}
        <ToggleRow
          label="Include education fund for children"
          hint={`${overview.numberOfChildren ?? 0} child${(overview.numberOfChildren ?? 0) !== 1 ? "ren" : ""} on record. Provides a ring-fenced education fund at death.`}
          value={life.includeEducationFund ?? false}
          onChange={(v) => update({ includeEducationFund: v })}
          disabled={(overview.numberOfChildren ?? 0) === 0}
        />

        {(life.includeEducationFund ?? false) && (overview.numberOfChildren ?? 0) > 0 && (
          <div className="ml-4">
            <label
              htmlFor="educationFund"
              className="block text-sm font-medium text-slate-700"
            >
              Education fund per child (R)
            </label>
            <p className="mt-0.5 text-xs text-slate-500">
              Default R200 000 — adjust for private schooling, university, etc.
            </p>
            <input
              id="educationFund"
              type="number"
              min={0}
              step={50_000}
              value={life.educationFundPerChild ?? 200_000}
              onChange={(e) =>
                update({ educationFundPerChild: Number(e.target.value) })
              }
              className="mt-2 w-48 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        )}

        {/* Additional capital */}
        <div>
          <label
            htmlFor="capitalNeed"
            className="block text-sm font-medium text-slate-700"
          >
            Additional capital need (R) — optional
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Any once-off capital need not captured above: e.g. paying off a bond above
            the credit life cover, or a specific bequest.
          </p>
          <input
            id="capitalNeed"
            type="number"
            min={0}
            step={50_000}
            value={life.additionalCapitalNeed ?? ""}
            onChange={(e) =>
              update({
                additionalCapitalNeed: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="mt-2 w-48 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="0"
          />
        </div>
      </div>

      {/* Live estimate */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Estimated life cover need
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NeedRow label="Income replacement"  value={fmtProtectionCurrency(incomeReplacement)} />
          <NeedRow label="Debt component"       value={fmtProtectionCurrency(debtComponent)} />
          <NeedRow label="Education fund"       value={fmtProtectionCurrency(educationComponent)} />
          <NeedRow label="Additional capital"   value={fmtProtectionCurrency(capitalComponent || undefined)} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-slate-200 pt-4">
          <div>
            <p className="text-xs text-slate-500">Total need</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {fmtProtectionCurrency(estimatedNeed)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Existing cover</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-700">
              {fmtProtectionCurrency(existingCover)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Estimated gap</p>
            <p
              className={[
                "mt-0.5 text-lg font-bold",
                estimatedGap > 0 ? "text-red-600" : "text-emerald-600",
              ].join(" ")}
            >
              {estimatedGap > 0 ? fmtProtectionCurrency(estimatedGap) : "No gap"}
            </p>
          </div>
        </div>
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

// ── Sub-components ─────────────────────────────────────────────────────────

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  disabled = false,
}: {
  label:     string;
  hint:      string;
  value:     boolean;
  onChange:  (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-4",
        disabled ? "border-slate-100 bg-slate-50 opacity-50" : "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(true)}
            className={[
              "rounded-xl px-3 py-1.5 text-xs font-medium transition",
              value && !disabled
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            Yes
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(false)}
            className={[
              "rounded-xl px-3 py-1.5 text-xs font-medium transition",
              !value && !disabled
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

function NeedRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

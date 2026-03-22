import React from "react";
import type {
  ProtectionPlannerState,
  ProtectionDebtStep,
} from "../../types/protectionPlanner.types";
import { fmtProtectionCurrency } from "../../services/protectionPlannerHelpers";

export interface ProtectionDebtStepProps {
  state:    ProtectionPlannerState;
  onChange: (debt: ProtectionDebtStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function ProtectionDebtStep({
  state,
  onChange,
  onBack,
  onNext,
}: ProtectionDebtStepProps) {
  const { debt, overview } = state;

  function update(patch: Partial<ProtectionDebtStep>) {
    onChange({ ...debt, ...patch });
  }

  const totalOutstandingDebt = overview.totalOutstandingDebt ?? 0;
  const creditLifeCover      = overview.totalCreditLifeCover ?? 0;

  // Rough debt cover total (actual calculation is in the engine)
  // For the preview we just show total outstanding vs credit life
  const estimatedGap = Math.max(0, totalOutstandingDebt - creditLifeCover);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Debt Cover</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Debt cover ensures outstanding liabilities are cleared at death or disability,
        protecting your estate and dependants from inherited debt. Select which
        liabilities to include in the debt cover need.
      </p>

      {/* Outstanding debt summary */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          Total outstanding debt: {fmtProtectionCurrency(totalOutstandingDebt)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Existing credit life cover: {fmtProtectionCurrency(creditLifeCover)} ·
          Rough gap: <span className={estimatedGap > 0 ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>
            {estimatedGap > 0 ? fmtProtectionCurrency(estimatedGap) : "None"}
          </span>
        </p>
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Include in debt cover need
        </p>

        <DebtToggleRow
          label="Home loan / bond"
          hint="Mortgage balance — typically the largest single liability."
          checked={debt.coverHomeLoan ?? true}
          onChange={(v) => update({ coverHomeLoan: v })}
        />

        <DebtToggleRow
          label="Vehicle finance"
          hint="Outstanding hire purchase or lease agreements on vehicles."
          checked={debt.coverVehicleFinance ?? true}
          onChange={(v) => update({ coverVehicleFinance: v })}
        />

        <DebtToggleRow
          label="Personal loans, credit cards &amp; overdrafts"
          hint="Unsecured debt — student loans, personal loans, credit card balances."
          checked={debt.coverPersonalLoans ?? true}
          onChange={(v) => update({ coverPersonalLoans: v })}
        />

        <DebtToggleRow
          label="Business loans &amp; other debt"
          hint="Business finance, SARS debt, or other obligations not captured above."
          checked={debt.coverOtherDebt ?? false}
          onChange={(v) => update({ coverOtherDebt: v })}
        />

        {/* Additional debt */}
        <div>
          <label
            htmlFor="additionalDebt"
            className="block text-sm font-medium text-slate-700"
          >
            Additional debt not in profile (R) — optional
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Informal loans, guarantees, or deferred liabilities.
          </p>
          <input
            id="additionalDebt"
            type="number"
            min={0}
            step={10_000}
            value={debt.additionalDebtAmount ?? ""}
            onChange={(e) =>
              update({
                additionalDebtAmount: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="mt-2 w-48 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="0"
          />
        </div>
      </div>

      {/* Note on credit life */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs leading-5 text-blue-800">
          <strong>SA note:</strong> Credit life insurance is compulsory on home loans under the
          National Credit Act. It pays the outstanding bond balance at death or permanent
          disability. Confirm that your bond credit life cover amount matches your current
          outstanding balance, as older policies may be undervalued.
        </p>
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
          Run gap analysis
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────

function DebtToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label:    string;
  hint:     string;
  checked:  boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-slate-900"
      />
      <div className="min-w-0">
        <p
          className="text-sm font-medium text-slate-900"
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
      </div>
    </label>
  );
}

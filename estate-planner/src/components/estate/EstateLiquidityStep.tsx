import React from "react";
import type {
  EstatePlannerState,
  EstatePlannerLiquidityStep,
} from "../../types/estatePlanner.types";

export interface EstateLiquidityStepProps {
  state:    EstatePlannerState;
  onChange: (liquidity: EstatePlannerLiquidityStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function EstateLiquidityStep({
  state,
  onChange,
  onBack,
  onNext,
}: EstateLiquidityStepProps) {
  const { liquidity } = state;

  function update(patch: Partial<EstatePlannerLiquidityStep>) {
    onChange({ ...liquidity, ...patch });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Liquidity &amp; Costs</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Estate settlement costs must be paid in cash. Enter your estimates below — the
        defaults are based on typical SA estate administration figures.
      </p>

      <div className="mt-6 space-y-5">
        {/* Funeral costs */}
        <NumberField
          id="funeralCosts"
          label="Estimated funeral costs (R)"
          hint="SA average mid-range funeral: R30 000 – R80 000. Default: R50 000."
          value={liquidity.funeralCostsEstimate}
          onChange={(v) => update({ funeralCostsEstimate: v })}
          placeholder="50000"
        />

        {/* Executor fee % */}
        <div>
          <label
            htmlFor="executorFee"
            className="block text-sm font-medium text-slate-700"
          >
            Executor fee rate (%)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Masters Office-approved tariff is 3.5% of gross estate value (excl. VAT).
            Some executors negotiate lower rates for large estates.
          </p>
          <input
            id="executorFee"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={liquidity.executorFeePercent ?? 3.5}
            onChange={(e) =>
              update({ executorFeePercent: Number(e.target.value) })
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:max-w-xs"
          />
        </div>

        {/* Other costs */}
        <NumberField
          id="otherCosts"
          label="Other estimated costs (R)"
          hint="Includes conveyancing fees, Master's Office fees, bond cancellation costs, and legal fees."
          value={liquidity.estimatedOtherCosts}
          onChange={(v) => update({ estimatedOtherCosts: v })}
          placeholder="25000"
        />

        {/* Liquid cash available */}
        <NumberField
          id="liquidityAvailable"
          label="Cash / liquid assets available at death (R)"
          hint="Cash in bank accounts and easily liquidated assets that could be used before the estate is wound up."
          value={liquidity.liquidityAvailableAtDeath}
          onChange={(v) => update({ liquidityAvailableAtDeath: v })}
          placeholder="0"
        />
      </div>

      {/* Info */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs leading-5 text-slate-600">
          <strong>How the shortfall is calculated:</strong> Liquidity need = executor
          fees + estate duty + funeral costs + other costs. Life cover paid into the
          estate reduces the shortfall. Any remaining gap may require selling assets.
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
          Continue
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ───────────────────────────────────────────────────────────

function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  id:          string;
  label:       string;
  hint:        string;
  value:       number | undefined;
  onChange:    (v: number) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
      <input
        id={id}
        type="number"
        min={0}
        step={1000}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : 0)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:max-w-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

import React from "react";
import type {
  InvestmentPlannerState,
  InvestmentPlannerHorizonStep,
  InvestmentHorizonBand,
  InvestmentLiquidityNeed,
} from "../../types/investmentPlanner.types";

export interface InvestmentHorizonStepProps {
  state:    InvestmentPlannerState;
  onChange: (horizon: InvestmentPlannerHorizonStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

const HORIZON_OPTIONS: { key: InvestmentHorizonBand; label: string; sub: string }[] = [
  { key: "under_3", label: "Under 3 years",  sub: "Short-term savings or planned expenditure" },
  { key: "3_to_5",  label: "3 to 5 years",   sub: "Medium-term goal or staged investing"       },
  { key: "5_to_10", label: "5 to 10 years",  sub: "Building long-term wealth at a steady pace" },
  { key: "10_plus", label: "10+ years",       sub: "Long-term compounding and retirement prep"  },
];

const LIQUIDITY_OPTIONS: { key: InvestmentLiquidityNeed; label: string; sub: string }[] = [
  { key: "high",   label: "High",   sub: "I may need to access funds at short notice" },
  { key: "medium", label: "Medium", sub: "Some access may be needed during the period" },
  { key: "low",    label: "Low",    sub: "I can leave this money invested throughout"  },
];

export function InvestmentHorizonStep({
  state,
  onChange,
  onBack,
  onNext,
}: InvestmentHorizonStepProps) {
  const { horizon } = state;
  const canContinue = Boolean(horizon.horizonBand && horizon.liquidityNeed);

  const set = (patch: Partial<InvestmentPlannerHorizonStep>) =>
    onChange({ ...horizon, ...patch });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        Time Horizon &amp; Liquidity
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Help us understand how long the money can stay invested and how important
        access is to you.
      </p>

      {/* Horizon band */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">
          Investment horizon <span className="text-red-500">*</span>
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {HORIZON_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => set({ horizonBand: item.key })}
              className={[
                "rounded-2xl border px-4 py-3.5 text-left transition",
                horizon.horizonBand === item.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className={`mt-0.5 text-xs ${horizon.horizonBand === item.key ? "opacity-70" : "text-slate-500"}`}>
                {item.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Liquidity need */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">
          Liquidity need <span className="text-red-500">*</span>
        </p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LIQUIDITY_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => set({ liquidityNeed: item.key })}
              className={[
                "rounded-2xl border px-4 py-3.5 text-left transition",
                horizon.liquidityNeed === item.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className={`mt-0.5 text-xs ${horizon.liquidityNeed === item.key ? "opacity-70" : "text-slate-500"}`}>
                {item.sub}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Lock-in & planned use toggles */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ToggleCard
          label="Can this money stay invested until retirement?"
          value={horizon.canLockUntilRetirement}
          onChange={(v) => set({ canLockUntilRetirement: v })}
        />
        <ToggleCard
          label="Is this money for a specific planned event?"
          value={horizon.plannedUse}
          onChange={(v) => set({ plannedUse: v })}
        />
      </div>

      <div className="mt-6 flex justify-between">
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
          disabled={!canContinue}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function ToggleCard({
  label,
  value,
  onChange,
}: {
  label:    string;
  value?:   boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="mt-3 flex gap-3">
        {([true, false] as const).map((v) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={[
              "rounded-2xl border px-4 py-2.5 text-sm font-medium transition",
              value === v
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
            ].join(" ")}
          >
            {v ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

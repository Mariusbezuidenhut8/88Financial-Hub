import React from "react";
import type {
  InvestmentPlannerState,
  InvestmentPlannerTaxStep,
  InvestmentTFSAUsage,
  InvestmentTaxBand,
} from "../../types/investmentPlanner.types";

export interface InvestmentTaxStepProps {
  state:    InvestmentPlannerState;
  onChange: (tax: InvestmentPlannerTaxStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function InvestmentTaxStep({
  state,
  onChange,
  onBack,
  onNext,
}: InvestmentTaxStepProps) {
  const { tax } = state;

  const set = (patch: Partial<InvestmentPlannerTaxStep>) =>
    onChange({ ...tax, ...patch });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">
        Contribution &amp; Tax Context
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This helps us assess how the investment may best be structured. We only
        need a broad view — not an exact tax calculation.
      </p>

      {/* Contribution amounts */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="monthlyContrib" className="block text-sm font-medium text-slate-700">
            Monthly contribution amount
          </label>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="monthlyContrib"
              type="number"
              min={0}
              value={tax.monthlyContributionAmount ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ monthlyContributionAmount: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 3 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lumpSum" className="block text-sm font-medium text-slate-700">
            Lump sum amount (optional)
          </label>
          <div className="mt-2 relative">
            <span className="absolute inset-y-0 left-4 flex items-center text-sm text-slate-400">R</span>
            <input
              id="lumpSum"
              type="number"
              min={0}
              value={tax.lumpSumAmount ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                set({ lumpSumAmount: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 100 000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-8 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </div>

      {/* RA + TFSA toggles */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ToggleCard
          label="Do you already have retirement funding in place?"
          hint="E.g. RA, pension fund, or provident fund"
          value={tax.hasExistingRA}
          onChange={(v) => set({ hasExistingRA: v })}
        />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Have you already used your TFSA?</p>
          <p className="mt-0.5 text-xs text-slate-500">Annual limit R36 000 / lifetime R500 000</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["yes", "no", "not_sure"] as InvestmentTFSAUsage[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => set({ hasUsedTFSA: v })}
                className={[
                  "rounded-2xl border px-4 py-2.5 text-sm font-medium transition",
                  tax.hasUsedTFSA === v
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                {v === "not_sure" ? "Not sure" : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tax band */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700">Broad tax band</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Low ≈ below R250k/yr · Medium ≈ R250k–R700k/yr · High ≈ above R700k/yr
        </p>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {(["low", "medium", "high"] as InvestmentTaxBand[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ taxBand: v })}
              className={[
                "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                tax.taxBand === v
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              ].join(" ")}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Flexibility toggle */}
      <div className="mt-5">
        <ToggleCard
          label="Is maximum flexibility important to you?"
          hint="Choosing yes may favour discretionary investing over locked wrappers"
          value={tax.wantsMaximumFlexibility}
          onChange={(v) => set({ wantsMaximumFlexibility: v })}
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
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          See recommendation
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ──────────────────────────────────────────────────────────

function ToggleCard({
  label,
  hint,
  value,
  onChange,
}: {
  label:    string;
  hint?:    string;
  value?:   boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
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

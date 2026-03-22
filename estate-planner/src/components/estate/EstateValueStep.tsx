import React from "react";
import type {
  EstatePlannerState,
  EstatePlannerEstateStep,
} from "../../types/estatePlanner.types";

export interface EstateValueStepProps {
  state:    EstatePlannerState;
  onChange: (estate: EstatePlannerEstateStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function EstateValueStep({
  state,
  onChange,
  onBack,
  onNext,
}: EstateValueStepProps) {
  const { estate } = state;

  function update(patch: Partial<EstatePlannerEstateStep>) {
    onChange({ ...estate, ...patch });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Estate Value</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Select which asset categories to include in the estate valuation. We will use
        the values recorded on your profile. You can add any additional amounts below.
      </p>

      {/* Inclusion toggles */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Include in dutiable estate
        </p>

        <IncludeRow
          label="Primary residence"
          hint="The property value will be included at current estimated market value."
          checked={estate.includePrimaryResidence ?? true}
          onChange={(v) => update({ includePrimaryResidence: v })}
        />

        <IncludeRow
          label="Discretionary investments"
          hint="Unit trusts, ETFs, shares, TFSA, endowments, offshore investments."
          checked={estate.includeDiscretionaryAssets ?? true}
          onChange={(v) => update({ includeDiscretionaryAssets: v })}
        />

        <IncludeRow
          label="Business interests"
          hint="Shares in private companies, close corporations, or partnerships."
          checked={estate.includeBusinessAssets ?? true}
          onChange={(v) => update({ includeBusinessAssets: v })}
        />

        <IncludeRow
          label="Life cover paid to estate"
          hint="Life policies where the estate is the beneficiary (not a nominated person)."
          checked={estate.includeLifeCover ?? true}
          onChange={(v) => update({ includeLifeCover: v })}
        />

        <IncludeRow
          label="Retirement assets (RA / pension / provident)"
          hint="Typically excluded — retirement fund trustees nominate beneficiaries directly. Only include if paid to estate."
          checked={estate.includeRetirementAssets ?? false}
          onChange={(v) => update({ includeRetirementAssets: v })}
        />
      </div>

      {/* Additional asset / liability values */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="additionalAssets"
            className="block text-sm font-medium text-slate-700"
          >
            Additional assets not in profile (R)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            e.g. collectables, informal property, foreign assets
          </p>
          <input
            id="additionalAssets"
            type="number"
            min={0}
            step={1000}
            value={estate.additionalAssetValue ?? ""}
            onChange={(e) =>
              update({
                additionalAssetValue: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="0"
          />
        </div>

        <div>
          <label
            htmlFor="additionalLiabilities"
            className="block text-sm font-medium text-slate-700"
          >
            Additional liabilities not in profile (R)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            e.g. informal loans, guarantees, deferred tax
          </p>
          <input
            id="additionalLiabilities"
            type="number"
            min={0}
            step={1000}
            value={estate.additionalLiabilityValue ?? ""}
            onChange={(e) =>
              update({
                additionalLiabilityValue: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="0"
          />
        </div>
      </div>

      {/* Info note on retirement assets */}
      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs leading-5 text-blue-800">
          <strong>SA note:</strong> Retirement fund benefits (RA, pension, provident) are generally paid
          directly to nominated beneficiaries and do not form part of the dutiable estate.
          The estate duty abatement is <strong>R3 500 000</strong> with estate duty levied at{" "}
          <strong>20%</strong> on the remainder.
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

function IncludeRow({
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
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
      </div>
    </label>
  );
}

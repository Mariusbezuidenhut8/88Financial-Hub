import React from "react";
import type {
  EstatePlannerState,
  EstatePlannerFamilyStep,
} from "../../types/estatePlanner.types";

export interface EstateFamilyStepProps {
  state:    EstatePlannerState;
  onChange: (family: EstatePlannerFamilyStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function EstateFamilyStep({
  state,
  onChange,
  onBack,
  onNext,
}: EstateFamilyStepProps) {
  const { family } = state;

  function update(patch: Partial<EstatePlannerFamilyStep>) {
    onChange({ ...family, ...patch });
  }

  const canContinue = family.hasWill !== undefined;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Family &amp; Documents</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The foundation of every estate plan is a valid will, a nominated executor, and
        — where applicable — a guardian for minor children.
      </p>

      <div className="mt-6 space-y-5">
        {/* Will */}
        <ToggleRow
          label="Do you have a valid will?"
          hint="A will must be signed, dated, and witnessed by two competent witnesses."
          value={family.hasWill}
          onChange={(v) => update({ hasWill: v })}
          required
        />

        {family.hasWill && (
          <ToggleRow
            label="Do you know approximately when the will was last updated?"
            hint="Wills older than 3–5 years or those written before major life events should be reviewed."
            value={family.willLastUpdatedKnown}
            onChange={(v) => update({ willLastUpdatedKnown: v })}
          />
        )}

        {/* Guardian */}
        <ToggleRow
          label="Have you nominated a guardian for any minor children?"
          hint="If you have minor children and no guardian is nominated, the court will decide."
          value={family.nominatedGuardian}
          onChange={(v) => update({ nominatedGuardian: v })}
        />

        {/* Executor */}
        <ToggleRow
          label="Have you chosen an executor?"
          hint="An executor administers your estate. A professional executor can reduce delays significantly."
          value={family.executorChosen}
          onChange={(v) => update({ executorChosen: v })}
        />

        {/* Beneficiaries */}
        <ToggleRow
          label="Have you recently reviewed all beneficiary nominations?"
          hint="This includes policies, pension/provident funds, and any living annuities."
          value={family.beneficiariesReviewed}
          onChange={(v) => update({ beneficiariesReviewed: v })}
        />

        {/* Trusts */}
        <ToggleRow
          label="Do you have a trust in place?"
          hint="Trusts can protect assets for minors, special-needs dependants, or complex estates."
          value={family.trustsInPlace}
          onChange={(v) => update({ trustsInPlace: v })}
        />

        {/* Special bequests */}
        <ToggleRow
          label="Are there any special bequests or specific gifts in your will?"
          hint="For example, specific assets left to specific people or organisations."
          value={family.specialBequests}
          onChange={(v) => update({ specialBequests: v })}
        />

        {/* Business succession */}
        <ToggleRow
          label="Do you have business interests that require succession planning?"
          hint="Buy-and-sell agreements and business succession plans prevent forced liquidation."
          value={family.businessSuccessionNeeds}
          onChange={(v) => update({ businessSuccessionNeeds: v })}
        />
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
          disabled={!canContinue}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ───────────────────────────────────────────────────────────

function ToggleRow({
  label,
  hint,
  value,
  onChange,
  required = false,
}: {
  label:     string;
  hint?:     string;
  value:     boolean | undefined;
  onChange:  (v: boolean) => void;
  required?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </p>
          {hint && (
            <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
          )}
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <ToggleButton
            active={value === true}
            label="Yes"
            onClick={() => onChange(true)}
          />
          <ToggleButton
            active={value === false}
            label="No"
            onClick={() => onChange(false)}
          />
        </div>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active:  boolean;
  label:   string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl px-3 py-1.5 text-xs font-medium transition",
        active
          ? "bg-slate-900 text-white"
          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

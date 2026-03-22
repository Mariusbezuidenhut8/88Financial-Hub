import React from "react";
import type {
  EstatePlannerState,
  EstatePlannerReviewStep,
} from "../../types/estatePlanner.types";

export interface EstateReviewStepProps {
  state:    EstatePlannerState;
  onChange: (review: EstatePlannerReviewStep) => void;
  onBack:   () => void;
  onNext:   () => void;
}

export function EstateReviewStep({
  state,
  onChange,
  onBack,
  onNext,
}: EstateReviewStepProps) {
  const { review } = state;

  function update(patch: Partial<EstatePlannerReviewStep>) {
    onChange({ ...review, ...patch });
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Review &amp; Complexity</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The final check covers estate complexity flags that may affect the analysis
        or require specialist advice beyond this planner.
      </p>

      <div className="mt-6 space-y-4">
        <ToggleRow
          label="Have all beneficiary nominations been updated recently?"
          hint="Outdated beneficiary nominations are one of the most common estate planning oversights."
          value={review.beneficiaryNominationsUpdated}
          onChange={(v) => update({ beneficiaryNominationsUpdated: v })}
        />

        <ToggleRow
          label="Is the distribution of your estate particularly complex?"
          hint="For example, multiple trusts, blended family structures, or detailed specific bequests."
          value={review.estateDistributionComplex}
          onChange={(v) => update({ estateDistributionComplex: v })}
        />

        <ToggleRow
          label="Are there any special needs dependants?"
          hint="Dependants with disability or chronic illness may need a testamentary trust with a professional trustee."
          value={review.anySpecialNeedsDependants}
          onChange={(v) => update({ anySpecialNeedsDependants: v })}
        />

        <ToggleRow
          label="Do you have assets in another country?"
          hint="Cross-border assets require separate winding-up in each jurisdiction — this significantly adds complexity and cost."
          value={review.crossBorderAssets}
          onChange={(v) => update({ crossBorderAssets: v })}
        />

        {/* Notes */}
        <div>
          <label
            htmlFor="estateNotes"
            className="block text-sm font-medium text-slate-700"
          >
            Additional notes (optional)
          </label>
          <p className="mt-0.5 text-xs text-slate-500">
            Anything else your adviser should be aware of.
          </p>
          <textarea
            id="estateNotes"
            rows={3}
            value={review.notes ?? ""}
            onChange={(e) => update({ notes: e.target.value || undefined })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            placeholder="e.g. Awaiting transfer of inherited property, family trust being wound up..."
          />
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
          Run estate analysis
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
}: {
  label:    string;
  hint:     string;
  value:    boolean | undefined;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
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

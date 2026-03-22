import React from "react";
import type { EstatePlannerState } from "../../types/estatePlanner.types";

export interface EstateOverviewStepProps {
  state:           EstatePlannerState;
  mappingWarnings: string[];
  onNext:          () => void;
}

export function EstateOverviewStep({
  state,
  mappingWarnings,
  onNext,
}: EstateOverviewStepProps) {
  const { overview } = state;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Estate Planning Overview</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        We have pulled your key estate planning details from your profile. We will walk
        you through each area to assess your current position, estimate estate costs, and
        surface any gaps that need attention.
      </p>

      {/* Summary tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <SummaryTile
          label="Marital status"
          value={overview.maritalStatus ?? "Not recorded"}
        />
        <SummaryTile
          label="Children"
          value={
            overview.numberOfChildren !== undefined
              ? String(overview.numberOfChildren)
              : "—"
          }
        />
        <SummaryTile
          label="Will in place"
          value={
            overview.existingWill === true
              ? "Yes"
              : overview.existingWill === false
              ? "No"
              : "Unknown"
          }
          highlight={overview.existingWill === false}
        />
        <SummaryTile
          label="Minor children"
          value={
            overview.hasMinorChildren === true
              ? "Yes"
              : overview.hasMinorChildren === false
              ? "No"
              : "Unknown"
          }
          highlight={overview.hasMinorChildren === true}
        />
        <SummaryTile
          label="Beneficiaries reviewed"
          value={
            overview.beneficiariesReviewed === true
              ? "Yes"
              : overview.beneficiariesReviewed === false
              ? "No"
              : "Unknown"
          }
        />
      </div>

      {/* Mapping warnings */}
      {mappingWarnings.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Profile gaps detected
          </p>
          <ul className="mt-2 space-y-1">
            {mappingWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800">• {w}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-700">
            You can fill in or correct any details in the steps below.
          </p>
        </div>
      )}

      {/* No will — urgent callout */}
      {overview.existingWill === false && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">
            No will on record — this is a critical gap
          </p>
          <p className="mt-1 text-xs text-red-700">
            Without a valid will your estate will be wound up under the Intestate
            Succession Act, which may not reflect your wishes.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Let's get started
        </button>
      </div>
    </section>
  );
}

// ── Sub-component ───────────────────────────────────────────────────────────

function SummaryTile({
  label,
  value,
  highlight = false,
}: {
  label:      string;
  value:      string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-4",
        highlight ? "bg-red-50 border border-red-100" : "bg-slate-50",
      ].join(" ")}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={[
          "mt-2 text-base font-semibold",
          highlight ? "text-red-700" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

import React from "react";
import type { ProtectionPlannerState } from "../../types/protectionPlanner.types";
import {
  fmtProtectionCurrency,
  fmtMonthly,
} from "../../services/protectionPlannerHelpers";

export interface ProtectionOverviewStepProps {
  state:           ProtectionPlannerState;
  mappingWarnings: string[];
  onNext:          () => void;
}

export function ProtectionOverviewStep({
  state,
  mappingWarnings,
  onNext,
}: ProtectionOverviewStepProps) {
  const { overview } = state;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Protection Overview</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        We have pulled your income, dependant, and existing cover details from your
        profile. We will now assess gaps across four pillars: life cover, income
        protection, dread disease, and debt cover.
      </p>

      {/* Income & horizon tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryTile
          label="Monthly gross income"
          value={fmtProtectionCurrency(overview.monthlyGrossIncome)}
          highlight={!overview.monthlyGrossIncome}
        />
        <SummaryTile
          label="Monthly net income"
          value={fmtProtectionCurrency(overview.monthlyNetIncome)}
        />
        <SummaryTile
          label="Years to retirement"
          value={
            overview.yearsToRetirement !== undefined
              ? `${overview.yearsToRetirement} years`
              : "—"
          }
        />
        <SummaryTile
          label="Dependants"
          value={
            overview.numberOfDependants !== undefined
              ? String(overview.numberOfDependants)
              : "—"
          }
          highlight={overview.numberOfDependants === 0}
        />
      </div>

      {/* Existing cover summary */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-900">Existing cover from profile</p>
        <div className="mt-3 grid grid-cols-2 gap-y-3 gap-x-6 sm:grid-cols-4">
          <CoverRow
            label="Life cover"
            value={fmtProtectionCurrency(overview.totalExistingLifeCover)}
            covered={(overview.totalExistingLifeCover ?? 0) > 0}
          />
          <CoverRow
            label="Disability income"
            value={fmtMonthly(overview.totalExistingMonthlyDisabilityBenefit)}
            covered={(overview.totalExistingMonthlyDisabilityBenefit ?? 0) > 0}
          />
          <CoverRow
            label="Dread disease"
            value={fmtProtectionCurrency(overview.totalExistingDreadDiseaseCover)}
            covered={(overview.totalExistingDreadDiseaseCover ?? 0) > 0}
          />
          <CoverRow
            label="Credit life"
            value={fmtProtectionCurrency(overview.totalCreditLifeCover)}
            covered={(overview.totalCreditLifeCover ?? 0) > 0}
          />
        </div>

        {overview.hasGroupRiskBenefit && (
          <p className="mt-3 text-xs text-blue-700">
            Group risk benefit detected — confirm exact cover amounts with your employer.
          </p>
        )}

        <p className="mt-3 text-xs text-slate-500">
          {overview.existingPoliciesCount ?? 0} active{" "}
          {(overview.existingPoliciesCount ?? 0) === 1 ? "policy" : "policies"} on file ·{" "}
          Outstanding debt: {fmtProtectionCurrency(overview.totalOutstandingDebt)}
        </p>
      </div>

      {/* Mapping warnings */}
      {mappingWarnings.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Profile gaps detected</p>
          <ul className="mt-2 space-y-1">
            {mappingWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800">• {w}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-amber-700">
            You can fill in or correct details during the next steps.
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Start gap analysis
        </button>
      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

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
        highlight ? "bg-amber-50 border border-amber-100" : "bg-slate-50",
      ].join(" ")}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={[
          "mt-2 text-base font-semibold",
          highlight ? "text-amber-700" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function CoverRow({
  label,
  value,
  covered,
}: {
  label:   string;
  value:   string;
  covered: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={[
          "mt-0.5 text-sm font-semibold",
          covered ? "text-slate-900" : "text-red-600",
        ].join(" ")}
      >
        {covered ? value : "None"}
      </p>
    </div>
  );
}

/**
 * ROADocumentStep.tsx
 *
 * Step 5 — Formatted ROA document preview.
 * Renders a print-ready document from the wizard state.
 * Print button triggers window.print() — CSS hides non-document chrome.
 */

import React, { useMemo } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { runHealthScore } from "@88fh/financial-health-score";
import type { ROAState } from "../../types/roa.types";
import {
  buildReferenceNo,
  fmtROADate,
  fmtROACurrency,
  getMeetingTypeLabel,
  getPriorityLabel,
  getAreaLabel,
} from "../../services/roaHelpers";

type ClientProfile = PlatformRecord["clientProfile"];

export interface ROADocumentStepProps {
  state:   ROAState;
  profile: ClientProfile;
  record:  PlatformRecord;
  onNext:  () => void;
  onBack:  () => void;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-200 pt-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {number}. {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-0.5">
      <span className="w-44 flex-shrink-0 text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-800 capitalize">{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ROADocumentStep({ state, profile, record, onNext, onBack }: ROADocumentStepProps) {
  const score   = useMemo(() => runHealthScore(profile), [profile]);
  const refNo   = buildReferenceNo(record, state);
  const { identity, employment, household } = profile;

  const totalDeps =
    (household.numberOfChildren        ?? 0) +
    (household.numberOfDependentAdults ?? 0) +
    (household.parentsSupported        ?? 0) +
    (household.extendedFamilySupported ?? 0);

  const includedAdvice = state.adviceItems.filter((i) => i.included);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      {/* Actions bar (hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <p className="text-sm font-medium text-slate-700">
          ROA Preview — {refNo}
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Print / Save PDF
        </button>
      </div>

      {/* ── DOCUMENT ────────────────────────────────────────────────────────── */}
      <div
        id="roa-document"
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm print:rounded-none print:border-0 print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Fairbairn Consult (Pty) Ltd
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Record of Advice</h1>
            <p className="mt-1 text-xs text-slate-500">
              This document is issued in terms of the Financial Advisory and Intermediary Services Act, 2002
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Reference</p>
            <p className="font-bold text-slate-900">{refNo}</p>
            <p className="mt-1 text-xs text-slate-400">Date of advice</p>
            <p className="text-sm font-medium text-slate-800">{fmtROADate(state.meetingDate)}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">

          {/* 1. Meeting details */}
          <Section number="1" title="Meeting details">
            <DataRow label="Adviser"      value={state.adviserName || "—"} />
            <DataRow label="FSP number"   value={state.adviserFSPNumber || "—"} />
            <DataRow label="Meeting type" value={getMeetingTypeLabel(state.meetingType)} />
            <DataRow label="Meeting date" value={fmtROADate(state.meetingDate)} />
          </Section>

          {/* 2. Client particulars */}
          <Section number="2" title="Client particulars">
            <DataRow label="Full name"      value={`${identity.firstName} ${identity.lastName}`} />
            <DataRow label="ID number"      value={identity.idNumber ?? "—"} />
            <DataRow label="Date of birth"  value={identity.dateOfBirth ? fmtROADate(identity.dateOfBirth) : "—"} />
            <DataRow label="Marital status" value={identity.maritalStatus?.replace(/_/g, " ") ?? "—"} />
            <DataRow label="Dependants"     value={String(totalDeps)} />
            <DataRow label="Employment"     value={employment?.employmentStatus?.replace(/_/g, " ") ?? "—"} />
            <DataRow label="Gross income"   value={employment?.monthlyGrossIncome ? fmtROACurrency(employment.monthlyGrossIncome) + " / month" : "—"} />
            <DataRow label="Email"          value={profile.contact?.emailAddress ?? "—"} />
          </Section>

          {/* 3. Financial health summary */}
          <Section number="3" title="Financial health summary">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-900">{score.overallScore}</span>
              <span className="text-slate-400">/ 100</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 capitalize">
                {score.band.replace(/_/g, " ")}
              </span>
            </div>
            {score.topGaps.length > 0 && (
              <ul className="mt-3 space-y-1">
                {score.topGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
                    {gap}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* 4. Needs analysis */}
          <Section number="4" title="Needs analysis">
            {state.primaryObjective && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-500">Primary objective</p>
                <p className="mt-1 text-sm text-slate-800">{state.primaryObjective}</p>
              </div>
            )}
            {state.clientRiskProfile && (
              <div className="mb-3">
                <p className="text-xs font-medium text-slate-500">Risk tolerance</p>
                <p className="mt-1 text-sm text-slate-800">{state.clientRiskProfile}</p>
              </div>
            )}
            {state.keyCircumstances && (
              <div>
                <p className="text-xs font-medium text-slate-500">Key circumstances</p>
                <p className="mt-1 text-sm text-slate-800">{state.keyCircumstances}</p>
              </div>
            )}
          </Section>

          {/* 5. Advice given */}
          <Section number="5" title="Advice given">
            {includedAdvice.map((item, idx) => (
              <div key={item.area} className={idx > 0 ? "mt-5 border-t border-slate-100 pt-5" : ""}>
                <p className="text-xs font-bold text-slate-700">
                  5.{idx + 1} {item.areaLabel}
                </p>
                {item.clientNeedIdentified && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-400">Need identified</p>
                    <p className="mt-0.5 text-xs text-slate-600">{item.clientNeedIdentified}</p>
                  </div>
                )}
                {item.adviceGiven && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-400">Advice given</p>
                    <p className="mt-0.5 text-sm text-slate-800">{item.adviceGiven}</p>
                  </div>
                )}
                {item.basisForAdvice && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-400">Basis for advice</p>
                    <p className="mt-0.5 text-xs text-slate-600">{item.basisForAdvice}</p>
                  </div>
                )}
                {item.productOrAction && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-400">Product / action</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-800">{item.productOrAction}</p>
                  </div>
                )}
              </div>
            ))}
          </Section>

          {/* 6. Recommendations */}
          {state.recommendations.length > 0 && (
            <Section number="6" title="Recommendations">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 text-left font-medium text-slate-400">Area</th>
                    <th className="py-2 text-left font-medium text-slate-400">Action</th>
                    <th className="py-2 text-left font-medium text-slate-400">Priority</th>
                    <th className="py-2 text-right font-medium text-slate-400">Est. Cost/mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.recommendations.map((rec) => (
                    <tr key={rec.id}>
                      <td className="py-2 pr-4 font-medium text-slate-700 whitespace-nowrap">{getAreaLabel(rec.area)}</td>
                      <td className="py-2 pr-4 text-slate-700">{rec.action}</td>
                      <td className="py-2 pr-4 whitespace-nowrap text-slate-500">{getPriorityLabel(rec.priority)}</td>
                      <td className="py-2 text-right text-slate-500">
                        {rec.estimatedMonthlyCost ? fmtROACurrency(rec.estimatedMonthlyCost) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* 7. Disclosures */}
          <Section number="7" title="Disclosures">
            <p className="text-xs leading-5 text-slate-600">
              Fairbairn Consult (Pty) Ltd is an authorised financial services provider.
              The advice contained in this document is based on the information provided by the client
              at the time of the engagement. The adviser has a reasonable basis for the recommendations made.
            </p>
            {state.conflictsOfInterest && (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-400">Conflicts of interest</p>
                <p className="mt-0.5 text-xs text-slate-600">{state.conflictsOfInterest}</p>
              </div>
            )}
          </Section>

          {/* 8. Signatures */}
          <Section number="8" title="Declarations">
            <div className="grid grid-cols-2 gap-8 mt-2">
              <div>
                <p className="text-xs font-medium text-slate-500">Adviser</p>
                <div className="mt-6 border-t border-slate-300 pt-1">
                  <p className="text-xs text-slate-400">{state.adviserName || "Adviser name"}</p>
                  <p className="text-xs text-slate-400">Date: {fmtROADate(state.meetingDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Client acknowledgement</p>
                <div className="mt-6 border-t border-slate-300 pt-1">
                  <p className="text-xs text-slate-400">{identity.firstName} {identity.lastName}</p>
                  <p className="text-xs text-slate-400">Date: ___________________</p>
                </div>
              </div>
            </div>
          </Section>

        </div>
      </div>

      {/* Footer (hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          ← Back
        </button>
        <button type="button" onClick={onNext}
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
          Sign off →
        </button>
      </div>
    </div>
  );
}

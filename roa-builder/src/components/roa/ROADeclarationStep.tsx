/**
 * ROADeclarationStep.tsx
 *
 * Step 6 — Adviser declaration and completion.
 * Confirms FAIS compliance statements before finalising the ROA.
 */

import React from "react";
import type { ROAState } from "../../types/roa.types";
import { buildReferenceNo, fmtROADate } from "../../services/roaHelpers";
import type { PlatformRecord } from "@88fh/master-data-model";

export interface ROADeclarationStepProps {
  state:    ROAState;
  record:   PlatformRecord;
  onChange: <K extends keyof ROAState>(key: K, value: ROAState[K]) => void;
  onFinish: () => void;
  onBack:   () => void;
}

const DECLARATIONS = [
  "I have gathered sufficient information about the client's financial situation, objectives and risk tolerance.",
  "The advice given is appropriate and in the best interest of the client.",
  "I have disclosed all material information including conflicts of interest.",
  "The client has been informed of their right to a cooling-off period where applicable.",
  "This record of advice will be kept on file for a minimum of 5 years in accordance with the FAIS Act.",
];

export function ROADeclarationStep({
  state, record, onChange, onFinish, onBack,
}: ROADeclarationStepProps) {
  const refNo      = buildReferenceNo(record, state);
  const canFinish  = state.adviserDeclarationConfirmed;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      {/* Summary badge */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
          ROA ready for sign-off
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900">{refNo}</p>
        <p className="text-xs text-slate-500">
          {state.adviserName && `Adviser: ${state.adviserName} · `}
          Date: {fmtROADate(state.meetingDate)} ·{" "}
          {state.recommendations.length} recommendation{state.recommendations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Declaration checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Adviser declarations</h2>

        {DECLARATIONS.map((text, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-xs text-emerald-600">✓</span>
            </div>
            <p className="text-sm text-slate-700">{text}</p>
          </div>
        ))}
      </div>

      {/* Conflicts of interest */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block text-xs font-medium text-slate-600">
          Conflicts of interest (state "None" if none apply)
        </label>
        <input
          type="text"
          value={state.conflictsOfInterest}
          onChange={(e) => onChange("conflictsOfInterest", e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
        />
      </div>

      {/* Final confirmation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={state.adviserDeclarationConfirmed}
            onChange={(e) => onChange("adviserDeclarationConfirmed", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          <span className="text-sm text-slate-700">
            I, <strong>{state.adviserName || "the adviser"}</strong>, confirm that the above declarations
            are true and that this Record of Advice accurately reflects the advice given to{" "}
            <strong>
              {record.clientProfile.identity.firstName} {record.clientProfile.identity.lastName}
            </strong>{" "}
            on <strong>{fmtROADate(state.meetingDate)}</strong>.
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          ← Back
        </button>
        <button
          type="button"
          onClick={onFinish}
          disabled={!canFinish}
          className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Finalise ROA ✓
        </button>
      </div>
    </div>
  );
}

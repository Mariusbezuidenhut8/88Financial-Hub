/**
 * ROANeedsStep.tsx
 *
 * Step 2 — Document the client's needs, objectives and risk profile.
 * Health score top gaps are shown as context.
 */

import React, { useMemo } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { runHealthScore } from "@88fh/financial-health-score";
import type { ROAState } from "../../types/roa.types";

type ClientProfile = PlatformRecord["clientProfile"];

export interface ROANeedsStepProps {
  state:    ROAState;
  profile:  ClientProfile;
  onChange: <K extends keyof ROAState>(key: K, value: ROAState[K]) => void;
  onNext:   () => void;
  onBack:   () => void;
}

const RISK_OPTIONS = [
  "Conservative — capital preservation is the priority",
  "Moderate — balanced growth with managed downside",
  "Moderately aggressive — growth-oriented with some volatility tolerance",
  "Aggressive — maximum long-term growth",
];

export function ROANeedsStep({ state, profile, onChange, onNext, onBack }: ROANeedsStepProps) {
  const score      = useMemo(() => runHealthScore(profile), [profile]);
  const canProceed = state.primaryObjective.trim().length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      {/* Health score context */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Health score context
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl font-bold text-slate-900">{score.overallScore}</span>
          <span className="text-sm text-slate-500">/ 100</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 capitalize">
            {score.band.replace(/_/g, " ")}
          </span>
        </div>
        {score.topGaps.length > 0 && (
          <ul className="mt-3 space-y-1">
            {score.topGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                {gap}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Needs form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Needs analysis
        </h2>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            Primary objective <span className="text-red-500">*</span>
          </label>
          <textarea
            value={state.primaryObjective}
            onChange={(e) => onChange("primaryObjective", e.target.value)}
            rows={3}
            placeholder="e.g. Client's primary objective is to ensure adequate retirement income while protecting family in the event of death or disability..."
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            Risk tolerance
          </label>
          <select
            value={state.clientRiskProfile}
            onChange={(e) => onChange("clientRiskProfile", e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            <option value="">— Select risk profile —</option>
            {RISK_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600">
            Key circumstances noted
          </label>
          <textarea
            value={state.keyCircumstances}
            onChange={(e) => onChange("keyCircumstances", e.target.value)}
            rows={3}
            placeholder="e.g. Client has minor children, home loan outstanding, spouse not employed, approaching retirement..."
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          ← Back
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed}
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
          Continue →
        </button>
      </div>
    </div>
  );
}

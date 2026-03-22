/**
 * ROARecommendationsStep.tsx
 *
 * Step 4 — Review and edit the recommendations list.
 * Pre-populated from health score + planner outputs.
 * Adviser can add, edit, or remove rows.
 */

import React, { useState } from "react";
import type { ROAState, ROARecommendation, AdviceArea, RecommendationPriority } from "../../types/roa.types";
import { getPriorityLabel, getPriorityBadge, getAreaLabel } from "../../services/roaHelpers";

export interface ROARecommendationsStepProps {
  state:    ROAState;
  onChange: <K extends keyof ROAState>(key: K, value: ROAState[K]) => void;
  onNext:   () => void;
  onBack:   () => void;
}

const AREAS: AdviceArea[]              = ["retirement", "protection", "estate", "investment"];
const PRIORITIES: RecommendationPriority[] = ["immediate", "short_term", "long_term"];

function nextId() { return `rec_${Math.random().toString(36).slice(2, 9)}`; }

export function ROARecommendationsStep({ state, onChange, onNext, onBack }: ROARecommendationsStepProps) {
  const [editId, setEditId] = useState<string | null>(null);

  function update(id: string, field: keyof ROARecommendation, value: unknown) {
    onChange(
      "recommendations",
      state.recommendations.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function remove(id: string) {
    onChange("recommendations", state.recommendations.filter((r) => r.id !== id));
    if (editId === id) setEditId(null);
  }

  function addNew() {
    const newRec: ROARecommendation = {
      id:       nextId(),
      area:     "retirement",
      action:   "",
      priority: "short_term",
      notes:    "",
    };
    onChange("recommendations", [...state.recommendations, newRec]);
    setEditId(newRec.id);
  }

  const canProceed = state.recommendations.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Recommendations ({state.recommendations.length})
          </h2>
          <button
            type="button"
            onClick={addNew}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            + Add
          </button>
        </div>

        {state.recommendations.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            No recommendations yet — add one or go back to review advice items.
          </div>
        )}

        {state.recommendations.map((rec) => (
          <div key={rec.id} className="px-5 py-4 space-y-3">
            {editId === rec.id ? (
              /* Edit mode */
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Area</label>
                    <select value={rec.area} onChange={(e) => update(rec.id, "area", e.target.value as AdviceArea)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none">
                      {AREAS.map((a) => <option key={a} value={a}>{getAreaLabel(a)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Priority</label>
                    <select value={rec.priority} onChange={(e) => update(rec.id, "priority", e.target.value as RecommendationPriority)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none">
                      {PRIORITIES.map((p) => <option key={p} value={p}>{getPriorityLabel(p)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Action / recommendation</label>
                  <input type="text" value={rec.action} onChange={(e) => update(rec.id, "action", e.target.value)}
                    placeholder="Describe the specific action recommended..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Est. monthly cost (R)</label>
                  <input type="number" value={rec.estimatedMonthlyCost ?? ""}
                    onChange={(e) => update(rec.id, "estimatedMonthlyCost", e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Notes</label>
                  <input type="text" value={rec.notes} onChange={(e) => update(rec.id, "notes", e.target.value)}
                    placeholder="Optional notes..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditId(null)}
                    className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                    Done
                  </button>
                  <button type="button" onClick={() => remove(rec.id)}
                    className="rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* Display mode */
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">{getAreaLabel(rec.area)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityBadge(rec.priority)}`}>
                      {getPriorityLabel(rec.priority)}
                    </span>
                    {rec.estimatedMonthlyCost && (
                      <span className="text-xs text-slate-400">
                        R{rec.estimatedMonthlyCost.toLocaleString()}/mo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-800">
                    {rec.action || <span className="italic text-slate-400">No action entered</span>}
                  </p>
                  {rec.notes && <p className="mt-0.5 text-xs text-slate-400">{rec.notes}</p>}
                </div>
                <button type="button" onClick={() => setEditId(rec.id)}
                  className="flex-shrink-0 text-xs text-slate-400 underline-offset-2 hover:underline">
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          ← Back
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed}
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
          Preview ROA →
        </button>
      </div>
    </div>
  );
}

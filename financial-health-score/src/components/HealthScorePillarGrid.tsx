/**
 * HealthScorePillarGrid.tsx
 *
 * Six-pillar breakdown grid.
 * Each card shows: pillar name, score, bar, top gap/positive.
 *
 * Optional: expandable cards that show full positives, gaps + actions.
 */

import React, { useState } from "react";
import type { HealthScorePillar, HealthScoreResult } from "../types/healthScore.types";
import {
  getPillarScoreColor,
  getPillarBarColor,
  PILLAR_ICONS,
} from "../services/healthScoreHelpers";

export interface HealthScorePillarGridProps {
  result: HealthScoreResult;
  /** Open one of the planning tools when the user clicks a pillar CTA */
  onOpenPlanner?: (planner: "retirement" | "protection" | "estate" | "investment") => void;
}

const PILLAR_PLANNER_MAP: Partial<Record<string, "retirement" | "protection" | "estate" | "investment">> = {
  retirement: "retirement",
  protection: "protection",
  estate:     "estate",
  net_worth:  "investment",
};

export function HealthScorePillarGrid({
  result,
  onOpenPlanner,
}: HealthScorePillarGridProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Pillar breakdown
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.pillars.map((pillar) => (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            onOpenPlanner={onOpenPlanner}
          />
        ))}
      </div>
    </div>
  );
}

// ── Pillar card ─────────────────────────────────────────────────────────────

function PillarCard({
  pillar,
  onOpenPlanner,
}: {
  pillar:         HealthScorePillar;
  onOpenPlanner?: (p: "retirement" | "protection" | "estate" | "investment") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const scoreColor = getPillarScoreColor(pillar.score);
  const barColor   = getPillarBarColor(pillar.score);
  const plannerKey = PILLAR_PLANNER_MAP[pillar.id];
  const icon       = PILLAR_ICONS[pillar.id];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <p className="text-sm font-semibold text-slate-900">{pillar.label}</p>
        </div>
        <p className={`text-2xl font-bold ${scoreColor}`}>{pillar.score}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pillar.score}%` }}
          role="progressbar"
          aria-valuenow={pillar.score}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Weight label */}
      <p className="mt-1.5 text-xs text-slate-400">
        {Math.round(pillar.weight * 100)}% weight ·{" "}
        {pillar.dataComplete ? "data complete" : "partial data"}
      </p>

      {/* Summary: first gap or first positive */}
      {!expanded && (
        <p className="mt-3 text-xs leading-5 text-slate-600 line-clamp-2">
          {pillar.gaps.length > 0 ? `⚠ ${pillar.gaps[0] ?? ""}` : (pillar.positives[0] ?? "")}
        </p>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {pillar.positives.length > 0 && (
            <div>
              <p className="text-xs font-medium text-emerald-700">What's working</p>
              <ul className="mt-1 space-y-1">
                {pillar.positives.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="mt-1 flex-shrink-0 h-1 w-1 rounded-full bg-emerald-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pillar.gaps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-700">Gaps</p>
              <ul className="mt-1 space-y-1">
                {pillar.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="mt-1 flex-shrink-0 h-1 w-1 rounded-full bg-red-400" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pillar.actionItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-amber-700">Actions</p>
              <ol className="mt-1 space-y-1">
                {pillar.actionItems.map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                    <span className="flex-shrink-0 text-xs font-bold text-amber-600">
                      {i + 1}.
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v: boolean) => !v)}
          className="text-xs text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline transition"
        >
          {expanded ? "Show less" : "Show detail"}
        </button>

        {plannerKey && onOpenPlanner && expanded && (
          <button
            type="button"
            onClick={() => onOpenPlanner(plannerKey)}
            className="rounded-xl border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Open planner →
          </button>
        )}
      </div>
    </div>
  );
}

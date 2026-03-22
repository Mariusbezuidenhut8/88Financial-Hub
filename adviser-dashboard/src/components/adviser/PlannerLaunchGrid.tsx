/**
 * PlannerLaunchGrid.tsx
 *
 * 4-card grid — one card per planning tool.
 * Shows status badge and a prominent "Open" CTA.
 */

import React from "react";
import type { PlannerKey, PlannerCardConfig, PlannerStatus, PlannerStatuses } from "../../types/adviserDashboard.types";

// ── Static metadata ─────────────────────────────────────────────────────────

const PLANNER_CARDS: PlannerCardConfig[] = [
  {
    key:         "retirement",
    label:       "Retirement Architect",
    description: "Project the retirement nest egg, model contribution strategies and identify the funding gap.",
    icon:        "🏦",
    ctaLabel:    "Open Retirement Planner",
  },
  {
    key:         "protection",
    label:       "Protection Planner",
    description: "Calculate life cover, income protection and dread disease needs against existing policies.",
    icon:        "🛡",
    ctaLabel:    "Open Protection Planner",
  },
  {
    key:         "estate",
    label:       "Estate Architect",
    description: "Estimate executor fees, estate duty, liquidity shortfall and check will & guardian status.",
    icon:        "📋",
    ctaLabel:    "Open Estate Planner",
  },
  {
    key:         "investment",
    label:       "Investment Planner",
    description: "Find the most tax-efficient wrapper for the monthly savings surplus.",
    icon:        "📈",
    ctaLabel:    "Open Investment Planner",
  },
];

// ── Status helpers ───────────────────────────────────────────────────────────

function statusBadge(status: PlannerStatus) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
          Completed
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          In progress
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
          Not started
        </span>
      );
  }
}

function ctaStyle(status: PlannerStatus): string {
  if (status === "completed")
    return "rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50";
  if (status === "in_progress")
    return "rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-amber-700";
  return "rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800";
}

function ctaText(card: PlannerCardConfig, status: PlannerStatus): string {
  if (status === "completed")   return "Review →";
  if (status === "in_progress") return "Continue →";
  return card.ctaLabel;
}

// ── Component ────────────────────────────────────────────────────────────────

export interface PlannerLaunchGridProps {
  statuses?:    PlannerStatuses;
  onOpenPlanner: (planner: PlannerKey) => void;
}

export function PlannerLaunchGrid({ statuses = {}, onOpenPlanner }: PlannerLaunchGridProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Planning tools
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLANNER_CARDS.map((card) => {
          const status: PlannerStatus = statuses[card.key] ?? "not_started";
          return (
            <div
              key={card.key}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl">{card.icon}</span>
                  {statusBadge(status)}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">{card.label}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">{card.description}</p>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onOpenPlanner(card.key)}
                  className={ctaStyle(status)}
                >
                  {ctaText(card, status)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

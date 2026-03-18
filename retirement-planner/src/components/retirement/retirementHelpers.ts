/**
 * retirementHelpers.ts
 *
 * Pure display helpers for the Retirement Planner UI.
 */

import type { RetirementReadinessStatus } from "../../types/retirement-planner.types";

// ── Readiness label ─────────────────────────────────────────────────────────

export interface ReadinessConfig {
  label:     string;
  sublabel:  string;
  heroBg:    string;
  heroText:  string;
  badgeBg:   string;
  badgeText: string;
}

const READINESS_CONFIG: Record<RetirementReadinessStatus, ReadinessConfig> = {
  ahead: {
    label:     "On track — surplus",
    sublabel:  "Your projected income exceeds your target.",
    heroBg:    "bg-emerald-900",
    heroText:  "text-emerald-100",
    badgeBg:   "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  on_track: {
    label:     "Broadly on track",
    sublabel:  "Your projected income is close to your target.",
    heroBg:    "bg-slate-900",
    heroText:  "text-slate-100",
    badgeBg:   "bg-slate-100",
    badgeText: "text-slate-800",
  },
  behind: {
    label:     "Behind — gap to close",
    sublabel:  "Your projected income falls short of your target.",
    heroBg:    "bg-orange-900",
    heroText:  "text-orange-100",
    badgeBg:   "bg-orange-100",
    badgeText: "text-orange-800",
  },
  unknown: {
    label:     "Projection pending",
    sublabel:  "Complete all steps to see your projection.",
    heroBg:    "bg-slate-700",
    heroText:  "text-slate-200",
    badgeBg:   "bg-slate-100",
    badgeText: "text-slate-600",
  },
};

export function getReadinessLabel(status: RetirementReadinessStatus): string {
  return READINESS_CONFIG[status].label;
}

export function getReadinessConfig(status: RetirementReadinessStatus): ReadinessConfig {
  return READINESS_CONFIG[status];
}

// ── Currency formatting ─────────────────────────────────────────────────────

export function fmtCurrency(value: number | undefined, prefix = "R"): string {
  if (value === undefined || value === null) return "—";
  return `${prefix}${Math.round(value).toLocaleString("en-ZA")}`;
}

export function fmtPercent(value: number | undefined): string {
  if (value === undefined || value === null) return "—";
  return `${value}%`;
}

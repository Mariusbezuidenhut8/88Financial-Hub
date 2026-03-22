/**
 * estateHelpers.ts
 *
 * Display helpers for the Estate Planner wizard.
 */

import type {
  EstateReadinessStatus,
  EstatePlanningUrgency,
} from "../../types/estatePlanner.types";

// ── Currency formatter ─────────────────────────────────────────────────────

export function fmtEstateCurrency(
  value: number | undefined,
  prefix = "R",
): string {
  if (value === undefined || value === null) return "—";
  return `${prefix}${value.toLocaleString("en-ZA")}`;
}

// ── Readiness status labels ────────────────────────────────────────────────

export interface ReadinessConfig {
  label:     string;
  heroBg:    string;
  heroText:  string;
  badgeBg:   string;
  badgeText: string;
}

const READINESS_CONFIG: Record<EstateReadinessStatus, ReadinessConfig> = {
  strong_foundation: {
    label:     "Strong Foundation",
    heroBg:    "bg-slate-900",
    heroText:  "text-white",
    badgeBg:   "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  developing: {
    label:     "Developing",
    heroBg:    "bg-slate-800",
    heroText:  "text-white",
    badgeBg:   "bg-blue-100",
    badgeText: "text-blue-800",
  },
  basic_gaps: {
    label:     "Basic Gaps",
    heroBg:    "bg-slate-700",
    heroText:  "text-white",
    badgeBg:   "bg-amber-100",
    badgeText: "text-amber-800",
  },
  urgent_attention: {
    label:     "Urgent Attention Required",
    heroBg:    "bg-red-900",
    heroText:  "text-white",
    badgeBg:   "bg-red-100",
    badgeText: "text-red-800",
  },
};

export function getReadinessConfig(status: EstateReadinessStatus): ReadinessConfig {
  return READINESS_CONFIG[status];
}

// ── Urgency labels ─────────────────────────────────────────────────────────

export function getUrgencyLabel(urgency: EstatePlanningUrgency): string {
  const labels: Record<EstatePlanningUrgency, string> = {
    low:      "Low — review in 3–5 years",
    moderate: "Moderate — act within 12 months",
    high:     "High — act within 3–6 months",
    critical: "Critical — act immediately",
  };
  return labels[urgency];
}

export function getUrgencyColor(urgency: EstatePlanningUrgency): string {
  const colors: Record<EstatePlanningUrgency, string> = {
    low:      "text-emerald-700",
    moderate: "text-amber-700",
    high:     "text-orange-700",
    critical: "text-red-700",
  };
  return colors[urgency];
}

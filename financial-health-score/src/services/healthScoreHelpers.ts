/**
 * healthScoreHelpers.ts
 *
 * Display helpers for Health Score components.
 */

import type { HealthScoreBand } from "@88fh/master-data-model";
import type { HealthScorePillarId } from "../types/healthScore.types";

// ── Band config ────────────────────────────────────────────────────────────

export interface BandConfig {
  label:      string;
  heroBg:     string;
  heroText:   string;
  ringColor:  string;   // for the score ring stroke
  badgeBg:    string;
  badgeText:  string;
  description: string;
}

const BAND_CONFIG: Record<HealthScoreBand, BandConfig> = {
  strong: {
    label:       "Strong",
    heroBg:      "bg-slate-900",
    heroText:    "text-white",
    ringColor:   "#10b981", // emerald-500
    badgeBg:     "bg-emerald-100",
    badgeText:   "text-emerald-800",
    description: "Your financial health is in excellent shape. Keep building on this foundation.",
  },
  good_foundation: {
    label:       "Good Foundation",
    heroBg:      "bg-slate-800",
    heroText:    "text-white",
    ringColor:   "#3b82f6", // blue-500
    badgeBg:     "bg-blue-100",
    badgeText:   "text-blue-800",
    description: "You have a solid base. Address the highlighted gaps to move into the strong range.",
  },
  needs_attention: {
    label:       "Needs Attention",
    heroBg:      "bg-slate-700",
    heroText:    "text-white",
    ringColor:   "#f59e0b", // amber-500
    badgeBg:     "bg-amber-100",
    badgeText:   "text-amber-800",
    description: "Several important areas need attention. Work through the action items below.",
  },
  financial_stress_risk: {
    label:       "Financial Stress Risk",
    heroBg:      "bg-orange-800",
    heroText:    "text-white",
    ringColor:   "#f97316", // orange-500
    badgeBg:     "bg-orange-100",
    badgeText:   "text-orange-800",
    description: "Your financial health has significant stress points. Prioritise the critical actions immediately.",
  },
  urgent_action_needed: {
    label:       "Urgent Action Needed",
    heroBg:      "bg-red-900",
    heroText:    "text-white",
    ringColor:   "#ef4444", // red-500
    badgeBg:     "bg-red-100",
    badgeText:   "text-red-800",
    description: "Your financial position requires urgent attention. Start with the top action items now.",
  },
};

export function getBandConfig(band: HealthScoreBand): BandConfig {
  return BAND_CONFIG[band];
}

// ── Pillar icons (Tailwind-compatible emoji/symbol strings) ────────────────

export const PILLAR_ICONS: Record<HealthScorePillarId, string> = {
  cash_flow:  "💰",
  protection: "🛡",
  retirement: "🏦",
  estate:     "📋",
  net_worth:  "📈",
  goals:      "🎯",
};

// ── Pillar score colour ────────────────────────────────────────────────────

export function getPillarScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 65) return "text-blue-600";
  if (score >= 50) return "text-amber-600";
  if (score >= 35) return "text-orange-600";
  return "text-red-600";
}

export function getPillarBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-blue-500";
  if (score >= 50) return "bg-amber-500";
  if (score >= 35) return "bg-orange-500";
  return "bg-red-500";
}

// ── Score ring SVG path helper ─────────────────────────────────────────────

/**
 * Returns strokeDasharray and strokeDashoffset values for a circular
 * score ring SVG (circumference = 2π × r).
 *
 * @param score  0–100
 * @param radius circle radius in px (default 54 → circumference ≈ 339)
 */
export function scoreRingProps(score: number, radius = 54): {
  circumference: number;
  dashOffset:    number;
} {
  const circumference = 2 * Math.PI * radius;
  const dashOffset    = circumference - (score / 100) * circumference;
  return { circumference, dashOffset };
}

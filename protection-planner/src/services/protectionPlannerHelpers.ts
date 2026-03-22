/**
 * protectionPlannerHelpers.ts
 *
 * Display helpers for the Protection Planner.
 */

import type {
  ProtectionGapSeverity,
  ProtectionReadinessStatus,
  ProtectionPlanningUrgency,
  ProtectionNeedType,
  IncomeProtectionBenefitPeriod,
} from "../types/protectionPlanner.types";

// ── Currency formatter ─────────────────────────────────────────────────────

export function fmtProtectionCurrency(
  value: number | undefined,
  prefix = "R",
): string {
  if (value === undefined || value === null) return "—";
  return `${prefix}${value.toLocaleString("en-ZA")}`;
}

export function fmtMonthly(value: number | undefined): string {
  if (value === undefined) return "—";
  return `R${value.toLocaleString("en-ZA")}/month`;
}

// ── Severity config ────────────────────────────────────────────────────────

export interface SeverityConfig {
  label:     string;
  dotColor:  string;
  badgeBg:   string;
  badgeText: string;
}

const SEVERITY_CONFIG: Record<ProtectionGapSeverity, SeverityConfig> = {
  none: {
    label:     "Covered",
    dotColor:  "bg-emerald-400",
    badgeBg:   "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  minor: {
    label:     "Minor gap",
    dotColor:  "bg-blue-400",
    badgeBg:   "bg-blue-100",
    badgeText: "text-blue-800",
  },
  moderate: {
    label:     "Moderate gap",
    dotColor:  "bg-amber-400",
    badgeBg:   "bg-amber-100",
    badgeText: "text-amber-800",
  },
  significant: {
    label:     "Significant gap",
    dotColor:  "bg-orange-400",
    badgeBg:   "bg-orange-100",
    badgeText: "text-orange-800",
  },
  critical: {
    label:     "Critical gap",
    dotColor:  "bg-red-500",
    badgeBg:   "bg-red-100",
    badgeText: "text-red-800",
  },
};

export function getSeverityConfig(severity: ProtectionGapSeverity): SeverityConfig {
  return SEVERITY_CONFIG[severity];
}

// ── Readiness config ───────────────────────────────────────────────────────

export interface ReadinessConfig {
  label:     string;
  heroBg:    string;
  heroText:  string;
}

const READINESS_CONFIG: Record<ProtectionReadinessStatus, ReadinessConfig> = {
  well_covered: {
    label:    "Well Covered",
    heroBg:   "bg-slate-900",
    heroText: "text-white",
  },
  partially_covered: {
    label:    "Partially Covered",
    heroBg:   "bg-slate-800",
    heroText: "text-white",
  },
  significant_gaps: {
    label:    "Significant Gaps",
    heroBg:   "bg-orange-800",
    heroText: "text-white",
  },
  critically_underinsured: {
    label:    "Critically Underinsured",
    heroBg:   "bg-red-900",
    heroText: "text-white",
  },
};

export function getReadinessConfig(status: ProtectionReadinessStatus): ReadinessConfig {
  return READINESS_CONFIG[status];
}

// ── Urgency ────────────────────────────────────────────────────────────────

export function getUrgencyLabel(urgency: ProtectionPlanningUrgency): string {
  const labels: Record<ProtectionPlanningUrgency, string> = {
    low:      "Low — review in 12 months",
    moderate: "Moderate — act within 6 months",
    high:     "High — act within 3 months",
    critical: "Critical — act immediately",
  };
  return labels[urgency];
}

export function getUrgencyColor(urgency: ProtectionPlanningUrgency): string {
  const colors: Record<ProtectionPlanningUrgency, string> = {
    low:      "text-emerald-700",
    moderate: "text-amber-700",
    high:     "text-orange-700",
    critical: "text-red-700",
  };
  return colors[urgency];
}

// ── Need type labels ───────────────────────────────────────────────────────

export function getNeedTypeLabel(needType: ProtectionNeedType): string {
  const labels: Record<ProtectionNeedType, string> = {
    life_cover:         "Life Cover",
    income_protection:  "Income Protection",
    dread_disease:      "Dread Disease / Severe Illness",
    debt_cover:         "Debt Cover",
  };
  return labels[needType];
}

export function getBenefitPeriodLabel(period: IncomeProtectionBenefitPeriod): string {
  const labels: Record<IncomeProtectionBenefitPeriod, string> = {
    "2_years":   "2 years",
    "5_years":   "5 years",
    "to_age_60": "To age 60",
    "to_age_65": "To age 65 (recommended)",
  };
  return labels[period];
}

import type { HealthScoreBand, AdviceCaseType } from "@88fh/master-data-model";

// ── Spec-aligned display types (used by DashboardPage + components) ────────

/** Tool status for the display layer. */
export type ToolStatus = "not_started" | "in_progress" | "completed";

/**
 * DashboardToolItem — display-oriented tool record for DashboardPage.
 * Mirrors NextStepRecommendation from @88fh/onboarding plus a status field.
 */
export interface DashboardToolItem {
  key: string;
  title: string;
  reason: string;
  priority: number;
  status: ToolStatus;
}

export interface DashboardActivityItem {
  id: string;
  title: string;
  date: string;
  status?: "completed" | "in_progress" | "pending";
}

export interface DashboardDocumentItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

// ── Tool identifiers ───────────────────────────────────────────────────────

export type DashboardToolId =
  | "funeral_cover_studio"
  | "retirement_architect"
  | "protection_planner"
  | "estate_architect"
  | "investment_planner";

export type DashboardToolStatus =
  | "available"   // can be started
  | "in_progress" // active advice case exists
  | "complete"    // tool output exists (advice case completed)
  | "locked";     // reserved for subscription / feature-flag gating

// ── Tool → AdviceCaseType mapping ─────────────────────────────────────────

export const TOOL_CASE_TYPE: Record<DashboardToolId, AdviceCaseType> = {
  funeral_cover_studio: "funeral_cover_planning",
  retirement_architect: "retirement_planning",
  protection_planner:   "protection_planning",
  estate_architect:     "estate_planning",
  investment_planner:   "investment_planning",
};

// ── Dashboard data bundle ──────────────────────────────────────────────────

export interface DashboardHealthScore {
  overallScore: number;
  band: HealthScoreBand;
  summary?: string;
  categoryScores: {
    cashFlow: number;
    debt: number;
    emergencyFund: number;
    protection: number;
    retirement: number;
  };
  calculatedAt: string;
}

export interface DashboardToolCard {
  toolId: DashboardToolId;
  label: string;
  tagline: string;
  status: DashboardToolStatus;
  /** Shown as an orange badge when true */
  isUrgent: boolean;
  /** Short urgency message e.g. "No funeral cover" */
  urgencyTag?: string;
}

export interface DashboardPageData {
  /** Client's first name for personalised greeting */
  firstName: string;

  /** Present after onboarding is complete */
  healthScore?: DashboardHealthScore;

  /**
   * 0–100: percentage of recommended profile fields populated.
   * Derived from ClientProfile.completionScore or calculated on the fly.
   */
  profileCompletionPct: number;

  /** The five planning tool cards */
  tools: DashboardToolCard[];

  /** True when at least one non-cancelled AdviceCase exists */
  hasActiveAdviceCase: boolean;
}

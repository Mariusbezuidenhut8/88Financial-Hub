/**
 * adviserDashboard.types.ts
 *
 * Display types for the Adviser Dashboard.
 */

// ── Planner keys ────────────────────────────────────────────────────────────

export type PlannerKey = "retirement" | "protection" | "estate" | "investment";

export type PlannerStatus = "not_started" | "in_progress" | "completed";

// ── Planner card config (static metadata) ──────────────────────────────────

export interface PlannerCardConfig {
  key:         PlannerKey;
  label:       string;
  description: string;
  icon:        string;
  ctaLabel:    string;
}

// ── Adviser dashboard page props ────────────────────────────────────────────

export interface PlannerStatuses {
  retirement?: PlannerStatus;
  protection?: PlannerStatus;
  estate?:     PlannerStatus;
  investment?: PlannerStatus;
}

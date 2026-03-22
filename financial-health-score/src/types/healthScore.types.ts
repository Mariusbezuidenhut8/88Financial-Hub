/**
 * healthScore.types.ts
 *
 * All types for the Financial Health Score engine.
 *
 * Six pillars, each scored 0–100, combined via weighted average
 * into a single overall score (0–100) with a HealthScoreBand.
 *
 * Pillar weights:
 *   cash_flow   20%
 *   protection  20%
 *   retirement  20%
 *   estate      20%
 *   net_worth   10%
 *   goals       10%
 */

// ── Re-export band from common types for convenience ──────────────────────
// (HealthScoreBand is defined in master-data-model/common.types.ts)
export type { HealthScoreBand } from "@88fh/master-data-model";

// ── Pillar identifiers ─────────────────────────────────────────────────────

export type HealthScorePillarId =
  | "cash_flow"
  | "protection"
  | "retirement"
  | "estate"
  | "net_worth"
  | "goals";

// ── Per-pillar result ──────────────────────────────────────────────────────

export interface HealthScorePillar {
  /** Pillar identifier */
  id:            HealthScorePillarId;
  /** Human-readable pillar name */
  label:         string;
  /** Raw score 0–100 for this pillar */
  score:         number;
  /** This pillar's weight in the overall score (0–1) */
  weight:        number;
  /** score × weight — contribution to overall */
  weightedScore: number;
  /** What is working well in this pillar */
  positives:     string[];
  /** Identified gaps */
  gaps:          string[];
  /** Specific action items */
  actionItems:   string[];
  /** Whether enough profile data existed to score this pillar accurately */
  dataComplete:  boolean;
}

// ── Full score result ──────────────────────────────────────────────────────

export interface HealthScoreResult {
  /** Overall score 0–100 (rounded to nearest integer) */
  overallScore:        number;
  /** Band classification */
  band:                import("@88fh/master-data-model").HealthScoreBand;
  /** All six pillar results */
  pillars:             HealthScorePillar[];
  /** Top 3 gaps surfaced across all pillars (highest priority first) */
  topGaps:             string[];
  /** Top 3 recommended actions */
  topActionItems:      string[];
  /** 0–100: how complete the profile is (affects score reliability) */
  profileCompleteness: number;
  /** ISO datetime this score was calculated */
  calculatedAt:        string;
}

// ── Pillar weights (exported so dashboard can display them) ────────────────

export const PILLAR_WEIGHTS: Record<HealthScorePillarId, number> = {
  cash_flow:  0.20,
  protection: 0.20,
  retirement: 0.20,
  estate:     0.20,
  net_worth:  0.10,
  goals:      0.10,
};

export const PILLAR_LABELS: Record<HealthScorePillarId, string> = {
  cash_flow:  "Cash Flow",
  protection: "Protection",
  retirement: "Retirement",
  estate:     "Estate",
  net_worth:  "Net Worth",
  goals:      "Goals",
};

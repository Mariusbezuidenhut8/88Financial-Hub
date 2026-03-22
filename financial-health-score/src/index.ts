/**
 * @88fh/financial-health-score
 *
 * Financial Health Score engine + display components.
 * Reads directly from a ClientProfile — no wizard, no user input required.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type {
  HealthScorePillarId,
  HealthScorePillar,
  HealthScoreResult,
} from "./types/healthScore.types";

export { PILLAR_WEIGHTS } from "./types/healthScore.types";

// ── Engine ─────────────────────────────────────────────────────────────────

export { runHealthScore } from "./services/healthScoreEngine";

// ── Helpers ────────────────────────────────────────────────────────────────

export type { BandConfig } from "./services/healthScoreHelpers";

export {
  getBandConfig,
  getPillarScoreColor,
  getPillarBarColor,
  scoreRingProps,
  PILLAR_ICONS,
} from "./services/healthScoreHelpers";

// ── Components ─────────────────────────────────────────────────────────────

export { HealthScoreCard }       from "./components/HealthScoreCard";
export { HealthScorePillarGrid } from "./components/HealthScorePillarGrid";
export { HealthScoreBadge }      from "./components/HealthScoreBadge";

export type { HealthScoreCardProps }       from "./components/HealthScoreCard";
export type { HealthScorePillarGridProps } from "./components/HealthScorePillarGrid";
export type { HealthScoreBadgeProps }      from "./components/HealthScoreBadge";

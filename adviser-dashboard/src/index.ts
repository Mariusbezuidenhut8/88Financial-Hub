/**
 * @88fh/adviser-dashboard
 *
 * Central adviser hub for a single client.
 * Integrates @88fh/financial-health-score directly — no separate wizard.
 *
 * Typical usage:
 *   import { AdviserDashboardPage } from "@88fh/adviser-dashboard";
 *
 *   <AdviserDashboardPage
 *     clientProfile={profile}
 *     plannerStatuses={{ retirement: "in_progress" }}
 *     onOpenPlanner={(planner) => router.push(`/${planner}`)}
 *   />
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type {
  PlannerKey,
  PlannerStatus,
  PlannerCardConfig,
  PlannerStatuses,
} from "./types/adviserDashboard.types";

// ── Components ──────────────────────────────────────────────────────────────

export { AdviserDashboardPage } from "./components/adviser/AdviserDashboardPage";
export { ClientSummaryBar }    from "./components/adviser/ClientSummaryBar";
export { PlannerLaunchGrid }   from "./components/adviser/PlannerLaunchGrid";

export type { AdviserDashboardPageProps } from "./components/adviser/AdviserDashboardPage";
export type { ClientSummaryBarProps }     from "./components/adviser/ClientSummaryBar";
export type { PlannerLaunchGridProps }    from "./components/adviser/PlannerLaunchGrid";

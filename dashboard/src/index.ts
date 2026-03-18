// ── Types ──────────────────────────────────────────────────────────────────
export type {
  ToolStatus,
  DashboardToolItem,
  DashboardActivityItem,
  DashboardDocumentItem,
  // Internal builder types (for host apps that use buildDashboardData)
  DashboardToolId,
  DashboardToolStatus,
  DashboardToolCard,
  DashboardHealthScore,
  DashboardPageData,
} from "./types/dashboard.types";

export type {
  FinancialHealthBand,
  FinancialHealthCategoryScores,
  FinancialHealthScoreBreakdown,
  FinancialHealthScoreResult,
} from "./types/financialHealth.types";

// ── Service ────────────────────────────────────────────────────────────────
export { buildDashboardData } from "./services/dashboard-builder";

// ── Page ───────────────────────────────────────────────────────────────────
export { DashboardPage } from "./pages/DashboardPage";
export type { DashboardPageProps } from "./pages/DashboardPage";

// ── Components ─────────────────────────────────────────────────────────────
export { DashboardHeader }       from "./components/dashboard/DashboardHeader";
export { HealthSummaryCard }     from "./components/dashboard/HealthSummaryCard";
export { ActionPlanCard }        from "./components/dashboard/ActionPlanCard";
export { RecommendedToolsGrid }  from "./components/dashboard/RecommendedToolsGrid";
export { ToolStatusCard }        from "./components/dashboard/ToolStatusCard";
export { ProfileCompletionCard } from "./components/dashboard/ProfileCompletionCard";
export { RecentActivityCard }    from "./components/dashboard/RecentActivityCard";
export { DocumentsCard }         from "./components/dashboard/DocumentsCard";
export { DashboardHelpCard }     from "./components/dashboard/DashboardHelpCard";

// ── Helpers ────────────────────────────────────────────────────────────────
export {
  getBandLabel,
  formatDisplayDate,
  getToolStatusLabel,
  getActivityStatusLabel,
} from "./components/dashboard/dashboardHelpers";

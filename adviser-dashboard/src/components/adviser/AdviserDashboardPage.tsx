/**
 * AdviserDashboardPage.tsx
 *
 * Central adviser hub for a single client.
 *
 * Layout (top → bottom):
 *   1. ClientSummaryBar  — client facts at a glance
 *   2. HealthScoreCard   — hero score + top gaps + top actions
 *   3. HealthScorePillarGrid — 6-pillar breakdown
 *   4. PlannerLaunchGrid — 4 planner tiles
 *
 * The health score is computed live from the ClientProfile using runHealthScore().
 * No wizard, no user input required — pure display.
 *
 * Host app is responsible for page chrome (nav, sidebar, breadcrumbs).
 */

import React, { useMemo } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import {
  runHealthScore,
  HealthScoreCard,
  HealthScorePillarGrid,
} from "@88fh/financial-health-score";
import { ClientSummaryBar } from "./ClientSummaryBar";
import { PlannerLaunchGrid } from "./PlannerLaunchGrid";
import type { PlannerKey, PlannerStatuses } from "../../types/adviserDashboard.types";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Props ────────────────────────────────────────────────────────────────────

export interface AdviserDashboardPageProps {
  /** The client's full profile — health score is derived from this. */
  clientProfile: ClientProfile;

  /**
   * Optional status for each planner tool.
   * Drives the badge and CTA text on each planner card.
   */
  plannerStatuses?: PlannerStatuses;

  /**
   * Called when the adviser clicks "Open [Planner]" on any card
   * or when a pillar CTA is triggered from within the health score card.
   */
  onOpenPlanner: (planner: PlannerKey) => void;

  /** Called when the adviser clicks "Edit profile". */
  onEditProfile?: () => void;

  /** Called when the adviser clicks "Talk to client" or "Request adviser help". */
  onRequestAdvisorHelp?: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function AdviserDashboardPage({
  clientProfile,
  plannerStatuses,
  onOpenPlanner,
  onEditProfile,
  onRequestAdvisorHelp,
}: AdviserDashboardPageProps) {
  const result = useMemo(() => runHealthScore(clientProfile), [clientProfile]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* 1. Client summary */}
        <ClientSummaryBar
          profile={clientProfile}
          onEditProfile={onEditProfile}
        />

        {/* 2. Health score hero */}
        <HealthScoreCard
          result={result}
          onOpenPlanner={onOpenPlanner}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
        />

        {/* 3. Pillar breakdown */}
        <HealthScorePillarGrid
          result={result}
          onOpenPlanner={onOpenPlanner}
        />

        {/* 4. Planner launch grid */}
        <PlannerLaunchGrid
          statuses={plannerStatuses}
          onOpenPlanner={onOpenPlanner}
        />

      </div>
    </main>
  );
}

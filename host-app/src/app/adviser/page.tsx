"use client";

/**
 * /adviser — AdviserDashboardPage
 *
 * Central hub: live health score, 6-pillar breakdown, planner launch grid.
 * Runs runHealthScore() directly from the ClientProfile — no pre-computed data needed.
 */

import React from "react";
import { useRouter } from "next/navigation";
import { AdviserDashboardPage } from "@88fh/adviser-dashboard";
import { useClient } from "@/context/ClientContext";
import type { PlannerKey } from "@88fh/adviser-dashboard";

export default function AdviserPage() {
  const router = useRouter();
  const { record, plannerStatuses, updatePlannerStatus } = useClient();

  function handleOpenPlanner(planner: PlannerKey) {
    updatePlannerStatus(planner, "in_progress");
    router.push(`/${planner}`);
  }

  return (
    <AdviserDashboardPage
      clientProfile={record.clientProfile}
      plannerStatuses={plannerStatuses}
      onOpenPlanner={handleOpenPlanner}
      onEditProfile={() => router.push("/onboarding")}
      onRequestAdvisorHelp={() => alert("Adviser help — coming soon")}
    />
  );
}

"use client";

/**
 * /estate — EstatePlannerPage
 */

import React from "react";
import { useRouter } from "next/navigation";
import { EstatePlannerPage } from "@88fh/estate-planner";
import { useClient } from "@/context/ClientContext";

export default function EstatePage() {
  const router = useRouter();
  const { record, updatePlannerStatus } = useClient();

  return (
    <EstatePlannerPage
      clientProfile={record.clientProfile}
      onComplete={() => {
        updatePlannerStatus("estate", "completed");
        router.push("/adviser");
      }}
      onBackToDashboard={() => router.push("/adviser")}
      onRequestAdvisorHelp={() => alert("Adviser help — coming soon")}
      onOpenProtectionPlanner={() => router.push("/protection")}
    />
  );
}

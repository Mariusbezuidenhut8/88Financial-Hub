"use client";

/**
 * /investment — InvestmentPlannerPage
 */

import React from "react";
import { useRouter } from "next/navigation";
import { InvestmentPlannerPage } from "@88fh/investment-planner";
import { useClient } from "@/context/ClientContext";

export default function InvestmentPage() {
  const router = useRouter();
  const { record, updatePlannerStatus } = useClient();

  return (
    <InvestmentPlannerPage
      clientProfile={record.clientProfile}
      onComplete={() => {
        updatePlannerStatus("investment", "completed");
        router.push("/adviser");
      }}
      onBackToDashboard={() => router.push("/adviser")}
      onRequestAdvisorHelp={() => alert("Adviser help — coming soon")}
      onOpenRetirementPlanner={() => router.push("/retirement")}
    />
  );
}

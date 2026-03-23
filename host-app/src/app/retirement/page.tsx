"use client";

/**
 * /retirement — RetirementPlannerPage
 */

import React from "react";
import { useRouter } from "next/navigation";
import { RetirementPlannerPage } from "@88fh/retirement-planner";
import { useClient } from "@/context/ClientContext";

export default function RetirementPage() {
  const router = useRouter();
  const { record, updatePlannerStatus } = useClient();

  return (
    <RetirementPlannerPage
      clientProfile={record.clientProfile}
      onComplete={() => {
        updatePlannerStatus("retirement", "completed");
        router.push("/adviser");
      }}
      onGoToDashboard={() => router.push("/adviser")}
      onRequestAdvisor={() => router.push("/contact-adviser")}
    />
  );
}

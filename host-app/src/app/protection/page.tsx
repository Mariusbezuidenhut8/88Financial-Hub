"use client";

/**
 * /protection — ProtectionPlannerPage
 */

import React from "react";
import { useRouter } from "next/navigation";
import { ProtectionPlannerPage } from "@88fh/protection-planner";
import { useClient } from "@/context/ClientContext";

export default function ProtectionPage() {
  const router = useRouter();
  const { record, updatePlannerStatus } = useClient();

  return (
    <ProtectionPlannerPage
      clientProfile={record.clientProfile}
      onComplete={() => {
        updatePlannerStatus("protection", "completed");
        router.push("/adviser");
      }}
      onBackToDashboard={() => router.push("/adviser")}
      onRequestAdvisorHelp={() => alert("Adviser help — coming soon")}
      onOpenEstatePlanner={() => router.push("/estate")}
    />
  );
}

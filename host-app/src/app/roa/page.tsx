"use client";

/**
 * /roa — ROA Builder
 *
 * Passes the full PlatformRecord to the ROABuilderPage.
 * On completion, logs the result (replace with real save in production).
 */

import React from "react";
import { useRouter } from "next/navigation";
import { ROABuilderPage } from "@88fh/roa-builder";
import { useClient } from "@/context/ClientContext";
import type { ROAResult } from "@88fh/roa-builder";

export default function ROAPage() {
  const router = useRouter();
  const { record } = useClient();

  function handleComplete(result: ROAResult) {
    // In production: persist result to backend / generate PDF
    console.log("ROA completed:", result.referenceNo);
    // Stay on page — wizard shows the completion state with back button
  }

  return (
    <ROABuilderPage
      record={record}
      onComplete={handleComplete}
      onBackToDashboard={() => router.push("/adviser")}
    />
  );
}

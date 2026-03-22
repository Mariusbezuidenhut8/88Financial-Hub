/**
 * ROABuilderPage.tsx
 *
 * Page wrapper for the ROA Builder.
 * Host apps render this at /roa and provide a PlatformRecord + navigation callbacks.
 */

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { ROAWizard } from "../components/roa/ROAWizard";
import type { ROAResult } from "../types/roa.types";

export interface ROABuilderPageProps {
  record:             PlatformRecord;
  onComplete?:        (result: ROAResult) => void;
  onBackToDashboard?: () => void;
}

export function ROABuilderPage({ record, onComplete, onBackToDashboard }: ROABuilderPageProps) {
  return (
    <ROAWizard
      record={record}
      onComplete={onComplete}
      onBackToDashboard={onBackToDashboard}
    />
  );
}

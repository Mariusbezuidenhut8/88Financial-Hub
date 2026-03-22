/**
 * HealthScoreBadge.tsx
 *
 * Compact inline badge for use in tables, client lists, and sidebar summaries.
 * Shows: score number + band label in a coloured pill.
 */

import React from "react";
import type { HealthScoreBand } from "@88fh/master-data-model";
import { getBandConfig } from "../services/healthScoreHelpers";

export interface HealthScoreBadgeProps {
  score: number;
  band:  HealthScoreBand;
  /** "sm" renders a tighter pill, "md" (default) adds the band label */
  size?: "sm" | "md";
}

export function HealthScoreBadge({ score, band, size = "md" }: HealthScoreBadgeProps) {
  const config = getBandConfig(band);

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
      >
        {score}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
    >
      <span className="text-sm font-bold">{score}</span>
      <span className="opacity-70">{config.label}</span>
    </span>
  );
}

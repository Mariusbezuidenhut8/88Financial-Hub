import React from "react";
import type { FinancialHealthBand } from "../../types/financial-health.types";

const BAND_CONFIG: Record<FinancialHealthBand, { label: string; bg: string; text: string; border: string }> = {
  strong:                { label: "Strong",          bg: "bg-green-100",  text: "text-green-700",  border: "border-green-200"  },
  good_foundation:       { label: "Good Foundation", bg: "bg-blue-100",   text: "text-blue-700",   border: "border-blue-200"   },
  needs_attention:       { label: "Needs Attention", bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  financial_stress_risk: { label: "Stress Risk",     bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  urgent_action_needed:  { label: "Urgent Action",   bg: "bg-red-100",    text: "text-red-700",    border: "border-red-200"    },
};

interface ScoreBandBadgeProps {
  band: FinancialHealthBand;
  size?: "sm" | "md";
}

export default function ScoreBandBadge({ band, size = "md" }: ScoreBandBadgeProps) {
  const { label, bg, text, border } = BAND_CONFIG[band];
  const sizeClass = size === "sm"
    ? "text-xs px-2.5 py-0.5"
    : "text-sm px-3.5 py-1.5";

  return (
    <span className={`inline-block rounded-full font-semibold border ${sizeClass} ${bg} ${text} ${border}`}>
      {label}
    </span>
  );
}

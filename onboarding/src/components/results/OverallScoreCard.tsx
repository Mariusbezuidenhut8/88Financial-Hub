import React from "react";
import type { FinancialHealthBand } from "../../types/financial-health.types";
import ScoreBandBadge from "./ScoreBandBadge";

const BAND_CARD: Record<FinancialHealthBand, { bg: string; border: string; scoreText: string }> = {
  strong:                { bg: "bg-green-50",  border: "border-green-200",  scoreText: "text-green-600"  },
  good_foundation:       { bg: "bg-blue-50",   border: "border-blue-200",   scoreText: "text-blue-600"   },
  needs_attention:       { bg: "bg-yellow-50", border: "border-yellow-300", scoreText: "text-yellow-600" },
  financial_stress_risk: { bg: "bg-orange-50", border: "border-orange-300", scoreText: "text-orange-600" },
  urgent_action_needed:  { bg: "bg-red-50",    border: "border-red-300",    scoreText: "text-red-600"    },
};

interface OverallScoreCardProps {
  score: number;
  band: FinancialHealthBand;
  summary: string;
}

export default function OverallScoreCard({ score, band, summary }: OverallScoreCardProps) {
  const { bg, border, scoreText } = BAND_CARD[band];

  return (
    <div className={`rounded-2xl border ${border} ${bg} px-6 py-5 space-y-4`}>
      {/* Label */}
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        Financial Health Score
      </p>

      {/* Score + badge row */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-1.5 leading-none">
          <span className={`text-6xl font-bold tracking-tight ${scoreText}`}>{score}</span>
          <span className="text-xl text-gray-400 mb-1">/ 100</span>
        </div>
        <ScoreBandBadge band={band} />
      </div>

      {/* Progress bar */}
      <div className="bg-white/60 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${scoreText.replace("text-", "bg-")}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
    </div>
  );
}

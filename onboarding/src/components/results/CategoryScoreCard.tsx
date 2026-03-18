import React from "react";
import { getCategoryInterpretation } from "./resultsHelpers";

type CategoryTitle = "Cash Flow" | "Debt" | "Emergency Fund" | "Protection" | "Retirement";

interface CategoryScoreCardProps {
  title: CategoryTitle;
  score: number;
  maxScore?: number;
}

function barColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "bg-green-500";
  if (pct >= 0.6) return "bg-blue-500";
  if (pct >= 0.4) return "bg-yellow-400";
  return "bg-red-400";
}

function scoreColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.8) return "text-green-600";
  if (pct >= 0.6) return "text-blue-600";
  if (pct >= 0.4) return "text-yellow-600";
  return "text-red-500";
}

export default function CategoryScoreCard({
  title,
  score,
  maxScore = 20,
}: CategoryScoreCardProps) {
  const pct = (score / maxScore) * 100;
  const interpretation = getCategoryInterpretation(title, score);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 space-y-3">
      {/* Title + score */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <span className={`text-sm font-bold ${scoreColor(score, maxScore)}`}>
          {score}/{maxScore}
        </span>
      </div>

      {/* Bar */}
      <div className="bg-gray-100 rounded-full h-1.5">
        <div
          className={`${barColor(score, maxScore)} h-1.5 rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Interpretation */}
      <p className="text-xs text-gray-500 leading-snug">{interpretation}</p>
    </div>
  );
}

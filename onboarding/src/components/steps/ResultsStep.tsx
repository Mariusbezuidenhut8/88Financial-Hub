import React from "react";
import { RecommendedTool } from "../../types/onboarding-state.types";
import { HealthScoreResult } from "../../services/health-score-calculator";

interface ResultsStepProps {
  score: HealthScoreResult;
  recommendedTools: RecommendedTool[];
  firstName?: string;
  onComplete?: () => void;
}

const BAND_COLORS: Record<HealthScoreResult["band"], { bg: string; text: string; border: string }> = {
  strong: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  good_foundation: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  needs_attention: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  financial_stress_risk: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  urgent_action_needed: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const BAND_LABELS: Record<HealthScoreResult["band"], string> = {
  strong: "Strong",
  good_foundation: "Good Foundation",
  needs_attention: "Needs Attention",
  financial_stress_risk: "Stress Risk",
  urgent_action_needed: "Urgent Action",
};

const CATEGORY_LABELS = {
  cashFlow: "Cash Flow",
  debt: "Debt",
  emergencyFund: "Emergency Fund",
  protection: "Protection",
  retirement: "Retirement",
};

export default function ResultsStep({ score, recommendedTools, firstName, onComplete }: ResultsStepProps) {
  const colors = BAND_COLORS[score.band];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-gray-500 text-sm">
          {firstName ? `${firstName}'s` : "Your"} Financial Health Score
        </p>

        {/* Score dial */}
        <div className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${colors.border} ${colors.bg}`}>
          <span className={`text-4xl font-bold ${colors.text}`}>{score.overallScore}</span>
          <span className={`text-xs font-medium ${colors.text}`}>/ 100</span>
        </div>

        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
          {BAND_LABELS[score.band]}
        </div>

        <p className="text-gray-600 text-sm max-w-sm mx-auto">{score.summary}</p>
      </div>

      {/* Category scores */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Category breakdown</p>
        {Object.entries(score.categoryScores).map(([key, val]) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-28 flex-shrink-0">
              {CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS]}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(val / 20) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700 w-8 text-right">
              {val}/20
            </span>
          </div>
        ))}
      </div>

      {/* Priority actions */}
      {score.priorityActions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Top priorities</p>
          <ul className="space-y-2">
            {score.priorityActions.map((action, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended tools */}
      {recommendedTools.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Recommended next steps</p>
          <div className="space-y-2">
            {recommendedTools.map((tool) => (
              <button
                key={tool.toolId}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{tool.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.reason}</p>
                  </div>
                  {tool.isUrgent && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2">
                      Urgent
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3 pt-2">
        {onComplete && (
          <button
            onClick={onComplete}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to my dashboard
          </button>
        )}
        <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          Talk to an advisor
        </button>
      </div>
    </div>
  );
}

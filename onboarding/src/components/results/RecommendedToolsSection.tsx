import React from "react";
import type { NextStepRecommendation } from "../../types/onboarding-results.types";
import ToolRecommendationCard from "./ToolRecommendationCard";

interface RecommendedToolsSectionProps {
  recommendations: NextStepRecommendation[];
  onOpenTool: (key: string) => void;
}

export default function RecommendedToolsSection({
  recommendations,
  onOpenTool,
}: RecommendedToolsSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-2">
      {recommendations.map((tool, i) => (
        <ToolRecommendationCard
          key={tool.key}
          index={i + 1}
          title={tool.title}
          reason={tool.reason}
          onClick={() => onOpenTool(tool.key)}
        />
      ))}
    </div>
  );
}

import React from "react";
import type { DashboardToolCard } from "../types/dashboard.types";
import ToolStatusCard from "./ToolStatusCard";

interface RecommendedToolsGridProps {
  tools: DashboardToolCard[];
  onOpenTool?: (toolId: string) => void;
}

export default function RecommendedToolsGrid({ tools, onOpenTool }: RecommendedToolsGridProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Your Planning Tools</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolStatusCard
            key={tool.toolId}
            {...tool}
            onOpen={onOpenTool}
          />
        ))}
      </div>
    </div>
  );
}

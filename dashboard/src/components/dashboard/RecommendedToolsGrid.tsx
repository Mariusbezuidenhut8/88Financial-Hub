import React from "react";
import type { DashboardToolItem } from "../../types/dashboard.types";
import { ToolStatusCard } from "./ToolStatusCard";

interface RecommendedToolsGridProps {
  tools: DashboardToolItem[];
  onOpenTool: (toolKey: string) => void;
}

export const RecommendedToolsGrid: React.FC<RecommendedToolsGridProps> = ({
  tools,
  onOpenTool,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Recommended Tools</h2>
      <p className="mt-1 text-sm text-slate-600">
        Continue with the tools most relevant to your current financial picture.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {tools.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 lg:col-span-3">
            No tool recommendations are available yet.
          </div>
        ) : (
          tools.map((tool) => (
            <ToolStatusCard
              key={tool.key}
              title={tool.title}
              reason={tool.reason}
              status={tool.status}
              onClick={() => onOpenTool(tool.key)}
            />
          ))
        )}
      </div>
    </section>
  );
};

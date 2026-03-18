import React from "react";

interface PriorityAction {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface ActionPlanCardProps {
  actions: PriorityAction[];
  onViewAll?: () => void;
}

const CATEGORY_COLOURS: Record<string, string> = {
  "Cash Flow":     "bg-blue-100 text-blue-700",
  "Debt":          "bg-red-100 text-red-700",
  "Emergency Fund":"bg-yellow-100 text-yellow-700",
  "Protection":    "bg-purple-100 text-purple-700",
  "Retirement":    "bg-emerald-100 text-emerald-700",
};

export default function ActionPlanCard({ actions, onViewAll }: ActionPlanCardProps) {
  const top = actions.slice(0, 3);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">Priority Action Plan</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all
          </button>
        )}
      </div>

      {top.length === 0 ? (
        <p className="text-sm text-slate-400">No priority actions at this time. Great work!</p>
      ) : (
        <ol className="space-y-3">
          {top.map((action, i) => (
            <li key={action.id} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-900">{action.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLOURS[action.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {action.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{action.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

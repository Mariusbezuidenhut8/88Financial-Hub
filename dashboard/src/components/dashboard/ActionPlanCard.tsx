import React from "react";

interface ActionPlanCardProps {
  actions: string[];
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ actions }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Your Action Plan</h2>
      <p className="mt-1 text-sm text-slate-600">
        Focus on these next best steps to strengthen your financial position.
      </p>

      <div className="mt-4 space-y-3">
        {actions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No actions available yet.
          </div>
        ) : (
          actions.map((action, index) => (
            <div
              key={`${action}-${index}`}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-700">{action}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

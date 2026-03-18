import React from "react";

export interface DashboardActivityItem {
  id: string;
  title: string;
  date: string;
  status?: "completed" | "in_progress" | "pending";
}

interface RecentActivityCardProps {
  items: DashboardActivityItem[];
}

const STATUS_STYLES: Record<string, string> = {
  completed:   "bg-emerald-100 text-emerald-700",
  in_progress: "bg-blue-100 text-blue-700",
  pending:     "bg-slate-100 text-slate-500",
};

const STATUS_LABELS: Record<string, string> = {
  completed:   "Completed",
  in_progress: "In progress",
  pending:     "Pending",
};

export default function RecentActivityCard({ items }: RecentActivityCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h2>

      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 px-4 py-8 text-center">
          <p className="text-sm text-slate-400">No recent activity yet.</p>
          <p className="text-xs text-slate-300 mt-1">
            Activity from your tools and advice sessions will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
              </div>
              {item.status && (
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[item.status] ?? STATUS_STYLES.pending}`}>
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

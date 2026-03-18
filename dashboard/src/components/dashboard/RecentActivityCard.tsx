import React from "react";
import type { DashboardActivityItem } from "../../types/dashboard.types";
import { formatDisplayDate, getActivityStatusLabel } from "./dashboardHelpers";

interface RecentActivityCardProps {
  activities: DashboardActivityItem[];
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
      <p className="mt-1 text-sm text-slate-600">
        Track the latest progress in your planning journey.
      </p>

      <div className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No activity recorded yet.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-600">{formatDisplayDate(activity.date)}</p>
              </div>
              {activity.status && (
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                  {getActivityStatusLabel(activity.status)}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};

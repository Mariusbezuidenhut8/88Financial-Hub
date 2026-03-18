import React from "react";

interface DashboardHeaderProps {
  firstName: string;
  lastUpdated?: string;
}

export default function DashboardHeader({ firstName, lastUpdated }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Your financial planning hub — everything in one place.
        </p>
      </div>
      {lastUpdated && (
        <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
          Last updated {lastUpdated}
        </p>
      )}
    </div>
  );
}

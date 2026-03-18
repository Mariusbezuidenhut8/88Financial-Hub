import React from "react";

interface DashboardHeaderProps {
  firstName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Your financial dashboard</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Welcome back, {firstName}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
        This is your planning home base. Review your score, continue with your
        next best tools, and keep building your financial picture over time.
      </p>
    </section>
  );
};

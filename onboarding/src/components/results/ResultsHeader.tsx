import React from "react";

interface ResultsHeaderProps {
  firstName: string;
}

export default function ResultsHeader({ firstName }: ResultsHeaderProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">Financial Health Check</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Your Financial Health Results
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
        Welcome, {firstName}. Here is a snapshot of your current financial position
        and the next steps that may help strengthen it.
      </p>
    </section>
  );
}

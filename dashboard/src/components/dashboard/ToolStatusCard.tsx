import React from "react";
import type { ToolStatus } from "../../types/dashboard.types";
import { getToolStatusLabel } from "./dashboardHelpers";

interface ToolStatusCardProps {
  title: string;
  reason: string;
  status: ToolStatus;
  onClick: () => void;
}

export const ToolStatusCard: React.FC<ToolStatusCardProps> = ({
  title,
  reason,
  status,
  onClick,
}) => {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
          {getToolStatusLabel(status)}
        </span>
      </div>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{reason}</p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        {status === "not_started" ? "Start tool" : status === "in_progress" ? "Continue" : "Review"}
      </button>
    </div>
  );
};

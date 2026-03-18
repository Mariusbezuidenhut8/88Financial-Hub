import React from "react";
import type { DashboardToolCard, DashboardToolStatus } from "../types/dashboard.types";

interface ToolStatusCardProps extends DashboardToolCard {
  onOpen?: (toolId: string) => void;
}

const STATUS_CONFIG: Record<DashboardToolStatus, { badge: string; label: string; cta: string }> = {
  available:   { badge: "bg-slate-100 text-slate-500",    label: "Available",    cta: "Get started" },
  in_progress: { badge: "bg-blue-100 text-blue-700",      label: "In progress",  cta: "Continue" },
  complete:    { badge: "bg-emerald-100 text-emerald-700",label: "Complete",      cta: "Review" },
  locked:      { badge: "bg-slate-100 text-slate-400",    label: "Coming soon",  cta: "Locked" },
};

export default function ToolStatusCard({
  toolId,
  label,
  tagline,
  status,
  isUrgent,
  urgencyTag,
  onOpen,
}: ToolStatusCardProps) {
  const config = STATUS_CONFIG[status];
  const isLocked = status === "locked";

  return (
    <div
      className={`relative rounded-2xl border-2 p-4 flex flex-col gap-3 transition-colors ${
        isUrgent
          ? "border-orange-300 bg-orange-50/40"
          : isLocked
          ? "border-slate-100 bg-slate-50 opacity-60"
          : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      {isUrgent && urgencyTag && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
          {urgencyTag}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{tagline}</p>
        </div>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.badge}`}>
          {config.label}
        </span>
      </div>

      <button
        onClick={() => !isLocked && onOpen?.(toolId)}
        disabled={isLocked}
        className={`w-full rounded-xl py-2 text-sm font-medium transition-colors ${
          isLocked
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : status === "complete"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {config.cta}
      </button>
    </div>
  );
}

import React from "react";

interface ToolRecommendationCardProps {
  title: string;
  reason: string;
  ctaLabel?: string;
  isUrgent?: boolean;
  index: number;
  onClick: () => void;
}

export default function ToolRecommendationCard({
  title,
  reason,
  ctaLabel = "Open tool",
  isUrgent = false,
  index,
  onClick,
}: ToolRecommendationCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 px-4 py-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index}
          </span>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        {isUrgent && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            Urgent
          </span>
        )}
      </div>

      {/* Reason */}
      <p className="text-xs text-gray-500 leading-snug pl-7">{reason}</p>

      {/* CTA */}
      <div className="pl-7">
        <button
          onClick={onClick}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          {ctaLabel}
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

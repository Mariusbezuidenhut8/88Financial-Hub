import React from "react";

interface HelpOptionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  /** Optional icon — renders a coloured circle with the icon if provided */
  icon?: React.ReactNode;
  iconBg?: string;
}

export default function HelpOptionCard({
  title,
  description,
  onClick,
  icon,
  iconBg,
}: HelpOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 rounded-xl px-4 py-4 transition-colors group"
    >
      <div className="flex items-center gap-3">
        {icon && iconBg && (
          <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
            {title}
          </p>
          <p className="text-xs text-gray-500 leading-snug mt-0.5">{description}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-blue-400 ml-auto flex-shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

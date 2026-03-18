import React from "react";

interface PriorityActionsCardProps {
  actions: string[];
}

export default function PriorityActionsCard({ actions }: PriorityActionsCardProps) {
  if (actions.length === 0) return null;

  return (
    <ul className="space-y-2">
      {actions.map((action, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3.5"
        >
          <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-gray-700 leading-snug">{action}</span>
        </li>
      ))}
    </ul>
  );
}

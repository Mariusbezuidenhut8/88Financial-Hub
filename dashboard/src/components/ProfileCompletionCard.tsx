import React from "react";

interface ProfileCompletionCardProps {
  percent: number;
  missingItems: string[];
  onUpdateProfile?: () => void;
}

export default function ProfileCompletionCard({
  percent,
  missingItems,
  onUpdateProfile,
}: ProfileCompletionCardProps) {
  const pct = Math.min(100, Math.max(0, percent));
  const isComplete = pct >= 100;

  const barColour =
    pct >= 80 ? "bg-emerald-500" :
    pct >= 50 ? "bg-blue-500" :
    pct >= 25 ? "bg-yellow-500" :
    "bg-red-500";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900">Profile Completion</h2>
        <span className="text-sm font-bold text-slate-700">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full transition-all ${barColour}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isComplete ? (
        <p className="mt-3 text-sm text-emerald-600 font-medium">Your profile is complete.</p>
      ) : (
        <>
          {missingItems.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {missingItems.slice(0, 4).map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
              {missingItems.length > 4 && (
                <li className="text-xs text-slate-400">+{missingItems.length - 4} more</li>
              )}
            </ul>
          )}
          {onUpdateProfile && (
            <button
              onClick={onUpdateProfile}
              className="mt-4 w-full rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Complete your profile
            </button>
          )}
        </>
      )}
    </div>
  );
}

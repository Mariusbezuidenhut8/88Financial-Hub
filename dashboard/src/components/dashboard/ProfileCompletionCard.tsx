import React from "react";

interface ProfileCompletionCardProps {
  completionPercent: number;
  missingItems: string[];
  onUpdateProfile: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  completionPercent,
  missingItems,
  onUpdateProfile,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Your Profile</h2>
      <p className="mt-1 text-sm text-slate-600">
        Complete more of your profile to improve your recommendations over time.
      </p>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">Completion</span>
          <span className="text-sm font-semibold text-slate-900">{completionPercent}%</span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">Missing items</h3>
        {missingItems.length === 0 ? (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Your core profile is complete.
          </div>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {missingItems.slice(0, 5).map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">
                • {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onUpdateProfile}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Update profile
      </button>
    </section>
  );
};

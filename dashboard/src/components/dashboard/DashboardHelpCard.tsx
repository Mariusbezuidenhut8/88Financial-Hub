import React from "react";

interface DashboardHelpCardProps {
  onContinueSelfService: () => void;
  onGuidedHelp: () => void;
  onAdvisorHelp: () => void;
}

export const DashboardHelpCard: React.FC<DashboardHelpCardProps> = ({
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Help & Support</h2>
      <p className="mt-1 text-sm text-slate-600">
        Choose the level of support that suits you best.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={onContinueSelfService}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
        >
          <div className="text-sm font-semibold text-slate-900">Continue on my own</div>
          <div className="mt-1 text-sm leading-6 text-slate-600">
            Explore tools and continue your planning independently.
          </div>
        </button>

        <button
          type="button"
          onClick={onGuidedHelp}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
        >
          <div className="text-sm font-semibold text-slate-900">Get guided help</div>
          <div className="mt-1 text-sm leading-6 text-slate-600">
            Receive structured support without moving straight into a full advice meeting.
          </div>
        </button>

        <button
          type="button"
          onClick={onAdvisorHelp}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
        >
          <div className="text-sm font-semibold text-slate-900">Talk to an advisor</div>
          <div className="mt-1 text-sm leading-6 text-slate-600">
            Speak to someone if your situation is more complex or you prefer personal support.
          </div>
        </button>
      </div>
    </section>
  );
};

import React from "react";

interface DashboardHelpCardProps {
  onContinueSelfService?: () => void;
  onGuidedHelp?: () => void;
  onAdvisorHelp?: () => void;
}

interface HelpOption {
  title: string;
  description: string;
  onClick?: () => void;
}

function HelpRow({ title, description, onClick }: HelpOption) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40 px-4 py-3 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
          {title}
        </p>
        <p className="text-xs text-slate-500 leading-snug mt-0.5">{description}</p>
      </div>
      <svg
        className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0 transition-colors"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

export default function DashboardHelpCard({
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}: DashboardHelpCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-1">Need support?</h2>
      <p className="text-xs text-slate-500 mb-4">Choose the path that suits you best.</p>

      <div className="space-y-2">
        <HelpRow
          title="Continue on my own"
          description="Explore your tools and recommended steps independently."
          onClick={onContinueSelfService}
        />
        <HelpRow
          title="Get guided help"
          description="Step-by-step support without a full advice meeting."
          onClick={onGuidedHelp}
        />
        <HelpRow
          title="Talk to an advisor"
          description="Speak to someone if your situation is more complex."
          onClick={onAdvisorHelp}
        />
      </div>
    </div>
  );
}

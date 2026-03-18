import React from "react";

interface OnboardingPromptCardProps {
  firstName: string;
  onStartOnboarding?: () => void;
}

export default function OnboardingPromptCard({ firstName, onStartOnboarding }: OnboardingPromptCardProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 text-center">
      <p className="text-lg font-semibold text-slate-800">
        Hi {firstName}, let's get your financial picture in focus.
      </p>
      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Your Financial Health Score isn't ready yet. Complete the short onboarding questionnaire to
        see your score and get personalised recommendations.
      </p>
      <button
        onClick={onStartOnboarding}
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
      >
        Get my Financial Health Score
      </button>
    </div>
  );
}

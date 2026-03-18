import React from "react";
import HelpOptionCard from "./HelpOptionCard";

interface HelpPathSectionProps {
  shouldSuggestAdvisor?: boolean;
  complexityReasons?: string[];
  onContinueSelfService?: () => void;
  onGuidedHelp?: () => void;
  onAdvisorHelp?: () => void;
}

export default function HelpPathSection({
  shouldSuggestAdvisor = false,
  complexityReasons = [],
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}: HelpPathSectionProps) {
  return (
    <div className="space-y-2">
      {shouldSuggestAdvisor && complexityReasons.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">
            You may benefit from speaking with an adviser.
          </p>
          <ul className="mt-1.5 space-y-1">
            {complexityReasons.slice(0, 3).map((reason) => (
              <li key={reason} className="text-sm text-amber-800">• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      <HelpOptionCard
        title="Continue on my own"
        description="Explore your recommended tools independently."
        onClick={onContinueSelfService}
      />

      <HelpOptionCard
        title="Get guided help"
        description="Get step-by-step support without jumping straight into a full advice meeting."
        onClick={onGuidedHelp}
      />

      <HelpOptionCard
        title="Talk to an advisor"
        description="Speak to someone if your situation is more complex or you would prefer personal guidance."
        onClick={onAdvisorHelp}
      />
    </div>
  );
}

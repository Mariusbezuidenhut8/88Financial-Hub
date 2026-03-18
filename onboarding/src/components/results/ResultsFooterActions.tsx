import React from "react";

interface ResultsFooterActionsProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
}

export default function ResultsFooterActions({
  primaryLabel,
  onPrimaryClick,
  onSecondaryClick,
}: ResultsFooterActionsProps) {
  return (
    <div className="space-y-3 pt-2 pb-4">
      <button
        onClick={onPrimaryClick}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        {primaryLabel}
      </button>

      {onSecondaryClick && (
        <button
          onClick={onSecondaryClick}
          className="w-full py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Go to my dashboard
        </button>
      )}

      <p className="text-xs text-gray-400 text-center leading-relaxed pt-1">
        This score is based on the information you provided and is intended as a guide.
        It does not constitute financial advice.
      </p>
    </div>
  );
}

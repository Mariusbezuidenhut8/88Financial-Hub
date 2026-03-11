import React from "react";

interface StepLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLastDataStep?: boolean;
}

export default function StepLayout({
  title,
  description,
  children,
  onNext,
  onBack,
  nextLabel = "Continue",
  nextDisabled = false,
  isLastDataStep = false,
}: StepLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Step header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-gray-500 text-sm">{description}</p>
        )}
      </div>

      {/* Step fields */}
      <div className="space-y-4">{children}</div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isLastDataStep ? "See My Results" : nextLabel}
        </button>
      </div>
    </div>
  );
}

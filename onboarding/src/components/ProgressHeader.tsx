import React from "react";
import { OnboardingStep } from "../types/onboarding-state.types";
import { DATA_ENTRY_STEPS, getStepIndex, ONBOARDING_STEPS } from "../types/onboarding-steps.types";

interface ProgressHeaderProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export default function ProgressHeader({ currentStep, completedSteps }: ProgressHeaderProps) {
  const currentIndex = getStepIndex(currentStep);
  const totalSteps = DATA_ENTRY_STEPS.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalSteps) * 100);
  const stepConfig = ONBOARDING_STEPS.find((s) => s.id === currentStep);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-2xl mx-auto">
        {/* Step label */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-900">
            {stepConfig?.label}
          </span>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

import React from "react";
import { PrioritiesState, Priority } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import MultiSelectCards from "../inputs/MultiSelectCards";

interface PrioritiesStepProps {
  data: PrioritiesState;
  onChange: (data: PrioritiesState) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRIORITY_OPTIONS = [
  { value: "retire_comfortably", label: "Retire comfortably", icon: "🏖️" },
  { value: "protect_my_family", label: "Protect my family", icon: "🛡️" },
  { value: "reduce_debt", label: "Reduce my debt", icon: "📉" },
  { value: "build_emergency_fund", label: "Build emergency savings", icon: "🏦" },
  { value: "invest_better", label: "Invest smarter", icon: "📈" },
  { value: "plan_my_estate", label: "Sort out my estate", icon: "📋" },
  { value: "fund_education", label: "Fund education", icon: "🎓" },
  { value: "prepare_funeral_cover", label: "Funeral cover", icon: "🌿" },
  { value: "improve_cash_flow", label: "Improve cash flow", icon: "💵" },
  { value: "get_medical_cover", label: "Get medical cover", icon: "🏥" },
];

const TIMING_OPTIONS = [
  { value: "exploring" as const, label: "Just exploring", description: "Not in a rush" },
  { value: "soon" as const, label: "Want help soon", description: "Next few weeks" },
  { value: "ready_now" as const, label: "Ready to act", description: "Let's go" },
];

export default function PrioritiesStep({ data, onChange, onNext, onBack }: PrioritiesStepProps) {
  const update = (key: keyof PrioritiesState, value: unknown) =>
    onChange({ ...data, [key]: value });

  const canContinue =
    (data.selectedPriorities?.length ?? 0) > 0 && data.helpTiming !== undefined;

  return (
    <StepLayout
      title="Priorities"
      description="What matters most to you right now?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canContinue}
      isLastDataStep
    >
      <MultiSelectCards
        label="Choose up to 3 priorities"
        options={PRIORITY_OPTIONS}
        selected={data.selectedPriorities ?? []}
        onChange={(v) => update("selectedPriorities", v as Priority[])}
        maxSelections={3}
        helperText="Pick up to 3"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          When would you like help with these?
        </p>
        <div className="flex gap-2">
          {TIMING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("helpTiming", opt.value)}
              className={`flex-1 py-3 px-2 rounded-xl border-2 text-left transition-colors ${
                data.helpTiming === opt.value
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`text-sm font-medium ${data.helpTiming === opt.value ? "text-blue-700" : "text-gray-700"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-400">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
}

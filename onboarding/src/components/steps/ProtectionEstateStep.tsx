import React from "react";
import { ProtectionEstateState } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import YesNoQuestion from "../inputs/YesNoQuestion";
import CurrencyInput from "../inputs/CurrencyInput";

interface ProtectionEstateStepProps {
  data: ProtectionEstateState;
  onChange: (data: ProtectionEstateState) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ProtectionEstateStep({ data, onChange, onNext, onBack }: ProtectionEstateStepProps) {
  const update = (key: keyof ProtectionEstateState, value: unknown) =>
    onChange({ ...data, [key]: value });

  return (
    <StepLayout
      title="Protection & Estate"
      description="Just yes or no for now — we'll get the details later."
      onNext={onNext}
      onBack={onBack}
    >
      <YesNoQuestion
        label="Do you currently have life cover?"
        value={data.hasLifeCover}
        onChange={(v) => {
          update("hasLifeCover", v);
          if (!v) update("lifeCoverAmountEstimate", undefined);
        }}
      />
      {data.hasLifeCover && (
        <CurrencyInput
          label="Approximately how much cover?"
          value={data.lifeCoverAmountEstimate}
          onChange={(v) => update("lifeCoverAmountEstimate", v)}
          helperText="Rough estimate is fine"
        />
      )}

      <YesNoQuestion
        label="Do you have funeral cover?"
        value={data.hasFuneralCover}
        onChange={(v) => {
          update("hasFuneralCover", v);
          if (!v) update("funeralCoverAmountEstimate", undefined);
        }}
      />
      {data.hasFuneralCover && (
        <CurrencyInput
          label="Approximately how much funeral cover?"
          value={data.funeralCoverAmountEstimate}
          onChange={(v) => update("funeralCoverAmountEstimate", v)}
        />
      )}

      <YesNoQuestion
        label="Do you have disability or income protection cover?"
        value={data.hasDisabilityOrIncomeProtection}
        onChange={(v) => update("hasDisabilityOrIncomeProtection", v)}
        helperText="Covers you if you can't work due to illness or injury"
      />

      <YesNoQuestion
        label="Are you on a medical aid?"
        value={data.hasMedicalAid}
        onChange={(v) => update("hasMedicalAid", v)}
      />

      <YesNoQuestion
        label="Do you have a valid will?"
        value={data.hasWill}
        onChange={(v) => update("hasWill", v)}
        helperText="A will signed in the last few years that reflects your current wishes"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">
          Have you updated your beneficiary nominations recently?
        </p>
        <div className="flex gap-2">
          {[
            { value: "yes" as const, label: "Yes" },
            { value: "no" as const, label: "No" },
            { value: "not_sure" as const, label: "Not sure" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("beneficiaryNominationsUpdated", opt.value)}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                data.beneficiaryNominationsUpdated === opt.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </StepLayout>
  );
}

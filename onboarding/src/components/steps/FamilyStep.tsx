import React from "react";
import { FamilyState, MaritalStatus } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import YesNoQuestion from "../inputs/YesNoQuestion";

interface FamilyStepProps {
  data: FamilyState;
  onChange: (data: FamilyState) => void;
  onNext: () => void;
  onBack: () => void;
}

const MARITAL_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "life_partner", label: "Life partner" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
];

export default function FamilyStep({ data, onChange, onNext, onBack }: FamilyStepProps) {
  const update = (key: keyof FamilyState, value: unknown) =>
    onChange({ ...data, [key]: value });

  const canContinue = data.maritalStatus !== undefined && data.numberOfChildren !== undefined;

  return (
    <StepLayout
      title="Family & Dependants"
      description="Who depends on you financially?"
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      {/* Marital status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Relationship status <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MARITAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onChange({
                  ...data,
                  maritalStatus: opt.value,
                  hasSpouseOrPartner:
                    opt.value === "married" || opt.value === "life_partner",
                })
              }
              className={`py-3 px-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                data.maritalStatus === opt.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Children */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How many children do you have? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() =>
                onChange({
                  ...data,
                  numberOfChildren: n,
                  ...(n === 0 ? { hasMinorChildren: false } : {}),
                })
              }
              className={`w-12 h-12 rounded-xl border-2 font-medium transition-colors ${
                data.numberOfChildren === n
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {n === 5 ? "5+" : n}
            </button>
          ))}
        </div>
      </div>

      {/* Minor children */}
      {data.numberOfChildren !== undefined && data.numberOfChildren > 0 && (
        <YesNoQuestion
          label="Do any of your children depend on you financially?"
          value={data.hasMinorChildren}
          onChange={(v) => update("hasMinorChildren", v)}
        />
      )}

      {/* Parents */}
      <YesNoQuestion
        label="Do you financially support a parent or older relative?"
        value={data.parentsSupported !== undefined ? data.parentsSupported > 0 : undefined}
        onChange={(v) => update("parentsSupported", v ? 1 : 0)}
        helperText="E.g. paying for groceries, rent, or medical costs"
      />
    </StepLayout>
  );
}

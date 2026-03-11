import React from "react";
import { IncomeState, EmploymentStatus } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import CurrencyInput from "../inputs/CurrencyInput";
import YesNoQuestion from "../inputs/YesNoQuestion";

interface IncomeStepProps {
  data: IncomeState;
  onChange: (data: IncomeState) => void;
  onNext: () => void;
  onBack: () => void;
}

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self-employed" },
  { value: "business_owner", label: "Business owner" },
  { value: "contractor", label: "Contractor" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Not working" },
];

export default function IncomeStep({ data, onChange, onNext, onBack }: IncomeStepProps) {
  const update = (key: keyof IncomeState, value: unknown) =>
    onChange({ ...data, [key]: value });

  const [hasOtherIncome, setHasOtherIncome] = React.useState(
    (data.otherRegularMonthlyIncome ?? 0) > 0
  );

  const canContinue = !!(data.employmentStatus && data.monthlyNetIncome);

  return (
    <StepLayout
      title="Income"
      description="A rough estimate is perfectly fine."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      {/* Employment status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Employment status <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {EMPLOYMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("employmentStatus", opt.value)}
              className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                data.employmentStatus === opt.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly net income */}
      <CurrencyInput
        label="Monthly take-home income (after tax)"
        value={data.monthlyNetIncome}
        onChange={(v) => update("monthlyNetIncome", v)}
        helperText="What actually lands in your bank account each month"
        required
      />

      {/* Other income */}
      <YesNoQuestion
        label="Do you have any other regular income?"
        value={hasOtherIncome}
        onChange={(v) => {
          setHasOtherIncome(v);
          if (!v) update("otherRegularMonthlyIncome", undefined);
        }}
        helperText="E.g. rental income, business income, maintenance payments"
      />

      {hasOtherIncome && (
        <CurrencyInput
          label="Monthly amount (other income)"
          value={data.otherRegularMonthlyIncome}
          onChange={(v) => update("otherRegularMonthlyIncome", v)}
        />
      )}
    </StepLayout>
  );
}

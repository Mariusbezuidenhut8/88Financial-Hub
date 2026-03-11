import React from "react";
import { SpendingState } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import CurrencyInput from "../inputs/CurrencyInput";
import MultiSelectCards from "../inputs/MultiSelectCards";

interface SpendingStepProps {
  data: SpendingState;
  onChange: (data: SpendingState) => void;
  onNext: () => void;
  onBack: () => void;
}

const DEBT_OPTIONS = [
  { value: "home_loan", label: "Home loan", icon: "🏠" },
  { value: "vehicle_finance", label: "Vehicle finance", icon: "🚗" },
  { value: "credit_card", label: "Credit card", icon: "💳" },
  { value: "personal_loan", label: "Personal loan", icon: "🏦" },
  { value: "none", label: "No debt", icon: "✓" },
];

export default function SpendingStep({ data, onChange, onNext, onBack }: SpendingStepProps) {
  const update = (key: keyof SpendingState, value: unknown) =>
    onChange({ ...data, [key]: value });

  const canContinue = data.monthlyEssentialExpenses !== undefined;

  return (
    <StepLayout
      title="Spending & Debt"
      description="Estimates are fine — be honest with yourself."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      <CurrencyInput
        label="Monthly essential expenses"
        value={data.monthlyEssentialExpenses}
        onChange={(v) => update("monthlyEssentialExpenses", v)}
        helperText="Housing, food, transport, school fees, medical, utilities"
        required
      />

      <CurrencyInput
        label="Monthly lifestyle spending"
        value={data.monthlyLifestyleExpenses}
        onChange={(v) => update("monthlyLifestyleExpenses", v)}
        helperText="Eating out, entertainment, subscriptions, clothing"
      />

      <CurrencyInput
        label="Monthly debt repayments"
        value={data.monthlyDebtRepayments}
        onChange={(v) => update("monthlyDebtRepayments", v)}
        helperText="All loans, credit cards, store accounts combined"
      />

      <MultiSelectCards
        label="What types of debt do you have?"
        options={DEBT_OPTIONS}
        selected={data.debtTypes ?? []}
        onChange={(v) => {
          const types = v as SpendingState["debtTypes"];
          // If "none" selected, clear others
          const last = types?.[types.length - 1];
          if (last === "none") {
            update("debtTypes", ["none"]);
          } else {
            update("debtTypes", types?.filter((t) => t !== "none") ?? []);
          }
        }}
        helperText="Select all that apply"
      />
    </StepLayout>
  );
}

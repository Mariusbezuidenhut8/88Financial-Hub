import React from "react";
import { SavingsState } from "../../types/onboarding-state.types";
import StepLayout from "../StepLayout";
import CurrencyInput from "../inputs/CurrencyInput";
import YesNoQuestion from "../inputs/YesNoQuestion";

interface SavingsStepProps {
  data: SavingsState;
  onChange: (data: SavingsState) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SavingsStep({ data, onChange, onNext, onBack }: SavingsStepProps) {
  const update = (key: keyof SavingsState, value: unknown) =>
    onChange({ ...data, [key]: value });

  return (
    <StepLayout
      title="Savings & Investments"
      description="What have you built so far? Round numbers are fine."
      onNext={onNext}
      onBack={onBack}
    >
      <CurrencyInput
        label="Emergency savings (cash in bank)"
        value={data.emergencySavingsAmount}
        onChange={(v) => update("emergencySavingsAmount", v ?? 0)}
        helperText="Money you can access immediately if something goes wrong"
      />

      <CurrencyInput
        label="Total retirement savings"
        value={data.retirementSavingsTotal}
        onChange={(v) => update("retirementSavingsTotal", v ?? 0)}
        helperText="RA, pension fund, provident fund — combined total"
      />

      <CurrencyInput
        label="Monthly retirement contribution"
        value={data.monthlyRetirementContribution}
        onChange={(v) => update("monthlyRetirementContribution", v ?? 0)}
        helperText="What you put in every month (include employer contribution if you know it)"
      />

      <CurrencyInput
        label="Monthly savings / investments (other)"
        value={data.monthlySavings}
        onChange={(v) => update("monthlySavings", v ?? 0)}
        helperText="Unit trusts, TFSA, savings accounts — anything outside retirement"
      />

      <YesNoQuestion
        label="Do you have investments outside retirement funds?"
        value={data.hasNonRetirementInvestments}
        onChange={(v) => {
          update("hasNonRetirementInvestments", v);
          if (!v) update("nonRetirementInvestmentsTotal", undefined);
        }}
        helperText="E.g. unit trusts, TFSA, shares"
      />

      {data.hasNonRetirementInvestments && (
        <CurrencyInput
          label="Estimated total value"
          value={data.nonRetirementInvestmentsTotal}
          onChange={(v) => update("nonRetirementInvestmentsTotal", v)}
        />
      )}
    </StepLayout>
  );
}

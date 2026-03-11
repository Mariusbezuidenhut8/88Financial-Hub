// Types
export * from "./types/onboarding-state.types";
export * from "./types/onboarding-steps.types";

// Services
export { mapOnboardingToClientProfile, deriveAgeFromIdNumber, deriveDateOfBirthFromIdNumber } from "./services/onboarding-mapper";
export { calculateHealthScore } from "./services/health-score-calculator";
export type { HealthScoreResult } from "./services/health-score-calculator";
export { recommendTools } from "./services/recommendation-router";

// Components (React)
export { default as OnboardingWizard } from "./components/OnboardingWizard";
export { default as ProgressHeader } from "./components/ProgressHeader";
export { default as StepLayout } from "./components/StepLayout";
export { default as CurrencyInput } from "./components/inputs/CurrencyInput";
export { default as YesNoQuestion } from "./components/inputs/YesNoQuestion";
export { default as MultiSelectCards } from "./components/inputs/MultiSelectCards";

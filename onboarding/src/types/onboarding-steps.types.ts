import { OnboardingStep } from "./onboarding-state.types";

export interface StepConfig {
  id: OnboardingStep;
  /** Display label in progress bar */
  label: string;
  /** Short description shown under label */
  description: string;
  /** Estimated minutes to complete this step */
  estimatedMinutes: number;
  /** Can user skip this step? */
  skippable: boolean;
  /** Steps required before this step is available */
  requires?: OnboardingStep[];
}

export const ONBOARDING_STEPS: StepConfig[] = [
  {
    id: "welcome",
    label: "Welcome",
    description: "Get started",
    estimatedMinutes: 0,
    skippable: false,
  },
  {
    id: "about",
    label: "About You",
    description: "Basic details",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "family",
    label: "Family",
    description: "Who depends on you",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "income",
    label: "Income",
    description: "How you earn",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "spending",
    label: "Spending",
    description: "Monthly expenses & debt",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "savings",
    label: "Savings",
    description: "What you've built",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "protection_estate",
    label: "Protection",
    description: "Cover & planning",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "priorities",
    label: "Priorities",
    description: "What matters most",
    estimatedMinutes: 1,
    skippable: false,
  },
  {
    id: "results",
    label: "Your Results",
    description: "Health score & next steps",
    estimatedMinutes: 0,
    skippable: false,
  },
];

/** Steps that contain user-input fields (excludes welcome and results) */
export const DATA_ENTRY_STEPS: OnboardingStep[] = [
  "about",
  "family",
  "income",
  "spending",
  "savings",
  "protection_estate",
  "priorities",
];

/** Total number of steps shown in progress bar */
export const TOTAL_VISIBLE_STEPS = DATA_ENTRY_STEPS.length;

export function getStepIndex(step: OnboardingStep): number {
  return DATA_ENTRY_STEPS.indexOf(step);
}

export function getNextStep(current: OnboardingStep): OnboardingStep | null {
  const steps = ONBOARDING_STEPS.map((s) => s.id);
  const idx = steps.indexOf(current);
  return idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;
}

export function getPreviousStep(current: OnboardingStep): OnboardingStep | null {
  const steps = ONBOARDING_STEPS.map((s) => s.id);
  const idx = steps.indexOf(current);
  return idx > 0 ? steps[idx - 1] : null;
}

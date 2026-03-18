/**
 * retirementPlannerSteps.ts
 *
 * Single source of truth for wizard step metadata.
 * Imported by RetirementPlannerWizard and RetirementProgressHeader.
 */

export const RETIREMENT_PLANNER_STEPS = [
  { id: "overview",    label: "Overview",          shortLabel: "Overview"    },
  { id: "goals",       label: "Your Goals",         shortLabel: "Goals"       },
  { id: "position",    label: "Your Position",      shortLabel: "Position"    },
  { id: "assumptions", label: "Assumptions",        shortLabel: "Assumptions" },
  { id: "results",     label: "Your Projection",    shortLabel: "Projection"  },
  { id: "strategies",  label: "Strategy Options",   shortLabel: "Strategies"  },
  { id: "next",        label: "Next Step",          shortLabel: "Next"        },
] as const;

export type RetirementPlannerStepId = typeof RETIREMENT_PLANNER_STEPS[number]["id"];

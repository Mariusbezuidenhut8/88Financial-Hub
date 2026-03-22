/**
 * estatePlannerSteps.ts
 *
 * Single source of truth for wizard step metadata.
 * Imported by EstatePlannerWizard and EstateProgressHeader.
 */

export const estatePlannerSteps = [
  { key: "overview",  label: "Overview",          shortLabel: "Overview"  },
  { key: "family",    label: "Family & Documents", shortLabel: "Family"    },
  { key: "estate",    label: "Estate Value",       shortLabel: "Assets"    },
  { key: "liquidity", label: "Liquidity & Costs",  shortLabel: "Liquidity" },
  { key: "review",    label: "Review",             shortLabel: "Review"    },
  { key: "results",   label: "Results",            shortLabel: "Results"   },
  { key: "next",      label: "Next Steps",         shortLabel: "Next"      },
] as const;

export type EstatePlannerStepKey =
  (typeof estatePlannerSteps)[number]["key"];

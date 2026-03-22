/**
 * protectionPlannerSteps.ts
 *
 * Single source of truth for wizard step metadata.
 * Imported by ProtectionPlannerWizard and ProtectionProgressHeader.
 */

export const protectionPlannerSteps = [
  { key: "overview", label: "Overview",           shortLabel: "Overview"  },
  { key: "life",     label: "Life Cover",          shortLabel: "Life"      },
  { key: "income",   label: "Income Protection",   shortLabel: "Income"    },
  { key: "dread",    label: "Dread Disease",        shortLabel: "Dread"     },
  { key: "debt",     label: "Debt Cover",           shortLabel: "Debt"      },
  { key: "results",  label: "Gap Analysis",         shortLabel: "Results"   },
  { key: "next",     label: "Next Steps",           shortLabel: "Next"      },
] as const;

export type ProtectionPlannerStepKey =
  (typeof protectionPlannerSteps)[number]["key"];

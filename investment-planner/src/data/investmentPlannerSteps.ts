/**
 * investmentPlannerSteps.ts
 *
 * Single source of truth for wizard step metadata.
 * Imported by InvestmentPlannerWizard and InvestmentProgressHeader.
 */

export const investmentPlannerSteps = [
  { key: "overview",       label: "Overview",        shortLabel: "Overview"     },
  { key: "goal",           label: "Goal",             shortLabel: "Goal"         },
  { key: "horizon",        label: "Horizon",          shortLabel: "Horizon"      },
  { key: "tax",            label: "Tax & Funding",    shortLabel: "Funding"      },
  { key: "recommendation", label: "Recommendation",  shortLabel: "Recommend"    },
  { key: "strategy",       label: "Strategy",         shortLabel: "Strategy"     },
  { key: "next",           label: "Next Step",        shortLabel: "Next"         },
] as const;

export type InvestmentPlannerStepKey =
  (typeof investmentPlannerSteps)[number]["key"];

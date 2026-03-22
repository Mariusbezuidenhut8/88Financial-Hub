export const roaSteps = [
  { key: "client",          label: "Client & Meeting",   shortLabel: "Client"    },
  { key: "needs",           label: "Needs Analysis",     shortLabel: "Needs"     },
  { key: "advice",          label: "Advice Given",       shortLabel: "Advice"    },
  { key: "recommendations", label: "Recommendations",    shortLabel: "Actions"   },
  { key: "document",        label: "Preview ROA",        shortLabel: "Preview"   },
  { key: "declaration",     label: "Declaration",        shortLabel: "Declare"   },
] as const;

export type ROAStepKey = (typeof roaSteps)[number]["key"];

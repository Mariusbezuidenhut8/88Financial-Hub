import React from "react";
import RetirementWizard from "../components/wizard/RetirementWizard";
import type { RetirementProfilePrefill } from "../types/retirement-planner.types";

/**
 * DemoRetirementPlanner
 *
 * Mock demo with Thabo's profile prefilled.
 * Use this to visually test the wizard flow end-to-end.
 */

const mockPrefill: RetirementProfilePrefill = {
  currentAge:                    42,
  currentRetirementSavings:      850_000,
  monthlyRetirementContribution: 5_000,
  monthlyGrossIncome:            65_000,
};

export default function DemoRetirementPlanner() {
  return (
    <RetirementWizard
      prefill={mockPrefill}
      onComplete={(result) => {
        console.log("[DemoRetirementPlanner] Projection complete:", result);
      }}
      onGoToDashboard={() => console.log("[DemoRetirementPlanner] Go to dashboard")}
      onRequestAdvisor={() => console.log("[DemoRetirementPlanner] Request advisor")}
    />
  );
}

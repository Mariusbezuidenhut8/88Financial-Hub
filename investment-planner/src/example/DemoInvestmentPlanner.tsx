/**
 * DemoInvestmentPlanner.tsx
 *
 * Development demo — mounts InvestmentPlannerPage with a realistic mock
 * client profile so you can exercise the full 7-step wizard without a
 * live backend or PlatformRecord store.
 *
 * NOT for production use.
 */

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { InvestmentPlannerPage } from "../pages/InvestmentPlannerPage";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Mock profile ─────────────────────────────────────────────────────────

const mockClientProfile: ClientProfile = {
  // Identity
  identity: {
    clientId:    "cl_demo_001",
    firstName:   "Thabo",
    lastName:    "Nkosi",
    dateOfBirth: "1984-06-15",
    gender:      "male",
    idNumber:    "8406155001083",
  },
  contactDetails: {
    emailAddress: "thabo.nkosi@example.com",
    cellNumber:   "082 555 1234",
  },

  // Household
  household: {
    maritalStatus:              "married",
    numberOfDependants:         2,
    spouseOrPartner:            undefined,
    children:                   [],
    dependantAdults:            [],
  },

  // Cash flow — R45k gross, R35k net, R18k essential expenses
  cashFlow: {
    monthlyGrossIncome:           45_000,
    monthlyNetIncome:             35_000,
    monthlyExpenses:              18_000,
    monthlyRetirementContribution: 4_000,
  },

  // Retirement
  retirement: {
    targetRetirementAge:                   65,
    desiredMonthlyIncomeAtRetirement:      35_000,
    monthlyContribution:                   4_000,
    retirementReadinessStatus:             "behind",
  },

  // Assets — R50k in a savings account (emergency fund proxy)
  assets: {
    cashAndSavings: [
      {
        assetId:      "asset_001",
        description:  "Standard Bank savings account",
        currentValue: 50_000,
      },
    ],
    investments:    [],
    retirementAssets: [
      {
        assetId:      "asset_002",
        provider:     "Old Mutual",
        currentValue: 650_000,
      },
    ],
    properties:     [],
    vehicles:       [],
    other:          [],
  },

  // Goals
  goals: {
    goals: [
      {
        goalId:   "goal_001",
        goalName: "Retire comfortably",
        category: "retirement",
        status:   "in_progress",
      },
      {
        goalId:   "goal_002",
        goalName: "Build emergency fund",
        category: "emergency_reserve",
        status:   "in_progress",
      },
    ],
  },

  // Risk profile
  riskProfile: {
    riskTolerance: "balanced",
  },

  // Remaining sections required by the type (empty / minimal)
  protection:    { policies: [] },
  estate:        {},
  liabilities:   [],
} as unknown as ClientProfile;

// ── Demo component ────────────────────────────────────────────────────────

export default function DemoInvestmentPlanner() {
  const handleComplete = (result: unknown) => {
    console.log("[DemoInvestmentPlanner] Result:", result);
  };

  return (
    <InvestmentPlannerPage
      clientProfile={mockClientProfile}
      onBackToDashboard={()       => alert("← Back to dashboard")}
      onRequestAdvisorHelp={()    => alert("Adviser help requested")}
      onComplete={handleComplete as never}
      onOpenRetirementPlanner={() => alert("Open Retirement Planner")}
    />
  );
}

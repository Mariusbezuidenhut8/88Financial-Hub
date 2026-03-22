/**
 * DemoProtectionPlanner.tsx
 *
 * Development demo — mounts ProtectionPlannerPage with a realistic mock
 * client profile to exercise the full 7-step wizard without a live backend.
 *
 * Profile: Lerato Mokoena — married, 2 children, R55k gross, one life policy
 * (R800k — significantly underinsured), no income protection, no dread disease.
 *
 * Expected result: significant gaps across income protection + dread disease,
 * life cover gap of ~R6.5M, overall readiness = "critically_underinsured".
 *
 * NOT for production use.
 */

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { ProtectionPlannerPage } from "../pages/ProtectionPlannerPage";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Mock profile ───────────────────────────────────────────────────────────

const mockClientProfile: ClientProfile = {
  clientId:      "cl_demo_prot_001",
  profileStatus: "active",
  createdAt:     "2024-03-01T08:00:00.000Z",
  updatedAt:     "2026-03-01T10:00:00.000Z",

  identity: {
    firstName:    "Lerato",
    lastName:     "Mokoena",
    dateOfBirth:  "1987-04-18",       // age ~38 → ~27 years to retirement
    gender:       "female",
    idNumber:     "8704185001083",
    maritalStatus: "married",
  },

  contact: {
    emailAddress: "lerato.mokoena@example.com",
    mobileNumber: "071 222 3456",
  },

  household: {
    hasSpouseOrPartner: true,
    spouseOrPartner: {
      memberId:            "hm_001",
      relationship:        "spouse",
      firstName:           "Tebogo",
      financiallyDependent: false,
    },
    dependants: [
      {
        memberId:            "hm_002",
        relationship:        "child",
        firstName:           "Kamo",
        dateOfBirth:         "2017-08-20",  // ~8 years old
        financiallyDependent: true,
      },
      {
        memberId:            "hm_003",
        relationship:        "child",
        firstName:           "Siya",
        dateOfBirth:         "2020-01-15",  // ~5 years old
        financiallyDependent: true,
      },
    ],
    numberOfChildren:        2,
    numberOfDependentAdults: 0,
    parentsSupported:        1,  // supporting one parent
    extendedFamilySupported: 0,
    hasMinorChildren:        true,
  },

  employment: {
    employmentStatus:    "employed",
    employerName:        "First National Bank",
    sector:              "private",
    monthlyGrossIncome:  55_000,
    monthlyNetIncome:    38_000,
    hasGroupRiskBenefit: true,    // FNB group life — confirm exact amount
    hasGroupRetirementBenefit: true,
    selfEmployed:        false,
    otherIncomeSources:  [],
  },

  cashFlow: {
    monthlyExpenses:              28_000,
    monthlyRetirementContribution: 3_500,
  },

  assets: [
    {
      assetId:      "ast_001",
      assetType:    "property",
      description:  "Primary residence — Midrand",
      owner:        "joint",
      currentValue: 2_100_000,
      outstandingBond: 1_450_000,
    },
    {
      assetId:      "ast_002",
      assetType:    "savings_account",
      description:  "FNB savings account",
      owner:        "self",
      currentValue: 65_000,
      liquid:       true,
    },
    {
      assetId:      "ast_003",
      assetType:    "retirement_annuity",
      description:  "Momentum RA",
      owner:        "self",
      currentValue: 420_000,
      isRetirementAsset: true,
    },
  ],

  liabilities: [
    {
      liabilityId:      "lib_001",
      liabilityType:    "home_loan",
      description:      "FNB home loan — Midrand",
      outstandingBalance: 1_450_000,
      monthlyRepayment:   12_500,
      secured:          true,
    },
    {
      liabilityId:      "lib_002",
      liabilityType:    "vehicle_finance",
      description:      "VW Tiguan finance",
      outstandingBalance: 230_000,
      monthlyRepayment:   4_800,
      secured:          true,
    },
    {
      liabilityId:      "lib_003",
      liabilityType:    "personal_loan",
      description:      "FNB personal loan",
      outstandingBalance: 45_000,
      monthlyRepayment:   1_500,
      secured:          false,
    },
  ],

  // Only one life policy — significantly underinsured
  protection: [
    {
      policyId:            "pol_001",
      policyType:          "life_cover",
      provider:            "Liberty",
      owner:               "self",
      livesCovered:        ["self"],
      coverAmount:         800_000,   // much lower than the ~R9.5M need
      monthlyPremium:      650,
      status:              "active",
      beneficiaryNominated: true,
    },
    // No income protection, no severe illness, no credit life
  ],

  retirement: {
    targetRetirementAge:              65,
    desiredMonthlyIncomeAtRetirement: 35_000,
    monthlyContribution:              3_500,
  },

  estate: {
    hasWill:             false,
    nominatedGuardian:   false,
    executorChosen:      false,
    beneficiariesReviewed: false,
  },

  goals: [],
} as unknown as ClientProfile;

// ── Demo component ─────────────────────────────────────────────────────────

export default function DemoProtectionPlanner() {
  const handleComplete = (result: unknown) => {
    console.log("[DemoProtectionPlanner] Result:", result);
  };

  return (
    <ProtectionPlannerPage
      clientProfile={mockClientProfile}
      onBackToDashboard={()         => alert("← Back to dashboard")}
      onRequestAdvisorHelp={()      => alert("Adviser help requested")}
      onComplete={handleComplete as never}
      onOpenEstatePlanner={()       => alert("Open Estate Planner")}
    />
  );
}

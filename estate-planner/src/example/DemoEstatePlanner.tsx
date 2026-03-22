/**
 * DemoEstatePlanner.tsx
 *
 * Development demo — mounts EstatePlannerPage with a realistic mock client
 * profile so you can exercise the full 7-step wizard without a live backend.
 *
 * Profile: Sipho Dlamini — married, 2 minor children, R3.2M property,
 *          R850k retirement assets (excluded from estate), R200k cash,
 *          R1.5M life cover, R450k vehicle loan + bond outstanding.
 *
 * NOT for production use.
 */

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { EstatePlannerPage } from "../pages/EstatePlannerPage";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Mock profile ──────────────────────────────────────────────────────────

const mockClientProfile: ClientProfile = {
  clientId:      "cl_demo_estate_001",
  profileStatus: "active",
  createdAt:     "2024-01-15T08:00:00.000Z",
  updatedAt:     "2026-03-01T10:30:00.000Z",

  identity: {
    firstName:   "Sipho",
    lastName:    "Dlamini",
    dateOfBirth: "1979-09-22",
    gender:      "male",
    idNumber:    "7909225001083",
    maritalStatus: "married",
  },

  contact: {
    emailAddress: "sipho.dlamini@example.com",
    mobileNumber: "083 444 5678",
  },

  household: {
    maritalStatus:   "married",
    spouseOrPartner: {
      firstName:   "Nomsa",
      lastName:    "Dlamini",
      dateOfBirth: "1981-03-14",
      employed:    true,
    },
    children: [
      { firstName: "Liam",  dateOfBirth: "2014-07-10" }, // ~11 years old
      { firstName: "Aya",   dateOfBirth: "2018-02-28" }, // ~7 years old
    ],
    dependantAdults: [],
  },

  employment: {
    employmentStatus: "employed",
    monthlyGrossIncome: 75_000,
    monthlyNetIncome:   52_000,
    employer: "Dlamini Engineering (Pty) Ltd",
  },

  cashFlow: {
    monthlyNetIncome:             52_000,
    monthlyGrossIncome:           75_000,
    monthlyExpenses:              38_000,
    monthlyRetirementContribution: 6_000,
  },

  // Flat asset array (master data model v3)
  assets: [
    {
      assetId:      "ast_001",
      assetType:    "property",
      description:  "Primary residence — Sandton",
      owner:        "joint",
      currentValue: 3_200_000,
      outstandingBond: 890_000,
    },
    {
      assetId:      "ast_002",
      assetType:    "retirement_annuity",
      description:  "Discovery RA",
      owner:        "self",
      currentValue: 850_000,
      isRetirementAsset: true,
    },
    {
      assetId:      "ast_003",
      assetType:    "savings_account",
      description:  "FNB savings account",
      owner:        "self",
      currentValue: 200_000,
      liquid:       true,
    },
    {
      assetId:      "ast_004",
      assetType:    "unit_trust",
      description:  "Allan Gray Balanced Fund",
      owner:        "self",
      currentValue: 320_000,
    },
  ],

  liabilities: [
    {
      liabilityId:      "lib_001",
      liabilityType:    "home_loan",
      description:      "FNB home loan — Sandton property",
      outstandingBalance: 890_000,
      monthlyRepayment:   9_200,
      secured:          true,
    },
    {
      liabilityId:      "lib_002",
      liabilityType:    "vehicle_finance",
      description:      "Toyota Land Cruiser finance",
      outstandingBalance: 320_000,
      monthlyRepayment:   6_100,
      secured:          true,
    },
  ],

  protection: [
    {
      policyId:           "pol_001",
      policyType:         "life_cover",
      provider:           "Sanlam",
      owner:              "self",
      livesCovered:       ["self"],
      coverAmount:        1_500_000,
      monthlyPremium:     1_850,
      status:             "active",
      beneficiaryNominated: true,
    },
  ],

  retirement: {
    targetRetirementAge:              62,
    desiredMonthlyIncomeAtRetirement: 45_000,
    monthlyContribution:              6_000,
  },

  // Estate profile — partially completed (no will yet)
  estate: {
    hasWill:             false,
    nominatedGuardian:   false,
    executorChosen:      false,
    beneficiariesReviewed: false,
    trustsInPlace:       false,
    businessSuccessionNeeds: false,
  },

  goals: [],
} as unknown as ClientProfile;

// ── Demo component ─────────────────────────────────────────────────────────

export default function DemoEstatePlanner() {
  const handleComplete = (result: unknown) => {
    console.log("[DemoEstatePlanner] Result:", result);
  };

  return (
    <EstatePlannerPage
      clientProfile={mockClientProfile}
      onBackToDashboard={()           => alert("← Back to dashboard")}
      onRequestAdvisorHelp={()        => alert("Adviser help requested")}
      onComplete={handleComplete as never}
      onOpenProtectionPlanner={()     => alert("Open Protection Planner")}
    />
  );
}

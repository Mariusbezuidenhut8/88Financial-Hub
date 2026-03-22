/**
 * mockRecord.ts
 *
 * Seed PlatformRecord used on first load (before onboarding completes).
 * Profile: Zanele Khumalo — realistic SA client, ~52 health score.
 *
 * Replace with real API/localStorage data in production.
 */

import type { PlatformRecord } from "@88fh/master-data-model";

export const MOCK_RECORD: PlatformRecord = {
  recordId:      "rec_demo_001",
  schemaVersion: 3,
  isArchived:    false,

  audit: {
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-03-01T08:00:00.000Z",
    createdBy: "system",
    updatedBy: "system",
  },

  clientProfile: {
    clientId:      "cl_demo_001",
    profileStatus: "active",
    createdAt:     "2026-01-15T08:00:00.000Z",
    updatedAt:     "2026-03-01T08:00:00.000Z",

    identity: {
      firstName:     "Zanele",
      lastName:      "Khumalo",
      dateOfBirth:   "1985-11-03",
      gender:        "female",
      idNumber:      "8511035001083",
      maritalStatus: "married",
    },

    contact: {
      emailAddress: "zanele.khumalo@example.com",
      mobileNumber: "079 333 4567",
    },

    household: {
      hasSpouseOrPartner: true,
      spouseOrPartner: {
        memberId:             "hm_001",
        relationship:         "spouse",
        firstName:            "Bongani",
        financiallyDependent: false,
      },
      dependants: [
        { memberId: "hm_002", relationship: "child", firstName: "Nia",  dateOfBirth: "2016-03-10", financiallyDependent: true },
        { memberId: "hm_003", relationship: "child", firstName: "Zaki", dateOfBirth: "2019-09-22", financiallyDependent: true },
      ],
      numberOfChildren:        2,
      numberOfDependentAdults: 0,
      parentsSupported:        0,
      extendedFamilySupported: 0,
      hasMinorChildren:        true,
    },

    employment: {
      employmentStatus:          "employed",
      employerName:              "Nedbank",
      sector:                    "private",
      monthlyGrossIncome:        48_000,
      monthlyNetIncome:          33_000,
      hasGroupRiskBenefit:       false,
      hasGroupRetirementBenefit: true,
      selfEmployed:              false,
      otherIncomeSources:        [],
    },

    cashFlow: {
      monthlyEssentialExpenses:      22_000,
      monthlyLifestyleExpenses:       5_000,
      monthlyDebtRepayments:          8_500,
      monthlySavings:                 1_500,
      monthlyRetirementContributions: 3_000,
      monthlyInsurancePremiums:         900,
      hasEmergencyFund:               true,
      emergencyFundAmount:            45_000,
    },

    assets: [
      {
        assetId: "ast_001", assetType: "property",
        description: "Primary residence — Roodepoort",
        owner: "joint", currentValue: 1_800_000, outstandingBond: 1_100_000,
      },
      {
        assetId: "ast_002", assetType: "savings_account",
        description: "Emergency fund — Standard Bank",
        owner: "self", currentValue: 45_000, liquid: true,
      },
      {
        assetId: "ast_003", assetType: "retirement_annuity",
        description: "Nedbank RA", owner: "self",
        currentValue: 310_000, isRetirementAsset: true,
      },
      {
        assetId: "ast_004", assetType: "unit_trust",
        description: "Satrix 40 ETF", owner: "self", currentValue: 28_000,
      },
    ],

    liabilities: [
      {
        liabilityId: "lib_001", liabilityType: "home_loan",
        description: "Nedbank home loan", outstandingBalance: 1_100_000,
        monthlyRepayment: 6_500, secured: true,
      },
      {
        liabilityId: "lib_002", liabilityType: "vehicle_finance",
        description: "Kia Sportage", outstandingBalance: 180_000,
        monthlyRepayment: 2_000, secured: true,
      },
    ],

    protection: [
      {
        policyId: "pol_001", policyType: "life_cover",
        provider: "Discovery", owner: "self",
        livesCovered: ["self"], coverAmount: 1_200_000,
        monthlyPremium: 520, status: "active",
        beneficiaryNominated: true,
      },
    ],

    medicalAid: undefined,

    retirement: {
      targetRetirementAge:            65,
      desiredRetirementIncomeMonthly: 28_000,
      currentRetirementSavings:       310_000,
      monthlyRetirementContribution:    3_000,
      retirementReadinessStatus:      "slightly_behind",
      retirementVehicles:             [],
    },

    estate: {
      hasWill:               true,
      executorChosen:        true,
      beneficiariesReviewed: false,
      nominatedGuardian:     true,
      trustsInPlace:         false,
    },

    goals: [
      { goalId: "goal_001", goalName: "Retire comfortably",    category: "retirement",    status: "in_progress" },
      { goalId: "goal_002", goalName: "Pay off home loan early", category: "debt_reduction", status: "in_progress" },
    ],
  } as unknown as PlatformRecord["clientProfile"],

  toolOutputs: {
    financialHealthScore: undefined,
    retirementAnalysis:   undefined,
    protectionAnalysis:   undefined,
    estateAnalysis:       undefined,
    investmentAnalysis:   undefined,
  } as unknown as PlatformRecord["toolOutputs"],

  adviceCases:      [],
  documents:        [],
  auditEvents:      [],
  consentRecords:   [],
  disclosureRecords:[],
};

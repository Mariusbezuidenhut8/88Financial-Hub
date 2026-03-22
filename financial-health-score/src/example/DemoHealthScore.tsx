/**
 * DemoHealthScore.tsx
 *
 * Development demo — runs the health score engine against a realistic mock
 * profile and renders the HealthScoreCard + HealthScorePillarGrid.
 *
 * Profile: Zanele Khumalo — employed, married, 2 children, R48k gross,
 * moderate savings rate, no medical aid, no income protection, will in place.
 *
 * Expected result: ~52 (needs_attention) — protection and goals drag the score.
 *
 * NOT for production use.
 */

import React, { useMemo } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import { runHealthScore } from "../services/healthScoreEngine";
import { HealthScoreCard }        from "../components/HealthScoreCard";
import { HealthScorePillarGrid }  from "../components/HealthScorePillarGrid";
import { HealthScoreBadge }       from "../components/HealthScoreBadge";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Mock profile ───────────────────────────────────────────────────────────

const mockProfile: ClientProfile = {
  clientId:      "cl_demo_hs_001",
  profileStatus: "active",
  createdAt:     "2024-06-01T08:00:00.000Z",
  updatedAt:     "2026-03-01T08:00:00.000Z",

  identity: {
    firstName:    "Zanele",
    lastName:     "Khumalo",
    dateOfBirth:  "1985-11-03",   // ~40 → 25 years to retirement
    gender:       "female",
    idNumber:     "8511035001083",
    maritalStatus: "married",
  },

  contact: {
    emailAddress: "zanele.khumalo@example.com",
    mobileNumber: "079 333 4567",
  },

  household: {
    hasSpouseOrPartner:      true,
    spouseOrPartner: {
      memberId:            "hm_001",
      relationship:        "spouse",
      firstName:           "Bongani",
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
    employmentStatus:     "employed",
    employerName:         "Nedbank",
    sector:               "private",
    monthlyGrossIncome:   48_000,
    monthlyNetIncome:     33_000,
    hasGroupRiskBenefit:  false,
    hasGroupRetirementBenefit: true,
    selfEmployed:         false,
    otherIncomeSources:   [],
  },

  cashFlow: {
    monthlyEssentialExpenses:     22_000,
    monthlyLifestyleExpenses:      5_000,
    monthlyDebtRepayments:         8_500,   // bond + car = 26% of net
    monthlySavings:                1_500,
    monthlyRetirementContributions: 3_000,
    monthlyInsurancePremiums:        900,
    hasEmergencyFund:              true,
    emergencyFundAmount:           45_000,  // ~2 months of essential
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
    // No income protection, no severe illness, no medical aid
  ],

  medicalAid: undefined, // no medical aid — significant gap

  retirement: {
    targetRetirementAge:          65,
    desiredRetirementIncomeMonthly: 28_000,
    currentRetirementSavings:     310_000,
    monthlyRetirementContribution: 3_000,
    retirementReadinessStatus:    "slightly_behind",
    retirementVehicles: [],
  },

  estate: {
    hasWill:             true,
    executorChosen:      true,
    beneficiariesReviewed: false,   // not done — gap
    nominatedGuardian:   true,      // done for minor children
    trustsInPlace:       false,
  },

  goals: [
    {
      goalId: "goal_001", goalName: "Retire comfortably",
      category: "retirement", status: "in_progress",
    },
    {
      goalId: "goal_002", goalName: "Pay off home loan early",
      category: "debt_reduction", status: "in_progress",
    },
  ],
} as unknown as ClientProfile;

// ── Demo component ─────────────────────────────────────────────────────────

export default function DemoHealthScore() {
  const result = useMemo(() => runHealthScore(mockProfile), []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Fairbairn Consult
              </p>
              <h1 className="mt-0.5 text-lg font-bold text-slate-900">
                Financial Health Score — Demo
              </h1>
            </div>
            <HealthScoreBadge score={result.overallScore} band={result.band} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <HealthScoreCard
          result={result}
          onOpenPlanner={(p) => alert(`Open ${p} planner`)}
          onRequestAdvisorHelp={() => alert("Adviser help requested")}
        />
        <HealthScorePillarGrid
          result={result}
          onOpenPlanner={(p) => alert(`Open ${p} planner`)}
        />
      </main>
    </div>
  );
}

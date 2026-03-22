/**
 * protectionPlannerMapper.ts
 *
 * Three responsibilities:
 *
 * 1. mapClientProfileToProtectionPlanner(clientProfile)
 *    Reads a ClientProfile and returns a prefilled ProtectionPlannerState
 *    with mapping warnings.
 *
 * 2. toAnalysisInput(state, clientProfile)
 *    Resolves wizard state + profile into a fully typed ProtectionAnalysisInput.
 *
 * 3. runProtectionEngine(input)
 *    Orchestrates the needs engine and returns a complete result.
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  ProtectionPlannerMappingResult,
  ProtectionPlannerState,
  ProtectionAnalysisInput,
  ProtectionPlannerResult,
} from "../types/protectionPlanner.types";
import { protectionPlannerInitialState } from "../data/protectionPlannerInitialState";
import { runProtectionAnalysis } from "./protectionNeedsEngine";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

// ── Policy filter helpers ──────────────────────────────────────────────────

const LIFE_POLICY_TYPES   = new Set(["life_cover", "group_life"]);
const INCOME_POLICY_TYPES = new Set(["income_protection", "group_disability"]);
const DREAD_POLICY_TYPES  = new Set(["severe_illness"]);
const DEBT_POLICY_TYPES   = new Set(["credit_life"]);
const DISABILITY_LUMP_SUM = new Set(["disability_cover"]);

function sumActiveCover(
  protection: ClientProfile["protection"],
  typeSet: Set<string>,
): number {
  return protection
    .filter((p) => typeSet.has(p.policyType) && p.status === "active")
    .reduce((sum, p) => sum + (p.coverAmount ?? 0), 0);
}

// ── Age / years helpers ────────────────────────────────────────────────────

function calcAge(dateOfBirth: string): number {
  const dob    = new Date(dateOfBirth);
  const today  = new Date();
  let age      = today.getFullYear() - dob.getFullYear();
  const m      = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function calcYearsToRetirement(
  dateOfBirth: string | undefined,
  targetRetirementAge: number | undefined,
): number {
  if (!dateOfBirth) return 30; // fallback
  const age = calcAge(dateOfBirth);
  const retirementAge = targetRetirementAge ?? 65;
  return Math.max(1, retirementAge - age);
}

// ── Liability helpers ──────────────────────────────────────────────────────

function sumLiabilityTypes(
  liabilities: ClientProfile["liabilities"],
  types: string[],
): number {
  const typeSet = new Set(types);
  return liabilities
    .filter((l) => typeSet.has(l.liabilityType))
    .reduce((sum, l) => sum + (l.outstandingBalance ?? 0), 0);
}

// ── 1. Profile → wizard state ──────────────────────────────────────────────

export function mapClientProfileToProtectionPlanner(
  clientProfile: ClientProfile,
): ProtectionPlannerMappingResult {
  const warnings: string[] = [];
  const { employment, household, protection, liabilities, retirement, identity } = clientProfile;

  // ── Income
  const monthlyGrossIncome = employment.monthlyGrossIncome;
  const monthlyNetIncome   = employment.monthlyNetIncome;

  if (!monthlyGrossIncome) {
    warnings.push("Monthly gross income missing — income protection needs cannot be accurately calculated.");
  }
  if (!monthlyNetIncome) {
    warnings.push("Monthly net income missing — life cover income replacement may be understated.");
  }

  // ── Years to retirement
  const yearsToRetirement = calcYearsToRetirement(
    identity.dateOfBirth,
    retirement?.targetRetirementAge,
  );

  // ── Dependants
  const hasSpouseOrPartner = household.hasSpouseOrPartner;
  const numberOfChildren   = household.numberOfChildren;
  const numberOfDependants =
    (hasSpouseOrPartner ? 1 : 0) +
    numberOfChildren +
    household.numberOfDependentAdults +
    household.parentsSupported +
    household.extendedFamilySupported;

  if (numberOfDependants === 0) {
    warnings.push("No dependants recorded — life cover need will be lower. Update household details if this has changed.");
  }

  // ── Existing cover by pillar
  const totalExistingLifeCover              = sumActiveCover(protection, LIFE_POLICY_TYPES);
  const totalExistingMonthlyDisabilityBenefit = sumActiveCover(protection, INCOME_POLICY_TYPES);
  const totalExistingDreadDiseaseCover      = sumActiveCover(protection, DREAD_POLICY_TYPES) +
                                              sumActiveCover(protection, DISABILITY_LUMP_SUM);
  const totalCreditLifeCover               = sumActiveCover(protection, DEBT_POLICY_TYPES);
  const existingPoliciesCount              = protection.filter((p) => p.status === "active").length;
  const hasGroupRiskBenefit                = employment.hasGroupRiskBenefit ?? false;

  if (totalExistingLifeCover === 0) {
    warnings.push("No active life cover found — all life cover need will appear as a gap.");
  }
  if (totalExistingMonthlyDisabilityBenefit === 0) {
    warnings.push("No active income protection or disability cover found.");
  }

  // ── Outstanding debt
  const totalOutstandingDebt = liabilities.reduce(
    (sum, l) => sum + (l.outstandingBalance ?? 0),
    0,
  );

  // ── Default income protection benefit = 75% of gross
  const desiredMonthlyBenefit = monthlyGrossIncome
    ? Math.floor(monthlyGrossIncome * 0.75)
    : undefined;

  const protectionPlannerState: ProtectionPlannerState = {
    ...protectionPlannerInitialState,

    overview: {
      monthlyGrossIncome,
      monthlyNetIncome,
      yearsToRetirement,
      hasSpouseOrPartner,
      numberOfDependants,
      numberOfChildren,
      totalExistingLifeCover,
      totalExistingMonthlyDisabilityBenefit,
      totalExistingDreadDiseaseCover,
      totalCreditLifeCover,
      totalOutstandingDebt,
      existingPoliciesCount,
      hasGroupRiskBenefit,
    },

    life: {
      ...protectionPlannerInitialState.life,
      incomeReplacementYears: yearsToRetirement,
      includeEducationFund:   numberOfChildren > 0,
    },

    income: {
      ...protectionPlannerInitialState.income,
      desiredMonthlyBenefit,
      selfEmployed:
        employment.employmentStatus === "self_employed" ||
        employment.employmentStatus === "business_owner" ||
        (employment.selfEmployed ?? false),
    },
  };

  return { protectionPlannerState, mappingWarnings: warnings };
}

// ── 2. Wizard state → engine input ────────────────────────────────────────

export function toAnalysisInput(
  state: ProtectionPlannerState,
  clientProfile: ClientProfile,
): ProtectionAnalysisInput {
  const { overview, life, income, dread, debt } = state;
  const { liabilities } = clientProfile;

  const monthlyGrossIncome = overview.monthlyGrossIncome ?? 0;
  const monthlyNetIncome   = overview.monthlyNetIncome   ?? 0;
  const yearsToRetirement  = overview.yearsToRetirement  ?? 30;
  const numberOfChildren   = overview.numberOfChildren   ?? 0;

  // ── Life cover need inputs
  const incomeReplacementYears = life.incomeReplacementYears ?? yearsToRetirement;
  const educationFundPerChild  = life.educationFundPerChild  ?? 200_000;
  const additionalCapitalNeed  = life.additionalCapitalNeed  ?? 0;

  // ── Debt to cover (selected liability types)
  const debtToCover =
    (life.includeDebtInLifeNeed || debt.coverHomeLoan
      ? sumLiabilityTypes(liabilities, ["home_loan"])
      : 0) +
    (debt.coverVehicleFinance
      ? sumLiabilityTypes(liabilities, ["vehicle_finance"])
      : 0) +
    (debt.coverPersonalLoans
      ? sumLiabilityTypes(liabilities, ["personal_loan", "student_loan", "credit_card", "overdraft"])
      : 0) +
    (debt.coverOtherDebt
      ? sumLiabilityTypes(liabilities, ["business_loan", "tax_debt", "other"])
      : 0) +
    (debt.additionalDebtAmount ?? 0);

  // ── Desired income protection benefit (capped at 75% of gross)
  const maxBenefit = Math.floor(monthlyGrossIncome * 0.75);
  const desiredMonthlyBenefit = Math.min(
    income.desiredMonthlyBenefit ?? maxBenefit,
    maxBenefit,
  );

  // ── Dread disease lump sum
  const desiredDreadDiseaseLumpSum =
    dread.customLumpSumAmount ??
    monthlyGrossIncome * (dread.desiredLumpSumMonths ?? 18);

  return {
    monthlyGrossIncome,
    monthlyNetIncome,
    yearsToRetirement,

    hasSpouseOrPartner:  overview.hasSpouseOrPartner  ?? false,
    numberOfDependants:  overview.numberOfDependants  ?? 0,
    numberOfChildren,

    incomeReplacementYears,
    existingLifeCover:   overview.totalExistingLifeCover ?? 0,
    includeDebtInLifeNeed: life.includeDebtInLifeNeed ?? true,
    includeEducationFund:  life.includeEducationFund  ?? false,
    educationFundPerChild,
    additionalCapitalNeed,

    desiredMonthlyBenefit,
    existingMonthlyDisabilityBenefit: overview.totalExistingMonthlyDisabilityBenefit ?? 0,
    benefitPeriod:        income.benefitPeriod    ?? "to_age_65",
    waitingPeriodDays:    income.waitingPeriodDays ?? 30,

    wantsDreadDiseaseCover: dread.wantsDreadDiseaseCover ?? true,
    desiredDreadDiseaseLumpSum,
    existingDreadDiseaseCover: overview.totalExistingDreadDiseaseCover ?? 0,

    debtToCover,
    existingCreditLifeCover: overview.totalCreditLifeCover ?? 0,
    totalOutstandingDebt:    overview.totalOutstandingDebt ?? 0,

    hasGroupRiskBenefit: overview.hasGroupRiskBenefit ?? false,
  };
}

// ── 3. Full engine orchestration ───────────────────────────────────────────

export function runProtectionEngine(
  input: ProtectionAnalysisInput,
): ProtectionPlannerResult {
  const output = runProtectionAnalysis(input);
  return {
    calculatedAt: new Date().toISOString(),
    ...output,
  };
}

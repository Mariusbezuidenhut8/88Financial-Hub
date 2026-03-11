import { OnboardingState } from "../types/onboarding-state.types";

/**
 * onboardingMapper.ts
 *
 * Maps the simplified OnboardingState into the full ClientProfile structure
 * defined in the master data model.
 *
 * This is the critical bridge between the onboarding wizard and the platform.
 * Every onboarding field has exactly one destination in ClientProfile.
 *
 * Returns a plain object matching ClientProfile shape — import ClientProfile
 * type from master-data-model when integrating into the full platform.
 */

/** Derive age from SA ID number (first 6 digits = YYMMDD) */
export function deriveAgeFromIdNumber(idNumber: string): number | null {
  if (!idNumber || idNumber.length < 6) return null;
  const yearPart = parseInt(idNumber.substring(0, 2), 10);
  const monthPart = parseInt(idNumber.substring(2, 4), 10);
  const dayPart = parseInt(idNumber.substring(4, 6), 10);

  if (isNaN(yearPart) || isNaN(monthPart) || isNaN(dayPart)) return null;

  const currentYear = new Date().getFullYear();
  const century = yearPart <= currentYear % 100 ? 2000 : 1900;
  const birthYear = century + yearPart;
  const today = new Date();
  const birthDate = new Date(birthYear, monthPart - 1, dayPart);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

/** Derive ISO date string from SA ID number */
export function deriveDateOfBirthFromIdNumber(idNumber: string): string | null {
  if (!idNumber || idNumber.length < 6) return null;
  const yearPart = parseInt(idNumber.substring(0, 2), 10);
  const monthPart = idNumber.substring(2, 4);
  const dayPart = idNumber.substring(4, 6);
  if (isNaN(yearPart)) return null;
  const currentYear = new Date().getFullYear();
  const century = yearPart <= currentYear % 100 ? 2000 : 1900;
  const fullYear = century + yearPart;
  return `${fullYear}-${monthPart}-${dayPart}`;
}

/** Generate a simple client ID — replace with UUID or server ID in production */
function generateClientId(): string {
  return `cl_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * mapOnboardingToClientProfile
 *
 * Takes a completed OnboardingState and returns a ClientProfile object.
 * Safe to call with a partial OnboardingState — missing values become
 * undefined or empty arrays as appropriate.
 */
export function mapOnboardingToClientProfile(state: OnboardingState): Record<string, unknown> {
  const { about, family, income, spending, savings, protectionEstate } = state;

  // Derive age from ID if not provided
  const age =
    about.age ??
    (about.idNumber ? deriveAgeFromIdNumber(about.idNumber) ?? undefined : undefined);

  const dateOfBirth =
    about.dateOfBirth ??
    (about.idNumber ? deriveDateOfBirthFromIdNumber(about.idNumber) ?? undefined : undefined);

  const now = new Date().toISOString();

  // ── Identity ──────────────────────────────────────────────────
  const identity = {
    firstName: about.firstName ?? "",
    lastName: about.lastName ?? "",
    idNumber: about.idNumber,
    dateOfBirth,
    age,
    gender: about.gender,
    maritalStatus: family.maritalStatus ?? "unknown",
    preferredLanguage: about.preferredLanguage ?? "english",
    nationality: "South African",
  };

  // ── Contact ───────────────────────────────────────────────────
  const contact = {
    mobileNumber: about.mobileNumber,
    emailAddress: about.emailAddress,
    communicationPreference: "whatsapp" as const,
    physicalAddress: about.province
      ? { province: about.province, country: "South Africa" }
      : undefined,
  };

  // ── Household ─────────────────────────────────────────────────
  const dependants: Record<string, unknown>[] = [];

  if (family.numberOfChildren && family.numberOfChildren > 0) {
    for (let i = 0; i < family.numberOfChildren; i++) {
      dependants.push({
        memberId: `hm_child_${i + 1}`,
        relationship: "child",
        financiallyDependent: true,
      });
    }
  }

  if (family.parentsSupported && family.parentsSupported > 0) {
    for (let i = 0; i < family.parentsSupported; i++) {
      dependants.push({
        memberId: `hm_parent_${i + 1}`,
        relationship: "parent",
        financiallyDependent: true,
      });
    }
  }

  const household = {
    hasSpouseOrPartner: family.hasSpouseOrPartner ?? false,
    spouseOrPartner: family.hasSpouseOrPartner
      ? {
          memberId: "hm_spouse_01",
          relationship: "spouse",
          financiallyDependent: false,
        }
      : undefined,
    dependants,
    numberOfChildren: family.numberOfChildren ?? 0,
    numberOfDependentAdults: family.numberOfDependentAdults ?? 0,
    parentsSupported: family.parentsSupported ?? 0,
    extendedFamilySupported: family.extendedFamilySupported ?? 0,
    hasMinorChildren: family.hasMinorChildren ?? false,
    guardianshipNeeds: family.hasMinorChildren ?? false,
  };

  // ── Employment ────────────────────────────────────────────────
  const employment = {
    employmentStatus: income.employmentStatus ?? "unknown",
    occupation: income.occupation,
    selfEmployed:
      income.employmentStatus === "self_employed" ||
      income.employmentStatus === "business_owner",
    monthlyGrossIncome: income.monthlyGrossIncome,
    monthlyNetIncome: income.monthlyNetIncome,
    variableIncome: false,
    otherIncomeSources:
      income.otherRegularMonthlyIncome && income.otherRegularMonthlyIncome > 0
        ? [
            {
              sourceId: "os_001",
              type: "other" as const,
              description: "Other regular income",
              monthlyAmount: income.otherRegularMonthlyIncome,
              isVariable: false,
              owner: "self" as const,
            },
          ]
        : [],
  };

  // ── Cash flow ─────────────────────────────────────────────────
  const totalExpenses =
    (spending.monthlyEssentialExpenses ?? 0) +
    (spending.monthlyLifestyleExpenses ?? 0) +
    (spending.monthlyDebtRepayments ?? 0) +
    (savings.monthlySavings ?? 0) +
    (savings.monthlyRetirementContribution ?? 0);

  const disposableEstimate = income.monthlyNetIncome
    ? income.monthlyNetIncome - totalExpenses
    : undefined;

  const cashFlow = {
    monthlyEssentialExpenses: spending.monthlyEssentialExpenses,
    monthlyLifestyleExpenses: spending.monthlyLifestyleExpenses,
    monthlyDebtRepayments: spending.monthlyDebtRepayments,
    monthlySavings: savings.monthlySavings,
    monthlyRetirementContributions: savings.monthlyRetirementContribution,
    hasEmergencyFund:
      savings.emergencySavingsAmount !== undefined &&
      savings.emergencySavingsAmount > 0,
    emergencyFundAmount: savings.emergencySavingsAmount,
    disposableIncomeEstimate: disposableEstimate,
    debtToIncomeRatio:
      income.monthlyNetIncome && spending.monthlyDebtRepayments
        ? Math.round((spending.monthlyDebtRepayments / income.monthlyNetIncome) * 100 * 10) / 10
        : undefined,
    savingsRate:
      income.monthlyNetIncome &&
      (savings.monthlySavings || savings.monthlyRetirementContribution)
        ? Math.round(
            (((savings.monthlySavings ?? 0) + (savings.monthlyRetirementContribution ?? 0)) /
              income.monthlyNetIncome) *
              100 *
              10
          ) / 10
        : undefined,
    emergencyFundMonthsCovered:
      savings.emergencySavingsAmount && spending.monthlyEssentialExpenses
        ? Math.round((savings.emergencySavingsAmount / spending.monthlyEssentialExpenses) * 10) / 10
        : undefined,
  };

  // ── Assets ────────────────────────────────────────────────────
  const assets: Record<string, unknown>[] = [];

  if (savings.emergencySavingsAmount && savings.emergencySavingsAmount > 0) {
    assets.push({
      assetId: "as_emergency_01",
      assetType: "savings_account",
      description: "Emergency fund",
      owner: "self",
      currentValue: savings.emergencySavingsAmount,
      liquid: true,
    });
  }

  if (savings.nonRetirementInvestmentsTotal && savings.nonRetirementInvestmentsTotal > 0) {
    assets.push({
      assetId: "as_invest_01",
      assetType: "unit_trust",
      description: "Non-retirement investments",
      owner: "self",
      currentValue: savings.nonRetirementInvestmentsTotal,
      liquid: false,
      isRetirementAsset: false,
    });
  }

  if (savings.retirementSavingsTotal && savings.retirementSavingsTotal > 0) {
    assets.push({
      assetId: "as_ret_01",
      assetType: "retirement_annuity",
      description: "Retirement savings",
      owner: "self",
      currentValue: savings.retirementSavingsTotal,
      liquid: false,
      isRetirementAsset: true,
      monthlyContribution: savings.monthlyRetirementContribution,
    });
  }

  // ── Liabilities ───────────────────────────────────────────────
  const liabilities: Record<string, unknown>[] = [];

  if (spending.debtTypes && !spending.debtTypes.includes("none")) {
    spending.debtTypes.forEach((type, i) => {
      liabilities.push({
        liabilityId: `li_${i + 1}`,
        liabilityType: type,
        description: type.replace(/_/g, " "),
        monthlyRepayment: undefined, // captured in detail later
        secured: type === "home_loan" || type === "vehicle_finance",
        owner: "self",
      });
    });
  }

  // ── Protection ────────────────────────────────────────────────
  const protection: Record<string, unknown>[] = [];

  if (protectionEstate.hasLifeCover) {
    protection.push({
      policyId: "po_life_01",
      policyType: "life_cover",
      provider: "Unknown",
      owner: "self",
      livesCovered: ["self"],
      coverAmount: protectionEstate.lifeCoverAmountEstimate,
      status: "active",
    });
  }

  if (protectionEstate.hasFuneralCover) {
    protection.push({
      policyId: "po_funeral_01",
      policyType: "funeral_cover",
      provider: "Unknown",
      owner: "self",
      livesCovered: ["self"],
      coverAmount: protectionEstate.funeralCoverAmountEstimate,
      status: "active",
    });
  }

  if (protectionEstate.hasDisabilityOrIncomeProtection) {
    protection.push({
      policyId: "po_disability_01",
      policyType: "disability_cover",
      provider: "Unknown",
      owner: "self",
      livesCovered: ["self"],
      status: "active",
    });
  }

  const medicalAid = protectionEstate.hasMedicalAid !== undefined
    ? {
        hasMedicalAid: protectionEstate.hasMedicalAid,
        provider: undefined,
        monthlyPremium: undefined,
      }
    : undefined;

  // ── Retirement ────────────────────────────────────────────────
  const retirement = {
    currentRetirementSavings: savings.retirementSavingsTotal,
    monthlyRetirementContribution: savings.monthlyRetirementContribution,
    retirementVehicles:
      savings.retirementSavingsTotal && savings.retirementSavingsTotal > 0
        ? [
            {
              vehicleId: "rv_001",
              vehicleType: "retirement_annuity",
              currentValue: savings.retirementSavingsTotal,
              monthlyContribution: savings.monthlyRetirementContribution,
            },
          ]
        : [],
    retirementReadinessStatus: "unknown" as const,
  };

  // ── Estate ────────────────────────────────────────────────────
  const estate = {
    hasWill: protectionEstate.hasWill,
    beneficiariesReviewed:
      protectionEstate.beneficiaryNominationsUpdated === "yes" ? true
      : protectionEstate.beneficiaryNominationsUpdated === "no" ? false
      : undefined,
    nominatedGuardian: family.hasMinorChildren ? false : undefined,
  };

  // ── Goals ─────────────────────────────────────────────────────
  const goals = (state.priorities.selectedPriorities ?? []).map((p, i) => ({
    goalId: `goal_${i + 1}`,
    category: mapPriorityToGoalCategory(p),
    title: mapPriorityToTitle(p),
    priority: (Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5),
    status: "not_started" as const,
  }));

  // ── Assemble ClientProfile ────────────────────────────────────
  const clientProfile = {
    clientId: generateClientId(),
    profileStatus: "draft" as const,
    createdAt: now,
    updatedAt: now,
    identity,
    contact,
    household,
    employment,
    cashFlow,
    assets,
    liabilities,
    protection,
    medicalAid,
    retirement,
    estate,
    goals,
    completionScore: calculateCompletionScore(state),
    completedSections: deriveCompletedSections(state),
  };

  return clientProfile;
}

/** Map Priority enum to GoalCategory */
function mapPriorityToGoalCategory(priority: string): string {
  const map: Record<string, string> = {
    retire_comfortably: "retirement",
    protect_my_family: "protection",
    reduce_debt: "debt_reduction",
    build_emergency_fund: "emergency_fund",
    invest_better: "wealth_building",
    plan_my_estate: "estate_planning",
    fund_education: "education",
    prepare_funeral_cover: "protection",
    improve_cash_flow: "debt_reduction",
    get_medical_cover: "protection",
  };
  return map[priority] ?? "other";
}

/** Map Priority enum to human title */
function mapPriorityToTitle(priority: string): string {
  const map: Record<string, string> = {
    retire_comfortably: "Retire comfortably",
    protect_my_family: "Protect my family",
    reduce_debt: "Reduce my debt",
    build_emergency_fund: "Build emergency fund",
    invest_better: "Invest more effectively",
    plan_my_estate: "Get my estate in order",
    fund_education: "Fund education",
    prepare_funeral_cover: "Sort out funeral cover",
    improve_cash_flow: "Improve monthly cash flow",
    get_medical_cover: "Get medical cover",
  };
  return map[priority] ?? priority.replace(/_/g, " ");
}

/** Calculate a rough profile completion score 0–100 */
function calculateCompletionScore(state: OnboardingState): number {
  let filled = 0;
  const total = 18;

  if (state.about.firstName) filled++;
  if (state.about.lastName) filled++;
  if (state.about.mobileNumber) filled++;
  if (state.about.idNumber || state.about.dateOfBirth) filled++;
  if (state.about.province) filled++;
  if (state.family.maritalStatus) filled++;
  if (state.family.numberOfChildren !== undefined) filled++;
  if (state.family.parentsSupported !== undefined) filled++;
  if (state.income.employmentStatus) filled++;
  if (state.income.monthlyNetIncome) filled++;
  if (state.spending.monthlyEssentialExpenses) filled++;
  if (state.spending.monthlyDebtRepayments !== undefined) filled++;
  if (state.savings.emergencySavingsAmount !== undefined) filled++;
  if (state.savings.retirementSavingsTotal !== undefined) filled++;
  if (state.savings.monthlyRetirementContribution !== undefined) filled++;
  if (state.protectionEstate.hasLifeCover !== undefined) filled++;
  if (state.protectionEstate.hasMedicalAid !== undefined) filled++;
  if (state.protectionEstate.hasWill !== undefined) filled++;

  return Math.round((filled / total) * 100);
}

/** Determine which profile sections are considered complete */
function deriveCompletedSections(state: OnboardingState): string[] {
  const completed: string[] = [];

  if (state.about.firstName && state.about.lastName) {
    completed.push("identity");
    if (state.about.mobileNumber) completed.push("contact");
  }

  if (state.family.maritalStatus !== undefined) completed.push("household");

  if (state.income.employmentStatus) completed.push("employment");

  if (state.spending.monthlyEssentialExpenses !== undefined) completed.push("cashFlow");

  if (state.savings.emergencySavingsAmount !== undefined ||
      state.savings.retirementSavingsTotal !== undefined) {
    completed.push("assets");
  }

  if (state.spending.debtTypes !== undefined) completed.push("liabilities");

  if (state.protectionEstate.hasLifeCover !== undefined ||
      state.protectionEstate.hasFuneralCover !== undefined) {
    completed.push("protection");
  }

  if (state.savings.retirementSavingsTotal !== undefined) completed.push("retirement");

  if (state.protectionEstate.hasWill !== undefined) completed.push("estate");

  if (state.priorities.selectedPriorities && state.priorities.selectedPriorities.length > 0) {
    completed.push("goals");
  }

  return completed;
}

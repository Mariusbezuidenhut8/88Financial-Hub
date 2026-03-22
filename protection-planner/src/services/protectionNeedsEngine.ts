/**
 * protectionNeedsEngine.ts
 *
 * Four-pillar SA protection needs analysis engine.
 *
 * Pillars:
 *   1. Life cover           — income replacement + education + capital + optional debt
 *   2. Income protection    — 75% of gross income monthly (SA insurer cap)
 *   3. Dread disease        — lump sum on severe illness diagnosis (default: 18 months gross)
 *   4. Debt cover           — outstanding liabilities at death/disability
 *
 * All needs are calculated as a GAP:
 *   gap = max(0, totalNeed - existingCover)
 */

import type {
  ProtectionAnalysisInput,
  ProtectionAnalysisOutput,
  ProtectionGap,
  ProtectionGapSeverity,
  ProtectionReadinessStatus,
  ProtectionPlanningUrgency,
} from "../types/protectionPlanner.types";

// ── Severity thresholds ────────────────────────────────────────────────────

/**
 * gapToSeverity
 *
 * Classifies a gap relative to the client's annual income.
 * Used across all pillars (gap expressed as absolute ZAR).
 */
function gapToSeverity(gap: number, annualIncome: number): ProtectionGapSeverity {
  if (gap <= 0)                          return "none";
  if (gap < annualIncome)                return "minor";
  if (gap < annualIncome * 3)            return "moderate";
  if (gap < annualIncome * 5)            return "significant";
  return "critical";
}

/**
 * monthlyGapSeverity — for income protection (gap is a monthly amount).
 * Thresholds are relative to monthly gross income.
 */
function monthlyGapSeverity(
  monthlyGap: number,
  monthlyGross: number,
): ProtectionGapSeverity {
  if (monthlyGap <= 0)                           return "none";
  if (monthlyGap < monthlyGross * 0.25)          return "minor";
  if (monthlyGap < monthlyGross * 0.50)          return "moderate";
  if (monthlyGap < monthlyGross * 0.75)          return "significant";
  return "critical"; // entire income is unprotected
}

// ── 1. Life cover gap ──────────────────────────────────────────────────────

function calcLifeGap(input: ProtectionAnalysisInput): ProtectionGap {
  const {
    monthlyNetIncome,
    incomeReplacementYears,
    numberOfChildren,
    includeDebtInLifeNeed,
    includeEducationFund,
    educationFundPerChild,
    additionalCapitalNeed,
    existingLifeCover,
    totalOutstandingDebt,
    monthlyGrossIncome,
  } = input;

  const annualIncome = monthlyGrossIncome * 12;

  // Income replacement: net income × 12 × years
  const incomeReplacement = monthlyNetIncome * 12 * incomeReplacementYears;

  // Optional: roll outstanding debt into life cover
  const debtComponent = includeDebtInLifeNeed ? totalOutstandingDebt : 0;

  // Optional: education fund per child
  const educationComponent = includeEducationFund
    ? numberOfChildren * educationFundPerChild
    : 0;

  const totalNeed = incomeReplacement + debtComponent + educationComponent + additionalCapitalNeed;
  const gap       = Math.max(0, totalNeed - existingLifeCover);
  const severity  = gapToSeverity(gap, annualIncome);

  const reasons: string[] = [];
  const cautions: string[] = [];

  if (existingLifeCover > 0) {
    reasons.push(
      `You have R${existingLifeCover.toLocaleString("en-ZA")} in existing life cover providing a base of protection.`,
    );
  }
  if (gap === 0) {
    reasons.push("Your existing life cover appears sufficient based on current inputs.");
  }
  if (gap > 0) {
    cautions.push(
      `A life cover shortfall of R${gap.toLocaleString("en-ZA")} means your family's income may not be fully replaced.`,
    );
  }
  if (input.numberOfDependants === 0) {
    reasons.push(
      "No dependants recorded — life cover need is reduced. Update if your circumstances change.",
    );
  }
  if (input.hasGroupRiskBenefit) {
    reasons.push(
      "Your employer group risk benefit contributes to existing cover — confirm the cover amount with your HR department.",
    );
  }

  return {
    needType:      "life_cover",
    totalNeed,
    existingCover: existingLifeCover,
    gap,
    severity,
    reasons,
    cautions,
  };
}

// ── 2. Income protection gap ───────────────────────────────────────────────

function calcIncomeProtectionGap(input: ProtectionAnalysisInput): ProtectionGap {
  const {
    desiredMonthlyBenefit,
    existingMonthlyDisabilityBenefit,
    monthlyGrossIncome,
    waitingPeriodDays,
    benefitPeriod,
  } = input;

  const gap      = Math.max(0, desiredMonthlyBenefit - existingMonthlyDisabilityBenefit);
  const severity = monthlyGapSeverity(gap, monthlyGrossIncome);

  // For gap display, convert monthly gap to annual equivalent for comparison
  const annualGap = gap * 12;
  void annualGap; // used in cautions

  const reasons: string[] = [];
  const cautions: string[] = [];

  if (existingMonthlyDisabilityBenefit > 0) {
    reasons.push(
      `Existing disability/income protection benefit of R${existingMonthlyDisabilityBenefit.toLocaleString("en-ZA")}/month reduces the shortfall.`,
    );
  }
  if (gap === 0) {
    reasons.push("Your income protection appears sufficient to cover the 75% gross income target.");
  }
  if (gap > 0) {
    cautions.push(
      `Monthly income protection shortfall of R${gap.toLocaleString("en-ZA")} — disability could significantly impact your lifestyle.`,
    );
  }
  if (waitingPeriodDays <= 7) {
    reasons.push("Short waiting period of 7 days minimises income disruption at claim stage.");
  } else if (waitingPeriodDays >= 90) {
    cautions.push(
      `A ${waitingPeriodDays}-day waiting period means you may need up to ${Math.ceil(waitingPeriodDays / 30)} months of emergency savings to bridge the gap.`,
    );
  }
  if (benefitPeriod === "to_age_65" || benefitPeriod === "to_age_60") {
    reasons.push("Long-term benefit period provides protection for extended disability.");
  } else {
    cautions.push(
      "A short benefit period (2 or 5 years) may not cover permanent disability — consider increasing to retirement age.",
    );
  }

  return {
    needType:      "income_protection",
    totalNeed:     desiredMonthlyBenefit,
    existingCover: existingMonthlyDisabilityBenefit,
    gap,
    severity,
    reasons,
    cautions,
  };
}

// ── 3. Dread disease gap ───────────────────────────────────────────────────

function calcDreadDiseaseGap(input: ProtectionAnalysisInput): ProtectionGap {
  const {
    wantsDreadDiseaseCover,
    desiredDreadDiseaseLumpSum,
    existingDreadDiseaseCover,
    monthlyGrossIncome,
  } = input;

  const annualIncome = monthlyGrossIncome * 12;

  if (!wantsDreadDiseaseCover) {
    return {
      needType:      "dread_disease",
      totalNeed:     0,
      existingCover: existingDreadDiseaseCover,
      gap:           0,
      severity:      "none",
      reasons:       ["Dread disease / severe illness cover not selected for this assessment."],
      cautions:      [],
    };
  }

  const gap      = Math.max(0, desiredDreadDiseaseLumpSum - existingDreadDiseaseCover);
  const severity = gapToSeverity(gap, annualIncome);

  const reasons:  string[] = [];
  const cautions: string[] = [];

  if (existingDreadDiseaseCover > 0) {
    reasons.push(
      `Existing severe illness cover of R${existingDreadDiseaseCover.toLocaleString("en-ZA")} provides a partial buffer.`,
    );
  }
  if (gap === 0) {
    reasons.push("Existing dread disease cover meets or exceeds the target lump sum.");
  }
  if (gap > 0) {
    cautions.push(
      `A severe illness shortfall of R${gap.toLocaleString("en-ZA")} could leave insufficient funds for treatment, recovery, and lifestyle adjustment.`,
    );
    cautions.push(
      "Cancer, heart attack, and stroke account for the majority of SA severe illness claims — consider comprehensive condition coverage.",
    );
  }

  return {
    needType:      "dread_disease",
    totalNeed:     desiredDreadDiseaseLumpSum,
    existingCover: existingDreadDiseaseCover,
    gap,
    severity,
    reasons,
    cautions,
  };
}

// ── 4. Debt cover gap ──────────────────────────────────────────────────────

function calcDebtCoverGap(input: ProtectionAnalysisInput): ProtectionGap {
  const {
    debtToCover,
    existingCreditLifeCover,
    monthlyGrossIncome,
  } = input;

  const annualIncome = monthlyGrossIncome * 12;
  const gap          = Math.max(0, debtToCover - existingCreditLifeCover);
  const severity     = gapToSeverity(gap, annualIncome);

  const reasons:  string[] = [];
  const cautions: string[] = [];

  if (existingCreditLifeCover > 0) {
    reasons.push(
      `Credit life cover of R${existingCreditLifeCover.toLocaleString("en-ZA")} already covers a portion of your debt.`,
    );
  }
  if (debtToCover === 0) {
    reasons.push("No outstanding debt selected for debt cover assessment.");
  }
  if (gap === 0 && debtToCover > 0) {
    reasons.push("Your credit life cover appears sufficient for the selected liabilities.");
  }
  if (gap > 0) {
    cautions.push(
      `A debt cover shortfall of R${gap.toLocaleString("en-ZA")} means outstanding debt could remain after death or disability, creating a burden on your estate or dependants.`,
    );
  }
  if (input.hasSpouseOrPartner && gap > 0) {
    cautions.push(
      "In a marriage in community of property, your spouse may be jointly liable for certain debts.",
    );
  }

  return {
    needType:      "debt_cover",
    totalNeed:     debtToCover,
    existingCover: existingCreditLifeCover,
    gap,
    severity,
    reasons,
    cautions,
  };
}

// ── Overall readiness + urgency ────────────────────────────────────────────

function assessReadiness(
  lifeGap:             ProtectionGap,
  incomeProtectionGap: ProtectionGap,
  dreadDiseaseGap:     ProtectionGap,
  debtCoverGap:        ProtectionGap,
): ProtectionReadinessStatus {
  const severities = [
    lifeGap.severity,
    incomeProtectionGap.severity,
    dreadDiseaseGap.severity,
    debtCoverGap.severity,
  ];

  const hasCritical    = severities.some((s) => s === "critical");
  const hasSignificant = severities.some((s) => s === "significant");
  const hasModerate    = severities.some((s) => s === "moderate");
  const allNoneOrMinor = severities.every((s) => s === "none" || s === "minor");

  if (hasCritical)    return "critically_underinsured";
  if (hasSignificant) return "significant_gaps";
  if (hasModerate)    return "partially_covered";
  if (allNoneOrMinor) return "well_covered";
  return "partially_covered";
}

function assessUrgency(
  lifeGap:             ProtectionGap,
  incomeProtectionGap: ProtectionGap,
  input:               ProtectionAnalysisInput,
): ProtectionPlanningUrgency {
  // Critical: no life cover with dependants OR no income protection at all
  if (
    (lifeGap.severity === "critical" && input.numberOfDependants > 0) ||
    (input.existingMonthlyDisabilityBenefit === 0 && incomeProtectionGap.gap > 0)
  ) {
    return "critical";
  }

  if (lifeGap.severity === "significant" || incomeProtectionGap.severity === "significant") {
    return "high";
  }

  if (lifeGap.severity === "moderate" || incomeProtectionGap.severity === "moderate") {
    return "moderate";
  }

  return "low";
}

// ── Summary reasons + recommendations ─────────────────────────────────────

function buildSummaryReasons(
  lifeGap: ProtectionGap,
  incomeGap: ProtectionGap,
  input: ProtectionAnalysisInput,
): string[] {
  const reasons: string[] = [];

  if (input.hasGroupRiskBenefit) {
    reasons.push("You have employer group risk benefits — your cover is not reliant solely on personal policies.");
  }
  if (lifeGap.severity === "none" || lifeGap.severity === "minor") {
    reasons.push("Life cover is broadly adequate for your current income replacement need.");
  }
  if (incomeGap.severity === "none" || incomeGap.severity === "minor") {
    reasons.push("Income protection is broadly adequate — your monthly income is largely covered in the event of disability.");
  }
  if (input.existingMonthlyDisabilityBenefit > 0 && input.existingLifeCover > 0) {
    reasons.push("You have cover across at least two pillars — a solid foundation to build from.");
  }
  if (reasons.length === 0) {
    reasons.push("Your protection plan is at an early stage — the recommended actions below will materially improve your cover position.");
  }

  return reasons;
}

function buildSummaryCautions(
  gaps: ProtectionGap[],
  input: ProtectionAnalysisInput,
): string[] {
  const cautions: string[] = [];

  const significantGaps = gaps.filter(
    (g) => g.severity === "critical" || g.severity === "significant",
  );
  if (significantGaps.length > 1) {
    cautions.push(
      "Multiple significant cover gaps exist across pillars — a comprehensive protection review is strongly recommended.",
    );
  }
  if (input.numberOfDependants > 0 && input.existingLifeCover === 0) {
    cautions.push(
      "You have dependants but no life cover on record — this is the highest priority gap.",
    );
  }
  if (input.existingMonthlyDisabilityBenefit === 0) {
    cautions.push(
      "No income protection or disability cover recorded — disability is statistically more likely to occur than death before retirement.",
    );
  }

  return cautions;
}

function buildRecommendedActions(
  lifeGap:         ProtectionGap,
  incomeGap:       ProtectionGap,
  dreadGap:        ProtectionGap,
  debtGap:         ProtectionGap,
  input:           ProtectionAnalysisInput,
): string[] {
  const actions: string[] = [];

  if (input.numberOfDependants > 0 && input.existingLifeCover === 0) {
    actions.push("Obtain life cover immediately — your dependants have no income protection if you were to die today.");
  } else if (lifeGap.gap > 0) {
    actions.push(
      `Increase life cover by R${lifeGap.gap.toLocaleString("en-ZA")} to fully replace your income for your dependants.`,
    );
  }

  if (input.existingMonthlyDisabilityBenefit === 0 && incomeGap.gap > 0) {
    actions.push(
      `Take out income protection cover of R${incomeGap.gap.toLocaleString("en-ZA")}/month to safeguard your income against disability.`,
    );
  } else if (incomeGap.gap > 0) {
    actions.push(
      `Top up income protection by R${incomeGap.gap.toLocaleString("en-ZA")}/month to reach the 75% gross income target.`,
    );
  }

  if (dreadGap.gap > 0) {
    actions.push(
      `Add R${dreadGap.gap.toLocaleString("en-ZA")} in severe illness / dread disease cover for a financial buffer at diagnosis.`,
    );
  }

  if (debtGap.gap > 0) {
    actions.push(
      `Ensure at least R${debtGap.gap.toLocaleString("en-ZA")} in credit life / debt cover to clear selected liabilities at death or disability.`,
    );
  }

  if (input.hasGroupRiskBenefit) {
    actions.push(
      "Obtain a full benefit statement from your employer to confirm group cover amounts before purchasing additional cover.",
    );
  }

  if (actions.length === 0) {
    actions.push("Review your protection portfolio annually or after any major life event (marriage, children, salary change).");
  }

  return actions;
}

// ── Engine entry point ─────────────────────────────────────────────────────

/**
 * runProtectionAnalysis
 *
 * Pure function — given a fully resolved ProtectionAnalysisInput, returns
 * a complete ProtectionAnalysisOutput across all four pillars.
 */
export function runProtectionAnalysis(
  input: ProtectionAnalysisInput,
): ProtectionAnalysisOutput {
  const lifeGap             = calcLifeGap(input);
  const incomeProtectionGap = calcIncomeProtectionGap(input);
  const dreadDiseaseGap     = calcDreadDiseaseGap(input);
  const debtCoverGap        = calcDebtCoverGap(input);

  const allGaps = [lifeGap, incomeProtectionGap, dreadDiseaseGap, debtCoverGap];

  const overallReadiness = assessReadiness(
    lifeGap, incomeProtectionGap, dreadDiseaseGap, debtCoverGap,
  );
  const urgency = assessUrgency(lifeGap, incomeProtectionGap, input);

  const reasons = buildSummaryReasons(lifeGap, incomeProtectionGap, input);
  const cautions = buildSummaryCautions(allGaps, input);
  const recommendedActions = buildRecommendedActions(
    lifeGap, incomeProtectionGap, dreadDiseaseGap, debtCoverGap, input,
  );

  return {
    lifeGap,
    incomeProtectionGap,
    dreadDiseaseGap,
    debtCoverGap,
    overallReadiness,
    urgency,
    reasons,
    cautions,
    recommendedActions,
  };
}

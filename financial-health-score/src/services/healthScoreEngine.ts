/**
 * healthScoreEngine.ts
 *
 * Six-pillar Financial Health Score engine.
 *
 * Pure function: runHealthScore(clientProfile) → HealthScoreResult
 *
 * Pillars and weights:
 *   cash_flow   20%  — emergency fund, debt ratio, savings rate
 *   protection  20%  — life cover, income protection, medical aid, dread disease
 *   retirement  20%  — contribution rate, readiness status, savings balance
 *   estate      20%  — will, executor, beneficiaries, guardian
 *   net_worth   10%  — positive net worth, debt-to-asset ratio, diversification
 *   goals       10%  — has goals, emergency fund goal, goals in progress
 *
 * Band thresholds:
 *   80–100  strong
 *   65–79   good_foundation
 *   50–64   needs_attention
 *   35–49   financial_stress_risk
 *   0–34    urgent_action_needed
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  HealthScoreResult,
  HealthScorePillar,
  HealthScorePillarId,
} from "../types/healthScore.types";
import { PILLAR_WEIGHTS, PILLAR_LABELS } from "../types/healthScore.types";
import type { HealthScoreBand } from "@88fh/master-data-model";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Band thresholds ────────────────────────────────────────────────────────

function scoreToBand(score: number): HealthScoreBand {
  if (score >= 80) return "strong";
  if (score >= 65) return "good_foundation";
  if (score >= 50) return "needs_attention";
  if (score >= 35) return "financial_stress_risk";
  return "urgent_action_needed";
}

// ── Shared policy helpers ──────────────────────────────────────────────────

function hasActivePolicy(
  protection: ClientProfile["protection"],
  policyTypes: string[],
): boolean {
  const typeSet = new Set(policyTypes);
  return protection.some((p) => typeSet.has(p.policyType) && p.status === "active");
}

function sumActiveCover(
  protection: ClientProfile["protection"],
  policyTypes: string[],
): number {
  const typeSet = new Set(policyTypes);
  return protection
    .filter((p) => typeSet.has(p.policyType) && p.status === "active")
    .reduce((sum, p) => sum + (p.coverAmount ?? 0), 0);
}

function sumAssets(assets: ClientProfile["assets"]): number {
  return assets.reduce((sum, a) => sum + (a.currentValue ?? 0), 0);
}

function sumLiabilities(liabilities: ClientProfile["liabilities"]): number {
  return liabilities.reduce((sum, l) => sum + (l.outstandingBalance ?? 0), 0);
}

function calcAge(dateOfBirth: string | undefined): number | undefined {
  if (!dateOfBirth) return undefined;
  const dob   = new Date(dateOfBirth);
  const today = new Date();
  let age     = today.getFullYear() - dob.getFullYear();
  const m     = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// ── Pillar 1: Cash Flow ────────────────────────────────────────────────────

function scoreCashFlow(profile: ClientProfile): HealthScorePillar {
  const { employment, cashFlow } = profile;

  const monthlyNet    = employment.monthlyNetIncome   ?? 0;
  const monthlyGross  = employment.monthlyGrossIncome ?? 0;
  const debtRepayments = cashFlow.monthlyDebtRepayments ?? 0;
  const savings        = cashFlow.monthlySavings       ?? 0;
  const retirementContribs = cashFlow.monthlyRetirementContributions
    ?? profile.retirement?.monthlyRetirementContribution ?? 0;
  const essentialExpenses = cashFlow.monthlyEssentialExpenses ?? 0;
  const emergencyFundAmount = cashFlow.emergencyFundAmount ?? 0;

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = monthlyNet > 0 && essentialExpenses > 0;

  // ── Emergency fund (35 pts)
  const emergencyMonths = essentialExpenses > 0
    ? emergencyFundAmount / essentialExpenses
    : cashFlow.hasEmergencyFund ? 1 : 0;

  if (emergencyMonths >= 6) {
    score += 35;
    positives.push("Emergency fund covers 6+ months of essential expenses.");
  } else if (emergencyMonths >= 3) {
    score += 25;
    positives.push(`Emergency fund covers ~${Math.floor(emergencyMonths)} months — good foundation.`);
    gaps.push("Aim for 6 months of essential expenses in your emergency fund.");
    actions.push("Top up your emergency fund to 6 months of essential expenses.");
  } else if (emergencyMonths >= 1) {
    score += 12;
    gaps.push(`Emergency fund covers only ${Math.floor(emergencyMonths)} month(s) — below the recommended 3–6 months.`);
    actions.push("Build your emergency fund to at least 3 months of essential expenses.");
  } else {
    score += 0;
    gaps.push("No emergency fund or insufficient data — a single unexpected expense could destabilise your finances.");
    actions.push("Open a dedicated savings account and target 1 month of expenses as a first milestone.");
  }

  // ── Debt repayment ratio (35 pts)
  const debtRatio = monthlyNet > 0 ? debtRepayments / monthlyNet : 0;

  if (debtRatio <= 0.15) {
    score += 35;
    positives.push(`Debt repayments are ${Math.round(debtRatio * 100)}% of net income — well within healthy range.`);
  } else if (debtRatio <= 0.30) {
    score += 25;
    positives.push(`Debt repayments at ${Math.round(debtRatio * 100)}% of net income — manageable.`);
    actions.push("Review debt structure — consider consolidating to reduce the monthly burden.");
  } else if (debtRatio <= 0.40) {
    score += 14;
    gaps.push(`Debt repayments at ${Math.round(debtRatio * 100)}% of net income — above the 36% NCA guideline.`);
    actions.push("Prioritise paying down high-interest debt and avoid new credit.");
  } else if (debtRatio <= 0.50) {
    score += 5;
    gaps.push(`Debt repayments at ${Math.round(debtRatio * 100)}% — financial stress risk.`);
    actions.push("Seek debt counselling or a structured repayment plan immediately.");
  } else {
    score += 0;
    gaps.push(`Debt repayments exceed 50% of net income — this is a financial emergency.`);
    actions.push("Contact a registered debt counsellor under the National Credit Act.");
  }

  // ── Savings rate (30 pts)
  const savingsRate = monthlyGross > 0
    ? (savings + retirementContribs) / monthlyGross
    : 0;

  if (savingsRate >= 0.20) {
    score += 30;
    positives.push(`Savings rate of ${Math.round(savingsRate * 100)}% — excellent wealth-building position.`);
  } else if (savingsRate >= 0.15) {
    score += 22;
    positives.push(`Savings rate of ${Math.round(savingsRate * 100)}% — on track.`);
  } else if (savingsRate >= 0.10) {
    score += 14;
    gaps.push(`Savings rate of ${Math.round(savingsRate * 100)}% — target 15–20% of gross income.`);
    actions.push("Identify one discretionary expense to redirect into savings or retirement.");
  } else if (savingsRate > 0) {
    score += 5;
    gaps.push(`Savings rate of ${Math.round(savingsRate * 100)}% — significantly below target.`);
    actions.push("Review your budget to find opportunities to increase the savings rate.");
  } else {
    score += 0;
    gaps.push("No regular savings detected — wealth accumulation is at risk.");
    actions.push("Set up an automatic monthly debit order into a savings or investment account.");
  }

  return pillar("cash_flow", score, positives, gaps, actions, dataComplete);
}

// ── Pillar 2: Protection ───────────────────────────────────────────────────

function scoreProtection(profile: ClientProfile): HealthScorePillar {
  const { protection, medicalAid, employment } = profile;
  const monthlyGross = employment.monthlyGrossIncome ?? 0;
  const age = calcAge(profile.identity.dateOfBirth);
  const yearsToRetirement = age ? Math.max(1, (profile.retirement?.targetRetirementAge ?? 65) - age) : 30;

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = protection.length > 0 || medicalAid !== undefined;

  // ── Medical aid (20 pts)
  if (medicalAid?.hasMedicalAid) {
    score += 20;
    positives.push("Medical aid in place — healthcare costs are covered.");
  } else {
    gaps.push("No medical aid on record — a single hospitalisation could be catastrophic.");
    actions.push("Obtain medical aid cover — even a hospital plan provides essential protection.");
  }

  // ── Life cover (25 pts)
  const hasLifeCover = hasActivePolicy(protection, ["life_cover", "group_life"]);
  if (hasLifeCover) {
    score += 25;
    positives.push("Active life cover found — your dependants have income protection.");
  } else {
    gaps.push("No active life cover — dependants have no income protection if you die.");
    actions.push("Obtain life cover immediately, particularly if you have dependants.");
  }

  // ── Income protection / disability (30 pts)
  const hasIncomeProtection = hasActivePolicy(protection, [
    "income_protection",
    "group_disability",
    "disability_cover",
  ]);
  if (hasIncomeProtection) {
    score += 30;
    positives.push("Income protection or disability cover in place — salary disruption is managed.");
  } else {
    gaps.push(
      "No income protection or disability cover — disability is statistically more likely than death before retirement.",
    );
    actions.push(
      "Get income protection cover of at least 75% of gross income to retirement age.",
    );
  }

  // ── Severe illness / dread disease (15 pts)
  const hasDreadDisease = hasActivePolicy(protection, ["severe_illness"]);
  if (hasDreadDisease) {
    score += 15;
    positives.push("Severe illness / dread disease cover in place.");
  } else {
    gaps.push("No severe illness cover — a cancer or heart attack diagnosis could deplete savings.");
    actions.push("Consider severe illness cover of at least 18 months of gross income.");
  }

  // ── Life cover adequacy (10 pts)
  const existingLifeCover = sumActiveCover(protection, ["life_cover", "group_life"]);
  const simpleLifeNeed    = monthlyGross * 12 * Math.min(yearsToRetirement, 20);
  const coverageRatio     = simpleLifeNeed > 0 ? existingLifeCover / simpleLifeNeed : 0;

  if (hasLifeCover && coverageRatio >= 0.75) {
    score += 10;
    positives.push(
      `Life cover adequacy looks reasonable — ${Math.round(coverageRatio * 100)}% of a simplified income replacement need.`,
    );
  } else if (hasLifeCover && coverageRatio >= 0.40) {
    score += 5;
    gaps.push("Life cover may be insufficient — consider running the Protection Planner for a detailed gap analysis.");
    actions.push("Run the Protection Planner to assess your exact life cover gap.");
  } else if (hasLifeCover) {
    gaps.push("Life cover is significantly below a basic income replacement estimate.");
    actions.push("Increase life cover — run the Protection Planner for a precise calculation.");
  }

  // Group risk benefit note
  if (employment.hasGroupRiskBenefit) {
    positives.push("Employer group risk benefit contributes to cover — confirm the exact amount with HR.");
  }

  return pillar("protection", score, positives, gaps, actions, dataComplete);
}

// ── Pillar 3: Retirement ───────────────────────────────────────────────────

function scoreRetirement(profile: ClientProfile): HealthScorePillar {
  const { retirement, employment, cashFlow } = profile;

  const monthlyGross = employment.monthlyGrossIncome ?? 0;
  const monthlyContrib =
    retirement?.monthlyRetirementContribution ??
    cashFlow.monthlyRetirementContributions ?? 0;
  const currentSavings = retirement?.currentRetirementSavings
    ?? profile.assets
       .filter((a) => a.isRetirementAsset)
       .reduce((sum, a) => sum + (a.currentValue ?? 0), 0);
  const readinessStatus = retirement?.retirementReadinessStatus ?? "unknown";

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = monthlyGross > 0 && monthlyContrib > 0;

  // ── Has retirement contributions (20 pts)
  if (monthlyContrib > 0) {
    score += 20;
    positives.push(`Monthly retirement contribution of R${monthlyContrib.toLocaleString("en-ZA")} is in place.`);
  } else {
    gaps.push("No monthly retirement contributions detected.");
    actions.push("Start retirement contributions immediately — even R500/month makes a significant difference over time.");
  }

  // ── Contribution rate (30 pts)
  const contribRate = monthlyGross > 0 ? monthlyContrib / monthlyGross : 0;

  if (contribRate >= 0.15) {
    score += 30;
    positives.push(`Contribution rate of ${Math.round(contribRate * 100)}% is at or above the recommended 15%.`);
  } else if (contribRate >= 0.10) {
    score += 20;
    positives.push(`Contribution rate of ${Math.round(contribRate * 100)}% is reasonable — aim for 15%.`);
    actions.push("Increase retirement contributions to 15% of gross income.");
  } else if (contribRate >= 0.05) {
    score += 10;
    gaps.push(`Contribution rate of ${Math.round(contribRate * 100)}% is below target — retirement shortfall risk.`);
    actions.push("Aim to increase retirement contributions by 1–2% of gross income per year.");
  } else if (contribRate > 0) {
    score += 3;
    gaps.push("Retirement contribution rate is very low — significant shortfall is likely at retirement.");
    actions.push("Review budget to free up funds for higher retirement contributions.");
  }

  // ── Readiness status (35 pts)
  const readinessPoints: Record<string, number> = {
    ahead:            35,
    on_track:         30,
    slightly_behind:  18,
    behind:           5,
    unknown:          10,
  };
  const readinessScore = readinessPoints[readinessStatus] ?? 10;
  score += readinessScore;

  if (readinessStatus === "ahead" || readinessStatus === "on_track") {
    positives.push(`Retirement readiness status: ${readinessStatus.replace("_", " ")} — strong position.`);
  } else if (readinessStatus === "slightly_behind") {
    gaps.push("Retirement projection is slightly behind target — a course correction is needed.");
    actions.push("Run the Retirement Planner for a detailed projection and catch-up strategy.");
  } else if (readinessStatus === "behind") {
    gaps.push("Retirement projection is significantly behind — urgent action required.");
    actions.push("Run the Retirement Planner to quantify the shortfall and model catch-up scenarios.");
  } else {
    actions.push("Complete the Retirement Planner to get a personalised readiness status.");
  }

  // ── Has savings balance (10 pts)
  if (currentSavings > 0) {
    score += 10;
    positives.push(`Retirement savings balance of R${currentSavings.toLocaleString("en-ZA")}.`);
  } else {
    gaps.push("No retirement savings balance recorded.");
    actions.push("Add your retirement fund balances to your profile for an accurate health score.");
  }

  // ── Has target retirement age (5 pts)
  if (retirement?.targetRetirementAge) {
    score += 5;
  }

  return pillar("retirement", score, positives, gaps, actions, dataComplete);
}

// ── Pillar 4: Estate ───────────────────────────────────────────────────────

function scoreEstate(profile: ClientProfile): HealthScorePillar {
  const { estate, household } = profile;
  const hasMinorChildren = household.hasMinorChildren ?? household.numberOfChildren > 0;

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = estate !== undefined;

  // ── Has will (40 pts)
  if (estate?.hasWill) {
    score += 40;
    positives.push("A valid will is on record — estate can be wound up according to your wishes.");
  } else if (estate?.hasWill === false) {
    gaps.push("No will recorded — estate will be distributed under the Intestate Succession Act.");
    actions.push("Draft a valid will with a qualified estate planning attorney — this is the highest priority estate action.");
  } else {
    score += 10; // unknown — partial credit
    actions.push("Confirm whether a valid will exists and record it on your profile.");
  }

  // ── Executor chosen (20 pts)
  if (estate?.executorChosen) {
    score += 20;
    positives.push("An executor has been appointed.");
  } else {
    gaps.push("No executor appointed — estate administration may be delayed.");
    actions.push("Nominate a professional or trusted executor in your will.");
  }

  // ── Beneficiaries reviewed (20 pts)
  if (estate?.beneficiariesReviewed) {
    score += 20;
    positives.push("Beneficiary nominations are up to date.");
  } else {
    gaps.push("Beneficiary nominations have not been reviewed — assets may not transfer as intended.");
    actions.push("Review beneficiary nominations on all policies, retirement funds, and bank accounts.");
  }

  // ── Guardian for minor children (20 pts)
  if (hasMinorChildren) {
    if (estate?.nominatedGuardian) {
      score += 20;
      positives.push("A guardian has been nominated for minor children.");
    } else {
      gaps.push("Minor children present but no guardian nominated — the court will decide.");
      actions.push("Nominate a guardian for your minor children in your will immediately.");
    }
  } else {
    // No minor children — full points for this check
    score += 20;
  }

  if (!dataComplete) {
    actions.push("Complete the Estate section of your profile to enable an accurate estate health score.");
  }

  return pillar("estate", score, positives, gaps, actions, dataComplete);
}

// ── Pillar 5: Net Worth ────────────────────────────────────────────────────

function scoreNetWorth(profile: ClientProfile): HealthScorePillar {
  const { assets, liabilities, employment } = profile;

  const totalAssets      = sumAssets(assets);
  const totalLiabilities = sumLiabilities(liabilities);
  const netWorth         = totalAssets - totalLiabilities;
  const monthlyNet       = employment.monthlyNetIncome ?? 0;
  const annualDebtRepayments = (profile.cashFlow.monthlyDebtRepayments ?? 0) * 12;

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = assets.length > 0;

  // ── Positive net worth (40 pts)
  if (netWorth > 0) {
    score += 40;
    positives.push(`Positive net worth of R${netWorth.toLocaleString("en-ZA")} — assets exceed liabilities.`);
  } else if (netWorth === 0) {
    score += 15;
    gaps.push("Net worth is zero — assets exactly match liabilities.");
  } else {
    gaps.push(`Negative net worth of R${Math.abs(netWorth).toLocaleString("en-ZA")} — liabilities exceed assets.`);
    actions.push("Focus on debt reduction to move net worth into positive territory.");
  }

  // ── Debt-to-asset ratio (30 pts)
  const debtToAsset = totalAssets > 0 ? totalLiabilities / totalAssets : 1;

  if (debtToAsset <= 0.30) {
    score += 30;
    positives.push(`Debt-to-asset ratio of ${Math.round(debtToAsset * 100)}% — strong balance sheet.`);
  } else if (debtToAsset <= 0.50) {
    score += 20;
    positives.push(`Debt-to-asset ratio of ${Math.round(debtToAsset * 100)}% — acceptable.`);
  } else if (debtToAsset <= 0.70) {
    score += 10;
    gaps.push(`Debt-to-asset ratio of ${Math.round(debtToAsset * 100)}% — elevated. Target below 50%.`);
    actions.push("Prioritise debt reduction to improve your balance sheet position.");
  } else {
    score += 0;
    gaps.push(`Debt-to-asset ratio of ${Math.round(debtToAsset * 100)}% — high financial leverage.`);
    actions.push("Urgently focus on reducing debt relative to your asset base.");
  }

  // ── Has non-retirement investment assets (20 pts)
  const hasInvestments = assets.some((a) =>
    ["unit_trust", "shares", "etf", "tfsa", "endowment", "offshore_investment"].includes(a.assetType),
  );
  if (hasInvestments) {
    score += 20;
    positives.push("Discretionary investment assets are present — wealth-building beyond retirement is in progress.");
  } else {
    gaps.push("No discretionary investment assets (unit trusts, ETFs, TFSA) recorded.");
    actions.push("Start building a discretionary investment portfolio alongside retirement savings.");
  }

  // ── Asset diversification (10 pts)
  const uniqueTypes = new Set(assets.map((a) => a.assetType)).size;
  if (uniqueTypes >= 4) {
    score += 10;
    positives.push("Asset portfolio is diversified across multiple asset types.");
  } else if (uniqueTypes >= 2) {
    score += 5;
    actions.push("Consider diversifying across more asset classes to reduce concentration risk.");
  }

  // Note if no assets recorded
  if (assets.length === 0) {
    gaps.push("No assets recorded — add your assets to the profile for an accurate net worth score.");
    actions.push("Record all your assets (property, investments, retirement funds) in your profile.");
  }

  void monthlyNet;
  void annualDebtRepayments;

  return pillar("net_worth", score, positives, gaps, actions, dataComplete);
}

// ── Pillar 6: Goals ────────────────────────────────────────────────────────

function scoreGoals(profile: ClientProfile): HealthScorePillar {
  const goals = profile.goals ?? [];

  const positives: string[] = [];
  const gaps:      string[] = [];
  const actions:   string[] = [];

  let score = 0;
  const dataComplete = goals.length > 0;

  // ── Has at least one goal (30 pts)
  if (goals.length > 0) {
    score += 30;
    positives.push(`${goals.length} goal${goals.length > 1 ? "s" : ""} recorded — financial intentions are captured.`);
  } else {
    gaps.push("No goals recorded — without clear goals, financial planning lacks direction.");
    actions.push("Add at least one financial goal to your profile to anchor your plan.");
  }

  // ── Has emergency fund goal or emergency fund in place (25 pts)
  const hasEmergencyGoal = goals.some((g) => g.category === "emergency_fund");
  const hasEmergencyFund = profile.cashFlow.hasEmergencyFund;
  if (hasEmergencyGoal || hasEmergencyFund) {
    score += 25;
    positives.push("Emergency fund is a stated goal or confirmed to be in place.");
  } else {
    gaps.push("No emergency fund goal or confirmed emergency fund.");
    actions.push("Add an emergency fund goal — this is the financial foundation everything else builds on.");
  }

  // ── Has retirement goal (25 pts)
  const hasRetirementGoal = goals.some((g) => g.category === "retirement");
  if (hasRetirementGoal || profile.retirement?.targetRetirementAge) {
    score += 25;
    positives.push("Retirement planning is a stated priority.");
  } else {
    gaps.push("No retirement goal recorded.");
    actions.push("Add a retirement goal and run the Retirement Planner to quantify the target.");
  }

  // ── Goals in progress / achieved (20 pts)
  const activeGoals = goals.filter((g) => g.status === "in_progress" || g.status === "achieved").length;
  if (activeGoals > 0) {
    score += 20;
    positives.push(`${activeGoals} goal${activeGoals > 1 ? "s are" : " is"} actively in progress or achieved.`);
  } else if (goals.length > 0) {
    gaps.push("Goals exist but none are marked as in progress — update goal statuses.");
    actions.push("Review your goals and update their status to keep your plan current.");
  }

  return pillar("goals", score, positives, gaps, actions, dataComplete);
}

// ── Profile completeness ───────────────────────────────────────────────────

function calcProfileCompleteness(profile: ClientProfile): number {
  const checks = [
    !!profile.identity.firstName,
    !!profile.identity.dateOfBirth,
    !!profile.employment.monthlyGrossIncome,
    !!profile.employment.monthlyNetIncome,
    !!profile.cashFlow.monthlyEssentialExpenses,
    !!profile.cashFlow.monthlyDebtRepayments,
    profile.assets.length > 0,
    profile.liabilities.length > 0,
    profile.protection.length > 0,
    !!profile.medicalAid,
    !!profile.retirement,
    !!profile.estate,
    (profile.goals?.length ?? 0) > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

// ── Pillar builder helper ──────────────────────────────────────────────────

function pillar(
  id:           HealthScorePillarId,
  rawScore:     number,
  positives:    string[],
  gaps:         string[],
  actionItems:  string[],
  dataComplete: boolean,
): HealthScorePillar {
  const score         = Math.min(100, Math.max(0, Math.round(rawScore)));
  const weight        = PILLAR_WEIGHTS[id];
  return {
    id,
    label:        PILLAR_LABELS[id],
    score,
    weight,
    weightedScore: Math.round(score * weight * 10) / 10,
    positives,
    gaps,
    actionItems,
    dataComplete,
  };
}

// ── Engine entry point ─────────────────────────────────────────────────────

/**
 * runHealthScore
 *
 * Pure function — given a ClientProfile, returns a complete HealthScoreResult
 * across all six pillars.
 */
export function runHealthScore(clientProfile: ClientProfile): HealthScoreResult {
  const pillars = [
    scoreCashFlow(clientProfile),
    scoreProtection(clientProfile),
    scoreRetirement(clientProfile),
    scoreEstate(clientProfile),
    scoreNetWorth(clientProfile),
    scoreGoals(clientProfile),
  ];

  // Weighted overall score
  const overallScore = Math.round(
    pillars.reduce((sum, p) => sum + p.score * p.weight, 0),
  );

  const band = scoreToBand(overallScore);

  // Top 3 gaps (from pillars with lowest scores first)
  const sortedByScore = [...pillars].sort((a, b) => a.score - b.score);
  const topGaps: string[] = [];
  const topActionItems: string[] = [];

  for (const p of sortedByScore) {
    for (const gap of p.gaps) {
      if (topGaps.length < 3) topGaps.push(gap);
    }
  }
  for (const p of sortedByScore) {
    for (const action of p.actionItems) {
      if (topActionItems.length < 3) topActionItems.push(action);
    }
  }

  return {
    overallScore,
    band,
    pillars,
    topGaps,
    topActionItems,
    profileCompleteness: calcProfileCompleteness(clientProfile),
    calculatedAt: new Date().toISOString(),
  };
}

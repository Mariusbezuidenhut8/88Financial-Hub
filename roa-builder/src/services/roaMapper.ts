/**
 * roaMapper.ts
 *
 * Builds a pre-populated ROAState from a PlatformRecord.
 * Uses @88fh/financial-health-score to derive context for each advice area.
 *
 * The adviser edits the pre-filled text — nothing is locked.
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import { runHealthScore } from "@88fh/financial-health-score";
import { makeInitialROAState } from "../data/roaInitialState";
import type { ROAState, ROAAdviceItem, ROARecommendation } from "../types/roa.types";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function fmtR(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency", currency: "ZAR", maximumFractionDigits: 0,
  }).format(amount);
}

function nextId(): string {
  return `rec_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Advice item pre-population ───────────────────────────────────────────────

function buildAdviceItems(profile: ClientProfile, record: PlatformRecord): ROAAdviceItem[] {
  const score  = runHealthScore(profile);
  const to     = record.toolOutputs;
  const items  = makeInitialROAState().adviceItems;
  const age    = profile.identity.dateOfBirth ? calcAge(profile.identity.dateOfBirth) : null;
  const gross  = profile.employment?.monthlyGrossIncome ?? 0;
  const retAge = profile.retirement?.targetRetirementAge ?? 65;
  const yearsLeft = age !== null ? Math.max(0, retAge - age) : null;

  // Retirement
  const retPillar  = score.pillars.find((p) => p.id === "retirement");
  const retNeed    = retPillar?.gaps[0] ?? "Retirement readiness requires further review.";
  const retOutput  = to.retirementAnalysis;

  items[0] = {
    ...items[0]!,
    clientNeedIdentified:
      retOutput
        ? `Client has ${fmtR(retOutput.retirementCapitalProjected ?? 0)} projected vs ${fmtR(retOutput.retirementCapitalRequired ?? 0)} required. Monthly shortfall: ${fmtR((retOutput.incomeGapMonthly ?? 0))}. ${retNeed}`
        : `Client is ${age ?? "?"} years old with ${yearsLeft !== null ? yearsLeft : "?"} years to target retirement age of ${retAge}. ${retNeed}`,
  };

  // Protection
  const protPillar = score.pillars.find((p) => p.id === "protection");
  const protNeed   = protPillar?.gaps.slice(0, 2).join(" ") ?? "Protection cover requires review.";
  const protOutput = to.protectionAnalysis;

  items[1] = {
    ...items[1]!,
    clientNeedIdentified:
      protOutput
        ? `Life cover shortfall: ${fmtR(protOutput.lifeCoverShortfall ?? 0)}. Income protection needed: ${protOutput.incomeProtectionNeeded ? "Yes" : "No"}. ${protNeed}`
        : protNeed,
  };

  // Estate
  const estatePillar = score.pillars.find((p) => p.id === "estate");
  const estateNeed   = estatePillar?.gaps.slice(0, 2).join(" ") ?? "Estate planning gaps identified.";
  const estateOutput = to.estateAnalysis;

  items[2] = {
    ...items[2]!,
    clientNeedIdentified:
      estateOutput
        ? `Estimated estate duty: ${fmtR(estateOutput.estimatedEstateDuty ?? 0)}. Liquidity shortfall: ${fmtR(estateOutput.estimatedLiquidityShortfall ?? 0)}. ${estateNeed}`
        : estateNeed,
  };

  // Investment
  const nwPillar   = score.pillars.find((p) => p.id === "net_worth");
  const invNeed    = nwPillar?.gaps[0] ?? (gross > 0 ? `Client has a monthly surplus available for structured investment. Recommend reviewing tax-efficient wrapper options.` : "Investment planning to be discussed.");
  const invOutput  = to.investmentAnalysis;

  items[3] = {
    ...items[3]!,
    clientNeedIdentified:
      invOutput?.recommendedStrategySummary
        ? invOutput.recommendedStrategySummary
        : invNeed,
  };

  return items;
}

// ── Recommendation pre-population ────────────────────────────────────────────

function buildRecommendations(profile: ClientProfile, record: PlatformRecord): ROARecommendation[] {
  const score = runHealthScore(profile);
  const to    = record.toolOutputs;
  const recs: ROARecommendation[] = [];

  // From health score top action items
  score.topActionItems.slice(0, 3).forEach((action, i) => {
    recs.push({
      id:       nextId(),
      area:     (["protection", "retirement", "estate"] as const)[i] ?? "retirement",
      action,
      priority: i === 0 ? "immediate" : "short_term",
      notes:    "",
    });
  });

  // From planner outputs (append if available)
  to.retirementAnalysis?.recommendations.slice(0, 1).forEach((r) => {
    recs.push({ id: nextId(), area: "retirement", action: r, priority: "short_term", notes: "" });
  });
  to.protectionAnalysis?.recommendations.slice(0, 1).forEach((r) => {
    recs.push({ id: nextId(), area: "protection", action: r, priority: "immediate", notes: "" });
  });
  to.estateAnalysis?.recommendations.slice(0, 1).forEach((r) => {
    recs.push({ id: nextId(), area: "estate", action: r, priority: "short_term", notes: "" });
  });
  to.investmentAnalysis?.recommendations.slice(0, 1).forEach((r) => {
    recs.push({ id: nextId(), area: "investment", action: r, priority: "long_term", notes: "" });
  });

  return recs;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * mapRecordToROA — builds the initial ROAState pre-populated from a PlatformRecord.
 * Adviser can edit any field before finalising.
 */
export function mapRecordToROA(record: PlatformRecord): ROAState {
  const base    = makeInitialROAState();
  const profile = record.clientProfile;

  const adviceItems   = buildAdviceItems(profile, record);
  const recommendations = buildRecommendations(profile, record);

  return {
    ...base,
    adviceItems,
    recommendations,
  };
}

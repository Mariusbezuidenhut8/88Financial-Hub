import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  DashboardPageData,
  DashboardToolCard,
  DashboardToolId,
  DashboardToolStatus,
} from "../types/dashboard.types";
import { TOOL_CASE_TYPE } from "../types/dashboard.types";

/**
 * dashboard-builder.ts
 *
 * Derives DashboardPageData from a PlatformRecord.
 * Pure function — no side effects.
 *
 * Public API:
 *   buildDashboardData(record) → DashboardPageData
 */

// ── Tool metadata ──────────────────────────────────────────────────────────

const TOOL_META: Record<DashboardToolId, { label: string; tagline: string }> = {
  funeral_cover_studio: {
    label:   "Funeral Cover Studio",
    tagline: "Ensure your family won't face financial hardship at the worst time.",
  },
  retirement_architect: {
    label:   "Retirement Architect",
    tagline: "See exactly where your retirement is headed — and what to do next.",
  },
  protection_planner: {
    label:   "Protection Planner",
    tagline: "Calculate how much life and disability cover your family needs.",
  },
  estate_architect: {
    label:   "Estate Architect",
    tagline: "Plan your estate, check for duty gaps, and make sure your will is in order.",
  },
  investment_planner: {
    label:   "Investment Planner",
    tagline: "Find the most tax-efficient way to invest your monthly surplus.",
  },
};

// ── Tool status derivation ─────────────────────────────────────────────────

function deriveToolStatus(
  toolId: DashboardToolId,
  record: PlatformRecord,
): DashboardToolStatus {
  const { toolOutputs, adviceCases } = record;
  const caseType = TOOL_CASE_TYPE[toolId];

  // Check for a completed advice case
  const hasCompleted = adviceCases.some(
    (c) => c.caseType === caseType && c.status === "completed",
  );
  if (hasCompleted) return "complete";

  // Check for an active (in-flight) advice case
  const hasActive = adviceCases.some(
    (c) =>
      c.caseType === caseType &&
      c.status !== "cancelled" &&
      c.status !== "completed",
  );
  if (hasActive) return "in_progress";

  // Fall back: mark complete if a tool output exists (e.g. populated outside an advice case)
  if (toolId === "funeral_cover_studio" && toolOutputs.funeralPlanningAnalysis) return "complete";
  if (toolId === "retirement_architect"  && toolOutputs.retirementAnalysis)       return "complete";
  if (toolId === "protection_planner"    && toolOutputs.protectionAnalysis)        return "complete";
  if (toolId === "estate_architect"      && toolOutputs.estateAnalysis)            return "complete";
  if (toolId === "investment_planner"    && toolOutputs.investmentAnalysis)        return "complete";

  return "available";
}

// ── Urgency signals ────────────────────────────────────────────────────────

function deriveUrgency(
  toolId: DashboardToolId,
  record: PlatformRecord,
): { isUrgent: boolean; urgencyTag?: string } {
  const { clientProfile } = record;
  const { protection, household, estate } = clientProfile;

  if (toolId === "funeral_cover_studio") {
    const hasFuneral = protection.some((p) => p.policyType === "funeral_cover");
    if (!hasFuneral) return { isUrgent: true, urgencyTag: "No funeral cover" };
  }

  if (toolId === "protection_planner") {
    const totalDependants =
      (household.children?.length ?? 0) +
      (household.dependantAdults?.length ?? 0) +
      (household.spouseOrPartner ? 1 : 0);
    const hasLife = protection.some((p) => p.policyType === "life_cover");
    if (totalDependants > 0 && !hasLife) {
      return { isUrgent: true, urgencyTag: "No life cover — dependants at risk" };
    }
  }

  if (toolId === "estate_architect") {
    const hasWill = estate?.hasValidWill === true;
    const hasMinorChildren = household.children?.some(
      (c) => c.isMinor === true,
    ) ?? false;
    if (!hasWill && hasMinorChildren) {
      return { isUrgent: true, urgencyTag: "No will — minor children affected" };
    }
    if (!hasWill) {
      return { isUrgent: true, urgencyTag: "No valid will on record" };
    }
  }

  return { isUrgent: false };
}

// ── Profile completion ─────────────────────────────────────────────────────

function deriveProfileCompletionPct(record: PlatformRecord): number {
  if (record.clientProfile.completionScore !== undefined) {
    return record.clientProfile.completionScore;
  }

  // Lightweight fallback: count completed sections (10 total)
  const completed = record.clientProfile.completedSections?.length ?? 0;
  return Math.round((completed / 10) * 100);
}

// ── Public API ─────────────────────────────────────────────────────────────

const TOOL_ORDER: DashboardToolId[] = [
  "funeral_cover_studio",
  "retirement_architect",
  "protection_planner",
  "estate_architect",
  "investment_planner",
];

/**
 * buildDashboardData — derives all display data for the Dashboard from a PlatformRecord.
 *
 * Pure function. Safe to call on every render or on a scheduled refresh.
 */
export function buildDashboardData(record: PlatformRecord): DashboardPageData {
  const { clientProfile, toolOutputs, adviceCases } = record;

  const tools: DashboardToolCard[] = TOOL_ORDER.map((toolId) => {
    const meta = TOOL_META[toolId];
    const status = deriveToolStatus(toolId, record);
    const urgency = deriveUrgency(toolId, record);
    return {
      toolId,
      label:      meta.label,
      tagline:    meta.tagline,
      status,
      isUrgent:   urgency.isUrgent,
      urgencyTag: urgency.urgencyTag,
    };
  });

  const hasActiveAdviceCase = adviceCases.some(
    (c) => c.status !== "cancelled" && c.status !== "completed",
  );

  const hs = toolOutputs.financialHealthScore;
  const healthScore: DashboardPageData["healthScore"] = hs
    ? {
        overallScore:   hs.overallScore,
        band:           hs.band,
        summary:        hs.summary,
        categoryScores: hs.categoryScores,
        calculatedAt:   hs.calculatedAt,
      }
    : undefined;

  return {
    firstName:           clientProfile.identity.firstName,
    healthScore,
    profileCompletionPct: deriveProfileCompletionPct(record),
    tools,
    hasActiveAdviceCase,
  };
}

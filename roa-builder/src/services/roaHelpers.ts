/**
 * roaHelpers.ts
 *
 * Display helpers for the ROA Builder.
 */

import type { AdviceArea, MeetingType, RecommendationPriority, ROAState } from "../types/roa.types";
import type { PlatformRecord } from "@88fh/master-data-model";

// ── Labels ────────────────────────────────────────────────────────────────────

export function getMeetingTypeLabel(type: MeetingType): string {
  switch (type) {
    case "face_to_face": return "Face to face";
    case "telephonic":   return "Telephonic";
    case "virtual":      return "Virtual / Video";
  }
}

export function getPriorityLabel(priority: RecommendationPriority): string {
  switch (priority) {
    case "immediate":   return "Immediate";
    case "short_term":  return "Short term (3–12 months)";
    case "long_term":   return "Long term (12+ months)";
  }
}

export function getPriorityBadge(priority: RecommendationPriority): string {
  switch (priority) {
    case "immediate":   return "bg-red-100 text-red-800";
    case "short_term":  return "bg-amber-100 text-amber-800";
    case "long_term":   return "bg-blue-100 text-blue-800";
  }
}

export function getAreaLabel(area: AdviceArea): string {
  switch (area) {
    case "retirement":  return "Retirement Planning";
    case "protection":  return "Life & Protection";
    case "estate":      return "Estate Planning";
    case "investment":  return "Investment Planning";
  }
}

// ── Reference number ──────────────────────────────────────────────────────────

export function buildReferenceNo(
  record: PlatformRecord,
  state: ROAState,
): string {
  const { firstName, lastName } = record.clientProfile.identity;
  const initials = `${firstName[0] ?? "X"}${lastName[0] ?? "X"}`.toUpperCase();
  const year     = new Date(state.meetingDate || new Date()).getFullYear();
  const seq      = state.roaId.slice(-4).toUpperCase();
  return `ROA-${initials}-${year}-${seq}`;
}

// ── Currency formatter ────────────────────────────────────────────────────────

export function fmtROACurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency", currency: "ZAR", maximumFractionDigits: 0,
  }).format(amount);
}

// ── Date formatter ────────────────────────────────────────────────────────────

export function fmtROADate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

// ── Completeness check ────────────────────────────────────────────────────────

export function isStepComplete(step: string, state: ROAState): boolean {
  switch (step) {
    case "client":
      return state.clientConfirmed && state.adviserName.trim().length > 0 && state.meetingDate.length > 0;
    case "needs":
      return state.primaryObjective.trim().length > 0;
    case "advice":
      return state.adviceItems.filter((i) => i.included).every((i) => i.adviceGiven.trim().length > 0);
    case "recommendations":
      return state.recommendations.length > 0;
    case "document":
      return true;
    case "declaration":
      return state.adviserDeclarationConfirmed;
    default:
      return false;
  }
}

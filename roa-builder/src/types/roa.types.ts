/**
 * roa.types.ts
 *
 * All types for the Record of Advice builder.
 * The ROA is a FAIS-compliant advice document generated at the end of
 * a planning engagement.
 */

// ── Identifiers ──────────────────────────────────────────────────────────────

export type AdviceArea = "retirement" | "protection" | "estate" | "investment";

export type MeetingType = "face_to_face" | "telephonic" | "virtual";

export type RecommendationPriority = "immediate" | "short_term" | "long_term";

export type ROAStatus = "draft" | "complete";

// ── Advice item (one per planning area) ─────────────────────────────────────

export interface ROAAdviceItem {
  area:                 AdviceArea;
  areaLabel:            string;
  /** Whether this area is relevant for this client — adviser can toggle */
  included:             boolean;
  /** Pre-populated from health score gaps / planner outputs */
  clientNeedIdentified: string;
  /** Adviser fills in — the specific advice given */
  adviceGiven:          string;
  /** Adviser fills in — why this advice is appropriate */
  basisForAdvice:       string;
  /** Adviser fills in — product or action recommended */
  productOrAction:      string;
}

// ── Recommendation row ───────────────────────────────────────────────────────

export interface ROARecommendation {
  id:                    string;
  area:                  AdviceArea;
  action:                string;
  priority:              RecommendationPriority;
  estimatedMonthlyCost?: number;
  notes:                 string;
}

// ── Full ROA wizard state ────────────────────────────────────────────────────

export interface ROAState {
  roaId:  string;
  status: ROAStatus;

  // ── Step 1: Client & meeting details ──────────────────────────────────────
  clientConfirmed:   boolean;
  adviserName:       string;
  adviserFSPNumber:  string;
  meetingDate:       string;  // ISO date
  meetingType:       MeetingType;

  // ── Step 2: Needs analysis ────────────────────────────────────────────────
  primaryObjective:   string;
  clientRiskProfile:  string;
  keyCircumstances:   string;

  // ── Step 3: Advice per area ───────────────────────────────────────────────
  adviceItems: ROAAdviceItem[];

  // ── Step 4: Recommendations ───────────────────────────────────────────────
  recommendations: ROARecommendation[];

  // ── Step 6: Declaration ───────────────────────────────────────────────────
  conflictsOfInterest:         string;
  adviserDeclarationConfirmed: boolean;
  completedAt?:                string;
}

// ── Completed ROA (returned on finish) ───────────────────────────────────────

export interface ROAResult {
  roaId:       string;
  state:       ROAState;
  completedAt: string;
  /** Reference number for filing — e.g. "ROA-ZK-2026-001" */
  referenceNo: string;
}

/**
 * @88fh/roa-builder
 *
 * FAIS-compliant Record of Advice builder.
 *
 * Typical usage:
 *   import { ROABuilderPage } from "@88fh/roa-builder";
 *
 *   <ROABuilderPage
 *     record={platformRecord}
 *     onComplete={(result) => saveROA(result)}
 *     onBackToDashboard={() => router.push("/adviser")}
 *   />
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type {
  AdviceArea,
  MeetingType,
  RecommendationPriority,
  ROAStatus,
  ROAAdviceItem,
  ROARecommendation,
  ROAState,
  ROAResult,
} from "./types/roa.types";

// ── Steps metadata ──────────────────────────────────────────────────────────

export { roaSteps } from "./data/roaSteps";
export type { ROAStepKey } from "./data/roaSteps";

// ── Services ────────────────────────────────────────────────────────────────

export { mapRecordToROA }    from "./services/roaMapper";
export {
  buildReferenceNo,
  fmtROACurrency,
  fmtROADate,
  getMeetingTypeLabel,
  getPriorityLabel,
  getPriorityBadge,
  getAreaLabel,
  isStepComplete,
} from "./services/roaHelpers";

// ── Page ────────────────────────────────────────────────────────────────────

export { ROABuilderPage }     from "./pages/ROABuilderPage";
export type { ROABuilderPageProps } from "./pages/ROABuilderPage";

// ── Wizard ──────────────────────────────────────────────────────────────────

export { ROAWizard }          from "./components/roa/ROAWizard";
export type { ROAWizardProps } from "./components/roa/ROAWizard";

// ── Components ──────────────────────────────────────────────────────────────

export { ROAProgressHeader }      from "./components/roa/ROAProgressHeader";
export { ROAClientStep }          from "./components/roa/ROAClientStep";
export { ROANeedsStep }           from "./components/roa/ROANeedsStep";
export { ROAAdviceStep }          from "./components/roa/ROAAdviceStep";
export { ROARecommendationsStep } from "./components/roa/ROARecommendationsStep";
export { ROADocumentStep }        from "./components/roa/ROADocumentStep";
export { ROADeclarationStep }     from "./components/roa/ROADeclarationStep";

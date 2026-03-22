/**
 * protectionPlannerBuilder.ts
 *
 * Convenience assembler — builds a complete ProtectionPlannerResult from a
 * wizard state + client profile in a single call.
 *
 * Usage:
 *   const result = buildProtectionPlannerResult(clientProfile, state);
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  ProtectionPlannerState,
  ProtectionPlannerResult,
} from "../types/protectionPlanner.types";
import { toAnalysisInput, runProtectionEngine } from "./protectionPlannerMapper";

type ClientProfile = PlatformRecord["clientProfile"];

/**
 * buildProtectionPlannerResult
 *
 * Orchestrates:
 *   1. toAnalysisInput  — resolve state + profile into engine input
 *   2. runProtectionEngine — run the four-pillar needs engine
 */
export function buildProtectionPlannerResult(
  clientProfile: ClientProfile,
  state: ProtectionPlannerState,
): ProtectionPlannerResult {
  const input = toAnalysisInput(state, clientProfile);
  return runProtectionEngine(input);
}

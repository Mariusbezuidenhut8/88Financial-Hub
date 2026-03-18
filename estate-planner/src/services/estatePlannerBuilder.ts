/**
 * estatePlannerBuilder.ts
 *
 * Convenience assembler — builds a complete EstatePlannerResult from a
 * wizard state + client profile in a single call.
 *
 * Usage:
 *   const result = buildEstatePlannerResult(clientProfile, state);
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  EstatePlannerState,
  EstatePlannerResult,
} from "../types/estatePlanner.types";
import { toAnalysisInput, runAnalysisEngine } from "./estatePlannerMapper";

type ClientProfile = PlatformRecord["clientProfile"];

/**
 * buildEstatePlannerResult
 *
 * Orchestrates:
 *   1. toAnalysisInput  — resolve state + profile into engine input
 *   2. runAnalysisEngine — run the analysis engine
 *
 * Returns a complete EstatePlannerResult with calculatedAt timestamp.
 */
export function buildEstatePlannerResult(
  clientProfile: ClientProfile,
  state: EstatePlannerState,
): EstatePlannerResult {
  const input = toAnalysisInput(state, clientProfile);
  return runAnalysisEngine(input);
}

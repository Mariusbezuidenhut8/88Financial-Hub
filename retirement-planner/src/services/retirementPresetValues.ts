/**
 * retirementPresetValues.ts
 *
 * Standalone service that returns assumption preset values.
 * Re-exports getAssumptionPresetValues from the types module so that
 * consumers can import it from services/ without touching the types layer.
 *
 * Integer percentage convention: 10 = 10%.
 */

export type {
  RetirementAssumptionPreset,
  AssumptionPresetValues,
} from "../types/retirement-planner.types";

export { getAssumptionPresetValues } from "../types/retirement-planner.types";

import { ID, ISODate, Currency, GoalCategory } from "./common.types";

/**
 * GoalRecord — a single financial goal.
 * Stored as a flat array on ClientProfile.
 *
 * USED BY: Financial Health Score, Investment Analysis, dashboard
 */
export interface GoalRecord {
  /** REQUIRED */
  goalId: ID;

  /** REQUIRED */
  category: GoalCategory;

  /** REQUIRED — human-readable title */
  title: string;

  /** OPTIONAL */
  description?: string;

  /** OPTIONAL */
  targetAmount?: Currency;

  /** OPTIONAL — YYYY-MM-DD */
  targetDate?: ISODate;

  /** REQUIRED — 1 (highest) to 5 (lowest) */
  priority: 1 | 2 | 3 | 4 | 5;

  /** OPTIONAL */
  status?: "not_started" | "in_progress" | "on_track" | "at_risk" | "achieved";

  /** OPTIONAL — current progress towards target */
  currentProgress?: Currency;

  /** OPTIONAL — monthly amount being saved towards this goal */
  monthlyContribution?: Currency;

  /** OPTIONAL — links to a toolOutput if this goal has been analysed */
  linkedToolOutputKey?: string;
}

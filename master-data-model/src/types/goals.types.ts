import { CurrencyZAR } from "./common.types";

export type GoalCategory =
  | "retirement"
  | "education"
  | "emergency_fund"
  | "home_purchase"
  | "debt_freedom"
  | "funeral_protection"
  | "estate_readiness"
  | "travel"
  | "business"
  | "wealth_building"
  | "other";

export type GoalHorizon = "short_term" | "medium_term" | "long_term";
// short = < 3 years, medium = 3–10 years, long = 10+ years

export type GoalStatus = "not_started" | "in_progress" | "on_track" | "behind" | "achieved";

export interface Goal {
  id: string;
  category: GoalCategory;
  horizon: GoalHorizon;
  description: string;
  targetAmount?: CurrencyZAR;
  targetDate?: string;
  currentProgress?: CurrencyZAR;
  monthlyContribution?: CurrencyZAR;
  priority: "high" | "medium" | "low";
  status: GoalStatus;
  linkedToolOutputId?: string;   // Links to tool output if analysed
  notes?: string;
}

export interface Goals {
  goals: Goal[];
  topPriority?: string;   // goalId of highest priority
}

import { ID, ISODateTime, AdviceCaseType, AdviceCaseStatus } from "./common.types";

/**
 * AdviceCase — a specific planning journey for one client.
 *
 * Each case captures a snapshot of inputs + outputs AT THE TIME of advice.
 * Once status = "completed", the case is IMMUTABLE — never edit snapshots.
 *
 * USED BY: ROA Builder, dashboard (case history), compliance reporting
 */
export interface AdviceCase {
  /** REQUIRED */
  caseId: ID;

  /** REQUIRED */
  caseType: AdviceCaseType;

  /** REQUIRED */
  status: AdviceCaseStatus;

  /** REQUIRED */
  linkedClientId: ID;

  /** REQUIRED — human-readable case title */
  title: string;

  /** REQUIRED */
  createdAt: ISODateTime;

  /** REQUIRED */
  updatedAt: ISODateTime;

  /** OPTIONAL — ISO datetime when status became "completed" */
  completedAt?: ISODateTime;

  /** OPTIONAL — adviser who handled this case */
  advisorId?: ID;

  /**
   * OPTIONAL — immutable snapshot of the ClientProfile at time of advice.
   * Captured when case is completed. Never update after capture.
   */
  inputsSnapshot?: Record<string, unknown>;

  /**
   * OPTIONAL — immutable snapshot of ToolOutputs relevant to this case.
   * Captured when case is completed. Never update after capture.
   */
  outputsSnapshot?: Record<string, unknown>;

  /** OPTIONAL — human-readable summary of the recommendation given */
  recommendationSummary?: string;

  /** OPTIONAL — free-text adviser notes */
  notes?: string;
}

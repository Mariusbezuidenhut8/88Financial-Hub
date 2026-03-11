export type AdviceCaseType =
  | "funeral_planning"
  | "retirement_planning"
  | "protection_planning"
  | "estate_planning"
  | "investment_planning"
  | "comprehensive_financial_plan";

export type AdviceCaseStatus =
  | "draft"
  | "in_progress"
  | "pending_client_acceptance"
  | "accepted"
  | "completed"
  | "cancelled";

export interface AdviceCase {
  caseId: string;
  caseType: AdviceCaseType;
  clientId: string;
  adviserId: string;
  status: AdviceCaseStatus;
  title?: string;

  // Snapshots at time of advice (immutable after completion)
  profileSnapshot?: Record<string, unknown>;
  outputSnapshot?: Record<string, unknown>;

  // ROA linkage
  roaDocumentId?: string;
  recommendationSummary?: string;
  adviserNotes?: string;

  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

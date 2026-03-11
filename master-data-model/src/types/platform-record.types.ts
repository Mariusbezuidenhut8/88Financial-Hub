import { AuditStamp } from "./common.types";
import { ClientProfile } from "./client-profile.types";
import { ToolOutputs } from "./tool-outputs.types";
import { AdviceCase } from "./advice-case.types";
import { DocumentRecord, AuditEvent, ConsentRecord, DisclosureRecord } from "./compliance.types";

/**
 * PlatformRecord — the complete top-level record for one client on the platform.
 *
 * This is what gets stored per client. It has five clearly separated concerns:
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  clientProfile   — stable facts about the client's life     │
 * │  toolOutputs     — computed scores and analyses             │
 * │  adviceCases     — advice journeys with immutable snapshots  │
 * │  documents       — generated PDFs, ROAs, disclosures        │
 * │  auditEvents     — immutable event log (compliance trail)    │
 * └─────────────────────────────────────────────────────────────┘
 *
 * RULE: Never write tool outputs into clientProfile.
 * RULE: Never edit auditEvents — only append.
 * RULE: adviceCases hold snapshots — never mutate a closed case.
 */
export interface PlatformRecord {
  /** REQUIRED — unique platform identifier */
  recordId: string;

  /** REQUIRED — the client's full financial profile */
  clientProfile: ClientProfile;

  /**
   * Tool outputs — computed by planning engines.
   * Populated after a tool run. Never populated by user input directly.
   */
  toolOutputs: ToolOutputs;

  /**
   * Advice journeys. Each case captures a snapshot of inputs + outputs
   * at the time of advice. Immutable once status = "completed".
   */
  adviceCases: AdviceCase[];

  /**
   * Generated documents — ROAs, needs analyses, product schedules, disclosures.
   * Stored as metadata references (actual files stored in object storage).
   */
  documents: DocumentRecord[];

  /**
   * Audit event log. Append-only. Never edit or delete entries.
   * Every significant action is recorded here for FAIS compliance.
   */
  auditEvents: AuditEvent[];

  /**
   * Consent and disclosure acceptance records.
   * Stored separately from audit events for easier compliance reporting.
   */
  consentRecords: ConsentRecord[];
  disclosureRecords: DisclosureRecord[];

  /** REQUIRED — record-level metadata */
  audit: AuditStamp;

  /**
   * Schema version — increment when breaking changes are made to the model.
   * Used to trigger migration logic.
   */
  schemaVersion: number;

  /** Soft delete flag — never hard-delete client records */
  isArchived: boolean;
}

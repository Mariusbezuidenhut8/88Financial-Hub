import { ID, ISODateTime, AuditStamp } from "./common.types";
import { ClientProfile } from "./client-profile.types";
import { ToolOutputs } from "./tool-outputs.types";
import { AdviceCase } from "./advice-case.types";
import { DocumentRecord, AuditEvent, ConsentRecord, DisclosureRecord } from "./compliance.types";

/**
 * PlatformRecord — the complete top-level record for one client on the platform.
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  clientProfile   — stable facts about the client's financial life │
 * │  toolOutputs     — computed scores and analyses (never raw input) │
 * │  adviceCases     — advice journeys with immutable snapshots       │
 * │  documents       — generated PDFs, ROAs, disclosures              │
 * │  auditEvents     — immutable event log (FAIS compliance trail)    │
 * │  consentRecords  — POPI and data consent                         │
 * │  disclosureRecords — FAIS disclosure acknowledgements             │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * RULES:
 * - Never write tool outputs into clientProfile
 * - Never edit or delete auditEvents — append only
 * - Once an AdviceCase is "completed", its snapshots are immutable
 * - Never hard-delete a PlatformRecord — use isArchived instead
 */
export interface PlatformRecord {
  /** REQUIRED — unique platform record identifier */
  recordId: ID;

  /** REQUIRED — the client's full financial profile */
  clientProfile: ClientProfile;

  /**
   * Tool outputs — computed by planning engines on demand.
   * Re-computed when relevant profile data changes.
   */
  toolOutputs: ToolOutputs;

  /**
   * Advice journeys. Each case holds an immutable snapshot of inputs
   * and outputs at the time of advice.
   */
  adviceCases: AdviceCase[];

  /**
   * Generated document metadata — ROAs, needs analyses, quotations.
   * Actual files live in object storage (referenced by storageUrl).
   */
  documents: DocumentRecord[];

  /**
   * Append-only audit log. Every significant action recorded here.
   * Required for FAIS compliance and advisors PI insurance.
   */
  auditEvents: AuditEvent[];

  /** POPI Act and data processing consent records */
  consentRecords: ConsentRecord[];

  /** FAIS disclosure acknowledgements */
  disclosureRecords: DisclosureRecord[];

  /** Record-level timestamps */
  audit: AuditStamp;

  /**
   * Schema version — increment on breaking changes.
   * Used to trigger data migration logic.
   * Current version: 3
   */
  schemaVersion: 3;

  /** Soft-delete flag — never hard-delete client records */
  isArchived: boolean;
}

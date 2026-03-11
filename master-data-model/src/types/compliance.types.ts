import { ID, ISODateTime, DocumentType, AuditEventType } from "./common.types";

/**
 * ConsentRecord — POPI Act and data processing consent.
 * Stored at PlatformRecord.consentRecords.
 */
export interface ConsentRecord {
  /** REQUIRED */
  id: ID;

  /** REQUIRED */
  consentType:
    | "popi_act"
    | "data_processing"
    | "marketing"
    | "product_disclosure"
    | "needs_analysis"
    | "advice_given";

  /** REQUIRED — consent form version */
  version: string;

  /** REQUIRED */
  acceptedAt: ISODateTime;

  /** REQUIRED */
  channel: "web" | "app" | "paper" | "advisor_captured";

  /** OPTIONAL */
  ipAddress?: string;

  /** OPTIONAL — base64 data URL of digital signature */
  signatureDataUrl?: string;
}

/**
 * DisclosureRecord — FAIS disclosure acknowledgement.
 * Stored at PlatformRecord.disclosureRecords.
 */
export interface DisclosureRecord {
  /** REQUIRED */
  id: ID;

  /** REQUIRED */
  disclosureType: string;

  /** REQUIRED */
  version: string;

  /** REQUIRED */
  shownAt: ISODateTime;

  /** OPTIONAL — null if shown but not yet accepted */
  acceptedAt?: ISODateTime;

  /** OPTIONAL — links to DocumentRecord */
  documentId?: ID;
}

/**
 * DocumentRecord — metadata for a generated document.
 * Actual file stored in object storage (S3, Firebase Storage, etc.).
 * Stored at PlatformRecord.documents.
 */
export interface DocumentRecord {
  /** REQUIRED */
  documentId: ID;

  /** REQUIRED */
  clientId: ID;

  /** OPTIONAL — links to the advice case this document belongs to */
  caseId?: ID;

  /** REQUIRED */
  documentType: DocumentType;

  /** REQUIRED */
  title: string;

  /** REQUIRED */
  version: string;

  /** REQUIRED */
  createdAt: ISODateTime;

  /** OPTIONAL — adviserId or "system" */
  createdBy?: ID;

  /** OPTIONAL — object storage URL or path */
  storageUrl?: string;

  /** OPTIONAL — signed at by client */
  signedAt?: ISODateTime;

  /** OPTIONAL — additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * AuditEvent — a single immutable event in the compliance trail.
 * Stored at PlatformRecord.auditEvents.
 *
 * RULE: Never edit or delete audit events. Append only.
 */
export interface AuditEvent {
  /** REQUIRED */
  auditEventId: ID;

  /** REQUIRED */
  clientId: ID;

  /** OPTIONAL */
  caseId?: ID;

  /** REQUIRED */
  eventType: AuditEventType;

  /** REQUIRED */
  eventTimestamp: ISODateTime;

  /** REQUIRED */
  actorType: "client" | "advisor" | "system" | "admin";

  /** OPTIONAL */
  actorId?: ID;

  /** REQUIRED — human-readable description */
  summary: string;

  /** OPTIONAL — structured event payload */
  details?: Record<string, unknown>;
}

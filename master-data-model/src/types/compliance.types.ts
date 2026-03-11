export interface ConsentRecord {
  id: string;
  consentType:
    | "data_processing"
    | "marketing"
    | "popi_act"
    | "product_disclosure"
    | "needs_analysis"
    | "advice_given";
  version: string;
  acceptedAt: string;
  channel: "web" | "app" | "paper" | "advisor_captured";
  ipAddress?: string;
  signatureDataUrl?: string;
}

export interface DisclosureRecord {
  id: string;
  disclosureType: string;
  version: string;
  shownAt: string;
  acceptedAt?: string;
  documentId?: string;
}

export interface AuditEvent {
  id: string;
  eventType:
    | "profile_created"
    | "profile_updated"
    | "tool_accessed"
    | "advice_case_created"
    | "document_generated"
    | "consent_given"
    | "disclosure_viewed"
    | "signature_captured";
  description: string;
  performedBy: string;     // adviserId or "self"
  performedAt: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentRecord {
  id: string;
  documentType:
    | "record_of_advice"
    | "needs_analysis"
    | "product_schedule"
    | "disclosure"
    | "application_form"
    | "identity_document"
    | "other";
  linkedCaseId?: string;
  fileName: string;
  fileUrl?: string;         // Storage reference
  generatedAt: string;
  signedAt?: string;
  version: number;
}

export interface ComplianceRecord {
  consentRecords: ConsentRecord[];
  disclosureRecords: DisclosureRecord[];
  auditEvents: AuditEvent[];
  documents: DocumentRecord[];
  advisorNotes: { id: string; note: string; createdAt: string; adviserId: string }[];
}

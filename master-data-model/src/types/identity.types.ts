import { ISODate, MaritalStatus, PreferredLanguage } from "./common.types";

/**
 * Identity — who the client is.
 * USED BY: all tools (name/ID for documents), Estate Architect (marital status)
 */
export interface Identity {
  /** REQUIRED */
  firstName: string;

  /** REQUIRED */
  lastName: string;

  /** OPTIONAL — preferred display name */
  preferredName?: string;

  /** OPTIONAL — SA ID number; required for application forms and ROA */
  idNumber?: string;

  /** OPTIONAL — for non-SA citizens */
  passportNumber?: string;

  /** OPTIONAL — YYYY-MM-DD */
  dateOfBirth?: ISODate;

  /** OPTIONAL — computed from dateOfBirth if absent */
  age?: number;

  /** OPTIONAL */
  gender?: "male" | "female" | "other" | "prefer_not_to_say";

  /** REQUIRED — affects estate planning, protection needs, household structure */
  maritalStatus: MaritalStatus;

  /** OPTIONAL — default "South African" */
  nationality?: string;

  /** OPTIONAL — used for document generation and communication */
  preferredLanguage?: PreferredLanguage;
}

/**
 * ContactDetails — how to reach the client.
 * USED BY: Funeral Cover Studio (required for application), ROA Builder
 */
export interface ContactDetails {
  /** OPTIONAL — primary contact */
  mobileNumber?: string;

  /** OPTIONAL */
  alternativeNumber?: string;

  /** OPTIONAL */
  emailAddress?: string;

  /** OPTIONAL */
  communicationPreference?: "whatsapp" | "phone" | "email" | "sms";

  /** OPTIONAL — required for application forms */
  physicalAddress?: import("./common.types").Address;

  /** OPTIONAL — if different from physical */
  postalAddress?: import("./common.types").Address;
}

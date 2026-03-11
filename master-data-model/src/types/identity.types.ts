import { Gender, MaritalStatus, Address } from "./common.types";

export type PreferredLanguage =
  | "English"
  | "Afrikaans"
  | "Zulu"
  | "Xhosa"
  | "Sotho"
  | "Tswana"
  | "Pedi"
  | "Venda"
  | "Tsonga"
  | "Swati"
  | "Ndebele";

export type CommunicationChannel = "whatsapp" | "sms" | "email" | "call";

export interface ClientIdentity {
  clientId: string;                    // Unique platform ID, e.g. "cl_001"
  firstName: string;
  lastName: string;
  preferredName?: string;
  idNumber: string;                    // SA ID number
  passportNumber?: string;
  dateOfBirth: string;                 // YYYY-MM-DD
  age: number;                         // Derived, kept in sync
  gender: Gender;
  maritalStatus: MaritalStatus;
  nationality: string;                 // default "South African"
  preferredLanguage: PreferredLanguage;
  communicationPreferences: CommunicationChannel[];
  isAdvisorClient: boolean;
  adviserId?: string;
  profileCompletionScore?: number;     // 0–100, computed
}

export interface ContactDetails {
  mobileNumber: string;
  alternativeNumber?: string;
  emailAddress: string;
  physicalAddress: Address;
  postalAddress?: Address;             // If different from physical
  preferredContactTime?: "morning" | "afternoon" | "evening";
}

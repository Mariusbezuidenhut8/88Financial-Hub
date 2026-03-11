export type SAProvince =
  | "Eastern Cape"
  | "Free State"
  | "Gauteng"
  | "KwaZulu-Natal"
  | "Limpopo"
  | "Mpumalanga"
  | "North West"
  | "Northern Cape"
  | "Western Cape";

export type Gender = "male" | "female";

export type MaritalStatus =
  | "single"
  | "married"
  | "married_out_of_community"
  | "married_in_community"
  | "living_with_partner"
  | "widowed"
  | "divorced"
  | "separated";

export type EmploymentStatus =
  | "employed_full_time"
  | "employed_part_time"
  | "self_employed"
  | "business_owner"
  | "unemployed"
  | "retired"
  | "student";

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export type CurrencyZAR = number; // Always in ZAR

export interface Address {
  line1: string;
  line2?: string;
  suburb: string;
  city: string;
  province: SAProvince;
  postalCode: string;
  country: string; // default "South Africa"
}

export interface DateRange {
  from: string; // ISO date YYYY-MM-DD
  to?: string;  // null = ongoing
}

export interface AuditStamp {
  createdAt: string;  // ISO datetime
  updatedAt: string;
  createdBy?: string; // adviserId or "self"
  updatedBy?: string;
}

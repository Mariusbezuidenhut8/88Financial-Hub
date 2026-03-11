import { Gender } from "./common.types";

export interface SpouseOrPartner {
  firstName: string;
  lastName: string;
  idNumber?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: Gender;
  employmentStatus?: string;
  monthlyIncome?: number;
  isFinanciallyDependent: boolean;
}

export interface Child {
  id: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  age: number;
  gender?: Gender;
  isDependent: boolean;
  isFullTimeStudent?: boolean;
  hasDisability?: boolean;
  requiresSpecialCare?: boolean;
  estimatedAnnualEducationCost?: number;
}

export interface DependantAdult {
  id: string;
  relationship: "parent" | "parent_in_law" | "sibling" | "other";
  firstName: string;
  lastName?: string;
  age?: number;
  isFinanciallySupported: boolean;
  monthlySupport?: number;
  hasDisability?: boolean;
}

export interface Household {
  hasSpouseOrPartner: boolean;
  spouseOrPartner?: SpouseOrPartner;
  numberOfChildren: number;
  children: Child[];
  dependantAdults: DependantAdult[];
  parentsSupported: number;
  extendedFamilySupported: number;
  hasGuardianshipNeeds: boolean;
  nominatedGuardian?: string;
  householdNotes?: string;
}

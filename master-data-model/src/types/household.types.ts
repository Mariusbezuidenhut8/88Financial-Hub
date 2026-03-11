import { ID, ISODate, DependantRelationship } from "./common.types";

/**
 * HouseholdMember — unified interface for spouse, children, parents, and
 * any other financially linked person.
 *
 * Used for:
 * - spouse/partner (relationship = "spouse" | "partner")
 * - children (relationship = "child")
 * - parents supported (relationship = "parent")
 * - extended dependants
 */
export interface HouseholdMember {
  /** REQUIRED */
  memberId: ID;

  /** REQUIRED */
  relationship: DependantRelationship;

  /** OPTIONAL */
  firstName?: string;

  /** OPTIONAL */
  lastName?: string;

  /** OPTIONAL */
  age?: number;

  /** OPTIONAL */
  dateOfBirth?: ISODate;

  /** OPTIONAL */
  gender?: "male" | "female" | "other";

  /** REQUIRED — drives protection and income replacement calculations */
  financiallyDependent: boolean;

  /** OPTIONAL */
  livesWithClient?: boolean;

  /** OPTIONAL — monthly amount client contributes to this person */
  monthlySupport?: number;

  /** OPTIONAL */
  hasDisability?: boolean;

  /** OPTIONAL — for children */
  isFullTimeStudent?: boolean;

  /** OPTIONAL — for children: estimated annual cost */
  educationCostAnnual?: number;

  /** OPTIONAL */
  notes?: string;
}

/**
 * HouseholdProfile — the client's family and dependant structure.
 *
 * USED BY: Financial Health Score, Protection Planner, Estate Architect,
 *          Funeral Cover Studio, Retirement Architect
 */
export interface HouseholdProfile {
  /** REQUIRED — drives all downstream dependant calculations */
  hasSpouseOrPartner: boolean;

  /**
   * OPTIONAL — present if hasSpouseOrPartner = true.
   * Uses HouseholdMember with relationship = "spouse" | "partner".
   */
  spouseOrPartner?: HouseholdMember;

  /**
   * REQUIRED — flat list of all household members (children, parents,
   * extended family). Does NOT include spouseOrPartner (that's separate).
   * Empty array is valid — means no additional dependants.
   */
  dependants: HouseholdMember[];

  /** REQUIRED — count of children (living with or dependent on client) */
  numberOfChildren: number;

  /** REQUIRED — count of dependent adults other than spouse */
  numberOfDependentAdults: number;

  /** REQUIRED — used in protection and funeral cover calculations */
  parentsSupported: number;

  /** REQUIRED */
  extendedFamilySupported: number;

  /** OPTIONAL — triggers guardian planning in estate tool */
  hasMinorChildren?: boolean;

  /** OPTIONAL — for estate planning */
  guardianshipNeeds?: boolean;

  /** OPTIONAL — name of nominated guardian */
  nominatedGuardian?: string;
}

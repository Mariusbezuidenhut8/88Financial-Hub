import { ID, AssetType, Currency } from "./common.types";

/**
 * AssetRecord — a single asset of any type.
 * All assets are stored as a flat array on ClientProfile.
 *
 * Benefits of flat array vs nested-by-category:
 * - simpler queries (filter by assetType)
 * - easier to add new asset types
 * - same shape for all rendering components
 *
 * USED BY: Financial Health Score, Retirement Architect, Estate Architect
 */
export interface AssetRecord {
  /** REQUIRED */
  assetId: ID;

  /** REQUIRED */
  assetType: AssetType;

  /** REQUIRED — human-readable label */
  description: string;

  /** REQUIRED */
  owner: "self" | "spouse" | "joint" | "trust" | "business" | "other";

  /** OPTIONAL — current market or fund value */
  currentValue?: Currency;

  /** OPTIONAL — can this be liquidated within 30 days? */
  liquid?: boolean;

  /** OPTIONAL — bank, insurer, asset manager, or property description */
  providerOrInstitution?: string;

  /** OPTIONAL — for non-ZAR assets */
  currency?: string;

  /** OPTIONAL — monthly contribution into this asset */
  monthlyContribution?: Currency;

  /** OPTIONAL — expected annual growth rate (%) */
  expectedReturnRate?: number;

  /** OPTIONAL — for property: outstanding bond amount */
  outstandingBond?: Currency;

  /** OPTIONAL — for property: monthly rental income */
  monthlyRentalIncome?: Currency;

  /** OPTIONAL — for retirement assets: not dutiable in estate */
  isRetirementAsset?: boolean;

  /** OPTIONAL */
  notes?: string;
}

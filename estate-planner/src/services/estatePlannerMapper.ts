/**
 * estatePlannerMapper.ts
 *
 * Three responsibilities:
 *
 * 1. mapClientProfileToEstatePlanner(clientProfile)
 *    Reads a ClientProfile and returns a prefilled EstatePlannerState
 *    with mapping warnings.
 *    Returns { estatePlannerState, mappingWarnings }.
 *
 * 2. toAnalysisInput(state, clientProfile)
 *    Resolves the wizard state + profile into a fully typed EstateAnalysisInput
 *    ready for the analysis engine.
 *
 * 3. runAnalysisEngine(input)
 *    Orchestrates the analysis engine and returns a complete EstatePlannerResult.
 */

import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  EstatePlannerMappingResult,
  EstatePlannerState,
  EstateAnalysisInput,
  EstatePlannerResult,
} from "../types/estatePlanner.types";
import { estatePlannerInitialState } from "../data/estatePlannerInitialState";
import { runEstateAnalysis } from "./estateAnalysisEngine";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

// ── Asset helpers ──────────────────────────────────────────────────────────

const RETIREMENT_ASSET_TYPES = new Set([
  "retirement_annuity",
  "pension_fund",
  "provident_fund",
  "preservation_fund",
  "living_annuity",
]);

const PROPERTY_ASSET_TYPES = new Set(["property"]);

const BUSINESS_ASSET_TYPES = new Set(["business"]);

const DISCRETIONARY_ASSET_TYPES = new Set([
  "unit_trust",
  "shares",
  "etf",
  "tfsa",
  "endowment",
  "offshore_investment",
  "crypto",
  "other",
]);

function sumAssets(
  assets: ClientProfile["assets"],
  typeSet: Set<string>,
): number {
  return assets
    .filter((a) => typeSet.has(a.assetType))
    .reduce((sum, a) => sum + (a.currentValue ?? 0), 0);
}

function sumCashAssets(assets: ClientProfile["assets"]): number {
  return assets
    .filter((a) =>
      ["cash", "savings_account", "money_market", "fixed_deposit"].includes(
        a.assetType,
      ),
    )
    .reduce((sum, a) => sum + (a.currentValue ?? 0), 0);
}

function sumLifeCover(protection: ClientProfile["protection"]): number {
  return protection
    .filter((p) => p.policyType === "life_cover" && p.status === "active")
    .reduce((sum, p) => sum + (p.coverAmount ?? 0), 0);
}

function hasMinorChildren(clientProfile: ClientProfile): boolean {
  const children = clientProfile.household.dependants.filter(
    (d) => d.relationship === "child",
  );
  return children.some((c) => {
    if (!c.dateOfBirth) return false;
    const ageMs = Date.now() - new Date(c.dateOfBirth).getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    return ageYears < 18;
  });
}

// ── 1. Profile → wizard state ──────────────────────────────────────────────

/**
 * mapClientProfileToEstatePlanner
 *
 * Pre-fills wizard state from a ClientProfile.
 * Returns { estatePlannerState, mappingWarnings }.
 */
export function mapClientProfileToEstatePlanner(
  clientProfile: ClientProfile,
): EstatePlannerMappingResult {
  const warnings: string[] = [];
  const { household, estate, assets, protection } = clientProfile;

  // ── Overview pre-fill
  const maritalStatus      = clientProfile.identity.maritalStatus;
  const hasSpouseOrPartner = household.spouseOrPartner !== undefined;
  const numberOfChildren   = household.numberOfChildren;
  const minorChildren      = hasMinorChildren(clientProfile);

  const existingWill          = estate?.hasWill;
  const beneficiariesReviewed = estate?.beneficiariesReviewed;

  if (!existingWill) {
    warnings.push("No will recorded on file — this is a critical estate planning gap.");
  }

  // ── Family step pre-fill
  const nominatedGuardian      = estate?.nominatedGuardian;
  const executorChosen         = estate?.executorChosen;
  const trustsInPlace          = estate?.trustsInPlace;
  const businessSuccessionNeeds = estate?.businessSuccessionNeeds;
  const specialBequests        = estate?.specialBequests;

  if (minorChildren && !nominatedGuardian) {
    warnings.push(
      "Minor children detected but no guardian nominated — this should be addressed urgently.",
    );
  }

  // ── Estate value flags
  const hasProperty   = assets.some((a) => PROPERTY_ASSET_TYPES.has(a.assetType));
  const hasBusiness   = assets.some((a) => BUSINESS_ASSET_TYPES.has(a.assetType));
  const hasRetirement = assets.some((a) => RETIREMENT_ASSET_TYPES.has(a.assetType));

  if (!hasProperty && !hasBusiness && !hasRetirement && assets.length === 0) {
    warnings.push(
      "No asset data found — estate valuation will be estimated as R0. Please update the asset profile.",
    );
  }

  // ── Liquidity: life cover available to estate
  const lifeCover = sumLifeCover(protection);
  if (lifeCover === 0) {
    warnings.push(
      "No active life cover found — estate liquidity may be insufficient to cover costs.",
    );
  }

  const estatePlannerState: EstatePlannerState = {
    ...estatePlannerInitialState,

    overview: {
      maritalStatus:         maritalStatus ?? undefined,
      hasSpouseOrPartner,
      numberOfChildren,
      hasMinorChildren:      minorChildren,
      existingWill,
      beneficiariesReviewed,
    },

    family: {
      ...estatePlannerInitialState.family,
      hasWill:                 existingWill,
      hasMinorChildren:        minorChildren,
      nominatedGuardian,
      beneficiariesReviewed,
      executorChosen,
      trustsInPlace,
      businessSuccessionNeeds,
      specialBequests,
    },

    estate: {
      ...estatePlannerInitialState.estate,
      includePrimaryResidence:    hasProperty,
      includeBusinessAssets:      hasBusiness,
      includeRetirementAssets:    false, // default: exclude (not dutiable)
      includeLifeCover:           lifeCover > 0,
      includeDiscretionaryAssets: true,
    },

    liquidity: {
      ...estatePlannerInitialState.liquidity,
      liquidityAvailableAtDeath: sumCashAssets(assets),
    },
  };

  return { estatePlannerState, mappingWarnings: warnings };
}

// ── 2. Wizard state → engine input ────────────────────────────────────────

/**
 * toAnalysisInput
 *
 * Resolves wizard state and client profile into a typed EstateAnalysisInput.
 * Asset values are calculated from the profile; wizard flags refine inclusion.
 */
export function toAnalysisInput(
  state: EstatePlannerState,
  clientProfile: ClientProfile,
): EstateAnalysisInput {
  const { estate, liquidity, family, review } = state;
  const { assets, protection, liabilities } = clientProfile;

  // ── Asset totals by inclusion flags
  const propertyValue      = estate.includePrimaryResidence
    ? sumAssets(assets, PROPERTY_ASSET_TYPES)
    : 0;
  const retirementValue    = estate.includeRetirementAssets
    ? sumAssets(assets, RETIREMENT_ASSET_TYPES)
    : 0;
  const businessValue      = estate.includeBusinessAssets
    ? sumAssets(assets, BUSINESS_ASSET_TYPES)
    : 0;
  const discretionaryValue = estate.includeDiscretionaryAssets
    ? sumAssets(assets, DISCRETIONARY_ASSET_TYPES)
    : 0;
  const cashValue          = sumCashAssets(assets);
  const additionalAssets   = estate.additionalAssetValue ?? 0;

  const totalAssets =
    propertyValue +
    retirementValue +
    businessValue +
    discretionaryValue +
    cashValue +
    additionalAssets;

  // ── Retirement assets excluded from dutiable estate
  const retirementAssetsExcluded = estate.includeRetirementAssets
    ? 0
    : sumAssets(assets, RETIREMENT_ASSET_TYPES);

  // ── Liability total
  const totalLiabilities =
    liabilities.reduce((sum, l) => sum + (l.outstandingBalance ?? 0), 0) +
    (estate.additionalLiabilityValue ?? 0);

  // ── Life cover for estate liquidity (active policies only)
  const lifeCoverForLiquidity = estate.includeLifeCover
    ? sumLifeCover(protection)
    : 0;

  return {
    totalAssets,
    totalLiabilities,
    retirementAssetsExcluded,
    lifeCoverForLiquidity,

    funeralCostsEstimate:    liquidity.funeralCostsEstimate    ?? 50_000,
    executorFeePercent:      liquidity.executorFeePercent       ?? 3.5,
    estimatedOtherCosts:     liquidity.estimatedOtherCosts      ?? 25_000,
    liquidityAvailableAtDeath: liquidity.liquidityAvailableAtDeath ?? 0,

    hasWill:                   family.hasWill                   ?? false,
    beneficiariesReviewed:     family.beneficiariesReviewed     ?? false,
    nominatedGuardian:         family.nominatedGuardian         ?? false,
    hasMinorChildren:          family.hasMinorChildren          ?? false,
    executorChosen:            family.executorChosen            ?? false,
    estateDistributionComplex: review.estateDistributionComplex ?? false,
    anySpecialNeedsDependants: review.anySpecialNeedsDependants ?? false,
    crossBorderAssets:         review.crossBorderAssets         ?? false,
  };
}

// ── 3. Full engine orchestration ───────────────────────────────────────────

/**
 * runAnalysisEngine
 *
 * Runs the estate analysis engine and returns a complete EstatePlannerResult.
 */
export function runAnalysisEngine(input: EstateAnalysisInput): EstatePlannerResult {
  const output = runEstateAnalysis(input);
  return {
    calculatedAt: new Date().toISOString(),
    ...output,
  };
}

/**
 * Tool Field Map — documents exactly which ClientProfile fields each tool reads.
 *
 * This is the authoritative reference for:
 * - Frontend developers: what to ask in onboarding to unblock each tool
 * - Backend developers: what to prefill when a tool opens
 * - Product: what is the minimum viable profile for each feature
 *
 * Format: each tool lists the profile fields it READS from ClientProfile.
 * Fields marked (REQUIRED) must be populated for the tool to function.
 * Fields marked (OPTIONAL) improve output quality but are not blocking.
 */

export const TOOL_FIELD_MAP = {

  /**
   * Financial Health Score
   * Gives a 0–100 score across 7 categories.
   * Broadest coverage — touches almost every profile section.
   */
  financialHealthScore: {
    reads: {
      identity: [
        "age",                           // REQUIRED — risk benchmarks are age-adjusted
      ],
      household: [
        "numberOfChildren",              // REQUIRED — dependant load
        "parentsSupported",              // REQUIRED — dependant load
        "hasSpouseOrPartner",            // OPTIONAL — dual income consideration
      ],
      employment: [
        "employmentStatus",              // REQUIRED — income stability flag
        "isSelfEmployed",                // REQUIRED — volatility flag
      ],
      cashFlow: [
        "monthlyNetIncome",              // REQUIRED
        "monthlyEssentialExpenses",      // REQUIRED
        "monthlyDebtRepayments",         // REQUIRED
        "monthlySavingsContributions",   // REQUIRED
        "monthlyRetirementContributions",// REQUIRED
        "hasEmergencyFund",              // REQUIRED
        "emergencyFundAmount",           // OPTIONAL
        "debtToIncomeRatio",             // COMPUTED — derived field
        "savingsRate",                   // COMPUTED — derived field
      ],
      assets: [
        "totalLiquidAssets",             // COMPUTED — from assets array
        "totalRetirementAssets",         // COMPUTED — from assets array
      ],
      protection: [
        "totalLifeCover",                // COMPUTED — from policies array
        "totalFuneralCover",             // COMPUTED — from policies array
        "medicalAid.hasMedicalAid",      // REQUIRED — healthcare coverage flag
      ],
      retirement: [
        "retirementReadinessStatus",     // COMPUTED — from Retirement Architect
        "totalCurrentRetirementSavings", // REQUIRED
        "targetRetirementAge",           // REQUIRED
      ],
      estate: [
        "hasWill",                       // REQUIRED
        "beneficiariesReviewed",         // OPTIONAL
      ],
      goals: [
        "goals",                         // OPTIONAL — goal completion influences score
      ],
    },
    minimumRequiredFields: [
      "identity.age",
      "cashFlow.monthlyNetIncome",
      "cashFlow.monthlyEssentialExpenses",
      "cashFlow.monthlyDebtRepayments",
      "cashFlow.hasEmergencyFund",
      "retirement.totalCurrentRetirementSavings",
      "retirement.targetRetirementAge",
      "estate.hasWill",
      "protection (at least one policy or explicit none)",
    ],
  },

  /**
   * Retirement Architect
   * Projects retirement fund, gap analysis, and monthly contribution needed.
   */
  retirementArchitect: {
    reads: {
      identity: [
        "dateOfBirth",                   // REQUIRED — years to retirement calculation
        "age",                           // REQUIRED
      ],
      household: [
        "spouseOrPartner.age",           // OPTIONAL — joint planning
        "spouseOrPartner.monthlyIncome", // OPTIONAL — household income picture
      ],
      employment: [
        "employmentStatus",              // REQUIRED — pensionable employment flag
        "hasGroupRetirementBenefit",     // OPTIONAL — existing scheme contribution
      ],
      cashFlow: [
        "monthlyNetIncome",              // REQUIRED — affordability of contributions
        "monthlyRetirementContributions",// REQUIRED — current contribution rate
        "monthlyDisposableIncome",       // COMPUTED — room to increase contributions
      ],
      assets: [
        "retirementAssets",              // REQUIRED — existing fund values and types
      ],
      retirement: [
        "targetRetirementAge",           // REQUIRED
        "desiredMonthlyRetirementIncome",// REQUIRED
        "riskTolerance",                 // REQUIRED — drives projected growth rate
        "inflationAssumption",           // OPTIONAL — defaults to 6% if absent
        "expectedReturnRate",            // OPTIONAL — adviser can override
        "expectedRetirementDuration",    // OPTIONAL — defaults to age 100 minus retirement age
      ],
    },
    minimumRequiredFields: [
      "identity.age",
      "cashFlow.monthlyNetIncome",
      "cashFlow.monthlyRetirementContributions",
      "assets.retirementAssets (can be empty array — zero balance is valid)",
      "retirement.targetRetirementAge",
      "retirement.desiredMonthlyRetirementIncome",
      "retirement.riskTolerance",
    ],
  },

  /**
   * Protection Planner
   * Calculates life, disability, income protection, and funeral cover needs.
   */
  protectionPlanner: {
    reads: {
      identity: [
        "age",                           // REQUIRED — premium estimation, mortality risk
        "gender",                        // REQUIRED — premium estimation
        "maritalStatus",                 // REQUIRED — spouse cover need
      ],
      household: [
        "hasSpouseOrPartner",            // REQUIRED — spouse cover need
        "numberOfChildren",              // REQUIRED — child dependant load
        "children",                      // OPTIONAL — individual child ages for pricing
        "dependantAdults",               // OPTIONAL — additional dependant load
        "parentsSupported",              // REQUIRED — funeral/income protection load
      ],
      employment: [
        "employmentStatus",              // REQUIRED — income protection eligibility
        "isSelfEmployed",                // REQUIRED — no group cover assumption
        "hasGroupRiskBenefit",           // REQUIRED — reduces shortfall calculation
      ],
      cashFlow: [
        "monthlyNetIncome",              // REQUIRED — income to protect
        "monthlyEssentialExpenses",      // REQUIRED — minimum income replacement target
        "monthlyDebtRepayments",         // REQUIRED — debt-linked life cover need
      ],
      liabilities: [
        "outstandingBalance",            // REQUIRED — life cover to clear debt on death
        "type",                          // REQUIRED — home loan, vehicle, personal loan
      ],
      protection: [
        "policies",                      // REQUIRED — existing cover to offset shortfall
        "medicalAid",                    // OPTIONAL — context for premium affordability
      ],
    },
    minimumRequiredFields: [
      "identity.age",
      "identity.gender",
      "household.numberOfChildren",
      "household.parentsSupported",
      "cashFlow.monthlyNetIncome",
      "cashFlow.monthlyDebtRepayments",
      "liabilities (can be empty array)",
      "protection.policies (can be empty array — no cover is valid input)",
    ],
  },

  /**
   * Estate Architect
   * Calculates estate duty exposure, liquidity shortfall, and planning gaps.
   */
  estateArchitect: {
    reads: {
      identity: [
        "age",                           // REQUIRED — urgency of planning
        "maritalStatus",                 // REQUIRED — affects estate duty spouse rebate
        "idNumber",                      // REQUIRED — legal document generation
      ],
      household: [
        "hasSpouseOrPartner",            // REQUIRED — Section 4(q) abatement eligibility
        "spouseOrPartner",               // OPTIONAL — spouse details for estate calc
        "children",                      // OPTIONAL — minor children trigger trust needs
        "hasGuardianshipNeeds",          // REQUIRED
        "nominatedGuardian",             // OPTIONAL
      ],
      assets: [
        "properties",                    // REQUIRED — largest estate asset class
        "investments",                   // REQUIRED
        "retirementAssets",              // REQUIRED — note: exempt from estate duty
        "businessAssets",               // OPTIONAL — triggers succession planning
        "cashAndSavings",               // REQUIRED
        "vehicles",                      // OPTIONAL
        "totalNetWorth",                 // COMPUTED
      ],
      liabilities: [
        "outstandingBalance",            // REQUIRED — reduces dutiable estate
      ],
      protection: [
        "policies",                      // REQUIRED — life cover available for liquidity
        "totalLifeCover",               // COMPUTED
      ],
      estate: [
        "hasWill",                       // REQUIRED
        "willLastUpdated",               // OPTIONAL — staleness flag
        "executorAppointed",             // REQUIRED
        "hasTrust",                      // OPTIONAL
        "estimatedEstateDuty",           // COMPUTED by this tool, stored back here
        "estimatedEstateLiquidityShortfall", // COMPUTED
        "hasBusinessInterest",           // OPTIONAL
        "hasSuccessionPlan",             // OPTIONAL
      ],
    },
    minimumRequiredFields: [
      "identity.maritalStatus",
      "assets.properties (can be empty array)",
      "assets.investments (can be empty array)",
      "assets.cashAndSavings (can be empty array)",
      "liabilities (can be empty array)",
      "protection.policies (can be empty array)",
      "estate.hasWill",
      "estate.executorAppointed",
    ],
  },

  /**
   * Funeral Cover Studio
   * Recommends appropriate funeral cover and processes the application.
   */
  funeralCoverStudio: {
    reads: {
      identity: [
        "firstName",                     // REQUIRED — policy document
        "lastName",                      // REQUIRED
        "idNumber",                      // REQUIRED — application
        "dateOfBirth",                   // REQUIRED
        "age",                           // REQUIRED — eligibility check
        "gender",                        // REQUIRED
      ],
      contact: [
        "mobileNumber",                  // REQUIRED
        "emailAddress",                  // REQUIRED
        "physicalAddress",               // REQUIRED — policy address
      ],
      household: [
        "hasSpouseOrPartner",            // REQUIRED — spouse cover option
        "spouseOrPartner",               // OPTIONAL — spouse details for cover
        "children",                      // OPTIONAL — child cover configuration
        "dependantAdults",               // OPTIONAL — extended family cover
        "parentsSupported",              // OPTIONAL — parent cover option
      ],
      cashFlow: [
        "monthlyNetIncome",              // REQUIRED — affordability band
      ],
      protection: [
        "policies",                      // REQUIRED — existing funeral/life cover
        "totalFuneralCover",             // COMPUTED — gap analysis
      ],
    },
    minimumRequiredFields: [
      "identity.firstName",
      "identity.lastName",
      "identity.idNumber",
      "identity.age",
      "identity.gender",
      "contact.mobileNumber",
      "cashFlow.monthlyNetIncome",
    ],
  },

  /**
   * ROA Builder
   * Generates a FAIS-compliant Record of Advice document.
   */
  roaBuilder: {
    reads: {
      identity: [
        "firstName",                     // REQUIRED — document
        "lastName",                      // REQUIRED
        "idNumber",                      // REQUIRED
      ],
      contact: [
        "mobileNumber",                  // REQUIRED
        "emailAddress",                  // REQUIRED
        "physicalAddress",               // REQUIRED
      ],
      // Plus the linked AdviceCase (inputs + outputs snapshot)
      // Plus the linked ToolOutput for the relevant module
      // Plus ConsentRecords and DisclosureRecords
      adviceCase: [
        "caseType",                      // REQUIRED
        "profileSnapshot",               // REQUIRED — inputs at time of advice
        "outputSnapshot",                // REQUIRED — recommendations at time of advice
        "recommendationSummary",         // REQUIRED
        "adviserNotes",                  // OPTIONAL
      ],
      compliance: [
        "consentRecords",                // REQUIRED — proof of POPI consent
        "disclosureRecords",             // REQUIRED — proof of disclosure
        "advisorNotes",                  // OPTIONAL
      ],
    },
    minimumRequiredFields: [
      "identity.firstName",
      "identity.lastName",
      "identity.idNumber",
      "contact (full)",
      "At least one completed AdviceCase with profileSnapshot and outputSnapshot",
      "At least one DisclosureRecord",
    ],
  },

} as const;

export type ToolName = keyof typeof TOOL_FIELD_MAP;

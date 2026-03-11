/**
 * TOOL_FIELD_MAP — authoritative reference for which ClientProfile fields
 * each tool reads.
 *
 * Use this for:
 * - Onboarding: what minimum data unlocks each tool
 * - Frontend: what to prefill when a tool opens
 * - Backend: validation before running an engine
 * - Product: understanding dependencies between profile and features
 *
 * Format: dot-notation paths into ClientProfile.
 * Paths marked REQUIRED must be non-null for the tool to run.
 * Paths marked OPTIONAL improve output quality.
 * Paths marked COMPUTED are derived — do not collect from user.
 */
export const TOOL_FIELD_MAP = {

  financialHealthScore: {
    description: "Scores the client's financial health across 5 categories (0–100)",
    reads: [
      { path: "identity.age",                              required: true  },
      { path: "household.numberOfChildren",                required: true  },
      { path: "household.parentsSupported",                required: true  },
      { path: "household.hasSpouseOrPartner",              required: false },
      { path: "employment.employmentStatus",               required: true  },
      { path: "employment.monthlyNetIncome",               required: true  },
      { path: "cashFlow.monthlyEssentialExpenses",         required: true  },
      { path: "cashFlow.monthlyDebtRepayments",            required: true  },
      { path: "cashFlow.monthlySavings",                   required: true  },
      { path: "cashFlow.monthlyRetirementContributions",   required: true  },
      { path: "cashFlow.hasEmergencyFund",                 required: true  },
      { path: "cashFlow.emergencyFundAmount",              required: false },
      { path: "cashFlow.debtToIncomeRatio",                required: false, note: "COMPUTED" },
      { path: "cashFlow.savingsRate",                      required: false, note: "COMPUTED" },
      { path: "assets[]",                                  required: false, note: "liquid assets total" },
      { path: "protection[]",                              required: true,  note: "at least declare none or some" },
      { path: "medicalAid.hasMedicalAid",                  required: false },
      { path: "retirement.currentRetirementSavings",       required: true  },
      { path: "retirement.targetRetirementAge",            required: true  },
      { path: "estate.hasWill",                            required: true  },
      { path: "goals[]",                                   required: false },
    ],
    minimumToRun: [
      "identity.age",
      "employment.monthlyNetIncome",
      "cashFlow.monthlyEssentialExpenses",
      "cashFlow.monthlyDebtRepayments",
      "cashFlow.hasEmergencyFund",
      "retirement.currentRetirementSavings",
      "retirement.targetRetirementAge",
      "estate.hasWill",
    ],
  },

  retirementArchitect: {
    description: "Projects retirement fund, gap, and required monthly contribution",
    reads: [
      { path: "identity.dateOfBirth",                      required: true  },
      { path: "identity.age",                              required: true  },
      { path: "household.spouseOrPartner",                 required: false, note: "for joint planning" },
      { path: "employment.employmentStatus",               required: true  },
      { path: "employment.monthlyNetIncome",               required: true  },
      { path: "employment.hasGroupRetirementBenefit",      required: false },
      { path: "cashFlow.monthlyRetirementContributions",   required: true  },
      { path: "cashFlow.disposableIncomeEstimate",         required: false, note: "room to increase contributions" },
      { path: "assets[]",                                  required: true,  note: "filter by isRetirementAsset" },
      { path: "retirement.targetRetirementAge",            required: true  },
      { path: "retirement.desiredRetirementIncomeMonthly", required: true  },
      { path: "retirement.currentRetirementSavings",       required: true  },
      { path: "retirement.riskTolerance",                  required: true  },
      { path: "retirement.retirementVehicles[]",           required: false },
      { path: "retirement.inflationAssumption",            required: false, note: "defaults to 6% if absent" },
      { path: "retirement.expectedReturnRate",             required: false, note: "adviser override" },
    ],
    minimumToRun: [
      "identity.age",
      "employment.monthlyNetIncome",
      "cashFlow.monthlyRetirementContributions",
      "retirement.targetRetirementAge",
      "retirement.desiredRetirementIncomeMonthly",
      "retirement.currentRetirementSavings",
      "retirement.riskTolerance",
    ],
  },

  protectionPlanner: {
    description: "Calculates life, disability, income protection, and funeral cover needs",
    reads: [
      { path: "identity.age",                              required: true  },
      { path: "identity.gender",                           required: true  },
      { path: "identity.maritalStatus",                    required: true  },
      { path: "household.hasSpouseOrPartner",              required: true  },
      { path: "household.numberOfChildren",                required: true  },
      { path: "household.dependants[]",                    required: false },
      { path: "household.parentsSupported",                required: true  },
      { path: "employment.employmentStatus",               required: true  },
      { path: "employment.monthlyNetIncome",               required: true  },
      { path: "employment.hasGroupRiskBenefit",            required: false },
      { path: "cashFlow.monthlyEssentialExpenses",         required: true  },
      { path: "cashFlow.monthlyDebtRepayments",            required: true  },
      { path: "liabilities[]",                             required: true,  note: "for debt-linked life cover" },
      { path: "protection[]",                              required: true,  note: "existing cover to offset shortfall" },
    ],
    minimumToRun: [
      "identity.age",
      "identity.gender",
      "identity.maritalStatus",
      "household.numberOfChildren",
      "household.parentsSupported",
      "employment.monthlyNetIncome",
      "cashFlow.monthlyEssentialExpenses",
      "cashFlow.monthlyDebtRepayments",
    ],
  },

  funeralCoverStudio: {
    description: "Recommends funeral cover and processes the application",
    reads: [
      { path: "identity.firstName",                        required: true  },
      { path: "identity.lastName",                         required: true  },
      { path: "identity.idNumber",                         required: true  },
      { path: "identity.dateOfBirth",                      required: true  },
      { path: "identity.age",                              required: true  },
      { path: "identity.gender",                           required: true  },
      { path: "contact.mobileNumber",                      required: true  },
      { path: "contact.emailAddress",                      required: false },
      { path: "contact.physicalAddress",                   required: true  },
      { path: "household.hasSpouseOrPartner",              required: true  },
      { path: "household.spouseOrPartner",                 required: false },
      { path: "household.dependants[]",                    required: false, note: "children + extended family for cover" },
      { path: "household.parentsSupported",                required: false },
      { path: "employment.monthlyNetIncome",               required: true,  note: "affordability band" },
      { path: "protection[]",                              required: true,  note: "existing funeral/life cover" },
    ],
    minimumToRun: [
      "identity.firstName",
      "identity.lastName",
      "identity.idNumber",
      "identity.age",
      "identity.gender",
      "contact.mobileNumber",
      "employment.monthlyNetIncome",
    ],
  },

  estateArchitect: {
    description: "Calculates estate duty, liquidity shortfall, and planning gaps",
    reads: [
      { path: "identity.age",                              required: true  },
      { path: "identity.maritalStatus",                    required: true,  note: "Section 4(q) spouse abatement" },
      { path: "identity.idNumber",                         required: true,  note: "legal document generation" },
      { path: "household.hasSpouseOrPartner",              required: true  },
      { path: "household.spouseOrPartner",                 required: false },
      { path: "household.dependants[]",                    required: false, note: "minor children trigger trust need" },
      { path: "household.hasMinorChildren",                required: true  },
      { path: "assets[]",                                  required: true  },
      { path: "liabilities[]",                             required: true  },
      { path: "protection[]",                              required: true,  note: "life cover available for liquidity" },
      { path: "retirement.retirementVehicles[]",           required: false, note: "exempt from estate duty" },
      { path: "estate",                                    required: true  },
    ],
    minimumToRun: [
      "identity.maritalStatus",
      "household.hasMinorChildren",
      "estate.hasWill",
    ],
  },

  roaBuilder: {
    description: "Generates a FAIS-compliant Record of Advice document",
    reads: [
      { path: "identity.firstName",                        required: true  },
      { path: "identity.lastName",                         required: true  },
      { path: "identity.idNumber",                         required: true  },
      { path: "contact (full)",                            required: true  },
      { path: "adviceCases[].caseType",                   required: true  },
      { path: "adviceCases[].profileSnapshot",            required: true  },
      { path: "adviceCases[].outputSnapshot",             required: true  },
      { path: "adviceCases[].recommendationSummary",      required: true  },
      { path: "adviceCases[].notes",                      required: false },
      { path: "consentRecords[]",                         required: true  },
      { path: "disclosureRecords[]",                      required: true  },
    ],
    minimumToRun: [
      "identity.firstName",
      "identity.lastName",
      "identity.idNumber",
      "contact.physicalAddress",
      "At least one completed AdviceCase with profileSnapshot and outputSnapshot",
      "At least one ConsentRecord (popi_act or data_processing)",
      "At least one DisclosureRecord",
    ],
  },

} as const;

export type ToolName = keyof typeof TOOL_FIELD_MAP;

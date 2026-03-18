import React from "react";
import { DashboardPage } from "../pages/DashboardPage";
import type { FinancialHealthScoreResult } from "../types/financialHealth.types";

const mockScore: FinancialHealthScoreResult = {
  calculatedAt: new Date().toISOString(),
  overallScore: 63,
  band: "needs_attention",
  categoryScores: {
    cashFlow:     15,
    debt:         14,
    emergencyFund: 10,
    protection:   14,
    retirement:   10,
  },
  priorityActions: [
    "Increase retirement savings and review your long-term plan.",
    "Build emergency savings to at least 3 months of essential expenses.",
    "Put a valid will in place and review beneficiary nominations.",
  ],
  summary:
    "You have a reasonable financial base, but some important areas may benefit from review.",
  breakdown: {
    savingsRate:                0.15,
    debtToIncomeRatio:          0.17,
    emergencyMonths:            2.7,
    retirementContributionRate: 0.09,
  },
};

export default function DemoDashboardScreen() {
  return (
    <DashboardPage
      firstName="Thabo"
      scoreResult={mockScore}
      recommendedTools={[
        {
          key:      "retirement",
          title:    "Retirement Planner",
          reason:   "Your retirement readiness appears to need attention.",
          priority: 1,
          status:   "not_started",
        },
        {
          key:      "estate",
          title:    "Estate Planner",
          reason:   "Your estate planning basics may not yet be in place.",
          priority: 2,
          status:   "in_progress",
        },
        {
          key:      "protection",
          title:    "Protection Planner",
          reason:   "Your protection setup may need review.",
          priority: 3,
          status:   "completed",
        },
      ]}
      profileCompletion={{
        percent: 78,
        missingItems: [
          "Exact retirement product details",
          "Beneficiary nomination review",
          "Existing policy provider information",
        ],
      }}
      recentActivity={[
        {
          id:     "act_1",
          title:  "Financial health check completed",
          date:   new Date().toISOString(),
          status: "completed",
        },
        {
          id:     "act_2",
          title:  "Estate planner started",
          date:   new Date().toISOString(),
          status: "in_progress",
        },
      ]}
      documents={[]}
      onViewResults={()         => console.log("View full results")}
      onRefreshProfile={()      => console.log("Refresh profile")}
      onOpenTool={(toolKey)     => console.log("Open tool:", toolKey)}
      onUpdateProfile={()       => console.log("Update profile")}
      onContinueSelfService={() => console.log("Continue self-service")}
      onGuidedHelp={()          => console.log("Guided help")}
      onAdvisorHelp={()         => console.log("Advisor help")}
    />
  );
}

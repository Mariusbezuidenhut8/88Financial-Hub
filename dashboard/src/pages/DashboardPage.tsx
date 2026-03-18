import React from "react";
import type { FinancialHealthScoreResult } from "../types/financialHealth.types";
import type {
  DashboardToolItem,
  DashboardActivityItem,
  DashboardDocumentItem,
} from "../types/dashboard.types";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { HealthSummaryCard } from "../components/dashboard/HealthSummaryCard";
import { ActionPlanCard } from "../components/dashboard/ActionPlanCard";
import { RecommendedToolsGrid } from "../components/dashboard/RecommendedToolsGrid";
import { ProfileCompletionCard } from "../components/dashboard/ProfileCompletionCard";
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard";
import { DocumentsCard } from "../components/dashboard/DocumentsCard";
import { DashboardHelpCard } from "../components/dashboard/DashboardHelpCard";

export interface DashboardPageProps {
  firstName: string;
  scoreResult?: FinancialHealthScoreResult;
  recommendedTools: DashboardToolItem[];
  profileCompletion: {
    percent: number;
    missingItems: string[];
  };
  recentActivity: DashboardActivityItem[];
  documents: DashboardDocumentItem[];
  onViewResults: () => void;
  onRefreshProfile: () => void;
  onOpenTool: (toolKey: string) => void;
  onUpdateProfile: () => void;
  onViewDocument?: (id: string) => void;
  onContinueSelfService: () => void;
  onGuidedHelp: () => void;
  onAdvisorHelp: () => void;
}

/**
 * DashboardPage
 *
 * Main client dashboard — home base after onboarding.
 * Host app provides its own page chrome (nav, sidebar, etc.).
 *
 * Data flow:
 *   buildDashboardData(PlatformRecord) → DashboardPageData
 *   host maps DashboardPageData → DashboardPageProps
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({
  firstName,
  scoreResult,
  recommendedTools,
  profileCompletion,
  recentActivity,
  documents,
  onViewResults,
  onRefreshProfile,
  onOpenTool,
  onUpdateProfile,
  onViewDocument,
  onContinueSelfService,
  onGuidedHelp,
  onAdvisorHelp,
}) => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">

        {/* A. Welcome header */}
        <DashboardHeader firstName={firstName} />

        {/* B. Health score + Profile completion — 2/3 + 1/3 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <HealthSummaryCard
              scoreResult={scoreResult}
              onViewResults={onViewResults}
              onRefreshProfile={onRefreshProfile}
            />
          </div>
          <div className="xl:col-span-1">
            <ProfileCompletionCard
              completionPercent={profileCompletion.percent}
              missingItems={profileCompletion.missingItems}
              onUpdateProfile={onUpdateProfile}
            />
          </div>
        </div>

        {/* C. Action plan + Help — 2/3 + 1/3 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ActionPlanCard actions={scoreResult?.priorityActions ?? []} />
          </div>
          <div className="xl:col-span-1">
            <DashboardHelpCard
              onContinueSelfService={onContinueSelfService}
              onGuidedHelp={onGuidedHelp}
              onAdvisorHelp={onAdvisorHelp}
            />
          </div>
        </div>

        {/* D. Recommended tools — full width */}
        <RecommendedToolsGrid tools={recommendedTools} onOpenTool={onOpenTool} />

        {/* E. Activity + Documents — 50/50 */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentActivityCard activities={recentActivity} />
          <DocumentsCard documents={documents} onViewDocument={onViewDocument} />
        </div>

      </div>
    </main>
  );
};

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { InvestmentPlannerResult } from "../types/investmentPlanner.types";
import { InvestmentPlannerWizard } from "../components/investment/InvestmentPlannerWizard";

type ClientProfile = PlatformRecord["clientProfile"];

export interface InvestmentPlannerPageProps {
  clientProfile:          ClientProfile;
  onBackToDashboard:      () => void;
  onRequestAdvisorHelp:   () => void;
  onComplete?:            (result: InvestmentPlannerResult) => void;
  onOpenRetirementPlanner?: () => void;
}

/**
 * InvestmentPlannerPage
 *
 * Full-width page shell for the Investment Planner.
 * max-w-6xl container constrains content on large screens.
 *
 * Usage:
 *   <InvestmentPlannerPage
 *     clientProfile={record.clientProfile}
 *     onBackToDashboard={() => router.push("/dashboard")}
 *     onRequestAdvisorHelp={() => router.push("/contact-adviser")}
 *   />
 */
export function InvestmentPlannerPage({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenRetirementPlanner,
}: InvestmentPlannerPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Fairbairn Consult
              </p>
              <h1 className="mt-0.5 text-lg font-bold text-slate-900">
                Investment Planner
              </h1>
            </div>
            <button
              type="button"
              onClick={onBackToDashboard}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Wizard */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <InvestmentPlannerWizard
          clientProfile={clientProfile}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onComplete={onComplete}
          onOpenRetirementPlanner={onOpenRetirementPlanner}
        />
      </main>
    </div>
  );
}

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { EstatePlannerResult } from "../types/estatePlanner.types";
import { EstatePlannerWizard } from "../components/estate/EstatePlannerWizard";

type ClientProfile = PlatformRecord["clientProfile"];

export interface EstatePlannerPageProps {
  clientProfile:            ClientProfile;
  onBackToDashboard:         () => void;
  onRequestAdvisorHelp:     () => void;
  onComplete?:              (result: EstatePlannerResult) => void;
  onOpenProtectionPlanner?: () => void;
}

/**
 * EstatePlannerPage
 *
 * Full-width page shell for the Estate Planner.
 * max-w-6xl container constrains content on large screens.
 *
 * Usage:
 *   <EstatePlannerPage
 *     clientProfile={record.clientProfile}
 *     onBackToDashboard={() => router.push("/dashboard")}
 *     onRequestAdvisorHelp={() => router.push("/contact-adviser")}
 *   />
 */
export function EstatePlannerPage({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenProtectionPlanner,
}: EstatePlannerPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                88Wealth Management
              </p>
              <h1 className="mt-0.5 text-lg font-bold text-slate-900">
                Estate Planner
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
        <EstatePlannerWizard
          clientProfile={clientProfile}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onComplete={onComplete}
          onOpenProtectionPlanner={onOpenProtectionPlanner}
        />
      </main>
    </div>
  );
}

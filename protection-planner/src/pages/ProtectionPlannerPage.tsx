import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { ProtectionPlannerResult } from "../types/protectionPlanner.types";
import { ProtectionPlannerWizard } from "../components/protection/ProtectionPlannerWizard";

type ClientProfile = PlatformRecord["clientProfile"];

export interface ProtectionPlannerPageProps {
  clientProfile:         ClientProfile;
  onBackToDashboard:      () => void;
  onRequestAdvisorHelp:  () => void;
  onComplete?:           (result: ProtectionPlannerResult) => void;
  onOpenEstatePlanner?:  () => void;
}

/**
 * ProtectionPlannerPage
 *
 * Full-width page shell for the Protection Planner.
 * max-w-6xl container constrains content on large screens.
 *
 * Usage:
 *   <ProtectionPlannerPage
 *     clientProfile={record.clientProfile}
 *     onBackToDashboard={() => router.push("/dashboard")}
 *     onRequestAdvisorHelp={() => router.push("/contact-adviser")}
 *   />
 */
export function ProtectionPlannerPage({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenEstatePlanner,
}: ProtectionPlannerPageProps) {
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
                Protection Planner
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
        <ProtectionPlannerWizard
          clientProfile={clientProfile}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onComplete={onComplete}
          onOpenEstatePlanner={onOpenEstatePlanner}
        />
      </main>
    </div>
  );
}

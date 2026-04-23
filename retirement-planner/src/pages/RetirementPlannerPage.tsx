import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { RetirementPlannerResult } from "../types/retirement-planner.types";
import { RetirementPlannerWizard } from "../components/retirement/RetirementPlannerWizard";

type ClientProfile = PlatformRecord["clientProfile"];

export interface RetirementPlannerPageProps {
  clientProfile:     ClientProfile;
  onComplete?:       (result: RetirementPlannerResult) => void;
  onGoToDashboard?:  () => void;
  onRequestAdvisor?: () => void;
}

/**
 * RetirementPlannerPage
 *
 * Full-width page shell for the Retirement Planner.
 * The `max-w-6xl` container constrains the content width on large screens
 * while the wizard inner content limits itself to `max-w-2xl` for readability.
 *
 * Usage:
 *   <RetirementPlannerPage
 *     clientProfile={record.clientProfile}
 *     onComplete={(result) => console.log(result)}
 *     onGoToDashboard={() => router.push("/dashboard")}
 *     onRequestAdvisor={() => router.push("/contact-adviser")}
 *   />
 */
export function RetirementPlannerPage({
  clientProfile,
  onComplete,
  onGoToDashboard,
  onRequestAdvisor,
}: RetirementPlannerPageProps) {
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
              <h1 className="mt-0.5 text-lg font-bold text-slate-900">Retirement Planner</h1>
            </div>
            {onGoToDashboard && (
              <button
                type="button"
                onClick={onGoToDashboard}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                ← Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wizard */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <RetirementPlannerWizard
          clientProfile={clientProfile}
          onComplete={onComplete}
          onGoToDashboard={onGoToDashboard}
          onRequestAdvisor={onRequestAdvisor}
        />
      </main>
    </div>
  );
}

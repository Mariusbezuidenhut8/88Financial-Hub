/**
 * ROAProgressHeader.tsx
 *
 * Step progress indicator for the ROA Builder wizard.
 */

import React from "react";
import { roaSteps } from "../../data/roaSteps";
import type { ROAStepKey } from "../../data/roaSteps";

export interface ROAProgressHeaderProps {
  currentStep: ROAStepKey;
  referenceNo?: string;
}

export function ROAProgressHeader({ currentStep, referenceNo }: ROAProgressHeaderProps) {
  const currentIndex = roaSteps.findIndex((s) => s.key === currentStep);

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Title row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Fairbairn Consult
            </p>
            <h1 className="mt-0.5 text-base font-bold text-slate-900">
              Record of Advice
            </h1>
          </div>
          {referenceNo && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {referenceNo}
            </span>
          )}
        </div>

        {/* Step indicators */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1">
          {roaSteps.map((step, idx) => {
            const done    = idx < currentIndex;
            const active  = idx === currentIndex;
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-shrink-0 flex-col items-center gap-1">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                      active ? "bg-slate-900 text-white"
                      : done  ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? "✓" : idx + 1}
                  </div>
                  <p className={`text-xs ${active ? "font-semibold text-slate-900" : "text-slate-400"}`}>
                    {step.shortLabel}
                  </p>
                </div>
                {idx < roaSteps.length - 1 && (
                  <div className={`mb-5 h-0.5 flex-1 transition ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

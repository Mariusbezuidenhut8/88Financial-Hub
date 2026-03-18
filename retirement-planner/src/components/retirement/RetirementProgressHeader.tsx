import React from "react";
import { RETIREMENT_PLANNER_STEPS } from "../../data/retirementPlannerSteps";
import type { RetirementPlannerStepId } from "../../data/retirementPlannerSteps";

export interface RetirementProgressHeaderProps {
  currentStepId: RetirementPlannerStepId;
  completedStepIds: RetirementPlannerStepId[];
  onStepClick: (stepId: RetirementPlannerStepId) => void;
}

export function RetirementProgressHeader({
  currentStepId,
  completedStepIds,
  onStepClick,
}: RetirementProgressHeaderProps) {
  const currentIndex = RETIREMENT_PLANNER_STEPS.findIndex((s) => s.id === currentStepId);
  const totalSteps   = RETIREMENT_PLANNER_STEPS.length;
  const progressPct  = Math.round(((currentIndex + 1) / totalSteps) * 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">
          {RETIREMENT_PLANNER_STEPS[currentIndex]?.label ?? ""}
        </span>
        <span>Step {currentIndex + 1} of {totalSteps}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Step tabs */}
      <nav aria-label="Retirement planner steps">
        <ol className="flex items-center gap-1 overflow-x-auto pb-1">
          {RETIREMENT_PLANNER_STEPS.map((step, i) => {
            const isCurrent   = step.id === currentStepId;
            const isCompleted = completedStepIds.includes(step.id);
            const isClickable = isCompleted && !isCurrent;

            return (
              <li key={step.id} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <span className="h-px w-3 flex-shrink-0 bg-slate-200" aria-hidden />
                )}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={[
                    "flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    isCurrent
                      ? "bg-slate-900 text-white"
                      : isCompleted
                      ? "bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-default",
                  ].join(" ")}
                >
                  <span className="hidden sm:inline">{step.shortLabel}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}

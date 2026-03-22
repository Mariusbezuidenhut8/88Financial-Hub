import React from "react";
import { protectionPlannerSteps } from "../../data/protectionPlannerSteps";
import type { ProtectionPlannerStepKey } from "../../data/protectionPlannerSteps";

export interface ProtectionProgressHeaderProps {
  currentStepIndex:  number;
  completedStepKeys: ProtectionPlannerStepKey[];
  onStepClick:       (key: ProtectionPlannerStepKey) => void;
  onBackToDashboard: () => void;
}

export function ProtectionProgressHeader({
  currentStepIndex,
  completedStepKeys,
  onStepClick,
  onBackToDashboard,
}: ProtectionProgressHeaderProps) {
  const currentStep     = protectionPlannerSteps[currentStepIndex];
  const totalSteps      = protectionPlannerSteps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Protection Planner</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Understand your protection gaps
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Step {currentStepIndex + 1} of {totalSteps}:{" "}
            <span className="font-medium text-slate-900">
              {currentStep?.label}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 lg:mt-1"
        >
          ← Dashboard
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Step tabs */}
      <nav aria-label="Protection planner steps" className="mt-3">
        <ol className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {protectionPlannerSteps.map((step, i) => {
            const isCurrent   = i === currentStepIndex;
            const isCompleted = completedStepKeys.includes(step.key);
            const isClickable = isCompleted && !isCurrent;

            return (
              <li key={step.key} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <span className="h-px w-3 flex-shrink-0 bg-slate-200" aria-hidden />
                )}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.key)}
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
    </section>
  );
}

import React, { useState, useCallback } from "react";
import type {
  RetirementPlannerState,
  RetirementPlannerResult,
  RetirementPrefill,
} from "../../types/retirement-planner.types";
import { getAssumptionPresetValues } from "../../types/retirement-planner.types";
import { retirementPlannerInitialState } from "../../data/retirementPlannerInitialState";
import { toProjectionInput, runFullProjection } from "../../services/retirementMapper";

import RetirementOverviewStep   from "../steps/RetirementOverviewStep";
import RetirementGoalsStep      from "../steps/RetirementGoalsStep";
import RetirementPositionStep   from "../steps/RetirementPositionStep";
import RetirementAssumptionsStep from "../steps/RetirementAssumptionsStep";
import RetirementResultsStep    from "../steps/RetirementResultsStep";
import RetirementStrategiesStep from "../steps/RetirementStrategiesStep";
import RetirementNextStep       from "../steps/RetirementNextStep";

// ── Step metadata ──────────────────────────────────────────────────────────

const STEPS = [
  { id: "overview",    label: "Overview" },
  { id: "goals",       label: "Your Goals" },
  { id: "position",    label: "Your Position" },
  { id: "assumptions", label: "Assumptions" },
  { id: "results",     label: "Your Projection" },
  { id: "strategies",  label: "Strategy Options" },
  { id: "next",        label: "Next Step" },
] as const;

type StepId = typeof STEPS[number]["id"];

// ── Initial state builder ──────────────────────────────────────────────────

function buildInitialState(prefill: RetirementPrefill): RetirementPlannerState {
  const preset =
    prefill.riskTolerance === "conservative" || prefill.riskTolerance === "moderately_conservative"
      ? ("conservative" as const)
      : prefill.riskTolerance === "growth" || prefill.riskTolerance === "aggressive"
      ? ("growth" as const)
      : ("balanced" as const);

  const presetValues = getAssumptionPresetValues(preset);

  return {
    ...retirementPlannerInitialState,
    overview: {
      currentAge:                 prefill.currentAge,
      currentRetirementSavings:   prefill.currentRetirementSavings,
      currentMonthlyContribution: prefill.monthlyRetirementContribution,
      monthlyIncome:              prefill.monthlyGrossIncome,
    },
    goals: {
      targetRetirementAge:  prefill.targetRetirementAge ?? 65,
      desiredMonthlyIncome: prefill.desiredMonthlyIncomeAtRetirement,
      incomeBasis:          "today_money",
    },
    position: {
      currentRetirementSavings:   prefill.currentRetirementSavings,
      monthlyContribution:        prefill.monthlyRetirementContribution,
      annualContributionIncrease: 5,
      includeNonRetirementAssets: false,
      nonRetirementAssetsValue:   0,
    },
    assumptions: {
      preset,
      ...presetValues,
    },
  };
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface RetirementWizardProps {
  prefill: RetirementPrefill;
  onComplete?: (result: RetirementPlannerResult) => void;
  onGoToDashboard?: () => void;
  onRequestAdvisor?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function RetirementWizard({
  prefill,
  onComplete,
  onGoToDashboard,
  onRequestAdvisor,
}: RetirementWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<RetirementPlannerState>(() =>
    buildInitialState(prefill),
  );

  const totalSteps  = STEPS.length;
  const currentStep = STEPS[currentStepIndex] as typeof STEPS[number];

  // ── Navigation ──────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCurrentStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, totalSteps - 1)));
  }, [totalSteps]);

  // ── State updater ────────────────────────────────────────────────────────

  const updateState = useCallback(
    <K extends keyof RetirementPlannerState>(
      key: K,
      value: RetirementPlannerState[K],
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // ── Projection trigger ───────────────────────────────────────────────────

  const runProjection = useCallback((): boolean => {
    const input = toProjectionInput(state);
    if (!input) return false;

    const result = runFullProjection(input);
    setState((prev) => ({ ...prev, result }));
    onComplete?.(result);
    return true;
  }, [state, onComplete]);

  const handleAssumptionsContinue = useCallback(() => {
    const ok = runProjection();
    if (ok) goNext();
  }, [runProjection, goNext]);

  // ── Render ───────────────────────────────────────────────────────────────

  const stepId: StepId = currentStep.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">

        <ProgressBar
          currentIndex={currentStepIndex}
          steps={STEPS}
          onStepClick={(i) => { if (i < currentStepIndex) goToStep(i); }}
        />

        <div className="mt-6">
          {stepId === "overview" && (
            <RetirementOverviewStep state={state.overview} onContinue={goNext} />
          )}

          {stepId === "goals" && (
            <RetirementGoalsStep
              state={state.goals}
              onChange={(v) => updateState("goals", v)}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {stepId === "position" && (
            <RetirementPositionStep
              state={state.position}
              onChange={(v) => updateState("position", v)}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {stepId === "assumptions" && (
            <RetirementAssumptionsStep
              state={state.assumptions}
              onChange={(v) => updateState("assumptions", v)}
              onContinue={handleAssumptionsContinue}
              onBack={goBack}
            />
          )}

          {stepId === "results" && state.result && (
            <RetirementResultsStep
              result={state.result}
              onContinue={goNext}
              onBack={goBack}
              onRequestAdvisor={onRequestAdvisor}
            />
          )}

          {stepId === "strategies" && state.result && (
            <RetirementStrategiesStep
              result={state.result}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {stepId === "next" && (
            <RetirementNextStep
              result={state.result}
              onGoToDashboard={onGoToDashboard}
              onRequestAdvisor={onRequestAdvisor}
              onBack={goBack}
            />
          )}
        </div>

      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────

interface ProgressBarProps {
  currentIndex: number;
  steps: typeof STEPS;
  onStepClick: (index: number) => void;
}

function ProgressBar({ currentIndex, steps, onStepClick }: ProgressBarProps) {
  return (
    <nav aria-label="Retirement planner progress">
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isDone    = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <li key={step.id} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <span className="h-px w-4 flex-shrink-0 bg-slate-200" aria-hidden />
              )}
              <button
                type="button"
                onClick={() => onStepClick(i)}
                disabled={!isDone}
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "bg-slate-900 text-white"
                    : isDone
                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-default"
                }`}
              >
                {i + 1}. {step.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

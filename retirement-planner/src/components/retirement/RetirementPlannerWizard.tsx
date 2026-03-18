import React, { useState, useCallback, useMemo } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  RetirementPlannerState,
  RetirementPlannerResult,
  RetirementPlannerGoals,
  RetirementPlannerPosition,
  RetirementPlannerAssumptions,
} from "../../types/retirement-planner.types";
import { mapClientProfileToRetirementPlanner } from "../../services/retirementMapper";
import { toProjectionInput, runFullProjection } from "../../services/retirementMapper";
import {
  RETIREMENT_PLANNER_STEPS,
  type RetirementPlannerStepId,
} from "../../data/retirementPlannerSteps";
import { RetirementProgressHeader } from "./RetirementProgressHeader";
import { RetirementOverviewStep }    from "./RetirementOverviewStep";
import { RetirementGoalsStep }       from "./RetirementGoalsStep";
import { RetirementPositionStep }    from "./RetirementPositionStep";
import { RetirementAssumptionsStep } from "./RetirementAssumptionsStep";
import { RetirementResultsStep }     from "./RetirementResultsStep";
import { RetirementStrategiesStep }  from "./RetirementStrategiesStep";
import { RetirementNextStep }        from "./RetirementNextStep";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

export interface RetirementPlannerWizardProps {
  clientProfile: ClientProfile;
  onComplete?:       (result: RetirementPlannerResult) => void;
  onGoToDashboard?:  () => void;
  onRequestAdvisor?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function RetirementPlannerWizard({
  clientProfile,
  onComplete,
  onGoToDashboard,
  onRequestAdvisor,
}: RetirementPlannerWizardProps) {
  // Map profile → initial state (memoised — only recalculates if profile reference changes)
  const { state: initialState, mappingWarnings } = useMemo(
    () => mapClientProfileToRetirementPlanner({ clientProfile } as PlatformRecord),
    [clientProfile],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<RetirementPlannerState>(initialState);
  const [completedIds, setCompletedIds] = useState<RetirementPlannerStepId[]>([]);

  const totalSteps   = RETIREMENT_PLANNER_STEPS.length;
  const currentStep  = RETIREMENT_PLANNER_STEPS[currentStepIndex];
  const currentStepId: RetirementPlannerStepId = currentStep.id;

  // ── Navigation ────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCompletedIds((prev) =>
      prev.includes(currentStepId) ? prev : [...prev, currentStepId],
    );
    setCurrentStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [currentStepId, totalSteps]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToStepId = useCallback(
    (id: RetirementPlannerStepId) => {
      const idx = RETIREMENT_PLANNER_STEPS.findIndex((s) => s.id === id);
      if (idx !== -1) setCurrentStepIndex(idx);
    },
    [],
  );

  // ── State updaters ────────────────────────────────────────────────────

  const updateGoals = useCallback(
    (goals: RetirementPlannerGoals) => setState((prev) => ({ ...prev, goals })),
    [],
  );

  const updatePosition = useCallback(
    (position: RetirementPlannerPosition) => setState((prev) => ({ ...prev, position })),
    [],
  );

  const updateAssumptions = useCallback(
    (assumptions: RetirementPlannerAssumptions) => setState((prev) => ({ ...prev, assumptions })),
    [],
  );

  // ── Projection trigger ────────────────────────────────────────────────

  const handleAssumptionsContinue = useCallback(() => {
    const input = toProjectionInput(state);
    if (!input) {
      // Missing required fields — navigate forward anyway so user can see result step
      goNext();
      return;
    }
    const result = runFullProjection(input);
    setState((prev) => ({ ...prev, result }));
    onComplete?.(result);
    goNext();
  }, [state, onComplete, goNext]);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">

        <RetirementProgressHeader
          currentStepId={currentStepId}
          completedStepIds={completedIds}
          onStepClick={goToStepId}
        />

        <div className="mt-6">

          {currentStepId === "overview" && (
            <RetirementOverviewStep
              state={state}
              mappingWarnings={mappingWarnings}
              onContinue={goNext}
            />
          )}

          {currentStepId === "goals" && (
            <RetirementGoalsStep
              state={state}
              onChange={updateGoals}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {currentStepId === "position" && (
            <RetirementPositionStep
              state={state}
              onChange={updatePosition}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {currentStepId === "assumptions" && (
            <RetirementAssumptionsStep
              state={state}
              onChange={updateAssumptions}
              onContinue={handleAssumptionsContinue}
              onBack={goBack}
            />
          )}

          {currentStepId === "results" && (
            <RetirementResultsStep
              state={state}
              onContinue={goNext}
              onBack={goBack}
              onRequestAdvisor={onRequestAdvisor}
            />
          )}

          {currentStepId === "strategies" && (
            <RetirementStrategiesStep
              state={state}
              onContinue={goNext}
              onBack={goBack}
            />
          )}

          {currentStepId === "next" && (
            <RetirementNextStep
              state={state}
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

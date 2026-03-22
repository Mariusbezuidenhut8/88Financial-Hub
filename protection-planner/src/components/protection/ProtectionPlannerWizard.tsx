import React, { useMemo, useState, useCallback } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  ProtectionPlannerState,
  ProtectionLifeStep as ProtectionLifeStepState,
  ProtectionIncomeStep as ProtectionIncomeStepState,
  ProtectionDreadStep as ProtectionDreadStepState,
  ProtectionDebtStep as ProtectionDebtStepState,
  ProtectionPlannerResult,
} from "../../types/protectionPlanner.types";
import {
  protectionPlannerSteps,
  type ProtectionPlannerStepKey,
} from "../../data/protectionPlannerSteps";
import {
  mapClientProfileToProtectionPlanner,
  toAnalysisInput,
  runProtectionEngine,
} from "../../services/protectionPlannerMapper";
import { ProtectionProgressHeader }  from "./ProtectionProgressHeader";
import { ProtectionOverviewStep }    from "./ProtectionOverviewStep";
import { ProtectionLifeStep }        from "./ProtectionLifeStep";
import { ProtectionIncomeStep }      from "./ProtectionIncomeStep";
import { ProtectionDreadStep }       from "./ProtectionDreadStep";
import { ProtectionDebtStep }        from "./ProtectionDebtStep";
import { ProtectionResultsStep }     from "./ProtectionResultsStep";
import { ProtectionNextStep }        from "./ProtectionNextStep";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

export interface ProtectionPlannerWizardProps {
  clientProfile:         ClientProfile;
  onBackToDashboard:      () => void;
  onRequestAdvisorHelp:  () => void;
  onComplete?:           (result: ProtectionPlannerResult) => void;
  onOpenEstatePlanner?:  () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

export function ProtectionPlannerWizard({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenEstatePlanner,
}: ProtectionPlannerWizardProps) {
  // Map profile → initial state (memoised)
  const { protectionPlannerState: mappedState, mappingWarnings } = useMemo(
    () => mapClientProfileToProtectionPlanner(clientProfile),
    [clientProfile],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState]   = useState<ProtectionPlannerState>(mappedState);
  const [completedKeys, setCompletedKeys] = useState<ProtectionPlannerStepKey[]>([]);

  const currentStep    = protectionPlannerSteps[currentStepIndex];
  const currentStepKey = currentStep?.key as ProtectionPlannerStepKey;

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCompletedKeys((prev: ProtectionPlannerStepKey[]) =>
      prev.includes(currentStepKey) ? prev : [...prev, currentStepKey],
    );
    setCurrentStepIndex((i: number) =>
      Math.min(i + 1, protectionPlannerSteps.length - 1),
    );
  }, [currentStepKey]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i: number) => Math.max(i - 1, 0));
  }, []);

  const goToKey = useCallback((key: ProtectionPlannerStepKey) => {
    const idx = protectionPlannerSteps.findIndex((s) => s.key === key);
    if (idx !== -1) setCurrentStepIndex(idx);
  }, []);

  // ── State updaters ─────────────────────────────────────────────────────────

  const updateLife = useCallback(
    (life: ProtectionLifeStepState) => setState((prev: ProtectionPlannerState) => ({ ...prev, life })),
    [],
  );

  const updateIncome = useCallback(
    (income: ProtectionIncomeStepState) => setState((prev: ProtectionPlannerState) => ({ ...prev, income })),
    [],
  );

  const updateDread = useCallback(
    (dread: ProtectionDreadStepState) => setState((prev: ProtectionPlannerState) => ({ ...prev, dread })),
    [],
  );

  const updateDebt = useCallback(
    (debt: ProtectionDebtStepState) => setState((prev: ProtectionPlannerState) => ({ ...prev, debt })),
    [],
  );

  // ── Engine trigger ─────────────────────────────────────────────────────────

  /**
   * handleDebtContinue — runs the four-pillar analysis engine before
   * navigating to the results step. Uses a setState callback to guarantee
   * the latest debt step state is captured without stale closure.
   */
  const handleDebtContinue = useCallback(() => {
    setState((prev: ProtectionPlannerState) => {
      const input  = toAnalysisInput(prev, clientProfile);
      const result = runProtectionEngine(input);
      onComplete?.(result);
      return { ...prev, result };
    });
    goNext();
  }, [clientProfile, goNext, onComplete]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 py-6">
      <ProtectionProgressHeader
        currentStepIndex={currentStepIndex}
        completedStepKeys={completedKeys}
        onStepClick={goToKey}
        onBackToDashboard={onBackToDashboard}
      />

      {currentStepKey === "overview" && (
        <ProtectionOverviewStep
          state={state}
          mappingWarnings={mappingWarnings}
          onNext={goNext}
        />
      )}

      {currentStepKey === "life" && (
        <ProtectionLifeStep
          state={state}
          onChange={updateLife}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "income" && (
        <ProtectionIncomeStep
          state={state}
          onChange={updateIncome}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "dread" && (
        <ProtectionDreadStep
          state={state}
          onChange={updateDread}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "debt" && (
        <ProtectionDebtStep
          state={state}
          onChange={updateDebt}
          onBack={goBack}
          onNext={handleDebtContinue}
        />
      )}

      {currentStepKey === "results" && (
        <ProtectionResultsStep
          state={state}
          onBack={goBack}
          onNext={goNext}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
        />
      )}

      {currentStepKey === "next" && (
        <ProtectionNextStep
          state={state}
          onBack={goBack}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onOpenEstatePlanner={onOpenEstatePlanner}
        />
      )}
    </div>
  );
}

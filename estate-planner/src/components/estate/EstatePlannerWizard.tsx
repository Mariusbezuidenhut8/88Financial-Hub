import React, { useMemo, useState, useCallback } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  EstatePlannerState,
  EstatePlannerFamilyStep,
  EstatePlannerEstateStep,
  EstatePlannerLiquidityStep,
  EstatePlannerReviewStep,
  EstatePlannerResult,
} from "../../types/estatePlanner.types";
import {
  estatePlannerSteps,
  type EstatePlannerStepKey,
} from "../../data/estatePlannerSteps";
import {
  mapClientProfileToEstatePlanner,
  toAnalysisInput,
  runAnalysisEngine,
} from "../../services/estatePlannerMapper";
import { EstateProgressHeader }  from "./EstateProgressHeader";
import { EstateOverviewStep }    from "./EstateOverviewStep";
import { EstateFamilyStep }      from "./EstateFamilyStep";
import { EstateValueStep }       from "./EstateValueStep";
import { EstateLiquidityStep }   from "./EstateLiquidityStep";
import { EstateReviewStep }      from "./EstateReviewStep";
import { EstateResultsStep }     from "./EstateResultsStep";
import { EstateNextStep }        from "./EstateNextStep";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

export interface EstatePlannerWizardProps {
  clientProfile:            ClientProfile;
  onBackToDashboard:         () => void;
  onRequestAdvisorHelp:     () => void;
  onComplete?:              (result: EstatePlannerResult) => void;
  onOpenProtectionPlanner?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function EstatePlannerWizard({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenProtectionPlanner,
}: EstatePlannerWizardProps) {
  // Map profile → initial state (memoised)
  const { estatePlannerState: mappedState, mappingWarnings } = useMemo(
    () => mapClientProfileToEstatePlanner(clientProfile),
    [clientProfile],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState]   = useState<EstatePlannerState>(mappedState);
  const [completedKeys, setCompletedKeys] = useState<EstatePlannerStepKey[]>([]);

  const currentStep    = estatePlannerSteps[currentStepIndex];
  const currentStepKey = currentStep?.key as EstatePlannerStepKey;

  // ── Navigation ────────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCompletedKeys((prev) =>
      prev.includes(currentStepKey) ? prev : [...prev, currentStepKey],
    );
    setCurrentStepIndex((i) =>
      Math.min(i + 1, estatePlannerSteps.length - 1),
    );
  }, [currentStepKey]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goToKey = useCallback((key: EstatePlannerStepKey) => {
    const idx = estatePlannerSteps.findIndex((s) => s.key === key);
    if (idx !== -1) setCurrentStepIndex(idx);
  }, []);

  // ── State updaters ─────────────────────────────────────────────────────────

  const updateFamily = useCallback(
    (family: EstatePlannerFamilyStep) =>
      setState((prev) => ({ ...prev, family })),
    [],
  );

  const updateEstate = useCallback(
    (estate: EstatePlannerEstateStep) =>
      setState((prev) => ({ ...prev, estate })),
    [],
  );

  const updateLiquidity = useCallback(
    (liquidity: EstatePlannerLiquidityStep) =>
      setState((prev) => ({ ...prev, liquidity })),
    [],
  );

  const updateReview = useCallback(
    (review: EstatePlannerReviewStep) =>
      setState((prev) => ({ ...prev, review })),
    [],
  );

  // ── Analysis trigger ──────────────────────────────────────────────────────

  /**
   * handleReviewContinue — runs the analysis engine before navigating to
   * the results step. Uses a setState callback to ensure the latest state
   * (including any review updates) is used, avoiding stale closure issues.
   */
  const handleReviewContinue = useCallback(() => {
    setState((prev) => {
      const input  = toAnalysisInput(prev, clientProfile);
      const result = runAnalysisEngine(input);
      onComplete?.(result);
      return { ...prev, result };
    });
    goNext();
  }, [clientProfile, goNext, onComplete]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 py-6">
      <EstateProgressHeader
        currentStepIndex={currentStepIndex}
        completedStepKeys={completedKeys}
        onStepClick={goToKey}
        onBackToDashboard={onBackToDashboard}
      />

      {currentStepKey === "overview" && (
        <EstateOverviewStep
          state={state}
          mappingWarnings={mappingWarnings}
          onNext={goNext}
        />
      )}

      {currentStepKey === "family" && (
        <EstateFamilyStep
          state={state}
          onChange={updateFamily}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "estate" && (
        <EstateValueStep
          state={state}
          onChange={updateEstate}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "liquidity" && (
        <EstateLiquidityStep
          state={state}
          onChange={updateLiquidity}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "review" && (
        <EstateReviewStep
          state={state}
          onChange={updateReview}
          onBack={goBack}
          onNext={handleReviewContinue}
        />
      )}

      {currentStepKey === "results" && (
        <EstateResultsStep
          state={state}
          onBack={goBack}
          onNext={goNext}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
        />
      )}

      {currentStepKey === "next" && (
        <EstateNextStep
          state={state}
          onBack={goBack}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onOpenProtectionPlanner={onOpenProtectionPlanner}
        />
      )}
    </div>
  );
}

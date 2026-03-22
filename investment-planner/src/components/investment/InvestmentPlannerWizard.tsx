import React, { useMemo, useState, useCallback } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type {
  InvestmentPlannerState,
  InvestmentPlannerGoalStep,
  InvestmentPlannerHorizonStep,
  InvestmentPlannerTaxStep,
  InvestmentPlannerResult,
} from "../../types/investmentPlanner.types";
import {
  investmentPlannerSteps,
  type InvestmentPlannerStepKey,
} from "../../data/investmentPlannerSteps";
import { mapClientProfileToInvestmentPlanner, toDecisionInput } from "../../services/investmentPlannerMapper";
import { buildInvestmentPlannerResult } from "../../services/investmentPlannerBuilder";
import { InvestmentProgressHeader }      from "./InvestmentProgressHeader";
import { InvestmentOverviewStep }        from "./InvestmentOverviewStep";
import { InvestmentGoalStep }            from "./InvestmentGoalStep";
import { InvestmentHorizonStep }         from "./InvestmentHorizonStep";
import { InvestmentTaxStep }             from "./InvestmentTaxStep";
import { InvestmentRecommendationStep }  from "./InvestmentRecommendationStep";
import { InvestmentStrategyStep }        from "./InvestmentStrategyStep";
import { InvestmentNextStep }            from "./InvestmentNextStep";

// ── Types ──────────────────────────────────────────────────────────────────

type ClientProfile = PlatformRecord["clientProfile"];

export interface InvestmentPlannerWizardProps {
  clientProfile:           ClientProfile;
  onBackToDashboard:       () => void;
  onRequestAdvisorHelp:    () => void;
  onComplete?:             (result: InvestmentPlannerResult) => void;
  onOpenRetirementPlanner?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export function InvestmentPlannerWizard({
  clientProfile,
  onBackToDashboard,
  onRequestAdvisorHelp,
  onComplete,
  onOpenRetirementPlanner,
}: InvestmentPlannerWizardProps) {
  // Map profile → initial state (memoised)
  const { investmentPlannerState: mappedState, mappingWarnings } = useMemo(
    () => mapClientProfileToInvestmentPlanner(clientProfile),
    [clientProfile],
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState]   = useState<InvestmentPlannerState>(mappedState);
  const [completedKeys, setCompletedKeys] = useState<InvestmentPlannerStepKey[]>([]);

  const currentStep    = investmentPlannerSteps[currentStepIndex];
  const currentStepKey = currentStep?.key as InvestmentPlannerStepKey;

  // ── Navigation ───────────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    setCompletedKeys((prev: InvestmentPlannerStepKey[]) =>
      prev.includes(currentStepKey) ? prev : [...prev, currentStepKey],
    );
    setCurrentStepIndex((i: number) =>
      Math.min(i + 1, investmentPlannerSteps.length - 1),
    );
  }, [currentStepKey]);

  const goBack = useCallback(() => {
    setCurrentStepIndex((i: number) => Math.max(i - 1, 0));
  }, []);

  const goToKey = useCallback((key: InvestmentPlannerStepKey) => {
    const idx = investmentPlannerSteps.findIndex((s) => s.key === key);
    if (idx !== -1) setCurrentStepIndex(idx);
  }, []);

  // ── State updaters ────────────────────────────────────────────────────────

  const updateGoal = useCallback(
    (goal: InvestmentPlannerGoalStep) =>
      setState((prev: InvestmentPlannerState) => ({ ...prev, goal })),
    [],
  );

  const updateHorizon = useCallback(
    (horizon: InvestmentPlannerHorizonStep) =>
      setState((prev: InvestmentPlannerState) => ({ ...prev, horizon })),
    [],
  );

  const updateTax = useCallback(
    (tax: InvestmentPlannerTaxStep) =>
      setState((prev: InvestmentPlannerState) => ({ ...prev, tax })),
    [],
  );

  // ── Recommendation trigger ────────────────────────────────────────────────

  const runRecommendation = useCallback(
    (nextState: InvestmentPlannerState) => {
      const input = toDecisionInput(nextState);
      if (!input) return;
      const result = buildInvestmentPlannerResult(input);
      setState((prev: InvestmentPlannerState) => ({ ...prev, result }));
      onComplete?.(result);
    },
    [onComplete],
  );

  const handleTaxContinue = useCallback(() => {
    // Run the engine before navigating forward so recommendation step has data
    setState((prev: InvestmentPlannerState) => {
      const input = toDecisionInput(prev);
      if (input) {
        const result = buildInvestmentPlannerResult(input);
        onComplete?.(result);
        return { ...prev, result };
      }
      return prev;
    });
    goNext();
  }, [goNext, onComplete]);

  // Suppress unused runRecommendation warning — kept for direct call use
  void runRecommendation;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 py-6">
      <InvestmentProgressHeader
        currentStepIndex={currentStepIndex}
        completedStepKeys={completedKeys}
        onStepClick={goToKey}
        onBackToDashboard={onBackToDashboard}
      />

      {currentStepKey === "overview" && (
        <InvestmentOverviewStep
          state={state}
          mappingWarnings={mappingWarnings}
          onNext={goNext}
        />
      )}

      {currentStepKey === "goal" && (
        <InvestmentGoalStep
          state={state}
          onChange={updateGoal}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "horizon" && (
        <InvestmentHorizonStep
          state={state}
          onChange={updateHorizon}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {currentStepKey === "tax" && (
        <InvestmentTaxStep
          state={state}
          onChange={updateTax}
          onBack={goBack}
          onNext={handleTaxContinue}
        />
      )}

      {currentStepKey === "recommendation" && (
        <InvestmentRecommendationStep
          state={state}
          onBack={goBack}
          onNext={goNext}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
        />
      )}

      {currentStepKey === "strategy" && (
        <InvestmentStrategyStep
          state={state}
          onBack={goBack}
          onNext={goNext}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
        />
      )}

      {currentStepKey === "next" && (
        <InvestmentNextStep
          state={state}
          onBack={goBack}
          onBackToDashboard={onBackToDashboard}
          onRequestAdvisorHelp={onRequestAdvisorHelp}
          onOpenRetirementPlanner={onOpenRetirementPlanner}
        />
      )}
    </div>
  );
}

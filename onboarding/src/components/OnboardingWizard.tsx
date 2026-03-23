"use client";

import React, { useState, useCallback } from "react";
import { OnboardingState, OnboardingStep, INITIAL_ONBOARDING_STATE } from "../types/onboarding-state.types";
import { ONBOARDING_STEPS, getNextStep, getPreviousStep } from "../types/onboarding-steps.types";
import { calculateHealthScore } from "../services/health-score-calculator";
import { getOnboardingRouteResult } from "../services/recommendation-router";
import { mapOnboardingToClientProfile } from "../services/onboarding-mapper";
import ProgressHeader from "./ProgressHeader";
import WelcomeStep from "./steps/WelcomeStep";
import AboutStep from "./steps/AboutStep";
import FamilyStep from "./steps/FamilyStep";
import IncomeStep from "./steps/IncomeStep";
import SpendingStep from "./steps/SpendingStep";
import SavingsStep from "./steps/SavingsStep";
import ProtectionEstateStep from "./steps/ProtectionEstateStep";
import PrioritiesStep from "./steps/PrioritiesStep";
import ResultsStep from "./steps/ResultsStep";

/**
 * OnboardingWizard — the root wizard component.
 *
 * Controls step navigation and state.
 * Delegates rendering to per-step components.
 * On completion, maps state → ClientProfile and fires onComplete callback.
 */

interface OnboardingWizardProps {
  onComplete?: (profile: Record<string, unknown>, state: OnboardingState) => void;
  onAdvisorHelp?: (profile: Record<string, unknown>, state: OnboardingState) => void;
}

export default function OnboardingWizard({ onComplete, onAdvisorHelp }: OnboardingWizardProps) {
  const [state, setState] = useState<OnboardingState>(INITIAL_ONBOARDING_STATE);

  const updateState = useCallback(
    <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => {
      setState((prev: OnboardingState) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleNext = useCallback(() => {
    const next = getNextStep(state.currentStep);
    if (!next) return;

    // When moving to results, calculate score
    if (next === "results") {
      const score = calculateHealthScore(state);
      const routeResult = getOnboardingRouteResult(state, score);
      setState((prev: OnboardingState) => ({
        ...prev,
        currentStep: "results",
        completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
        healthScore: score,
        routeResult,
        completedAt: new Date().toISOString(),
      }));
      return;
    }

    setState((prev: OnboardingState) => ({
      ...prev,
      currentStep: next,
      completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
    }));
  }, [state]);

  const handleBack = useCallback(() => {
    const prev = getPreviousStep(state.currentStep);
    if (prev) {
      setState((s: OnboardingState) => ({ ...s, currentStep: prev }));
    }
  }, [state.currentStep]);

  const handleComplete = useCallback(() => {
    const profile = mapOnboardingToClientProfile(state);
    onComplete?.(profile, state);
  }, [state, onComplete]);

  const handleAdvisorHelp = useCallback(() => {
    const profile = mapOnboardingToClientProfile(state);
    if (onAdvisorHelp) {
      onAdvisorHelp(profile, state);
    } else {
      onComplete?.(profile, state);
    }
  }, [state, onAdvisorHelp, onComplete]);

  const showProgress =
    state.currentStep !== "welcome" && state.currentStep !== "results";

  return (
    <div className="min-h-screen bg-gray-50">
      {showProgress && (
        <ProgressHeader
          currentStep={state.currentStep}
          completedSteps={state.completedSteps}
        />
      )}

      <main className="max-w-2xl mx-auto px-4 py-8">
        {state.currentStep === "welcome" && (
          <WelcomeStep onNext={handleNext} />
        )}
        {state.currentStep === "about" && (
          <AboutStep
            data={state.about}
            onChange={(v) => updateState("about", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "family" && (
          <FamilyStep
            data={state.family}
            onChange={(v) => updateState("family", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "income" && (
          <IncomeStep
            data={state.income}
            onChange={(v) => updateState("income", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "spending" && (
          <SpendingStep
            data={state.spending}
            onChange={(v) => updateState("spending", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "savings" && (
          <SavingsStep
            data={state.savings}
            onChange={(v) => updateState("savings", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "protection_estate" && (
          <ProtectionEstateStep
            data={state.protectionEstate}
            onChange={(v) => updateState("protectionEstate", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "priorities" && (
          <PrioritiesStep
            data={state.priorities}
            onChange={(v) => updateState("priorities", v)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {state.currentStep === "results" && state.healthScore && state.routeResult && (
          <ResultsStep
            scoreResult={state.healthScore}
            routeResult={state.routeResult}
            firstName={state.about.firstName}
            onGoToDashboard={handleComplete}
            onContinueSelfService={handleComplete}
            onGuidedHelp={handleComplete}
            onAdvisorHelp={handleAdvisorHelp}
          />
        )}
      </main>
    </div>
  );
}

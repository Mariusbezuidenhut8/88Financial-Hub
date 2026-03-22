/**
 * ROAWizard.tsx
 *
 * Root wizard component for the ROA Builder.
 * Manages step navigation and state; delegates rendering to per-step components.
 *
 * On completion, fires onComplete(result) with the finalised ROAResult.
 */

import React, { useState, useCallback } from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { ROAState, ROAResult } from "../../types/roa.types";
import { roaSteps, type ROAStepKey } from "../../data/roaSteps";
import { mapRecordToROA } from "../../services/roaMapper";
import { buildReferenceNo } from "../../services/roaHelpers";
import { ROAProgressHeader }       from "./ROAProgressHeader";
import { ROAClientStep }           from "./ROAClientStep";
import { ROANeedsStep }            from "./ROANeedsStep";
import { ROAAdviceStep }           from "./ROAAdviceStep";
import { ROARecommendationsStep }  from "./ROARecommendationsStep";
import { ROADocumentStep }         from "./ROADocumentStep";
import { ROADeclarationStep }      from "./ROADeclarationStep";

export interface ROAWizardProps {
  record:              PlatformRecord;
  onComplete?:         (result: ROAResult) => void;
  onBackToDashboard?:  () => void;
}

export function ROAWizard({ record, onComplete, onBackToDashboard }: ROAWizardProps) {
  const [state, setState] = useState<ROAState>(() => mapRecordToROA(record));
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = roaSteps[stepIndex]!.key as ROAStepKey;
  const refNo       = buildReferenceNo(record, state);

  const onChange = useCallback(
    <K extends keyof ROAState>(key: K, value: ROAState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  function goNext() { setStepIndex((i) => Math.min(i + 1, roaSteps.length - 1)); }
  function goBack() { setStepIndex((i) => Math.max(i - 1, 0)); }

  function handleFinish() {
    const completedAt = new Date().toISOString();
    setState((prev) => {
      const finalState: ROAState = {
        ...prev,
        status:      "complete",
        completedAt,
      };
      onComplete?.({
        roaId:       finalState.roaId,
        state:       finalState,
        completedAt,
        referenceNo: refNo,
      });
      return finalState;
    });
  }

  const profile = record.clientProfile;

  return (
    <div className="min-h-screen bg-slate-50">
      <ROAProgressHeader currentStep={currentStep} referenceNo={refNo} />

      {currentStep === "client" && (
        <ROAClientStep
          state={state} profile={profile}
          onChange={onChange} onNext={goNext}
        />
      )}
      {currentStep === "needs" && (
        <ROANeedsStep
          state={state} profile={profile}
          onChange={onChange} onNext={goNext} onBack={goBack}
        />
      )}
      {currentStep === "advice" && (
        <ROAAdviceStep
          state={state}
          onChange={onChange} onNext={goNext} onBack={goBack}
        />
      )}
      {currentStep === "recommendations" && (
        <ROARecommendationsStep
          state={state}
          onChange={onChange} onNext={goNext} onBack={goBack}
        />
      )}
      {currentStep === "document" && (
        <ROADocumentStep
          state={state} profile={profile} record={record}
          onNext={goNext} onBack={goBack}
        />
      )}
      {currentStep === "declaration" && (
        <ROADeclarationStep
          state={state} record={record}
          onChange={onChange} onFinish={handleFinish} onBack={goBack}
        />
      )}

      {/* Completed state */}
      {state.status === "complete" && (
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">ROA Finalised</h2>
          <p className="mt-2 text-sm text-slate-500">
            Reference: <strong>{refNo}</strong>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Completed: {new Date(state.completedAt ?? "").toLocaleDateString("en-ZA")}
          </p>
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="mt-6 rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Back to adviser dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}

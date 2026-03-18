import React from "react";
import type { InvestmentPlannerState } from "../../types/investmentPlanner.types";
import { labelRecommendation } from "../../services/investmentDecisionEngine";
import { WRAPPER_META } from "../../types/investmentPlanner.types";

export interface InvestmentRecommendationStepProps {
  state:                InvestmentPlannerState;
  onBack:               () => void;
  onNext:               () => void;
  onRequestAdvisorHelp: () => void;
}

export function InvestmentRecommendationStep({
  state,
  onBack,
  onNext,
  onRequestAdvisorHelp,
}: InvestmentRecommendationStepProps) {
  const { result } = state;

  if (!result) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          No recommendation available yet — please complete the previous steps.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
      </section>
    );
  }

  const primaryMeta   = WRAPPER_META[result.primaryRecommendation];
  const altLabel      = result.alternativeRecommendation
    ? labelRecommendation(result.alternativeRecommendation)
    : null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Wrapper Recommendation</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Based on your goal, time horizon, liquidity needs, and tax context, this
        appears to be the most suitable starting point. This is indicative — not a
        regulated recommendation.
      </p>

      {/* Primary recommendation hero */}
      <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
          Recommended route
        </p>
        <p className="mt-2 text-3xl font-bold">{primaryMeta.label}</p>
        <p className="mt-2 text-sm text-slate-300 leading-6">{primaryMeta.description}</p>

        {altLabel && (
          <p className="mt-4 text-xs text-slate-400">
            Alternative to consider: <span className="font-medium text-slate-200">{altLabel}</span>
          </p>
        )}
      </div>

      {/* Reasons + Cautions */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Why this fits</h3>
          {result.reasons.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No reasons captured.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Points to note</h3>
          {result.cautions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No major cautions flagged from the current inputs.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {result.cautions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Advisor suggestion */}
      {result.suggestAdvisor && result.advisorReasons.length > 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">An adviser conversation may help</p>
          <ul className="mt-1.5 space-y-1">
            {result.advisorReasons.map((r, i) => (
              <li key={i} className="text-xs text-amber-800">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequestAdvisorHelp}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Talk to an adviser
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            See strategy direction
          </button>
        </div>
      </div>
    </section>
  );
}

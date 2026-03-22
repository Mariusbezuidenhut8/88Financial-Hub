import React from "react";
import type {
  ProtectionPlannerState,
  ProtectionGap,
} from "../../types/protectionPlanner.types";
import {
  fmtProtectionCurrency,
  fmtMonthly,
  getReadinessConfig,
  getSeverityConfig,
  getUrgencyLabel,
  getUrgencyColor,
  getNeedTypeLabel,
} from "../../services/protectionPlannerHelpers";

export interface ProtectionResultsStepProps {
  state:                ProtectionPlannerState;
  onBack:               () => void;
  onNext:               () => void;
  onRequestAdvisorHelp: () => void;
}

export function ProtectionResultsStep({
  state,
  onBack,
  onNext,
  onRequestAdvisorHelp,
}: ProtectionResultsStepProps) {
  const { result } = state;

  if (!result) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          No results available — please complete the previous steps.
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

  const readiness = getReadinessConfig(result.overallReadiness);
  const gaps      = [
    result.lifeGap,
    result.incomeProtectionGap,
    result.dreadDiseaseGap,
    result.debtCoverGap,
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Protection Gap Analysis</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Based on your inputs, here is your four-pillar protection assessment. These are
        indicative needs — not a regulated advice output.
      </p>

      {/* Readiness hero */}
      <div className={`mt-6 rounded-3xl p-6 ${readiness.heroBg} ${readiness.heroText}`}>
        <p className="text-xs font-medium uppercase tracking-widest opacity-60">
          Overall protection readiness
        </p>
        <p className="mt-2 text-3xl font-bold">{readiness.label}</p>
        <p className={`mt-3 text-sm font-medium ${getUrgencyColor(result.urgency)}`}>
          Urgency: {getUrgencyLabel(result.urgency)}
        </p>
      </div>

      {/* Four-pillar gap cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {gaps.map((gap) => (
          <GapCard key={gap.needType} gap={gap} />
        ))}
      </div>

      {/* What's working / Cautions */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">What's working</h3>
          {result.reasons.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No positive factors recorded.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-slate-900">Key cautions</h3>
          {result.cautions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No major cautions flagged.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {result.cautions.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-red-400" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recommended actions */}
      {result.recommendedActions.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-sm font-semibold text-amber-900">Recommended actions</h3>
          <ol className="mt-3 space-y-2">
            {result.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
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
            See next steps
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Gap Card sub-component ─────────────────────────────────────────────────

function GapCard({ gap }: { gap: ProtectionGap }) {
  const sev        = getSeverityConfig(gap.severity);
  const isMonthly  = gap.needType === "income_protection";
  const fmtNeed    = isMonthly ? fmtMonthly(gap.totalNeed)   : fmtProtectionCurrency(gap.totalNeed);
  const fmtCover   = isMonthly ? fmtMonthly(gap.existingCover) : fmtProtectionCurrency(gap.existingCover);
  const fmtGap     = isMonthly ? fmtMonthly(gap.gap)         : fmtProtectionCurrency(gap.gap);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-900">
          {getNeedTypeLabel(gap.needType)}
        </p>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${sev.badgeBg} ${sev.badgeText}`}
        >
          {sev.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <p className="text-xs text-slate-500">Need</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {gap.totalNeed > 0 ? fmtNeed : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Existing</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-700">
            {gap.existingCover > 0 ? fmtCover : "None"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Gap</p>
          <p
            className={[
              "mt-0.5 text-sm font-bold",
              gap.gap > 0 ? "text-red-600" : "text-emerald-600",
            ].join(" ")}
          >
            {gap.gap > 0 ? fmtGap : "Covered"}
          </p>
        </div>
      </div>

      {/* First caution or reason */}
      {gap.cautions.length > 0 && (
        <p className="mt-3 text-xs leading-5 text-amber-700">
          ⚠ {gap.cautions[0]}
        </p>
      )}
      {gap.cautions.length === 0 && gap.reasons.length > 0 && (
        <p className="mt-3 text-xs leading-5 text-slate-500">{gap.reasons[0]}</p>
      )}
    </div>
  );
}

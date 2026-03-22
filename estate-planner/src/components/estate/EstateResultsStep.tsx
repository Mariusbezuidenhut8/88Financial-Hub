import React from "react";
import type { EstatePlannerState } from "../../types/estatePlanner.types";
import {
  fmtEstateCurrency,
  getReadinessConfig,
  getUrgencyLabel,
  getUrgencyColor,
} from "./estateHelpers";

export interface EstateResultsStepProps {
  state:                EstatePlannerState;
  onBack:               () => void;
  onNext:               () => void;
  onRequestAdvisorHelp: () => void;
}

export function EstateResultsStep({
  state,
  onBack,
  onNext,
  onRequestAdvisorHelp,
}: EstateResultsStepProps) {
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

  const readiness = getReadinessConfig(result.readinessStatus);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Estate Analysis Results</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Based on your inputs, here is a summary of your estimated estate position.
        These are indicative figures — not a regulated estate planning opinion.
      </p>

      {/* Readiness hero card */}
      <div className={`mt-6 rounded-3xl p-6 ${readiness.heroBg} ${readiness.heroText}`}>
        <p className="text-xs font-medium uppercase tracking-widest opacity-60">
          Estate readiness
        </p>
        <p className="mt-2 text-3xl font-bold">{readiness.label}</p>
        <p className={`mt-3 text-sm font-medium ${getUrgencyColor(result.urgency).replace("text-", "text-opacity-80 text-")}`}>
          Urgency: {getUrgencyLabel(result.urgency)}
        </p>
      </div>

      {/* Estate valuations */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ValuationTile
          label="Gross estate"
          value={fmtEstateCurrency(result.grossEstateValue)}
        />
        <ValuationTile
          label="Net estate"
          value={fmtEstateCurrency(result.netEstateValue)}
        />
        <ValuationTile
          label="Est. executor fees"
          value={fmtEstateCurrency(result.estimatedExecutorFees)}
        />
        <ValuationTile
          label="Est. estate duty"
          value={fmtEstateCurrency(result.estimatedEstateDuty)}
          highlight={result.estimatedEstateDuty > 0}
        />
      </div>

      {/* Liquidity summary */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold text-slate-900">Liquidity position</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <LiquidityRow label="Liquidity needed" value={fmtEstateCurrency(result.estimatedLiquidityNeed)} />
          <LiquidityRow label="Liquidity available" value={fmtEstateCurrency(result.estimatedLiquidityAvailable)} />
          <LiquidityRow
            label="Shortfall"
            value={fmtEstateCurrency(result.estimatedLiquidityShortfall)}
            highlight={result.estimatedLiquidityShortfall > 0}
          />
        </div>
      </div>

      {/* Reasons + Cautions */}
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
          <h3 className="text-sm font-semibold text-slate-900">Cautions</h3>
          {result.cautions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No cautions flagged.</p>
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

// ── Sub-components ──────────────────────────────────────────────────────────

function ValuationTile({
  label,
  value,
  highlight = false,
}: {
  label:      string;
  value:      string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl p-4",
        highlight ? "bg-amber-50 border border-amber-100" : "bg-slate-50",
      ].join(" ")}
    >
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={[
          "mt-2 text-base font-semibold",
          highlight ? "text-amber-700" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function LiquidityRow({
  label,
  value,
  highlight = false,
}: {
  label:      string;
  value:      string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={[
          "mt-1 text-lg font-semibold",
          highlight ? "text-red-600" : "text-slate-900",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

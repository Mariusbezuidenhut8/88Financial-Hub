/**
 * HealthScoreCard.tsx
 *
 * Hero card displaying the overall Financial Health Score.
 * Shows: score ring, band label + description, top gaps, top action items.
 *
 * Designed to sit at the top of the adviser dashboard.
 */

import React from "react";
import type { HealthScoreResult } from "../types/healthScore.types";
import {
  getBandConfig,
  scoreRingProps,
} from "../services/healthScoreHelpers";

export interface HealthScoreCardProps {
  result:               HealthScoreResult;
  onOpenPlanner?:       (planner: "retirement" | "protection" | "estate" | "investment") => void;
  onRequestAdvisorHelp?: () => void;
}

export function HealthScoreCard({
  result,
  onOpenPlanner,
  onRequestAdvisorHelp,
}: HealthScoreCardProps) {
  const band    = getBandConfig(result.band);
  const { circumference, dashOffset } = scoreRingProps(result.overallScore);
  const radius  = 54;
  const size    = 128;
  const cx      = size / 2;

  return (
    <div className={`rounded-3xl p-6 ${band.heroBg} ${band.heroText}`}>
      {/* Header row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {/* Text side */}
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-widest opacity-60">
            Financial Health Score
          </p>
          <h2 className="mt-2 text-3xl font-bold">{band.label}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 opacity-80">
            {band.description}
          </p>

          {/* Profile completeness */}
          {result.profileCompleteness < 80 && (
            <p className="mt-3 text-xs opacity-60">
              Profile completeness: {result.profileCompleteness}% — complete your profile for a more accurate score.
            </p>
          )}
        </div>

        {/* Score ring */}
        <div className="flex-shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            aria-label={`Health score: ${result.overallScore} out of 100`}
          >
            {/* Track */}
            <circle
              cx={cx}
              cy={cx}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={10}
              opacity={0.15}
            />
            {/* Progress arc */}
            <circle
              cx={cx}
              cy={cx}
              r={radius}
              fill="none"
              stroke={band.ringColor}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cx})`}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            {/* Score text */}
            <text
              x={cx}
              y={cx - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={28}
              fontWeight={700}
              fill="currentColor"
            >
              {result.overallScore}
            </text>
            <text
              x={cx}
              y={cx + 18}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.6}
            >
              / 100
            </text>
          </svg>
        </div>
      </div>

      {/* Top gaps */}
      {result.topGaps.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
            Priority gaps
          </p>
          <ul className="mt-2 space-y-1.5">
            {result.topGaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm opacity-90">
                <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top actions */}
      {result.topActionItems.length > 0 && (
        <div className="mt-4 rounded-2xl bg-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
            Top actions
          </p>
          <ol className="mt-2 space-y-1.5">
            {result.topActionItems.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm opacity-90">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* CTA row */}
      {(onOpenPlanner || onRequestAdvisorHelp) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {onRequestAdvisorHelp && (
            <button
              type="button"
              onClick={onRequestAdvisorHelp}
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-medium transition hover:bg-white/30"
            >
              Talk to an adviser
            </button>
          )}
          {onOpenPlanner && (
            <button
              type="button"
              onClick={() => onOpenPlanner("retirement")}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              Open Retirement Planner
            </button>
          )}
          {onOpenPlanner && (
            <button
              type="button"
              onClick={() => onOpenPlanner("protection")}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
            >
              Open Protection Planner
            </button>
          )}
        </div>
      )}

      {/* Calculated at */}
      <p className="mt-4 text-xs opacity-40">
        Score calculated: {new Date(result.calculatedAt).toLocaleDateString("en-ZA")}
      </p>
    </div>
  );
}

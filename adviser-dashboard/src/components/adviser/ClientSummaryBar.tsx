/**
 * ClientSummaryBar.tsx
 *
 * Top bar showing key client facts at a glance.
 * Reads directly from ClientProfile — no derived state needed.
 */

import React from "react";
import type { PlatformRecord } from "@88fh/master-data-model";

type ClientProfile = PlatformRecord["clientProfile"];

// ── Helpers ─────────────────────────────────────────────────────────────────

function calcAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function maritalLabel(status: string | undefined): string {
  switch (status) {
    case "married":          return "Married";
    case "single":           return "Single";
    case "divorced":         return "Divorced";
    case "widowed":          return "Widowed";
    case "cohabiting":       return "Cohabiting";
    case "civil_union":      return "Civil union";
    default:                 return "—";
  }
}

// ── Component ────────────────────────────────────────────────────────────────

export interface ClientSummaryBarProps {
  profile:       ClientProfile;
  onEditProfile?: () => void;
}

export function ClientSummaryBar({ profile, onEditProfile }: ClientSummaryBarProps) {
  const { identity, household, employment } = profile;

  const age          = identity.dateOfBirth ? calcAge(identity.dateOfBirth) : null;
  const fullName     = `${identity.firstName} ${identity.lastName}`;
  const marital      = maritalLabel(identity.maritalStatus);
  const totalDeps    =
    (household.numberOfChildren        ?? 0) +
    (household.numberOfDependentAdults ?? 0) +
    (household.parentsSupported        ?? 0) +
    (household.extendedFamilySupported ?? 0);
  const grossIncome  = employment?.monthlyGrossIncome;
  const empStatus    = employment?.employmentStatus ?? "unknown";

  const pills: { label: string; value: string }[] = [
    { label: "Age",        value: age !== null ? `${age} yrs` : "—" },
    { label: "Status",     value: marital },
    { label: "Dependants", value: totalDeps === 0 ? "None" : String(totalDeps) },
    { label: "Income",     value: grossIncome ? `${fmtCurrency(grossIncome)}/mo` : "—" },
    { label: "Employment", value: empStatus.replace(/_/g, " ") },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Name */}
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Client</p>
          <h1 className="mt-0.5 text-xl font-bold text-slate-900">{fullName}</h1>
        </div>

        {/* Fact pills */}
        <div className="flex flex-wrap gap-2">
          {pills.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              <span className="font-medium text-slate-500">{p.label}:</span>
              <span className="font-semibold">{p.value}</span>
            </span>
          ))}
        </div>

        {/* Edit profile */}
        {onEditProfile && (
          <button
            type="button"
            onClick={onEditProfile}
            className="flex-shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Edit profile
          </button>
        )}
      </div>
    </div>
  );
}

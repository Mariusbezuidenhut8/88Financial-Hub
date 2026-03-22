/**
 * ROAClientStep.tsx
 *
 * Step 1 — Confirm client details and capture meeting information.
 */

import React from "react";
import type { ROAState, MeetingType } from "../../types/roa.types";
import type { PlatformRecord } from "@88fh/master-data-model";

type ClientProfile = PlatformRecord["clientProfile"];

export interface ROAClientStepProps {
  state:     ROAState;
  profile:   ClientProfile;
  onChange:  <K extends keyof ROAState>(key: K, value: ROAState[K]) => void;
  onNext:    () => void;
}

const MEETING_TYPES: { value: MeetingType; label: string }[] = [
  { value: "face_to_face", label: "Face to face" },
  { value: "telephonic",   label: "Telephonic"   },
  { value: "virtual",      label: "Virtual / Video" },
];

export function ROAClientStep({ state, profile, onChange, onNext }: ROAClientStepProps) {
  const { identity, employment, household } = profile;
  const canProceed = state.clientConfirmed && state.adviserName.trim().length > 0 && state.meetingDate.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      {/* Client summary (read-only) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Client particulars
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
          {[
            { label: "Full name",     value: `${identity.firstName} ${identity.lastName}` },
            { label: "ID number",     value: identity.idNumber ?? "—" },
            { label: "Date of birth", value: identity.dateOfBirth ?? "—" },
            { label: "Marital status",value: identity.maritalStatus?.replace(/_/g, " ") ?? "—" },
            { label: "Employment",    value: employment?.employmentStatus?.replace(/_/g, " ") ?? "—" },
            { label: "Gross income",  value: employment?.monthlyGrossIncome
                ? new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(employment.monthlyGrossIncome) + "/mo"
                : "—" },
            { label: "Dependants",    value: String((household.numberOfChildren ?? 0) + (household.numberOfDependentAdults ?? 0)) },
            { label: "Email",         value: profile.contact?.emailAddress ?? "—" },
            { label: "Mobile",        value: profile.contact?.mobileNumber ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900 capitalize">{value}</p>
            </div>
          ))}
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={state.clientConfirmed}
            onChange={(e) => onChange("clientConfirmed", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          <span className="text-sm font-medium text-slate-700">
            I confirm the client details above are correct
          </span>
        </label>
      </div>

      {/* Meeting details */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Meeting details
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600">Adviser name</label>
            <input
              type="text"
              value={state.adviserName}
              onChange={(e) => onChange("adviserName", e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">FSP number</label>
            <input
              type="text"
              value={state.adviserFSPNumber}
              onChange={(e) => onChange("adviserFSPNumber", e.target.value)}
              placeholder="e.g. FSP 12345"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Meeting date</label>
            <input
              type="date"
              value={state.meetingDate}
              onChange={(e) => onChange("meetingDate", e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">Meeting type</label>
            <select
              value={state.meetingType}
              onChange={(e) => onChange("meetingType", e.target.value as MeetingType)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            >
              {MEETING_TYPES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

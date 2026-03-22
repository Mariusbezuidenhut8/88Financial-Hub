"use client";

/**
 * ClientContext.tsx
 *
 * Holds the active PlatformRecord for the current adviser session.
 * Persists to localStorage so the profile survives page refreshes.
 *
 * In production this would be replaced by an API-backed store,
 * but the interface is identical — swap the provider, keep all consumers.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { PlatformRecord } from "@88fh/master-data-model";
import type { PlannerKey, PlannerStatus } from "@88fh/adviser-dashboard";
import { MOCK_RECORD } from "@/lib/mockRecord";

// ── Types ────────────────────────────────────────────────────────────────────

export interface PlannerStatuses {
  retirement?: PlannerStatus;
  protection?: PlannerStatus;
  estate?:     PlannerStatus;
  investment?: PlannerStatus;
}

interface ClientContextValue {
  /** The full platform record for the active client */
  record: PlatformRecord;
  /** Replace the clientProfile (e.g. after onboarding completes) */
  updateProfile: (profile: PlatformRecord["clientProfile"]) => void;
  /** Mark a planner as not_started / in_progress / completed */
  updatePlannerStatus: (planner: PlannerKey, status: PlannerStatus) => void;
  /** Current planner statuses (tracked separately from adviceCases for now) */
  plannerStatuses: PlannerStatuses;
}

// ── Context ──────────────────────────────────────────────────────────────────

const ClientContext = createContext<ClientContextValue | null>(null);

const STORAGE_KEY_RECORD   = "88fh_record";
const STORAGE_KEY_PLANNERS = "88fh_planner_statuses";

// ── Provider ─────────────────────────────────────────────────────────────────

export function ClientProvider({ children }: { children: ReactNode }) {
  const [record, setRecord] = useState<PlatformRecord>(() => {
    if (typeof window === "undefined") return MOCK_RECORD;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECORD);
      return stored ? (JSON.parse(stored) as PlatformRecord) : MOCK_RECORD;
    } catch {
      return MOCK_RECORD;
    }
  });

  const [plannerStatuses, setPlannerStatuses] = useState<PlannerStatuses>(() => {
    if (typeof window === "undefined") return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PLANNERS);
      return stored ? (JSON.parse(stored) as PlannerStatuses) : {};
    } catch {
      return {};
    }
  });

  // Persist record to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORD, JSON.stringify(record));
    } catch {
      // localStorage not available (SSR / private mode) — silently continue
    }
  }, [record]);

  // Persist planner statuses
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLANNERS, JSON.stringify(plannerStatuses));
    } catch {
      // ignore
    }
  }, [plannerStatuses]);

  const updateProfile = useCallback(
    (profile: PlatformRecord["clientProfile"]) => {
      setRecord((prev) => ({
        ...prev,
        clientProfile: profile,
        audit: {
          ...prev.audit,
          updatedAt: new Date().toISOString(),
          updatedBy: "onboarding",
        },
      }));
    },
    [],
  );

  const updatePlannerStatus = useCallback(
    (planner: PlannerKey, status: PlannerStatus) => {
      setPlannerStatuses((prev) => ({ ...prev, [planner]: status }));
    },
    [],
  );

  return (
    <ClientContext.Provider
      value={{ record, updateProfile, updatePlannerStatus, plannerStatuses }}
    >
      {children}
    </ClientContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useClient(): ClientContextValue {
  const ctx = useContext(ClientContext);
  if (!ctx) throw new Error("useClient must be used inside <ClientProvider>");
  return ctx;
}

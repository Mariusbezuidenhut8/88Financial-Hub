/**
 * ROAAdviceStep.tsx
 *
 * Step 3 — Document advice given per planning area.
 * Tabs for each area; pre-populated need shown as context.
 * Adviser fills in: advice given, basis for advice, product/action recommended.
 */

import React, { useState } from "react";
import type { ROAState, ROAAdviceItem, AdviceArea } from "../../types/roa.types";

export interface ROAAdviceStepProps {
  state:    ROAState;
  onChange: <K extends keyof ROAState>(key: K, value: ROAState[K]) => void;
  onNext:   () => void;
  onBack:   () => void;
}

const AREA_ICONS: Record<AdviceArea, string> = {
  retirement: "🏦",
  protection: "🛡",
  estate:     "📋",
  investment: "📈",
};

export function ROAAdviceStep({ state, onChange, onNext, onBack }: ROAAdviceStepProps) {
  const [activeTab, setActiveTab] = useState<AdviceArea>("retirement");

  function updateItem(area: AdviceArea, field: keyof ROAAdviceItem, value: unknown) {
    const updated = state.adviceItems.map((item) =>
      item.area === area ? { ...item, [field]: value } : item,
    );
    onChange("adviceItems", updated);
  }

  const includedItems = state.adviceItems.filter((i) => i.included);
  const activeItem    = state.adviceItems.find((i) => i.area === activeTab);
  const canProceed    = includedItems.every((i) => i.adviceGiven.trim().length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">

      {/* Area inclusion toggles */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-medium text-slate-500">Include / exclude planning areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {state.adviceItems.map((item) => (
            <button
              key={item.area}
              type="button"
              onClick={() => updateItem(item.area, "included", !item.included)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                item.included
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 text-slate-400"
              }`}
            >
              {AREA_ICONS[item.area]} {item.areaLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1">
        {state.adviceItems.filter((i) => i.included).map((item) => (
          <button
            key={item.area}
            type="button"
            onClick={() => setActiveTab(item.area)}
            className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition ${
              activeTab === item.area
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {AREA_ICONS[item.area]} {item.areaLabel}
          </button>
        ))}
      </div>

      {/* Active area form */}
      {activeItem && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">

          {/* Pre-populated need context */}
          {activeItem.clientNeedIdentified && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs font-semibold text-amber-700">Need identified (pre-populated)</p>
              <p className="mt-1 text-xs leading-5 text-amber-800">{activeItem.clientNeedIdentified}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Advice given <span className="text-red-500">*</span>
            </label>
            <textarea
              value={activeItem.adviceGiven}
              onChange={(e) => updateItem(activeTab, "adviceGiven", e.target.value)}
              rows={4}
              placeholder="Describe the specific advice given to the client for this area..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Basis for advice
            </label>
            <textarea
              value={activeItem.basisForAdvice}
              onChange={(e) => updateItem(activeTab, "basisForAdvice", e.target.value)}
              rows={3}
              placeholder="Why is this advice appropriate for this client's specific circumstances?"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600">
              Product / action recommended
            </label>
            <input
              type="text"
              value={activeItem.productOrAction}
              onChange={(e) => updateItem(activeTab, "productOrAction", e.target.value)}
              placeholder="e.g. Discovery Life — R5M life cover, R25,000/mo income protector"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          ← Back
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed}
          className="rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
          Continue →
        </button>
      </div>
    </div>
  );
}

import React from "react";
import type { DashboardDocumentItem } from "../../types/dashboard.types";
import { formatDisplayDate } from "./dashboardHelpers";

interface DocumentsCardProps {
  documents: DashboardDocumentItem[];
  onViewDocument?: (id: string) => void;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents, onViewDocument }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Documents</h2>
      <p className="mt-1 text-sm text-slate-600">
        Reports and generated planning documents will appear here.
      </p>

      <div className="mt-4 space-y-3">
        {documents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No documents available yet.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{doc.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {doc.type} • {formatDisplayDate(doc.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onViewDocument?.(doc.id)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-white"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

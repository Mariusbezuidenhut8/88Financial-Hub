import React from "react";

export interface DashboardDocumentItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface DocumentsCardProps {
  documents: DashboardDocumentItem[];
  onViewDocument?: (id: string) => void;
}

const TYPE_STYLES: Record<string, string> = {
  ROA:      "bg-blue-100 text-blue-700",
  SOA:      "bg-purple-100 text-purple-700",
  report:   "bg-slate-100 text-slate-600",
  consent:  "bg-yellow-100 text-yellow-700",
};

export default function DocumentsCard({ documents, onViewDocument }: DocumentsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Documents</h2>

      {documents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 px-4 py-8 text-center">
          <p className="text-sm text-slate-400">No documents yet.</p>
          <p className="text-xs text-slate-300 mt-1">
            Records of advice, reports, and consent forms will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <li key={doc.id} className="py-3 first:pt-0 last:pb-0">
              <button
                onClick={() => onViewDocument?.(doc.id)}
                className="w-full text-left group flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors truncate">
                    {doc.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.date}</p>
                </div>
                <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_STYLES[doc.type] ?? TYPE_STYLES.report}`}>
                  {doc.type}
                </span>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0 transition-colors"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

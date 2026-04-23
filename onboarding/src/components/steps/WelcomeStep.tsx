import React, { useState } from "react";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [accepted, setAccepted] = useState(false);
  const [noticesOpen, setNoticesOpen] = useState(false);

  return (
    <div className="flex flex-col items-center text-center space-y-8 pt-8">
      {/* Logo / brand */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
          <span className="text-white text-2xl font-bold">88</span>
        </div>
        <p className="text-sm font-bold text-slate-800 tracking-tight">88Wealth Management</p>
        <p className="text-xs text-slate-400">Mandated FSP · Fairbairn Consult · FSP 9328</p>
      </div>

      {/* Headline */}
      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          See exactly where you stand financially
        </h1>
        <p className="text-gray-500 text-base">
          Answer a few quick questions and get your personalised Financial Health
          Score — with your top priorities and next steps.
        </p>
      </div>

      {/* What you get */}
      <div className="w-full max-w-sm space-y-3 text-left">
        {[
          { icon: "✓", text: "Financial Health Score (0–100)" },
          { icon: "✓", text: "Your top 3 financial priorities" },
          { icon: "✓", text: "Recommended next steps" },
          { icon: "✓", text: "Takes about 3–5 minutes" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {item.icon}
            </span>
            <span className="text-sm text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Compliance notices */}
      <div className="w-full max-w-sm text-left">
        <button
          type="button"
          onClick={() => setNoticesOpen((v) => !v)}
          className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors mb-2"
        >
          <span className={`transition-transform ${noticesOpen ? "rotate-90" : ""}`}>▶</span>
          Important legal notices — FAIS &amp; POPIA
        </button>

        {noticesOpen && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-4 text-left">

            {/* FAIS */}
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                FAIS Act Notice
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                88 Wealth Management (operating under FSP licence no. 9328 of Fairbairn Consult (Pty) Ltd)
                is an Authorised Financial Services Provider. This application is an illustrative
                calculation tool and does not constitute formal financial advice as defined in the
                Financial Advisory and Intermediary Services Act (FAIS), 2002. No liability is accepted
                for decisions made based on these outputs without a formal signed Record of Advice.
              </p>
            </div>

            {/* POPIA */}
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                POPIA Data Protection
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                By proceeding, you acknowledge that 88 Wealth Management will process the personal and
                financial data you enter into this application solely to provide the requested financial
                planning illustrations.
              </p>
              <ul className="mt-2 space-y-1">
                {[
                  "Data is encrypted and hosted in secure environments.",
                  "No information is sold to third parties.",
                  "You retain the right to request deletion of your session data.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-amber-700">
                    <span className="mt-0.5 text-amber-500">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions */}
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                Assumption Warning
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Calculations are based on current South African Revenue Service (SARS) tax tables.
                Future amendments to legislation may invalidate these results.
              </p>
            </div>

            {/* Privacy version */}
            <p className="text-xs text-amber-500 text-right">
              Privacy Statement v1.4.2-COMPLY
            </p>
          </div>
        )}

        {/* Acknowledgement checkbox */}
        <label className="mt-3 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 flex-shrink-0"
          />
          <span className="text-xs text-gray-600 leading-relaxed">
            I understand this tool provides illustrative calculations only and does not
            constitute financial advice under the FAIS Act. I consent to my data being
            processed in accordance with POPIA.
          </span>
        </label>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        disabled={!accepted}
        className="w-full max-w-sm py-4 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start my financial check
      </button>

      <p className="text-xs text-gray-400">
        Your information is private and secure. We never sell your data.
      </p>
    </div>
  );
}

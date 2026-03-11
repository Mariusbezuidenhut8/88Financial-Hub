import React from "react";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 pt-8">
      {/* Logo / brand */}
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
        <span className="text-white text-2xl font-bold">88</span>
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

      {/* CTA */}
      <button
        onClick={onNext}
        className="w-full max-w-sm py-4 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 transition-colors"
      >
        Start my financial check
      </button>

      <p className="text-xs text-gray-400">
        Your information is private and secure. We never sell your data.
      </p>
    </div>
  );
}

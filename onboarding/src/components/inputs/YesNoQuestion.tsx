import React from "react";

interface YesNoQuestionProps {
  label: string;
  value?: boolean;
  onChange: (value: boolean) => void;
  helperText?: string;
}

export default function YesNoQuestion({
  label,
  value,
  onChange,
  helperText,
}: YesNoQuestionProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <div className="flex gap-3">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
            value === true
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-colors ${
            value === false
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300"
          }`}
        >
          No
        </button>
      </div>
      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  );
}

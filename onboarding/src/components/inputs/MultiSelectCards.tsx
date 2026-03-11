import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface MultiSelectCardsProps {
  label?: string;
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
  helperText?: string;
}

export default function MultiSelectCards({
  label,
  options,
  selected,
  onChange,
  maxSelections,
  helperText,
}: MultiSelectCardsProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelections && selected.length >= maxSelections) return;
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`text-left p-3 rounded-xl border-2 transition-colors ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-2">
                {opt.icon && <span className="text-lg">{opt.icon}</span>}
                <div>
                  <p className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                    {opt.label}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{opt.description}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  );
}

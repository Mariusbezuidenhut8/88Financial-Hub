import React from "react";

interface CurrencyInputProps {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export default function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "e.g. 15 000",
  helperText,
  required = false,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "").replace(/,/g, "");
    const num = parseFloat(raw);
    onChange(isNaN(num) ? undefined : num);
  };

  const formatted = value !== undefined ? value.toLocaleString("en-ZA") : "";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          R
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formatted}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
  );
}

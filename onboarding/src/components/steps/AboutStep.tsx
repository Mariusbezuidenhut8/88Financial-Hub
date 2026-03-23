import React from "react";
import { AboutState, Province } from "../../types/onboarding-state.types";
import { deriveAgeFromIdNumber } from "../../services/onboarding-mapper";
import StepLayout from "../StepLayout";

interface AboutStepProps {
  data: AboutState;
  onChange: (data: AboutState) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROVINCES: { value: Province; label: string }[] = [
  { value: "gauteng", label: "Gauteng" },
  { value: "western_cape", label: "Western Cape" },
  { value: "kwazulu_natal", label: "KwaZulu-Natal" },
  { value: "eastern_cape", label: "Eastern Cape" },
  { value: "free_state", label: "Free State" },
  { value: "limpopo", label: "Limpopo" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "north_west", label: "North West" },
  { value: "northern_cape", label: "Northern Cape" },
];

export default function AboutStep({ data, onChange, onNext, onBack }: AboutStepProps) {
  const update = (key: keyof AboutState, value: unknown) =>
    onChange({ ...data, [key]: value });

  const handleIdChange = (idNumber: string) => {
    const age = deriveAgeFromIdNumber(idNumber) ?? undefined;
    onChange({ ...data, idNumber, age });
  };

  const canContinue = !!(data.firstName && data.lastName && data.mobileNumber && data.emailAddress);

  return (
    <StepLayout
      title="About You"
      description="A rough estimate is fine for now — you can update this later."
      onNext={onNext}
      onBack={onBack}
      nextDisabled={!canContinue}
    >
      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.firstName ?? ""}
            onChange={(e) => update("firstName", e.target.value)}
            placeholder="First name"
            className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Last name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.lastName ?? ""}
            onChange={(e) => update("lastName", e.target.value)}
            placeholder="Last name"
            className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Mobile number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={data.mobileNumber ?? ""}
          onChange={(e) => update("mobileNumber", e.target.value)}
          placeholder="e.g. 0821234567"
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Email address <span className="text-red-500">*</span> <span className="text-gray-400 text-xs ml-1">(we'll email you your full report)</span>
        </label>
        <input
          type="email"
          value={data.emailAddress ?? ""}
          onChange={(e) => update("emailAddress", e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ID number */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          SA ID number <span className="text-gray-400 text-xs ml-1">(optional — we'll derive your age)</span>
        </label>
        <input
          type="text"
          value={data.idNumber ?? ""}
          onChange={(e) => handleIdChange(e.target.value)}
          placeholder="13-digit SA ID"
          maxLength={13}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {data.age && (
          <p className="text-xs text-green-600">Age derived: {data.age} years</p>
        )}
      </div>

      {/* Province */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Province</label>
        <select
          value={data.province ?? ""}
          onChange={(e) => update("province", e.target.value as Province)}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">Select province</option>
          {PROVINCES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
    </StepLayout>
  );
}

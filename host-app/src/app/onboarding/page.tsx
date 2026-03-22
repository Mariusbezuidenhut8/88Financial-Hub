"use client";

/**
 * /onboarding — OnboardingWizard
 *
 * Collects the client's financial profile.
 * On completion, updates the ClientContext and navigates to /adviser.
 */

import React from "react";
import { useRouter } from "next/navigation";
import OnboardingWizard from "@88fh/onboarding";
import { useClient } from "@/context/ClientContext";
import type { PlatformRecord } from "@88fh/master-data-model";

type ClientProfile = PlatformRecord["clientProfile"];

export default function OnboardingPage() {
  const router  = useRouter();
  const { updateProfile } = useClient();

  function handleComplete(profile: Record<string, unknown>) {
    updateProfile(profile as ClientProfile);
    router.push("/adviser");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <OnboardingWizard onComplete={handleComplete} />
    </div>
  );
}

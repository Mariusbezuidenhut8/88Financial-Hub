import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Host app source
    "./src/**/*.{ts,tsx}",
    // All sibling packages — ensures Tailwind sees every class used in components
    "../onboarding/src/**/*.{ts,tsx}",
    "../retirement-planner/src/**/*.{ts,tsx}",
    "../protection-planner/src/**/*.{ts,tsx}",
    "../estate-planner/src/**/*.{ts,tsx}",
    "../investment-planner/src/**/*.{ts,tsx}",
    "../financial-health-score/src/**/*.{ts,tsx}",
    "../adviser-dashboard/src/**/*.{ts,tsx}",
    "../dashboard/src/**/*.{ts,tsx}",
    "../roa-builder/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

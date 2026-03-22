import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Transpile all local @88fh/* packages.
   * Because sibling packages use "moduleResolution: bundler" and ship
   * raw TypeScript source (no dist build step), Next.js must transpile them.
   */
  transpilePackages: [
    "@88fh/master-data-model",
    "@88fh/onboarding",
    "@88fh/retirement-planner",
    "@88fh/protection-planner",
    "@88fh/estate-planner",
    "@88fh/investment-planner",
    "@88fh/financial-health-score",
    "@88fh/adviser-dashboard",
    "@88fh/dashboard",
  ],
};

export default nextConfig;

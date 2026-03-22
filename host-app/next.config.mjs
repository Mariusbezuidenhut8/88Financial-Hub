/** @type {import('next').NextConfig} */
const nextConfig = {
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
    "@88fh/roa-builder",
  ],
};

export default nextConfig;

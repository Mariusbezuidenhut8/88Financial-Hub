import React from "react";
import type { FinancialHealthCategoryScores } from "../../types/financial-health.types";
import CategoryScoreCard from "./CategoryScoreCard";

type CategoryKey = keyof FinancialHealthCategoryScores;

const CATEGORY_DISPLAY: { key: CategoryKey; title: "Cash Flow" | "Debt" | "Emergency Fund" | "Protection" | "Retirement" }[] = [
  { key: "cashFlow",      title: "Cash Flow"       },
  { key: "debt",          title: "Debt"             },
  { key: "emergencyFund", title: "Emergency Fund"   },
  { key: "protection",    title: "Protection"       },
  { key: "retirement",    title: "Retirement"       },
];

interface CategoryBreakdownGridProps {
  categoryScores: FinancialHealthCategoryScores;
}

export default function CategoryBreakdownGrid({ categoryScores }: CategoryBreakdownGridProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Category Breakdown</h2>
        <p className="mt-1 text-sm text-slate-600">
          These scores show where your strongest foundations are and where attention may be needed next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {CATEGORY_DISPLAY.map(({ key, title }) => (
          <CategoryScoreCard
            key={key}
            title={title}
            score={categoryScores[key]}
            maxScore={20}
          />
        ))}
      </div>
    </section>
  );
}

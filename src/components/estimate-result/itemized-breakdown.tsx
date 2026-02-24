'use client';

import { formatCurrencyRange } from '@/lib/utils';
import type { EstimateLineItem } from '@/lib/estimate-engine/types';

interface ItemizedBreakdownProps {
  items: EstimateLineItem[];
}

const complexityColors: Record<string, string> = {
  simple: 'bg-emerald-500/15 text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-400',
  complex: 'bg-rose-500/15 text-rose-400',
};

export function ItemizedBreakdown({ items }: ItemizedBreakdownProps) {
  const groupedByCategory: Record<string, EstimateLineItem[]> = {};
  for (const item of items) {
    if (!groupedByCategory[item.category]) {
      groupedByCategory[item.category] = [];
    }
    groupedByCategory[item.category].push(item);
  }

  const categoryLabels: Record<string, string> = {
    'user-management': 'User Management',
    communication: 'Communication & Notifications',
    'data-content': 'Data & Content',
    payments: 'Payments & Commerce',
    media: 'Media',
    location: 'Location & Maps',
    advanced: 'Advanced / Emerging',
    'ui-ux': 'UI/UX',
  };

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-foreground">Itemized Budget Breakdown</h3>
      <div className="overflow-x-auto rounded-xl border border-glass-border glass-panel">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-glass-border bg-glass-bg">
            <tr>
              <th className="px-4 py-3 font-semibold text-foreground">Feature</th>
              <th className="px-4 py-3 font-semibold text-foreground">Complexity</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Hours</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByCategory).map(([categoryId, categoryItems]) => (
              <CategoryGroup
                key={categoryId}
                categoryLabel={categoryLabels[categoryId] || categoryId}
                items={categoryItems}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">
        * Costs include {items.length > 0 ? 'platform multiplier and' : ''} 18% project management overhead
      </p>
    </div>
  );
}

function CategoryGroup({
  categoryLabel,
  items,
}: {
  categoryLabel: string;
  items: EstimateLineItem[];
}) {
  return (
    <>
      <tr className="border-b border-glass-border bg-glass-bg/50">
        <td colSpan={4} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted">
          {categoryLabel}
        </td>
      </tr>
      {items.map((item) => (
        <tr key={item.featureId} className="border-b border-glass-border last:border-0 hover:bg-glass-bg/30">
          <td className="px-4 py-3 text-foreground">{item.name}</td>
          <td className="px-4 py-3">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                complexityColors[item.complexity]
              }`}
            >
              {item.complexity}
            </span>
          </td>
          <td className="px-4 py-3 text-right text-muted">
            {item.hoursMin}–{item.hoursMax}
          </td>
          <td className="px-4 py-3 text-right font-medium text-foreground">
            {formatCurrencyRange(item.costMin, item.costMax)}
          </td>
        </tr>
      ))}
    </>
  );
}

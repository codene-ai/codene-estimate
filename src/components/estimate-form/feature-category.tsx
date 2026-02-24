'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import type { Feature } from '@/lib/estimate-engine/types';

interface FeatureCategoryProps {
  category: { id: string; name: string; features: Feature[] };
  selectedFeatures: string[];
  onToggleFeature: (id: string) => void;
}

function complexityLabel(complexity: Feature['complexity']) {
  const map = { simple: 'Simple', medium: 'Medium', complex: 'Complex' } as const;
  return map[complexity];
}

export default function FeatureCategory({
  category,
  selectedFeatures,
  onToggleFeature,
}: FeatureCategoryProps) {
  const [expanded, setExpanded] = useState(true);

  const selectedCount = category.features.filter((f) =>
    selectedFeatures.includes(f.id)
  ).length;

  return (
    <div className="rounded-xl border border-glass-border bg-glass-bg">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-glass-bg-hover transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {category.name}
          </span>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              {selectedCount}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-glass-border px-4 py-3 space-y-3">
          {category.features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between"
            >
              <Checkbox
                id={feature.id}
                label={feature.name}
                checked={selectedFeatures.includes(feature.id)}
                onChange={() => onToggleFeature(feature.id)}
              />
              <Badge variant={feature.complexity}>
                {complexityLabel(feature.complexity)}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

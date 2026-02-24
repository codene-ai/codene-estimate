'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useEstimateFormStore } from '@/stores/estimate-form-store';
import { FEATURE_CATEGORIES } from '@/lib/estimate-engine/features';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const complexityColors: Record<string, string> = {
  simple: 'text-[#6b8f71]',   /* dark sage green */
  medium: 'text-[#b89a6a]',   /* muted gold/wheat */
  complex: 'text-[#8b4049]',  /* dried blood red */
};

export default function StepFeatures() {
  const { features, toggleFeature, setHasCustomFeatures, setCustomFeaturesText } = useEstimateFormStore();
  const [activeCategory, setActiveCategory] = useState(0);
  const pillsRef = useRef<HTMLDivElement>(null);

  /* ── Touch swipe state ── */
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swiping = useRef(false);

  const totalSelected = features.selectedFeatures.length;
  const category = FEATURE_CATEGORIES[activeCategory];
  const selectedInCategory = category.features.filter((f) => features.selectedFeatures.includes(f.id)).length;

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(FEATURE_CATEGORIES.length - 1, index));
    setActiveCategory(clamped);
  }

  /* Auto-scroll active pill into view */
  useEffect(() => {
    if (!pillsRef.current) return;
    const activeBtn = pillsRef.current.children[activeCategory] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  /* ── Swipe handlers ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swiping.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!swiping.current) return;
    swiping.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only swipe if horizontal movement > 50px and greater than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goTo(activeCategory + 1); // swipe left → next
      else goTo(activeCategory - 1); // swipe right → prev
    }
  }, [activeCategory]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Select Features</h2>
        <p className="mt-1 text-sm text-muted">Swipe left/right to browse categories. Tap to toggle.</p>
      </div>

      {/* Category pills — swipeable horizontal strip */}
      <div
        ref={pillsRef}
        className="flex gap-2 overflow-x-auto scrollbar-none pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {FEATURE_CATEGORIES.map((cat, i) => {
          const count = cat.features.filter((f) => features.selectedFeatures.includes(f.id)).length;
          const isActive = i === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(i)}
              className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200"
              style={
                isActive
                  ? {
                      background: '#252528',
                      boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.45), inset -2px -2px 6px rgba(50,50,55,0.05), 0 0 8px rgba(184,115,51,0.1)',
                      border: '1px solid rgba(184,115,51,0.18)',
                      color: '#d4944c',
                    }
                  : {
                      background: 'linear-gradient(145deg, #303035, #262629)',
                      boxShadow: '4px 4px 10px rgba(0,0,0,0.4), -2px -2px 7px rgba(50,50,55,0.04)',
                      border: '1px solid rgba(200,200,210,0.03)',
                      color: 'rgba(200,200,210,0.5)',
                    }
              }
            >
              {cat.name}
              {count > 0 && (
                <span className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] ${
                  isActive ? 'bg-[rgba(184,115,51,0.25)] text-[#d4944c]' : 'bg-[rgba(184,115,51,0.2)] text-[#d4944c]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category title + count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{category.name}</h3>
        <span className="text-sm text-muted">
          {selectedInCategory}/{category.features.length} selected
        </span>
      </div>

      {/* Feature grid — dark neumorphic toggle buttons (swipeable) */}
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {category.features.map((feature) => {
          const isSelected = features.selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => toggleFeature(feature.id)}
              className="group relative flex flex-col items-center justify-center rounded-[20px] px-3 py-6 text-center transition-all duration-300"
              style={isSelected ? {
                background: '#252528',
                boxShadow: [
                  'inset 5px 5px 12px rgba(0,0,0,0.55)',
                  'inset -4px -4px 10px rgba(50,50,55,0.06)',
                  '0 0 12px rgba(184,115,51,0.15)',
                ].join(','),
                border: '1px solid rgba(184,115,51,0.2)',
              } : {
                background: 'linear-gradient(145deg, #303035, #262629)',
                boxShadow: [
                  '6px 6px 16px rgba(0,0,0,0.5)',
                  '-4px -4px 12px rgba(50,50,55,0.06)',
                ].join(','),
                border: '1px solid rgba(200,200,210,0.03)',
              }}
            >
              {/* Copper arc on top rim when selected */}
              {isSelected && (
                <div className="pointer-events-none absolute inset-0 rounded-[20px] overflow-hidden">
                  <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from 200deg at 50% 0%, transparent 0deg, rgba(212,148,76,0.2) 40deg, rgba(184,115,51,0.35) 90deg, rgba(212,148,76,0.2) 140deg, transparent 180deg, transparent 360deg)',
                    maskImage: 'radial-gradient(ellipse 60% 12% at 50% 0%, black 0%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 60% 12% at 50% 0%, black 0%, transparent 100%)',
                  }} />
                </div>
              )}

              <span className={`relative z-10 text-sm font-semibold leading-tight ${
                isSelected ? 'text-[#d4944c]' : 'text-[rgba(200,200,210,0.8)]'
              }`}>
                {feature.name}
              </span>

              <span className={`relative z-10 mt-2 text-[10px] font-medium uppercase tracking-wider ${
                isSelected ? 'text-[rgba(212,148,76,0.5)]' : complexityColors[feature.complexity] || 'text-muted'
              }`}>
                {feature.complexity}
              </span>

              {/* Copper bar indicator */}
              {isSelected && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full bg-[rgba(184,115,51,0.35)] shadow-[0_0_6px_rgba(184,115,51,0.2)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5">
        {FEATURE_CATEGORIES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveCategory(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeCategory ? 'w-6 bg-[--primary]' : 'w-1.5 bg-[rgba(228,228,235,0.1)]'
            }`}
          />
        ))}
      </div>

      {/* Custom features */}
      <div className="space-y-3 rounded-xl border border-glass-border bg-glass-bg p-4">
        <Checkbox
          id="has-custom-features"
          label="I have custom features not listed above"
          checked={features.hasCustomFeatures}
          onChange={setHasCustomFeatures}
        />
        {features.hasCustomFeatures && (
          <Textarea
            label="Describe your custom features"
            value={features.customFeaturesText}
            onChange={(e) => setCustomFeaturesText(e.target.value)}
            placeholder="Describe any additional features you need..."
          />
        )}
      </div>

      {/* Sticky counter */}
      <div className="sticky bottom-0 rounded-xl border border-glass-border bg-[rgba(28,25,23,0.9)] backdrop-blur-md px-4 py-3 text-center">
        <span className="text-sm font-medium text-foreground">
          {totalSelected} feature{totalSelected !== 1 ? 's' : ''} selected
        </span>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CATEGORY_LABEL,
  CATEGORY_VARIANT,
  ScenarioCard,
} from '@/components/ScenarioCard';
import { Badge } from '@/components/ui/badge';
import { listScenarios } from '@/lib/mock-api';
import type { ScenarioSummary } from '@/types/scenario';
import { cn } from '@/lib/utils';

type Category = ScenarioSummary['category'];

const CATEGORY_ORDER: Category[] = [
  'customer-case',
  'feature',
  'future-concept',
  'industry',
];

function isCategory(value: string | null): value is Category {
  return (
    value === 'customer-case' ||
    value === 'feature' ||
    value === 'future-concept' ||
    value === 'industry'
  );
}

export function ScenarioListRoute() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const activeCategory: Category | null = isCategory(categoryParam)
    ? categoryParam
    : null;

  useEffect(() => {
    listScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  const availableCategories = useMemo(() => {
    if (!scenarios) return [];
    const present = new Set(scenarios.map((s) => s.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [scenarios]);

  const counts = useMemo(() => {
    const result: Partial<Record<Category, number>> = {};
    for (const s of scenarios ?? []) {
      result[s.category] = (result[s.category] ?? 0) + 1;
    }
    return result;
  }, [scenarios]);

  const filtered = useMemo(() => {
    if (!scenarios) return null;
    if (!activeCategory) return scenarios;
    return scenarios.filter((s) => s.category === activeCategory);
  }, [scenarios, activeCategory]);

  const handleSelect = (next: Category | null) => {
    if (!next) {
      const sp = new URLSearchParams(searchParams);
      sp.delete('category');
      setSearchParams(sp, { replace: true });
      return;
    }
    if (activeCategory === next) {
      const sp = new URLSearchParams(searchParams);
      sp.delete('category');
      setSearchParams(sp, { replace: true });
      return;
    }
    const sp = new URLSearchParams(searchParams);
    sp.set('category', next);
    setSearchParams(sp, { replace: true });
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">전체 시나리오</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          고객사·기능·컨셉 등 다양한 카테고리의 시나리오를 탐색하세요.
        </p>
      </header>

      {scenarios !== null && scenarios.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterChip
            label="전체"
            count={scenarios.length}
            active={activeCategory === null}
            onClick={() => handleSelect(null)}
          />
          {availableCategories.map((c) => (
            <FilterChip
              key={c}
              label={CATEGORY_LABEL[c]}
              count={counts[c] ?? 0}
              active={activeCategory === c}
              variant={CATEGORY_VARIANT[c]}
              onClick={() => handleSelect(c)}
            />
          ))}
        </div>
      )}

      {scenarios === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-surface-card ring-1 ring-surface-border animate-pulse"
            />
          ))}
        </div>
      ) : filtered && filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-surface-border bg-surface-card px-6 py-10 text-center text-sm text-ink-secondary">
          해당 카테고리에 등록된 시나리오가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered?.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  variant?: React.ComponentProps<typeof Badge>['variant'];
  onClick: () => void;
}

function FilterChip({ label, count, active, variant, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40',
        active && 'shadow-sm ring-2 ring-brand-primary/30'
      )}
    >
      <Badge
        variant={active ? variant ?? 'brand' : 'outline'}
        className={cn(
          'gap-1.5 px-3 py-1 text-xs font-medium',
          !active && 'hover:bg-surface-subtle'
        )}
      >
        <span>{label}</span>
        <span className={cn('opacity-70', active && 'opacity-80')}>{count}</span>
      </Badge>
    </button>
  );
}

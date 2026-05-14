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

/** 고객 필터 칩 노출 순서. 등재되지 않은 고객은 ko-localeCompare 로 뒤에 정렬. */
const CUSTOMER_ORDER: string[] = ['hana', 'woori', 'gaon', 'sk-rental'];

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
  const customerParam = searchParams.get('customer');
  const activeCategory: Category | null = isCategory(categoryParam)
    ? categoryParam
    : null;
  const activeCustomer: string | null = customerParam ?? null;

  useEffect(() => {
    listScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  const availableCategories = useMemo(() => {
    if (!scenarios) return [];
    const present = new Set(scenarios.map((s) => s.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [scenarios]);

  const availableCustomers = useMemo(() => {
    if (!scenarios) return [];
    const seen = new Map<string, { id: string; name: string }>();
    for (const s of scenarios) {
      if (s.customer && !seen.has(s.customer.id)) {
        seen.set(s.customer.id, { id: s.customer.id, name: s.customer.name });
      }
    }
    const orderIndex = (id: string) => {
      const i = CUSTOMER_ORDER.indexOf(id);
      return i === -1 ? CUSTOMER_ORDER.length : i;
    };
    return Array.from(seen.values()).sort((a, b) => {
      const oa = orderIndex(a.id);
      const ob = orderIndex(b.id);
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name, 'ko');
    });
  }, [scenarios]);

  const categoryCounts = useMemo(() => {
    const result: Partial<Record<Category, number>> = {};
    const base = activeCustomer
      ? (scenarios ?? []).filter((s) => s.customer?.id === activeCustomer)
      : (scenarios ?? []);
    for (const s of base) {
      result[s.category] = (result[s.category] ?? 0) + 1;
    }
    return result;
  }, [scenarios, activeCustomer]);

  const customerCounts = useMemo(() => {
    const result: Record<string, number> = {};
    const base = activeCategory
      ? (scenarios ?? []).filter((s) => s.category === activeCategory)
      : (scenarios ?? []);
    for (const s of base) {
      if (s.customer) {
        result[s.customer.id] = (result[s.customer.id] ?? 0) + 1;
      }
    }
    return result;
  }, [scenarios, activeCategory]);

  const filtered = useMemo(() => {
    if (!scenarios) return null;
    return scenarios.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (activeCustomer && s.customer?.id !== activeCustomer) return false;
      return true;
    });
  }, [scenarios, activeCategory, activeCustomer]);

  const totalForCategoryRow = activeCustomer
    ? (scenarios ?? []).filter((s) => s.customer?.id === activeCustomer).length
    : scenarios?.length ?? 0;
  const totalForCustomerRow = activeCategory
    ? (scenarios ?? []).filter((s) => s.category === activeCategory).length
    : scenarios?.length ?? 0;

  const handleSelectCategory = (next: Category | null) => {
    const sp = new URLSearchParams(searchParams);
    if (!next || activeCategory === next) {
      sp.delete('category');
    } else {
      sp.set('category', next);
    }
    setSearchParams(sp, { replace: true });
  };

  const handleSelectCustomer = (nextId: string | null) => {
    const sp = new URLSearchParams(searchParams);
    if (!nextId || activeCustomer === nextId) {
      sp.delete('customer');
    } else {
      sp.set('customer', nextId);
    }
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
        <div className="mb-6 space-y-3">
          <FilterRow label="카테고리">
            <FilterChip
              label="전체"
              count={totalForCategoryRow}
              active={activeCategory === null}
              onClick={() => handleSelectCategory(null)}
            />
            {availableCategories.map((c) => (
              <FilterChip
                key={c}
                label={CATEGORY_LABEL[c]}
                count={categoryCounts[c] ?? 0}
                active={activeCategory === c}
                variant={CATEGORY_VARIANT[c]}
                onClick={() => handleSelectCategory(c)}
              />
            ))}
          </FilterRow>

          {availableCustomers.length > 0 && (
            <FilterRow label="고객사">
              <FilterChip
                label="전체"
                count={totalForCustomerRow}
                active={activeCustomer === null}
                onClick={() => handleSelectCustomer(null)}
              />
              {availableCustomers.map((c) => (
                <FilterChip
                  key={c.id}
                  label={c.name}
                  count={customerCounts[c.id] ?? 0}
                  active={activeCustomer === c.id}
                  onClick={() => handleSelectCustomer(c.id)}
                />
              ))}
            </FilterRow>
          )}
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
          선택한 조건에 맞는 시나리오가 없습니다.
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

interface FilterRowProps {
  label: string;
  children: React.ReactNode;
}

function FilterRow({ label, children }: FilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-medium text-ink-muted">{label}</span>
      {children}
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

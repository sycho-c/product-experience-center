import { useEffect, useState } from 'react';
import { ScenarioCard } from '@/components/ScenarioCard';
import { listScenarios } from '@/lib/mock-api';
import type { ScenarioSummary } from '@/types/scenario';

export function ScenarioListRoute() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[] | null>(null);

  useEffect(() => {
    listScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">전체 시나리오</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          고객사·기능·미래 컨셉 등 다양한 카테고리의 시나리오를 탐색하세요.
        </p>
      </header>
      {scenarios === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-surface-card ring-1 ring-surface-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scenarios.map((s) => (
            <ScenarioCard key={s.id} scenario={s} />
          ))}
        </div>
      )}
    </div>
  );
}

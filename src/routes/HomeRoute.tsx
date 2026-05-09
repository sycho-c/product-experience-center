import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutPanelLeft, MonitorSmartphone, Users } from 'lucide-react';
import { ScenarioCard } from '@/components/ScenarioCard';
import { EnvironmentCard } from '@/components/EnvironmentCard';
import { Button } from '@/components/ui/button';
import { listScenarios } from '@/lib/mock-api';
import type { ScenarioSummary } from '@/types/scenario';

const HERO_FEATURES = [
  {
    icon: LayoutPanelLeft,
    title: '시나리오 기반 체험',
    desc: '실제 업무 흐름을 시나리오로 구성하여 체험할 수 있습니다.',
  },
  {
    icon: MonitorSmartphone,
    title: '다양한 디바이스 지원',
    desc: 'Backoffice(PC)와 Mobile(App/Web) 환경을 모두 제공합니다.',
  },
  {
    icon: Users,
    title: '협업 & 대화 테스트',
    desc: '실시간 협업과 대화 기능을 직접 테스트해볼 수 있습니다.',
  },
];

export function HomeRoute() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[] | null>(null);

  useEffect(() => {
    listScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-ink-primary md:text-5xl">
            제품을 직접 체험해보세요
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-secondary leading-relaxed">
            다양한 시나리오를 통해 제품의 핵심 기능과 고객 사례, 그리고 미래의
            새로운 기능까지 미리 경험할 수 있습니다.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {HERO_FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primarySoft text-brand-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold text-ink-primary">
                  {title}
                </div>
                <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <HeroPreview />
      </section>

      {/* Scenario list */}
      <section>
        <header className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink-primary">시나리오 선택</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/scenarios">전체 시나리오 보기 →</Link>
          </Button>
        </header>
        {scenarios === null ? (
          <ScenarioGridSkeleton />
        ) : scenarios.length === 0 ? (
          <p className="text-sm text-ink-secondary">아직 등록된 시나리오가 없습니다.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        )}
      </section>

      {/* Environment select */}
      <section className="rounded-2xl bg-white p-6 shadow-soft md:p-8">
        <header className="mb-5">
          <h2 className="text-xl font-semibold text-ink-primary">체험 환경 선택</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            선택한 환경에 맞춰 최적화된 UI를 제공합니다.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          <EnvironmentCard kind="pc" />
          <EnvironmentCard kind="mobile" />
        </div>
      </section>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative aspect-[16/10] w-full rounded-2xl border border-surface-border bg-surface-card p-3 shadow-elev">
      {/* PC frame mock */}
      <div className="flex h-full gap-3">
        <div className="relative flex-1 rounded-lg bg-surface-subtle">
          <div className="absolute left-3 top-3 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
          <div className="grid h-full grid-cols-[64px_1fr_1.6fr] gap-2 p-2 pt-8">
            <div className="rounded-md bg-brand-sidebar/90" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 rounded bg-white/80 ring-1 ring-surface-border"
                />
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded bg-white ring-1 ring-surface-border"
                />
              ))}
            </div>
          </div>
        </div>
        {/* Mobile frame mock */}
        <div className="relative w-[28%] min-w-[140px] rounded-2xl border-2 border-ink-primary/80 bg-surface-card p-2">
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-ink-primary/30" />
          <div className="mt-3 space-y-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-5 rounded bg-surface-subtle"
                style={{ width: `${60 + ((i * 7) % 30)}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-44 rounded-xl bg-surface-card ring-1 ring-surface-border animate-pulse"
        />
      ))}
    </div>
  );
}

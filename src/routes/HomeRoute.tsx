import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  LayoutPanelLeft,
  MonitorSmartphone,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

const CATEGORY_SUMMARY: {
  key: ScenarioSummary['category'];
  label: string;
  chipClass: string;
}[] = [
  {
    key: 'customer-case',
    label: '고객 사례',
    chipClass: 'bg-brand-primarySoft text-brand-primary',
  },
  {
    key: 'feature',
    label: '제품 기능',
    chipClass: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'future-concept',
    label: '컨셉 기능',
    chipClass: 'bg-amber-50 text-amber-700',
  },
];

export function HomeRoute() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[] | null>(null);

  useEffect(() => {
    listScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  const counts = (scenarios ?? []).reduce<
    Record<ScenarioSummary['category'], number>
  >(
    (acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + 1;
      return acc;
    },
    { 'customer-case': 0, feature: 0, 'future-concept': 0, industry: 0 }
  );
  const totalCount = scenarios?.length ?? 0;

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

      {/* Scenario menu CTA */}
      <section>
        <Link
          to="/scenarios"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded-2xl"
        >
          <Card className="group flex flex-col gap-6 p-6 transition-shadow hover:shadow-elev md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primarySoft text-brand-primary">
                  <LayoutPanelLeft className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                  Scenario Library
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-ink-primary">
                시나리오 체험으로 이동
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-secondary leading-relaxed">
                고객사 사례, 제품 기능, 미래 기능까지 카테고리별로 정리된
                시나리오 라이브러리에서 원하는 흐름을 골라 체험하세요.
              </p>

              <ul className="mt-5 flex flex-wrap items-center gap-2">
                {CATEGORY_SUMMARY.map(({ key, label, chipClass }) => (
                  <li
                    key={key}
                    className={
                      'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ' +
                      chipClass
                    }
                  >
                    <span>{label}</span>
                    <span className="opacity-70">{counts[key]}</span>
                  </li>
                ))}
                <li className="ml-1 text-xs text-ink-muted">
                  총 {totalCount}개 시나리오
                </li>
              </ul>
            </div>

            <div className="flex shrink-0 items-center md:flex-col md:items-end md:gap-3">
              <Button
                size="lg"
                className="pointer-events-none"
                tabIndex={-1}
              >
                전체 시나리오 보기
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        </Link>
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

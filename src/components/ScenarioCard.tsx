import { Link } from 'react-router-dom';
import { Monitor, Smartphone } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ScenarioSummary } from '@/types/scenario';
import { cn } from '@/lib/utils';

export const CATEGORY_LABEL: Record<ScenarioSummary['category'], string> = {
  'customer-case': '고객 사례',
  feature: '제품 기능',
  'future-concept': '컨셉 기능',
  industry: '업종별',
};

export const CATEGORY_VARIANT: Record<
  ScenarioSummary['category'],
  BadgeProps['variant']
> = {
  'customer-case': 'brand',
  feature: 'success',
  'future-concept': 'warning',
  industry: 'neutral',
};

const DIFFICULTY_LABEL: Record<ScenarioSummary['difficulty'], string> = {
  easy: '난이도 하',
  medium: '난이도 중',
  hard: '난이도 상',
};

const TAG_VARIANT: Record<string, BadgeProps['variant']> = {
  기능: 'success',
  흐름: 'warning',
};

interface ScenarioCardProps {
  scenario: ScenarioSummary;
  className?: string;
}

export function ScenarioCard({ scenario, className }: ScenarioCardProps) {
  const supportsPC = scenario.devices.includes('pc');
  const supportsMobile =
    scenario.devices.includes('mobile') || scenario.devices.includes('web');

  return (
    <Link
      to={`/scenarios/${scenario.id}/experience`}
      className={cn(
        'group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded-xl',
        className
      )}
    >
      <Card className="h-full p-5 transition-shadow group-hover:shadow-elev">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge variant={CATEGORY_VARIANT[scenario.category]}>
              {CATEGORY_LABEL[scenario.category]}
            </Badge>
            {scenario.tag && (
              <Badge variant={TAG_VARIANT[scenario.tag] ?? 'outline'}>
                {scenario.tag}
              </Badge>
            )}
          </div>
          <span className="text-xs text-ink-muted">
            {DIFFICULTY_LABEL[scenario.difficulty]}
          </span>
        </div>
        <h3 className="mt-3 text-base font-semibold text-ink-primary">
          {scenario.title}
        </h3>
        {scenario.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-secondary leading-relaxed">
            {scenario.summary}
          </p>
        )}
        <div className="mt-5 flex items-center gap-3 text-xs text-ink-muted">
          {supportsPC && (
            <span className="inline-flex items-center gap-1">
              <Monitor className="h-3.5 w-3.5" /> PC
            </span>
          )}
          {supportsMobile && (
            <span className="inline-flex items-center gap-1">
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </span>
          )}
          <span className="ml-auto">약 {scenario.durationMinutes}분</span>
        </div>
      </Card>
    </Link>
  );
}

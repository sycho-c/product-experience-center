import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ImpactMetric } from '@/types/scenario';

interface KpiCardProps {
  metric: ImpactMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const delta =
    metric.improvementDirection === 'down'
      ? Math.max(0, metric.before - metric.after)
      : Math.max(0, metric.after - metric.before);
  const ratio =
    metric.before === 0 ? 0 : Math.round((delta / metric.before) * 100);
  const Icon =
    metric.improvementDirection === 'down' ? TrendingDown : TrendingUp;
  const positive = ratio > 0;

  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-primarySoft text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-ink-secondary">{metric.label}</div>
        <div className="text-base font-semibold text-ink-primary">
          {metric.improvementDirection === 'down' ? '▼' : '▲'} {ratio}%{' '}
          <span
            className={
              positive ? 'text-emerald-600 text-xs' : 'text-ink-muted text-xs'
            }
          >
            {positive ? '개선' : '변동 없음'}
          </span>
        </div>
      </div>
    </Card>
  );
}

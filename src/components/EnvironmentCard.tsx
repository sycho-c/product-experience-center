import { ArrowRight, Monitor, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EnvironmentCardProps {
  kind: 'pc' | 'mobile';
  onSelect?: () => void;
}

export function EnvironmentCard({ kind, onSelect }: EnvironmentCardProps) {
  const Icon = kind === 'pc' ? Monitor : Smartphone;
  const title =
    kind === 'pc' ? 'Backoffice Workspace (PC)' : 'Mobile App / Web';
  const description =
    kind === 'pc'
      ? '관리자 및 사용자를 위한 PC 기반 Backoffice 환경을 체험합니다.'
      : '모바일 앱 또는 웹 환경에서의 협업과 대화 기능을 체험합니다.';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded-xl"
    >
      <Card className="flex items-center gap-4 p-6 transition-colors hover:border-brand-primary/30">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-primarySoft text-brand-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-ink-primary">
            {title}
          </div>
          <div className="mt-1 text-sm text-ink-secondary">{description}</div>
        </div>
        <ArrowRight className="h-5 w-5 text-ink-muted" />
      </Card>
    </button>
  );
}

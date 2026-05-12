import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Scenario } from '@/types/scenario';

interface ExperienceLayoutProps {
  scenario: Scenario | null;
  loading: boolean;
  center: React.ReactNode;
  /** 통합 정보 패널. 우측 320px aside 에 렌더된다. */
  right: React.ReactNode;
  bottom: React.ReactNode;
}

export function ExperienceLayout({
  scenario,
  loading,
  center,
  right,
  bottom,
}: ExperienceLayoutProps) {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/scenarios');
    }
  };
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header strip with scenario meta */}
      <div className="flex items-center gap-4 border-b border-surface-border bg-surface-card px-6 py-3">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전 화면으로
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-ink-primary">
            {loading
              ? '시나리오 로드 중…'
              : (scenario?.title ?? '시나리오를 찾을 수 없습니다')}
          </h1>
          {scenario && (
            <>
              <Badge variant="brand">
                {labelOf(scenario.category)}
              </Badge>
              <span className="text-xs text-ink-muted">
                예상 시간 {scenario.durationMinutes}분
              </span>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-ink-secondary">
          <Button variant="outline" size="sm">
            시나리오 정보
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/scenarios">다른 시나리오 체험</Link>
          </Button>
        </div>
      </div>

      {/* 2-column body — 가운데 디바이스 영역 + 우측 통합 정보 패널 */}
      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col bg-surface-canvas p-3">
          <div className={cn('flex flex-1 min-h-0')}>{center}</div>
        </main>
        <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden border-l border-surface-border bg-surface-card p-4">
          {right}
        </aside>
      </div>

      {bottom}
    </div>
  );
}

function labelOf(c: Scenario['category']): string {
  switch (c) {
    case 'customer-case':
      return '고객 사례';
    case 'feature':
      return '기본 기능';
    case 'future-concept':
      return '미래 기능';
    case 'industry':
      return '업종별';
  }
}

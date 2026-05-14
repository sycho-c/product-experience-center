import { Monitor } from 'lucide-react';
import { CoworkShell } from '@/features/coworkplus/CoworkShell';
import { KakaoPCShell } from '@/features/kakao/KakaoPCShell';
import type { ScenarioMode } from '@/features/scenario/store';

interface DeviceFramePCProps {
  label?: string;
  mode?: ScenarioMode;
  emptyState?: boolean;
}

export function DeviceFramePC({
  label = 'Workspace',
  mode = 'after',
  emptyState = false,
}: DeviceFramePCProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-1">
        <div className="flex h-full min-h-0 max-h-[660px] w-full flex-col items-center">
          {/* Label chip — 디바이스 박스 바로 위에 붙여 표시 */}
          <div className="flex shrink-0 justify-center pb-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-card px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary shadow-soft">
              <Monitor className="h-3 w-3" />
              {label}
            </span>
          </div>
          <div className="@container/device flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-soft">
            {mode === 'before' ? (
              <KakaoPCShell />
            ) : (
              <CoworkShell emptyState={emptyState} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

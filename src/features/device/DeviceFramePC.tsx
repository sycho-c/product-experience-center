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
      {/* Label chip — 디바이스 박스 외부 상단 가운데 */}
      <div className="flex shrink-0 justify-center pb-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-card px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary shadow-soft">
          <Monitor className="h-3 w-3" />
          {label}
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-soft @container/device">
        {mode === 'before' ? (
          <KakaoPCShell />
        ) : (
          <CoworkShell emptyState={emptyState} />
        )}
      </div>
    </div>
  );
}

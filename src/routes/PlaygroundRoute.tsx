import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DeviceFramePC } from '@/features/device/DeviceFramePC';
import { DeviceFrameMobile } from '@/features/device/DeviceFrameMobile';
import { stop } from '@/features/scenario/runner';
import { useScenarioStore } from '@/features/scenario/store';
import { useUISimStore } from '@/features/ui-simulation/store';
import { useExternalUsersStore } from '@/features/domain/external-users/store';
import { useTodosStore } from '@/features/domain/todos/store';
import { useKnowledgeBaseStore } from '@/features/domain/knowledge-base/store';
import { useSettingsStore } from '@/features/domain/settings/store';

export function PlaygroundRoute() {
  useEffect(() => {
    stop();
    useScenarioStore.getState().reset();
  }, []);

  const handleResetAll = () => {
    stop();
    useScenarioStore.getState().reset();
    useUISimStore.getState().reset();
    useExternalUsersStore.getState().reset();
    useTodosStore.getState().reset();
    useKnowledgeBaseStore.getState().reset();
    useSettingsStore.getState().reset();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center gap-4 border-b border-surface-border bg-surface-card px-6 py-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-ink-primary">
            제품 기능 자유 체험
          </h1>
          <p className="text-xs text-ink-muted">
            정해진 시나리오 없이 Workspace 와 Guest 화면을 자유롭게 사용해
            보세요.
          </p>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            처음부터 다시
          </Button>
        </div>
      </div>

      <main className="flex min-h-0 flex-1 bg-surface-canvas p-3">
        <div className="flex flex-1 min-h-0 gap-3 lg:grid lg:grid-cols-[2.8fr_1fr]">
          <DeviceFramePC mode="after" />
          <DeviceFrameMobile mode="after" />
        </div>
      </main>
    </div>
  );
}

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExperienceLayout } from '@/layouts/ExperienceLayout';
import { ScenarioControls } from '@/features/scenario/ScenarioControls';
import { ScenarioStepList } from '@/features/scenario/ScenarioStepList';
import { CurrentActionCaption } from '@/features/scenario/CurrentActionCaption';
import { DeviceFramePC } from '@/features/device/DeviceFramePC';
import { DeviceFrameMobile } from '@/features/device/DeviceFrameMobile';
import { BeforeAfterToggle } from '@/features/comparison/BeforeAfterToggle';
import { Badge } from '@/components/ui/badge';
import { TAG_VARIANT } from '@/lib/scenario-display';
import {
  selectActiveSteps,
  useScenarioStore,
} from '@/features/scenario/store';
import { applyScenarioSeed, stop } from '@/features/scenario/runner';
import { loadScenario } from '@/lib/mock-api';
import { useTalkStore } from '@/features/talk/store';

export function ScenarioExperienceRoute() {
  const { id } = useParams<{ id: string }>();
  const scenario = useScenarioStore((s) => s.scenario);
  const loading = useScenarioStore((s) => s.loading);
  const error = useScenarioStore((s) => s.error);
  const mode = useScenarioStore((s) => s.mode);
  const setScenario = useScenarioStore((s) => s.setScenario);
  const setLoading = useScenarioStore((s) => s.setLoading);
  const setError = useScenarioStore((s) => s.setError);
  const steps = useScenarioStore(selectActiveSteps);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    useTalkStore.getState().clear();
    loadScenario(id)
      .then((s) => {
        if (cancelled) return;
        setScenario(s);
        applyScenarioSeed(s);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
        setScenario(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
      stop();
    };
  }, [id, setScenario, setLoading, setError]);

  const emptyState = steps.length === 0;

  return (
    <ExperienceLayout
      scenario={scenario}
      loading={loading}
      right={
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="shrink-0 space-y-4">
            <BeforeAfterToggle />
            {scenario && (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-ink-primary">
                    {scenario.title}
                  </h2>
                  {scenario.tag && (
                    <Badge variant={TAG_VARIANT[scenario.tag] ?? 'outline'}>
                      {scenario.tag}
                    </Badge>
                  )}
                </div>
                {scenario.summary && (
                  <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                    {scenario.summary}
                  </p>
                )}
              </div>
            )}
            <CurrentActionCaption />
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <ScenarioStepList />
          </div>
          {error && (
            <div className="shrink-0 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-700">
              오류: {error}
            </div>
          )}
        </div>
      }
      center={
        mode === 'before' ? (
          <div className="flex flex-1 min-h-0 items-stretch justify-center">
            <div className="h-full w-full max-w-[440px]">
              <DeviceFrameMobile mode={mode} emptyState={emptyState} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 min-h-0 gap-3 lg:grid lg:grid-cols-[2.8fr_1fr]">
            <DeviceFramePC mode={mode} emptyState={emptyState} />
            <DeviceFrameMobile mode={mode} emptyState={emptyState} />
          </div>
        )
      }
      bottom={<ScenarioControls />}
    />
  );
}

import { Check, Play } from 'lucide-react';
import {
  useScenarioStore,
  selectActiveSteps,
} from './store';
import { pause, seekStep } from './runner';
import { cn } from '@/lib/utils';

export function ScenarioStepList() {
  const steps = useScenarioStore(selectActiveSteps);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const actionIndex = useScenarioStore((s) => s.actionIndex);
  const status = useScenarioStore((s) => s.status);
  const showGuide = useScenarioStore((s) => s.showStepGuide);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-primary">시나리오 단계</h3>
        <span className="text-xs text-ink-muted">전체 단계 {steps.length}</span>
      </div>
      <ul className="space-y-1">
        {steps.map((step, idx) => {
          const completed = idx < stepIndex;
          const active = idx === stepIndex;
          const stepActionTotal = step.actions?.length ?? 0;
          return (
            <li key={step.id}>
              <button
                onClick={() => {
                  if (status === 'playing') pause();
                  seekStep(idx);
                }}
                className={cn(
                  'group flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  active
                    ? 'bg-brand-primarySoft'
                    : completed
                      ? 'hover:bg-surface-subtle'
                      : 'hover:bg-surface-subtle'
                )}
              >
                <div
                  className={cn(
                    'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold',
                    active
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-surface-border bg-surface-card text-ink-muted'
                  )}
                >
                  {completed ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    String(idx + 1).padStart(2, '0')
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'flex items-center gap-1.5 font-medium',
                    active ? 'text-brand-primary' : 'text-ink-primary'
                  )}>
                    <span className="truncate">{step.title}</span>
                    {active && status === 'playing' && (
                      <Play className="h-3 w-3 fill-current" />
                    )}
                    {stepActionTotal > 0 && (
                      <span
                        className={cn(
                          'ml-auto text-[10px] font-normal',
                          active ? 'text-brand-primary' : 'text-ink-muted'
                        )}
                      >
                        {active ? `${actionIndex} / ${stepActionTotal}` : `${stepActionTotal}`}
                      </span>
                    )}
                  </div>
                  {showGuide && step.description && (
                    <p
                      className={cn(
                        'mt-1 text-xs leading-relaxed',
                        active ? 'text-ink-secondary' : 'text-ink-muted'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

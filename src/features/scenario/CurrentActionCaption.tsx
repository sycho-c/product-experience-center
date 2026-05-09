import { Sparkles } from 'lucide-react';
import { useScenarioStore } from './store';

export function CurrentActionCaption() {
  const description = useScenarioStore((s) => s.currentActionDescription);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const actionIndex = useScenarioStore((s) => s.actionIndex);
  const scenario = useScenarioStore((s) => s.scenario);
  const step = scenario?.steps[stepIndex];

  if (!step) return null;

  return (
    <div className="rounded-xl border border-brand-primary/30 bg-brand-primarySoft/40 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-primary">
        <Sparkles className="h-3.5 w-3.5" />
        현재 단계
      </div>
      <div className="mt-1 text-sm font-semibold text-ink-primary">
        {step.title}
      </div>
      {description ? (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
          {description}
        </p>
      ) : (
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          ▶ 또는 다음 액션 버튼을 눌러 시작하세요.
        </p>
      )}
      {step.actions && step.actions.length > 0 && (
        <div className="mt-2 text-[11px] text-brand-primary/80">
          액션 {actionIndex} / {step.actions.length}
        </div>
      )}
    </div>
  );
}

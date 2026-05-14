import { useEffect } from 'react';
import {
  ChevronsLeft,
  ChevronsRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import {
  useScenarioStore,
  selectActiveSteps,
  selectTotalSteps,
} from './store';
import {
  nextAction,
  pause,
  play,
  prevAction,
  seekStep,
  seekToStart,
} from './runner';
import { Switch } from '@/components/ui/switch';

export function ScenarioControls() {
  const status = useScenarioStore((s) => s.status);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const actionIndex = useScenarioStore((s) => s.actionIndex);
  const total = useScenarioStore(selectTotalSteps);
  const showStepGuide = useScenarioStore((s) => s.showStepGuide);
  const toggleStepGuide = useScenarioStore((s) => s.toggleStepGuide);
  const steps = useScenarioStore(selectActiveSteps);

  const isPlaying = status === 'playing';
  const currentStep = steps[stepIndex];
  const stepActionTotal = currentStep?.actions?.length ?? 0;
  const isActionMode = stepActionTotal > 0;
  const progress = total > 0 ? Math.round(((stepIndex + 1) / total) * 100) : 0;

  // 좌우 방향키로 이전/다음 단계 (액션 모드면 액션 단위). 입력 필드 포커스 시 무시.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target.isContentEditable
        )
          return;
      }
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        if (isActionMode) prevAction();
        else seekStep(stepIndex - 1);
      } else {
        if (isActionMode) nextAction();
        else seekStep(stepIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActionMode, stepIndex]);

  return (
    <div className="flex items-center gap-6 border-t border-surface-border bg-surface-card px-6 py-3">
      {/* Progress */}
      <div className="flex items-center gap-3 text-xs text-ink-secondary">
        <span className="font-medium text-ink-primary">시나리오 진행 컨트롤</span>
        <span className="rounded bg-surface-subtle px-2 py-0.5 font-medium text-ink-primary">
          {Math.min(stepIndex + 1, total)} / {total} 단계
        </span>
        {isActionMode && (
          <span className="rounded bg-brand-primarySoft px-2 py-0.5 font-medium text-brand-primary">
            액션 {actionIndex} / {stepActionTotal}
          </span>
        )}
        <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-surface-subtle md:block">
          <div
            className="h-full bg-brand-primary transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-medium text-ink-secondary">{progress}%</span>
      </div>

      {/* Transport */}
      <div className="ml-auto flex items-center gap-1.5">
        <ControlBtn label="처음으로" onClick={() => seekToStart()}>
          <ChevronsLeft className="h-4 w-4" />
        </ControlBtn>
        <ControlBtn
          label={isActionMode ? '이전 액션' : '이전 단계'}
          onClick={() => (isActionMode ? prevAction() : seekStep(stepIndex - 1))}
        >
          <SkipBack className="h-4 w-4" />
        </ControlBtn>
        <button
          onClick={() => (isPlaying ? pause() : play())}
          aria-label={isPlaying ? '일시 정지' : '재생'}
          className="grid h-10 w-10 place-items-center rounded-full bg-brand-primary text-white shadow-soft hover:bg-brand-primaryHover"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>
        <ControlBtn
          label={isActionMode ? '다음 액션' : '다음 단계'}
          onClick={() => (isActionMode ? nextAction() : seekStep(stepIndex + 1))}
        >
          <SkipForward className="h-4 w-4" />
        </ControlBtn>
        <ControlBtn label="마지막으로" onClick={() => seekStep(steps.length - 1)}>
          <ChevronsRight className="h-4 w-4" />
        </ControlBtn>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-5 text-xs text-ink-secondary">
        <label className="inline-flex items-center gap-2">
          <span>단계 설명 보기</span>
          <Switch checked={showStepGuide} onCheckedChange={toggleStepGuide} />
        </label>
      </div>
    </div>
  );
}

function ControlBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-md text-ink-secondary hover:bg-surface-subtle"
    >
      {children}
    </button>
  );
}

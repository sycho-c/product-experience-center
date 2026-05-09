import { useScenarioStore } from '@/features/scenario/store';
import { applyScenarioSeed } from '@/features/scenario/runner';
import { cn } from '@/lib/utils';

export function BeforeAfterToggle() {
  const mode = useScenarioStore((s) => s.mode);
  const setMode = useScenarioStore((s) => s.setMode);
  const scenario = useScenarioStore((s) => s.scenario);

  const onSelect = (next: 'before' | 'after') => {
    if (next === mode) return;
    setMode(next);
    if (scenario) applyScenarioSeed(scenario);
  };

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-surface-border bg-surface-card p-1 text-xs font-medium">
      <button
        onClick={() => onSelect('before')}
        className={cn(
          'rounded-md px-3 py-2',
          mode === 'before'
            ? 'bg-ink-primary text-white shadow-soft'
            : 'text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        <span className="block text-[10px] uppercase tracking-wider opacity-80">
          Before
        </span>
        <span className="block">카카오톡</span>
      </button>
      <button
        onClick={() => onSelect('after')}
        className={cn(
          'rounded-md px-3 py-2',
          mode === 'after'
            ? 'bg-brand-primary text-white shadow-soft'
            : 'text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        <span className="block text-[10px] uppercase tracking-wider opacity-80">
          After
        </span>
        <span className="block">제품 (Cowork+)</span>
      </button>
    </div>
  );
}

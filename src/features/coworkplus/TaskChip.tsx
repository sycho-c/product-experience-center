import { CheckCircle2, Circle } from 'lucide-react';
import type { TaskChip as TaskChipType } from '@/types/talk';
import { cn } from '@/lib/utils';

interface TaskChipProps {
  chip: TaskChipType;
  /** 클릭 시 처리중 ↔ 완료 토글 (자유 인터랙션) */
  onToggle?: () => void;
}

/**
 * 메시지 버블 하단에 부착되는 할 일 chip.
 * "처리중" → 진한 brand 색 / "완료" → 옅은 muted.
 */
export function TaskChip({ chip, onToggle }: TaskChipProps) {
  const done = chip.status === '완료';
  const Icon = done ? CheckCircle2 : Circle;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-colors',
        done
          ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100/70'
          : 'border-brand-primary/30 bg-brand-primarySoft/60 text-brand-primary hover:bg-brand-primarySoft'
      )}
      aria-label={`할 일 ${chip.status} — ${chip.title}`}
    >
      <Icon className="h-3 w-3" />
      <span className="font-semibold">{chip.status}</span>
      <span className="text-ink-muted">·</span>
      <span className="truncate text-ink-primary">{chip.title}</span>
    </button>
  );
}

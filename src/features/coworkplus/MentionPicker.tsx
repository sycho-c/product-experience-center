import { useMemo } from 'react';
import { Lock, Users } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import type { ParticipantSeed } from '@/types/uiaction';
import { cn } from '@/lib/utils';

const EMPTY_PARTICIPANTS: ParticipantSeed[] = [];

interface MentionPickerProps {
  roomId: string;
  /** 검색 prefix — TalkInput 의 `@xxx` 중 `xxx`. 빈 문자열이면 전체 표시. */
  query: string;
  onPick: (participantId: string, displayName: string) => void;
  onClose: () => void;
}

/**
 * 단체방 비밀 메시지 picker.
 * `@` 로 시작하는 입력에 대응해 외부 참여자 목록을 보여준다.
 */
export function MentionPicker({
  roomId,
  query,
  onPick,
  onClose,
}: MentionPickerProps) {
  const all = useUISimStore(
    (s) => s.participants[roomId] ?? EMPTY_PARTICIPANTS
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const externals = all.filter((p) => p.external);
    if (!q) return externals.slice(0, 30);
    return externals
      .filter((p) => p.displayName.toLowerCase().includes(q))
      .slice(0, 30);
  }, [all, query]);

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-elev animate-fade-in">
      <header className="flex items-center justify-between gap-2 border-b border-surface-border bg-brand-primarySoft/40 px-3 py-1.5 text-[11px] text-ink-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-brand-primary" />
          <span className="font-medium text-brand-primary">비밀 메시지</span>
          <span>대상 외부 참여자를 선택하세요.</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-1.5 py-0.5 text-ink-muted hover:bg-surface-subtle"
        >
          닫기
        </button>
      </header>
      {filtered.length === 0 ? (
        <p className="px-3 py-3 text-xs text-ink-muted">
          외부 참여자가 없습니다.
        </p>
      ) : (
        <ul className="max-h-64 overflow-y-auto py-1 scrollbar-thin">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPick(p.id, p.displayName)}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-surface-subtle',
                  i === 0 && 'bg-surface-subtle/40'
                )}
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-amber-50 text-amber-800">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-ink-primary">
                    {p.displayName}
                  </div>
                  <div className="truncate text-[11px] text-ink-muted">
                    외부 참여자 · {p.id}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

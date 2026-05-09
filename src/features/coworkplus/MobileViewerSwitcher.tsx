import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import type { ParticipantSeed } from '@/types/uiaction';
import { cn } from '@/lib/utils';

const EMPTY_PARTICIPANTS: ParticipantSeed[] = [];

interface MobileViewerSwitcherProps {
  roomId: string;
}

/**
 * 단체방에서 Guest(Mobile) 가 어느 참여자 시점으로 보고 있는지 표시 + 전환.
 * 비밀 메시지 가시성을 시점별로 비교 시연하기 위함.
 */
export function MobileViewerSwitcher({ roomId }: MobileViewerSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const all = useUISimStore(
    (s) => s.participants[roomId] ?? EMPTY_PARTICIPANTS
  );
  const externals = all.filter((p) => p.external);
  const viewerId = useUISimStore((s) => s.mobileViewerParticipantId);
  const setViewer = useUISimStore((s) => s.setMobileViewer);

  const current = externals.find((p) => p.id === viewerId) ?? externals[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (externals.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-full border border-brand-primary/40 bg-brand-primarySoft/60 px-2 py-0.5 text-[10px] font-medium text-brand-primary hover:bg-brand-primarySoft"
      >
        <Eye className="h-2.5 w-2.5" />
        <span>시점</span>
        <span className="text-ink-primary">·</span>
        <span className="max-w-[80px] truncate">
          {current?.displayName ?? '외부 참여자'}
        </span>
        <ChevronDown className="h-2.5 w-2.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 max-h-60 w-44 overflow-y-auto rounded-lg border border-surface-border bg-surface-card shadow-elev scrollbar-thin animate-fade-in">
          <div className="border-b border-surface-border bg-surface-subtle px-2.5 py-1 text-[10px] text-ink-muted">
            시점 전환 ({externals.length}명)
          </div>
          <ul className="py-1">
            {externals.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    setViewer(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[11px]',
                    p.id === viewerId
                      ? 'bg-brand-primarySoft text-brand-primary'
                      : 'text-ink-primary hover:bg-surface-subtle'
                  )}
                >
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-amber-50 text-[9px] font-semibold text-amber-800">
                    {p.displayName.charAt(0)}
                  </div>
                  <span className="truncate">{p.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MockModalProps {
  open: boolean;
  title: string;
  description?: string;
  /** placeholder 본문 (옵션). 없으면 기본 안내 텍스트. */
  children?: React.ReactNode;
  onClose: () => void;
  /** 좁은 디바이스 컨테이너에서 inset 은 디바이스 viewport 기준. */
  size?: 'sm' | 'md';
}

/**
 * fallback 모달 — 자유 인터랙션에서 "준비 중" 또는 placeholder 화면을 일관되게 표시.
 * 시나리오와 무관하게 PC/Mobile 디바이스 안에서 inset 으로 띄워진다.
 */
export function MockModal({
  open,
  title,
  description,
  children,
  onClose,
  size = 'md',
}: MockModalProps) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-3 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          'relative flex max-h-[min(560px,calc(100%-16px))] w-full flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-elev',
          size === 'sm'
            ? 'max-w-[min(360px,calc(100%-16px))]'
            : 'max-w-[min(520px,calc(100%-16px))]'
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mock-modal-title"
      >
        <header className="flex items-start justify-between gap-3 border-b border-surface-border px-4 py-3">
          <div className="min-w-0">
            <h2
              id="mock-modal-title"
              className="truncate text-sm font-semibold text-ink-primary"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-0.5 truncate text-[11px] text-ink-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 shrink-0 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin px-4 py-5 text-sm text-ink-secondary">
          {children ?? (
            <div className="grid place-items-center py-6 text-center">
              <span className="rounded-full border border-dashed border-surface-border px-3 py-1 text-[11px] text-ink-muted">
                체험 화면 placeholder
              </span>
              <p className="mt-3 text-xs text-ink-muted">
                해당 기능은 시연용 미리보기로, 실제 기능은 시나리오 진행 중에 등장합니다.
              </p>
            </div>
          )}
        </div>
        <footer className="flex justify-end border-t border-surface-border bg-surface-canvas px-4 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-surface-border bg-white px-3 text-xs text-ink-primary hover:bg-surface-subtle"
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
}

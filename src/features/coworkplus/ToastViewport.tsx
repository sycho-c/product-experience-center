import { CheckCircle2, X } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { cn } from '@/lib/utils';

export function ToastViewport() {
  const toasts = useUISimStore((s) => s.toasts);
  const remove = useUISimStore((s) => s.removeToast);
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-50 flex flex-col items-start gap-2 max-w-[calc(100%-1.5rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-center gap-2 rounded-lg border bg-surface-card px-3 py-2 shadow-elev animate-fade-in',
            t.tone === 'success' && 'border-emerald-200 text-emerald-800',
            t.tone === 'info' && 'border-blue-200 text-blue-800',
            t.tone === 'warning' && 'border-amber-200 text-amber-800'
          )}
        >
          <CheckCircle2
            className={cn(
              'h-4 w-4',
              t.tone === 'success' && 'text-emerald-600',
              t.tone === 'info' && 'text-blue-600',
              t.tone === 'warning' && 'text-amber-600'
            )}
          />
          <span className="text-xs">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-2 grid h-5 w-5 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
            aria-label="닫기"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

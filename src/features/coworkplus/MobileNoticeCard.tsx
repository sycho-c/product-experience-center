import { MessageCircle } from 'lucide-react';
import type { MobileNotice } from '@/features/ui-simulation/store';

interface MobileNoticeCardProps {
  notice: MobileNotice;
  onTap?: () => void;
}

export function MobileNoticeCard({ notice, onTap }: MobileNoticeCardProps) {
  return (
    <button
      onClick={onTap}
      className="block w-full rounded-xl border border-surface-border bg-yellow-50 p-3 text-left shadow-soft transition-colors hover:border-amber-300"
    >
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-200 text-amber-900">
          <MessageCircle className="h-4 w-4" />
        </div>
        <div className="text-[11px] font-semibold text-amber-800">
          카카오 알림톡
        </div>
      </div>
      <div className="mt-2 text-xs font-medium text-ink-primary">
        {notice.title}
      </div>
      <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-secondary leading-relaxed">
        {notice.body}
      </p>
      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-200/70 px-2 py-1 text-[11px] font-semibold text-amber-900">
        {notice.ctaLabel}
      </div>
    </button>
  );
}

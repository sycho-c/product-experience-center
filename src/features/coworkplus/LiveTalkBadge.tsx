import { useState } from 'react';
import { cn } from '@/lib/utils';

export function LiveTalkBadge() {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setActive((v) => !v)}
      className={cn(
        'flex w-full items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors',
        active
          ? 'bg-brand-primary/20 text-white ring-brand-primary/40'
          : 'bg-brand-sidebarHover text-brand-sidebarText ring-transparent'
      )}
    >
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-[11px] font-semibold',
          active ? 'bg-brand-primary text-white' : 'bg-brand-primary/30 text-white'
        )}
      >
        LiveTalk
      </span>
      <span className="text-brand-sidebarText/80">
        {active ? '활성' : '배분 중지'}
      </span>
    </button>
  );
}

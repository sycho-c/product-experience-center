import {
  Bell,
  Cog,
  MessageCircle,
  MessageSquareText,
  Search,
  User,
  Users,
} from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { MessageInput } from '@/features/coworkplus/MessageInput';
import { formatClock, formatDateLabel } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { Talk } from '@/types/talk';

const EMPTY_TALKS: Talk[] = [];

const KAKAO_SIDE_TABS = [
  { id: 'friend', label: '친구', Icon: User },
  { id: 'chat', label: '채팅', Icon: MessageCircle, active: true },
  { id: 'open', label: '오픈채팅', Icon: MessageSquareText },
  { id: 'noti', label: '알림', Icon: Bell },
  { id: 'settings', label: '설정', Icon: Cog },
];

export function KakaoPCShell() {
  const rooms = useUISimStore((s) => s.rooms);
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const selectRoom = useUISimStore((s) => s.selectRoom);
  const room = useUISimStore((s) =>
    s.currentRoomId ? s.rooms.find((r) => r.id === s.currentRoomId) : null
  );
  const roomTalks = useUISimStore((s) =>
    s.currentRoomId
      ? (s.roomTalks[s.currentRoomId] ?? EMPTY_TALKS)
      : EMPTY_TALKS
  );

  return (
    <div className="flex h-full min-h-[480px] w-full overflow-hidden rounded-lg bg-[#A6BCCB]">
      {/* Far-left vertical icon nav (카카오톡 PC 전형) */}
      <aside className="flex h-full w-[56px] shrink-0 flex-col items-center gap-3 border-r border-black/5 bg-[#3C4858] py-4 text-white">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#FEE500] text-black">
          <MessageCircle className="h-4 w-4" />
        </span>
        {KAKAO_SIDE_TABS.map((t) => (
          <button
            key={t.id}
            className={cn(
              'grid h-8 w-8 place-items-center rounded-md',
              t.active ? 'bg-white/15' : 'hover:bg-white/10'
            )}
            title={t.label}
          >
            <t.Icon className="h-4 w-4" />
          </button>
        ))}
      </aside>

      {/* Chat list */}
      <div className="flex h-full w-auto min-w-[180px] max-w-[280px] basis-[28%] shrink-0 flex-col border-r border-black/5 bg-[#EDF1F6]">
        <header className="flex h-12 items-center gap-2 px-3 text-sm font-semibold text-ink-primary">
          <span>채팅</span>
        </header>
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              placeholder="채팅 검색"
              className="h-8 w-full rounded-md border border-black/5 bg-white pl-8 pr-3 text-xs focus:outline-none"
            />
          </div>
        </div>

        {rooms.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-ink-muted">
            참여 중인 채팅이 없습니다.
          </p>
        ) : (
          <ul className="flex-1 overflow-y-auto scrollbar-thin">
            {rooms.map((r) => {
              const active = r.id === currentRoomId;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => selectRoom(r.id)}
                    className={cn(
                      'flex w-full items-start gap-2.5 px-3 py-2.5 text-left',
                      active ? 'bg-white' : 'hover:bg-white/60'
                    )}
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#FEE500] text-ink-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-ink-primary">
                        {r.title}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-ink-secondary">
                        {r.preview}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Chat body */}
      <section className="flex h-full min-w-0 flex-1 flex-col bg-[#A6BCCB]">
        {room ? (
          <>
            <header className="flex shrink-0 items-center gap-2 bg-[#EDF1F6] px-4 py-2.5 text-sm font-semibold text-ink-primary">
              <span className="truncate">{room.title}</span>
              <span className="rounded bg-[#FEE500] px-1.5 py-0.5 text-[10px] font-semibold text-ink-primary">
                오픈채팅
              </span>
            </header>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5">
              <div className="flex justify-center">
                <span className="rounded-full border border-black/5 bg-white/80 px-3 py-1 text-[11px] text-ink-muted">
                  {formatDateLabel()}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {roomTalks.map((t) => {
                  const me = t.from.role === 'me';
                  const sys = t.type === 'system' || t.from.role === 'system';
                  if (sys) {
                    return (
                      <li key={t.id} className="flex justify-center">
                        <span className="rounded-full border border-black/5 bg-white/80 px-3 py-1 text-[11px] text-ink-muted">
                          {t.content}
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={t.id}
                      className={cn(
                        'flex items-end gap-2',
                        me ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!me && (
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-[#FEE500] text-[11px] font-semibold text-ink-primary">
                          {(t.from.displayName ?? '?').charAt(0)}
                        </div>
                      )}
                      <div
                        className={cn(
                          'flex flex-col gap-1',
                          me ? 'items-end' : 'items-start'
                        )}
                      >
                        {!me && t.from.displayName && (
                          <span className="text-[11px] text-ink-secondary">
                            {t.from.displayName}
                          </span>
                        )}
                        <div
                          className={cn(
                            'max-w-[68%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
                            me
                              ? 'bg-[#FEE500] text-ink-primary'
                              : 'bg-white text-ink-primary'
                          )}
                        >
                          {t.content}
                        </div>
                        <span className="text-[10px] text-ink-muted">
                          {formatClock()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <MessageInput
              roomId={currentRoomId!}
              device="pc"
              sender={{ role: 'me', displayName: '나' }}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/80">
            왼쪽 목록에서 채팅을 선택하세요.
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, Hash, Menu, Plus, Search, Smile } from 'lucide-react';
import { FileExtBadge } from '@/features/talk/FileExtBadge';
import { useUISimStore } from '@/features/ui-simulation/store';
import { getTalkClock, isLastInTalkGroup } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { Talk, TalkAttachment } from '@/types/talk';

const EMPTY_TALKS: Talk[] = [];

interface KakaoMobileShellProps {
  activeRoomId: string | null;
}

export function KakaoMobileShell({ activeRoomId }: KakaoMobileShellProps) {
  const room = useUISimStore((s) =>
    activeRoomId ? s.rooms.find((r) => r.id === activeRoomId) : null
  );
  const talks = useUISimStore((s) =>
    activeRoomId ? (s.roomTalks[activeRoomId] ?? EMPTY_TALKS) : EMPTY_TALKS
  );
  const rawNotices = useUISimStore((s) => s.mobileNotices);
  const notices = useMemo(
    () => rawNotices.filter((n) => !n.consumed),
    [rawNotices]
  );

  const participantCount = room?.participantCount ?? 0;
  const isGroup = participantCount > 2;
  const bgColor = isGroup ? '#B2C7DB' : '#ABC1D1';

  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [talks.length, activeRoomId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* 카톡 헤더 */}
      <header className="flex shrink-0 items-center gap-2 bg-white px-3 py-2.5">
        <button className="text-ink-secondary" aria-label="뒤로">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <span className="min-w-0 truncate text-sm font-semibold text-ink-primary">
            {room?.title ?? '카카오톡'}
          </span>
          {participantCount > 0 && (
            <span className="shrink-0 text-[11px] text-ink-muted">
              {participantCount}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-ink-secondary">
          <Search className="h-4 w-4" />
          <Menu className="h-4 w-4" />
        </div>
      </header>

      {/* 채팅 본문 */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2.5"
        style={{ backgroundColor: bgColor }}
      >
        {/* 푸시 알림 (소비되지 않은 알림만) */}
        {notices.length > 0 && (
          <div className="mb-2 space-y-1.5">
            {notices.map((n) => (
              <div
                key={n.id}
                className="flex flex-col gap-0.5 rounded-xl border-l-[3px] border-red-500 bg-white px-3 py-2 text-[11px] shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-primary">
                    📢 {n.title}
                  </span>
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    N
                  </span>
                </div>
                <p className="line-clamp-1 text-[10px] text-ink-secondary">
                  {n.body}
                </p>
              </div>
            ))}
          </div>
        )}

        {!room ? (
          <div className="flex h-full items-center justify-center px-6">
            <p className="text-center text-[11px] text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.15)]">
              대화방 입장 전입니다.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {talks.map((t, i) => (
              <KakaoBubble
                key={t.id}
                talk={t}
                isLastInGroup={isLastInTalkGroup(t, talks[i + 1])}
                isLatest={i === talks.length - 1}
              />
            ))}
          </ul>
        )}
      </div>

      {/* 입력 바 */}
      <div className="shrink-0 border-t border-black/5 bg-white">
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            className="grid h-6 w-6 place-items-center text-ink-secondary"
            aria-label="추가"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="flex-1 rounded-full bg-[#F0F0F0] px-3.5 py-1.5 text-[11px] text-ink-muted">
            메시지 입력
          </div>
          <button
            className="grid h-6 w-6 place-items-center text-ink-muted"
            aria-label="이모지"
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            className="grid h-6 w-6 place-items-center text-ink-muted"
            aria-label="해시"
          >
            <Hash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface KakaoBubbleProps {
  talk: Talk;
  isLastInGroup?: boolean;
  isLatest?: boolean;
}

function KakaoBubble({
  talk,
  isLastInGroup = true,
  isLatest = false,
}: KakaoBubbleProps) {
  const sys = talk.type === 'system' || talk.from.role === 'system';
  if (sys) {
    return (
      <li className={cn('flex justify-center', isLatest && 'animate-fade-in')}>
        <span className="rounded-full bg-black/20 px-3 py-0.5 text-[10px] text-white">
          {talk.content}
        </span>
      </li>
    );
  }

  const isMe = talk.from.role === 'me';
  const senderName = talk.from.displayName;
  const avatarLabel = (senderName ?? '?').slice(-2);

  return (
    <li
      className={cn(
        'flex gap-1.5',
        isMe ? 'justify-end' : 'justify-start',
        isLatest && 'animate-fade-in'
      )}
    >
      {!isMe && (
        <div className="mt-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FEE500] text-[10px] font-semibold text-ink-primary">
          {avatarLabel}
        </div>
      )}
      <div
        className={cn(
          'flex w-full max-w-[78%] flex-col gap-0.5',
          isMe ? 'items-end' : 'items-start'
        )}
      >
        {!isMe && senderName && (
          <span className="ml-0.5 text-[11px] font-medium text-ink-primary/85">
            {senderName}
          </span>
        )}
        <div
          className={cn(
            'flex w-full items-end gap-1',
            isMe ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <div
            className={cn(
              'min-w-0 break-words rounded-xl px-2.5 py-1.5 text-[12px] leading-relaxed shadow-sm [overflow-wrap:anywhere]',
              isMe
                ? 'rounded-tr-[2px] bg-[#FEE500] text-ink-primary'
                : 'rounded-tl-[2px] bg-white text-ink-primary'
            )}
          >
            {talk.content}
          </div>
          <span
            className={cn(
              'shrink-0 pb-0.5 text-[9px] text-black/55',
              ((talk.attachments?.length ?? 0) > 0 || !isLastInGroup) &&
                'invisible'
            )}
          >
            {getTalkClock(talk.id)}
          </span>
        </div>
        {talk.attachments?.map((att, i) => {
          const isLastFile = i === (talk.attachments?.length ?? 0) - 1;
          const showTime = isLastFile && isLastInGroup;
          return (
            <div
              key={`${talk.id}-att-${i}`}
              className={cn(
                'flex w-full items-end gap-1',
                isMe ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <KakaoAttachmentCard att={att} isMe={isMe} />
              <span
                className={cn(
                  'shrink-0 pb-0.5 text-[9px] text-black/55',
                  !showTime && 'invisible'
                )}
              >
                {getTalkClock(talk.id)}
              </span>
            </div>
          );
        })}
      </div>
    </li>
  );
}

function KakaoAttachmentCard({
  att,
  isMe,
}: {
  att: TalkAttachment;
  isMe: boolean;
}) {
  const isImage =
    att.mime?.startsWith('image/') ||
    /\.(png|jpe?g|gif|svg|webp)$/i.test(att.name);
  if (isImage && att.url) {
    return (
      <a
        href={att.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm',
          isMe ? 'self-end' : 'self-start'
        )}
      >
        <img
          src={att.url}
          alt={att.name}
          className="block max-h-40 w-auto max-w-[180px] object-contain"
        />
      </a>
    );
  }
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-black/5 bg-white px-2 py-1.5 text-[11px] shadow-sm'
      )}
    >
      <FileExtBadge name={att.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-primary" title={att.name}>
          {att.name}
        </p>
        {typeof att.size === 'number' && (
          <p className="text-[10px] text-ink-muted">{formatFileSize(att.size)}</p>
        )}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

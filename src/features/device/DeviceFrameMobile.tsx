import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  LayoutGrid,
  Lock,
  Menu,
  Smartphone,
  Users,
} from 'lucide-react';
import { FileExtBadge } from '@/features/talk/FileExtBadge';
import { useTalkStore } from '@/features/talk/store';
import { useUISimStore } from '@/features/ui-simulation/store';
import { MobileMessageInput } from '@/features/coworkplus/MessageInput';
import { MobileMenuDropdown } from '@/features/coworkplus/MobileMenuDropdown';
import { BizFormModal } from '@/features/coworkplus/BizFormModal';
import { KakaoMobileShell } from '@/features/kakao/KakaoMobileShell';
import { MockModal } from '@/components/MockModal';
import { getTalkClock, isLastInTalkGroup } from '@/lib/time';
import { cn } from '@/lib/utils';
import type { Talk, TalkAttachment } from '@/types/talk';
import type { ParticipantSeed } from '@/types/uiaction';

const EMPTY_TALKS: Talk[] = [];
const EMPTY_PARTICIPANTS: never[] = [];

interface DeviceFrameMobileProps {
  label?: string;
  emptyState?: boolean;
  mode?: 'after' | 'before';
}

export function DeviceFrameMobile({
  label,
  emptyState = false,
  mode = 'after',
}: DeviceFrameMobileProps) {
  const isKakao = mode === 'before';
  const displayLabel = label ?? (isKakao ? '카카오톡' : 'Guest');
  const rawTimeline = useTalkStore((s) => s.timeline);
  const legacyTimeline = useMemo(
    () =>
      rawTimeline.filter((t) => t.device === 'mobile' || t.device === 'all'),
    [rawTimeline]
  );

  const mobileRoomId = useUISimStore((s) => s.mobileRoomId);
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  // Before(카톡) 모드에서 모바일이 별도 선택을 안 했으면 PC 가 보는 방을 자동 폴백
  const activeRoomId = isKakao ? (mobileRoomId ?? currentRoomId) : mobileRoomId;
  const room = useUISimStore((s) =>
    activeRoomId ? s.rooms.find((r) => r.id === activeRoomId) : null
  );
  const roomTalks = useUISimStore((s) =>
    activeRoomId ? (s.roomTalks[activeRoomId] ?? EMPTY_TALKS) : EMPTY_TALKS
  );
  const chatList = useUISimStore((s) => s.mobileChatList);
  const setMobileRoom = useUISimStore((s) => s.setMobileRoom);
  const markRead = useUISimStore((s) => s.markMobileChatRead);
  const consumeNotice = useUISimStore((s) => s.consumeMobileNotice);

  const showRoom = !!activeRoomId;

  const onTapChat = (roomId: string, noticeId?: string) => {
    setMobileRoom(roomId);
    markRead(noticeId ?? roomId);
    if (noticeId) consumeNotice(noticeId);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Label chip + Guest viewer selector */}
      <div className="flex shrink-0 items-center justify-center gap-1.5 pb-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-card px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary shadow-soft">
          <Smartphone className="h-3 w-3" />
          {displayLabel}
        </span>
        {!isKakao && <GuestViewerChip activeRoomId={mobileRoomId} />}
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-1">
        <div
          className="@container/device relative flex h-full max-h-[640px] min-h-0 w-auto flex-col overflow-hidden rounded-[36px] border-[6px] border-ink-primary/85 bg-surface-card shadow-elev"
          style={{ aspectRatio: '9 / 19.5' }}
        >
          {/* Notch */}
          <div className="relative h-7 shrink-0 bg-surface-card">
            <span className="absolute left-4 top-1.5 text-[11px] font-medium">
              9:41
            </span>
            <span className="absolute left-1/2 top-1 h-4 w-16 -translate-x-1/2 rounded-full bg-ink-primary/85" />
          </div>

          {isKakao ? (
            <KakaoMobileShell activeRoomId={activeRoomId} />
          ) : (
            <div
              key={showRoom ? activeRoomId : 'list'}
              className="flex min-h-0 flex-1 animate-slide-in-right flex-col"
            >
              {showRoom ? (
                <ChatRoomScreen
                  roomTitle={room?.title ?? '대화'}
                  participantCount={room?.participantCount ?? 1}
                  talks={roomTalks}
                  roomId={activeRoomId!}
                  onBack={() => setMobileRoom(null)}
                  isKakao={isKakao}
                />
              ) : (
                <ChatListScreen
                  chatList={chatList}
                  onTap={onTapChat}
                  fallbackMessages={legacyTimeline}
                  emptyState={emptyState}
                  isKakao={isKakao}
                />
              )}
            </div>
          )}

          {/* Mobile BizForm modal — Cowork+ 모드만 */}
          {showRoom && !isKakao && activeRoomId && (
            <BizFormModal roomId={activeRoomId} />
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatListScreenProps {
  chatList: ReturnType<typeof useUISimStore.getState>['mobileChatList'];
  onTap: (roomId: string, noticeId?: string) => void;
  fallbackMessages: Talk[];
  emptyState?: boolean;
  isKakao?: boolean;
}

function ChatListScreen({
  chatList,
  onTap,
  fallbackMessages: _fallback,
  emptyState: _emptyState,
  isKakao = false,
}: ChatListScreenProps) {
  const invited = chatList.filter((c) => c.unread > 0);
  const joined = chatList.filter((c) => c.unread === 0);
  const noJoined = joined.length === 0;

  return (
    <>
      <div className="flex items-center justify-between border-b border-surface-border bg-surface-card px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button className="grid h-7 w-7 place-items-center rounded text-ink-secondary hover:bg-surface-subtle">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-primary">
            진행 중 대화방
            <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
          </span>
        </div>
      </div>

      {invited.length > 0 && (
        <div className="shrink-0 bg-surface-subtle/60 px-3 pb-3 pt-2">
          <p className="mb-2 text-[11px] text-ink-secondary">
            <strong className="text-ink-primary">{invited.length}</strong>개의 대화방에 초대되었습니다.
          </p>
          <ul className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
            {invited.map((c) => (
              <li key={c.roomId} className="shrink-0">
                <button
                  onClick={() => onTap(c.roomId, c.noticeId)}
                  className={cn(
                    'flex w-[120px] flex-col gap-1 rounded-lg border border-surface-border bg-surface-card px-3 py-2.5 text-left shadow-soft transition-shadow hover:shadow-elev',
                    isKakao && 'bg-white'
                  )}
                >
                  <span className="truncate text-xs font-semibold text-ink-primary">
                    {c.title}
                  </span>
                  <span className="truncate text-[11px] text-ink-secondary">
                    {c.lastMessage || '조승열'}
                  </span>
                  <span className="mt-1 text-[10px] text-ink-muted">
                    {c.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {noJoined ? (
          <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="mb-3 grid h-20 w-20 place-items-center rounded-2xl bg-surface-subtle/70 text-ink-subtle">
              <ChatBubbleIcon className="h-10 w-10" />
            </div>
            <p
              className="text-center text-xs text-ink-muted"
              style={{ wordBreak: 'keep-all' }}
            >
              대화목록이 없습니다.
            </p>
          </div>
        ) : (
          <ul>
            {joined.map((entry) => (
              <li key={entry.roomId}>
                <button
                  onClick={() => onTap(entry.roomId, entry.noticeId)}
                  className="flex w-full items-start gap-2.5 px-3 py-3 text-left transition-colors hover:bg-surface-subtle"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-xs font-semibold text-ink-primary">
                      <span className="truncate">{entry.title}</span>
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-ink-secondary">
                      {entry.lastMessage}
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    {entry.time}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M5 4h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9.5L6 20v-3.5A3 3 0 0 1 4 14V7a3 3 0 0 1 1-3z" opacity=".5" />
      <path d="M9 7h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6.5L10 23v-3.5A3 3 0 0 1 8 17v-7a3 3 0 0 1 1-3z" opacity=".7" />
      <circle cx="13" cy="13" r="1" fill="white" opacity=".9" />
      <circle cx="16" cy="13" r="1" fill="white" opacity=".9" />
      <circle cx="19" cy="13" r="1" fill="white" opacity=".9" />
    </svg>
  );
}

interface ChatRoomScreenProps {
  roomTitle: string;
  participantCount: number;
  talks: Talk[];
  roomId: string;
  onBack: () => void;
  isKakao?: boolean;
}

function ChatRoomScreen({
  roomTitle,
  participantCount,
  talks,
  roomId,
  onBack,
  isKakao = false,
}: ChatRoomScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [placeholder, setPlaceholder] = useState<string | null>(null);

  const viewerId = useUISimStore((s) => s.mobileViewerParticipantId);
  const participants = useUISimStore(
    (s) => s.participants[roomId] ?? EMPTY_PARTICIPANTS
  );
  const externals = participants.filter((p) => p.external);
  const viewerParticipant =
    externals.find((p) => p.id === viewerId) ?? externals[0] ?? null;
  const viewerSenderRole = viewerParticipant ? 'customer' : 'customer';

  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [talks.length, viewerId]);

  return (
    <>
      {/* Header */}
      <div
        className={cn(
          'relative flex items-center justify-between border-b border-surface-border px-2 py-2',
          isKakao && 'bg-[#EDF1F6]'
        )}
      >
        <button onClick={onBack} className="text-ink-secondary">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1">
          <span className="flex max-w-full items-center gap-1 text-sm font-semibold">
            <span className="min-w-0 flex-1 truncate" title={roomTitle}>
              {roomTitle}
            </span>
            <span className="shrink-0 text-[10px] text-ink-muted font-normal">
              ({participantCount})
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="메뉴"
          className={cn(
            'text-ink-secondary',
            menuOpen && 'text-brand-primary'
          )}
        >
          <Menu className="h-4 w-4" />
        </button>
        {menuOpen && !isKakao && (
          <MobileMenuDropdown
            onClose={() => setMenuOpen(false)}
            onPlaceholder={(label) => setPlaceholder(label)}
          />
        )}
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className={cn(
          'flex-1 overflow-y-auto scrollbar-thin px-3 py-3',
          isKakao && 'bg-[#A6BCCB]'
        )}
      >
        <ul className="space-y-2">
          {talks.map((t, i) => (
            <MobileBubble
              key={t.id}
              talk={t}
              viewerParticipant={viewerParticipant}
              participants={participants}
              isKakao={isKakao}
              isLastInGroup={isLastInTalkGroup(t, talks[i + 1])}
              isLatest={i === talks.length - 1}
            />
          ))}
        </ul>
      </div>

      {/* Input */}
      <MobileMessageInput
        roomId={roomId}
        sender={
          viewerParticipant
            ? {
                role: viewerSenderRole,
                userId: viewerParticipant.id,
                displayName: viewerParticipant.displayName,
              }
            : undefined
        }
      />

      <MockModal
        open={placeholder !== null}
        title={placeholder ?? ''}
        description="해당 메뉴는 시연용 미리보기로 표시됩니다."
        onClose={() => setPlaceholder(null)}
        size="sm"
      />
    </>
  );
}

interface MobileBubbleProps {
  talk: Talk;
  viewerParticipant: ParticipantSeed | null;
  participants: ParticipantSeed[];
  isKakao: boolean;
  isLastInGroup?: boolean;
  isLatest?: boolean;
}

function MobileBubble({
  talk,
  viewerParticipant,
  participants,
  isKakao,
  isLastInGroup = true,
  isLatest = false,
}: MobileBubbleProps) {
  const sys = talk.type === 'system' || talk.from.role === 'system';
  if (sys) {
    return (
      <li className={cn('flex justify-center', isLatest && 'animate-fade-in')}>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[10px]',
            isKakao
              ? 'border-black/5 bg-white/80 text-ink-muted'
              : 'border-surface-border bg-surface-card text-ink-muted'
          )}
        >
          {talk.content}
        </span>
      </li>
    );
  }

  // Guest 시점 가시성:
  // - 본인이 보낸 메시지 (from.userId 또는 외부 참여자명으로 viewer 와 매칭)
  // - 비밀 메시지 가시성: viewer === recipient → 풀 / 외 → placeholder
  const isMe = isTalkFromMobileViewer(talk, viewerParticipant);
  const isSecret = !!talk.secret;
  const isViewerRecipient =
    isSecret && viewerParticipant?.id === talk.secret!.recipientParticipantId;
  const showPlaceholder = isSecret && !isViewerRecipient && !isMe;
  const senderName = resolveMobileSenderName(talk, participants);
  const avatarLabel = getAvatarLabel(senderName);

  const isNavy = talk.bubbleTone === 'navy' || isSecret;
  const navyStyles = 'bg-brand-sidebar text-white';

  const meStyles = isKakao
    ? 'bg-[#FEE500] text-ink-primary'
    : isNavy
      ? navyStyles
      : 'bg-brand-primary text-white';
  const otherStyles = isKakao
    ? 'bg-white text-ink-primary'
    : isNavy
      ? navyStyles
      : 'bg-surface-subtle text-ink-primary';

  const bubble = showPlaceholder ? (
    <div className="rounded-2xl bg-surface-subtle/80 px-3 py-1.5 text-[11px] italic text-ink-muted">
      <span className="inline-flex items-center gap-1">
        <Lock className="h-2.5 w-2.5" />
        비밀 메시지로 작성되었습니다.
      </span>
    </div>
  ) : (
    <div
      className={cn(
        'min-w-0 rounded-2xl px-3 py-1.5 text-xs leading-relaxed break-words [overflow-wrap:anywhere]',
        isMe ? meStyles : otherStyles
      )}
    >
      {isSecret && (
        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-white/80">
          <Lock className="h-2.5 w-2.5" />
          비밀 메시지
        </div>
      )}
      {talk.content}
    </div>
  );

  return (
    <li
      className={cn(
        'flex',
        isMe ? 'justify-end' : 'justify-start',
        isLatest && 'animate-fade-in'
      )}
    >
      {!isMe && (
        <div className="mr-2 mt-4 grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-primary text-[10px] font-semibold text-white shadow-soft">
          {talk.from.avatarUrl ? (
            <img
              src={talk.from.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            avatarLabel
          )}
        </div>
      )}
      <div
        className={cn(
          'flex w-full max-w-[80%] flex-col gap-0.5',
          isMe ? 'items-end' : 'items-start'
        )}
      >
        {!isMe && senderName && (
          <span className="text-[11px] font-semibold text-ink-secondary">
            {senderName}
          </span>
        )}
        {showPlaceholder ? (
          bubble
        ) : (
          <div
            className={cn(
              'flex w-full min-w-0 items-end gap-1',
              isMe ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {bubble}
            <span
              className={cn(
                'shrink-0 text-[10px] text-ink-muted',
                ((talk.attachments?.length ?? 0) > 0 || !isLastInGroup) &&
                  'invisible'
              )}
            >
              {getTalkClock(talk.id)}
            </span>
          </div>
        )}
        {!showPlaceholder && talk.attachments?.map((att, i) => {
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
              <MobileAttachmentCard att={att} isMe={isMe} />
              <span
                className={cn(
                  'shrink-0 pb-0.5 text-[10px] text-ink-muted',
                  !showTime && 'invisible'
                )}
              >
                {getTalkClock(talk.id)}
              </span>
            </div>
          );
        })}
        {talk.taskChip && !showPlaceholder && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px]',
              talk.taskChip.status === '완료'
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700'
                : 'border-brand-primary/30 bg-brand-primarySoft/60 text-brand-primary'
            )}
          >
            {talk.taskChip.status} · {talk.taskChip.title}
          </span>
        )}
      </div>
    </li>
  );
}

function MobileAttachmentCard({
  att,
  isMe,
}: {
  att: TalkAttachment;
  isMe: boolean;
}) {
  const isImage = att.mime?.startsWith('image/') || /\.(png|jpe?g|gif|svg|webp)$/i.test(att.name);
  if (isImage && att.url) {
    return (
      <a
        href={att.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'overflow-hidden rounded-xl border border-surface-border bg-white shadow-sm',
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
        'flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-surface-border bg-white px-2 py-1.5 text-[11px] shadow-sm'
      )}
    >
      <FileExtBadge name={att.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink-primary" title={att.name}>
          {att.name}
        </p>
        {typeof att.size === 'number' && (
          <p className="text-[10px] text-ink-muted">
            {formatFileSize(att.size)}
          </p>
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

function isTalkFromMobileViewer(
  talk: Talk,
  viewerParticipant: ParticipantSeed | null
): boolean {
  if (!viewerParticipant) return talk.from.role === 'customer';
  if (talk.from.userId) return talk.from.userId === viewerParticipant.id;
  return (
    talk.from.role === 'customer' &&
    talk.from.displayName === viewerParticipant.displayName
  );
}

function resolveMobileSenderName(
  talk: Talk,
  participants: ParticipantSeed[]
): string | undefined {
  if (talk.from.userId) {
    const participant = participants.find((p) => p.id === talk.from.userId);
    if (participant) return participant.displayName;
  }

  if (talk.from.role === 'me' && talk.from.displayName === '나') {
    const host =
      participants.find((p) => p.isHost) ??
      participants.find((p) => !p.external);
    if (host) return host.displayName;
  }

  return talk.from.displayName;
}

function getAvatarLabel(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return '?';
  return trimmed.slice(-2);
}

interface GuestViewerChipProps {
  activeRoomId: string | null;
}

function GuestViewerChip({ activeRoomId }: GuestViewerChipProps) {
  const chatList = useUISimStore((s) => s.mobileChatList);
  const participantsMap = useUISimStore((s) => s.participants);
  const viewerId = useUISimStore((s) => s.mobileViewerParticipantId);
  const setMobileViewer = useUISimStore((s) => s.setMobileViewer);
  const [open, setOpen] = useState(false);

  // 가장 최근 활성 방 — 진입한 방 우선, 없으면 가장 위에 보이는 채팅 카드
  const targetRoomId = activeRoomId ?? chatList[0]?.roomId ?? null;
  const externals = useMemo(() => {
    if (!targetRoomId) return [];
    return (participantsMap[targetRoomId] ?? []).filter((p) => p.external);
  }, [targetRoomId, participantsMap]);

  if (externals.length === 0) return null;

  if (externals.length === 1) {
    const only = externals[0];
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-primarySoft/70 px-2 py-0.5 text-[11px] font-medium text-brand-primary shadow-soft">
        {only.displayName}
      </span>
    );
  }

  const current =
    externals.find((p) => p.id === viewerId) ?? externals[0];

  const onPick = (id: string) => {
    setMobileViewer(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full bg-brand-primarySoft/70 px-2 py-0.5 text-[11px] font-medium text-brand-primary shadow-soft hover:bg-brand-primarySoft"
      >
        {current.displayName}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <ul className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[140px] rounded-md border border-surface-border bg-surface-card py-1 text-xs shadow-elev">
            {externals.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onPick(p.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left hover:bg-surface-subtle',
                    p.id === current.id && 'text-brand-primary'
                  )}
                >
                  <span className="truncate">{p.displayName}</span>
                  {p.id === current.id && <Check className="h-3 w-3" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

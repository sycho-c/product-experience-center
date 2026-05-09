import { useEffect, useRef, useState } from 'react';
import {
  CheckSquare,
  ChevronRight,
  Info,
  Lock,
  LogOut,
  Megaphone,
  Square,
  UserPlus2,
  Users,
  X,
} from 'lucide-react';
import { useTalkStore } from '@/features/talk/store';
import { useUISimStore } from '@/features/ui-simulation/store';
import type { Talk } from '@/types/talk';
import { formatClock, formatDateLabel } from '@/lib/time';
import { TalkInput } from './TalkInput';
import { TalkInlineCards } from '@/features/talk/TalkInlineCards';
import { progressOrDo } from '@/lib/use-scenario-match';
import { MockModal } from '@/components/MockModal';
import { TaskChip } from './TaskChip';
import { MessageActionsMenu } from './MessageActionsMenu';
import { cn } from '@/lib/utils';

type HeaderMockKind = 'check' | 'notice' | 'invite' | 'leave' | 'collapse';

const HEADER_MOCK_TITLES: Record<HeaderMockKind, string> = {
  check: '읽음 확인',
  notice: '공지 등록',
  invite: '대화방 초대',
  leave: '대화방 나가기',
  collapse: '대화방 접기',
};

const HEADER_MOCK_DESCRIPTIONS: Record<HeaderMockKind, string> = {
  check: '대화방 참여자별 읽음 상태를 확인합니다.',
  notice: '대화방 상단에 고정될 공지를 작성합니다.',
  invite: '대화방에 새로운 내부/외부 참여자를 초대합니다.',
  leave: '대화방에서 나갑니다. 호스트는 위임 후 나갈 수 있습니다.',
  collapse: '대화방 영역을 접어 목록만 표시합니다.',
};

interface TalkRoomViewProps {
  roomTitle?: string;
  participantCount?: number;
  skin?: 'cowork' | 'kakao';
  emptyState?: boolean;
  rightRailOpen?: boolean;
  onToggleRightRail?: () => void;
}

const EMPTY_TALKS: Talk[] = [];
const EMPTY_PARTICIPANTS: never[] = [];

export function TalkRoomView({
  roomTitle: roomTitleProp,
  participantCount: participantCountProp,
  skin = 'cowork',
  emptyState = false,
  rightRailOpen = false,
  onToggleRightRail,
}: TalkRoomViewProps) {
  const [headerMock, setHeaderMock] = useState<HeaderMockKind | null>(null);
  const legacyTimeline = useTalkStore((s) => s.timeline);
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const room = useUISimStore((s) =>
    s.currentRoomId ? s.rooms.find((r) => r.id === s.currentRoomId) : undefined
  );
  const roomTalks = useUISimStore((s) =>
    s.currentRoomId ? (s.roomTalks[s.currentRoomId] ?? EMPTY_TALKS) : EMPTY_TALKS
  );
  const multiSelect = useUISimStore((s) => s.multiSelect);
  const enterMultiSelect = useUISimStore((s) => s.enterMultiSelect);
  const exitMultiSelect = useUISimStore((s) => s.exitMultiSelect);
  const toggleMessageSelect = useUISimStore((s) => s.toggleMessageSelect);
  const setModal = useUISimStore((s) => s.setModal);
  const isMultiActive =
    !!multiSelect && multiSelect.roomId === currentRoomId;

  // ui-simulation 의 방이 있으면 그걸 우선, 아니면 legacy timeline.
  const timeline = currentRoomId ? roomTalks : legacyTimeline;
  const roomTitle = room?.title ?? roomTitleProp ?? '승열P';
  const participantCount = room?.participantCount ?? participantCountProp ?? 1;

  const onCreateTaskFromSelected = () => {
    if (!multiSelect || multiSelect.selectedIds.length === 0) return;
    progressOrDo(() => {
      setModal('task-registration', {
        open: true,
        step: 1,
        data: {
          roomId: multiSelect.roomId,
          sourceMessageIds: [...multiSelect.selectedIds],
          sourceMessageId: multiSelect.selectedIds[0],
          mode: 'create',
        },
      });
    });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [timeline.length, currentRoomId]);

  if ((emptyState || !currentRoomId) && timeline.length === 0) {
    return <TalkRoomEmpty />;
  }

  const isKakao = skin === 'kakao';

  return (
    <section
      className={cn(
        'flex h-full min-w-0 flex-1 flex-col',
        isKakao ? 'bg-kakao-bg' : 'bg-surface-card'
      )}
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-surface-border bg-surface-card px-4 py-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
          <Users className="h-4 w-4" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-semibold text-ink-primary">
          <span className="min-w-0 flex-1 truncate" title={roomTitle}>
            {roomTitle}
          </span>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-ink-muted font-normal">
            <Users className="h-3 w-3" />
            {participantCount}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-ink-muted">
          <button
            type="button"
            aria-label={isMultiActive ? '다중 선택 종료' : '다중 메시지 선택'}
            aria-pressed={isMultiActive}
            onClick={() =>
              progressOrDo(() => {
                if (!currentRoomId) return;
                if (isMultiActive) exitMultiSelect();
                else enterMultiSelect(currentRoomId);
              })
            }
            className={cn(
              'grid h-7 w-7 place-items-center rounded transition-colors',
              isMultiActive
                ? 'bg-brand-primarySoft text-brand-primary'
                : 'hover:bg-surface-subtle'
            )}
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <HeaderIconButton
            icon={<MaskedCheck />}
            label="확인"
            onClick={() => setHeaderMock('check')}
          />
          <HeaderIconButton
            icon={<Megaphone className="h-4 w-4" />}
            label="공지"
            onClick={() => setHeaderMock('notice')}
          />
          <HeaderIconButton
            icon={<UserPlus2 className="h-4 w-4" />}
            label="초대"
            onClick={() => setHeaderMock('invite')}
          />
          <button
            type="button"
            aria-label={rightRailOpen ? '협업 패널 닫기' : '협업 패널 열기'}
            aria-pressed={rightRailOpen}
            onClick={onToggleRightRail}
            className={cn(
              'grid h-7 w-7 place-items-center rounded transition-colors',
              rightRailOpen
                ? 'bg-brand-primarySoft text-brand-primary'
                : 'hover:bg-surface-subtle'
            )}
          >
            <Info className="h-4 w-4" />
          </button>
          <HeaderIconButton
            icon={<LogOut className="h-4 w-4" />}
            label="나가기"
            onClick={() => setHeaderMock('leave')}
          />
          <button
            type="button"
            aria-label="대화방 접기"
            onClick={() => setHeaderMock('collapse')}
            className="grid h-7 w-7 place-items-center rounded hover:bg-surface-subtle ml-1"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <MockModal
        open={headerMock !== null}
        title={headerMock ? HEADER_MOCK_TITLES[headerMock] : ''}
        description={
          headerMock ? HEADER_MOCK_DESCRIPTIONS[headerMock] : undefined
        }
        onClose={() => setHeaderMock(null)}
      />

      {/* Timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin px-6 py-6"
      >
        <DateDivider label={formatDateLabel()} />
        <ul className="mt-4 space-y-3">
          {timeline.map((talk) => {
            const selectable =
              isMultiActive &&
              talk.type !== 'system' &&
              talk.from.role !== 'system';
            const selected =
              isMultiActive &&
              !!multiSelect?.selectedIds.includes(talk.id);
            return (
              <li key={talk.id}>
                <div className="flex items-start gap-2">
                  {isMultiActive && (
                    <button
                      type="button"
                      disabled={!selectable}
                      aria-label={selected ? '선택 해제' : '선택'}
                      aria-pressed={selected}
                      onClick={() =>
                        selectable &&
                        progressOrDo(() => toggleMessageSelect(talk.id))
                      }
                      className={cn(
                        'mt-1.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors',
                        !selectable && 'opacity-30 cursor-not-allowed border-surface-border',
                        selectable &&
                          (selected
                            ? 'border-brand-primary bg-brand-primary text-white'
                            : 'border-surface-border bg-white hover:border-brand-primary')
                      )}
                    >
                      {selected ? (
                        <CheckSquare className="h-3 w-3" />
                      ) : (
                        <Square className="h-3 w-3" />
                      )}
                    </button>
                  )}
                  <div className="min-w-0 flex-1">
                    <TalkBubble talk={talk} skin={skin} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {isMultiActive && (
        <div className="flex shrink-0 items-center justify-between border-t border-surface-border bg-brand-primarySoft/40 px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-ink-primary">
            <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-brand-primary px-1.5 text-[11px] font-semibold text-white">
              {multiSelect?.selectedIds.length ?? 0}
            </span>
            개 메시지 선택됨
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => progressOrDo(() => exitMultiSelect())}
              className="inline-flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-[11px] text-ink-secondary hover:bg-surface-subtle"
            >
              <X className="h-3 w-3" />
              취소
            </button>
            <button
              type="button"
              onClick={onCreateTaskFromSelected}
              disabled={(multiSelect?.selectedIds.length ?? 0) === 0}
              className="inline-flex items-center gap-1 rounded-md bg-brand-primary px-3 py-1 text-[11px] font-medium text-white hover:bg-brand-primaryHover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckSquare className="h-3 w-3" />
              할 일 생성
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <TalkInput />
    </section>
  );
}

function TalkRoomEmpty() {
  const setModal = useUISimStore((s) => s.setModal);
  const onCreate = () =>
    progressOrDo(() =>
      setModal('create-room', { open: true, step: 1, tab: 'internal' })
    );
  return (
    <section
      className="flex h-full min-w-0 flex-1 flex-col items-center justify-center bg-surface-card px-4 text-center"
      style={{ wordBreak: 'keep-all' }}
    >
      <div className="max-w-[280px] text-2xl font-bold text-brand-primary md:text-3xl">
        좋은 하루 보내세요. <span aria-hidden>🙂</span>
      </div>
      <p className="mt-3 max-w-[280px] text-sm text-ink-secondary">
        새 대화방을 만들어 협업을 시작해 보세요.
      </p>
      <button
        onClick={onCreate}
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-white px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primarySoft"
      >
        <span className="text-brand-primary">+</span>
        새 대화방 만들기
      </button>
    </section>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center">
      <span className="rounded-full border border-surface-border bg-surface-card px-3 py-1 text-[11px] text-ink-muted">
        {label}
      </span>
    </div>
  );
}

function HeaderIconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-7 w-7 place-items-center rounded hover:bg-surface-subtle"
    >
      {icon}
    </button>
  );
}

function MaskedCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface TalkBubbleProps {
  talk: Talk;
  skin: 'cowork' | 'kakao';
}

function TalkBubble({ talk, skin }: TalkBubbleProps) {
  const time = formatClock(new Date(Date.now() - (10_000 - talk.offsetMs)));
  const isMe = talk.from.role === 'me';
  const isSystem = talk.type === 'system' || talk.from.role === 'system';

  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const participants = useUISimStore((s) =>
    currentRoomId
      ? (s.participants[currentRoomId] ?? EMPTY_PARTICIPANTS)
      : EMPTY_PARTICIPANTS
  );
  const patchTalk = useUISimStore((s) => s.patchTalk);

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <span className="rounded-full border border-surface-border bg-surface-card px-3 py-1 text-[11px] text-ink-muted">
          {talk.content}
        </span>
        <span className="sr-only">{time}</span>
      </div>
    );
  }

  const isKakao = skin === 'kakao';
  const isSecret = !!talk.secret;
  const isNavy = talk.bubbleTone === 'navy' || isSecret;
  const recipient = talk.secret
    ? participants.find((p) => p.id === talk.secret!.recipientParticipantId)
    : null;

  const bubbleBase =
    'rounded-xl px-3 py-2 text-xs leading-relaxed break-words';
  // navy 톤 (비밀 메시지) — 호스트/상대 모두 동일하게 진한 네이비 표시.
  const navyStyles = 'bg-brand-sidebar text-white';
  const meStyles = isKakao
    ? 'bg-kakao-bubble text-ink-primary'
    : isNavy
      ? navyStyles
      : 'bg-brand-primary text-white';
  const otherStyles = isKakao
    ? 'bg-kakao-bubbleAlt text-ink-primary'
    : isNavy
      ? navyStyles
      : 'bg-surface-subtle text-ink-primary';

  const onToggleChip = () => {
    if (!currentRoomId || !talk.taskChip) return;
    const next: typeof talk.taskChip = {
      ...talk.taskChip,
      status: talk.taskChip.status === '완료' ? '처리중' : '완료',
    };
    patchTalk(currentRoomId, talk.id, { taskChip: next });
  };

  // 좌우 동일 폭을 위해 column 컨테이너에 max-w 를 부여 (bubble 자체에는 부여하지 않음).
  return (
    <div
      className={cn(
        'group/talk flex items-start gap-2',
        isMe ? 'justify-end' : 'justify-start'
      )}
    >
      {!isMe && (
        <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-semibold text-brand-primary">
          {(talk.from.displayName ?? '?').charAt(0)}
        </div>
      )}
      <div
        className={cn(
          'flex min-w-0 flex-col gap-0.5',
          'max-w-[min(85%,360px)]',
          isMe ? 'items-end' : 'items-start'
        )}
      >
        {!isMe && talk.from.displayName && (
          <span className="text-[11px] text-ink-secondary">
            {talk.from.displayName}
          </span>
        )}
        {isSecret && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[10px] font-medium',
              isMe ? 'text-brand-primary/90' : 'text-brand-primary'
            )}
          >
            <Lock className="h-2.5 w-2.5" />
            비밀 메시지 · {recipient?.displayName ?? '대상 외부 참여자'} 에게만
            보임
          </span>
        )}
        <div className="relative">
          <div className={cn(bubbleBase, isMe ? meStyles : otherStyles)}>
            {talk.content}
          </div>
          {!isKakao && (
            <MessageActionsMenu
              talk={talk}
              isMe={isMe}
            />
          )}
        </div>
        {talk.taskChip && (
          <TaskChip chip={talk.taskChip} onToggle={onToggleChip} />
        )}
        {!isKakao && <TalkInlineCards talk={talk} isMe={isMe} />}
        <span className="text-[10px] text-ink-muted">{time}</span>
      </div>
    </div>
  );
}

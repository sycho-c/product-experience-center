import { useEffect, useState, type KeyboardEvent } from 'react';
import {
  AtSign,
  Book,
  CheckSquare,
  FileText,
  Image as ImageIcon,
  Lock,
  Paperclip,
  Send,
  Smile,
  UserPlus2,
} from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { MockModal } from '@/components/MockModal';
import { MentionPicker } from './MentionPicker';
import { SecretModeChip } from './SecretModeChip';
import type { Talk } from '@/types/talk';
import { cn } from '@/lib/utils';

interface SlashCommand {
  id: string;
  trigger: string;
  label: string;
  description: string;
  icon: typeof Book;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: 'knowledge',
    trigger: '/지식검색',
    label: '지식 검색',
    description: '/ 다음에 검색어 입력',
    icon: Book,
  },
  {
    id: 'code',
    trigger: '?코드',
    label: '코드 검색',
    description: '? 다음에 코드 입력',
    icon: FileText,
  },
  {
    id: 'task',
    trigger: '/할일',
    label: '할 일 추가',
    description: '대화에서 바로 태스크 생성',
    icon: CheckSquare,
  },
  {
    id: 'bizform',
    trigger: '/비즈폼',
    label: '비즈폼 첨부',
    description: '계약/승인/요청 폼 추가',
    icon: FileText,
  },
  {
    id: 'invite',
    trigger: '/초대',
    label: '외부 사용자 초대',
    description: '이메일 또는 초대 링크',
    icon: UserPlus2,
  },
];

type ToolbarMockKind = 'emoji' | 'attach' | 'image' | 'task' | 'file';

const TOOLBAR_MOCK_TITLES: Record<ToolbarMockKind, string> = {
  emoji: '이모지 선택',
  attach: '파일 첨부',
  image: '이미지 첨부',
  task: '할 일 등록',
  file: '문서 공유',
};

const TOOLBAR_MOCK_DESCRIPTIONS: Record<ToolbarMockKind, string> = {
  emoji: '메시지에 이모지를 추가합니다.',
  attach: 'PDF, Excel 등 파일을 첨부합니다.',
  image: '이미지를 골라 미리보기와 함께 보냅니다.',
  task: '메시지에서 바로 할 일을 등록하고 담당자를 지정합니다.',
  file: '문서·자료실에 등록된 파일을 공유합니다.',
};

let _seq = 0;
function genTalkId(): string {
  _seq += 1;
  return `pc_user_talk_${Date.now()}_${_seq}`;
}

const EMPTY_PARTICIPANTS: never[] = [];

export function TalkInput() {
  const [value, setValue] = useState('');
  const [toolbarMock, setToolbarMock] = useState<ToolbarMockKind | null>(null);
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const appendTalk = useUISimStore((s) => s.appendTalk);
  const mention = useUISimStore((s) => s.mention);
  const setMention = useUISimStore((s) => s.setMention);
  const participants = useUISimStore((s) =>
    currentRoomId
      ? (s.participants[currentRoomId] ?? EMPTY_PARTICIPANTS)
      : EMPTY_PARTICIPANTS
  );

  // currentRoomId 가 바뀌면 mention 상태 초기화
  useEffect(() => {
    if (mention && mention.roomId !== currentRoomId) {
      setMention(null);
    }
  }, [currentRoomId, mention, setMention]);

  const trimmedRoomId = currentRoomId;
  const recipient = mention?.recipientParticipantId
    ? participants.find((p) => p.id === mention.recipientParticipantId)
    : null;

  // `@` 시작 + recipient 미선택 → MentionPicker
  const showMentionPicker =
    !!trimmedRoomId &&
    value.startsWith('@') &&
    !mention?.recipientParticipantId;

  // 슬래시 커맨드 메뉴 — `@` 는 mention picker 가 처리하므로 제외
  const showSlashMenu = value.startsWith('/') || value.startsWith('?');
  const filtered = showSlashMenu
    ? SLASH_COMMANDS.filter(
        (c) =>
          c.trigger.startsWith(value.slice(0, 1)) ||
          c.trigger.includes(value.replace(/^[\/\?]/, ''))
      )
    : [];

  const startMention = () => {
    if (!trimmedRoomId) return;
    setMention({ roomId: trimmedRoomId });
    if (!value.startsWith('@')) setValue('@');
  };

  const onPickRecipient = (
    participantId: string,
    _displayName: string
  ) => {
    if (!trimmedRoomId) return;
    setMention({ roomId: trimmedRoomId, recipientParticipantId: participantId });
    setValue(''); // chip 표시 + 입력창 비움
  };

  const clearSecret = () => {
    setMention(null);
  };

  const send = () => {
    if (!trimmedRoomId) return;
    const trimmed = value.trim();
    if (!trimmed) return;

    if (mention?.recipientParticipantId) {
      // 비밀 메시지 전송
      const talk: Talk = {
        id: genTalkId(),
        stepId: 'user',
        type: 'message',
        from: { role: 'me', userId: 'host-kim-doyoon', displayName: '나' },
        to: { broadcast: true },
        device: 'all',
        content: trimmed,
        offsetMs: 0,
        bubbleTone: 'navy',
        secret: { recipientParticipantId: mention.recipientParticipantId },
      };
      appendTalk(trimmedRoomId, talk);
      setValue('');
      setMention(null);
      return;
    }

    if (
      trimmed.startsWith('/') ||
      trimmed.startsWith('?') ||
      trimmed.startsWith('@')
    ) {
      // 슬래시/멘션 커맨드는 1차에서 단순 텍스트로 전송
    }

    const talk: Talk = {
      id: genTalkId(),
      stepId: 'user',
      type: 'message',
      from: { role: 'me', displayName: '나' },
      to: { broadcast: true },
      device: 'pc',
      content: trimmed,
      offsetMs: 0,
    };
    appendTalk(trimmedRoomId, talk);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu || showMentionPicker) return;
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="shrink-0 border-t border-surface-border bg-surface-card p-3">
      {recipient && (
        <SecretModeChip
          recipientName={recipient.displayName}
          onClear={clearSecret}
        />
      )}
      <div
        className={cn(
          'relative rounded-xl border focus-within:border-brand-primary/50',
          recipient
            ? 'border-brand-primary/50 bg-brand-primarySoft/15'
            : 'border-surface-border'
        )}
      >
        {!value && !recipient && (
          <div className="pointer-events-none absolute left-3 top-2 truncate text-xs text-ink-muted">
            <span className="font-medium">/</span> 검색어 ·{' '}
            <span className="font-medium">?</span> 코드 ·{' '}
            <span className="font-medium">@</span> 비밀 메시지
          </div>
        )}
        {!value && recipient && (
          <div className="pointer-events-none absolute left-3 top-2 truncate text-xs text-brand-primary/80">
            {recipient.displayName} 에게만 보일 비밀 메시지를 입력하세요.
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="block w-full resize-none bg-transparent px-3 pb-2 pt-2 text-sm focus:outline-none"
          rows={2}
        />
        <div className="flex items-center gap-1 border-t border-surface-border px-2 py-1.5 text-ink-muted">
          <ToolbarBtn
            label="이모지"
            icon={<Smile className="h-4 w-4" />}
            onClick={() => setToolbarMock('emoji')}
          />
          <ToolbarBtn
            label="파일 첨부"
            icon={<Paperclip className="h-4 w-4" />}
            onClick={() => setToolbarMock('attach')}
          />
          <ToolbarBtn
            label="이미지 첨부"
            icon={<ImageIcon className="h-4 w-4" />}
            onClick={() => setToolbarMock('image')}
          />
          <ToolbarBtn
            label={recipient ? '비밀 모드 해제' : '비밀 메시지'}
            icon={
              recipient ? (
                <Lock className="h-4 w-4 text-brand-primary" />
              ) : (
                <AtSign className="h-4 w-4" />
              )
            }
            onClick={recipient ? clearSecret : startMention}
            active={!!recipient}
          />
          <ToolbarBtn
            label="할 일"
            icon={<CheckSquare className="h-4 w-4" />}
            onClick={() => setToolbarMock('task')}
          />
          <ToolbarBtn
            label="문서"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => setToolbarMock('file')}
          />
          <span className="ml-auto mr-2 hidden text-[11px] text-ink-muted @[640px]/device:inline">
            Enter ↵ 전송
          </span>
          <button
            type="button"
            onClick={send}
            disabled={!value.trim() || !trimmedRoomId}
            className={cn(
              'inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40',
              recipient
                ? 'bg-ink-primary hover:bg-ink-primary/90'
                : 'bg-brand-primary hover:bg-brand-primaryHover'
            )}
          >
            {recipient ? <Lock className="h-3 w-3" /> : <Send className="h-3 w-3" />}
            {recipient ? '비밀 전송' : '전송'}
          </button>
        </div>

        {showSlashMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-elev animate-fade-in">
            <div className="border-b border-surface-border bg-surface-subtle px-3 py-1.5 text-[11px] text-ink-muted">
              슬래시 커맨드
            </div>
            <ul className="max-h-72 overflow-y-auto py-1 scrollbar-thin">
              {(filtered.length > 0 ? filtered : SLASH_COMMANDS).map((c, i) => {
                const Icon = c.icon;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setValue(c.trigger + ' ')}
                      className={cn(
                        'flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-surface-subtle',
                        i === 0 && 'bg-surface-subtle/40'
                      )}
                    >
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-brand-primarySoft text-brand-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-ink-primary">{c.label}</div>
                        <div className="truncate text-[11px] text-ink-muted">
                          {c.description}
                        </div>
                      </div>
                      <span className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-[11px] text-ink-secondary">
                        {c.trigger}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {showMentionPicker && trimmedRoomId && (
          <MentionPicker
            roomId={trimmedRoomId}
            query={value.slice(1)}
            onPick={onPickRecipient}
            onClose={() => {
              setValue('');
              setMention(null);
            }}
          />
        )}
      </div>

      <MockModal
        open={toolbarMock !== null}
        title={toolbarMock ? TOOLBAR_MOCK_TITLES[toolbarMock] : ''}
        description={
          toolbarMock ? TOOLBAR_MOCK_DESCRIPTIONS[toolbarMock] : undefined
        }
        onClose={() => setToolbarMock(null)}
        size="sm"
      />
    </div>
  );
}

function ToolbarBtn({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'grid h-7 w-7 place-items-center rounded transition-colors',
        active
          ? 'bg-brand-primarySoft text-brand-primary'
          : 'hover:bg-surface-subtle'
      )}
    >
      {icon}
    </button>
  );
}

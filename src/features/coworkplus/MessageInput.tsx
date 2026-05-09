import { useState, type KeyboardEvent } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import type { Talk, TalkActor } from '@/types/talk';

let _seq = 0;
function genTalkId(): string {
  _seq += 1;
  return `user_talk_${Date.now()}_${_seq}`;
}

interface MessageInputProps {
  roomId: string;
  device: 'pc' | 'mobile';
  /** 송신자 정보 — 기본은 device 별 다름. PC = me, Mobile = customer(외부 사용자) */
  sender?: TalkActor;
  placeholder?: string;
}

export function MessageInput({
  roomId,
  device,
  sender,
  placeholder,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const appendTalk = useUISimStore((s) => s.appendTalk);

  const defaultSender: TalkActor =
    device === 'pc'
      ? { role: 'me', displayName: '나' }
      : { role: 'customer', displayName: '홍길동' };
  const actor = sender ?? defaultSender;

  const send = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const talk: Talk = {
      id: genTalkId(),
      stepId: 'user',
      type: 'message',
      from: actor,
      to: { broadcast: true },
      device: device === 'pc' ? 'pc' : 'mobile',
      content: trimmed,
      offsetMs: 0,
    };
    appendTalk(roomId, talk);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  if (device === 'mobile') {
    return (
      <div className="flex shrink-0 items-end gap-1.5 border-t border-surface-border bg-surface-card px-2 py-1.5">
        <button
          type="button"
          className="grid h-7 w-7 shrink-0 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
        >
          <Paperclip className="h-3.5 w-3.5" />
        </button>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? '메시지 입력'}
          rows={1}
          className="flex-1 resize-none rounded-full border border-surface-border bg-surface-canvas px-3 py-1.5 text-xs placeholder:text-ink-muted focus:border-brand-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={send}
          aria-label="전송"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-primary text-white hover:bg-brand-primaryHover disabled:opacity-40"
          disabled={!value.trim()}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // PC: 슬래시 커맨드 hint + 전송 버튼
  return (
    <div className="border-t border-surface-border bg-surface-card p-3">
      <div className="rounded-xl border border-surface-border focus-within:border-brand-primary/50">
        {!value && (
          <div className="pointer-events-none absolute mt-2 px-3 text-xs text-ink-muted">
            지식검색: <span className="font-medium">/</span> + 검색어,{' '}
            <span className="font-medium">?</span> + 코드
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          className="block w-full resize-none bg-transparent px-3 pb-2 pt-2 text-sm focus:outline-none"
        />
        <div className="flex items-center gap-1 border-t border-surface-border px-2 py-1.5 text-ink-muted">
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded hover:bg-surface-subtle"
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded hover:bg-surface-subtle"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <span className="ml-auto mr-2 text-[11px] text-ink-muted">
            Enter ↵ 전송 · Shift+Enter 줄바꿈
          </span>
          <button
            type="button"
            onClick={send}
            disabled={!value.trim()}
            className="inline-flex h-7 items-center gap-1 rounded-md bg-brand-primary px-2.5 text-xs font-medium text-white hover:bg-brand-primaryHover disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileMessageInput({
  roomId,
  sender,
}: {
  roomId: string;
  sender?: TalkActor;
}) {
  return <MessageInput roomId={roomId} device="mobile" sender={sender} />;
}

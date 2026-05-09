import { Lock, X } from 'lucide-react';

interface SecretModeChipProps {
  recipientName: string;
  onClear: () => void;
}

/**
 * TalkInput 상단에 표시되는 비밀 메시지 모드 표시 chip.
 * "비밀 → 홍길동 [×]" 형태로 수신 대상 참여자를 명시한다.
 */
export function SecretModeChip({
  recipientName,
  onClear,
}: SecretModeChipProps) {
  return (
    <div className="mb-1.5 flex items-center gap-2 rounded-md border border-brand-primary/40 bg-brand-primarySoft/60 px-2.5 py-1 text-[11px]">
      <Lock className="h-3 w-3 text-brand-primary" />
      <span className="text-brand-primary font-semibold">비밀 메시지</span>
      <span className="text-ink-muted">→</span>
      <span className="font-medium text-ink-primary">{recipientName}</span>
      <button
        type="button"
        onClick={onClear}
        aria-label="비밀 메시지 모드 해제"
        className="ml-auto grid h-5 w-5 place-items-center rounded text-ink-muted hover:bg-white"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

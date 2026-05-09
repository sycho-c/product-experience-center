import { useEffect, useRef, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { useBizFormStore } from '@/features/domain/bizforms/store';
import { cn } from '@/lib/utils';

interface BizFormModalProps {
  /** 비즈폼이 첨부될 대상 방. mobileRoomId 사용. */
  roomId: string;
}

let _bfSeq = 0;
function genBizFormId(): string {
  _bfSeq += 1;
  return `mobile_bf_${Date.now()}_${_bfSeq}`;
}

/**
 * Mobile (Guest) 측에서 띄우는 Google Forms 스타일 비즈폼 작성 모달.
 * 디바이스 컨테이너 inset overlay — 절반 높이 모달.
 */
export function BizFormModal({ roomId }: BizFormModalProps) {
  const modal = useUISimStore((s) => s.bizformModal);
  const setBizForm = useUISimStore((s) => s.setBizFormModal);
  const setField = useUISimStore((s) => s.setBizFormModalField);
  const appendTalk = useUISimStore((s) => s.appendTalk);
  const attachBizForm = useBizFormStore((s) => s.attach);
  const [submitting, setSubmitting] = useState(false);

  // 시나리오의 mobile_fill_bizform_field 가 값을 채울 때 해당 필드가 보이도록 자동 스크롤.
  // scrollIntoView 는 ancestor 페이지 스크롤까지 영향을 주므로 모달 내부 컨테이너만 직접 조정.
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fieldRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const lastValuesRef = useRef<Record<string, string>>({});
  useEffect(() => {
    if (!modal) {
      lastValuesRef.current = {};
      return;
    }
    const initialized = Object.keys(lastValuesRef.current).length > 0;
    for (const f of modal.fields) {
      const cur = f.value ?? '';
      const prev = lastValuesRef.current[f.id];
      if (initialized && prev !== undefined && prev !== cur) {
        const container = scrollContainerRef.current;
        const target = fieldRefs.current[f.id];
        if (container && target) {
          const top = target.offsetTop - container.offsetTop;
          // 컨테이너 상하 여백 고려해 약간 위로
          container.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
        }
        break;
      }
    }
    const snapshot: Record<string, string> = {};
    for (const f of modal.fields) snapshot[f.id] = f.value ?? '';
    lastValuesRef.current = snapshot;
  }, [modal]);

  if (!modal) return null;

  const onClose = () => {
    setBizForm(null);
    setSubmitting(false);
  };

  const onSubmit = () => {
    if (submitting) return;
    setSubmitting(true);
    const bizformId = genBizFormId();
    const messageId = `bf_msg_${bizformId}`;

    attachBizForm({
      id: bizformId,
      roomId,
      templateId: modal.templateId,
      title: modal.title,
      status: '진행중',
      fields: modal.fields.map((f) => ({ ...f })),
      messageId,
    });
    appendTalk(roomId, {
      id: messageId,
      stepId: 'user',
      type: 'bizform',
      from: { role: 'customer', displayName: '나' },
      to: { broadcast: true },
      device: 'all',
      content: modal.title,
      offsetMs: 0,
      bizformRef: { bizformId },
    });

    setBizForm(null);
    setSubmitting(false);
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[88%] w-full flex-col overflow-hidden rounded-t-2xl border border-surface-border bg-surface-card shadow-elev animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-surface-border bg-brand-primarySoft/30 px-3 py-2">
          <div className="min-w-0">
            <h2 className="truncate text-xs font-semibold text-brand-primary">
              {modal.title}
            </h2>
            <p className="truncate text-[10px] text-ink-muted">
              필수 항목을 입력 후 제출하세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>
        <div
          ref={scrollContainerRef}
          className="min-h-0 flex-1 overflow-y-auto px-3 py-3 scrollbar-thin"
        >
          <ul className="space-y-3">
            {modal.fields.map((f) => (
              <li
                key={f.id}
                ref={(el) => {
                  fieldRefs.current[f.id] = el;
                }}
                className="scroll-mt-2"
              >
                <label className="mb-1 block text-[11px] font-medium text-ink-secondary">
                  {f.label}
                </label>
                {f.file ? (
                  <FilePicker
                    value={f.value ?? ''}
                    onChange={(v) => setField(f.id, v)}
                  />
                ) : (
                  <textarea
                    value={f.value ?? ''}
                    onChange={(e) => setField(f.id, e.target.value)}
                    rows={f.id === 'request' ? 3 : 1}
                    className="block w-full resize-none rounded-md border border-surface-border bg-surface-canvas px-2.5 py-1.5 text-xs focus:border-brand-primary focus:outline-none"
                    placeholder={`${f.label} 입력`}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-surface-border bg-surface-canvas px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 items-center rounded-md border border-surface-border bg-white px-2.5 text-xs text-ink-primary hover:bg-surface-subtle"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className={cn(
              'inline-flex h-7 items-center rounded-md bg-brand-primary px-2.5 text-xs font-medium text-white hover:bg-brand-primaryHover',
              submitting && 'opacity-50'
            )}
          >
            제출
          </button>
        </footer>
      </div>
    </div>
  );
}

function FilePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const sample = ['사업자등록증.pdf', '견적서.xlsx', '계약서_초안.pdf'];
  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-surface-border bg-surface-canvas px-2.5 py-1.5 text-[11px]">
        <Paperclip className="h-3 w-3 text-brand-primary" />
        <span className="flex-1 truncate text-ink-primary">{value}</span>
        <button
          type="button"
          onClick={() => onChange('')}
          className="rounded text-ink-muted hover:bg-surface-subtle"
          aria-label="파일 제거"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-1.5">
      {sample.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-surface-border bg-white px-2 py-1 text-[10px] text-ink-secondary hover:border-brand-primary hover:text-brand-primary"
        >
          <Paperclip className="h-2.5 w-2.5" />
          {name}
        </button>
      ))}
    </div>
  );
}

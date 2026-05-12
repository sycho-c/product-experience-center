import { useEffect, useRef } from 'react';
import { Loader2, Maximize2, X, ImageIcon } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { progressOrDo } from '@/lib/use-scenario-match';
import { cn } from '@/lib/utils';
import { usePendingButton } from '@/lib/use-pending-button';

const MODAL_ID = 'task-registration';

const TITLE_CHIPS = [
  '운전자',
  '간편',
  '치매',
  'Grade',
  '3N5',
  '5N5',
  '암',
  '고객등록',
];

interface TaskRegistrationContext {
  roomId?: string;
  sourceMessageId?: string;
  /** 다중 선택 모드에서 만든 경우 — 여러 메시지를 출처로 갖는다. */
  sourceMessageIds?: string[];
  mode?: 'create' | 'edit';
  designer?: string;
}

export function TaskRegistrationModal() {
  const modal = useUISimStore((s) => s.modals[MODAL_ID]);
  const inputs = useUISimStore((s) => s.inputs);
  const ocrStatus = useUISimStore(
    (s) => s.ocrStatusByModal[MODAL_ID] ?? 'idle'
  );
  const setModal = useUISimStore((s) => s.setModal);
  const setInput = useUISimStore((s) => s.setInput);
  const roomTalks = useUISimStore((s) => s.roomTalks);

  // OCR 진행/완료 시 고객 상세 영역으로 자동 스크롤 — 좌측 폼이 영역 밖으로 잘릴 때 보이게.
  // scrollIntoView 는 모든 ancestor 까지 스크롤시켜 페이지가 위로 밀리는 부작용이 있으므로,
  // 모달 내부 scroll container 의 scrollTop 만 직접 조정한다.
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const customerSectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!modal?.open) return;
    if (ocrStatus !== 'extracting' && ocrStatus !== 'completed') return;
    const container = scrollContainerRef.current;
    const target = customerSectionRef.current;
    if (!container || !target) return;
    container.scrollTo({
      top: target.offsetTop - container.offsetTop,
      behavior: 'smooth',
    });
  }, [ocrStatus, modal?.open]);

  if (!modal?.open) return null;

  const ctx = (modal.data ?? {}) as TaskRegistrationContext;
  const mode = ctx.mode ?? 'create';
  const designer = ctx.designer ?? '영업가족-김철수';

  // 단일/다중 선택 모두 지원 — 첫 번째로 나오는 이미지 첨부를 우측 미리보기로,
  // 텍스트 메시지는 하단의 "출처 메시지" 리스트에 표시.
  const sourceMessageIds: string[] = ctx.sourceMessageIds?.length
    ? ctx.sourceMessageIds
    : ctx.sourceMessageId
      ? [ctx.sourceMessageId]
      : [];
  const sourceTalks = ctx.roomId
    ? sourceMessageIds
        .map((id) => (roomTalks[ctx.roomId!] ?? []).find((t) => t.id === id))
        .filter((t): t is NonNullable<typeof t> => !!t)
    : [];
  const firstImageTalk = sourceTalks.find((t) =>
    t.attachments?.some((a) => a.mime?.startsWith('image/'))
  );
  const attachmentUrl = firstImageTalk?.attachments?.find((a) =>
    a.mime?.startsWith('image/')
  )?.url;
  const attachmentName = firstImageTalk?.attachments?.find((a) =>
    a.mime?.startsWith('image/')
  )?.name;
  const textTalks = sourceTalks.filter(
    (t) => !t.attachments || t.attachments.length === 0
  );

  const v = (k: string) => inputs[`task-registration.${k}`] ?? '';
  const setV = (k: string) => (val: string) =>
    setInput(`task-registration.${k}`, val);
  const close = () => setModal(MODAL_ID, { open: false });
  const onSave = () => progressOrDo(() => close());
  const onComplete = () => progressOrDo(() => close());

  const extracting = ocrStatus === 'extracting';
  const completed = ocrStatus === 'completed';

  const pendingSave = usePendingButton('task-registration.save');
  const pendingRegisterCustomer = usePendingButton(
    'task-registration.register-customer'
  );
  const pendingConsentRequest = usePendingButton(
    'task-registration.consent-request'
  );
  const pendingLongDesign = usePendingButton('task-registration.long-design');

  return (
    <div className="absolute inset-0 z-40 flex animate-backdrop-fade bg-black/30 p-6 backdrop-blur-sm">
      <div className="m-auto flex h-full max-h-[min(640px,100%)] min-h-0 w-full max-w-[min(960px,100%)] animate-modal-pop overflow-hidden rounded-xl bg-surface-card shadow-elev">
        {/* Left: form (60%) */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col" style={{ flexBasis: '60%' }}>
          <header className="flex shrink-0 items-center justify-between border-b border-surface-border px-5 py-3">
            <div>
              <h2 className="text-sm font-semibold text-ink-primary">
                {mode === 'edit' ? '할 일 수정' : '할 일 등록'}
              </h2>
              {ctx.designer && (
                <p className="text-[10px] text-ink-muted">
                  등록자: 김도윤 · 설계사: {designer}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="확장"
                className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="닫기"
                className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto px-5 py-4 scrollbar-thin"
          >
            {sourceTalks.length > 1 && (
              <section className="mb-3 rounded-lg border border-brand-primary/30 bg-brand-primarySoft/30 p-3">
                <h3 className="mb-1.5 text-xs font-semibold text-ink-primary">
                  출처 메시지 ({sourceTalks.length})
                </h3>
                <ul className="space-y-1">
                  {sourceTalks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-start gap-2 text-[11px]"
                    >
                      <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-brand-primary border border-brand-primary/30">
                        {t.attachments?.length ? '이미지' : '텍스트'}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-ink-secondary">
                        {t.content}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 기본 정보 */}
            <section className="rounded-lg border border-surface-border bg-surface-canvas/50 p-3">
              <h3 className="mb-2 text-xs font-semibold text-ink-primary">
                기본 정보
              </h3>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-medium text-ink-secondary">
                  제목 *
                </span>
                <div className="flex flex-wrap gap-1">
                  {TITLE_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className={cn(
                        'rounded-md border px-2 py-0.5 text-[10px]',
                        chip === '고객등록'
                          ? 'border-amber-300 bg-amber-50 text-amber-700'
                          : 'border-surface-border bg-white text-ink-secondary hover:border-brand-primary hover:text-brand-primary'
                      )}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_180px] gap-2">
                <input
                  type="text"
                  value={v('title')}
                  onChange={(e) => setV('title')(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="rounded-md border border-surface-border bg-white px-2.5 py-1.5 text-xs focus:border-brand-primary focus:outline-none"
                />
                <div className="flex items-center justify-between rounded-md border border-surface-border bg-white px-2.5 py-1.5 text-xs">
                  <span className="rounded bg-brand-primarySoft px-1.5 py-0.5 text-[11px] text-brand-primary">
                    {designer}
                  </span>
                </div>
              </div>
            </section>

            {/* 요청 조건 (텍스트 NER) — 텍스트 메시지가 출처에 포함된 경우만 노출 */}
            {textTalks.length > 0 && (
              <section className="mt-3 rounded-lg border border-surface-border bg-surface-canvas/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-ink-primary">
                    요청 조건
                  </h3>
                  {extracting && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      텍스트 NER 분석 중...
                    </span>
                  )}
                  {completed && (v('productCategory') || v('monthlyPremium')) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                      NER 추출 완료
                    </span>
                  )}
                </div>
                <p className="mb-2 text-[10px] text-ink-muted">
                  ※ 텍스트 메시지에서 보험 종류·월 납입 등 요청 조건을 자동 추출합니다.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="보험 종류"
                    value={v('productCategory')}
                    onChange={setV('productCategory')}
                    loading={extracting}
                  />
                  <Field
                    label="월 납입 (목표)"
                    value={v('monthlyPremium')}
                    onChange={setV('monthlyPremium')}
                    loading={extracting}
                  />
                </div>
              </section>
            )}

            {/* 고객 상세 내역 */}
            <section
              ref={customerSectionRef}
              className="mt-3 scroll-mt-2 rounded-lg border border-surface-border bg-surface-canvas/50 p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-xs font-semibold text-ink-primary">
                  고객 상세 내역
                </h3>
                {extracting && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    OCR 추출 중...
                  </span>
                )}
                {completed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    OCR 추출 완료
                  </span>
                )}
                {completed && (
                  <button
                    type="button"
                    className="ml-auto inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
                  >
                    고객정보 추출 내역
                    <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-500 text-[9px] text-white">
                      1
                    </span>
                  </button>
                )}
              </div>
              <p className="mb-2 text-[10px] text-ink-muted">
                ※ 고객정보를 자동 추출한 경우에는 입력된 정보를 반드시 확인하시기 바랍니다.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Field
                  label="고객명"
                  value={v('customerName')}
                  onChange={setV('customerName')}
                  loading={extracting}
                />
                <Field
                  label="주민등록번호"
                  value={v('ssn')}
                  onChange={setV('ssn')}
                  loading={extracting}
                />
                <Field
                  label="휴대폰번호"
                  value={v('phone')}
                  onChange={setV('phone')}
                  loading={extracting}
                  warn={!v('phone') && completed}
                />
                <Field
                  label="기등록고객"
                  value={v('registered') || (completed ? '확인' : '')}
                  readOnly
                />
              </div>
              <div className="mt-2">
                <label className="mb-1 block text-[10px] font-medium text-ink-muted">
                  주소
                </label>
                <input
                  type="text"
                  value={v('address')}
                  onChange={(e) => setV('address')(e.target.value)}
                  className={cn(
                    'block w-full rounded-md border border-surface-border bg-white px-2.5 py-1.5 text-xs focus:border-brand-primary focus:outline-none',
                    extracting && 'animate-pulse bg-surface-subtle text-ink-muted'
                  )}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Field
                  label="직업"
                  value={v('job')}
                  onChange={setV('job')}
                  loading={extracting}
                />
                <Field
                  label="가입설계동의 종료일자"
                  value={
                    v('consentExpiry') ||
                    (v('consentStatus') === 'completed' ? '2027-03-22' : '')
                  }
                  readOnly
                />
              </div>

              {mode === 'edit' && (
                <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-surface-border pt-3">
                  <ConsentChip status={v('consentStatus')} />
                  {v('consentStatus') !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => progressOrDo(() => close())}
                      data-button-id="task-registration.consent-request"
                      className={cn(
                        'rounded-md border border-brand-primary/40 bg-white px-3 py-1.5 text-[11px] font-medium text-brand-primary hover:bg-brand-primarySoft',
                        pendingConsentRequest
                      )}
                    >
                      동의서 요청
                    </button>
                  )}
                  <button
                    type="button"
                    data-button-id="task-registration.register-customer"
                    className={cn(
                      'rounded-md bg-rose-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-rose-600',
                      pendingRegisterCustomer
                    )}
                  >
                    고객 등록
                  </button>
                  <button
                    type="button"
                    data-button-id="task-registration.long-design"
                    disabled={v('consentStatus') !== 'completed'}
                    className={cn(
                      'rounded-md bg-brand-primary px-3 py-1.5 text-[11px] font-medium text-white hover:bg-brand-primaryHover disabled:cursor-not-allowed disabled:bg-ink-muted',
                      pendingLongDesign
                    )}
                    title={
                      v('consentStatus') !== 'completed'
                        ? '가입설계동의서 등록 후 활성화됩니다.'
                        : undefined
                    }
                  >
                    장기 가입 설계
                  </button>
                </div>
              )}
            </section>
          </div>

          <footer className="flex shrink-0 items-center gap-2 border-t border-surface-border px-5 py-3">
            {mode === 'edit' && (
              <button
                type="button"
                onClick={onComplete}
                className="rounded-md border border-surface-border bg-white px-4 py-1.5 text-xs text-ink-primary hover:bg-surface-subtle"
              >
                할 일 완료
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-md border border-surface-border bg-white px-4 py-1.5 text-xs text-ink-primary hover:bg-surface-subtle"
              >
                취소
              </button>
              <button
                type="button"
                data-button-id="task-registration.save"
                onClick={onSave}
                className={cn(
                  'rounded-md bg-brand-primary px-6 py-1.5 text-xs font-medium text-white hover:bg-brand-primaryHover',
                  pendingSave
                )}
              >
                저장
              </button>
            </div>
          </footer>
        </div>

        {/* Right: image preview (40%) */}
        <aside
          className="flex min-h-0 min-w-0 flex-col border-l border-surface-border bg-surface-canvas"
          style={{ flexBasis: '40%' }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-3 py-2 text-[11px] text-ink-muted">
            <span>1 / 1</span>
            <span className="text-[10px]">첨부 이미지 미리보기</span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            {attachmentUrl ? (
              <img
                src={attachmentUrl}
                alt={attachmentName ?? '첨부 이미지'}
                className="max-h-full max-w-full rounded-md border border-surface-border object-contain shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-ink-muted">
                <ImageIcon className="h-10 w-10" />
                <span className="text-[11px]">첨부 이미지 없음</span>
                {attachmentName && (
                  <span className="text-[10px] text-ink-secondary">
                    {attachmentName}
                  </span>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ConsentChip({ status }: { status: string }) {
  if (status === 'completed') {
    return (
      <span className="mr-auto rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700">
        동의서 등록완료
      </span>
    );
  }
  if (status === 'requested') {
    return (
      <span className="mr-auto inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] text-amber-700">
        <Loader2 className="h-3 w-3 animate-spin" />
        동의서 요청 중 (설계사 작성 대기)
      </span>
    );
  }
  return (
    <span className="mr-auto rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] text-rose-700">
      ⚠ 동의서 미수령
    </span>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  loading?: boolean;
  readOnly?: boolean;
  warn?: boolean;
}

function Field({ label, value, onChange, loading, readOnly, warn }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-medium text-ink-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly={readOnly || !onChange}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'block w-full rounded-md border bg-white px-2.5 py-1.5 text-xs focus:outline-none',
          loading && 'animate-pulse bg-surface-subtle text-ink-muted',
          warn ? 'border-rose-400' : 'border-surface-border focus:border-brand-primary',
          readOnly && 'bg-surface-subtle text-ink-secondary'
        )}
      />
      {warn && (
        <p className="mt-0.5 text-[10px] text-rose-500">
          ⚠ 휴대폰번호를 입력해 주세요.
        </p>
      )}
    </div>
  );
}

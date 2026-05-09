import { ChevronDown, Search, X } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { progressOrDo } from '@/lib/use-scenario-match';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MODAL_ID = 'create-room';

const INTERNAL_USERS = [
  { id: 'jhkim', name: '김지현', login: 'jhkim' },
  { id: 'mspark', name: '박민수', login: 'mspark' },
  { id: 'sjlee', name: '이수진', login: 'sjlee' },
  { id: 'dhjeong', name: '정도현', login: 'dhjeong' },
  { id: 'syhan', name: '한세영', login: 'syhan' },
  { id: 'wjchoi', name: '최우진', login: 'wjchoi' },
  { id: 'syyoon', name: '윤서연', login: 'syyoon' },
  { id: 'dykang', name: '강도윤', login: 'dykang' },
];

const EXTERNAL_USERS = [
  { id: 'hong-01012341234', name: '홍길동', phone: '01012341234' },
  { id: 'kim-01023456789', name: '김서연', phone: '01023456789' },
  { id: 'lee-01034567890', name: '이재훈', phone: '01034567890' },
  { id: 'park-01045678901', name: '박지민', phone: '01045678901' },
  { id: 'jung-01056789012', name: '정수아', phone: '01056789012' },
  { id: 'choi-01067890123', name: '최도윤', phone: '01067890123' },
  { id: 'han-01078901234', name: '한가람', phone: '01078901234' },
  { id: 'yoon-01089012345', name: '윤하늘', phone: '01089012345' },
  { id: 'lim-01090123456', name: '임지호', phone: '01090123456' },
];

export function CreateRoomModal() {
  const modal = useUISimStore((s) => s.modals[MODAL_ID]);
  const inputs = useUISimStore((s) => s.inputs);
  const checks = useUISimStore((s) => s.checks);
  const setModal = useUISimStore((s) => s.setModal);
  const setInput = useUISimStore((s) => s.setInput);
  const setCheck = useUISimStore((s) => s.setCheck);

  if (!modal?.open) return null;

  const step = modal.step ?? 1;
  const tab = (modal.tab ?? 'internal') as 'internal' | 'external';
  const externalSearch = inputs['create-room.external.search'] ?? '';
  const roomTitle = inputs['create-room.title'] ?? '';
  const kakaoOn = !!checks['create-room.kakao'];

  const close = () => setModal(MODAL_ID, { open: false });
  const onTabClick = (next: 'internal' | 'external') =>
    setModal(MODAL_ID, { tab: next });
  const onSearchChange = (v: string) =>
    setInput('create-room.external.search', v);
  const onTitleChange = (v: string) => setInput('create-room.title', v);
  const onToggleKakao = () => setCheck('create-room.kakao', !kakaoOn);
  const onCheckUser = (kind: 'internal' | 'external', id: string) => {
    const key = `create-room.${kind}.${id}`;
    setCheck(key, !checks[key]);
  };
  const onNext = () =>
    progressOrDo(() => setModal(MODAL_ID, { step: 2 }));
  const onPrev = () =>
    progressOrDo(() => setModal(MODAL_ID, { step: 1 }));
  const onCreate = () =>
    progressOrDo(() => {
      // 시나리오가 없는 자유 모드일 때 — 모달만 닫고 토스트 하나
      setModal(MODAL_ID, { open: false });
    });

  return (
    <div className="absolute inset-0 z-40 flex bg-black/30 p-3 backdrop-blur-sm">
      <div className="m-auto flex h-full max-h-[min(640px,100%)] w-full max-w-[min(880px,100%)] flex-col overflow-hidden rounded-xl bg-surface-card shadow-elev">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-primary">
            대화방 생성
          </h2>
          <button
            onClick={close}
            className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
            aria-label="닫기"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* Stepper */}
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-2 text-[11px]">
          <StepBadge active={step === 1} done={step > 1} index={1} label="참여자 선택" />
          <div className="mx-3 h-px flex-1 bg-surface-border" />
          <StepBadge active={step === 2} done={false} index={2} label="대화 채널 선택" />
        </div>

        {step === 1 ? (
          <Step1
            tab={tab}
            externalSearch={externalSearch}
            checks={checks}
            onTabClick={onTabClick}
            onSearchChange={onSearchChange}
            onCheckUser={onCheckUser}
            onNext={onNext}
          />
        ) : (
          <Step2
            roomTitle={roomTitle}
            kakaoOn={kakaoOn}
            onTitleChange={onTitleChange}
            onToggleKakao={onToggleKakao}
            onPrev={onPrev}
            onCreate={onCreate}
          />
        )}
      </div>
    </div>
  );
}

function StepBadge({
  index,
  label,
  active,
  done,
}: {
  index: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold',
          active || done
            ? 'bg-brand-primary text-white'
            : 'bg-surface-subtle text-ink-muted'
        )}
      >
        {done ? '✓' : index}
      </span>
      <span
        className={cn(
          'text-xs',
          active ? 'text-brand-primary font-semibold' : 'text-ink-secondary'
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface Step1Props {
  tab: 'internal' | 'external';
  externalSearch: string;
  checks: Record<string, boolean>;
  onTabClick: (next: 'internal' | 'external') => void;
  onSearchChange: (v: string) => void;
  onCheckUser: (kind: 'internal' | 'external', id: string) => void;
  onNext: () => void;
}

function Step1({
  tab,
  externalSearch,
  checks,
  onTabClick,
  onSearchChange,
  onCheckUser,
  onNext,
}: Step1Props) {
  const filteredExternal = externalSearch
    ? EXTERNAL_USERS.filter((u) => u.name.includes(externalSearch))
    : EXTERNAL_USERS;
  const selectedExternal = EXTERNAL_USERS.filter(
    (u) => checks[`create-room.external.${u.id}`]
  );
  const selectedInternal = INTERNAL_USERS.filter(
    (u) => checks[`create-room.internal.${u.id}`]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Tabs */}
      <div className="shrink-0 border-b border-surface-border px-4">
        <div className="flex gap-4">
          <TabHeader
            label="내부 사용자"
            active={tab === 'internal'}
            onClick={() => onTabClick('internal')}
          />
          <TabHeader
            label="외부 사용자"
            active={tab === 'external'}
            onClick={() => onTabClick('external')}
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1fr_240px]">
        <div className="flex min-h-0 flex-col px-4 py-3">
          {/* Search */}
          <div className="relative shrink-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              value={tab === 'external' ? externalSearch : ''}
              onChange={(e) =>
                tab === 'external' && onSearchChange(e.target.value)
              }
              placeholder={tab === 'external' ? '이름 또는 전화번호로 검색' : ''}
              className="h-8 w-full rounded-md border border-brand-primary/40 bg-surface-card pl-8 pr-3 text-xs focus:outline-none"
            />
          </div>

          {/* Tree + List */}
          <div className="mt-2 grid min-h-0 flex-1 grid-cols-[180px_1fr] gap-3 overflow-hidden">
            <ul className="space-y-1 text-xs text-ink-secondary">
              {tab === 'internal' ? (
                <>
                  <TreeNode label="협업기획팀" hasChildren />
                  <TreeNode label="프로덕트디자인팀" hasChildren />
                  <TreeNode label="개발팀" />
                </>
              ) : (
                <>
                  <TreeNode label="협업 파트너" hasChildren />
                  <TreeNode label="고객사" hasChildren />
                  <TreeNode label="외주 파트너" />
                  <TreeNode label="신규 연락처" hasChildren />
                </>
              )}
            </ul>
            <ul className="space-y-0.5 overflow-y-auto pr-1 text-xs scrollbar-thin">
              {tab === 'internal'
                ? INTERNAL_USERS.map((u) => (
                    <UserRow
                      key={u.id}
                      checked={!!checks[`create-room.internal.${u.id}`]}
                      label={`${u.name} (${u.login})`}
                      onToggle={() => onCheckUser('internal', u.id)}
                    />
                  ))
                : filteredExternal.length === 0 ? (
                    <li className="px-2 py-1.5 text-xs text-ink-muted">
                      검색 결과가 없습니다.
                    </li>
                  ) : (
                    filteredExternal.map((u) => (
                      <UserRow
                        key={u.id}
                        checked={!!checks[`create-room.external.${u.id}`]}
                        label={`${u.name} (${u.phone})`}
                        emphasized={!!checks[`create-room.external.${u.id}`]}
                        onToggle={() => onCheckUser('external', u.id)}
                      />
                    ))
                  )}
            </ul>
          </div>
        </div>

        {/* Selected panel */}
        <aside className="flex flex-col border-l border-surface-border bg-surface-subtle/50 px-4 py-4 text-sm">
          <div className="text-xs font-semibold text-ink-secondary">내부 사용자</div>
          {selectedInternal.length === 0 ? (
            <p className="mt-1 text-xs text-ink-muted">내부 사용자가 없습니다.</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {selectedInternal.map((u) => (
                <li key={u.id} className="text-xs">
                  {u.name}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 text-xs font-semibold text-ink-secondary">
            외부 사용자
          </div>
          {selectedExternal.length === 0 ? (
            <p className="mt-1 text-xs text-ink-muted">외부 사용자가 없습니다.</p>
          ) : (
            <ul className="mt-1 space-y-1">
              {selectedExternal.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between text-sm text-ink-primary"
                >
                  <span>{u.name}</span>
                  <X className="h-3 w-3 text-ink-muted" />
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* Footer */}
      <div className="border-t border-surface-border bg-surface-card px-4 py-3">
        <Button className="w-full" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}

interface Step2Props {
  roomTitle: string;
  kakaoOn: boolean;
  onTitleChange: (v: string) => void;
  onToggleKakao: () => void;
  onPrev: () => void;
  onCreate: () => void;
}

function Step2({
  roomTitle,
  kakaoOn,
  onTitleChange,
  onToggleKakao,
  onPrev,
  onCreate,
}: Step2Props) {
  const checks = useUISimStore((s) => s.checks);
  const selectedInternal = INTERNAL_USERS.filter(
    (u) => checks[`create-room.internal.${u.id}`]
  );
  const selectedExternal = EXTERNAL_USERS.filter(
    (u) => checks[`create-room.external.${u.id}`]
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_240px]">
        <div className="space-y-3 px-4 py-3">
          {/* Existing rooms hint */}
          <div className="flex items-center justify-between rounded-md border border-surface-border bg-surface-subtle/60 px-3 py-2 text-xs text-ink-secondary">
            <span>
              <span className="text-brand-primary">💬</span> 이미 함께 참여 중인
              대화방이 <strong className="text-brand-primary">2</strong> 개
              있습니다.
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-secondary">
              대화 채널 선택 <span className="text-rose-500">*</span>
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-2">
              <SelectPill icon="협업" label="협업센터" />
              <SelectPill icon="PC" label="PC-협업용" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-secondary">
              대화방 제목
            </label>
            <div className="mt-1.5 relative">
              <input
                value={roomTitle}
                onChange={(e) => onTitleChange(e.target.value.slice(0, 50))}
                placeholder="대화방 제목을 입력하세요"
                className="h-10 w-full rounded-lg border border-brand-primary/40 bg-surface-card pl-3 pr-12 text-sm focus:border-brand-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-muted">
                {roomTitle.length}/50
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-secondary">
              외부 사용자 카카오 알림톡 초대장 발송하기
            </span>
            <button
              type="button"
              onClick={onToggleKakao}
              aria-pressed={kakaoOn}
              className={cn(
                'inline-block h-5 w-9 rounded-full transition-colors',
                kakaoOn ? 'bg-brand-primary' : 'bg-ink-subtle'
              )}
            >
              <span
                className={cn(
                  'block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow transition-transform',
                  kakaoOn ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </button>
          </div>
        </div>

        <aside className="flex flex-col border-l border-surface-border bg-surface-subtle/50 px-3 py-3 text-xs">
          <div className="font-semibold text-ink-secondary">내부 사용자</div>
          {selectedInternal.length === 0 ? (
            <p className="mt-1 text-ink-muted">내부 사용자가 없습니다.</p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              {selectedInternal.map((u) => (
                <li key={u.id} className="text-ink-primary">
                  {u.name}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 font-semibold text-ink-secondary">외부 사용자</div>
          {selectedExternal.length === 0 ? (
            <p className="mt-1 text-ink-muted">외부 사용자가 없습니다.</p>
          ) : (
            <ul className="mt-1 space-y-0.5">
              {selectedExternal.map((u) => (
                <li key={u.id} className="text-ink-primary">
                  {u.name}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <div className="flex items-center gap-3 border-t border-surface-border bg-surface-card px-4 py-3">
        <Button variant="outline" className="basis-1/3" onClick={onPrev}>
          이전
        </Button>
        <Button className="basis-2/3" onClick={onCreate}>
          대화방 생성
        </Button>
      </div>
    </div>
  );
}

function SelectPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-brand-primary/40 bg-surface-card px-3 py-2 text-sm">
      <span className="flex items-center gap-2">
        <span className="rounded bg-brand-primarySoft px-1.5 py-0.5 text-[10px] font-semibold text-brand-primary">
          {icon}
        </span>
        <span className="text-ink-primary">{label}</span>
      </span>
      <ChevronDown className="h-4 w-4 text-ink-muted" />
    </div>
  );
}

function TabHeader({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 py-2.5 text-xs transition-colors',
        active
          ? 'border-brand-primary font-semibold text-brand-primary'
          : 'border-transparent text-ink-secondary hover:text-ink-primary'
      )}
    >
      {label}
    </button>
  );
}

function TreeNode({
  label,
  hasChildren = false,
}: {
  label: string;
  hasChildren?: boolean;
}) {
  return (
    <li className="flex items-center gap-1.5 px-1 py-1">
      <span className="text-ink-muted">{hasChildren ? '›' : ' '}</span>
      <input type="checkbox" readOnly className="h-3.5 w-3.5" />
      <span>{label}</span>
    </li>
  );
}

function UserRow({
  checked,
  label,
  emphasized = false,
  onToggle,
}: {
  checked: boolean;
  label: string;
  emphasized?: boolean;
  onToggle?: () => void;
}) {
  return (
    <li className={cn('rounded', emphasized && 'bg-brand-primarySoft')}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left hover:bg-surface-subtle"
      >
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="h-3.5 w-3.5 pointer-events-none"
        />
        <span className="text-xs">{label}</span>
      </button>
    </li>
  );
}

import { ChevronDown, Search, X } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import {
  useExternalUsersStore,
  type ExternalUser,
} from '@/features/domain/external-users/store';
import { progressOrDo } from '@/lib/use-scenario-match';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePendingButton } from '@/lib/use-pending-button';
import { INTERNAL_USERS } from './users-data';

const MODAL_ID = 'create-room';
const HOST_ID = 'host-kim-doyoon';
const HOST_NAME = '김도윤';

function nowStamp(): string {
  const d = new Date();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function nowClock(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? '오후' : '오전';
  const hour12 = ((h + 11) % 12) + 1;
  return `${period} ${hour12.toString().padStart(2, '0')}:${m}`;
}

export function CreateRoomModal() {
  const modal = useUISimStore((s) => s.modals[MODAL_ID]);
  const inputs = useUISimStore((s) => s.inputs);
  const checks = useUISimStore((s) => s.checks);
  const setModal = useUISimStore((s) => s.setModal);
  const setInput = useUISimStore((s) => s.setInput);
  const setCheck = useUISimStore((s) => s.setCheck);
  const addRoom = useUISimStore((s) => s.addRoom);
  const addParticipant = useUISimStore((s) => s.addParticipant);
  const selectRoom = useUISimStore((s) => s.selectRoom);
  const pushMobileChat = useUISimStore((s) => s.pushMobileChat);
  const pushMobileNotice = useUISimStore((s) => s.pushMobileNotice);
  const setMobileViewer = useUISimStore((s) => s.setMobileViewer);
  const externalUsers = useExternalUsersStore((s) => s.users);

  if (!modal?.open) return null;

  const step = modal.step ?? 1;
  const tab = (modal.tab ?? 'internal') as 'internal' | 'external';
  const internalSearch = inputs['create-room.internal.search'] ?? '';
  const externalSearch = inputs['create-room.external.search'] ?? '';
  const roomTitle = inputs['create-room.title'] ?? '';
  const kakaoOn = !!checks['create-room.kakao'];

  const close = () => setModal(MODAL_ID, { open: false });
  const onTabClick = (next: 'internal' | 'external') =>
    setModal(MODAL_ID, { tab: next });
  const onSearchChange = (v: string) =>
    setInput(`create-room.${tab}.search`, v);
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

  const cleanupCreateRoomState = () => {
    Object.keys(checks)
      .filter((k) => k.startsWith('create-room.'))
      .forEach((k) => setCheck(k, false));
    setInput('create-room.title', '');
    setInput('create-room.internal.search', '');
    setInput('create-room.external.search', '');
    setModal(MODAL_ID, { open: false, step: 1, tab: 'internal' });
  };

  const onCreate = () =>
    progressOrDo(() => {
      const internalSel = INTERNAL_USERS.filter(
        (u) => checks[`create-room.internal.${u.id}`]
      );
      const externalSel: ExternalUser[] = externalUsers.filter(
        (u) => checks[`create-room.external.${u.id}`]
      );

      if (internalSel.length === 0 && externalSel.length === 0) {
        cleanupCreateRoomState();
        return;
      }

      const roomId = `free_room_${Date.now()}`;
      const titleFinal =
        roomTitle.trim() ||
        [...internalSel, ...externalSel].map((u) => u.name).join(', ');

      addRoom({
        id: roomId,
        title: titleFinal,
        participantCount: 1 + internalSel.length + externalSel.length,
        preview: '대화를 시작해보세요.',
        device: 'PC',
        timestamp: nowStamp(),
      });

      addParticipant(roomId, {
        id: HOST_ID,
        displayName: HOST_NAME,
        external: false,
        isHost: true,
        device: 'PC',
        online: true,
      });
      internalSel.forEach((u) =>
        addParticipant(roomId, {
          id: `internal-${u.id}`,
          displayName: u.name,
          external: false,
          device: 'PC',
          online: false,
        })
      );
      externalSel.forEach((u) =>
        addParticipant(roomId, {
          id: `external-${u.id}`,
          displayName: u.name,
          external: true,
          device: 'Mobile',
          online: false,
        })
      );

      if (externalSel.length > 0) {
        const noticeId = kakaoOn ? `notice-${roomId}` : undefined;
        pushMobileChat({
          roomId,
          title: titleFinal,
          lastMessage: '대화방에 초대되었습니다.',
          unread: 1,
          time: nowClock(),
          kind: 'cowork-invite',
          noticeId,
        });
        if (noticeId) {
          pushMobileNotice({
            id: noticeId,
            title: '대화방 초대',
            body: `${HOST_NAME}님이 '${titleFinal}' 에 초대했습니다.`,
            ctaLabel: '입장',
          });
        }
        setMobileViewer(`external-${externalSel[0].id}`);
      }

      selectRoom(roomId);
      cleanupCreateRoomState();
    });

  return (
    <div className="absolute inset-0 z-40 flex animate-backdrop-fade bg-black/30 p-6 backdrop-blur-sm">
      <div className="m-auto flex h-full max-h-[min(540px,100%)] w-full max-w-[min(720px,100%)] animate-modal-pop flex-col overflow-hidden rounded-xl bg-surface-card shadow-elev">
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

        <div key={step} className="flex min-h-0 flex-1 animate-fade-in flex-col">
        {step === 1 ? (
          <Step1
            tab={tab}
            internalSearch={internalSearch}
            externalSearch={externalSearch}
            checks={checks}
            externalUsers={externalUsers}
            onTabClick={onTabClick}
            onSearchChange={onSearchChange}
            onCheckUser={onCheckUser}
            onNext={onNext}
          />
        ) : (
          <Step2
            roomTitle={roomTitle}
            kakaoOn={kakaoOn}
            externalUsers={externalUsers}
            onTitleChange={onTitleChange}
            onToggleKakao={onToggleKakao}
            onPrev={onPrev}
            onCreate={onCreate}
          />
        )}
        </div>
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
  internalSearch: string;
  externalSearch: string;
  checks: Record<string, boolean>;
  externalUsers: ExternalUser[];
  onTabClick: (next: 'internal' | 'external') => void;
  onSearchChange: (v: string) => void;
  onCheckUser: (kind: 'internal' | 'external', id: string) => void;
  onNext: () => void;
}

function Step1({
  tab,
  internalSearch,
  externalSearch,
  checks,
  externalUsers,
  onTabClick,
  onSearchChange,
  onCheckUser,
  onNext,
}: Step1Props) {
  const search = tab === 'internal' ? internalSearch : externalSearch;
  const filteredInternal = internalSearch
    ? INTERNAL_USERS.filter(
        (u) =>
          u.name.includes(internalSearch) ||
          u.login.toLowerCase().includes(internalSearch.toLowerCase())
      )
    : INTERNAL_USERS;
  const filteredExternal = externalSearch
    ? externalUsers.filter(
        (u) => u.name.includes(externalSearch) || u.phone.includes(externalSearch)
      )
    : externalUsers;
  const selectedExternal = externalUsers.filter(
    (u) => checks[`create-room.external.${u.id}`]
  );
  const selectedInternal = INTERNAL_USERS.filter(
    (u) => checks[`create-room.internal.${u.id}`]
  );
  const pendingNext = usePendingButton('create-room.next');

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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                tab === 'external'
                  ? '이름 또는 전화번호로 검색'
                  : '이름 또는 아이디로 검색'
              }
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
              {tab === 'internal' ? (
                filteredInternal.length === 0 ? (
                  <li className="px-2 py-1.5 text-xs text-ink-muted">
                    검색 결과가 없습니다.
                  </li>
                ) : (
                  filteredInternal.map((u) => (
                    <UserRow
                      key={u.id}
                      checked={!!checks[`create-room.internal.${u.id}`]}
                      label={`${u.name} (${u.login})`}
                      onToggle={() => onCheckUser('internal', u.id)}
                    />
                  ))
                )
              ) : filteredExternal.length === 0 ? (
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
        <Button
          className={cn('w-full', pendingNext)}
          data-button-id="create-room.next"
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

interface Step2Props {
  roomTitle: string;
  kakaoOn: boolean;
  externalUsers: ExternalUser[];
  onTitleChange: (v: string) => void;
  onToggleKakao: () => void;
  onPrev: () => void;
  onCreate: () => void;
}

function Step2({
  roomTitle,
  kakaoOn,
  externalUsers,
  onTitleChange,
  onToggleKakao,
  onPrev,
  onCreate,
}: Step2Props) {
  const checks = useUISimStore((s) => s.checks);
  const selectedInternal = INTERNAL_USERS.filter(
    (u) => checks[`create-room.internal.${u.id}`]
  );
  const selectedExternal = externalUsers.filter(
    (u) => checks[`create-room.external.${u.id}`]
  );
  const pendingCreate = usePendingButton('create-room.create');
  const pendingPrev = usePendingButton('create-room.prev');
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
                'inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                kakaoOn ? 'bg-brand-primary' : 'bg-ink-subtle'
              )}
            >
              <span
                className={cn(
                  'block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  kakaoOn ? 'translate-x-[18px]' : 'translate-x-0.5'
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

      <div className="grid grid-cols-2 items-center gap-3 border-t border-surface-border bg-surface-card px-4 py-3">
        <Button
          variant="outline"
          className={pendingPrev}
          data-button-id="create-room.prev"
          onClick={onPrev}
        >
          이전
        </Button>
        <Button
          className={pendingCreate}
          data-button-id="create-room.create"
          onClick={onCreate}
        >
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

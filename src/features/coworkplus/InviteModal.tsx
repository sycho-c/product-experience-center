import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { useExternalUsersStore } from '@/features/domain/external-users/store';
import { INTERNAL_USERS } from './users-data';
import { cn } from '@/lib/utils';
import type { Talk } from '@/types/talk';

interface InviteModalProps {
  roomId: string;
  onClose: () => void;
}

type Tab = 'internal' | 'external';

let _sysSeq = 0;
function genSystemTalkId(): string {
  _sysSeq += 1;
  return `sys_invite_${Date.now()}_${_sysSeq}`;
}

function nowClock(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? '오후' : '오전';
  const hour12 = ((h + 11) % 12) + 1;
  return `${period} ${hour12.toString().padStart(2, '0')}:${m}`;
}

export function InviteModal({ roomId, onClose }: InviteModalProps) {
  const externalUsers = useExternalUsersStore((s) => s.users);
  const participants = useUISimStore((s) => s.participants[roomId] ?? []);
  const room = useUISimStore((s) => s.rooms.find((r) => r.id === roomId));
  const addParticipant = useUISimStore((s) => s.addParticipant);
  const appendTalk = useUISimStore((s) => s.appendTalk);
  const pushMobileChat = useUISimStore((s) => s.pushMobileChat);
  const setMobileViewer = useUISimStore((s) => s.setMobileViewer);
  const mobileChatList = useUISimStore((s) => s.mobileChatList);
  const mobileViewerId = useUISimStore((s) => s.mobileViewerParticipantId);

  const [tab, setTab] = useState<Tab>('internal');
  const [search, setSearch] = useState('');
  const [internalChecked, setInternalChecked] = useState<Set<string>>(new Set());
  const [externalChecked, setExternalChecked] = useState<Set<string>>(new Set());

  // 이미 방 안에 있는 사용자는 제외 (id prefix 'internal-' / 'external-')
  const existingInternalIds = useMemo(() => {
    const set = new Set<string>();
    participants.forEach((p) => {
      if (!p.external && p.id.startsWith('internal-')) {
        set.add(p.id.replace(/^internal-/, ''));
      }
    });
    return set;
  }, [participants]);
  const existingExternalIds = useMemo(() => {
    const set = new Set<string>();
    participants.forEach((p) => {
      if (p.external && p.id.startsWith('external-')) {
        set.add(p.id.replace(/^external-/, ''));
      }
    });
    return set;
  }, [participants]);

  const filteredInternal = useMemo(() => {
    const all = INTERNAL_USERS.filter((u) => !existingInternalIds.has(u.id));
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter(
      (u) => u.name.includes(search) || u.login.toLowerCase().includes(q)
    );
  }, [search, existingInternalIds]);

  const filteredExternal = useMemo(() => {
    const all = externalUsers.filter((u) => !existingExternalIds.has(u.id));
    if (!search) return all;
    return all.filter(
      (u) => u.name.includes(search) || u.phone.includes(search)
    );
  }, [search, externalUsers, existingExternalIds]);

  const onTabClick = (next: Tab) => {
    setTab(next);
    setSearch('');
  };

  const toggleInternal = (id: string) => {
    setInternalChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleExternal = (id: string) => {
    setExternalChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCount = internalChecked.size + externalChecked.size;
  const canInvite = totalCount > 0;

  const onInvite = () => {
    if (!canInvite) return;

    const internalSel = INTERNAL_USERS.filter((u) => internalChecked.has(u.id));
    const externalSel = externalUsers.filter((u) => externalChecked.has(u.id));

    internalSel.forEach((u) => {
      addParticipant(roomId, {
        id: `internal-${u.id}`,
        displayName: u.name,
        external: false,
        device: 'PC',
        online: false,
      });
    });
    externalSel.forEach((u) => {
      addParticipant(roomId, {
        id: `external-${u.id}`,
        displayName: u.name,
        external: true,
        device: 'Mobile',
        online: false,
      });
    });

    // 시스템 메시지: "입장: 이름1, 이름2"
    const allNames = [...internalSel, ...externalSel]
      .map((u) => u.name)
      .join(', ');
    if (allNames) {
      const sysTalk: Talk = {
        id: genSystemTalkId(),
        stepId: 'invite',
        type: 'system',
        from: { role: 'system', displayName: '시스템' },
        to: { broadcast: true },
        device: 'all',
        content: `입장: ${allNames}`,
        offsetMs: 0,
      };
      appendTalk(roomId, sysTalk);
    }

    // 외부 사용자가 새로 추가됐고 모바일 chat list 에 해당 방이 없으면 추가 (초대 카드 형태)
    if (externalSel.length > 0) {
      const alreadyInList = mobileChatList.some((e) => e.roomId === roomId);
      if (!alreadyInList) {
        pushMobileChat({
          roomId,
          title: room?.title ?? '대화방',
          lastMessage: '대화방에 초대되었습니다.',
          unread: 1,
          time: nowClock(),
          kind: 'cowork-invite',
        });
      }
      // 모바일 viewer 가 비어있으면 첫 외부 사용자로 설정
      if (!mobileViewerId) {
        setMobileViewer(`external-${externalSel[0].id}`);
      }
    }

    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-40 flex animate-backdrop-fade items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-full max-h-[min(560px,100%)] w-full max-w-[min(760px,100%)] animate-modal-pop flex-col overflow-hidden rounded-xl bg-surface-card shadow-elev"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-primary">대화 초대</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* Tabs */}
        <div className="shrink-0 border-b border-surface-border px-4">
          <div className="grid grid-cols-2">
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
          {/* Body — search + tree + list */}
          <div className="flex min-h-0 flex-col px-4 py-3">
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  tab === 'external'
                    ? '이름 또는 전화번호로 검색'
                    : '이름 또는 아이디로 검색'
                }
                className="h-8 w-full rounded-md border border-brand-primary/40 bg-surface-card pl-8 pr-3 text-xs focus:outline-none"
              />
            </div>

            <div className="mt-2 grid min-h-0 flex-1 grid-cols-[160px_1fr] gap-3 overflow-hidden">
              {/* Tree (mock) */}
              <ul className="space-y-1 overflow-y-auto pr-1 text-xs text-ink-secondary scrollbar-thin">
                {tab === 'internal' ? (
                  <>
                    <TreeNode label="설계지원팀" hasChildren expanded />
                    <TreeNode label="KB손해보험 설계매니저" />
                  </>
                ) : (
                  <>
                    <TreeNode label="협업 파트너" hasChildren />
                    <TreeNode label="고객사" hasChildren />
                    <TreeNode label="신규 연락처" hasChildren />
                  </>
                )}
              </ul>

              {/* List */}
              <ul className="space-y-0.5 overflow-y-auto pr-1 text-xs scrollbar-thin">
                {tab === 'internal' ? (
                  filteredInternal.length === 0 ? (
                    <li className="px-2 py-1.5 text-xs text-ink-muted">
                      추가할 수 있는 내부 사용자가 없습니다.
                    </li>
                  ) : (
                    filteredInternal.map((u) => (
                      <UserCheckRow
                        key={u.id}
                        checked={internalChecked.has(u.id)}
                        label={`${u.name} (${u.login})`}
                        onToggle={() => toggleInternal(u.id)}
                      />
                    ))
                  )
                ) : filteredExternal.length === 0 ? (
                  <li className="px-2 py-1.5 text-xs text-ink-muted">
                    추가할 수 있는 외부 사용자가 없습니다.
                  </li>
                ) : (
                  filteredExternal.map((u) => (
                    <UserCheckRow
                      key={u.id}
                      checked={externalChecked.has(u.id)}
                      label={`${u.name} (${u.phone})`}
                      emphasized={externalChecked.has(u.id)}
                      onToggle={() => toggleExternal(u.id)}
                    />
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Selected panel */}
          <aside className="flex min-h-0 flex-col border-l border-surface-border bg-surface-subtle/50 px-4 py-4 text-sm">
            <div className="text-xs font-semibold text-ink-secondary">
              내부 사용자
            </div>
            {internalChecked.size === 0 ? (
              <p className="mt-1 text-xs text-ink-muted">
                내부 사용자가 없습니다.
              </p>
            ) : (
              <ul className="mt-1 space-y-1">
                {INTERNAL_USERS.filter((u) => internalChecked.has(u.id)).map(
                  (u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-2 text-xs text-ink-primary"
                    >
                      <span className="truncate">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleInternal(u.id)}
                        aria-label={`${u.name} 제거`}
                        className="grid h-4 w-4 place-items-center rounded text-ink-muted hover:bg-surface-card"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  )
                )}
              </ul>
            )}
            <div className="mt-6 text-xs font-semibold text-ink-secondary">
              외부 사용자
            </div>
            {externalChecked.size === 0 ? (
              <p className="mt-1 text-xs text-ink-muted">
                외부 사용자가 없습니다.
              </p>
            ) : (
              <ul className="mt-1 space-y-1">
                {externalUsers
                  .filter((u) => externalChecked.has(u.id))
                  .map((u) => (
                    <li
                      key={u.id}
                      className="flex items-center justify-between gap-2 text-xs text-ink-primary"
                    >
                      <span className="truncate">{u.name}</span>
                      <button
                        type="button"
                        onClick={() => toggleExternal(u.id)}
                        aria-label={`${u.name} 제거`}
                        className="grid h-4 w-4 place-items-center rounded text-ink-muted hover:bg-surface-card"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="grid shrink-0 grid-cols-2 items-center gap-3 border-t border-surface-border bg-surface-card px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-md border border-surface-border bg-white text-sm text-ink-primary hover:bg-surface-subtle"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onInvite}
            disabled={!canInvite}
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-md bg-brand-primary text-sm font-medium text-white hover:bg-brand-primaryHover',
              !canInvite && 'opacity-50'
            )}
          >
            초대{totalCount > 0 ? ` (${totalCount})` : ''}
          </button>
        </footer>
      </div>
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
  expanded = false,
}: {
  label: string;
  hasChildren?: boolean;
  expanded?: boolean;
}) {
  return (
    <li className="flex items-center gap-1.5 px-1 py-1">
      <span className="text-ink-muted">
        {hasChildren ? (expanded ? '▾' : '›') : ' '}
      </span>
      <input type="checkbox" readOnly className="h-3.5 w-3.5" />
      <span className="truncate" title={label}>
        {label}
      </span>
    </li>
  );
}

function UserCheckRow({
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

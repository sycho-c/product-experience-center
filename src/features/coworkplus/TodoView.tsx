import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Link2,
  Plus,
  X,
} from 'lucide-react';
import {
  useTodosStore,
  type TodoItem,
  type TodoStatus,
} from '@/features/domain/todos/store';
import { TodoRegisterModal } from './TodoRegisterModal';
import { cn } from '@/lib/utils';

const STATUS_TONE: Record<TodoStatus, string> = {
  신규: 'bg-emerald-100 text-emerald-700',
  진행중: 'bg-amber-100 text-amber-700',
  완료: 'bg-sky-100 text-sky-700',
  보류: 'bg-slate-200 text-slate-600',
};

type DateScope = 'all' | 'today' | '7d' | '30d';
const DATE_LABELS: Record<DateScope, string> = {
  all: '전체',
  today: '오늘',
  '7d': '지난 7일',
  '30d': '지난 30일',
};

const TODAY = new Date('2026-05-10T00:00:00');

function diffDays(a: Date, b: Date): number {
  const ms = a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);
  return Math.abs(Math.round(ms / (1000 * 60 * 60 * 24)));
}
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function inScope(dateStr: string | undefined, scope: DateScope): boolean {
  if (scope === 'all') return true;
  if (!dateStr) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date(TODAY);
  if (scope === 'today') return isSameDay(d, today);
  if (scope === '7d') return diffDays(new Date(today), d) <= 7;
  if (scope === '30d') return diffDays(new Date(today), d) <= 30;
  return true;
}
function formatDateLong(dateStr?: string): string | null {
  if (!dateStr) return null;
  const d = new Date(`${dateStr}T00:00:00`);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function TodoView() {
  const items = useTodosStore((s) => s.items);
  const setStatus = useTodosStore((s) => s.setStatus);
  const markRead = useTodosStore((s) => s.markRead);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createdScope, setCreatedScope] = useState<DateScope>('all');
  const [completedScope, setCompletedScope] = useState<DateScope>('all');
  const [dueScope, setDueScope] = useState<DateScope>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TodoStatus>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [requesterFilter, setRequesterFilter] = useState<string>('all');
  const [externalOnly, setExternalOnly] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const assignees = useMemo(() => {
    const set = new Set<string>();
    items.forEach((t) => set.add(t.assignee));
    return Array.from(set).sort();
  }, [items]);
  const requesters = useMemo(() => {
    const set = new Set<string>();
    items.forEach((t) => set.add(t.requester));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((t) => {
      if (!inScope(t.createdDate, createdScope)) return false;
      if (!inScope(t.completedDate, completedScope)) return false;
      if (!inScope(t.dueDate, dueScope)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (assigneeFilter !== 'all' && t.assignee !== assigneeFilter)
        return false;
      if (requesterFilter !== 'all' && t.requester !== requesterFilter)
        return false;
      if (externalOnly && !t.fromExternal) return false;
      if (unreadOnly && !t.unread) return false;
      return true;
    });
  }, [
    items,
    createdScope,
    completedScope,
    dueScope,
    statusFilter,
    assigneeFilter,
    requesterFilter,
    externalOnly,
    unreadOnly,
  ]);

  useEffect(() => {
    if (selectedId && !filtered.some((t) => t.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((t) => t.id === selectedId) ?? null;

  // 선택 시 미확인 마크 해제
  useEffect(() => {
    if (selected && selected.unread) markRead(selected.id);
  }, [selected, markRead]);

  const onClearAll = () => {
    setCreatedScope('all');
    setCompletedScope('all');
    setDueScope('all');
    setStatusFilter('all');
    setAssigneeFilter('all');
    setRequesterFilter('all');
    setExternalOnly(false);
    setUnreadOnly(false);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-canvas">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-6 py-3">
        <h1 className="text-lg font-semibold text-ink-primary">할 일 관리</h1>
        <button
          type="button"
          onClick={() => setRegisterOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft hover:bg-brand-primaryHover"
        >
          <Plus className="h-3.5 w-3.5" />
          할 일 등록하기
        </button>
      </header>

      {/* Filter chips */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-surface-border bg-surface-card px-6 py-2.5">
        <DateScopeChip
          label="생성일"
          value={createdScope}
          onChange={setCreatedScope}
        />
        <DateScopeChip
          label="완료일"
          value={completedScope}
          onChange={setCompletedScope}
        />
        <DateScopeChip
          label="마감일"
          value={dueScope}
          onChange={setDueScope}
        />
        <PlaceholderChip label="제목" />
        <ChoiceChip
          label="상태"
          value={statusFilter}
          options={[
            { key: 'all', label: '전체' },
            { key: '신규', label: '신규' },
            { key: '진행중', label: '진행중' },
            { key: '완료', label: '완료' },
            { key: '보류', label: '보류' },
          ]}
          onChange={(v) => setStatusFilter(v as 'all' | TodoStatus)}
        />
        <ChoiceChip
          label="담당자"
          value={assigneeFilter}
          options={[
            { key: 'all', label: '전체' },
            ...assignees.map((a) => ({ key: a, label: a })),
          ]}
          onChange={setAssigneeFilter}
        />
        <ChoiceChip
          label="요청자"
          value={requesterFilter}
          options={[
            { key: 'all', label: '전체' },
            ...requesters.map((a) => ({ key: a, label: a })),
          ]}
          onChange={setRequesterFilter}
        />
        <PlaceholderChip label="할 일 ID" />

        <PlaceholderChip label="연결된 대화방" />
        <ToggleChip
          label="외부 사용자 요청건만"
          active={externalOnly}
          onClick={() => setExternalOnly((v) => !v)}
        />
        <ToggleChip
          label="미확인 건만"
          active={unreadOnly}
          onClick={() => setUnreadOnly((v) => !v)}
        />
        <button
          type="button"
          onClick={onClearAll}
          className="text-[11px] text-ink-muted hover:text-ink-primary"
        >
          필터 모두 초기화
        </button>
      </div>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[420px_1fr] gap-0">
        <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-card scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-muted">
              조건에 맞는 할 일이 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col">
              {filtered.map((t) => (
                <TodoCard
                  key={t.id}
                  item={t}
                  selected={t.id === selectedId}
                  onClick={() => setSelectedId(t.id)}
                />
              ))}
            </ul>
          )}
        </aside>

        <section className="flex min-h-0 flex-col bg-surface-canvas">
          {selected ? (
            <TodoDetail item={selected} onSetStatus={setStatus} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-sm text-ink-secondary">
                선택된 할 일이 없습니다.
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                목록에서 상세 내용을 확인할 할 일을 선택하세요.
              </p>
            </div>
          )}
        </section>
      </div>

      {registerOpen && (
        <TodoRegisterModal onClose={() => setRegisterOpen(false)} />
      )}
    </div>
  );
}

function TodoCard({
  item,
  selected,
  onClick,
}: {
  item: TodoItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-start gap-3 border-b border-surface-border/60 px-4 py-3 text-left transition-colors',
          selected ? 'bg-surface-subtle' : 'hover:bg-surface-subtle/50'
        )}
      >
        <div
          className={cn(
            'grid h-12 w-12 shrink-0 place-items-center rounded-full text-[11px] font-semibold',
            STATUS_TONE[item.status]
          )}
        >
          {item.status}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className="min-w-0 flex-1 truncate text-sm font-medium text-ink-primary"
              title={item.title}
            >
              {item.title}
            </span>
            {item.unread && (
              <span className="inline-flex shrink-0 items-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ink-secondary">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-ink-muted" />
              {item.dueDate ? formatDateLong(item.dueDate) : '미지정'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PersonAvatar name={item.assignee} />
              {item.assignee}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

function PersonAvatar({ name }: { name: string }) {
  const label = name.trim().slice(-2);
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-primarySoft text-[9px] font-medium text-brand-primary">
      {label}
    </span>
  );
}

function TodoDetail({
  item,
  onSetStatus,
}: {
  item: TodoItem;
  onSetStatus: (id: string, status: TodoStatus) => void;
}) {
  const [activitiesOpen, setActivitiesOpen] = useState(true);
  const [copied, setCopied] = useState<'id' | 'link' | null>(null);

  const onCopy = async (kind: 'id' | 'link') => {
    const text =
      kind === 'id'
        ? item.id
        : `${window.location.origin}/#/features?todo=${item.id}`;
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* noop */
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-5 scrollbar-thin">
      <header className="flex items-start justify-between gap-3 pb-3">
        <h2 className="text-base font-semibold text-ink-primary">
          {item.title}
        </h2>
        <div className="flex shrink-0 items-center gap-3 text-xs text-ink-secondary">
          <button
            type="button"
            onClick={() => onCopy('id')}
            className="inline-flex items-center gap-1 hover:text-brand-primary"
          >
            <Copy className="h-3 w-3" />
            {copied === 'id' ? '복사됨' : '할 일 아이디 복사'}
          </button>
          <button
            type="button"
            onClick={() => onCopy('link')}
            className="inline-flex items-center gap-1 hover:text-brand-primary"
          >
            <Link2 className="h-3 w-3" />
            {copied === 'link' ? '복사됨' : '할 일 링크 복사'}
          </button>
        </div>
      </header>
      <div className="border-b border-surface-border" />

      {/* 내용 */}
      <section className="py-4">
        <h3 className="mb-2 text-xs font-semibold text-ink-secondary">내용</h3>
        <p className="whitespace-pre-wrap break-words text-sm text-ink-primary [overflow-wrap:anywhere]">
          {item.content || '-'}
        </p>
      </section>

      {/* 세부 정보 */}
      <section className="rounded-lg border border-surface-border bg-surface-card p-4">
        <h3 className="mb-3 text-xs font-semibold text-ink-secondary">세부 정보</h3>
        <dl className="grid grid-cols-[80px_1fr] gap-y-3 text-xs">
          <dt className="text-ink-muted">상태</dt>
          <dd>
            <select
              value={item.status}
              onChange={(e) =>
                onSetStatus(item.id, e.target.value as TodoStatus)
              }
              className="rounded border border-surface-border bg-white px-2 py-0.5 text-xs text-ink-primary focus:border-brand-primary focus:outline-none"
            >
              {(['신규', '진행중', '완료', '보류'] as TodoStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </dd>
          <dt className="text-ink-muted">요청자</dt>
          <dd className="flex items-center gap-1.5 text-ink-primary">
            <PersonAvatar name={item.requester} />
            {item.requester}
          </dd>
          <dt className="text-ink-muted">담당자</dt>
          <dd className="flex items-center gap-1.5 text-ink-primary">
            <PersonAvatar name={item.assignee} />
            {item.assignee}
          </dd>
          <dt className="text-ink-muted">생성일</dt>
          <dd className="text-ink-primary">{formatDateLong(item.createdDate)}</dd>
          <dt className="text-ink-muted">마감일</dt>
          <dd className="text-ink-primary">
            {item.dueDate ? formatDateLong(item.dueDate) : '미지정'}
          </dd>
          {item.completedDate && (
            <>
              <dt className="text-ink-muted">완료일</dt>
              <dd className="text-ink-primary">
                {formatDateLong(item.completedDate)}
              </dd>
            </>
          )}
        </dl>
      </section>

      {/* 활동 내역 */}
      <section className="mt-4 rounded-lg border border-surface-border bg-surface-card">
        <button
          type="button"
          onClick={() => setActivitiesOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-ink-secondary"
        >
          활동 내역
          {activitiesOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-ink-muted" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
          )}
        </button>
        {activitiesOpen && (
          <ul className="border-t border-surface-border px-4 py-3">
            {item.activities.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-2 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <PersonAvatar name={a.actor} />
                  <span className="text-ink-primary">{a.message}</span>
                </div>
                <span className="text-[11px] text-ink-muted">{a.at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ---------- Filter chip primitives ---------- */

function ChipShell({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] transition-colors',
        active
          ? 'border-brand-primary/60 bg-brand-primarySoft/40 text-brand-primary'
          : 'border-surface-border bg-white text-ink-secondary',
        disabled && 'cursor-not-allowed opacity-60',
        !disabled && 'hover:bg-surface-subtle'
      )}
    >
      {children}
    </button>
  );
}

function PlaceholderChip({ label }: { label: string }) {
  return (
    <ChipShell disabled>
      {label} : 전체
      <ChevronDown className="h-3 w-3 text-ink-muted" />
    </ChipShell>
  );
}

function ToggleChip({
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
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition-colors',
        active
          ? 'border-brand-primary bg-brand-primary text-white'
          : 'border-surface-border bg-white text-ink-secondary hover:bg-surface-subtle'
      )}
    >
      {label}
    </button>
  );
}

function DateScopeChip({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DateScope;
  onChange: (v: DateScope) => void;
}) {
  return (
    <ChoiceChip
      label={label}
      value={value}
      options={[
        { key: 'all', label: DATE_LABELS.all },
        { key: 'today', label: DATE_LABELS.today },
        { key: '7d', label: DATE_LABELS['7d'] },
        { key: '30d', label: DATE_LABELS['30d'] },
      ]}
      onChange={(v) => onChange(v as DateScope)}
    />
  );
}

function ChoiceChip({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.key === value) ?? options[0];
  const active = value !== 'all';

  return (
    <div className="relative">
      <ChipShell active={active} onClick={() => setOpen((v) => !v)}>
        {label} : {current.label}
        {active ? (
          <span
            role="button"
            aria-label={`${label} 필터 해제`}
            onClick={(e) => {
              e.stopPropagation();
              onChange('all');
            }}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25"
          >
            <X className="h-2.5 w-2.5" />
          </span>
        ) : (
          <ChevronDown className="h-3 w-3 text-ink-muted" />
        )}
      </ChipShell>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <ul className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-[140px] overflow-hidden rounded-md border border-surface-border bg-surface-card py-1 text-xs shadow-elev">
            {options.map((o) => (
              <li key={o.key}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.key);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                    o.key === value && 'text-brand-primary font-medium'
                  )}
                >
                  {o.label}
                  {o.key === value && <Check className="h-3 w-3" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

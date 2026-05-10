import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Plus, X } from 'lucide-react';
import {
  useExternalUsersStore,
  type ExternalUser,
  type ExternalUserType,
} from '@/features/domain/external-users/store';
import { cn } from '@/lib/utils';

const FILTER_LABELS = ['이름', '휴대전화', '이메일', '담당자'] as const;
const ALL = '__all__';
const NONE = '__none__';

const TYPE_TONE: Record<ExternalUserType, string> = {
  VIP: 'border-rose-200 bg-rose-50 text-rose-600',
  '1등급 설계사': 'border-rose-200 bg-rose-50 text-rose-600',
  '2등급 설계사': 'border-amber-200 bg-amber-50 text-amber-700',
  '3등급 설계사': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  배송기사: 'border-amber-200 bg-amber-50 text-amber-700',
  화물기사: 'border-pink-200 bg-pink-50 text-pink-600',
};

export function ExternalUsersView() {
  const users = useExternalUsersStore((s) => s.users);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>(ALL);
  const [selectedType, setSelectedType] = useState<string>(ALL);

  const groupBuckets = useMemo(() => buildBuckets(users, (u) => u.group), [users]);
  const typeBuckets = useMemo(() => buildBuckets(users, (u) => u.type), [users]);

  const onSelectGroup = (key: string) => {
    setSelectedGroup(key);
    setSelectedType(ALL);
  };
  const onSelectType = (key: string) => {
    setSelectedType(key);
    setSelectedGroup(ALL);
  };

  const filtered = useMemo(() => {
    if (selectedGroup !== ALL) {
      return users.filter((u) => u.group === selectedGroup);
    }
    if (selectedType !== ALL) {
      return users.filter((u) => u.type === selectedType);
    }
    return users;
  }, [users, selectedGroup, selectedType]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-canvas">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-6 py-3">
        <h1 className="text-lg font-semibold text-ink-primary">외부 사용자</h1>
        <button
          type="button"
          onClick={() => setRegisterOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft hover:bg-brand-primaryHover"
        >
          <Plus className="h-3.5 w-3.5" />
          등록
        </button>
      </header>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr] gap-4 p-4">
        {/* Left filter panel */}
        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto scrollbar-thin">
          <FilterPanel title="그룹">
            <Tree
              items={groupBuckets}
              selected={selectedGroup}
              total={users.length}
              onSelect={onSelectGroup}
              IconAll={Folder}
            />
          </FilterPanel>

          <FilterPanel title="유형">
            <TypeChips
              items={typeBuckets}
              selected={selectedType}
              onSelect={onSelectType}
            />
          </FilterPanel>
        </aside>

        {/* Right table area */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card">
          <div className="flex shrink-0 items-center gap-2 border-b border-surface-border px-3 py-2">
            {FILTER_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-[11px] text-ink-secondary opacity-70"
              >
                {label} : 전체
                <ChevronDown className="h-3 w-3 text-ink-muted" />
              </button>
            ))}
            <span className="ml-auto text-[11px] text-ink-muted">
              {filtered.length} / {users.length} 명
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-auto scrollbar-thin">
            <table className="w-full table-fixed text-left text-xs">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[20%]" />
                <col className="w-[22%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-surface-subtle/80 text-[11px] font-medium text-ink-secondary backdrop-blur">
                <tr>
                  <Th>이름(별칭) ↑</Th>
                  <Th>휴대전화</Th>
                  <Th>이메일</Th>
                  <Th>그룹</Th>
                  <Th>담당자</Th>
                  <Th>유형</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-xs text-ink-muted"
                    >
                      조건에 맞는 외부 사용자가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => <UserRow key={u.id} user={u} />)
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {registerOpen && (
        <RegisterModal onClose={() => setRegisterOpen(false)} />
      )}
    </div>
  );
}

interface Bucket {
  key: string;
  label: string;
  count: number;
}

function buildBuckets(
  users: ExternalUser[],
  getter: (u: ExternalUser) => string | undefined
): Bucket[] {
  const map = new Map<string, number>();
  for (const u of users) {
    const v = getter(u);
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-surface-border px-3 py-2 font-medium">
      {children}
    </th>
  );
}

function UserRow({ user }: { user: ExternalUser }) {
  return (
    <tr className="border-b border-surface-border/60 hover:bg-surface-subtle/40">
      <Td>
        <TruncateCell value={user.name} className="text-ink-primary" />
      </Td>
      <Td>
        <TruncateCell value={user.phone} className="text-ink-secondary" />
      </Td>
      <Td>
        <TruncateCell value={user.email} className="text-ink-secondary" />
      </Td>
      <Td>
        {user.group ? (
          <TruncateCell value={user.group}>
            <span className="inline-block max-w-full truncate rounded-full border border-brand-primary/40 bg-white px-2 py-0.5 text-[11px] text-brand-primary align-middle">
              {user.group}
            </span>
          </TruncateCell>
        ) : null}
      </Td>
      <Td>
        <TruncateCell value={user.manager} className="text-ink-secondary" />
      </Td>
      <Td>
        {user.type ? (
          <TruncateCell value={user.type}>
            <span
              className={cn(
                'inline-block max-w-full truncate rounded-full border px-2 py-0.5 text-[11px] font-medium align-middle',
                TYPE_TONE[user.type]
              )}
            >
              {user.type}
            </span>
          </TruncateCell>
        ) : null}
      </Td>
    </tr>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2.5 align-middle">{children}</td>;
}

/**
 * 셀 안 텍스트가 컬럼보다 길면 말줄임 + 마우스 오버 시 native title 툴팁(전체 텍스트) 표시.
 */
function TruncateCell({
  value,
  children,
  className,
}: {
  value?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!value) return null;
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center align-middle',
        className
      )}
      title={value}
    >
      <span className="block w-full min-w-0 truncate">
        {children ?? value}
      </span>
    </span>
  );
}

function FilterPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-subtle/50 p-3">
      <div className="mb-2 text-[11px] font-medium text-ink-secondary">
        {title}
      </div>
      {children}
    </div>
  );
}

function Tree({
  items,
  selected,
  total,
  onSelect,
  IconAll,
}: {
  items: Bucket[];
  selected: string;
  total: number;
  onSelect: (key: string) => void;
  IconAll: React.ComponentType<{ className?: string }>;
}) {
  return (
    <ul className="space-y-0.5 text-xs">
      <TreeNode
        label="전체"
        count={total}
        active={selected === ALL}
        onClick={() => onSelect(ALL)}
        Icon={IconAll}
        depth={0}
      />
      {items.map((b) => (
        <TreeNode
          key={b.key}
          label={b.label}
          count={b.count}
          active={selected === b.key}
          onClick={() => onSelect(b.key)}
          depth={1}
        />
      ))}
    </ul>
  );
}

function TypeChips({
  items,
  selected,
  onSelect,
}: {
  items: Bucket[];
  selected: string;
  onSelect: (key: string) => void;
}) {
  const allActive = selected === ALL;
  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={() => onSelect(ALL)}
        className={cn(
          'self-start text-xs transition-colors',
          allActive
            ? 'font-semibold text-ink-primary'
            : 'text-ink-secondary hover:text-ink-primary'
        )}
      >
        전체
      </button>
      {items.map((b) => {
        const tone = TYPE_TONE[b.label as ExternalUserType];
        const active = selected === b.key;
        return (
          <div key={b.key} className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onSelect(b.key)}
              className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-shadow',
                tone ?? 'border-surface-border bg-white text-ink-secondary',
                active && 'ring-2 ring-brand-primary/50 ring-offset-1'
              )}
            >
              {b.label}
            </button>
            <span className="shrink-0 text-[10px] text-ink-muted">
              {b.count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TreeNode({
  label,
  count,
  active,
  onClick,
  Icon,
  depth,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  Icon?: React.ComponentType<{ className?: string }>;
  depth: number;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors',
          active
            ? 'bg-brand-primarySoft/70 text-brand-primary font-semibold'
            : 'text-ink-secondary hover:bg-surface-card'
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {Icon ? (
          <Icon className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
        ) : (
          <ChevronRight className="h-3 w-3 shrink-0 text-ink-muted" />
        )}
        <span className="min-w-0 flex-1 truncate" title={label}>
          {label}
        </span>
        <span className="shrink-0 text-[10px] text-ink-muted">{count}</span>
      </button>
    </li>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const add = useExternalUsersStore((s) => s.add);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [manager, setManager] = useState('');

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    add({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      manager: manager.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-xl bg-surface-card shadow-elev"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-primary">
            외부 사용자 등록
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="space-y-3 px-4 py-4">
          <Field label="이름(별칭)" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <Field label="휴대전화" required>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <Field label="이메일">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <Field label="담당자">
            <input
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="담당자 이름"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <p className="text-[11px] text-ink-muted">
            그룹 / 유형은 후속 고도화 예정입니다.
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-surface-border bg-surface-canvas px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-surface-border bg-white px-3 text-xs text-ink-primary hover:bg-surface-subtle"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={cn(
              'inline-flex h-8 items-center rounded-md bg-brand-primary px-3 text-xs font-medium text-white hover:bg-brand-primaryHover',
              !canSubmit && 'opacity-50'
            )}
          >
            등록
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium text-ink-secondary">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

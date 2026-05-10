import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  Copy,
  HelpCircle,
  ImagePlus,
  MessageSquare,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
  Users,
  Zap,
  X,
} from 'lucide-react';
import {
  useSettingsStore,
  type AppChannel,
  type AppChannelKind,
  type AppChannelService,
  type Center,
  type CenterKind,
  type CustomField,
  type CustomFieldType,
  type InternalUser,
  type SecurityPolicy,
  type UserRole,
} from '@/features/domain/settings/store';
import { ExternalUsersView } from './ExternalUsersView';
import { cn } from '@/lib/utils';

type SubMenuId =
  | 'center'
  | 'center-operation'
  | 'internal-users'
  | 'external-users'
  | 'user-roles'
  | 'app-channels'
  | 'security'
  | 'license'
  | 'custom-fields';

const SUBMENU_LABEL: Record<SubMenuId, string> = {
  center: '센터',
  'center-operation': '센터 운영',
  'internal-users': '내부 사용자',
  'external-users': '외부 사용자',
  'user-roles': '사용자 역할',
  'app-channels': 'APP 채널',
  security: '보안',
  license: '라이선스',
  'custom-fields': '커스텀 필드',
};

interface SubMenuGroup {
  title: string;
  items: SubMenuId[];
}

const GROUPS: SubMenuGroup[] = [
  { title: '센터 관리', items: ['center', 'center-operation'] },
  { title: '사용자 관리', items: ['internal-users', 'external-users', 'user-roles'] },
  { title: '접속채널 관리', items: ['app-channels'] },
  { title: '시스템 관리', items: ['security', 'license', 'custom-fields'] },
];

export function SettingsView() {
  const [sub, setSub] = useState<SubMenuId>('center');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-canvas">
      <header className="flex shrink-0 items-center border-b border-surface-border bg-surface-card px-6 py-3">
        <h1 className="text-lg font-semibold text-ink-primary">설정</h1>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Submenu sidebar */}
        {!collapsed && (
          <aside className="flex w-[220px] shrink-0 flex-col border-r border-surface-border bg-surface-card">
            <div className="flex justify-end px-3 pt-3">
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="설정 메뉴 접기"
                className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
              {GROUPS.map((g) => (
                <div key={g.title} className="mt-3 first:mt-0">
                  <div className="px-2 py-1 text-[11px] font-medium text-ink-muted">
                    {g.title}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {g.items.map((id) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setSub(id)}
                          className={cn(
                            'flex w-full items-center rounded-md px-3 py-2 text-xs transition-colors',
                            sub === id
                              ? 'bg-brand-primarySoft/50 font-semibold text-brand-primary'
                              : 'text-ink-secondary hover:bg-surface-subtle'
                          )}
                        >
                          {SUBMENU_LABEL[id]}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 border-b border-surface-border" />
                </div>
              ))}
            </nav>
          </aside>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="설정 메뉴 펼치기"
            className="grid w-8 shrink-0 place-items-start border-r border-surface-border bg-surface-card pt-3 text-ink-muted hover:bg-surface-subtle"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Main */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          <SubRouter sub={sub} />
        </main>
      </div>
    </div>
  );
}

function SubRouter({ sub }: { sub: SubMenuId }) {
  switch (sub) {
    case 'center':
      return <CentersTab />;
    case 'center-operation':
      return <CenterOperationTab />;
    case 'internal-users':
      return <InternalUsersTab />;
    case 'external-users':
      return <ExternalUsersTab />;
    case 'user-roles':
      return <UserRolesTab />;
    case 'app-channels':
      return <AppChannelsTab />;
    case 'security':
      return <SecurityTab />;
    case 'license':
      return <LicenseTab />;
    case 'custom-fields':
      return <CustomFieldsTab />;
  }
}

/* ---------- Common shells ---------- */

function PageHeader({
  crumbs,
  right,
  contextChip,
}: {
  crumbs: string[];
  right?: React.ReactNode;
  contextChip?: React.ReactNode;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-6 py-3">
      <div className="flex items-center gap-2 text-sm text-ink-secondary">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-ink-muted">/</span>}
            <span
              className={cn(
                i === crumbs.length - 1 && 'font-semibold text-ink-primary'
              )}
            >
              {c}
            </span>
          </span>
        ))}
        {contextChip}
      </div>
      {right}
    </header>
  );
}

function RegisterPrimaryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand-primary px-4 text-xs font-medium text-white shadow-soft hover:bg-brand-primaryHover"
    >
      등록
    </button>
  );
}

/* ---------- Centers Tab ---------- */

function CentersTab() {
  const centers = useSettingsStore((s) => s.centers);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        crumbs={['설정', '센터']}
        right={<RegisterPrimaryButton onClick={() => setOpen(true)} />}
      />
      <div className="grid min-h-0 flex-1 grid-cols-[200px_1fr] gap-4 p-4">
        <aside className="rounded-lg border border-surface-border bg-surface-subtle/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-primary">전체</span>
            <button
              type="button"
              aria-label="센터 그룹 추가"
              className="grid h-5 w-5 place-items-center rounded text-ink-muted hover:bg-surface-card"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </aside>
        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card">
          <div className="flex shrink-0 items-center gap-2 border-b border-surface-border px-3 py-2">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-[11px] text-ink-secondary opacity-70"
            >
              센터명 : 전체
              <ChevronDown className="h-3 w-3 text-ink-muted" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-surface-subtle/80 text-[11px] font-medium text-ink-secondary backdrop-blur">
                <tr>
                  <Th className="w-[40%]">센터명 ↑</Th>
                  <Th className="w-[40%]">설명</Th>
                  <Th className="w-[20%]">그룹</Th>
                </tr>
              </thead>
              <tbody>
                {centers.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-surface-border/60 hover:bg-surface-subtle/40"
                  >
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-2">
                        <CenterIconBadge center={c} />
                        <span className="text-ink-primary">{c.name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-secondary">
                      {c.description ?? ''}
                    </td>
                    <td className="px-3 py-2.5 text-ink-muted">
                      {c.group ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {open && <CenterRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CenterIconBadge({ center }: { center: Center }) {
  const label = (() => {
    if (/카카오/.test(center.name)) return '카카';
    if (/제조/.test(center.name)) return '제조';
    if (/모래/.test(center.name)) return '모래';
    if (/법인/.test(center.name)) return '법인';
    if (/협업/.test(center.name)) return '협업';
    if (/상담/.test(center.name)) return '상담';
    if (/GA/.test(center.name)) return 'GA';
    return center.name.slice(0, 2);
  })();
  return (
    <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-primarySoft text-[10px] font-medium text-brand-primary">
      {label}
    </span>
  );
}

function Th({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      className={cn(
        'border-b border-surface-border px-3 py-2 font-medium',
        className
      )}
    >
      {children}
    </th>
  );
}

function CenterRegisterModal({ onClose }: { onClose: () => void }) {
  const addCenter = useSettingsStore((s) => s.addCenter);
  const [tab, setTab] = useState<CenterKind>('상담');
  const [publicId, setPublicId] = useState('');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = publicId.trim() && name.trim();
  const onSubmit = () => {
    if (!canSubmit) return;
    addCenter({
      publicId: publicId.trim(),
      name: name.trim(),
      kind: tab,
      group: group.trim() || undefined,
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <ModalShell title="센터" onClose={onClose}>
      <KindTabs
        value={tab}
        onChange={setTab}
        options={[
          { key: '상담', label: '상담 센터' },
          { key: '협업', label: '협업 센터' },
        ]}
      />
      <Section title="기본 정보">
        <PhotoPicker />
        <Field label="ID" required>
          <Input value={publicId} onChange={setPublicId} />
        </Field>
        <Field label="이름" required>
          <Input value={name} onChange={setName} />
        </Field>
        <Field label="센터그룹">
          <Select
            value={group}
            onChange={setGroup}
            options={[
              { key: '', label: '선택' },
              { key: '상담그룹', label: '상담그룹' },
              { key: '협업그룹', label: '협업그룹' },
            ]}
          />
        </Field>
        <Field label="설명">
          <Input value={description} onChange={setDescription} />
        </Field>
      </Section>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} disabled={!canSubmit} />
    </ModalShell>
  );
}

/* ---------- Center Operation Tab ---------- */

function CenterOperationTab() {
  const centers = useSettingsStore((s) => s.centers);
  const [centerId, setCenterId] = useState(centers[0]?.id ?? '');
  const center = centers.find((c) => c.id === centerId);
  const [tab, setTab] = useState<'general' | 'talk'>('general');

  const ctx = (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-primarySoft/70 pl-1 pr-1.5 py-0.5 text-xs font-medium text-brand-primary">
      <span className="rounded bg-brand-primary px-1.5 py-0.5 text-[9px] text-white">
        {center?.kind ?? '협업'}
      </span>
      <select
        value={centerId}
        onChange={(e) => setCenterId(e.target.value)}
        className="bg-transparent pr-4 text-xs text-brand-primary focus:outline-none"
        aria-label="센터 선택"
      >
        {centers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </span>
  );

  return (
    <>
      <PageHeader crumbs={['설정', '센터 운영']} contextChip={ctx} />
      <div className="border-b border-surface-border bg-surface-card px-6">
        <div className="flex gap-6">
          <SubTab label="일반" active={tab === 'general'} onClick={() => setTab('general')} />
          <SubTab label="대화" active={tab === 'talk'} onClick={() => setTab('talk')} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-thin">
        {tab === 'general' ? <CenterOperationGeneral /> : <CenterOperationTalk />}
      </div>
    </>
  );
}

function CenterOperationGeneral() {
  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-ink-primary">첨부파일</h2>
      <div className="rounded-lg border border-surface-border bg-surface-card p-5">
        <div className="grid grid-cols-2 gap-8">
          <AttachmentColumn
            title="웹"
            rows={[
              { label: '고객', supportedFiles: 'jpg,jpeg,png,gif,bmp', size: 20 },
              { label: '사용자', supportedFiles: 'jpg,jpeg,png,gif,bmp', size: 20 },
            ]}
          />
          <AttachmentColumn
            title="카카오"
            rows={[
              { label: '고객', supportedFiles: 'jpg,jpeg,png,gif,bmp,pdf', size: 20 },
              { label: '사용자(일반)', supportedFiles: 'pdf,jpg,png', size: 20 },
              { label: '사용자(이미지)', supportedFiles: 'jpg,png', size: 5 },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

interface AttachRow {
  label: string;
  supportedFiles: string;
  size: number;
}

function AttachmentColumn({ title, rows }: { title: string; rows: AttachRow[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-ink-primary">{title}</h3>
      <ul className="space-y-4">
        {rows.map((r, i) => (
          <li key={i} className="space-y-2">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-ink-primary">
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5" />
              {r.label}
            </label>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 text-ink-muted">지원 파일</span>
              <input
                defaultValue={r.supportedFiles}
                className="flex-1 rounded-md border border-surface-border bg-surface-subtle px-2 py-1.5"
              />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="w-16 text-ink-muted">최대사이즈</span>
              <input
                type="number"
                defaultValue={r.size}
                className="w-20 rounded-md border border-surface-border bg-surface-subtle px-2 py-1.5"
              />
              <span className="text-[11px] text-ink-muted">
                MB 이하 (최대 50MB)
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CenterOperationTalk() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-ink-primary">비즈폼</h2>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-ink-secondary hover:text-brand-primary"
          >
            <Zap className="h-3 w-3" />
            첨부파일 설정
          </button>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md bg-brand-primary px-4 text-xs font-medium text-white hover:bg-brand-primaryHover"
        >
          등록
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-surface-border bg-surface-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-subtle/80 text-[11px] font-medium text-ink-secondary">
            <tr>
              <Th className="w-[15%]">단계</Th>
              <Th className="w-[55%]">이름</Th>
              <Th className="w-[30%]">사용여부</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="px-3 py-16 text-center text-xs text-ink-muted">
                데이터가 존재하지 않습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SubTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 py-2.5 text-sm transition-colors',
        active
          ? 'border-brand-primary font-semibold text-brand-primary'
          : 'border-transparent text-ink-secondary hover:text-ink-primary'
      )}
    >
      {label}
    </button>
  );
}

/* ---------- Internal Users Tab ---------- */

function InternalUsersTab() {
  const internalUsers = useSettingsStore((s) => s.internalUsers);
  const [open, setOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState<string>('all');

  const teamGroups = useTeamGroups(internalUsers);
  const filtered =
    activeTeam === 'all'
      ? internalUsers
      : internalUsers.filter((u) => u.team === activeTeam);

  return (
    <>
      <PageHeader
        crumbs={['설정', '내부 사용자']}
        right={<RegisterPrimaryButton onClick={() => setOpen(true)} />}
      />
      <div className="grid min-h-0 flex-1 grid-cols-[220px_1fr] gap-4 p-4">
        <aside className="rounded-lg border border-surface-border bg-surface-subtle/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTeam('all')}
              className={cn(
                'text-sm transition-colors',
                activeTeam === 'all'
                  ? 'font-semibold text-ink-primary'
                  : 'text-ink-secondary hover:text-ink-primary'
              )}
            >
              전체
            </button>
            <button
              type="button"
              aria-label="팀 추가"
              className="grid h-5 w-5 place-items-center rounded text-ink-muted hover:bg-surface-card"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="space-y-0.5 text-xs">
            {teamGroups.map((g) => (
              <li key={g.name}>
                <button
                  type="button"
                  onClick={() => setActiveTeam(g.name)}
                  className={cn(
                    'flex w-full items-center justify-between gap-1 rounded px-2 py-1.5 text-left transition-colors',
                    activeTeam === g.name
                      ? 'bg-brand-primarySoft/60 font-medium text-brand-primary'
                      : 'text-ink-secondary hover:bg-surface-card'
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-ink-muted" />
                    {g.name}
                  </span>
                  <span className="text-[10px] text-ink-muted">{g.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card">
          <div className="flex shrink-0 items-center gap-2 border-b border-surface-border px-3 py-2">
            {['접근 가능 센터', '사용자', '역할'].map((l) => (
              <button
                key={l}
                type="button"
                disabled
                className="inline-flex items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-[11px] text-ink-secondary opacity-70"
              >
                {l} : 전체
                <ChevronDown className="h-3 w-3 text-ink-muted" />
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto scrollbar-thin">
            <table className="w-full min-w-[820px] table-fixed text-left text-xs">
              <colgroup>
                <col className="w-[160px]" />
                <col className="w-[140px]" />
                <col className="w-[80px]" />
                <col className="w-[120px]" />
                <col className="w-[140px]" />
                <col className="w-[200px]" />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-surface-subtle/80 text-[11px] font-medium text-ink-secondary backdrop-blur">
                <tr>
                  <Th>이름 ↑</Th>
                  <Th>ID</Th>
                  <Th>잠금</Th>
                  <Th>역할</Th>
                  <Th>팀</Th>
                  <Th>센터</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-12 text-center text-xs text-ink-muted"
                    >
                      해당 팀에 속한 사용자가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => <InternalUserRow key={u.id} user={u} />)
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {open && <InternalUserRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}

interface TeamGroup {
  name: string;
  count: number;
}

function useTeamGroups(users: InternalUser[]): TeamGroup[] {
  const map = new Map<string, number>();
  for (const u of users) {
    if (!u.team) continue;
    map.set(u.team, (map.get(u.team) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function InternalUserRow({ user }: { user: InternalUser }) {
  return (
    <tr className="border-b border-surface-border/60 hover:bg-surface-subtle/40">
      <RowCell>
        <span className="flex min-w-0 items-center gap-2" title={user.name}>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-primarySoft text-[10px] font-medium text-brand-primary">
            {user.name.slice(-2)}
          </span>
          <span className="min-w-0 flex-1 truncate text-ink-primary">
            {user.name}
          </span>
        </span>
      </RowCell>
      <RowCell tooltip={user.login} className="text-ink-secondary">
        {user.login}
      </RowCell>
      <RowCell className="text-ink-muted">
        {user.locked ? '잠금' : ''}
      </RowCell>
      <RowCell tooltip={user.role} className="text-ink-secondary">
        {user.role}
      </RowCell>
      <RowCell tooltip={user.team}>
        {user.team ? (
          <span className="inline-block max-w-full truncate rounded-full border border-brand-primary/40 bg-white px-2 py-0.5 text-[11px] text-brand-primary align-middle">
            {user.team}
          </span>
        ) : null}
      </RowCell>
      <RowCell tooltip={user.centerLabels.join(', ')}>
        <CenterChips labels={user.centerLabels} />
      </RowCell>
    </tr>
  );
}

function RowCell({
  children,
  className,
  tooltip,
}: {
  children: React.ReactNode;
  className?: string;
  tooltip?: string;
}) {
  return (
    <td className={cn('px-3 py-2.5 align-middle', className)}>
      <div
        className="truncate whitespace-nowrap"
        title={tooltip ?? undefined}
      >
        {children}
      </div>
    </td>
  );
}

function CenterChips({ labels }: { labels: string[] }) {
  if (!labels.length) return null;
  const visible = labels.slice(0, 1);
  const rest = labels.length - visible.length;
  return (
    <span className="inline-flex max-w-full items-center gap-1 align-middle">
      {visible.map((l, i) => (
        <span
          key={i}
          className="inline-block max-w-[140px] truncate rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-ink-secondary align-middle"
        >
          {l}
        </span>
      ))}
      {rest > 0 && (
        <span className="shrink-0 text-[10px] text-ink-muted">+{rest}</span>
      )}
    </span>
  );
}

function InternalUserRegisterModal({ onClose }: { onClose: () => void }) {
  const addInternalUser = useSettingsStore((s) => s.addInternalUser);
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [touched, setTouched] = useState(false);

  const idError = touched && !login.trim() ? '아이디를 입력해 주세요.' : '';
  const pwError = touched && !pw.trim() ? '비밀번호를 입력해 주세요.' : '';
  const pwMatchError =
    touched && pw && pw2 && pw !== pw2 ? '비밀번호가 일치하지 않습니다.' : '';

  const canSubmit = login.trim() && name.trim() && pw.trim() && pw === pw2;

  const onSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;
    addInternalUser({
      login: login.trim(),
      name: name.trim(),
      role: '상담사',
      centerLabels: [],
    });
    onClose();
  };

  return (
    <ModalShell title="내부 사용자" onClose={onClose}>
      <Section title="기본 정보">
        <PhotoPicker />
        <Field label="ID" required error={idError}>
          <Input
            value={login}
            onChange={setLogin}
            placeholder="영어 소문자, 숫자 지원 (최대 20자)"
            error={!!idError}
          />
        </Field>
        <Field label="이름" required>
          <Input
            value={name}
            onChange={setName}
            placeholder="이름을 입력해 주세요. (최대 20자)"
          />
        </Field>
        <Field label="비밀번호" required error={pwError || pwMatchError}>
          <Input
            type="password"
            value={pw}
            onChange={setPw}
            placeholder="새 비밀번호를 입력해 주세요. (최대 20자)"
            error={!!(pwError || pwMatchError)}
          />
        </Field>
        <Field label="비밀번호 확인" required>
          <Input
            type="password"
            value={pw2}
            onChange={setPw2}
            placeholder="새 비밀번호를 다시 한번 입력해 주세요."
          />
        </Field>
      </Section>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} />
    </ModalShell>
  );
}

/* ---------- External Users Tab ---------- */

function ExternalUsersTab() {
  // 메인 사이드바의 ExternalUsersView 그대로 재사용
  return <ExternalUsersView />;
}

/* ---------- User Roles Tab ---------- */

function UserRolesTab() {
  const userRoles = useSettingsStore((s) => s.userRoles);
  const removeUserRole = useSettingsStore((s) => s.removeUserRole);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        crumbs={['설정', '사용자 역할']}
        right={<RegisterPrimaryButton onClick={() => setOpen(true)} />}
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-5 scrollbar-thin">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {userRoles.map((r) => (
            <UserRoleCard
              key={r.id}
              role={r}
              onRemove={() => {
                if (confirm(`'${r.name}' 역할을 삭제하시겠어요?`))
                  removeUserRole(r.id);
              }}
            />
          ))}
        </div>
      </div>
      {open && <UserRoleRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}

function UserRoleCard({
  role,
  onRemove,
}: {
  role: UserRole;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-ink-primary">
            {role.name}
          </h3>
          {role.userCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-ink-muted">
              <Users className="h-3 w-3" />
              {role.userCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-ink-muted">
          <button
            type="button"
            aria-label="편집"
            className="grid h-6 w-6 place-items-center rounded hover:bg-surface-subtle"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="삭제"
            onClick={onRemove}
            className="grid h-6 w-6 place-items-center rounded hover:bg-surface-subtle"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {role.description && (
        <p className="mt-1 text-xs text-ink-secondary">{role.description}</p>
      )}

      {role.screenPermissions.length > 0 && (
        <>
          <div className="mt-4 text-xs font-semibold text-ink-secondary">
            화면 권한
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ink-primary">
            {role.screenPermissions.join('  |  ')}
          </p>
        </>
      )}
      {role.usagePermissions.length > 0 && (
        <>
          <div className="mt-3 text-xs font-semibold text-ink-secondary">
            사용 권한
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ink-primary">
            {role.usagePermissions.join('  |  ')}
          </p>
        </>
      )}
    </div>
  );
}

const SCREEN_PERMS = ['대화', '대화 조회', '지식', '할 일', '외부 사용자'];

function UserRoleRegisterModal({ onClose }: { onClose: () => void }) {
  const addUserRole = useSettingsStore((s) => s.addUserRole);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [perms, setPerms] = useState<Record<string, boolean>>({});
  const [settingsToggle, setSettingsToggle] = useState(false);

  const togglePerm = (k: string) => setPerms((p) => ({ ...p, [k]: !p[k] }));
  const onSubmit = () => {
    if (!name.trim()) return;
    const screenPermissions = SCREEN_PERMS.filter((p) => perms[p]);
    if (settingsToggle) screenPermissions.push('설정');
    addUserRole({
      name: name.trim(),
      description: desc.trim() || undefined,
      screenPermissions,
      usagePermissions: [],
    });
    onClose();
  };

  return (
    <ModalShell title="사용자 역할" onClose={onClose}>
      <Section title="기본 정보">
        <Field label="이름" required>
          <Input value={name} onChange={setName} />
        </Field>
        <Field label="설명">
          <Textarea value={desc} onChange={setDesc} rows={4} />
        </Field>
      </Section>
      <Section title="화면 권한">
        <div className="grid grid-cols-3 gap-y-3 gap-x-4">
          {SCREEN_PERMS.map((p) => (
            <ToggleRow
              key={p}
              label={p}
              value={!!perms[p]}
              onChange={() => togglePerm(p)}
            />
          ))}
        </div>
        <div className="mt-3">
          <ToggleRow
            label="설정"
            value={settingsToggle}
            onChange={() => setSettingsToggle((v) => !v)}
            hasDropdown
          />
        </div>
      </Section>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} disabled={!name.trim()} />
    </ModalShell>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  hasDropdown,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
  hasDropdown?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        hasDropdown &&
          'rounded-md border border-surface-border bg-white px-3 py-2'
      )}
    >
      <button
        type="button"
        onClick={onChange}
        aria-pressed={value}
        className={cn(
          'inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
          value ? 'bg-brand-primary' : 'bg-ink-subtle'
        )}
      >
        <span
          className={cn(
            'block h-4 w-4 rounded-full bg-white shadow transition-transform',
            value ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
        />
      </button>
      <span className="text-xs text-ink-primary">{label}</span>
      {hasDropdown && <ChevronDown className="ml-auto h-3 w-3 text-ink-muted" />}
    </div>
  );
}

/* ---------- App Channels Tab ---------- */

function AppChannelsTab() {
  const appChannels = useSettingsStore((s) => s.appChannels);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        crumbs={['설정', 'APP 채널']}
        right={<RegisterPrimaryButton onClick={() => setOpen(true)} />}
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-5 scrollbar-thin">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {appChannels.map((a) => (
            <AppChannelCard key={a.id} channel={a} />
          ))}
        </div>
      </div>
      {open && <AppChannelRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}

function AppChannelCard({ channel }: { channel: AppChannel }) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <AppChannelIcon kind={channel.kind} />
        <span className="truncate text-sm font-medium text-ink-primary" title={channel.name}>
          {channel.name}
        </span>
      </div>
      <p
        className="mt-2 truncate text-xs text-ink-secondary"
        title={channel.publicId}
      >
        ID: {channel.publicId.length > 20 ? `${channel.publicId.slice(0, 20)}...` : channel.publicId}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        {channel.centers.slice(0, 1).map((c, i) => (
          <span
            key={i}
            className="inline-flex max-w-[120px] truncate rounded bg-surface-subtle px-1.5 py-0.5 text-[10px] text-ink-secondary"
          >
            {c}
          </span>
        ))}
        {channel.centers.length > 1 && (
          <span className="text-[10px] text-ink-muted">
            +{channel.centers.length - 1}
          </span>
        )}
      </div>
    </div>
  );
}

function AppChannelIcon({ kind }: { kind: AppChannelKind }) {
  const base =
    'grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-md font-semibold';
  if (kind === 'pc') {
    return (
      <span className={cn(base, 'bg-surface-subtle text-[10px] text-ink-secondary')}>
        PC
      </span>
    );
  }
  if (kind === 'kakao') {
    return (
      <span className={cn(base, 'bg-yellow-300 text-[9px] text-yellow-900')}>
        TALK
      </span>
    );
  }
  if (kind === 'collab') {
    return (
      <span className={cn(base, 'bg-brand-primarySoft text-[10px] text-brand-primary')}>
        협업
      </span>
    );
  }
  return (
    <span className={cn(base, 'bg-orange-100 text-[10px] text-orange-700')}>
      SP
    </span>
  );
}

function AppChannelRegisterModal({ onClose }: { onClose: () => void }) {
  const addAppChannel = useSettingsStore((s) => s.addAppChannel);
  const [tab, setTab] = useState<AppChannelService>('상담');
  const [name, setName] = useState('');
  const [publicId, setPublicId] = useState('');
  const [kind, setKind] = useState<AppChannelKind>('pc');

  const canSubmit = name.trim() && publicId.trim();
  const onSubmit = () => {
    if (!canSubmit) return;
    addAppChannel({
      name: name.trim(),
      publicId: publicId.trim(),
      kind,
      service: tab,
      centers: [],
    });
    onClose();
  };

  return (
    <ModalShell title="APP 채널" onClose={onClose}>
      <KindTabs
        value={tab}
        onChange={setTab}
        options={[
          { key: '상담', label: '상담' },
          { key: '협업', label: '협업' },
        ]}
      />
      <Section title="기본 정보">
        <PhotoPicker />
        <Field label="이름" required>
          <Input value={name} onChange={setName} />
        </Field>
        <Field label="ID" required>
          <Input value={publicId} onChange={setPublicId} />
        </Field>
        <Field label="유형" required>
          <Select
            value={kind}
            onChange={(v) => setKind(v as AppChannelKind)}
            options={[
              { key: 'pc', label: '웹' },
              { key: 'kakao', label: '카카오' },
              { key: 'collab', label: '협업용 게스트존' },
              { key: 'spectra', label: 'Spectra' },
            ]}
          />
        </Field>
      </Section>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} disabled={!canSubmit} />
    </ModalShell>
  );
}

/* ---------- Security Tab ---------- */

function SecurityTab() {
  const security = useSettingsStore((s) => s.security);
  const update = useSettingsStore((s) => s.updateSecurity);

  return (
    <>
      <PageHeader crumbs={['설정', '보안']} />
      <div className="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="mb-3 text-right text-xs text-ink-muted">
          접속가능IP : <span className="text-ink-primary">{security.accessIp}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <PasswordRulesCard security={security} update={update} />
          <div className="space-y-4">
            <PasswordIntervalCard security={security} update={update} />
            <UserAccessCard security={security} update={update} />
          </div>
        </div>
      </div>
    </>
  );
}

function PasswordRulesCard({
  security,
  update,
}: {
  security: SecurityPolicy;
  update: (patch: Partial<SecurityPolicy>) => void;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5">
      <h2 className="mb-4 text-base font-semibold text-ink-primary">비밀번호 작성규칙</h2>
      <div className="space-y-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-12 text-ink-muted">최소</span>
          <select
            value={security.passwordMinLen}
            onChange={(e) => update({ passwordMinLen: Number(e.target.value) })}
            className="h-8 rounded-md border border-surface-border bg-white px-2"
          >
            {[1, 4, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-ink-secondary">자 이상 (최대 20자)</span>
        </div>
        <div className="flex items-center gap-4">
          <Check
            label="영문"
            value={security.requireAlpha}
            onChange={(v) => update({ requireAlpha: v })}
          />
          <Check
            label="숫자"
            value={security.requireDigit}
            onChange={(v) => update({ requireDigit: v })}
          />
          <Check
            label="특수문자"
            value={security.requireSpecial}
            onChange={(v) => update({ requireSpecial: v })}
          />
        </div>
        <NumberRule
          enabled={security.blockRepeatedChars}
          onToggle={(v) => update({ blockRepeatedChars: v })}
          value={security.repeatedCharLimit}
          onChange={(n) => update({ repeatedCharLimit: n })}
          options={[2, 3, 4, 5]}
          label="번 이상 동일한 문자 제한"
        />
        <NumberRule
          enabled={security.blockSequential}
          onToggle={(v) => update({ blockSequential: v })}
          value={security.sequentialLimit}
          onChange={(n) => update({ sequentialLimit: n })}
          options={[3, 4, 5, 6]}
          label="번 이상 연속된 숫자/영문 제한"
        />
        <Check
          label="아이디를 포함하는 비밀번호 제한"
          value={security.blockIdInPassword}
          onChange={(v) => update({ blockIdInPassword: v })}
        />
        <Check
          label="비밀번호 변경 시 현재 비밀번호 제한"
          value={security.blockCurrentInChange}
          onChange={(v) => update({ blockCurrentInChange: v })}
        />
      </div>
    </div>
  );
}

function PasswordIntervalCard({
  security,
  update,
}: {
  security: SecurityPolicy;
  update: (patch: Partial<SecurityPolicy>) => void;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5">
      <h2 className="mb-4 text-base font-semibold text-ink-primary">비밀번호 변경주기</h2>
      <div className="space-y-3 text-xs">
        <Check
          label="최초 로그인 시 비밀번호 변경 필요"
          value={security.forceChangeOnFirstLogin}
          onChange={(v) => update({ forceChangeOnFirstLogin: v })}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={security.changeIntervalEnabled}
            onChange={(e) => update({ changeIntervalEnabled: e.target.checked })}
            className="h-3.5 w-3.5"
          />
          <select
            value={security.changeIntervalMonths}
            onChange={(e) =>
              update({ changeIntervalMonths: Number(e.target.value) })
            }
            disabled={!security.changeIntervalEnabled}
            className="h-7 rounded-md border border-surface-border bg-white px-2 disabled:opacity-50"
          >
            {[1, 3, 6, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-ink-secondary">개월마다 비밀번호 변경 필요</span>
        </div>
      </div>
    </div>
  );
}

function UserAccessCard({
  security,
  update,
}: {
  security: SecurityPolicy;
  update: (patch: Partial<SecurityPolicy>) => void;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5">
      <h2 className="mb-4 text-base font-semibold text-ink-primary">사용자</h2>
      <div className="space-y-3 text-xs">
        <NumberRule
          enabled={security.inactiveLockEnabled}
          onToggle={(v) => update({ inactiveLockEnabled: v })}
          value={security.inactiveLockDays}
          onChange={(n) => update({ inactiveLockDays: n })}
          options={[10, 20, 30, 60]}
          label="일 미 접속 시 계정 잠금"
        />
        <NumberRule
          enabled={security.failedAttemptLockEnabled}
          onToggle={(v) => update({ failedAttemptLockEnabled: v })}
          value={security.failedAttemptLimit}
          onChange={(n) => update({ failedAttemptLimit: n })}
          options={[3, 5, 10]}
          label="번 연속 로그인 실패 시 계정 잠금"
        />
        <NumberRule
          enabled={security.autoLogoutEnabled}
          onToggle={(v) => update({ autoLogoutEnabled: v })}
          value={security.autoLogoutMinutes}
          onChange={(n) => update({ autoLogoutMinutes: n })}
          options={[10, 30, 60, 120]}
          label="분 경과 후 자동 로그아웃"
        />
        <div className="flex items-center gap-2">
          <Check
            label="중복 로그인 허용"
            value={security.allowConcurrentLogin}
            onChange={(v) => update({ allowConcurrentLogin: v })}
          />
          <HelpCircle className="h-3 w-3 text-ink-muted" />
        </div>
      </div>
    </div>
  );
}

function NumberRule({
  enabled,
  onToggle,
  value,
  onChange,
  options,
  label,
}: {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  value: number;
  onChange: (n: number) => void;
  options: number[];
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-3.5 w-3.5"
      />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={!enabled}
        className="h-7 rounded-md border border-surface-border bg-white px-2 disabled:opacity-50"
      >
        {options.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <span className="text-ink-secondary">{label}</span>
    </div>
  );
}

function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-ink-primary">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5"
      />
      <span>{label}</span>
    </label>
  );
}

/* ---------- License Tab ---------- */

function LicenseTab() {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard?.writeText('cowork-license-mock-key');
    } catch {
      /* noop */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <PageHeader crumbs={['설정', '라이선스']} />
      <div className="min-h-0 flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 text-xs text-ink-secondary hover:text-brand-primary"
          >
            <Copy className="h-3 w-3" />
            {copied ? '복사됨' : '라이선스 키 복사'}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <LicenseCard title="Platform">
            <LicenseField label="Product" value="Cowork+" />
            <LicenseField label="Version" value="1.0" />
            <LicenseField label="Service" value="상담  |  협업" />
          </LicenseCard>
          <LicenseCard title="Adapter">
            <LicenseField label="App Channel" value="웹  |  카카오" />
          </LicenseCard>
          <LicenseCard title="Center & User">
            <LicenseField label="센터 수" value="100" />
            <LicenseField label="동시 접속 내부 사용자 수" value="1000" />
          </LicenseCard>
        </div>
      </div>
    </>
  );
}

function LicenseCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card p-5 shadow-soft">
      <h2 className="mb-3 text-lg font-semibold text-ink-primary">{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
}

function LicenseField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-ink-secondary">{label}</div>
      <div className="mt-0.5 text-ink-primary">{value}</div>
    </div>
  );
}

/* ---------- Custom Fields Tab ---------- */

function CustomFieldsTab() {
  const customFields = useSettingsStore((s) => s.customFields);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        crumbs={['설정', '커스텀 필드']}
        right={<RegisterPrimaryButton onClick={() => setOpen(true)} />}
      />
      <div className="min-h-0 flex-1 overflow-y-auto p-5 scrollbar-thin">
        <div className="border-b border-surface-border">
          <button
            type="button"
            className="border-b-2 border-brand-primary py-2.5 text-sm font-semibold text-brand-primary"
          >
            외부 사용자
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-surface-border bg-surface-card">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-subtle/80 text-[11px] font-medium text-ink-secondary">
              <tr>
                <Th className="w-[20%]">Key</Th>
                <Th className="w-[20%]">Label</Th>
                <Th className="w-[60%]">설명</Th>
              </tr>
            </thead>
            <tbody>
              {customFields.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-16 text-center text-xs text-ink-muted"
                  >
                    데이터가 존재하지 않습니다.
                  </td>
                </tr>
              ) : (
                customFields.map((cf) => (
                  <tr
                    key={cf.id}
                    className="border-b border-surface-border/60 hover:bg-surface-subtle/40"
                  >
                    <td className="px-3 py-2.5 text-ink-primary">{cf.key}</td>
                    <td className="px-3 py-2.5 text-ink-primary">
                      {cf.label}
                      {cf.required && (
                        <span className="ml-1 text-rose-500">*</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-ink-secondary">
                      {cf.description ?? ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {open && <CustomFieldRegisterModal onClose={() => setOpen(false)} />}
    </>
  );
}

function CustomFieldRegisterModal({ onClose }: { onClose: () => void }) {
  const add = useSettingsStore((s) => s.addCustomField);
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [fieldType, setFieldType] = useState<CustomFieldType>('단문입력');
  const [helper, setHelper] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = key.trim() && label.trim();
  const onSubmit = () => {
    if (!canSubmit) return;
    add({
      key: key.trim(),
      label: label.trim(),
      required,
      fieldType,
      helper: helper.trim() || undefined,
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <ModalShell title="커스텀 필드 등록" onClose={onClose}>
      <div className="px-5 py-4">
        <Field label="Key" required>
          <Input
            value={key}
            onChange={setKey}
            placeholder="영어 대/소문자, 숫자 지원 (최대 20자)"
          />
        </Field>
        <Field label="Label" required>
          <Input
            value={label}
            onChange={setLabel}
            placeholder="Label을 입력해 주세요. (최대 20자)"
          />
        </Field>
        <div className="mt-3">
          <div className="mb-1 text-[11px] font-medium text-ink-secondary">
            필수여부
          </div>
          <ToggleRow label="" value={required} onChange={() => setRequired((v) => !v)} />
        </div>
        <Field label="문항" required>
          <Select
            value={fieldType}
            onChange={(v) => setFieldType(v as CustomFieldType)}
            options={[
              { key: '단문입력', label: '단문입력' },
              { key: '장문입력', label: '장문입력' },
              { key: '숫자', label: '숫자' },
              { key: '선택', label: '선택' },
            ]}
          />
        </Field>
        <Field label="입력도움말">
          <Input
            value={helper}
            onChange={setHelper}
            placeholder="입력도움말을 입력해 주세요. (최대 20자)"
          />
        </Field>
        <Field label="설명">
          <Input
            value={description}
            onChange={setDescription}
            placeholder="설명을 입력해 주세요. (최대 20자)"
          />
        </Field>
      </div>
      <ModalFooter onCancel={onClose} onSubmit={onSubmit} disabled={!canSubmit} />
    </ModalShell>
  );
}

/* ---------- Modal primitives ---------- */

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[88%] w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-surface-card shadow-elev"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-surface-border px-5 py-4">
          <h2 className="text-base font-semibold text-ink-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="grid h-7 w-7 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onSubmit,
  disabled,
  submitLabel = '등록하기',
}: {
  onCancel: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitLabel?: string;
}) {
  return (
    <footer className="grid shrink-0 grid-cols-2 items-center gap-3 border-t border-surface-border bg-surface-card px-5 py-4">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex h-10 items-center justify-center rounded-md text-sm text-ink-primary hover:bg-surface-subtle"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-brand-primary text-sm font-semibold text-white hover:bg-brand-primaryHover',
          disabled && 'opacity-50'
        )}
      >
        {submitLabel}
      </button>
    </footer>
  );
}

function KindTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { key: T; label: string }[];
}) {
  return (
    <div className="border-b border-surface-border px-5">
      <div className="grid grid-cols-2">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={cn(
              'border-b-2 py-3 text-sm transition-colors',
              value === o.key
                ? 'border-brand-primary font-semibold text-brand-primary'
                : 'border-transparent text-ink-secondary hover:text-ink-primary'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-4">
      <h3 className="mb-3 text-sm font-semibold text-ink-primary">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function PhotoPicker() {
  return (
    <div className="flex justify-center py-3">
      <button
        type="button"
        className="grid h-20 w-20 place-items-center rounded-full border border-dashed border-surface-border bg-surface-subtle/40 text-ink-muted hover:border-brand-primary/60"
        aria-label="사진 선택"
      >
        <ImagePlus className="h-5 w-5" />
        <span className="mt-1 text-[10px]">사진선택</span>
      </button>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-primary">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-rose-500">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'h-10 w-full rounded-md border bg-surface-canvas px-3 text-sm focus:outline-none',
        error
          ? 'border-rose-400 focus:border-rose-500'
          : 'border-surface-border focus:border-brand-primary'
      )}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-md border border-surface-border bg-surface-canvas px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { key: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-sm focus:border-brand-primary focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// 사용 안 하는 import 경고 회피 — 디자인 hint 용
const _unused = { MessageSquare, Smartphone };
void _unused;

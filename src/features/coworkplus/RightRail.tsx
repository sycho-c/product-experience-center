import {
  CheckCircle2,
  ChevronUp,
  Circle,
  Clock,
  Crown,
  FileText,
  History,
  Mail,
  UserPlus2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUISimStore } from '@/features/ui-simulation/store';
import {
  useTaskStore,
  type DomainTask,
  type TaskStatus,
} from '@/features/domain/tasks/store';
import {
  useBizFormStore,
  type BizForm,
} from '@/features/domain/bizforms/store';
import { cn } from '@/lib/utils';

interface RightRailProps {
  dim?: boolean;
}

export function RightRail({ dim = false }: RightRailProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-[240px] min-w-[220px] shrink-0 flex-col gap-3 overflow-y-auto scrollbar-thin border-l border-surface-border bg-surface-canvas p-3',
        dim && 'opacity-50 pointer-events-none'
      )}
    >
      <TodoPanel />
      <ParticipantsPanel />
      <HistoryPanel />
      <BizFormPanel />
    </aside>
  );
}

function CollapsiblePanel({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
          {count !== undefined && (
            <span className="text-xs text-ink-muted">{count}</span>
          )}
        </div>
        <ChevronUp className="h-4 w-4 text-ink-muted" />
      </header>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

const EMPTY_TASKS: DomainTask[] = [];

function statusBadgeVariant(status: TaskStatus | DomainTask['status']) {
  switch (status) {
    case '진행중':
      return 'brand' as const;
    case '검토중':
      return 'warning' as const;
    case '완료':
      return 'neutral' as const;
    default:
      return 'neutral' as const;
  }
}

function TodoPanel() {
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const tasks = useTaskStore((s) =>
    currentRoomId ? (s.tasksByRoom[currentRoomId] ?? EMPTY_TASKS) : EMPTY_TASKS
  );
  return (
    <CollapsiblePanel
      title="할 일"
      icon={<CheckCircle2 className="h-4 w-4 text-brand-primary" />}
      count={tasks.length}
    >
      <div className="grid grid-cols-2 gap-2">
        <FilterDropdown label="상태 :" value="전체" />
        <FilterDropdown label="담당자 :" value="전체" />
      </div>
      {tasks.length === 0 ? (
        <p className="mt-3 text-xs text-ink-muted">등록된 할 일이 없습니다.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-start gap-2 rounded-md border border-surface-border bg-surface-card px-2.5 py-2"
            >
              <Circle className="mt-0.5 h-3.5 w-3.5 text-ink-muted" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-ink-primary">
                  {t.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
                  {t.assignee && <span>{t.assignee}</span>}
                  {t.assignee && t.dueDate && <span>·</span>}
                  {t.dueDate && <span>{t.dueDate}</span>}
                </div>
              </div>
              <Badge variant={statusBadgeVariant(t.status)} className="shrink-0">
                {t.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </CollapsiblePanel>
  );
}

const EMPTY_PARTICIPANTS: never[] = [];

function ParticipantsPanel() {
  const participants = useUISimStore((s) =>
    s.currentRoomId
      ? (s.participants[s.currentRoomId] ?? EMPTY_PARTICIPANTS)
      : EMPTY_PARTICIPANTS
  );
  const internal = participants
    .filter((p) => !p.external)
    .map((p) => ({ name: p.displayName, host: !!p.isHost }));
  const external = participants
    .filter((p) => p.external)
    .map((p) => ({ name: p.displayName }));
  if (internal.length === 0 && external.length === 0) {
    internal.push({ name: '승열', host: true });
  }
  return (
    <CollapsiblePanel
      title="참여자 정보"
      icon={<UserPlus2 className="h-4 w-4 text-brand-primary" />}
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Mail className="mr-1 h-3.5 w-3.5" />
          초대장 전송 현황
        </Button>
        <Button size="sm">초대 링크</Button>
      </div>
      <div className="mt-3 rounded-md border border-surface-border bg-surface-card p-3">
        <div className="text-xs font-semibold text-ink-secondary">
          외부 사용자
        </div>
        {external.length === 0 ? (
          <p className="mt-1 text-xs text-ink-muted">
            현재 참여중인 외부 사용자가 없습니다.
          </p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {external.map((u) => (
              <li
                key={u.name}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800"
              >
                {u.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-2 rounded-md border border-surface-border bg-surface-card p-3">
        <div className="flex items-center gap-1 text-xs font-semibold text-ink-secondary">
          내부 사용자
          <span className="text-ink-muted font-normal">{internal.length}</span>
        </div>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {internal.map((u) => (
            <li
              key={u.name}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-primarySoft px-2 py-1 text-xs"
            >
              <span className="font-medium text-ink-primary">{u.name}</span>
              {u.host && <Crown className="h-3 w-3 text-brand-primary" />}
            </li>
          ))}
        </ul>
      </div>
    </CollapsiblePanel>
  );
}

function HistoryPanel() {
  const items = [
    { time: '13:59', label: '대화방 생성', actor: '시스템' },
    { time: '14:02', label: '비즈폼 첨부', actor: '김지현 과장' },
  ];
  return (
    <CollapsiblePanel
      title="대화 이력"
      icon={<History className="h-4 w-4 text-brand-primary" />}
    >
      {items.length === 0 ? (
        <p className="text-xs text-ink-muted">표시할 대화 이력이 없습니다.</p>
      ) : (
        <ol className="space-y-2 text-xs text-ink-secondary">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 text-ink-muted" />
              <div>
                <span className="text-ink-primary">{it.label}</span>
                <span className="ml-1 text-ink-muted">· {it.actor}</span>
                <span className="ml-1 text-ink-muted">{it.time}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </CollapsiblePanel>
  );
}

const EMPTY_BIZFORMS: BizForm[] = [];

function BizFormPanel() {
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const forms = useBizFormStore((s) =>
    currentRoomId ? (s.bizformsByRoom[currentRoomId] ?? EMPTY_BIZFORMS) : EMPTY_BIZFORMS
  );
  const approve = useBizFormStore((s) => s.approve);
  const reject = useBizFormStore((s) => s.reject);
  return (
    <CollapsiblePanel
      title="비즈폼"
      icon={<FileText className="h-4 w-4 text-brand-primary" />}
      count={forms.length}
    >
      {forms.length === 0 ? (
        <p className="text-xs text-ink-muted">첨부된 비즈폼이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {forms.map((f) => (
            <li
              key={f.id}
              className="rounded-md border border-surface-border bg-surface-card p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-primary">
                  {f.title}
                </span>
                <Badge
                  variant={
                    f.status === '승인됨'
                      ? 'brand'
                      : f.status === '반려됨'
                        ? 'warning'
                        : 'neutral'
                  }
                  className="ml-auto"
                >
                  {f.status}
                </Badge>
              </div>
              <dl className="mt-2 space-y-1 text-[11px]">
                {f.fields.map((row) => (
                  <div key={row.id} className="flex justify-between gap-2">
                    <dt className="text-ink-muted">{row.label}</dt>
                    <dd className="truncate font-medium text-ink-primary">
                      {row.value ?? '-'}
                    </dd>
                  </div>
                ))}
              </dl>
              {f.status === '진행중' && (
                <div className="mt-3 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => approve(f.id)}
                  >
                    승인
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => reject(f.id)}
                  >
                    반려
                  </Button>
                </div>
              )}
              {f.status === '반려됨' && f.reason && (
                <p className="mt-2 text-[11px] text-ink-muted">
                  반려 사유 — {f.reason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </CollapsiblePanel>
  );
}

function FilterDropdown({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex items-center justify-between rounded-md border border-surface-border bg-surface-card px-2.5 py-1.5 text-xs text-ink-secondary hover:bg-surface-subtle">
      <span>
        {label} <span className="font-medium text-ink-primary">{value}</span>
      </span>
      <span className="ml-1 text-ink-muted">▾</span>
    </button>
  );
}

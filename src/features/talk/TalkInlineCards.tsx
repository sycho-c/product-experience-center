import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Link2,
  Mail,
  UserPlus2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileExtBadge } from './FileExtBadge';
import { cn } from '@/lib/utils';
import type { Talk, TalkAction, TalkAttachment } from '@/types/talk';

interface TalkInlineCardsProps {
  talk: Talk;
  isMe: boolean;
  /** 메시지 시간 — 마지막 첨부 row 에 노출되며 그룹의 마지막이 아닌 경우 invisible 처리 */
  time?: string;
  /** 그룹(같은 발신자 + 같은 분) 의 마지막 메시지일 때만 시간 visible */
  isLastInGroup?: boolean;
}

export function TalkInlineCards({
  talk,
  isMe,
  time,
  isLastInGroup = true,
}: TalkInlineCardsProps) {
  const cards: React.ReactNode[] = [];

  if (talk.type === 'bizform' || talk.action?.type === 'ATTACH_BIZFORM') {
    cards.push(<BizFormCard key="bizform" talk={talk} />);
  }
  if (talk.type === 'task_link' || talk.action?.type === 'CREATE_TASK') {
    cards.push(<TaskCard key="task" action={talk.action} />);
  }
  if (
    talk.type === 'knowledge_link' ||
    talk.action?.type === 'ATTACH_KNOWLEDGE'
  ) {
    cards.push(<KnowledgeCard key="knowledge" />);
  }
  if (
    talk.type === 'file_transfer' ||
    talk.action?.type === 'ATTACH_FILE' ||
    (talk.attachments?.length ?? 0) > 0
  ) {
    cards.push(
      <FileCards
        key="file"
        talk={talk}
        isMe={isMe}
        time={time}
        isLastInGroup={isLastInGroup}
      />
    );
  }
  if (talk.type === 'invite' || talk.action?.type === 'INVITE_EXTERNAL') {
    cards.push(<InviteCard key="invite" action={talk.action} />);
  }
  if (
    talk.type === 'approval_request' ||
    talk.type === 'approval_result' ||
    talk.action?.type === 'UPDATE_STATUS'
  ) {
    cards.push(<ApprovalCard key="approval" talk={talk} />);
  }

  if (cards.length === 0) return null;

  return (
    <div className={`mt-1.5 flex flex-col gap-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
      {cards}
    </div>
  );
}

function BizFormCard({ talk }: { talk: Talk }) {
  const action = talk.action;
  const data =
    action?.type === 'ATTACH_BIZFORM'
      ? action.data
      : ({} as Record<string, unknown>);
  return (
    <div className="w-[260px] rounded-lg border border-brand-primary/30 bg-brand-primarySoft/40 p-3 shadow-soft">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-brand-primary" />
        <span className="text-xs font-semibold text-ink-primary">
          비즈폼: {String(data.title ?? '계약 승인 요청')}
        </span>
        <Badge variant="brand" className="ml-auto">
          진행중
        </Badge>
      </div>
      <dl className="mt-2 space-y-0.5 text-[11px]">
        <Row label="문서 ID" value={String(data.id ?? 'BF-2024-0421')} />
        <Row
          label="대상"
          value={String(data.target ?? '계약 H2024-00012345')}
        />
      </dl>
      <div className="mt-2.5 flex items-center gap-1.5">
        <Button size="sm" className="flex-1">
          확인
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          반려
        </Button>
      </div>
    </div>
  );
}

function TaskCard({ action }: { action?: TalkAction }) {
  const payload = action?.type === 'CREATE_TASK' ? action.payload : null;
  return (
    <div className="w-[240px] rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-semibold text-ink-primary">
          할 일 생성됨
        </span>
      </div>
      <p className="mt-1.5 text-xs text-ink-primary">
        {payload?.title ?? '신규 할 일'}
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-muted">
        {payload?.assignee && <span>@{payload.assignee}</span>}
        {payload?.dueDate && <span>· {payload.dueDate}</span>}
      </div>
    </div>
  );
}

function KnowledgeCard() {
  return (
    <div className="w-[260px] rounded-lg border border-amber-200 bg-amber-50/60 p-3">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-amber-700" />
        <span className="text-xs font-semibold text-ink-primary">
          지식 카드
        </span>
        <ExternalLink className="ml-auto h-3 w-3 text-ink-muted" />
      </div>
      <p className="mt-1.5 text-xs font-medium text-ink-primary">
        계약 변경 절차 안내
      </p>
      <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-secondary leading-relaxed">
        고객 정보 변경 요청 시 본인 확인 후 변경 처리합니다…
      </p>
    </div>
  );
}

function FileCards({
  talk,
  isMe,
  time,
  isLastInGroup,
}: {
  talk: Talk;
  isMe: boolean;
  time?: string;
  isLastInGroup: boolean;
}) {
  const files: TalkAttachment[] = talk.attachments?.length
    ? talk.attachments
    : [{ name: '추가_특약_조건_상세.xlsx', size: 24_576 }];
  return (
    <>
      {files.map((file, i) => {
        const isLastFile = i === files.length - 1;
        const showTime = !!time && isLastInGroup && isLastFile;
        return (
          <div
            key={`${talk.id}-file-${i}`}
            className={cn(
              'flex items-end gap-1.5',
              isMe ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <FileCardSingle file={file} />
            {time && (
              <span
                className={cn(
                  'shrink-0 pb-0.5 text-[10px] text-ink-muted',
                  !showTime && 'invisible'
                )}
              >
                {time}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}

function FileCardSingle({ file }: { file: TalkAttachment }) {
  const isImage =
    file.mime?.startsWith('image/') ||
    /\.(png|jpe?g|gif|svg|webp)$/i.test(file.name);
  if (isImage && file.url) {
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        title={file.name}
        className="block w-[180px] overflow-hidden rounded-lg border border-surface-border bg-surface-canvas shadow-soft hover:border-brand-primary"
      >
        <img
          src={file.url}
          alt={file.name}
          className="block max-h-[120px] w-full object-cover"
        />
      </a>
    );
  }
  return (
    <div className="flex w-[260px] items-center gap-2.5 rounded-lg border border-surface-border bg-surface-card p-2.5">
      <FileExtBadge name={file.name} />
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-xs font-medium text-ink-primary"
          title={file.name}
        >
          {file.name}
        </div>
        <div className="text-[11px] text-ink-muted">
          {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
        </div>
      </div>
      <button className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle">
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function InviteCard({ action }: { action?: TalkAction }) {
  const link =
    action?.type === 'INVITE_EXTERNAL'
      ? action.link
      : 'https://cowork.example/invite/abc123';
  const email = action?.type === 'INVITE_EXTERNAL' ? action.email : undefined;
  return (
    <div className="w-[260px] rounded-lg border border-blue-200 bg-blue-50/60 p-3">
      <div className="flex items-center gap-2">
        <UserPlus2 className="h-4 w-4 text-blue-700" />
        <span className="text-xs font-semibold text-ink-primary">
          외부 사용자 초대
        </span>
      </div>
      <div className="mt-1.5 space-y-0.5 text-[11px]">
        {email && (
          <div className="flex items-center gap-1 text-ink-secondary">
            <Mail className="h-3 w-3" />
            {email}
          </div>
        )}
        <div className="truncate text-ink-muted">{link}</div>
      </div>
    </div>
  );
}

function ApprovalCard({ talk }: { talk: Talk }) {
  const isResult = talk.type === 'approval_result';
  const value =
    talk.action?.type === 'UPDATE_STATUS' ? talk.action.value : undefined;
  return (
    <div className="w-[260px] rounded-lg border border-violet-200 bg-violet-50/50 p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-violet-700" />
        <span className="text-xs font-semibold text-ink-primary">
          {isResult ? '승인 결과' : '승인 요청'}
        </span>
        {value && (
          <Badge variant="brand" className="ml-auto">
            {value}
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-ink-secondary">
        {isResult
          ? '담당자가 검토를 완료했습니다.'
          : '담당자에게 승인 요청이 전달되었습니다.'}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="truncate font-medium text-ink-primary">{value}</dd>
    </div>
  );
}

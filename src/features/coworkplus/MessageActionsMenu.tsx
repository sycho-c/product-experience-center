import { useEffect, useRef, useState } from 'react';
import { CheckSquare, Forward, MoreHorizontal, Reply } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { useTaskStore } from '@/features/domain/tasks/store';
import { MockModal } from '@/components/MockModal';
import type { Talk } from '@/types/talk';
import { cn } from '@/lib/utils';

interface MessageActionsMenuProps {
  talk: Talk;
  isMe: boolean;
}

let _taskSeq = 0;
function genTaskId(): string {
  _taskSeq += 1;
  return `chip_task_${Date.now()}_${_taskSeq}`;
}

/**
 * 메시지 hover 시 노출되는 ≡ 액션 메뉴.
 * - 할 일 등록: 메시지 본문을 제목으로 하는 task chip 부착 + 도메인 task 등록
 * - 답글 / 공유: placeholder
 */
export function MessageActionsMenu({ talk, isMe }: MessageActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [mock, setMock] = useState<'reply' | 'forward' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const patchTalk = useUISimStore((s) => s.patchTalk);
  const addTask = useTaskStore((s) => s.addTask);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const onAttachTask = () => {
    setOpen(false);
    if (!currentRoomId || talk.taskChip) return;
    const taskId = genTaskId();
    const title = talk.content.length > 30 ? talk.content.slice(0, 30) + '…' : talk.content;
    patchTalk(currentRoomId, talk.id, {
      taskChip: { taskId, title, status: '처리중' },
    });
    addTask({
      id: taskId,
      roomId: currentRoomId,
      title,
      status: '진행중',
      sourceMessageId: talk.id,
    });
  };

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-1/2 -translate-y-1/2',
        isMe ? 'right-full mr-1' : 'left-full ml-1'
      )}
    >
      <button
        type="button"
        aria-label="메시지 액션"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'grid h-6 w-6 place-items-center rounded text-ink-muted transition-opacity',
          open
            ? 'bg-surface-subtle opacity-100'
            : 'opacity-0 hover:bg-surface-subtle group-hover/talk:opacity-100'
        )}
      >
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-20 mt-1 w-40 overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-elev animate-fade-in',
            isMe ? 'right-0' : 'left-0'
          )}
        >
          <ul className="py-1 text-xs">
            <MenuItem
              icon={<CheckSquare className="h-3.5 w-3.5" />}
              label="할 일 등록"
              onClick={onAttachTask}
              disabled={!!talk.taskChip}
            />
            <MenuItem
              icon={<Reply className="h-3.5 w-3.5" />}
              label="답글"
              onClick={() => {
                setOpen(false);
                setMock('reply');
              }}
            />
            <MenuItem
              icon={<Forward className="h-3.5 w-3.5" />}
              label="공유"
              onClick={() => {
                setOpen(false);
                setMock('forward');
              }}
            />
          </ul>
        </div>
      )}
      <MockModal
        open={mock !== null}
        title={mock === 'reply' ? '답글' : '공유'}
        description={
          mock === 'reply'
            ? '메시지에 답글을 작성합니다.'
            : '메시지를 다른 대화방으로 공유합니다.'
        }
        onClose={() => setMock(null)}
        size="sm"
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-ink-primary hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  );
}

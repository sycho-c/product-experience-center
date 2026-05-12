import { useState } from 'react';
import { X } from 'lucide-react';
import { useTodosStore } from '@/features/domain/todos/store';
import { cn } from '@/lib/utils';

const HOST_NAME = '김도윤';

export function TodoRegisterModal({ onClose }: { onClose: () => void }) {
  const add = useTodosStore((s) => s.add);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [assignee, setAssignee] = useState(HOST_NAME);
  const [requester, setRequester] = useState(HOST_NAME);
  const [dueDate, setDueDate] = useState('');

  const canSubmit = title.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    add({
      title: title.trim(),
      content: content.trim() || undefined,
      assignee: assignee.trim() || HOST_NAME,
      requester: requester.trim() || HOST_NAME,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-30 flex animate-backdrop-fade items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[460px] animate-modal-pop overflow-hidden rounded-xl bg-surface-card shadow-elev"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-primary">
            할 일 등록
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
          <Field label="제목" required>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할 일 제목"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <Field label="내용">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세 내용"
              rows={3}
              className="w-full rounded-md border border-surface-border bg-surface-canvas px-3 py-2 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="요청자">
              <input
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
              />
            </Field>
            <Field label="담당자">
              <input
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
              />
            </Field>
          </div>
          <Field label="마감일">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </Field>
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

import {
  BookOpen,
  ClipboardList,
  FileText,
  Hash,
  Megaphone,
  Users,
} from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import type { MobileMenuId } from '@/types/uiaction';

interface MobileMenuDropdownProps {
  /** 메뉴 외 영역 클릭으로 닫기 */
  onClose: () => void;
  /** 비즈폼 외 메뉴 클릭 시 placeholder 모달 표출 */
  onPlaceholder: (label: string) => void;
}

const ITEMS: {
  id: MobileMenuId;
  label: string;
  Icon: typeof FileText;
}[] = [
  { id: 'notice', label: '공지', Icon: Megaphone },
  { id: 'knowledge', label: '지식', Icon: BookOpen },
  { id: 'board', label: '게시판', Icon: ClipboardList },
  { id: 'bizform', label: '비즈폼', Icon: FileText },
  { id: 'participants', label: '참여자 보기', Icon: Users },
  { id: 'guide', label: '키워드 가이드', Icon: Hash },
];

const PLACEHOLDER_TEMPLATE = {
  templateId: 'free-bizform',
  title: '비즈폼 작성',
  fields: [
    { id: 'quoteNo', label: '견적번호' },
    { id: 'request', label: '요청내용' },
    { id: 'file1', label: '첨부 파일 1', file: true },
    { id: 'file2', label: '첨부 파일 2', file: true },
    { id: 'file3', label: '첨부 파일 3', file: true },
  ],
};

/**
 * Guest 햄버거 메뉴 dropdown.
 * 비즈폼 항목은 BizFormModal 을 직접 오픈, 그 외는 placeholder 안내.
 */
export function MobileMenuDropdown({
  onClose,
  onPlaceholder,
}: MobileMenuDropdownProps) {
  const setBizForm = useUISimStore((s) => s.setBizFormModal);

  const onSelect = (id: MobileMenuId, label: string) => {
    if (id === 'bizform') {
      setBizForm({
        templateId: PLACEHOLDER_TEMPLATE.templateId,
        title: PLACEHOLDER_TEMPLATE.title,
        fields: PLACEHOLDER_TEMPLATE.fields.map((f) => ({ ...f })),
      });
    } else {
      onPlaceholder(label);
    }
    onClose();
  };

  return (
    <div className="absolute right-1 top-9 z-30 w-[140px] overflow-hidden rounded-lg border border-surface-border bg-surface-card shadow-elev animate-fade-in">
      <ul className="py-1 text-xs">
        {ITEMS.map(({ id, label, Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onSelect(id, label)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-ink-primary hover:bg-surface-subtle"
            >
              <Icon className="h-3.5 w-3.5 text-ink-muted" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

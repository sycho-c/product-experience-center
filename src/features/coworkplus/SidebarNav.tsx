import { useState } from 'react';
import {
  Book,
  ChevronsLeft,
  CheckSquare,
  ListChecks,
  MessageSquare,
  Settings,
  Users2,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { MockModal } from '@/components/MockModal';
import { cn } from '@/lib/utils';

export type SidebarSectionId = 'talk' | 'external';

interface MenuItem {
  id: string;
  label: string;
  Icon: typeof MessageSquare;
  /** 본문 영역으로 전환되는 section. 지정 시 mock 대신 onSectionChange 가 호출됨. */
  section?: SidebarSectionId;
  /** section 이 없는 메뉴는 mock 화면 노출 */
  mock?: { title: string; description: string };
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'talk', label: '대화', Icon: MessageSquare, section: 'talk' },
  {
    id: 'talk-search',
    label: '대화 조회',
    Icon: ListChecks,
    mock: {
      title: '대화 조회',
      description: '내가 참여한 대화방의 메시지·첨부·할 일을 통합 검색합니다.',
    },
  },
  {
    id: 'todo',
    label: '할 일',
    Icon: CheckSquare,
    mock: {
      title: '할 일',
      description: '나에게 할당된 할 일과 대화방 할 일을 한 번에 관리합니다.',
    },
  },
  {
    id: 'knowledge',
    label: '지식',
    Icon: Book,
    mock: {
      title: '지식',
      description: '사내 지식·자주 쓰는 답변·매뉴얼을 검색·작성합니다.',
    },
  },
  {
    id: 'external',
    label: '외부 사용자',
    Icon: Users2,
    section: 'external',
  },
  {
    id: 'settings',
    label: '설정',
    Icon: Settings,
    mock: {
      title: '설정',
      description: '프로필·알림·디바이스 등 계정 설정을 변경합니다.',
    },
  },
];

interface SidebarNavProps {
  activeId?: string;
  userName?: string;
  onSectionChange?: (section: SidebarSectionId) => void;
}

export function SidebarNav({
  activeId: activeIdProp = 'talk',
  userName = '김도윤',
  onSectionChange,
}: SidebarNavProps) {
  const [activeId, setActiveId] = useState(activeIdProp);
  const [mock, setMock] = useState<MenuItem['mock'] | null>(null);

  const onSelect = (item: MenuItem) => {
    setActiveId(item.id);
    if (item.section) {
      onSectionChange?.(item.section);
      return;
    }
    if (item.mock) setMock(item.mock);
  };

  // 컨테이너 쿼리: 디바이스 컨테이너가 좁으면 아이콘 전용(56px) 모드.
  // 넓으면 라벨 표시(176px).
  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col bg-brand-sidebar text-brand-sidebarText',
        'w-[56px]', // 기본(좁은 컨테이너)에서 아이콘 전용
        '@[760px]/device:w-[176px]'
      )}
    >
      {/* Brand row */}
      <div className="flex items-center justify-between gap-1 px-2 pt-3 @[760px]/device:px-4 @[760px]/device:pt-4">
        <div className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          <span className="hidden text-base font-semibold tracking-tight text-white @[760px]/device:inline">
            Cowork<span className="text-brand-accent">+</span>
          </span>
        </div>
        <button
          aria-label="사이드바 접기"
          className="hidden h-7 w-7 place-items-center rounded text-brand-sidebarText/70 hover:bg-brand-sidebarHover @[760px]/device:grid"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-3 flex-1 px-1.5 @[760px]/device:px-2">
        <ul className="space-y-0.5">
          {MENU_ITEMS.map((item) => {
            const { id, label, Icon } = item;
            const active = id === activeId;
            return (
              <li key={id}>
                <button
                  type="button"
                  title={label}
                  onClick={() => onSelect(item)}
                  className={cn(
                    'flex w-full items-center justify-center rounded-md px-2 py-2 text-sm transition-colors',
                    '@[760px]/device:justify-start @[760px]/device:gap-3 @[760px]/device:px-3',
                    active
                      ? 'bg-brand-sidebarActive text-brand-sidebarTextActive'
                      : 'hover:bg-brand-sidebarHover'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="hidden @[760px]/device:inline">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-2 pb-3 @[760px]/device:px-4 @[760px]/device:pb-4">
        <div className="flex items-center justify-center gap-2 @[760px]/device:justify-start">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs font-semibold text-brand-sidebar">
            {userName.charAt(0)}
          </div>
          <span className="hidden text-xs text-brand-sidebarText/80 @[760px]/device:inline">
            {userName}
          </span>
        </div>
      </div>

      <MockModal
        open={mock !== null}
        title={mock?.title ?? ''}
        description={mock?.description}
        onClose={() => {
          setMock(null);
          setActiveId('talk');
          onSectionChange?.('talk');
        }}
      />
    </aside>
  );
}

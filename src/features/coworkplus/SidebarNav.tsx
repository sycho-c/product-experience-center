import { useState } from 'react';
import {
  BookText,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  MessageCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { MockModal } from '@/components/MockModal';
import { cn } from '@/lib/utils';

export type SidebarSectionId =
  | 'talk'
  | 'external'
  | 'talk-search'
  | 'todo'
  | 'knowledge'
  | 'settings';

interface MenuItem {
  id: string;
  label: string;
  Icon: typeof MessageCircle;
  /** 본문 영역으로 전환되는 section. 지정 시 mock 대신 onSectionChange 가 호출됨. */
  section?: SidebarSectionId;
  /** section 이 없는 메뉴는 mock 화면 노출 */
  mock?: { title: string; description: string };
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'talk', label: '대화', Icon: MessageCircle, section: 'talk' },
  {
    id: 'talk-search',
    label: '대화 조회',
    Icon: Search,
    section: 'talk-search',
  },
  {
    id: 'todo',
    label: '할 일',
    Icon: ClipboardCheck,
    section: 'todo',
  },
  {
    id: 'knowledge',
    label: '지식',
    Icon: BookText,
    section: 'knowledge',
  },
  {
    id: 'external',
    label: '외부 사용자',
    Icon: Users,
    section: 'external',
  },
  {
    id: 'settings',
    label: '설정',
    Icon: Settings,
    section: 'settings',
  },
];

interface SidebarNavProps {
  activeId?: string;
  userName?: string;
  onSectionChange?: (section: SidebarSectionId) => void;
}

export function SidebarNav({
  activeId = 'talk',
  userName = '김도윤',
  onSectionChange,
}: SidebarNavProps) {
  const [mock, setMock] = useState<MenuItem['mock'] | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const onSelect = (item: MenuItem) => {
    if (item.section) {
      onSectionChange?.(item.section);
      return;
    }
    if (item.mock) setMock(item.mock);
  };

  // 컨테이너 쿼리(디바이스 컨테이너가 좁으면 아이콘 전용 모드) + collapsed state(사용자가 명시적으로 접기 토글).
  // collapsed === true 면 컨테이너 폭 무시하고 항상 좁은 모드.
  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col bg-brand-sidebar text-brand-sidebarText',
        collapsed ? 'w-[64px]' : 'w-[56px] @[760px]/device:w-[176px]'
      )}
    >
      {/* Brand row */}
      <div
        className={cn(
          'flex items-center gap-1 px-2 pt-3',
          collapsed
            ? 'flex-col'
            : 'justify-between @[760px]/device:px-4 @[760px]/device:pt-4'
        )}
      >
        <div className="flex items-center gap-2">
          <LogoMark className="h-6 w-6" />
          {!collapsed && (
            <span className="hidden text-base font-semibold tracking-tight text-white @[760px]/device:inline">
              Cowork+
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          className={cn(
            'grid h-7 w-7 place-items-center rounded text-brand-sidebarText/70 hover:bg-brand-sidebarHover',
            collapsed ? 'mt-2' : 'hidden @[760px]/device:grid'
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
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
                    'flex w-full flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[10px] leading-tight transition-colors',
                    !collapsed &&
                      '@[760px]/device:flex-row @[760px]/device:justify-start @[760px]/device:gap-3 @[760px]/device:px-3 @[760px]/device:py-2 @[760px]/device:text-sm',
                    active
                      ? 'bg-brand-sidebarActive text-brand-sidebarTextActive'
                      : 'hover:bg-brand-sidebarHover'
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span
                    className={cn(
                      'text-center',
                      !collapsed && '@[760px]/device:text-left'
                    )}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div
        className={cn(
          'px-2 pb-3',
          !collapsed && '@[760px]/device:px-4 @[760px]/device:pb-4'
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-1',
            !collapsed &&
              '@[760px]/device:flex-row @[760px]/device:justify-start @[760px]/device:gap-2'
          )}
        >
          <div className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs font-semibold text-brand-sidebar">
            {userName.charAt(0)}
          </div>
          <span
            className={cn(
              'text-[10px] text-brand-sidebarText/80',
              !collapsed && '@[760px]/device:text-xs'
            )}
          >
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
          onSectionChange?.('talk');
        }}
      />
    </aside>
  );
}

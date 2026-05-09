import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { TalkRoomList } from './TalkRoomList';
import { TalkRoomView } from './TalkRoomView';
import { RightRail } from './RightRail';
import { CreateRoomModal } from './CreateRoomModal';
import { TaskRegistrationModal } from './TaskRegistrationModal';
import { ToastViewport } from './ToastViewport';
import { useUISimStore } from '@/features/ui-simulation/store';
import { progressOrDo } from '@/lib/use-scenario-match';

interface CoworkShellProps {
  hideRightRail?: boolean;
  skin?: 'cowork' | 'kakao';
  emptyState?: boolean;
}

export function CoworkShell({
  hideRightRail = false,
  skin = 'cowork',
  emptyState = false,
}: CoworkShellProps) {
  const currentRoomId = useUISimStore((s) => s.currentRoomId);
  const hasRooms = useUISimStore((s) => s.rooms.length > 0);
  const setModal = useUISimStore((s) => s.setModal);
  // RightRail 은 기본 숨김. 사용자가 헤더 ⓘ 버튼을 눌러 토글.
  // 좁은 Workspace 에서 항상 토글 가능.
  const [rightRailOpen, setRightRailOpen] = useState(false);

  const onCreateRoomClick = () =>
    progressOrDo(() =>
      setModal('create-room', { open: true, step: 1, tab: 'internal' })
    );

  const showRightRail =
    !hideRightRail && currentRoomId && hasRooms && rightRailOpen;

  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden rounded-lg bg-surface-canvas">
      <SidebarNav activeId="talk" />

      {/* Center column: header + list + view */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface-card px-5">
          <h1 className="text-lg font-semibold text-ink-primary">대화</h1>
          <button
            onClick={onCreateRoomClick}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft hover:bg-brand-primaryHover"
          >
            <Plus className="h-3.5 w-3.5" />새 대화방 만들기
          </button>
        </header>

        <div className="flex h-full min-h-0 flex-1">
          <TalkRoomList />
          {currentRoomId ? (
            <TalkRoomView
              skin={skin}
              emptyState={emptyState}
              rightRailOpen={rightRailOpen}
              onToggleRightRail={() => setRightRailOpen((v) => !v)}
            />
          ) : (
            <TalkRoomView emptyState />
          )}
          {showRightRail && <RightRail dim={skin === 'kakao'} />}
        </div>
      </div>

      {/* Modal & Toast 뷰포트는 Cowork+ 셸 안에서 absolute */}
      <CreateRoomModal />
      <TaskRegistrationModal />
      <ToastViewport />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Filter, ListFilter, Plus, Search, Users } from 'lucide-react';
import { useUISimStore } from '@/features/ui-simulation/store';
import { progressOrDo } from '@/lib/use-scenario-match';
import { MockModal } from '@/components/MockModal';
import { cn } from '@/lib/utils';

type MockKind = 'filter' | 'sort' | 'category-add';

const MOCK_TITLES: Record<MockKind, string> = {
  filter: '대화방 필터',
  sort: '대화방 정렬',
  'category-add': '카테고리 추가',
};

const MOCK_DESCRIPTIONS: Record<MockKind, string> = {
  filter: '대화방을 조건별로 필터링합니다.',
  sort: '최근 활동순/제목순/미확인 우선 등 정렬을 변경합니다.',
  'category-add': '대화방을 묶을 새 카테고리를 만듭니다.',
};

export function TalkRoomList() {
  const rooms = useUISimStore((s) => s.rooms);
  const selectedRoomId = useUISimStore((s) => s.currentRoomId);
  const select = useUISimStore((s) => s.selectRoom);
  const setModal = useUISimStore((s) => s.setModal);

  const [query, setQuery] = useState('');
  const [mock, setMock] = useState<MockKind | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return rooms;
    return rooms.filter((r) =>
      [r.title, r.preview]
        .filter(Boolean)
        .some((t) => t!.toLowerCase().includes(q))
    );
  }, [rooms, query]);

  const onCreateRoom = () =>
    progressOrDo(() =>
      setModal('create-room', { open: true, step: 1, tab: 'internal' })
    );

  return (
    <div className="relative flex h-full w-auto min-w-[160px] max-w-[260px] basis-[30%] shrink-0 flex-col border-r border-surface-border bg-surface-card">
      {/* Search */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="고객/대화방/내용검색 (2글자 이상)"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-card pl-9 pr-3 text-sm placeholder:text-ink-muted focus:border-brand-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            aria-label="필터"
            onClick={() => setMock('filter')}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:bg-surface-subtle"
          >
            <Filter className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="정렬"
            onClick={() => setMock('sort')}
            className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:bg-surface-subtle"
          >
            <ListFilter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <span className="rounded-full bg-brand-sidebar px-3 py-1 text-xs font-semibold text-white">
          전체
        </span>
        <button
          type="button"
          aria-label="새 대화방"
          onClick={onCreateRoom}
          className="grid h-6 w-6 place-items-center rounded-full text-ink-muted hover:bg-surface-subtle"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Rooms */}
      {filtered.length === 0 ? (
        <p className="mt-6 px-4 text-xs text-ink-muted">
          {query.trim().length >= 2
            ? '검색 결과가 없습니다.'
            : '대화방이 없습니다. 우상단 "새 대화방 만들기" 로 시작하세요.'}
        </p>
      ) : (
        <ul className="mt-2 flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((room) => {
            const active = room.id === selectedRoomId;
            return (
              <li key={room.id}>
                <button
                  onClick={() => select(room.id)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                    active ? 'bg-brand-primarySoft' : 'hover:bg-surface-subtle'
                  )}
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
                      <span className="truncate">{room.title}</span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-ink-muted font-normal">
                        <Users className="h-3 w-3" />
                        {room.participantCount}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-sm text-ink-secondary">
                      {room.preview}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
                      {room.device && (
                        <span className="rounded bg-surface-subtle px-1 py-0.5 font-medium">
                          {room.device}
                        </span>
                      )}
                      {room.timestamp && <span>{room.timestamp}</span>}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <MockModal
        open={mock !== null}
        title={mock ? MOCK_TITLES[mock] : ''}
        description={mock ? MOCK_DESCRIPTIONS[mock] : undefined}
        onClose={() => setMock(null)}
      />
    </div>
  );
}

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, Users, X } from 'lucide-react';
import {
  TALK_SEARCH_ROOMS,
  type TalkSearchRoom,
  type TalkSearchTalk,
} from '@/data/talk-search-mock';
import { useUISimStore } from '@/features/ui-simulation/store';
import { cn } from '@/lib/utils';

type Tab = 'rooms' | 'messages';

type DateFilter = 'all' | 'today' | '7d' | '30d';
const DATE_LABELS: Record<DateFilter, string> = {
  all: '전체',
  today: '오늘',
  '7d': '지난 7일',
  '30d': '지난 30일',
};

const TODAY = new Date('2026-05-10T00:00:00');

function diffDays(a: Date, b: Date): number {
  const ms = a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0);
  return Math.abs(Math.round(ms / (1000 * 60 * 60 * 24)));
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateHeader(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${week}요일`;
}

export function TalkSearchView() {
  // tab / keyword / senderFilter / selectedMessageId 는 시나리오 액션 set_talk_search 로 외부에서도 조작 가능 → store sync
  const tab = useUISimStore((s) => s.talkSearch.tab);
  const keyword = useUISimStore((s) => s.talkSearch.keyword);
  const senderFilter = useUISimStore((s) => s.talkSearch.senderFilter);
  const selectedMessageId = useUISimStore(
    (s) => s.talkSearch.selectedMessageId
  );
  const setTalkSearch = useUISimStore((s) => s.setTalkSearch);
  const setTab = (t: Tab) => setTalkSearch({ tab: t });
  const setKeyword = (k: string) => setTalkSearch({ keyword: k });
  const setSenderFilter = (f: string) => setTalkSearch({ senderFilter: f });
  const setSelectedMessageId = (id: string | null) =>
    setTalkSearch({ selectedMessageId: id });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [managerFilter, setManagerFilter] = useState<string>('all');

  const managers = useMemo(() => {
    const set = new Set<string>();
    TALK_SEARCH_ROOMS.forEach((r) => set.add(r.manager));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return TALK_SEARCH_ROOMS.filter((r) => {
      if (managerFilter !== 'all' && r.manager !== managerFilter) return false;
      if (dateFilter !== 'all') {
        const d = new Date(`${r.date}T00:00:00`);
        const today = new Date(TODAY);
        if (dateFilter === 'today' && !isSameDay(d, today)) return false;
        if (dateFilter === '7d' && diffDays(new Date(today), d) > 7)
          return false;
        if (dateFilter === '30d' && diffDays(new Date(today), d) > 30)
          return false;
      }
      return true;
    });
  }, [dateFilter, managerFilter]);

  // 선택된 방이 필터에서 빠지면 선택 해제
  useEffect(() => {
    if (selectedRoomId && !filtered.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(null);
    }
  }, [filtered, selectedRoomId]);

  const selected = filtered.find((r) => r.id === selectedRoomId) ?? null;

  const onClearFilters = () => {
    setDateFilter('all');
    setManagerFilter('all');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-canvas">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-6 py-3">
        <h1 className="text-lg font-semibold text-ink-primary">대화 조회</h1>
      </header>

      {/* Tabs */}
      <div className="flex shrink-0 gap-6 bg-surface-card px-6">
        <TabButton
          label="대화"
          active={tab === 'rooms'}
          onClick={() => setTab('rooms')}
        />
        <TabButton
          label="메시지"
          active={tab === 'messages'}
          onClick={() => setTab('messages')}
        />
      </div>

      {tab === 'rooms' ? (
        <RoomsTab
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          managerFilter={managerFilter}
          setManagerFilter={setManagerFilter}
          managers={managers}
          filtered={filtered}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          selected={selected}
          onClearFilters={onClearFilters}
        />
      ) : (
        <MessagesTab
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          senderFilter={senderFilter}
          setSenderFilter={setSenderFilter}
          keyword={keyword}
          setKeyword={setKeyword}
          selectedMessageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId}
        />
      )}
    </div>
  );
}

interface RoomsTabProps {
  dateFilter: DateFilter;
  setDateFilter: (d: DateFilter) => void;
  managerFilter: string;
  setManagerFilter: (m: string) => void;
  managers: string[];
  filtered: TalkSearchRoom[];
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  selected: TalkSearchRoom | null;
  onClearFilters: () => void;
}

function RoomsTab({
  dateFilter,
  setDateFilter,
  managerFilter,
  setManagerFilter,
  managers,
  filtered,
  selectedRoomId,
  setSelectedRoomId,
  selected,
  onClearFilters,
}: RoomsTabProps) {
  return (
    <>
      {/* Filter chips */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-surface-border bg-surface-card px-6 py-2.5">
        <button
          type="button"
          onClick={onClearFilters}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
            dateFilter === 'all' && managerFilter === 'all'
              ? 'bg-brand-primary text-white'
              : 'bg-surface-subtle text-ink-secondary hover:bg-surface-card'
          )}
        >
          전체
          <span className="text-[10px] opacity-80">{filtered.length}</span>
        </button>

        <FilterDropdown
          label="일자"
          value={DATE_LABELS[dateFilter]}
          active={dateFilter !== 'all'}
        >
          {(close) => (
            <ul className="py-1 text-xs">
              {(Object.keys(DATE_LABELS) as DateFilter[]).map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter(k);
                      close();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                      dateFilter === k && 'text-brand-primary font-medium'
                    )}
                  >
                    {DATE_LABELS[k]}
                    {dateFilter === k && <Check className="h-3 w-3" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FilterDropdown>

        <FilterDropdown label="센터" value="전체" disabled />

        <FilterDropdown
          label="담당자"
          value={managerFilter === 'all' ? '전체' : managerFilter}
          active={managerFilter !== 'all'}
        >
          {(close) => (
            <ul className="py-1 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setManagerFilter('all');
                    close();
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                    managerFilter === 'all' &&
                      'text-brand-primary font-medium'
                  )}
                >
                  전체
                  {managerFilter === 'all' && <Check className="h-3 w-3" />}
                </button>
              </li>
              {managers.map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    onClick={() => {
                      setManagerFilter(m);
                      close();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                      managerFilter === m && 'text-brand-primary font-medium'
                    )}
                  >
                    {m}
                    {managerFilter === m && <Check className="h-3 w-3" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FilterDropdown>

        <FilterDropdown label="대화 ID" value="전체" disabled />
        <FilterDropdown label="앱 채널" value="전체" disabled />
      </div>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[360px_1fr] gap-0">
        {/* Left list */}
        <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-card scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-muted">
              조건에 맞는 대화가 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col gap-1 p-3">
              {filtered.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  selected={r.id === selectedRoomId}
                  onClick={() => setSelectedRoomId(r.id)}
                />
              ))}
            </ul>
          )}
        </aside>

        {/* Right detail */}
        <section className="flex min-h-0 flex-col bg-surface-canvas">
          {selected ? (
            <TalkSearchTimeline room={selected} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-sm text-ink-secondary">
                선택된 대화가 없습니다.
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                목록에서 상세 내용을 확인할 대화를 선택하세요.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

interface MessageHit {
  room: TalkSearchRoom;
  talk: TalkSearchTalk;
}

interface MessagesTabProps {
  dateFilter: DateFilter;
  setDateFilter: (d: DateFilter) => void;
  senderFilter: string;
  setSenderFilter: (s: string) => void;
  keyword: string;
  setKeyword: (k: string) => void;
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

function MessagesTab({
  dateFilter,
  setDateFilter,
  senderFilter,
  setSenderFilter,
  keyword,
  setKeyword,
  selectedMessageId,
  setSelectedMessageId,
}: MessagesTabProps) {
  // 매 클릭마다 pulse 애니메이션을 재실행하기 위한 카운터
  const [pulseSeq, setPulseSeq] = useState(0);
  const onPickMessage = (id: string) => {
    setSelectedMessageId(id);
    setPulseSeq((s) => s + 1);
  };
  // 모든 메시지를 평탄화
  const allHits = useMemo<MessageHit[]>(() => {
    const arr: MessageHit[] = [];
    TALK_SEARCH_ROOMS.forEach((room) => {
      room.talks.forEach((talk) => {
        if (talk.type === 'system') return;
        arr.push({ room, talk });
      });
    });
    return arr;
  }, []);

  const senders = useMemo(() => {
    const set = new Set<string>();
    allHits.forEach((h) => set.add(h.talk.fromName));
    return Array.from(set);
  }, [allHits]);

  const filteredHits = useMemo(() => {
    return allHits.filter((h) => {
      if (senderFilter !== 'all' && h.talk.fromName !== senderFilter)
        return false;
      if (dateFilter !== 'all') {
        const d = new Date(`${h.room.date}T00:00:00`);
        const today = new Date(TODAY);
        if (dateFilter === 'today' && !isSameDay(d, today)) return false;
        if (dateFilter === '7d' && diffDays(new Date(today), d) > 7)
          return false;
        if (dateFilter === '30d' && diffDays(new Date(today), d) > 30)
          return false;
      }
      if (keyword.trim()) {
        if (!h.talk.content.includes(keyword.trim())) return false;
      }
      return true;
    });
  }, [allHits, senderFilter, dateFilter, keyword]);

  // 선택된 메시지가 결과에서 빠지면 reset
  useEffect(() => {
    if (
      selectedMessageId &&
      !filteredHits.some((h) => h.talk.id === selectedMessageId)
    ) {
      setSelectedMessageId(null);
    }
  }, [filteredHits, selectedMessageId, setSelectedMessageId]);

  const selected = filteredHits.find((h) => h.talk.id === selectedMessageId);

  const onClearAll = () => {
    setDateFilter('all');
    setSenderFilter('all');
    setKeyword('');
  };

  return (
    <>
      {/* Filter chips */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-surface-border bg-surface-card px-6 py-2.5">
        <FilterDropdown
          label="일자"
          value={DATE_LABELS[dateFilter]}
          active={dateFilter !== 'all'}
          onClear={() => setDateFilter('all')}
        >
          {(close) => (
            <ul className="py-1 text-xs">
              {(Object.keys(DATE_LABELS) as DateFilter[]).map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter(k);
                      close();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                      dateFilter === k && 'text-brand-primary font-medium'
                    )}
                  >
                    {DATE_LABELS[k]}
                    {dateFilter === k && <Check className="h-3 w-3" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FilterDropdown>

        <FilterDropdown label="센터" value="전체" disabled />

        <FilterDropdown
          label="보낸사람"
          value={senderFilter === 'all' ? '전체' : senderFilter}
          active={senderFilter !== 'all'}
          onClear={() => setSenderFilter('all')}
        >
          {(close) => (
            <ul className="py-1 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setSenderFilter('all');
                    close();
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                    senderFilter === 'all' && 'text-brand-primary font-medium'
                  )}
                >
                  전체
                  {senderFilter === 'all' && <Check className="h-3 w-3" />}
                </button>
              </li>
              {senders.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setSenderFilter(s);
                      close();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-surface-subtle',
                      senderFilter === s && 'text-brand-primary font-medium'
                    )}
                  >
                    {s}
                    {senderFilter === s && <Check className="h-3 w-3" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </FilterDropdown>

        <KeywordDropdown
          keyword={keyword}
          setKeyword={setKeyword}
          onClearAll={onClearAll}
        />
      </div>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-0">
        <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-card scrollbar-thin">
          {filteredHits.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-muted">
              조건에 맞는 메시지가 없습니다.
            </div>
          ) : (
            <ul className="flex flex-col">
              {filteredHits.map((hit) => (
                <MessageHitCard
                  key={hit.talk.id}
                  hit={hit}
                  keyword={keyword.trim()}
                  selected={hit.talk.id === selectedMessageId}
                  onClick={() => onPickMessage(hit.talk.id)}
                />
              ))}
            </ul>
          )}
        </aside>

        <section className="flex min-h-0 flex-col bg-surface-canvas">
          {selected ? (
            <TalkSearchTimeline
              room={selected.room}
              focusMessageId={selected.talk.id}
              pulseSeq={pulseSeq}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-sm text-ink-secondary">
                선택된 메시지가 없습니다.
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                목록에서 상세 내용을 확인할 메시지를 선택하세요.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function TabButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'border-b-2 py-2.5 text-sm transition-colors',
        active
          ? 'border-brand-primary font-semibold text-brand-primary'
          : 'border-transparent text-ink-secondary hover:text-ink-primary',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {label}
    </button>
  );
}

function FilterDropdown({
  label,
  value,
  active,
  disabled,
  onClear,
  children,
}: {
  label: string;
  value: string;
  active?: boolean;
  disabled?: boolean;
  onClear?: () => void;
  children?: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isInteractive = !disabled && children;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={!isInteractive}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] transition-colors',
          active
            ? 'border-brand-primary/60 bg-brand-primarySoft/40 text-brand-primary'
            : 'border-surface-border bg-white text-ink-secondary',
          disabled && 'cursor-not-allowed opacity-70',
          isInteractive && !disabled && 'hover:bg-surface-subtle'
        )}
      >
        {label} : {value}
        {active && onClear ? (
          <span
            role="button"
            aria-label={`${label} 필터 해제`}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25"
          >
            <X className="h-2.5 w-2.5" />
          </span>
        ) : (
          <ChevronDown className="h-3 w-3 text-ink-muted" />
        )}
      </button>
      {open && isInteractive && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 min-w-[140px] overflow-hidden rounded-md border border-surface-border bg-surface-card shadow-elev">
            {children?.(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  );
}

function KeywordDropdown({
  keyword,
  setKeyword,
  onClearAll,
}: {
  keyword: string;
  setKeyword: (k: string) => void;
  onClearAll: () => void;
}) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = keyword.trim().length > 0;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] transition-colors',
          active
            ? 'border-brand-primary/60 bg-brand-primarySoft/40 text-brand-primary'
            : 'border-surface-border bg-white text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        내용 : {active ? keyword : '전체'}
        {active ? (
          <span
            role="button"
            aria-label="검색어 해제"
            onClick={(e) => {
              e.stopPropagation();
              setKeyword('');
            }}
            className="grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-primary/15 text-brand-primary hover:bg-brand-primary/25"
          >
            <X className="h-2.5 w-2.5" />
          </span>
        ) : (
          <ChevronDown className="h-3 w-3 text-ink-muted" />
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-[280px] overflow-hidden rounded-md border border-surface-border bg-surface-card p-3 shadow-elev">
            <div className="flex items-center justify-end pb-2">
              <button
                type="button"
                onClick={() => {
                  onClearAll();
                  setOpen(false);
                }}
                className="text-[11px] text-ink-muted hover:text-ink-primary"
              >
                필터 초기화
              </button>
            </div>
            <label className="block text-[11px] font-medium text-ink-secondary">
              내용
            </label>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
              <input
                ref={inputRef}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setOpen(false);
                }}
                placeholder="메시지 내용 검색"
                className="h-8 w-full rounded-md border border-brand-primary/40 bg-surface-canvas pl-8 pr-7 text-xs focus:border-brand-primary focus:outline-none"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  aria-label="검색어 지우기"
                  className="absolute right-1 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded text-ink-muted hover:bg-surface-subtle"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MessageHitCard({
  hit,
  keyword,
  selected,
  onClick,
}: {
  hit: MessageHit;
  keyword: string;
  selected: boolean;
  onClick: () => void;
}) {
  const { room, talk } = hit;
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-start gap-3 border-b border-surface-border/60 px-4 py-3 text-left transition-colors',
          selected ? 'bg-brand-primarySoft/40' : 'hover:bg-surface-subtle/60'
        )}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-semibold text-brand-primary">
          {talk.fromName.slice(-2)}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="truncate text-[11px] text-ink-secondary"
            title={room.title}
          >
            {room.title}
          </div>
          <div
            className="mt-0.5 line-clamp-3 whitespace-pre-wrap break-words text-xs leading-relaxed text-ink-primary [overflow-wrap:anywhere]"
            title={talk.content}
          >
            <Highlight text={talk.content} keyword={keyword} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-muted">
            <span className="text-ink-secondary">{talk.fromName}</span>
            <span>{room.lastTimestamp.split(' ')[0]} {talk.time}</span>
          </div>
        </div>
      </button>
    </li>
  );
}

function Highlight({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword) return <>{text}</>;
  const parts = text.split(keyword);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && (
            <mark className="rounded bg-yellow-200/80 px-0.5 text-ink-primary">
              {keyword}
            </mark>
          )}
        </span>
      ))}
    </>
  );
}

function RoomCard({
  room,
  selected,
  onClick,
}: {
  room: TalkSearchRoom;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
          selected
            ? 'border-brand-primary/40 bg-brand-primarySoft/40'
            : 'border-transparent hover:bg-surface-subtle/60'
        )}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
          <Users className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-brand-primarySoft/70 px-1.5 py-0.5 text-[10px] font-medium text-brand-primary">
              대화
            </span>
            <span
              className="min-w-0 flex-1 truncate text-xs font-semibold text-ink-primary"
              title={room.title}
            >
              {room.title}
            </span>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] text-ink-muted">
              <Users className="h-3 w-3" />
              {room.participants.length}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
            <span
              className="min-w-0 flex-1 truncate text-ink-secondary"
              title={room.preview}
            >
              {room.preview}
            </span>
            <span className="shrink-0 text-ink-muted">
              {room.lastTimestamp}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <MetaChip label="담당" value={room.manager} />
            {room.center && <MetaChip label="센터" value={room.center} />}
            <MetaChip label="채널" value={room.channel} />
          </div>
        </div>
      </button>
    </li>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span
      className="inline-flex max-w-[140px] items-center gap-1 rounded border border-surface-border bg-white px-1.5 py-0.5 text-[10px] text-ink-secondary"
      title={`${label}: ${value}`}
    >
      <span className="rounded bg-surface-subtle px-1 text-[9px] font-semibold text-ink-muted">
        {label}
      </span>
      <span className="truncate">{value}</span>
    </span>
  );
}

function TalkSearchTimeline({
  room,
  focusMessageId,
  pulseSeq,
}: {
  room: TalkSearchRoom;
  focusMessageId?: string;
  pulseSeq?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!focusMessageId) return;
    const c = containerRef.current;
    const t = focusRef.current;
    if (!c || !t) return;
    c.scrollTo({
      top: Math.max(0, t.offsetTop - c.offsetTop - 40),
      behavior: 'smooth',
    });
  }, [focusMessageId, room.id, pulseSeq]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Detail header */}
      <header className="flex shrink-0 items-center gap-2 border-b border-surface-border bg-surface-card px-6 py-3">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-brand-primary">
          <Users className="h-3.5 w-3.5" />
        </div>
        <span
          className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-primary"
          title={room.title}
        >
          {room.title}
        </span>
        <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-ink-muted">
          <Users className="h-3 w-3" />
          {room.participants.length}
        </span>
      </header>

      {/* Timeline */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin"
      >
        <DateDivider label={formatDateHeader(room.date)} />
        <ul className="mt-4 space-y-3">
          {room.talks.map((t) => {
            const isFocused = t.id === focusMessageId;
            // pulseSeq 가 변경될 때마다 key 가 바뀌어 CSS animation 이 재실행됨.
            const key = isFocused ? `${t.id}-pulse-${pulseSeq ?? 0}` : t.id;
            return (
              <TalkBubble
                key={key}
                talk={t}
                pulse={isFocused}
                ref={isFocused ? focusRef : undefined}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center">
      <span className="rounded-full border border-surface-border bg-surface-card px-3 py-1 text-[11px] text-ink-muted">
        {label}
      </span>
    </div>
  );
}

// pulse 시 row 전체에 좌→우 그라데이션 sweep 후 사라지는 효과를 입힘.
// 컨테이너 li 에 highlight-sweep 애니메이션을 적용.
const PULSE_BG_CLASSES =
  'relative animate-highlight-sweep [background-image:linear-gradient(90deg,transparent_0%,rgba(254,240,138,0.55)_50%,transparent_100%)] [background-size:60%_100%] [background-repeat:no-repeat]';

const TalkBubble = forwardRef<
  HTMLLIElement,
  { talk: TalkSearchTalk; pulse?: boolean }
>(function TalkBubble({ talk, pulse }, ref) {
  if (talk.type === 'system') {
    return (
      <li ref={ref} className="flex justify-center">
        <span className="rounded-full border border-surface-border bg-surface-card px-3 py-1 text-[11px] text-ink-muted">
          {talk.content}
        </span>
      </li>
    );
  }
  const isMe = !!talk.isMe;
  const meStyles = 'bg-brand-primary text-white';
  const otherStyles = 'bg-surface-subtle text-ink-primary';

  return (
    <li
      ref={ref}
      className={cn(
        'flex items-start gap-2 rounded-lg',
        isMe ? 'justify-end' : 'justify-start',
        pulse && PULSE_BG_CLASSES
      )}
    >
      {!isMe && (
        <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-[10px] font-semibold text-brand-primary">
          {talk.fromName.charAt(0)}
        </div>
      )}
      <div
        className={cn(
          'flex min-w-0 flex-col gap-0.5',
          'max-w-[min(85%,360px)]',
          isMe ? 'items-end' : 'items-start'
        )}
      >
        {!isMe && (
          <span className="text-[11px] text-ink-secondary">
            {talk.fromName}
          </span>
        )}
        <div className="flex w-full min-w-0 items-end gap-1.5">
          {isMe && (
            <span className="shrink-0 text-[10px] text-ink-muted">
              {talk.time}
            </span>
          )}
          <div
            className={cn(
              'rounded-xl px-3 py-2 text-xs leading-relaxed break-words [overflow-wrap:anywhere]',
              isMe ? meStyles : otherStyles
            )}
          >
            {talk.content}
          </div>
          {!isMe && (
            <span className="shrink-0 text-[10px] text-ink-muted">
              {talk.time}
            </span>
          )}
        </div>
      </div>
    </li>
  );
});

import { useMemo, useState } from 'react';
import {
  BookText,
  Check,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Plus,
  Star,
  X,
} from 'lucide-react';
import {
  useKnowledgeBaseStore,
  type KnowledgeBaseItem,
  type KnowledgeKind,
} from '@/features/domain/knowledge-base/store';
import { cn } from '@/lib/utils';

type Tab = KnowledgeKind;
type SortKey = 'recent' | 'use' | 'accuracy';

const SORT_LABELS: Record<SortKey, string> = {
  recent: '최신 등록순',
  use: '사용순',
  accuracy: '정확도순',
};

export function KnowledgeView() {
  const items = useKnowledgeBaseStore((s) => s.items);
  const publicCategories = useKnowledgeBaseStore((s) => s.publicCategories);
  const toggleFavorite = useKnowledgeBaseStore((s) => s.toggleFavorite);
  const addCategory = useKnowledgeBaseStore((s) => s.addCategory);

  const [tab, setTab] = useState<Tab>('personal');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('recent');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<KnowledgeBaseItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tabItems = useMemo(() => {
    return items.filter((i) => i.kind === tab);
  }, [items, tab]);

  const filtered = useMemo(() => {
    let arr = tabItems.slice();
    if (favoritesOnly) arr = arr.filter((i) => i.isFavorite);
    if (tab === 'public' && activeCategory !== 'all') {
      arr = arr.filter((i) => i.category === activeCategory);
    }
    arr.sort((a, b) => {
      if (sort === 'recent')
        return b.createdDate.localeCompare(a.createdDate);
      if (sort === 'use') return b.useCount - a.useCount;
      // accuracy 는 mock — useCount + favorite weight
      return (
        b.useCount + (b.isFavorite ? 5 : 0) -
        (a.useCount + (a.isFavorite ? 5 : 0))
      );
    });
    return arr;
  }, [tabItems, favoritesOnly, sort, tab, activeCategory]);

  const selected = filtered.find((i) => i.id === selectedId) ?? null;

  const onSwitchTab = (next: Tab) => {
    setTab(next);
    setSelectedId(null);
    setActiveCategory('all');
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-surface-canvas">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-surface-border bg-surface-card px-6 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-ink-primary">지식</h1>
          <ContextChip />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex shrink-0 gap-6 bg-surface-card px-6">
        <TabButton
          label="개인"
          active={tab === 'personal'}
          onClick={() => onSwitchTab('personal')}
        />
        <TabButton
          label="공용"
          active={tab === 'public'}
          onClick={() => onSwitchTab('public')}
        />
      </div>

      {/* Body */}
      {tab === 'personal' ? (
        <PersonalLayout
          filtered={filtered}
          selected={selected}
          onSelect={setSelectedId}
          sort={sort}
          setSort={setSort}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          onRegister={() => {
            setEditTarget(null);
            setRegisterOpen(true);
          }}
          onEdit={(it) => {
            setEditTarget(it);
            setRegisterOpen(true);
          }}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <PublicLayout
          categories={publicCategories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onAddCategory={addCategory}
          filtered={filtered}
          selected={selected}
          onSelect={setSelectedId}
          sort={sort}
          setSort={setSort}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          onRegister={() => {
            setEditTarget(null);
            setRegisterOpen(true);
          }}
          onEdit={(it) => {
            setEditTarget(it);
            setRegisterOpen(true);
          }}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {registerOpen && (
        <KnowledgeRegisterModal
          kind={tab}
          target={editTarget}
          categories={publicCategories}
          onClose={() => {
            setRegisterOpen(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}

function ContextChip() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-secondary">
      <span className="rounded bg-brand-primarySoft px-1.5 py-0.5 text-[10px] font-medium text-brand-primary">
        상담
      </span>
      <span>상담센터</span>
      <ChevronDown className="h-3 w-3 text-ink-muted" />
    </span>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 py-2.5 text-sm transition-colors',
        active
          ? 'border-brand-primary font-semibold text-brand-primary'
          : 'border-transparent text-ink-secondary hover:text-ink-primary'
      )}
    >
      {label}
    </button>
  );
}

interface CommonLayoutProps {
  filtered: KnowledgeBaseItem[];
  selected: KnowledgeBaseItem | null;
  onSelect: (id: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (v: boolean) => void;
  onRegister: () => void;
  onEdit: (it: KnowledgeBaseItem) => void;
  onToggleFavorite: (id: string) => void;
}

function PersonalLayout(props: CommonLayoutProps) {
  return (
    <>
      <FilterBar {...props} />
      <ListAndDetail {...props} />
    </>
  );
}

interface PublicLayoutProps extends CommonLayoutProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (s: string) => void;
  onAddCategory: (name: string) => void;
}

function PublicLayout(props: PublicLayoutProps) {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    onAddCategory,
    ...rest
  } = props;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[200px_1fr] gap-0">
      <CategorySidebar
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onAddCategory={onAddCategory}
      />
      <div className="flex min-h-0 flex-col">
        <FilterBar {...rest} />
        <ListAndDetail {...rest} />
      </div>
    </div>
  );
}

function CategorySidebar({
  categories,
  activeCategory,
  setActiveCategory,
  onAddCategory,
}: {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (s: string) => void;
  onAddCategory: (name: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  const submit = () => {
    if (!input.trim()) {
      setAdding(false);
      return;
    }
    onAddCategory(input.trim());
    setInput('');
    setAdding(false);
  };

  return (
    <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-subtle/40 p-3 scrollbar-thin">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={cn(
            'text-sm transition-colors',
            activeCategory === 'all'
              ? 'font-semibold text-ink-primary'
              : 'text-ink-secondary hover:text-ink-primary'
          )}
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          aria-label="카테고리 추가"
          className="grid h-5 w-5 place-items-center rounded text-ink-muted hover:bg-surface-card"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {adding && (
        <div className="mb-2 flex items-center gap-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Escape') {
                setAdding(false);
                setInput('');
              }
            }}
            placeholder="카테고리 이름"
            autoFocus
            className="h-7 flex-1 rounded border border-brand-primary/40 bg-white px-2 text-xs focus:border-brand-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            className="grid h-7 w-7 place-items-center rounded bg-brand-primary text-white hover:bg-brand-primaryHover"
            aria-label="추가"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <ul className="space-y-0.5 text-xs">
        {categories.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => setActiveCategory(c)}
              className={cn(
                'flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left transition-colors',
                activeCategory === c
                  ? 'bg-brand-primarySoft/60 font-medium text-brand-primary'
                  : 'text-ink-secondary hover:bg-surface-card'
              )}
            >
              <span className="truncate">{c}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FilterBar({
  sort,
  setSort,
  favoritesOnly,
  setFavoritesOnly,
  onRegister,
}: CommonLayoutProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-surface-border bg-surface-card px-6 py-2.5">
      <PlaceholderChip label="제목/내용" />
      <PlaceholderChip label="검색코드" />
      <button
        type="button"
        onClick={() => setFavoritesOnly(!favoritesOnly)}
        className={cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors',
          favoritesOnly
            ? 'bg-amber-100 text-amber-700'
            : 'text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        <Star
          className={cn(
            'h-3 w-3',
            favoritesOnly ? 'fill-amber-400 text-amber-500' : 'text-ink-muted'
          )}
        />
        즐겨찾기
      </button>

      <div className="ml-auto flex items-center gap-2">
        <SortToggle sort={sort} setSort={setSort} />
        <button
          type="button"
          onClick={onRegister}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft hover:bg-brand-primaryHover"
        >
          등록
        </button>
      </div>
    </div>
  );
}

function PlaceholderChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-surface-border bg-white px-2.5 py-1 text-[11px] text-ink-secondary opacity-70"
    >
      {label} : 전체
      <ChevronDown className="h-3 w-3 text-ink-muted" />
    </button>
  );
}

function SortToggle({
  sort,
  setSort,
}: {
  sort: SortKey;
  setSort: (s: SortKey) => void;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-md border border-surface-border bg-white">
      {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => setSort(k)}
          className={cn(
            'px-2.5 py-1 text-[11px] transition-colors',
            sort === k
              ? 'bg-surface-subtle font-medium text-ink-primary'
              : 'text-ink-secondary hover:bg-surface-subtle/60'
          )}
        >
          {SORT_LABELS[k]}
        </button>
      ))}
    </div>
  );
}

function ListAndDetail({
  filtered,
  selected,
  onSelect,
  onEdit,
  onToggleFavorite,
}: CommonLayoutProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1fr_1fr] gap-0">
      <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-card scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-ink-muted">
            등록된 지식이 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col">
            {filtered.map((it) => (
              <KnowledgeCard
                key={it.id}
                item={it}
                selected={selected?.id === it.id}
                onClick={() => onSelect(it.id)}
                onToggleFavorite={() => onToggleFavorite(it.id)}
              />
            ))}
          </ul>
        )}
      </aside>

      <section className="flex min-h-0 flex-col bg-surface-canvas">
        {selected ? (
          <KnowledgeDetail item={selected} onEdit={() => onEdit(selected)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-ink-secondary">선택된 지식이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function KnowledgeCard({
  item,
  selected,
  onClick,
  onToggleFavorite,
}: {
  item: KnowledgeBaseItem;
  selected: boolean;
  onClick: () => void;
  onToggleFavorite: () => void;
}) {
  const kindTone =
    item.kind === 'public' ? 'text-sky-500' : 'text-emerald-500';
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-start gap-3 border-b border-surface-border/60 px-4 py-3 text-left transition-colors',
          selected ? 'bg-surface-subtle' : 'hover:bg-surface-subtle/60'
        )}
      >
        <span
          role="button"
          aria-label={item.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="mt-0.5 grid h-6 w-6 place-items-center rounded text-ink-muted hover:text-amber-500"
        >
          <Star
            className={cn(
              'h-4 w-4',
              item.isFavorite && 'fill-amber-400 text-amber-500'
            )}
          />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div
            className="truncate text-sm font-medium text-ink-primary"
            title={item.title}
          >
            {item.title}
          </div>
          <p className="line-clamp-2 break-words text-xs text-ink-secondary [overflow-wrap:anywhere]">
            {item.content}
          </p>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-secondary">
              <BookText className={cn('h-3 w-3', kindTone)} />
              {item.kind === 'public' ? '공용' : '개인'}
              {item.category && (
                <span className="text-ink-muted">· {item.category}</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-secondary">
              <CheckCircle2 className="h-3 w-3 text-sky-500" />
              사용: {item.useCount}
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

function KnowledgeDetail({
  item,
  onEdit,
}: {
  item: KnowledgeBaseItem;
  onEdit: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-6 py-5 scrollbar-thin">
      <header className="flex items-start justify-between gap-3 pb-3">
        <div>
          {item.kind === 'public' && (
            <span className="inline-flex items-center rounded bg-brand-primarySoft px-1.5 py-0.5 text-[10px] font-medium text-brand-primary">
              공용
              {item.category && (
                <span className="ml-1 text-ink-secondary font-normal">
                  · {item.category}
                </span>
              )}
            </span>
          )}
          <h2 className="mt-1.5 text-base font-semibold text-ink-primary">
            {item.title}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-secondary">
            {item.createdDate} {item.author}({item.authorLogin})
            <HelpCircle className="h-3 w-3 text-ink-muted" />
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center rounded-md border border-brand-primary/50 bg-white px-3 text-xs font-medium text-brand-primary hover:bg-brand-primarySoft/40"
        >
          수정
        </button>
      </header>

      <div className="border-b border-surface-border" />

      <div className="whitespace-pre-wrap break-words pt-4 text-sm text-ink-primary [overflow-wrap:anywhere]">
        {item.content}
      </div>
    </div>
  );
}

function KnowledgeRegisterModal({
  kind,
  target,
  categories,
  onClose,
}: {
  kind: KnowledgeKind;
  target: KnowledgeBaseItem | null;
  categories: string[];
  onClose: () => void;
}) {
  const add = useKnowledgeBaseStore((s) => s.add);
  const update = useKnowledgeBaseStore((s) => s.update);

  const [title, setTitle] = useState(target?.title ?? '');
  const [content, setContent] = useState(target?.content ?? '');
  const [category, setCategory] = useState(target?.category ?? '');

  const isEdit = !!target;
  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    if (isEdit) {
      update(target!.id, {
        title: title.trim(),
        content: content.trim(),
        category: kind === 'public' ? category.trim() || undefined : undefined,
      });
    } else {
      add({
        kind,
        title: title.trim(),
        content: content.trim(),
        category:
          kind === 'public' ? category.trim() || undefined : undefined,
        author: '김도윤',
        authorLogin: 'kimdoyoon',
      });
    }
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[480px] overflow-hidden rounded-xl bg-surface-card shadow-elev"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-primary">
            {kind === 'public' ? '공용 지식' : '개인 지식'}{' '}
            {isEdit ? '수정' : '등록'}
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
          <div>
            <label className="mb-1 block text-[11px] font-medium text-ink-secondary">
              제목 <span className="text-rose-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="지식 제목"
              className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
            />
          </div>
          {kind === 'public' && (
            <div>
              <label className="mb-1 block text-[11px] font-medium text-ink-secondary">
                카테고리
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="kb-cat-options"
                placeholder="예: 상품 / 운영 / 안내"
                className="h-9 w-full rounded-md border border-surface-border bg-surface-canvas px-3 text-xs focus:border-brand-primary focus:outline-none"
              />
              <datalist id="kb-cat-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          )}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-ink-secondary">
              내용 <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="지식 본문"
              rows={6}
              className="w-full rounded-md border border-surface-border bg-surface-canvas px-3 py-2 text-xs focus:border-brand-primary focus:outline-none"
            />
          </div>
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
            {isEdit ? '저장' : '등록'}
          </button>
        </footer>
      </div>
    </div>
  );
}

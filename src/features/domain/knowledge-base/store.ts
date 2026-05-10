import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type KnowledgeKind = 'personal' | 'public';

export interface KnowledgeBaseItem {
  id: string;
  kind: KnowledgeKind;
  title: string;
  content: string;
  /** 공용 카테고리 (kind === 'public' 일 때 사용) */
  category?: string;
  /** 검색 코드 (검색용 키워드) */
  searchCode?: string;
  isFavorite: boolean;
  useCount: number;
  /** YYYY-MM-DD */
  createdDate: string;
  /** 작성자 */
  author: string;
  /** 작성자 로그인 (예: 'sycho', 'admin') */
  authorLogin: string;
}

const PERSONAL_SEED: KnowledgeBaseItem[] = [
  {
    id: 'kb-p-1',
    kind: 'personal',
    title: '자주 쓰는 인사 멘트',
    content:
      '안녕하세요, 김도윤입니다. 오늘도 좋은 하루 되세요. 문의하신 건은 빠르게 회신드리겠습니다.',
    isFavorite: true,
    useCount: 12,
    createdDate: '2026-04-22',
    author: '김도윤',
    authorLogin: 'kimdoyoon',
  },
  {
    id: 'kb-p-2',
    kind: 'personal',
    title: '비즈폼 안내 문구',
    content:
      '비즈폼 작성을 부탁드립니다. 필수 항목 작성 후 제출해 주시면 1영업일 이내 처리됩니다.',
    isFavorite: false,
    useCount: 3,
    createdDate: '2026-04-15',
    author: '김도윤',
    authorLogin: 'kimdoyoon',
  },
  {
    id: 'kb-p-3',
    kind: 'personal',
    title: '회의 일정 알림 템플릿',
    content:
      '내일 오전 10시 정기 회의 안내드립니다. 어제 공유드린 자료 미리 검토 부탁드립니다.',
    isFavorite: false,
    useCount: 5,
    createdDate: '2026-03-30',
    author: '김도윤',
    authorLogin: 'kimdoyoon',
  },
];

const PUBLIC_SEED: KnowledgeBaseItem[] = [
  {
    id: 'kb-pub-1',
    kind: 'public',
    title: '2026 신상품 약관 요약본',
    content: `본 상품은 상해, 입원, 통원, 주요 질환 위험을 종합적으로 보장하는 구조입니다.
기본 보장과 선택 특약으로 구성되며, 실제 보장 범위는 가입 담보에 따라 달라질 수 있습니다.
주요 확인 항목: 보장 개시일 / 면책기간 / 감액기간 / 특약 가입 여부 / 보장 제외 사항
대표 보장 항목: 상해 사망·후유장해 / 질병·상해 입원 일당 / 통원 치료 / 응급실 내원 / 3대 질환 진단비 / 수술비
대표 보장 제외 예시: 계약 전 질병, 고의 사고, 음주·무면허 사고, 미용 목적 치료, 면책기간 내 사고`,
    category: '상품',
    isFavorite: false,
    useCount: 28,
    createdDate: '2026-04-09',
    author: '관리자',
    authorLogin: 'admin',
  },
  {
    id: 'kb-pub-2',
    kind: 'public',
    title: '계약 변경 처리 절차',
    content: `1) 고객 본인 확인 (성명/주민등록번호/연락처)
2) 변경 사유 및 변경 항목 확인
3) 필요 서류 안내 및 수령 (변경 신청서, 신분증 사본 등)
4) 시스템 등록 → 결과 회신
5) 처리 완료 후 고객에게 안내 메시지 발송`,
    category: '운영',
    isFavorite: true,
    useCount: 15,
    createdDate: '2026-03-18',
    author: '관리자',
    authorLogin: 'admin',
  },
  {
    id: 'kb-pub-3',
    kind: 'public',
    title: '환불 / 청약 철회 안내',
    content: `청약일로부터 30일 이내에 청약을 철회할 수 있으며, 이 경우 납입한 보험료를 전액 돌려받을 수 있습니다.
다만 보험기간이 90일을 초과하는 경우 90일 이내에 청약 철회가 가능합니다.
사고 발생 후 보험금 지급 사유가 있는 경우에는 청약 철회의 효력이 발생하지 않습니다.`,
    category: '안내',
    isFavorite: false,
    useCount: 6,
    createdDate: '2026-02-25',
    author: '관리자',
    authorLogin: 'admin',
  },
];

interface KnowledgeBaseState {
  items: KnowledgeBaseItem[];
  /** 공용 탭의 카테고리 트리. 사용자가 추가 가능 */
  publicCategories: string[];
  add: (
    input: Omit<
      KnowledgeBaseItem,
      'id' | 'isFavorite' | 'useCount' | 'createdDate'
    >
  ) => string;
  update: (
    id: string,
    patch: Partial<
      Pick<KnowledgeBaseItem, 'title' | 'content' | 'category'>
    >
  ) => void;
  toggleFavorite: (id: string) => void;
  incrementUse: (id: string) => void;
  addCategory: (name: string) => void;
  reset: () => void;
}

let _seq = 0;
function genId(): string {
  _seq += 1;
  return `kb-${Date.now().toString(36)}-${_seq}`;
}

function todayDate(): string {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

const PUBLIC_CATEGORIES_SEED = ['상품', '운영', '안내'];

export const useKnowledgeBaseStore = create<KnowledgeBaseState>()(
  immer((set) => ({
    items: [...PERSONAL_SEED, ...PUBLIC_SEED].map((k) => ({ ...k })),
    publicCategories: [...PUBLIC_CATEGORIES_SEED],
    add: (input) => {
      const id = genId();
      set((s) => {
        s.items.unshift({
          id,
          isFavorite: false,
          useCount: 0,
          createdDate: todayDate(),
          ...input,
        });
        if (
          input.kind === 'public' &&
          input.category &&
          !s.publicCategories.includes(input.category)
        ) {
          s.publicCategories.push(input.category);
        }
      });
      return id;
    },
    update: (id, patch) => {
      set((s) => {
        const k = s.items.find((x) => x.id === id);
        if (!k) return;
        if (patch.title !== undefined) k.title = patch.title;
        if (patch.content !== undefined) k.content = patch.content;
        if (patch.category !== undefined) k.category = patch.category;
      });
    },
    toggleFavorite: (id) => {
      set((s) => {
        const k = s.items.find((x) => x.id === id);
        if (k) k.isFavorite = !k.isFavorite;
      });
    },
    incrementUse: (id) => {
      set((s) => {
        const k = s.items.find((x) => x.id === id);
        if (k) k.useCount += 1;
      });
    },
    addCategory: (name) => {
      set((s) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        if (!s.publicCategories.includes(trimmed)) {
          s.publicCategories.push(trimmed);
        }
      });
    },
    reset: () =>
      set((s) => {
        s.items = [...PERSONAL_SEED, ...PUBLIC_SEED].map((k) => ({ ...k }));
        s.publicCategories = [...PUBLIC_CATEGORIES_SEED];
      }),
  }))
);

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TodoStatus = '신규' | '진행중' | '완료' | '보류';

export interface TodoActivity {
  id: string;
  /** ISO datetime — 'YYYY-MM-DD HH:mm' */
  at: string;
  actor: string;
  message: string;
}

export interface TodoItem {
  id: string;
  title: string;
  content?: string;
  status: TodoStatus;
  /** YYYY-MM-DD (없으면 미지정) */
  dueDate?: string;
  /** YYYY-MM-DD */
  createdDate: string;
  /** YYYY-MM-DD (완료 시) */
  completedDate?: string;
  requester: string;
  assignee: string;
  /** 연결된 대화방 (자유 모드 room id 또는 표시용) */
  linkedRoom?: string;
  /** 외부 사용자 요청 여부 */
  fromExternal?: boolean;
  /** 미확인 (호스트가 아직 안 본 신규 외부 요청) */
  unread?: boolean;
  activities: TodoActivity[];
}

const TODAY = '2026-05-10';

const SEED: TodoItem[] = [
  {
    id: 'todo-1',
    title: '견적번호 000000 인도 예정일자 확인',
    content: '고객이 견적서 인도 예정일자 확인을 요청하셨습니다. 영업팀 확인 후 회신 부탁드립니다.',
    status: '신규',
    requester: '정지훈',
    assignee: '정지훈',
    createdDate: TODAY,
    fromExternal: false,
    unread: true,
    activities: [
      {
        id: 'a-1-1',
        at: '2026-05-10 09:32',
        actor: '정지훈',
        message: '정지훈님이 할 일을 생성했습니다.',
      },
    ],
  },
  {
    id: 'todo-2',
    title: '신규할일',
    content: '안녕하세요',
    status: '신규',
    requester: '용진P',
    assignee: '노용주',
    createdDate: '2026-04-29',
    fromExternal: true,
    unread: true,
    activities: [
      {
        id: 'a-2-1',
        at: '2026-04-29 15:38',
        actor: '노용주',
        message: '노용주님이 할 일을 생성했습니다.',
      },
    ],
  },
  {
    id: 'todo-3',
    title: '새로운 테스트 할일1',
    content: '테스트 시나리오 작성 후 QA 진행 부탁드립니다.',
    status: '진행중',
    requester: '관리자',
    assignee: '관리자',
    createdDate: '2026-04-28',
    activities: [
      {
        id: 'a-3-1',
        at: '2026-04-28 10:12',
        actor: '관리자',
        message: '관리자님이 할 일을 생성했습니다.',
      },
      {
        id: 'a-3-2',
        at: '2026-04-29 09:00',
        actor: '관리자',
        message: '관리자님이 상태를 진행중으로 변경했습니다.',
      },
    ],
  },
  {
    id: 'todo-4',
    title: '설계항목 정리해서 보내주세요.',
    content: 'KB손해보험 설계 항목 표 정리 후 메일 회신 부탁드립니다. (참조: 김도윤)',
    status: '신규',
    dueDate: '2026-04-24',
    requester: '관리자_KB손해보험',
    assignee: '관리자_KB손해보험',
    createdDate: '2026-04-20',
    fromExternal: true,
    activities: [
      {
        id: 'a-4-1',
        at: '2026-04-20 14:05',
        actor: '관리자_KB손해보험',
        message: '관리자_KB손해보험님이 할 일을 생성했습니다.',
      },
    ],
  },
  {
    id: 'todo-5',
    title: '홍길동 고객 설계 요청',
    content: '월 1만원 운전자보험 설계 후 PDF 전달 완료.',
    status: '완료',
    dueDate: '2026-04-16',
    completedDate: '2026-04-16',
    requester: '안유진',
    assignee: '안유진',
    createdDate: '2026-04-10',
    fromExternal: true,
    activities: [
      {
        id: 'a-5-1',
        at: '2026-04-10 11:20',
        actor: '안유진',
        message: '안유진님이 할 일을 생성했습니다.',
      },
      {
        id: 'a-5-2',
        at: '2026-04-16 17:45',
        actor: '안유진',
        message: '안유진님이 상태를 완료로 변경했습니다.',
      },
    ],
  },
  {
    id: 'todo-6',
    title: '협업 채널 운영 가이드 검수',
    content: '신규 협업 채널 운영 가이드 v2 초안 검수 부탁드립니다.',
    status: '진행중',
    dueDate: '2026-05-15',
    requester: '김도윤',
    assignee: '한세영',
    createdDate: '2026-04-25',
    activities: [
      {
        id: 'a-6-1',
        at: '2026-04-25 09:10',
        actor: '김도윤',
        message: '김도윤님이 할 일을 생성했습니다.',
      },
      {
        id: 'a-6-2',
        at: '2026-04-26 14:30',
        actor: '한세영',
        message: '한세영님이 담당자로 지정되었습니다.',
      },
    ],
  },
  {
    id: 'todo-7',
    title: '월간 KPI 리포트 작성',
    content: '4월 KPI 데이터 정리 → 보고서 작성. 5/12 회의 전 공유.',
    status: '보류',
    dueDate: '2026-05-12',
    requester: '박지원',
    assignee: '김도윤',
    createdDate: '2026-04-22',
    activities: [
      {
        id: 'a-7-1',
        at: '2026-04-22 16:00',
        actor: '박지원',
        message: '박지원님이 할 일을 생성했습니다.',
      },
      {
        id: 'a-7-2',
        at: '2026-04-30 09:15',
        actor: '김도윤',
        message: '김도윤님이 상태를 보류로 변경했습니다.',
      },
    ],
  },
  {
    id: 'todo-8',
    title: '박정균 고객 본인 확인 서류 회수',
    content: '본인 확인 서류 1건 누락 — 고객 회신 대기.',
    status: '진행중',
    dueDate: '2026-05-13',
    requester: '박지원',
    assignee: '박지원',
    createdDate: '2026-05-07',
    fromExternal: true,
    activities: [
      {
        id: 'a-8-1',
        at: '2026-05-07 17:08',
        actor: '박지원',
        message: '박지원님이 할 일을 생성했습니다.',
      },
    ],
  },
];

interface TodosState {
  items: TodoItem[];
  add: (
    input: Omit<TodoItem, 'id' | 'activities' | 'createdDate' | 'status'> & {
      status?: TodoStatus;
    }
  ) => string;
  setStatus: (id: string, status: TodoStatus) => void;
  markRead: (id: string) => void;
  reset: () => void;
}

let _seq = 0;
function genId(): string {
  _seq += 1;
  return `todo-${Date.now().toString(36)}-${_seq}`;
}

function nowMinute(): string {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  return `${yy}-${mm}-${dd} ${hh}:${mi}`;
}

function todayDate(): string {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export const useTodosStore = create<TodosState>()(
  immer((set) => ({
    items: SEED.map((t) => ({
      ...t,
      activities: t.activities.map((a) => ({ ...a })),
    })),
    add: (input) => {
      const id = genId();
      const status = input.status ?? '신규';
      const created = todayDate();
      set((s) => {
        s.items.unshift({
          id,
          status,
          createdDate: created,
          activities: [
            {
              id: `${id}-a1`,
              at: nowMinute(),
              actor: input.assignee,
              message: `${input.assignee}님이 할 일을 생성했습니다.`,
            },
          ],
          ...input,
        });
      });
      return id;
    },
    setStatus: (id, status) => {
      set((s) => {
        const t = s.items.find((x) => x.id === id);
        if (!t) return;
        if (t.status === status) return;
        t.status = status;
        if (status === '완료') t.completedDate = todayDate();
        t.activities.push({
          id: `${id}-act-${t.activities.length + 1}`,
          at: nowMinute(),
          actor: t.assignee,
          message: `${t.assignee}님이 상태를 ${status}로 변경했습니다.`,
        });
      });
    },
    markRead: (id) => {
      set((s) => {
        const t = s.items.find((x) => x.id === id);
        if (t) t.unread = false;
      });
    },
    reset: () =>
      set((s) => {
        s.items = SEED.map((t) => ({
          ...t,
          activities: t.activities.map((a) => ({ ...a })),
        }));
      }),
  }))
);

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ExternalUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  group?: string;
  manager?: string;
  type?: ExternalUserType;
}

export type ExternalUserType =
  | 'VIP'
  | '1등급 설계사'
  | '2등급 설계사'
  | '3등급 설계사'
  | '배송기사'
  | '화물기사';

const SEED: ExternalUser[] = [
  { id: 'eu-001', name: '김철수', phone: '001-1000-0001', group: 'G1', manager: '정균' },
  {
    id: 'eu-002',
    name: '노윤서',
    phone: '001-1000-0002',
    manager: '박경수',
    type: 'VIP',
  },
  {
    id: 'eu-003',
    name: '민진희',
    phone: '001-1000-0003',
    email: 'minjin@example.com',
    group: 'G2',
    manager: '차민진',
  },
  {
    id: 'eu-004',
    name: '박광언',
    phone: '001-1000-0004',
    email: 'kepark@example.com',
    group: 'G3',
  },
  {
    id: 'eu-005',
    name: '박정균',
    phone: '001-1000-0005',
    group: 'G2',
    manager: '박광언',
    type: 'VIP',
  },
  {
    id: 'eu-006',
    name: '송재현',
    phone: '001-1000-0006',
    email: 'song@example.com',
    group: 'G1',
    manager: '최수진',
  },
  {
    id: 'eu-007',
    name: '안유진',
    phone: '001-1000-0007',
    email: 'eunjin@example.com',
    manager: '김선호',
  },
  { id: 'eu-008', name: '이상현', phone: '001-1000-0008', group: 'G3' },
  { id: 'eu-009', name: '정도현', phone: '001-1000-0009', manager: '한세영' },
  { id: 'eu-010', name: '최우진', phone: '001-1000-0010', group: 'G1' },
  {
    id: 'eu-011',
    name: '박대표',
    phone: '010-2200-3311',
    email: 'park@miu-cable.co.kr',
    group: '미우케이블',
    manager: '강승희',
    type: 'VIP',
  },
];

interface ExternalUsersState {
  users: ExternalUser[];
  add: (input: Omit<ExternalUser, 'id'>) => string;
  reset: () => void;
}

let _seq = 0;
function genId(name: string): string {
  _seq += 1;
  const slug = name.replace(/\s+/g, '-').toLowerCase().slice(0, 12);
  return `eu-${slug}-${Date.now().toString(36)}-${_seq}`;
}

export const useExternalUsersStore = create<ExternalUsersState>()(
  immer((set) => ({
    users: SEED.map((u) => ({ ...u })),
    add: (input) => {
      const id = genId(input.name);
      set((s) => {
        s.users.push({ ...input, id });
      });
      return id;
    },
    reset: () =>
      set((s) => {
        s.users = SEED.map((u) => ({ ...u }));
      }),
  }))
);

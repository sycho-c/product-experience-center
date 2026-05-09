import type { Scenario, ScenarioSummary } from '@/types/scenario';

interface ScenarioRegistryEntry
  extends Omit<ScenarioSummary, 'stepCount'> {
  stepCount: number;
  load: () => Promise<Scenario>;
}

async function loadJson(
  loader: () => Promise<{ default: unknown }>
): Promise<Scenario> {
  const mod = await loader();
  return mod.default as Scenario;
}

export const scenarioRegistry: ScenarioRegistryEntry[] = [
  {
    id: 'basic-room-creation',
    title: '기본 협업 흐름',
    summary:
      '대화방 생성 → 외부 사용자 초대 → 모바일 합류 → 메시지 교환을 한 단계씩 체험합니다.',
    category: 'feature',
    difficulty: 'easy',
    durationMinutes: 5,
    devices: ['pc', 'mobile'],
    stepCount: 7,
    load: () => loadJson(() => import('./basic-room-creation.json')),
  },
  {
    id: 'hana-contract',
    title: '하나손해보험 계약 관리 시나리오',
    summary:
      '디지털 기반의 업무 효율화와 고객 경험 혁신을 위한 하나손해보험 계약 관리 프로세스를 체험합니다.',
    category: 'customer-case',
    customer: { id: 'hana-insurance', name: '하나손해보험' },
    difficulty: 'medium',
    durationMinutes: 15,
    devices: ['pc', 'mobile'],
    stepCount: 10,
    load: () => loadJson(() => import('./hana-contract.json')),
  },
  {
    id: 'woori-credit',
    title: '우리금융캐피탈 렌터카',
    summary: '단체 대화방에서 외부 거래처 응대 — 비밀 메시지, 할 일 등록, 비즈폼 요청까지 전체 프로세스를 체험합니다.',
    category: 'customer-case',
    customer: { id: 'woori', name: '우리금융캐피탈' },
    difficulty: 'medium',
    durationMinutes: 12,
    devices: ['pc', 'mobile'],
    stepCount: 11,
    load: () => loadJson(() => import('./woori-credit')),
  },
  {
    id: 'messaging-basics',
    title: '메시지 & 협업 기본 기능',
    summary: '메시지, 파일 공유, 태스크 관리 등 핵심 기능을 체험해보세요.',
    category: 'feature',
    difficulty: 'easy',
    durationMinutes: 8,
    devices: ['pc', 'mobile'],
    stepCount: 1,
    load: () => loadJson(() => import('./messaging-basics.json')),
  },
  {
    id: 'workspace-admin',
    title: '워크스페이스 관리',
    summary: '조직, 멤버, 권한 등 워크스페이스 관리 기능을 확인해보세요.',
    category: 'feature',
    difficulty: 'medium',
    durationMinutes: 10,
    devices: ['pc'],
    stepCount: 1,
    load: () => loadJson(() => import('./workspace-admin.json')),
  },
  {
    id: 'ai-smart-assist',
    title: 'AI 기반 스마트 도움',
    summary: 'AI가 제공하는 스마트 요약과 추천 기능을 미리 경험합니다.',
    category: 'future-concept',
    difficulty: 'hard',
    durationMinutes: 12,
    devices: ['pc', 'mobile'],
    stepCount: 1,
    load: () => loadJson(() => import('./ai-smart-assist.json')),
  },
  {
    id: 'next-gen-comm',
    title: '차세대 커뮤니케이션',
    summary: '더 강력해질 협업과 커뮤니케이션의 미래를 만나보세요.',
    category: 'future-concept',
    difficulty: 'hard',
    durationMinutes: 12,
    devices: ['pc', 'mobile'],
    stepCount: 1,
    load: () => loadJson(() => import('./next-gen-comm.json')),
  },
];

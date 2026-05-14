import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-flow-secret-coordination',
  title: '[우리금융캐피탈 렌터카] 비밀 메시지 + 시점 전환 통합',
  summary:
    '단체방에서 비밀 메시지 진입 → 전송 → 시점 전환으로 가시성 비교까지 한 번에 체험하는 통합 흐름.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 4,
  devices: ['pc', 'mobile'],
};

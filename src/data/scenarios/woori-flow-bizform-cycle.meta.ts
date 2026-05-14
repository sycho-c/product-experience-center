import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-flow-bizform-cycle',
  title: '[우리금융캐피탈 렌터카] 비즈폼 요청 → 작성 → 제출 → 승인 사이클',
  summary:
    '거래처가 모바일에서 비즈폼을 작성·제출하고 호스트가 승인 + 할 일 chip 완료까지 처리하는 비즈폼 풀 사이클을 한 번에 봅니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['pc', 'mobile'],
};

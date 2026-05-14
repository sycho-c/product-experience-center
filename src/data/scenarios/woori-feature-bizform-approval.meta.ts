import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-feature-bizform-approval',
  title: '[우리금융캐피탈 렌터카] 비즈폼 승인 → 할 일 완료',
  summary:
    '이미 제출된 비즈폼을 호스트가 승인하고, 같은 대화의 할 일 chip 을 "완료" 로 갱신한 뒤 처리 결과를 안내하는 마지막 단계만 시연합니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

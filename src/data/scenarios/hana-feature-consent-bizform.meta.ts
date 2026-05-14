import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-consent-bizform',
  title: '[하나손해보험 GA] 가입설계동의서 — 모바일 비즈폼 요청·작성·제출',
  summary:
    'PC 에서 "동의서 요청" 한 번이면 설계사 모바일에 가입설계동의서 비즈폼이 미리 채워진 상태로 열리고, 서명 → 제출 → 채팅 inline 카드까지 자동으로 연결됩니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'medium',
  durationMinutes: 3,
  devices: ['pc', 'mobile'],
};

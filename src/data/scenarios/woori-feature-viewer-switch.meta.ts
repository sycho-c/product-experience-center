import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-feature-viewer-switch',
  title: '[우리금융캐피탈 렌터카] Guest 시점 전환으로 비밀 메시지 가시성 비교',
  summary:
    '비밀 메시지가 이미 전송된 단체방에서 모바일 뷰어를 대상자 ↔ 다른 외부 참여자로 토글하며 placeholder 동작을 직접 확인합니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

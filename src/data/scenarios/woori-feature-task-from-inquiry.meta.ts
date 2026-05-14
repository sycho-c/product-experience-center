import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-feature-task-from-inquiry',
  title: '[우리금융캐피탈 렌터카] 외부 문의 → 단체채팅 할 일 등록',
  summary:
    '단체 대화방에 외부 거래처 문의가 도착했을 때 호스트가 답변 메시지에 곧바로 처리중 chip 을 붙여 추적을 시작하는 흐름.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

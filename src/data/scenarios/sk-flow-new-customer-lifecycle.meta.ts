import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-flow-new-customer-lifecycle',
  title:
    '[SK렌터카 법인폰] 신규 고객 lifecycle — 초대 → 응대 → DB Mart 자산화',
  summary:
    '카카오 알림톡 초대부터 비즈폼 사업자 메타 등록·견적서 회신까지 신규 고객 한 명의 처음-끝 lifecycle 을 5분에 압축한 흐름입니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['pc', 'mobile'],
};

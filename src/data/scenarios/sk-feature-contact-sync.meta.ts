import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-contact-sync',
  title: '[SK렌터카 법인폰] 안드로이드 연락처 → 파트너 동기화',
  summary:
    '법인폰 안드로이드의 연락처 47건을 SalesBridge 파트너로 일괄 동기화하고, 영업사원-파트너 관계까지 자동 등록되는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['mobile'],
};

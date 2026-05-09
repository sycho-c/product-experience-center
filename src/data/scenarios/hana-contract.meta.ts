import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-contract',
  title: '하나손해보험 계약 관리 시나리오',
  summary:
    '디지털 기반의 업무 효율화와 고객 경험 혁신을 위한 하나손해보험 계약 관리 프로세스를 체험합니다.',
  category: 'customer-case',
  customer: {
    id: 'hana-insurance',
    name: '하나손해보험',
  },
  difficulty: 'medium',
  durationMinutes: 15,
  devices: ['pc', 'mobile'],
};

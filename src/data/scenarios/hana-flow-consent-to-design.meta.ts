import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-flow-consent-to-design',
  title: '[하나손해보험 GA] 고객 등록 → 동의서 → 장기 설계 → 완료',
  summary:
    '할 일이 저장된 시점부터 시작 — 고객 등록(SFA), 가입설계동의서 비즈폼, 장기 설계 PDF 자동 수신, 할 일 완료까지 한 번에 체험합니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 6,
  devices: ['pc', 'mobile'],
};

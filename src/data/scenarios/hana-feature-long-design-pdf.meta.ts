import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-long-design-pdf',
  title: '[하나손해보험 GA] 장기 가입 설계 → PDF 자동 첨부',
  summary:
    '동의서가 완료된 할 일에서 "장기 가입 설계" 버튼을 누르면 외부 영업 시스템에서 설계가 진행되고 결과 PDF 가 채팅에 자동으로 첨부됩니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

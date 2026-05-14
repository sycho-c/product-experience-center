import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-flow-message-to-task',
  title: '[하나손해보험 GA] 다중 메시지 → OCR/NER → 할 일 등록 (통합)',
  summary:
    '다중 선택부터 OCR/NER 추출, 저장과 동시에 chip 부착 + RightRail 동기화까지 한 번에 체험하는 통합 흐름.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['pc'],
};

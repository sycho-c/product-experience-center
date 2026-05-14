import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-multi-select-ocr',
  title: '[하나손해보험 GA] 다중 메시지 선택 → OCR+NER 통합 추출',
  summary:
    '손글씨 사진과 텍스트 요청 두 메시지를 묶어 한 건의 할 일을 만들고, OCR(이미지) + NER(텍스트) 가 동시에 7개 필드를 자동 추출하는 흐름을 체험합니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 3,
  devices: ['pc'],
};

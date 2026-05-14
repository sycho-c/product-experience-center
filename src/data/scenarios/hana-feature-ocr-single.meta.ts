import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-ocr-single',
  title: '[하나손해보험 GA] 손글씨 한 장 → OCR 자동 추출',
  summary:
    '단일 손글씨 이미지 메시지에서 ⋮ → 할 일 등록으로 모달을 열고, OCR 로 고객 정보 5개 필드가 자동 입력되는 흐름만 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

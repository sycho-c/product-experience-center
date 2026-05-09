import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-insurance-collab',
  title: '하나손해보험 GA 협업 채널 — 메시지에서 자동 할 일 등록',
  summary:
    '개인 카카오톡으로 받던 비정형 설계 요청을 공식 협업 채널로 전환하고, 메시지·이미지에서 OCR/NER 로 고객 정보를 자동 추출해 할 일을 생성하는 흐름을 체험합니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  difficulty: 'hard',
  durationMinutes: 15,
  devices: ['pc', 'mobile'],
};

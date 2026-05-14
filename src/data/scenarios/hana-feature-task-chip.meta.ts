import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-task-chip',
  title: '[하나손해보험 GA] 할 일 저장 → 메시지 chip + RightRail 동기화',
  summary:
    'OCR 추출까지 완료된 모달에서 저장 버튼만 눌렀을 때, 원본 메시지에 처리중 chip 이 부착되고 우측 RightRail 의 할 일 패널에 자동 등록되는 양방향 동기화를 봅니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'hana-feature-customer-sfa',
  title: '[하나손해보험 GA] 고객 등록 → 영업 SFA 연계',
  summary:
    '이미 저장된 할 일을 수정 모드로 열어 "고객 등록" 버튼을 누르면 외부 영업 시스템(SFA) 에 자동 등록되는 흐름만 시연합니다.',
  category: 'customer-case',
  customer: { id: 'hana', name: '하나손해보험' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

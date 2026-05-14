import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-flow-workday',
  title:
    '[SK렌터카 법인폰] 영업사원 출근 → 생체 로그인 → 푸시 응대 → 마감',
  summary:
    '정대리의 1일을 압축: 출근 후 법인폰 생체 인증으로 로그인하고, 외근 중 FCM 푸시로 고객 메시지를 즉시 응대하고, 1일 마감 요약까지 5분 흐름을 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['mobile', 'pc'],
};

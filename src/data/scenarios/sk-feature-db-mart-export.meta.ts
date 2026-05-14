import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-db-mart-export',
  title: '[SK렌터카 법인폰] 1일 응대 요약 → DB Mart 자산화 (Action Power)',
  summary:
    '카카오 상담톡 채널에 쌓인 1일 응대 데이터(대화방·메시지·파일·고객 메타) 가 Action Power 파이프라인을 통해 DB Mart 에 자산화되는 마감 요약을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

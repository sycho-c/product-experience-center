import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-admin-partner-transfer',
  title: '[SK렌터카] 관리자 — 이직 사원 고객 일괄 이관',
  summary:
    '영업관리 차상훈 팀장이 이직하는 김주임의 고객 12명을 정대리로 일괄 이관하고, 대화·파일·DB Mart 이력 전체가 새 담당자로 승계되는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'medium',
  durationMinutes: 2,
  devices: ['pc'],
};

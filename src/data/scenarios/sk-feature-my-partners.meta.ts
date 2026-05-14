import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-my-partners',
  title: '[SK렌터카 법인폰] 영업사원 본인 고객만 보기 (mypartners)',
  summary:
    '영업사원으로 로그인한 정대리가 외부 사용자 화면에서 본인이 관리하는 고객만 조회하는 흐름을 짧게 체험합니다. 동료 김주임의 고객은 보이지 않습니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

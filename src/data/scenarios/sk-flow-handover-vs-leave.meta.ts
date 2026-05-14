import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-flow-handover-vs-leave',
  title:
    '[SK렌터카 법인폰] 이직 자산 — 개인 카톡(자료 소실) vs 법인폰(100% 승계)',
  summary:
    '동료 영업사원이 이직했을 때 개인 카카오톡으로 응대했을 경우(자료 0건 회수) 와 법인폰 SalesBridge 로 응대했을 경우(고객 12명 · 대화 12개 · 파일 78건 100% 승계) 의 컨트라스트를 5분에 압축한 흐름입니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['pc', 'mobile'],
};

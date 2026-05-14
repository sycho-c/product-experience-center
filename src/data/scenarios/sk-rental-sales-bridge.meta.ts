import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-rental-sales-bridge',
  title:
    'SK렌터카 법인폰 — 알림톡 초대 · 카카오 상담톡 응대 · DB Mart 자산화 · 이직 자산 이관',
  summary:
    '영업1팀 정대리가 법인폰 SalesBridge 한 화면에서 카카오 알림톡으로 고객을 초대하고, 카카오 상담톡 공식 채널로 응대하며, 사업자등록 메타를 DB Mart 에 자산화하고, 이직하는 동료의 고객까지 안전하게 승계받는 1일 영업 흐름을 체험합니다. 같은 일을 정대리 개인 카톡으로 했을 때(이력 분산·이직 시 자료 소실) 와의 컨트라스트가 함께 제공됩니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  difficulty: 'hard',
  durationMinutes: 14,
  devices: ['pc', 'mobile'],
};

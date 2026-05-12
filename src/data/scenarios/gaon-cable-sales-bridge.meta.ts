import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-cable-sales-bridge',
  title: '가온전선 SalesBridge — 개인 카톡에서 협업 채널 + 통합 파일 이력으로',
  summary:
    '개인 카카오톡으로 흩어져 있던 거래처 사양서·견적서·도면 파일을 협업 채널 안으로 모으고, 다음 발주 시점에 자재번호 한 단어로 과거 대화·파일 이력을 통합 검색하는 흐름을 체험합니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  difficulty: 'hard',
  durationMinutes: 14,
  devices: ['pc', 'mobile'],
};

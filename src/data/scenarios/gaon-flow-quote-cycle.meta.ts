import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-flow-quote-cycle',
  title: '[가온전선] 발주 사이클 — 사양 → 할 일 → 견적·도면 → 완료 → 재발주',
  summary:
    '미우케이블 박대표의 9월 발주 사양 수신부터 할 일 chip 등록, 견적·도면 회신, 두 달 후 재발주까지 한 거래처의 발주 사이클을 5분에 압축한 흐름입니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  tag: '흐름',
  difficulty: 'medium',
  durationMinutes: 5,
  devices: ['pc', 'mobile'],
};

import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-pc-2fa-push',
  title: '[SK렌터카] PC 로그인 — 법인폰 푸시로 2차 인증',
  summary:
    '정대리가 PC SalesBridge 에 ID/PW 입력 후 "모바일 앱으로 인증하기" 를 누르면, 법인폰에 푸시가 도착하고 모바일 생체 인증 완료 후 PC 가 주기 조회로 결과를 받아 로그인이 완성됩니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'medium',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

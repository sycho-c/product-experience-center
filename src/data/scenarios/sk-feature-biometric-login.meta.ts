import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-biometric-login',
  title: '[SK렌터카 법인폰] 생체 인증 로그인 (지문/얼굴)',
  summary:
    '정대리가 법인폰 SalesBridge 앱에 ID/PW 1차 인증 후 BiometricPrompt 로 2차 생체 인증을 거쳐 로그인하는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['mobile'],
};

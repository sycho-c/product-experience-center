import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-password-toggle',
  title: '[SK렌터카] 로그인 비밀번호 표시 토글',
  summary:
    '로그인 화면에서 비밀번호 입력 시 눈(👁) 아이콘으로 평문/마스킹을 토글하는 작은 UX 개선을 시연합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 1,
  devices: ['pc', 'mobile'],
};

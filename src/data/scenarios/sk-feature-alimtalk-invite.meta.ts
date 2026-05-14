import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-alimtalk-invite',
  title:
    '[SK렌터카 법인폰] 카카오 알림톡 초대 → 비즈니스 채널 입장',
  summary:
    '정대리가 신규 고객 박찬호를 PC 에서 카카오 알림톡(비즈뿌리오)으로 초대하고, 박찬호가 개인 카톡의 "초대 수락" 버튼을 눌러 SK렌터카 공식 카카오 상담톡 채널에 입장하는 시작점을 빠르게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

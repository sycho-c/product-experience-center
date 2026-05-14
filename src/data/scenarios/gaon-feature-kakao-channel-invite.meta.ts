import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-feature-kakao-channel-invite',
  title: '[가온전선] 카카오 상담톡 초대 → 협업 채널 입장',
  summary:
    '영업팀 강승희가 PC 에서 미우케이블 박대표를 외부 참여자로 선택하고 카카오 상담톡 알림을 켠 채로 협업 채널을 생성합니다. 박대표가 모바일에서 초대를 수락해 채널에 입장하는 시작점을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'basic-room-creation',
  title: '기본 협업 흐름',
  summary:
    '대화방 생성 → 외부 사용자 초대 → 모바일 합류 → 메시지 교환을 한 단계씩 체험합니다.',
  category: 'feature',
  difficulty: 'easy',
  durationMinutes: 5,
  devices: ['pc', 'mobile'],
};

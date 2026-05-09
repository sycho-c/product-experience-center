import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-credit',
  title: '우리금융캐피탈 렌터카 - 단체채팅',
  summary:
    '단체 대화방에서 외부 거래처 응대 — 비밀 메시지, 할 일 등록, 비즈폼 요청까지 전체 프로세스를 체험합니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  difficulty: 'medium',
  durationMinutes: 12,
  devices: ['pc', 'mobile'],
};

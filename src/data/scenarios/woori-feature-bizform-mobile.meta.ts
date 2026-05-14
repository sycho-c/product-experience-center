import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-feature-bizform-mobile',
  title: '[우리금융캐피탈 렌터카] 모바일 비즈폼 작성 → 채팅 inline 카드',
  summary:
    '거래처가 모바일 햄버거 → 비즈폼 메뉴로 한도 상향 요청 비즈폼을 열고 필드 작성 후 제출하면 대화방에 inline 카드가 자동 생성됩니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 3,
  devices: ['mobile', 'pc'],
};

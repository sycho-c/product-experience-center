import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-feature-talk-search-by-material',
  title: '[가온전선] 자재번호로 회사 전체 메시지 통합 검색',
  summary:
    '재발주 문의가 들어오자 강승희가 좌측 사이드바의 대화 조회 메뉴로 이동하여 자재번호로 회사 전체에서 해당 자재가 언급된 메시지·파일을 통합 조회합니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

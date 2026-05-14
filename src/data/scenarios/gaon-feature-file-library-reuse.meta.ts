import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-feature-file-library-reuse',
  title: '[가온전선] 검색 결과 → 과거 견적서 재첨부 + BR 간 공유',
  summary:
    '대화 조회에서 찾은 과거 견적서를 협업 채널로 돌아와 그대로 재첨부해 응대합니다. 채널 파일 라이브러리에 모든 첨부가 자동 보관되어 영업팀 전체가 검색·재활용할 수 있음을 안내합니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc'],
};

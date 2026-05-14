import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'gaon-feature-multi-file-message',
  title: '[가온전선] 한 메시지에 견적서(xlsx) + 도면(dwg) 동시 첨부',
  summary:
    '강승희가 견적서 엑셀과 도면 dwg 두 파일을 한 메시지에 함께 첨부해 박대표에게 회신하고, 두 파일이 동시에 채널 파일 라이브러리에 등록되는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'gaon', name: '가온전선' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

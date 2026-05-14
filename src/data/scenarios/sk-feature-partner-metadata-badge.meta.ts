import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-partner-metadata-badge',
  title: '[SK렌터카 법인폰] 사업자번호 미입력 고객 ⓘ 배지',
  summary:
    '연락처 동기화로 등록된 고객은 사업자번호·고객구분 등 커스텀필드가 비어있는 경우가 많습니다. 본 시연은 미입력 고객을 목록에서 ⓘ 빨간 배지로 식별하고, 메타를 채우면 배지가 사라지는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['mobile'],
};

import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-multi-image',
  title:
    '[SK렌터카 법인폰] 멀티 이미지 전송 → 카톡 스타일 그리드',
  summary:
    '정대리가 K3 차종 사진 3장을 한 메시지에 카카오톡 스타일 그리드로 첨부해 박찬호에게 전송하는 흐름을 짧게 체험합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

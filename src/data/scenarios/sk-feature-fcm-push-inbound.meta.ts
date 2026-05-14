import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'sk-feature-fcm-push-inbound',
  title:
    '[SK렌터카 법인폰] 고객 메시지 → 법인폰 FCM 푸시 → 채널 진입',
  summary:
    '외근 중인 정대리가 박찬호의 추가 문의 메시지를 법인폰 FCM 푸시로 즉시 인지하고, 푸시 카드를 탭해 SK렌터카 카카오 상담톡 공식 채널로 진입한 뒤 응대합니다.',
  category: 'customer-case',
  customer: { id: 'sk-rental', name: 'SK렌터카' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['mobile'],
};

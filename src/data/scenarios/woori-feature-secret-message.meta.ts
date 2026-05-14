import type { ScenarioMeta } from '@/types/scenario';

export const meta: ScenarioMeta = {
  id: 'woori-feature-secret-message',
  title: '[우리금융캐피탈 렌터카] 비밀 메시지 — 단체방 안에서 1:1 비공개',
  summary:
    '70+ 명이 모인 단체방에서 특정 외부 거래처 1명에게만 보이는 비밀 메시지로 내부 검토 결과를 안전하게 전달하는 흐름.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  tag: '기능',
  difficulty: 'easy',
  durationMinutes: 2,
  devices: ['pc', 'mobile'],
};

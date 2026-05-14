import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-feature-viewer-switch.meta';
import {
  WOORI_EXT_001,
  WOORI_EXT_007,
  WOORI_HOST_ID,
  WOORI_HOST_NAME,
  WOORI_SECRET_MSG_ID,
  createWooriSeed,
} from './_shared-seeds';

// 비밀 메시지가 이미 전송된 상태로 시작
const seedExtraTalks: Talk[] = [
  {
    id: WOORI_SECRET_MSG_ID,
    stepId: 'seed',
    type: 'message',
    from: { role: 'me', userId: WOORI_HOST_ID, displayName: WOORI_HOST_NAME },
    to: { broadcast: true },
    device: 'all',
    content:
      '내부 신용도 검토 결과 한도 상향 가능합니다. 별도 비즈폼으로 추가 자료 요청드릴 예정입니다.',
    offsetMs: 0,
    secret: {
      recipientParticipantId: WOORI_EXT_001.id,
    },
  },
];

const stepActions: UIAction[][] = [
  // 1. 다른 참여자 시점으로 전환 — placeholder 로 보임
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: WOORI_EXT_007.id,
      description: `Guest 모바일 시점을 ${WOORI_EXT_007.displayName} 으로 전환합니다.`,
    },
    {
      kind: 'show_toast',
      message: '대상자가 아니므로 비밀 메시지가 placeholder 로 보입니다.',
      tone: 'info',
      description: '비대상자 시점에서는 본문이 숨겨집니다.',
    },
  ],
  // 2. 시점 복귀 — 대상자에게는 본문 그대로
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: WOORI_EXT_001.id,
      description: `시점을 ${WOORI_EXT_001.displayName} (대상자) 로 복귀합니다.`,
    },
    {
      kind: 'show_toast',
      message: '대상자 시점에서는 본문이 정상적으로 보입니다.',
      tone: 'success',
      description: '대상자에게만 노출되는 가시성 차이를 확인합니다.',
    },
  ],
];

const stepTitles = [
  '비대상자 시점 — placeholder',
  '대상자 시점 복귀 — 본문 노출',
];

const stepDescriptions = [
  '모바일 뷰어를 다른 외부 참여자로 전환해 비밀 메시지가 placeholder 로 보이는 것을 확인합니다.',
  '시점을 대상자로 복귀하면 본문이 정상적으로 보입니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-viewer-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['비밀 메시지의 시점별 가시성 검증'],
  seed: createWooriSeed({ includeInquiry: true, extraTalks: seedExtraTalks }),
  steps,
};

export default scenario;

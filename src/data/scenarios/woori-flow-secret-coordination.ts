import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-flow-secret-coordination.meta';
import {
  WOORI_EXT_001,
  WOORI_EXT_007,
  WOORI_HOST_ID,
  WOORI_HOST_NAME,
  WOORI_ROOM_ID,
  WOORI_SECRET_MSG_ID,
  createWooriSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 비밀 메시지 모드 안내
  [
    {
      kind: 'highlight',
      selector: 'talk-input-mention',
      description: '비밀 메시지 진입 지점을 안내합니다.',
    },
  ],
  // 2. 비밀 메시지 전송
  [
    {
      kind: 'send_secret_message',
      roomId: WOORI_ROOM_ID,
      messageId: WOORI_SECRET_MSG_ID,
      from: { role: 'me', userId: WOORI_HOST_ID, displayName: WOORI_HOST_NAME },
      recipientParticipantId: WOORI_EXT_001.id,
      content:
        '내부 신용도 검토 결과 한도 상향 가능합니다. 별도 비즈폼으로 추가 자료 요청드릴 예정입니다.',
      deviceTarget: 'all',
      description: `${WOORI_EXT_001.displayName} 에게만 보이는 비밀 메시지를 전송합니다.`,
    },
  ],
  // 3. 비대상자 시점 — placeholder
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: WOORI_EXT_007.id,
      description: `Guest 시점을 ${WOORI_EXT_007.displayName} 으로 전환합니다.`,
    },
    {
      kind: 'show_toast',
      message: '비대상자 시점 — 본문이 placeholder 로 보입니다.',
      tone: 'info',
      description: '비밀 메시지의 가시성 차이를 직접 확인합니다.',
    },
  ],
  // 4. 대상자 시점 복귀
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: WOORI_EXT_001.id,
      description: `시점을 ${WOORI_EXT_001.displayName} (대상자) 로 복귀합니다.`,
    },
    {
      kind: 'show_toast',
      message: '대상자 시점 — 본문이 정상적으로 보입니다.',
      tone: 'success',
      description: '대상자에게만 노출됩니다.',
    },
  ],
];

const stepTitles = [
  '비밀 메시지 모드 안내',
  '비밀 메시지 전송',
  '비대상자 시점 — placeholder',
  '대상자 시점 복귀',
];

const stepDescriptions = [
  '비밀 메시지 진입 지점을 안내합니다.',
  '특정 외부 1명에게만 보이는 비밀 메시지를 전송합니다.',
  '시점을 비대상자로 바꿔 본문이 가려지는지 확인합니다.',
  '시점을 대상자로 복귀하면 본문이 다시 보입니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-secf-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['비밀 메시지 + 시점 전환 통합 흐름'],
  seed: createWooriSeed({ includeInquiry: true }),
  steps,
};

export default scenario;

import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-feature-secret-message.meta';
import {
  WOORI_EXT_001,
  WOORI_HOST_ID,
  WOORI_HOST_NAME,
  WOORI_ROOM_ID,
  WOORI_SECRET_MSG_ID,
  createWooriSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 비밀 메시지 모드 안내 (highlight)
  [
    {
      kind: 'highlight',
      selector: 'talk-input-mention',
      description:
        '입력창 옆 멘션/비밀 메시지 진입 지점을 안내합니다.',
    },
  ],
  // 2. 비밀 메시지 전송 — 1명에게만 풀 표시, 나머지는 placeholder
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
    {
      kind: 'show_toast',
      message:
        '비밀 메시지가 전송되었습니다 — 단체방의 다른 참여자에게는 placeholder 로 표시됩니다.',
      tone: 'success',
      description: '내부 검토 노출 리스크를 0% 로 유지합니다.',
    },
  ],
];

const stepTitles = [
  '비밀 메시지 모드 안내',
  '비밀 메시지 전송 — 대상 1명만 풀 표시',
];

const stepDescriptions = [
  '단체방에서 특정 외부 1명에게만 보이는 비밀 메시지 진입 지점을 안내합니다.',
  '대상 외에는 placeholder 로 표시되어 내부 검토 내용이 보호됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-secret-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['단체방 안에서 1:1 비공개 메시지로 내부 검토 보호'],
  seed: createWooriSeed({ includeInquiry: true }),
  steps,
};

export default scenario;

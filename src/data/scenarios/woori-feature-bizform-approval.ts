import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-feature-bizform-approval.meta';
import {
  WOORI_BIZFORM_ID,
  WOORI_BIZFORM_MSG_ID,
  WOORI_HOST_ID,
  WOORI_HOST_NAME,
  WOORI_HOST_REPLY_ID,
  WOORI_ROOM_ID,
  WOORI_TASK_ID,
  createWooriSeed,
} from './_shared-seeds';

// 비즈폼이 이미 inline 카드로 제출된 상태로 시작
const seedExtraTalks: Talk[] = [
  {
    id: WOORI_BIZFORM_MSG_ID,
    stepId: 'seed',
    type: 'bizform',
    from: { role: 'system' },
    to: { broadcast: true },
    device: 'all',
    content: '한도 상향 요청 비즈폼이 제출되었습니다.',
    offsetMs: 0,
    bizformRef: {
      bizformId: WOORI_BIZFORM_ID,
    },
  },
];

const stepActions: UIAction[][] = [
  // 1. 비즈폼 승인
  [
    {
      kind: 'highlight',
      selector: `bizform-${WOORI_BIZFORM_ID}`,
      description: '제출된 비즈폼 inline 카드를 안내합니다.',
    },
    {
      kind: 'approve_bizform',
      bizformId: WOORI_BIZFORM_ID,
      description: '렌터카팀 호스트가 비즈폼을 승인합니다.',
    },
    {
      kind: 'show_toast',
      message: '비즈폼이 승인되었습니다.',
      tone: 'success',
      description: '승인 완료 토스트.',
    },
  ],
  // 2. 할 일 chip 완료 + 안내 메시지
  [
    {
      kind: 'update_task_chip_status',
      roomId: WOORI_ROOM_ID,
      messageId: WOORI_HOST_REPLY_ID,
      taskId: WOORI_TASK_ID,
      status: '완료',
      description: '관련 할 일 chip 을 "완료" 로 갱신합니다.',
    },
    {
      kind: 'append_chat',
      roomId: WOORI_ROOM_ID,
      from: { role: 'me', userId: WOORI_HOST_ID, displayName: WOORI_HOST_NAME },
      content:
        '한도 상향 처리 완료되었습니다. 1억원 한도로 사용 가능합니다. 감사합니다.',
      deviceTarget: 'all',
      description: '호스트가 처리 결과를 단체방에 안내합니다.',
    },
  ],
];

const stepTitles = [
  '비즈폼 승인',
  '할 일 chip 완료 + 결과 안내',
];

const stepDescriptions = [
  '호스트가 제출된 비즈폼 inline 카드를 승인합니다.',
  '관련 할 일 chip 이 "완료" 로 바뀌고 처리 결과를 안내합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-appr-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['비즈폼 승인 → 관련 할 일 chip 동기화'],
  seed: createWooriSeed({
    includeHostReplyWithChip: true,
    extraTalks: seedExtraTalks,
  }),
  steps,
};

export default scenario;

import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-feature-task-from-inquiry.meta';
import {
  WOORI_EXT_001,
  WOORI_HOST_ID,
  WOORI_HOST_NAME,
  WOORI_HOST_REPLY_ID,
  WOORI_ROOM_ID,
  WOORI_TASK_ID,
  createWooriSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 외부 고객 문의 도착
  [
    {
      kind: 'select_room',
      roomId: WOORI_ROOM_ID,
      description: '렌터카팀 ↔ 거래처 단체 대화방을 엽니다.',
    },
    {
      kind: 'mobile_open_room',
      roomId: WOORI_ROOM_ID,
      description: 'Guest 모바일도 동일 대화방을 표시합니다.',
    },
    {
      kind: 'append_chat',
      roomId: WOORI_ROOM_ID,
      messageId: 'wc-inq-msg-1',
      from: {
        role: 'customer',
        userId: WOORI_EXT_001.id,
        displayName: WOORI_EXT_001.displayName,
      },
      content:
        '여신 한도 상향 가능한지 문의드립니다. 현재 5천만원, 5천만원 추가 필요합니다.',
      deviceTarget: 'all',
      description: `${WOORI_EXT_001.displayName} 이 단체방에 한도 상향 문의를 올립니다.`,
    },
  ],
  // 2. 호스트 답변 + 할 일 등록
  [
    {
      kind: 'append_chat',
      roomId: WOORI_ROOM_ID,
      messageId: WOORI_HOST_REPLY_ID,
      from: { role: 'me', userId: WOORI_HOST_ID, displayName: WOORI_HOST_NAME },
      content: '확인했습니다. 신용도 검토 후 안내드리겠습니다.',
      deviceTarget: 'all',
      description: '호스트가 단체방에 1차 답변을 보냅니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: WOORI_ROOM_ID,
      messageId: WOORI_HOST_REPLY_ID,
      taskId: WOORI_TASK_ID,
      title: '한도 상향 검토',
      description:
        '답변 메시지 하단에 "처리중" 할 일 chip 을 부착해 추적을 시작합니다.',
    },
    {
      kind: 'show_toast',
      message: '할 일이 메시지에 부착되었습니다.',
      tone: 'success',
      description: '대화 흐름을 끊지 않고 그 자리에서 task 등록.',
    },
  ],
];

const stepTitles = [
  '외부 거래처 문의 도착',
  '호스트 답변 + 할 일 chip 부착',
];

const stepDescriptions = [
  '단체방에 외부 거래처가 한도 상향 문의를 올립니다.',
  '호스트가 답변하면서 메시지에 처리중 chip 을 부착해 처리 추적을 시작합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-inq-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['단체채팅에서 메시지에 직접 task chip 을 붙여 추적 시작'],
  seed: createWooriSeed(),
  steps,
};

export default scenario;

import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-flow-bizform-cycle.meta';
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

const stepActions: UIAction[][] = [
  // 1. 햄버거 → 비즈폼 모달 열기
  [
    {
      kind: 'mobile_open_menu',
      description: 'Guest 햄버거 메뉴를 펼칩니다.',
    },
    {
      kind: 'mobile_select_menu',
      menuId: 'bizform',
      description: '비즈폼 메뉴를 선택합니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'credit-request',
      title: '한도 상향 요청 비즈폼',
      fields: [
        { id: 'quoteNo', label: '견적번호' },
        { id: 'request', label: '요청내용' },
        { id: 'file1', label: '사업자등록증', file: true },
        { id: 'file2', label: '재무제표', file: true },
        { id: 'file3', label: '신용평가서', file: true },
      ],
      description: '비즈폼 작성 모달이 열립니다.',
    },
  ],
  // 2. 비즈폼 필드 채움
  [
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'quoteNo',
      value: 'WC-2026-00128',
      description: '견적번호 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'request',
      value: '여신 한도 5천만원 → 1억원 상향 요청',
      description: '요청내용 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'file1',
      value: '사업자등록증.pdf',
      description: '사업자등록증 첨부.',
    },
  ],
  // 3. 제출 → 채팅 inline 카드
  [
    {
      kind: 'submit_bizform',
      roomId: WOORI_ROOM_ID,
      bizformId: WOORI_BIZFORM_ID,
      title: '한도 상향 요청 비즈폼',
      messageId: WOORI_BIZFORM_MSG_ID,
      description:
        '비즈폼 제출 — 대화방에 inline 카드 + RightRail 비즈폼 패널 등록.',
    },
  ],
  // 4. 승인 + 할 일 chip 완료 + 결과 안내
  [
    {
      kind: 'approve_bizform',
      bizformId: WOORI_BIZFORM_ID,
      description: '호스트가 비즈폼을 승인합니다.',
    },
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
      description: '호스트가 처리 결과를 안내합니다.',
    },
  ],
];

const stepTitles = [
  '햄버거 → 비즈폼 모달',
  '비즈폼 필드 작성',
  '제출 → inline 카드',
  '승인 + 할 일 완료 + 결과 안내',
];

const stepDescriptions = [
  'Guest 가 모바일 햄버거 메뉴에서 비즈폼 모달을 엽니다.',
  '견적번호·요청내용·첨부 자료를 입력합니다.',
  '제출하면 대화방에 inline 카드가 자동 생성됩니다.',
  '호스트가 승인하고 관련 할 일 chip 을 완료 처리 + 결과 안내.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-cycle-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['비즈폼 요청→제출→승인→할 일 완료의 한 사이클'],
  seed: createWooriSeed({ includeHostReplyWithChip: true }),
  steps,
};

export default scenario;

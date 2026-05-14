import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './woori-feature-bizform-mobile.meta';
import {
  WOORI_BIZFORM_ID,
  WOORI_BIZFORM_MSG_ID,
  WOORI_ROOM_ID,
  createWooriSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 햄버거 메뉴 → 비즈폼 모달 열기
  [
    {
      kind: 'mobile_open_menu',
      description:
        'Guest 햄버거 메뉴를 펼칩니다 (공지/지식/게시판/비즈폼/참여자/가이드).',
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
      description: 'Google Forms 스타일의 비즈폼 작성 모달이 열립니다.',
    },
  ],
  // 2. 비즈폼 필드 채움
  [
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'quoteNo',
      value: 'WC-2026-00128',
      description: '견적번호를 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'request',
      value: '여신 한도 5천만원 → 1억원 상향 요청',
      description: '요청내용을 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'file1',
      value: '사업자등록증.pdf',
      description: '사업자등록증을 첨부합니다.',
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
        '비즈폼을 제출합니다 — 대화방에 inline 카드 + RightRail 비즈폼 패널 등록.',
    },
    {
      kind: 'show_toast',
      message: '비즈폼이 제출되었습니다.',
      tone: 'success',
      description: '제출 완료 토스트.',
    },
  ],
];

const stepTitles = [
  '햄버거 → 비즈폼 모달 열기',
  '비즈폼 필드 작성',
  '제출 → 채팅 inline 카드',
];

const stepDescriptions = [
  '모바일 햄버거 메뉴에서 비즈폼을 선택하면 Google Forms 스타일 모달이 열립니다.',
  '견적번호·요청내용·첨부 자료를 입력합니다.',
  '제출하면 대화방에 inline 카드가 생성되고 RightRail 비즈폼 패널에 등록됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-bf-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['모바일에서 비즈폼 작성·제출 → 대화방 inline 카드 자동 생성'],
  seed: createWooriSeed({ includeInquiry: true }),
  steps,
};

export default scenario;

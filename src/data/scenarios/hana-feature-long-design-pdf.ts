import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-long-design-pdf.meta';
import {
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_HOST_ID,
  HANA_HOST_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_PDF_FILE_ID,
  HANA_ROOM_ID,
  HANA_TASK_ID,
  HANA_TEXT_REQUEST_MSG,
  createHanaSeed,
  hanaHandwrittenAttachment,
} from './_shared-seeds';

const seedExtraTalks: Talk[] = [
  {
    id: HANA_IMG_NOTE_MSG,
    stepId: 'seed',
    type: 'message',
    from: {
      role: 'customer',
      userId: 'hi-designer',
      displayName: HANA_DESIGNER_NAME,
    },
    to: { broadcast: true },
    device: 'all',
    content: '고객 정보 손글씨로 보내드립니다.',
    attachments: [hanaHandwrittenAttachment],
    offsetMs: 0,
    taskChip: {
      taskId: HANA_TASK_ID,
      title: '[박정균] 운전자보험 설계',
      status: '처리중',
    },
  },
];

const stepActions: UIAction[][] = [
  // 1. 모달 재오픈 — 동의서 완료된 상태 → 장기 설계 버튼 활성
  [
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: HANA_ROOM_ID,
        sourceMessageIds: [HANA_IMG_NOTE_MSG, HANA_TEXT_REQUEST_MSG],
        sourceMessageId: HANA_IMG_NOTE_MSG,
        mode: 'edit',
        designer: HANA_DESIGNER_NAME,
      },
      description:
        '할 일을 수정 모드로 엽니다 — 동의서 등록완료 상태로 시작합니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: HANA_CUSTOMER.name,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.productCategory',
      value: '운전자보험',
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.monthlyPremium',
      value: '월 1만원 내외',
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'completed',
      description: '동의서가 등록완료 상태로 표시됩니다.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '',
    },
    {
      kind: 'highlight',
      selector: 'task-registration.long-design',
      description: "활성화된 '장기 가입 설계' 버튼을 안내합니다.",
    },
  ],
  // 2. 장기 가입 설계 클릭 → 외부 시스템 mock → PDF 채팅 전달
  [
    {
      kind: 'click_button',
      buttonId: 'task-registration.long-design',
      description:
        "'장기 가입 설계' 를 클릭하면 외부 영업 시스템에서 설계가 시작됩니다.",
    },
    {
      kind: 'show_toast',
      message: '장기 가입 설계 시스템에서 설계 진행 중...',
      tone: 'info',
      description: '외부 시스템 mock 진행 중 토스트.',
    },
    {
      kind: 'wait',
      ms: 1500,
      description: '설계 처리 대기.',
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'append_chat',
      roomId: HANA_ROOM_ID,
      messageId: HANA_PDF_FILE_ID,
      from: { role: 'me', userId: HANA_HOST_ID, displayName: HANA_HOST_NAME },
      content: '가입제안서를 전달드립니다.',
      attachments: [
        {
          name: '가입제안서_박정균_206001234.pdf',
          size: 1456789,
          mime: 'application/pdf',
        },
      ],
      deviceTarget: 'all',
      description:
        '설계 결과 PDF 가 자동으로 채팅에 전송됩니다 — 다운로드 없이 채팅 안에서 완결.',
    },
  ],
];

const stepTitles = [
  '동의서 완료 상태 진입',
  '장기 설계 → PDF 자동 첨부',
];

const stepDescriptions = [
  '동의서가 완료되어야 "장기 가입 설계" 버튼이 활성화됩니다.',
  '버튼 한 번으로 외부 시스템이 설계를 처리하고 결과 PDF 가 채팅에 자동 첨부됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-design-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['외부 영업 시스템 연동 결과를 채팅에서 PDF 로 즉시 수령'],
  seed: createHanaSeed({
    includeImage: false,
    includeTextRequest: true,
    extraTalks: seedExtraTalks,
  }),
  steps,
};

export default scenario;

import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-customer-sfa.meta';
import {
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_ROOM_ID,
  HANA_TASK_ID,
  createHanaSeed,
  hanaHandwrittenAttachment,
} from './_shared-seeds';

// 이미 할 일이 저장된 상태로 시작 — 사진 메시지에 chip 이 붙어 있다.
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
  // 1. 모달 재오픈 (edit) + 자동 채움
  [
    {
      kind: 'highlight',
      selector: `message-${HANA_IMG_NOTE_MSG}`,
      description: '저장된 할 일 chip 이 붙은 사진 메시지를 안내합니다.',
    },
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: HANA_ROOM_ID,
        sourceMessageId: HANA_IMG_NOTE_MSG,
        mode: 'edit',
        designer: HANA_DESIGNER_NAME,
      },
      description:
        "할 일을 수정 모드로 다시 엽니다. 하단에 '고객 등록 / 장기 가입 설계' 버튼이 노출됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.title',
      value: '[박정균] 운전자보험 설계',
      description: '저장된 제목이 유지됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: HANA_CUSTOMER.name,
      description: '저장된 고객 정보가 다시 표시됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.ssn',
      value: HANA_CUSTOMER.ssn,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.phone',
      value: HANA_CUSTOMER.phone,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.address',
      value: HANA_CUSTOMER.address,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.job',
      value: HANA_CUSTOMER.job,
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
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '',
    },
  ],
  // 2. 고객 등록 버튼 클릭 → SFA mock 연계 토스트
  [
    {
      kind: 'highlight',
      selector: 'task-registration.register-customer',
      description: "'고객 등록' 버튼을 안내합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.register-customer',
      description: "'고객 등록' 버튼을 클릭합니다.",
    },
    {
      kind: 'show_toast',
      message: '고객이 영업 시스템(SFA) 에 등록되었습니다.',
      tone: 'success',
      description: '외부 영업 시스템과 mock 연동되어 고객이 등록됩니다.',
    },
  ],
];

const stepTitles = [
  '저장된 할 일을 수정 모드로 열기',
  '고객 등록 버튼 → SFA 자동 등록',
];

const stepDescriptions = [
  '메시지의 task chip 을 클릭해 모달을 수정 모드로 열면 추가 버튼들이 노출됩니다.',
  '"고객 등록" 한 번으로 외부 영업 시스템(SFA) 까지 자동 등록됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-sfa-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['할 일에서 영업 SFA 시스템으로 고객 등록 자동 연계'],
  seed: createHanaSeed({
    includeImage: false,
    includeTextRequest: true,
    extraTalks: seedExtraTalks,
  }),
  steps,
};

export default scenario;

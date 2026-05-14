import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-flow-consent-to-design.meta';
import {
  HANA_CONSENT_BIZFORM_ID,
  HANA_CONSENT_BIZFORM_MSG,
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
  // 1. 모달 재오픈 → 고객 등록 (SFA)
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
      description: '할 일을 수정 모드로 엽니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: HANA_CUSTOMER.name,
      description: '',
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
    {
      kind: 'click_button',
      buttonId: 'task-registration.register-customer',
      description: "'고객 등록' 을 클릭합니다.",
    },
    {
      kind: 'show_toast',
      message: '고객이 영업 시스템에 등록되었습니다.',
      tone: 'success',
      description: 'SFA 등록 완료 토스트.',
    },
  ],
  // 2. 동의서 요청 → 모바일 비즈폼 작성·제출
  [
    {
      kind: 'click_button',
      buttonId: 'task-registration.consent-request',
      description: "'동의서 요청' 클릭 — 설계사 모바일로 비즈폼 발송.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'requested',
      description: "모달이 '동의서 요청 중' 상태로 토글.",
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫히고 시점이 모바일로 옮겨갑니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'long-insurance-consent',
      title: '가입설계동의서',
      fields: [
        { id: 'customerName', label: '고객명', value: HANA_CUSTOMER.name },
        { id: 'ssn', label: '주민등록번호', value: HANA_CUSTOMER.ssn },
        { id: 'phone', label: '휴대폰번호', value: HANA_CUSTOMER.phone },
        { id: 'address', label: '주소', value: HANA_CUSTOMER.address },
        { id: 'productCategory', label: '동의 상품군', value: '운전자보험' },
        { id: 'agree', label: '개인정보 활용 동의' },
        { id: 'signature', label: '전자서명', file: true },
      ],
      description: '설계사 모바일에 가입설계동의서 비즈폼이 열립니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'agree',
      value: '동의',
      description: '개인정보 활용 동의.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'signature',
      value: '박정균_서명.png',
      description: '전자서명 첨부.',
    },
    {
      kind: 'submit_bizform',
      roomId: HANA_ROOM_ID,
      bizformId: HANA_CONSENT_BIZFORM_ID,
      title: '가입설계동의서',
      messageId: HANA_CONSENT_BIZFORM_MSG,
      description: '비즈폼 제출 — 대화방에 inline 카드 생성.',
    },
  ],
  // 3. 장기 설계 → PDF 자동 첨부
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
      description: '할 일을 다시 엽니다 — 동의서 등록완료 상태.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'completed',
      description: '동의서 등록완료.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '',
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.long-design',
      description: "'장기 가입 설계' 클릭.",
    },
    {
      kind: 'show_toast',
      message: '장기 가입 설계 시스템에서 설계 진행 중...',
      tone: 'info',
      description: '외부 시스템 mock 진행 중.',
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
      description: '설계 결과 PDF 가 자동으로 채팅에 첨부됩니다.',
    },
  ],
  // 4. 할 일 완료
  [
    {
      kind: 'update_task_chip_status',
      roomId: HANA_ROOM_ID,
      messageId: HANA_IMG_NOTE_MSG,
      taskId: HANA_TASK_ID,
      status: '완료',
      description: '메시지 chip 과 RightRail 항목이 "완료" 로 변경됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: HANA_ROOM_ID,
      from: { role: 'me', userId: HANA_HOST_ID, displayName: HANA_HOST_NAME },
      content:
        '가입제안서 전달드렸습니다. 검토 후 회신 부탁드립니다. 처리 완료되었습니다.',
      deviceTarget: 'all',
      description: '설계매니저가 처리 완료를 안내합니다.',
    },
  ],
];

const stepTitles = [
  '고객 등록 (SFA)',
  '동의서 요청 → 모바일 작성·제출',
  '장기 설계 → PDF 자동 첨부',
  '할 일 완료',
];

const stepDescriptions = [
  '저장된 할 일을 수정 모드로 열어 고객을 영업 시스템에 등록합니다.',
  '동의서 요청 한 번으로 설계사 모바일에 비즈폼이 자동 발송·작성·제출됩니다.',
  '장기 설계 버튼으로 외부 시스템이 설계를 처리하고 PDF 가 자동 첨부됩니다.',
  '할 일 chip 과 우측 패널이 "완료" 로 동기화됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-flow2-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: [
    '저장된 할 일에서 SFA·동의서·장기 설계·완료까지 한 사이클',
  ],
  seed: createHanaSeed({
    includeImage: false,
    includeTextRequest: true,
    extraTalks: seedExtraTalks,
  }),
  steps,
};

export default scenario;

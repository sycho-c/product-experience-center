import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-consent-bizform.meta';
import {
  HANA_CONSENT_BIZFORM_ID,
  HANA_CONSENT_BIZFORM_MSG,
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_ROOM_ID,
  HANA_TASK_ID,
  HANA_TEXT_REQUEST_MSG,
  createHanaSeed,
  hanaHandwrittenAttachment,
} from './_shared-seeds';

// 이미 할 일과 고객 등록까지 끝난 상태 — chip 부착된 메시지 포함.
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
  // 1. 모달 재오픈 + 동의서 요청 버튼 클릭
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
      description: '할 일을 수정 모드로 다시 엽니다 (고객 등록 완료된 상태).',
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
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '',
    },
    {
      kind: 'highlight',
      selector: 'task-registration.consent-request',
      description:
        "'장기 가입 설계' 는 비활성 상태 — 먼저 '동의서 요청' 버튼이 안내됩니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.consent-request',
      description:
        "'동의서 요청' 을 클릭하면 설계사 모바일로 가입설계동의서 비즈폼이 발송됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'requested',
      description:
        "모달의 동의서 영역이 '동의서 요청 중 (설계사 작성 대기)' 로 변경됩니다.",
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫히고 시점이 모바일로 옮겨갑니다.',
    },
  ],
  // 2. 모바일 비즈폼 작성 + 제출
  [
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
      description:
        '설계사 모바일에 가입설계동의서 비즈폼이 열립니다. 고객 정보는 미리 채워져 있습니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'agree',
      value: '동의',
      description: "'개인정보 활용 동의' 항목에 동의합니다.",
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'signature',
      value: '박정균_서명.png',
      description: '전자서명 이미지를 첨부합니다.',
    },
    {
      kind: 'submit_bizform',
      roomId: HANA_ROOM_ID,
      bizformId: HANA_CONSENT_BIZFORM_ID,
      title: '가입설계동의서',
      messageId: HANA_CONSENT_BIZFORM_MSG,
      description:
        '비즈폼을 제출합니다 — 채팅에 inline 비즈폼 카드가 추가되고 RightRail 비즈폼 패널에도 등록됩니다.',
    },
    {
      kind: 'show_toast',
      message: '가입설계동의서가 등록되었습니다.',
      tone: 'success',
      description: '동의서 수령 완료 토스트.',
    },
  ],
];

const stepTitles = [
  '동의서 요청 (PC)',
  '모바일 비즈폼 작성·제출',
];

const stepDescriptions = [
  '할 일 모달에서 "동의서 요청" 한 번이면 설계사 모바일에 비즈폼이 자동 발송됩니다.',
  '모바일에서 서명 → 제출하면 PC 대화방에 inline 카드가 자동 추가됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-consent-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['PC ↔ 모바일 비즈폼 요청·작성·제출 흐름 통합'],
  seed: createHanaSeed({
    includeImage: false,
    includeTextRequest: true,
    extraTalks: seedExtraTalks,
  }),
  steps,
};

export default scenario;

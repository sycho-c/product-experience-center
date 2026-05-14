import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-multi-select-ocr.meta';
import {
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_ROOM_ID,
  HANA_TEXT_REQUEST_MSG,
  createHanaSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 다중 선택 모드 진입 + 두 메시지 토글 + 모달 오픈
  [
    {
      kind: 'enter_multi_select_mode',
      roomId: HANA_ROOM_ID,
      description:
        '헤더의 ✓ 아이콘을 눌러 다중 메시지 선택 모드에 진입합니다.',
    },
    {
      kind: 'toggle_message_select',
      messageId: HANA_IMG_NOTE_MSG,
      on: true,
      description: '손글씨 사진 메시지를 선택합니다.',
    },
    {
      kind: 'toggle_message_select',
      messageId: HANA_TEXT_REQUEST_MSG,
      on: true,
      description:
        '이어서 텍스트 설계 요청 메시지도 함께 선택합니다 — 두 메시지를 한 건의 할 일로 묶습니다.',
    },
    {
      kind: 'highlight',
      selector: 'multi-select-create-task',
      description: '하단 "2개 메시지 선택됨 — 할 일 생성" 버튼을 안내합니다.',
    },
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: HANA_ROOM_ID,
        sourceMessageIds: [HANA_IMG_NOTE_MSG, HANA_TEXT_REQUEST_MSG],
        sourceMessageId: HANA_IMG_NOTE_MSG,
        mode: 'create',
        designer: HANA_DESIGNER_NAME,
      },
      description:
        "'할 일 등록' 모달이 열립니다. 사진·텍스트 두 출처가 모두 포함됩니다.",
    },
    {
      kind: 'exit_multi_select_mode',
      description: '다중 선택 모드를 종료합니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.title',
      value: '[박정균] 운전자보험 설계',
      description: '제목이 자동으로 채워집니다.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'extracting',
      description: '"OCR 추출 중..." 배지가 표시됩니다.',
    },
  ],
  // 2. OCR/NER 추출 → 7개 필드 자동 입력
  [
    {
      kind: 'wait',
      ms: 1500,
      description: 'OCR/NER 분석을 진행합니다 — 사진은 OCR 로, 텍스트는 NER 로.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '"OCR 추출 완료" 배지로 토글됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: HANA_CUSTOMER.name,
      description: `고객명 '${HANA_CUSTOMER.name}' 이 자동 입력됩니다.`,
    },
    {
      kind: 'fill_input',
      field: 'task-registration.ssn',
      value: HANA_CUSTOMER.ssn,
      description: '주민등록번호가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.phone',
      value: HANA_CUSTOMER.phone,
      description: '휴대폰번호가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.address',
      value: HANA_CUSTOMER.address,
      description: '주소가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.job',
      value: HANA_CUSTOMER.job,
      description: '직업/소속이 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.productCategory',
      value: '운전자보험',
      description: "텍스트 메시지에서 NER 로 '운전자보험' 이 추출됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.monthlyPremium',
      value: '월 1만원 내외',
      description: "월 납입 목표 '월 1만원 내외' 가 NER 로 추출됩니다.",
    },
    {
      kind: 'show_toast',
      message: 'OCR + NER 로 고객 5개 + 상품 2개 = 총 7개 필드가 자동 추출되었습니다.',
      tone: 'success',
      description: '다중 메시지 통합 추출의 결과를 안내합니다.',
    },
  ],
];

const stepTitles = [
  '다중 메시지 선택 → 모달 오픈',
  'OCR + NER 통합 추출',
];

const stepDescriptions = [
  '헤더 ✓ 로 다중 선택 모드 진입 후 사진 + 텍스트 두 메시지를 묶어 할 일 모달을 엽니다.',
  '사진은 OCR 로 고객 5개 필드, 텍스트는 NER 로 보험 종류·월 납입 2개 필드가 동시에 채워집니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-multi-${(i + 1).toString().padStart(2, '0')}`,
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
    '다중 메시지를 한 건의 할 일로 묶기',
    'OCR + NER 로 이미지·텍스트에서 동시에 자동 추출',
  ],
  seed: createHanaSeed({ includeImage: true, includeTextRequest: true }),
  steps,
};

export default scenario;

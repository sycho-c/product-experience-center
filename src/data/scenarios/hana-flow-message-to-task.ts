import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-flow-message-to-task.meta';
import {
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_ROOM_ID,
  HANA_TASK_ID,
  HANA_TEXT_REQUEST_MSG,
  createHanaSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 다중 선택 → 모달 오픈
  [
    {
      kind: 'enter_multi_select_mode',
      roomId: HANA_ROOM_ID,
      description: '헤더 ✓ 로 다중 선택 모드 진입.',
    },
    {
      kind: 'toggle_message_select',
      messageId: HANA_IMG_NOTE_MSG,
      on: true,
      description: '손글씨 사진 메시지 선택.',
    },
    {
      kind: 'toggle_message_select',
      messageId: HANA_TEXT_REQUEST_MSG,
      on: true,
      description: '텍스트 설계 요청 메시지도 함께 선택.',
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
      description: '두 메시지를 묶어 할 일 등록 모달을 엽니다.',
    },
    {
      kind: 'exit_multi_select_mode',
      description: '다중 선택 모드 종료.',
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
  // 2. OCR/NER 자동 추출
  [
    {
      kind: 'wait',
      ms: 1500,
      description: 'OCR/NER 분석을 진행합니다.',
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
      description: `OCR — 고객명 '${HANA_CUSTOMER.name}'.`,
    },
    {
      kind: 'fill_input',
      field: 'task-registration.ssn',
      value: HANA_CUSTOMER.ssn,
      description: 'OCR — 주민등록번호.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.phone',
      value: HANA_CUSTOMER.phone,
      description: 'OCR — 휴대폰번호.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.address',
      value: HANA_CUSTOMER.address,
      description: 'OCR — 주소.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.job',
      value: HANA_CUSTOMER.job,
      description: 'OCR — 직업/소속.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.productCategory',
      value: '운전자보험',
      description: "NER — '운전자보험'.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.monthlyPremium',
      value: '월 1만원 내외',
      description: "NER — 월 납입 목표.",
    },
  ],
  // 3. 저장 → chip 부착 + RightRail 동기화
  [
    {
      kind: 'highlight',
      selector: 'task-registration.save',
      description: "'저장' 버튼을 안내합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.save',
      description: "'저장' 클릭.",
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: HANA_ROOM_ID,
      messageId: HANA_IMG_NOTE_MSG,
      taskId: HANA_TASK_ID,
      title: '[박정균] 운전자보험 설계',
      description:
        '사진 메시지에 "처리중" chip 이 붙고 RightRail 할 일 패널에도 항목이 추가됩니다.',
    },
    {
      kind: 'show_toast',
      message: '할 일이 등록되었습니다.',
      tone: 'success',
      description: '등록 완료 토스트.',
    },
  ],
];

const stepTitles = [
  '다중 메시지 선택 → 모달 오픈',
  'OCR + NER 자동 추출',
  '저장 → chip + RightRail',
];

const stepDescriptions = [
  '두 메시지를 묶어 한 건의 할 일 모달을 엽니다.',
  '사진은 OCR, 텍스트는 NER 로 7개 필드가 자동 입력됩니다.',
  '저장과 동시에 메시지 chip + RightRail 할 일 패널이 동기화됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-flow1-${(i + 1).toString().padStart(2, '0')}`,
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
    '다중 메시지 → OCR/NER → 할 일 등록의 한 사이클',
  ],
  seed: createHanaSeed({ includeImage: true, includeTextRequest: true }),
  steps,
};

export default scenario;

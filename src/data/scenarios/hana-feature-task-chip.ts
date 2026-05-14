import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-task-chip.meta';
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
  // 1. 사전 셋업 — 모달 오픈 + 채워진 상태로 진입 (실 시나리오에서는 이미 OCR 완료된 모달)
  [
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
        '할 일 등록 모달이 이미 OCR 완료된 상태로 열립니다 (직전 단계는 사전 셋업).',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.title',
      value: '[박정균] 운전자보험 설계',
      description: '제목이 채워져 있습니다.',
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
      description: 'OCR 완료 상태입니다.',
    },
  ],
  // 2. 저장 클릭 → 모달 닫힘 + chip 부착 + RightRail 패널 등록
  [
    {
      kind: 'highlight',
      selector: 'task-registration.save',
      description: "하단 '저장' 버튼을 안내합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.save',
      description: "'저장' 버튼을 클릭합니다.",
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
        '사진 메시지 하단에 "처리중" 할 일 chip 이 부착됩니다.',
    },
    {
      kind: 'show_toast',
      message: '할 일이 등록되었습니다 — 우측 패널과 메시지가 동기화되었습니다.',
      tone: 'success',
      description:
        '동시에 RightRail 의 할 일 패널에 항목이 추가됩니다 (양방향 동기화).',
    },
  ],
];

const stepTitles = [
  '모달 사전 셋업 (이미 OCR 완료)',
  '저장 → chip + RightRail 동기화',
];

const stepDescriptions = [
  '할 일 등록 모달이 OCR 추출까지 완료된 상태로 열립니다 — 이 미니의 출발점.',
  '저장 버튼만 누르면 원본 사진 메시지에 chip 이 붙고 우측 할 일 패널에도 동일 항목이 등록됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-chip-${(i + 1).toString().padStart(2, '0')}`,
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
    '저장과 동시에 메시지 chip + RightRail 항목으로 양방향 동기화',
  ],
  seed: createHanaSeed({ includeImage: true, includeTextRequest: true }),
  steps,
};

export default scenario;

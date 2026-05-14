import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-feature-ocr-single.meta';
import {
  HANA_CUSTOMER,
  HANA_DESIGNER_NAME,
  HANA_IMG_NOTE_MSG,
  HANA_ROOM_ID,
  createHanaSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 사진 메시지의 ⋮ → '할 일 생성' 으로 모달 오픈 (단일 출처)
  [
    {
      kind: 'highlight',
      selector: `message-${HANA_IMG_NOTE_MSG}`,
      description:
        "손글씨 사진 메시지의 ⋮ 메뉴에서 '할 일 생성' 을 누르면 단일 메시지만으로도 모달을 열 수 있습니다.",
    },
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: HANA_ROOM_ID,
        sourceMessageId: HANA_IMG_NOTE_MSG,
        mode: 'create',
        designer: HANA_DESIGNER_NAME,
      },
      description:
        "'할 일 등록' 모달이 열립니다. 단일 출처(사진) — '요청 조건' (NER) 영역은 보이지 않습니다.",
    },
  ],
  // 2. OCR 추출 → 5개 필드 자동 입력
  [
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'extracting',
      description: '사진 OCR 분석을 시작합니다 ("OCR 추출 중...").',
    },
    {
      kind: 'wait',
      ms: 1200,
      description: 'OCR 처리 대기.',
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
  ],
  // 3. 짧은 안내 후 닫기
  [
    {
      kind: 'show_toast',
      message:
        '단일 메시지 OCR 데모 — 사진 한 장만으로 고객 정보 5개 필드를 자동 추출했습니다.',
      tone: 'info',
      description: '단일 메시지 OCR 흐름이 어떻게 동작하는지 안내합니다.',
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달을 닫습니다 (이번 미니에서는 저장 단계는 생략).',
    },
  ],
];

const stepTitles = [
  '사진 메시지 ⋮ → 할 일 등록',
  'OCR 자동 추출',
  '데모 마무리',
];

const stepDescriptions = [
  '대화방의 손글씨 사진 메시지에서 ⋮ → 할 일 생성으로 단일 출처 모달을 엽니다.',
  'OCR 이 사진을 분석해 고객 5개 필드(이름·주민번호·연락처·주소·소속)를 채웁니다.',
  '단일 메시지 OCR 흐름의 효과를 토스트로 확인하고 모달을 닫습니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-ocr-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['손글씨 사진 → OCR 로 고객 정보 자동 추출'],
  seed: createHanaSeed({ includeImage: true, includeTextRequest: false }),
  steps,
};

export default scenario;

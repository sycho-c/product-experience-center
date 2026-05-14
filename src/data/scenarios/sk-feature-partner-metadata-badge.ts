import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-partner-metadata-badge.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'mobile.tab.partners',
      description: '"내 고객" 탭으로 진입합니다.',
    },
    {
      kind: 'show_toast',
      message: '미입력 고객 3명 — 사업자번호 / 고객구분 누락 (ⓘ 빨간 배지)',
      tone: 'warning',
      description:
        '연락처 동기화로 들어온 고객은 메타데이터가 비어있어 프로필 우하단에 ⓘ 빨간 배지가 표시됩니다.',
    },
  ],
  [
    {
      kind: 'highlight',
      selector: 'mobile.partner.박찬호',
      description: '박찬호 고객 카드를 선택해 등록 폼으로 진입합니다.',
    },
    {
      kind: 'fill_input',
      field: 'partner-form.business_no',
      value: '214-87-65432',
      description: '사업자번호를 입력합니다.',
    },
    {
      kind: 'fill_input',
      field: 'partner-form.customer_info',
      value: '법인사업자',
      description: '고객구분을 입력합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'partner-form.save',
      description: '저장 버튼을 눌러 메타를 등록합니다.',
    },
    {
      kind: 'show_toast',
      message: '메타 입력 완료 — ⓘ 배지 해제 · DB Mart 메타 적재',
      tone: 'success',
      description:
        'REQUIRED_METADATA_KEYS 가 모두 채워지면 isComplete = true 가 되어 배지가 사라집니다.',
    },
  ],
];

const stepTitles = [
  '내 고객 목록 → ⓘ 배지 인지',
  '메타 입력 → 배지 해제 · DB Mart 적재',
];
const stepDescriptions = [
  '연락처 동기화로 들어온 고객은 사업자번호/고객구분이 비어있어 프로필 우하단에 ⓘ 빨간 배지가 표시되어 즉시 인지 가능합니다.',
  '박찬호 카드를 열어 사업자번호·고객구분을 입력하면 Yup 필수 검증을 통과하고 배지가 해제되며 DB Mart 에 메타가 적재됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-meta-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['연락처 동기화 후 비어있는 고객 메타를 ⓘ 배지로 인지·완성'],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

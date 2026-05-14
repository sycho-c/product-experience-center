import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-contact-sync.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'mobile.tab.partners',
      description:
        '법인폰 SalesBridge 앱 하단 탭의 "내 고객" 탭을 안내합니다.',
    },
    {
      kind: 'highlight',
      selector: 'mobile.partners.sync',
      description:
        "고객 목록 화면의 동기화 아이콘(↻) 을 강조합니다.",
    },
    {
      kind: 'show_toast',
      message: '네이티브 브릿지로 안드로이드 연락처 47건 조회',
      tone: 'info',
      description:
        '하이브리드 앱이 네이티브 브릿지로 안드로이드 연락처를 읽어옵니다.',
    },
  ],
  [
    {
      kind: 'show_toast',
      message: '연락처 동기화 컨펌 — 47건 중 신규 파트너 32건 / 기존 연결 15건',
      tone: 'info',
      description:
        '전화번호 기준으로 기존 파트너 존재 여부를 조회하고 컨펌 다이얼로그가 표시됩니다.',
    },
    {
      kind: 'show_toast',
      message:
        '동기화 완료 — 신규 32건 등록 · 영업사원-파트너 관계 32건 연결 (DB Mart 적재)',
      tone: 'success',
      description:
        '동기화 API 호출 후 결과를 토스트로 안내합니다.',
    },
  ],
];

const stepTitles = [
  '내 고객 화면 → 동기화 버튼',
  '동기화 컨펌 → 47건 일괄 등록',
];
const stepDescriptions = [
  '법인폰 SalesBridge 앱의 "내 고객" 화면에서 동기화 아이콘을 누르면 네이티브 브릿지로 안드로이드 연락처를 읽어옵니다.',
  '47건의 연락처를 전화번호 기준으로 비교해 신규 32건은 파트너로 등록하고, 영업사원-파트너 관계까지 자동 연결합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-sync-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['법인폰 연락처 자산을 회사 DB Mart 의 파트너 메타로 끌어올림'],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

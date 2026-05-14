import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-my-partners.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'sidebar.external',
      description: "좌측 '외부 사용자' 메뉴를 안내합니다.",
    },
    {
      kind: 'set_section',
      section: 'external',
      description:
        '외부 사용자(고객) 화면으로 이동합니다 — 영업사원 권한이면 본인 관리 고객만 표시됩니다.',
    },
    {
      kind: 'show_toast',
      message: '내 고객 1명 표시 — 박찬호 (한솔무역) · 동료 김주임의 고객은 권한 분리로 미노출',
      tone: 'info',
      description:
        'GET /biz/members/me 로 사용자 식별 후 findAllMyPartners 로 본인 고객만 응답합니다.',
    },
  ],
  [
    {
      kind: 'fill_input',
      field: 'external.search',
      value: '이수정',
      description: "검색창에 동료 김주임의 고객 '이수정' 을 입력해 봅니다.",
    },
    {
      kind: 'show_toast',
      message: '권한 없음 — 이수정 고객은 김주임 담당. 본인 고객만 조회됩니다.',
      tone: 'warning',
      description:
        '백엔드 mypartners API 가 자체 필터링을 수행하므로 다른 사원 고객은 검색되지 않습니다.',
    },
  ],
];

const stepTitles = [
  '외부 사용자 화면 → 본인 고객만 표시',
  '동료 고객 검색 → 권한 분리 안내',
];
const stepDescriptions = [
  '정대리는 영업사원 권한으로 로그인되어 있어 외부 사용자 화면에서 본인이 등록한 고객만 보입니다.',
  '동료 김주임의 고객 이수정을 검색해도 본인 권한 밖이라 결과에 나오지 않습니다. (mypartners API 가 BFF 측에서 권한 분리 수행)',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-mypartners-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['영업사원 본인 고객만 노출되도록 BFF 권한 분리 시연'],
  seed: createSkRentalSeed({ includePostInvite: true }),
  steps,
};

export default scenario;

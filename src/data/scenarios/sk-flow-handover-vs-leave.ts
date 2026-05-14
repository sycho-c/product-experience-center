import type { Scenario, Step } from '@/types/scenario';
import type { UIAction, UISimSeed } from '@/types/uiaction';
import { meta } from './sk-flow-handover-vs-leave.meta';
import {
  SK_PERSONAL_KAKAO_ROOM_ID,
  SK_RENTAL_CUST_PARK_DISPLAY,
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_DISPLAY,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  SK_RENTAL_STAFF_PREV_NAME,
  createSkRentalSeed,
} from './_shared-seeds';

// PC 채널 제목과 양쪽 동일하게 통일하기 위한 공통 라벨
const SHARED_ROOM_LABEL = `${SK_RENTAL_CUST_PARK_NAME} (한솔무역 대표) ↔ ${SK_RENTAL_HOST_NAME}`;
const HANDOVER_NOTICE_ID = 'sk-handover-invite';

// ─────────────────────────────────────────────
// afterSteps — 법인폰 SalesBridge: 100% 자산 승계
// ─────────────────────────────────────────────
const stepActions: UIAction[][] = [
  // 1. 김주임 이직 알림 + 외부 사용자 진입
  [
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `— ${SK_RENTAL_STAFF_PREV_NAME} 동종업계 이직 결정 —`,
      description: '시간 흐름 안내.',
    },
    {
      kind: 'highlight',
      selector: 'sidebar.external',
      description: '관리자가 외부 사용자 메뉴로 진입합니다.',
    },
    {
      kind: 'set_section',
      section: 'external',
      description:
        '외부 사용자 화면에서 영업사원별 고객 리스트를 조회합니다.',
    },
  ],
  // 2. 일괄 이관
  [
    {
      kind: 'show_toast',
      message: `${SK_RENTAL_STAFF_PREV_NAME} 의 고객 12명 일괄 선택 → ${SK_RENTAL_HOST_NAME} 로 이관 진행`,
      tone: 'info',
      description: '관리자가 12명을 일괄 선택하고 이관 대상자 지정.',
    },
    {
      kind: 'show_toast',
      message:
        '이관 완료 — 고객 12명 · 대화방 12개 · 파일 78건 · 사업자 메타 12건 · DB Mart 이력 100% 승계',
      tone: 'success',
      description:
        '담당자 매핑 12건이 자동 재연결되어 100% 승계됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `담당자 변경: ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME} (사유: 인사이동)`,
      description: '이관된 방에 자동 시스템 메시지.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: HANDOVER_NOTICE_ID,
      title: SHARED_ROOM_LABEL,
      body: `담당자 변경 안내 — ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME}. 후속 상담은 ${SK_RENTAL_HOST_NAME} 가 이어갑니다. 채널 입장 후 상담을 계속해 주세요.`,
      ctaLabel: '채널 입장',
      description:
        '박찬호 모바일에 카카오 알림톡으로 담당자 변경 안내 카드가 도착합니다. 채널 이름은 PC 와 동일합니다.',
    },
  ],
  // 3. 박찬호 재문의 → 정대리가 과거 이력 모두 보유
  [
    {
      kind: 'set_section',
      section: 'talk',
      description: '채널로 돌아옵니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: '박찬호 채널을 엽니다.',
    },
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: HANDOVER_NOTICE_ID,
      description:
        '박찬호가 카카오 알림톡 카드의 "채널 입장" 을 눌러 인계 받은 채널로 입장합니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '추가로 K3 한 대 더 부탁드려요.',
      deviceTarget: 'all',
      description: '박찬호 재문의.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '네 대표님, 사업자번호 214-87-65432 / (주)한솔무역 / 임원 출퇴근용 — 지난번과 동일 조건으로 바로 견적 보내드리겠습니다.',
      deviceTarget: 'all',
      description: '정대리가 과거 사업자 메타·차량 용도를 즉시 확인해 응대.',
    },
    {
      kind: 'show_toast',
      message: '재문의 시 정보 재요청 0회 — 100% 이력 보존 · 영업 생산성 유지',
      tone: 'success',
      description: '이직 자산 보존의 효과를 토스트로 정리.',
    },
  ],
];

const stepTitles = [
  '동료 이직 → 관리자 외부 사용자 진입',
  '12명 일괄 이관 → 100% 자산 승계',
  '재문의 응대 → 0회 정보 재요청',
];

const stepDescriptions = [
  '관리자가 이직 사원 김주임의 고객 12명을 확인하기 위해 외부 사용자 화면에 진입합니다.',
  '12명을 일괄 이관하여 대화·파일·DB Mart 이력 모두 정대리에게 승계.',
  '박찬호 재문의 시 정대리가 과거 사업자 메타와 차량 용도를 즉시 확인해 정보 재요청 없이 응대.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-flow-handover-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

// ─────────────────────────────────────────────
// beforeSteps — 개인 카톡: 자료 0건 회수
// ─────────────────────────────────────────────
const beforeActions: UIAction[][] = [
  // B1. 김주임이 개인 카톡으로 응대했던 상태
  [
    {
      kind: 'add_room',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      title: `${SK_RENTAL_STAFF_PREV_NAME} ↔ ${SK_RENTAL_CUST_PARK_NAME} (개인 카카오톡)`,
      participantCount: 2,
      preview: '12 거래처 카톡방 — 모두 김주임 개인 단말 안에만 존재',
      description:
        '김주임이 개인 카카오톡으로 거래처 12명을 응대해온 상태.',
    },
    {
      kind: 'select_room',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      description: '개인 카톡 방을 엽니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      participantId: SK_RENTAL_HOST_ID,
      displayName: `${SK_RENTAL_STAFF_PREV_NAME}(SK렌터카)`,
      external: false,
      isHost: true,
      description: '김주임 개인 카톡 호스트 입장.',
    },
    {
      kind: 'add_participant',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      participantId: SK_RENTAL_CUST_PARK_ID,
      displayName: SK_RENTAL_CUST_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '박찬호도 개인 카톡으로 응대 받음.',
    },
    {
      kind: 'show_toast',
      message: '회사 시스템에 응대 이력 0건 — 모든 자료가 김주임 개인 단말 안',
      tone: 'warning',
      description: 'DB Mart 미적재 상태.',
    },
  ],
  // B2. 김주임 이직 → 자료 회수 불가
  [
    {
      kind: 'append_system_message',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      content: `— ${SK_RENTAL_STAFF_PREV_NAME} 동종업계 이직 + 개인 카톡 비활성화 —`,
      description: '김주임 이직 + 개인 카톡 비활성화.',
    },
    {
      kind: 'show_toast',
      message: '고객 12명 · 대화 0건 · 파일 0건 · 사업자 메타 0건 회수 (이력 100% 소실)',
      tone: 'warning',
      description: '인수인계 강제 불가 + 자료 100% 소실.',
    },
  ],
  // B3. 박찬호 재문의 → 정대리 모름
  [
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '안녕하세요. 지난번 K3 같은 조건으로 한 대 더 부탁드려요.',
      deviceTarget: 'all',
      description: '박찬호 재문의.',
    },
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_DISPLAY,
      },
      content:
        '(다른 영업사원으로 인계 받았으나 정보 없음) 사업자번호 다시 한 번 보내주실 수 있을까요?',
      deviceTarget: 'all',
      description: '정대리가 회사 어디서도 박찬호 정보를 찾을 수 없어 재요청.',
    },
    {
      kind: 'show_toast',
      message: '같은 정보 재요청 → 고객 신뢰 손실 + 영업 생산성 손실',
      tone: 'warning',
      description: '이력 부재로 인한 영업 손실.',
    },
  ],
];

const beforeTitles = [
  '[Before] 김주임 개인 카톡으로 12명 응대',
  '[Before] 김주임 이직 → 자료 100% 소실',
  '[Before] 박찬호 재문의 → 정대리 모름',
];

const beforeDescriptions = [
  '김주임이 12명의 거래처를 개인 카톡으로 응대해왔습니다. 회사 시스템에는 어떤 이력도 없습니다.',
  '동종업계 이직 + 개인 카톡 비활성화로 12명의 거래처 이력이 모두 사라집니다. 인수인계 강제 불가.',
  '박찬호가 재문의를 보내자 정대리는 사업자번호조차 없어 동일 정보를 다시 요청합니다.',
];

const beforeSteps: Step[] = beforeActions.map((actions, i) => ({
  id: `sk-flow-handover-before-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${beforeTitles[i]}`,
  description: beforeDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: [
    '동종업계 이직이 빈번한 환경에서 거래처 이력을 회사 자산으로 100% 보존',
    '재문의 시 영업사원이 즉시 응대할 수 있는 가시성 확보',
  ],
  metrics: [
    {
      label: '이직 시 거래처 이력 보존',
      before: 0,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '재문의 시 정보 재요청',
      before: 100,
      after: 0,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '대화·파일 회사 가시성',
      before: 0,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
  ],
  seed: ((): UISimSeed => {
    const base = createSkRentalSeed({
      includePostInvite: true,
      includePreviousStaffRooms: true,
    });
    // 시작 시점에는 인계 받기 전이라 박찬호 모바일 게스트의 채팅 목록은 비어 있고,
    // 이관 step 의 mobile_push_notice 가 채널 카드를 새로 추가한다.
    return { ...base, mobileChatList: [] };
  })(),
  steps,
  beforeSteps,
};

export default scenario;

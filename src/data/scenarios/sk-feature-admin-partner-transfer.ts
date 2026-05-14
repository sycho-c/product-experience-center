import type { Scenario, Step } from '@/types/scenario';
import type { UIAction, UISimSeed } from '@/types/uiaction';
import { meta } from './sk-feature-admin-partner-transfer.meta';
import {
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  SK_RENTAL_STAFF_PREV_NAME,
  createSkRentalSeed,
} from './_shared-seeds';

// PC 채널 제목과 양쪽 동일하게 통일하기 위한 공통 라벨
const SHARED_ROOM_LABEL = `${SK_RENTAL_CUST_PARK_NAME} (한솔무역 대표) ↔ ${SK_RENTAL_HOST_NAME}`;
const TRANSFER_NOTICE_ID = 'sk-admin-transfer-alimtalk';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'sidebar.external',
      description: '관리자가 좌측 외부 사용자 메뉴로 진입합니다.',
    },
    {
      kind: 'set_section',
      section: 'external',
      description:
        '외부 사용자 화면에서 영업사원별 고객 리스트를 조회합니다.',
    },
    {
      kind: 'highlight',
      selector: `partner-row.staff-${SK_RENTAL_STAFF_PREV_NAME}`,
      description: `이직 예정인 ${SK_RENTAL_STAFF_PREV_NAME} 의 고객 12명을 강조합니다.`,
    },
  ],
  [
    {
      kind: 'show_toast',
      message: `이관 진행: ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME} (고객 12명 일괄 선택)`,
      tone: 'info',
      description:
        '관리자가 12명을 일괄 선택하고 이관 대상자로 정대리를 지정합니다.',
    },
    {
      kind: 'show_toast',
      message: `이관 완료 — 고객 12명 · 대화방 12개 · 파일 78건 · DB Mart 이력 100% 승계`,
      tone: 'success',
      description:
        'partnerRelationRepository.register 가 12회 호출되어 정대리에게 관계가 연결됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `담당자 변경: ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME} (사유: 인사이동)`,
      description: '이관된 모든 방에 자동으로 담당자 변경 시스템 메시지가 기록됩니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: TRANSFER_NOTICE_ID,
      title: SHARED_ROOM_LABEL,
      body: `담당자 변경 안내 — ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME}. 본 채널은 그대로 유지되며 후속 상담은 ${SK_RENTAL_HOST_NAME} 가 이어갑니다.`,
      ctaLabel: '확인',
      description:
        '박찬호 모바일에 카카오 알림톡으로 담당자 변경 안내 카드가 도착합니다. 채널 이름은 PC 와 동일합니다.',
    },
  ],
];

const stepTitles = [
  '외부 사용자 화면 → 이직 사원 고객 강조',
  '12명 일괄 이관 → 100% 자산 승계',
];
const stepDescriptions = [
  '관리자가 외부 사용자 화면에서 이직 예정인 김주임이 담당하던 고객 12명을 확인합니다.',
  '관리자가 12명을 일괄 이관하여 모든 대화·파일·DB Mart 이력이 정대리에게 승계됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-transfer-${(i + 1).toString().padStart(2, '0')}`,
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
    '동종업계 이직이 빈번한 환경에서 거래처 이력을 100% 회사 자산으로 보존',
    '관리자 일괄 이관으로 인수인계를 강제',
  ],
  seed: ((): UISimSeed => {
    const base = createSkRentalSeed({
      includePostInvite: true,
      includePreviousStaffRooms: true,
    });
    // PC 채널 제목과 양쪽 동일하게 보이도록 게스트 채팅 목록의 entry title 만 통일.
    // 시작 시점은 김주임이 응대하던 상태(joined 카드 1개)이고, Step 2 의
    // mobile_push_notice 가 카카오 알림톡 카드를 invited 영역에 띄운다.
    return {
      ...base,
      mobileChatList: base.mobileChatList?.map((e) =>
        e.roomId === SK_RENTAL_ROOM_ID ? { ...e, title: SHARED_ROOM_LABEL } : e
      ),
    };
  })(),
  steps,
};

export default scenario;

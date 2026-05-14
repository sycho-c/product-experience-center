import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-alimtalk-invite.meta';
import {
  SK_CHANNEL_NAME,
  SK_RENTAL_CUST_PARK_DISPLAY,
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_DISPLAY,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. PC 에서 대화방 생성 + 카카오 알림톡 발송
  [
    {
      kind: 'highlight',
      selector: 'create-room-button',
      description: "우상단 '새 대화방 만들기' 버튼을 안내합니다.",
    },
    {
      kind: 'open_modal',
      modalId: 'create-room',
      initialStep: 1,
      initialTab: 'external',
      description:
        "'대화방 생성' 모달이 열리고 거래처(외부) 탭이 보입니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.external.search',
      value: '박찬호',
      description: "검색창에 '박찬호' 고객을 입력합니다.",
    },
    {
      kind: 'toggle_check',
      itemId: `create-room.external.${SK_RENTAL_CUST_PARK_ID}`,
      on: true,
      description: '(주)한솔무역 박찬호 대표를 선택합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.next',
      description: "'다음' 버튼으로 채널 설정 단계로 이동합니다.",
    },
    {
      kind: 'set_modal_step',
      modalId: 'create-room',
      step: 2,
      description: "2단계 '대화 채널 설정' 화면이 표시됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.title',
      value: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역) ↔ ${SK_RENTAL_HOST_NAME}`,
      description: '대화방 제목이 자동 채워집니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.kakao',
      on: true,
      description: `카카오 알림톡(비즈뿌리오) 으로 ${SK_CHANNEL_NAME} 초대장을 발송하기를 켭니다.`,
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.create',
      description: "'대화방 생성' 버튼을 클릭합니다.",
    },
    {
      kind: 'close_modal',
      modalId: 'create-room',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'add_room',
      roomId: SK_RENTAL_ROOM_ID,
      title: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역) ↔ ${SK_RENTAL_HOST_NAME}`,
      participantCount: 1,
      preview: '카카오 알림톡 초대를 발송했습니다.',
      toast: {
        message: `카카오 알림톡 발송 완료 — ${SK_CHANNEL_NAME}`,
        tone: 'success',
      },
      description:
        '좌측 채널 리스트에 새 카카오 상담톡 채널이 추가되고 토스트가 표시됩니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: 'PC 본문에서 새 채널이 선택됩니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_HOST_ID,
      displayName: SK_RENTAL_HOST_DISPLAY,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트 정대리가 참여자에 포함됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `입장: ${SK_RENTAL_HOST_NAME} (SK렌터카 영업1팀) — ${SK_CHANNEL_NAME}`,
      description: 'PC 본문 시스템 메시지로 호스트 입장이 기록됩니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-alimtalk-invite',
      title: `${SK_CHANNEL_NAME} 초대장 (카카오 알림톡)`,
      body: `${SK_RENTAL_CUST_PARK_NAME} 고객님. 요청하신 K3 1년 단기렌탈 상담을 위해 ${SK_CHANNEL_NAME} 으로 초대드렸습니다. 초대를 수락하시면 상담이 시작됩니다.`,
      ctaLabel: '초대 수락',
      description:
        '박찬호 고객의 개인 카카오톡에 비즈뿌리오 알림톡 카드가 도착합니다.',
    },
  ],
  // 2. 박찬호 "초대 수락" → 카카오 상담톡 공식 채널 입장
  [
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-alimtalk-invite',
      description:
        '박찬호가 알림톡의 "초대 수락" 을 눌러 카카오 상담톡 공식 채널로 진입합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_CUST_PARK_ID,
      displayName: SK_RENTAL_CUST_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '참여자 정보에 박찬호(외부 고객) 가 추가됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `입장: ${SK_RENTAL_CUST_PARK_NAME} (한솔무역 대표) · ${SK_CHANNEL_NAME} — 본 채널은 비즈니스 채널이며 대화 이력이 SK렌터카 시스템에 보관됩니다.`,
      description:
        '비즈니스 채널 고지가 시스템 메시지로 기록됩니다.',
    },
  ],
];

const stepTitles = [
  'PC 에서 카카오 알림톡으로 고객 초대',
  '박찬호 "초대 수락" → 비즈니스 채널 입장',
];

const stepDescriptions = [
  '정대리가 외부 고객 검색에서 박찬호를 선택하고 카카오 알림톡 발송을 켠 채로 채널을 생성합니다. 비즈뿌리오 알림톡 카드가 고객 개인 카톡에 도착합니다.',
  '박찬호가 알림톡 카드의 "초대 수락" 버튼을 누르면 SK렌터카 공식 카카오 상담톡 채널에 입장하고, 시스템이 비즈니스 채널임을 고지합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-invite-${(i + 1).toString().padStart(2, '0')}`,
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
    '카카오 알림톡(비즈뿌리오) 으로 외부 고객을 SK렌터카 공식 채널에 초대',
    '초대 수락 시 비즈니스 채널임을 명확히 고지하여 외부채널 사용 차단',
  ],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

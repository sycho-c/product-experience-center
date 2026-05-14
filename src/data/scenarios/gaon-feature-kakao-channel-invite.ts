import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-feature-kakao-channel-invite.meta';
import {
  GAON_HOST_DISPLAY,
  GAON_HOST_ID,
  GAON_HOST_NAME,
  GAON_PARK_DISPLAY,
  GAON_PARK_ID,
  GAON_PARK_NAME,
  GAON_ROOM_ID,
  createGaonSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
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
      value: GAON_PARK_NAME,
      description: `검색창에 '${GAON_PARK_NAME}' 를 입력합니다.`,
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.external.eu-011',
      on: true,
      description: '미우케이블 박대표를 선택합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.next',
      description: "'다음' 버튼을 눌러 채널 설정 단계로 이동합니다.",
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
      value: '미우케이블 박대표 ↔ 가온 영업',
      description: '대화방 제목이 자동 채워집니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.kakao',
      on: true,
      description: '카카오 상담톡 알림으로 초대장을 발송하기를 켭니다.',
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
      roomId: GAON_ROOM_ID,
      title: '미우케이블 박대표 ↔ 가온 영업',
      participantCount: 1,
      preview: '카카오 상담톡 초대를 발송했습니다.',
      toast: {
        message: '카카오 상담톡 발송 완료 — 미우케이블 박대표',
        tone: 'success',
      },
      description: '좌측 채널 리스트에 새 채널이 추가됩니다.',
    },
    {
      kind: 'select_room',
      roomId: GAON_ROOM_ID,
      description: 'PC 본문에서 새 채널이 선택됩니다.',
    },
    {
      kind: 'add_participant',
      roomId: GAON_ROOM_ID,
      participantId: GAON_HOST_ID,
      displayName: GAON_HOST_DISPLAY,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트 강승희가 참여자에 포함됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: GAON_ROOM_ID,
      content: `입장: ${GAON_HOST_NAME} (가온전선 영업팀)`,
      description: '본문 시스템 메시지로 호스트 입장이 기록됩니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'gaon-invite',
      title: '미우케이블 박대표 ↔ 가온 영업',
      body: `${GAON_HOST_NAME} 님이 협업 채널에 초대했습니다. 앞으로 이 채널에서 견적·발주 협의를 진행해 주세요.`,
      ctaLabel: '초대 수락',
      description:
        '박대표 개인 카카오톡에 카카오 상담톡 알림 카드가 도착합니다.',
    },
  ],
  [
    {
      kind: 'mobile_open_room',
      roomId: GAON_ROOM_ID,
      noticeId: 'gaon-invite',
      description: '박대표가 초대를 수락해 협업 채널에 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: GAON_ROOM_ID,
      participantId: GAON_PARK_ID,
      displayName: GAON_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '거래처에 박대표가 추가됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: GAON_ROOM_ID,
      content: `입장: ${GAON_PARK_NAME} (미우케이블)`,
      description: 'PC 본문에 거래처 입장 시스템 메시지가 기록됩니다.',
    },
  ],
];

const stepTitles = [
  'PC 에서 카카오 상담톡으로 거래처 초대',
  '박대표 "초대 수락" → 협업 채널 입장',
];
const stepDescriptions = [
  '강승희가 외부 검색에서 미우케이블 박대표를 선택해 카카오 상담톡 알림을 켠 채로 채널을 생성합니다.',
  '박대표가 모바일 카톡 알림 카드의 "초대 수락" 을 눌러 협업 채널에 입장합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-feat-invite-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['외부 거래처를 회사 협업채널로 끌어들여 응대 시작점을 확립'],
  seed: createGaonSeed(),
  steps,
};

export default scenario;

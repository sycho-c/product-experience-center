import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-flow-workday.meta';
import {
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  // 1. 출근 → 법인폰 생체 인증 로그인
  [
    {
      kind: 'fill_input',
      field: 'login.id',
      value: 'jms.jung',
      description: '정대리가 사번 ID 를 입력합니다.',
    },
    {
      kind: 'fill_input',
      field: 'login.pw',
      value: '••••••••••',
      description: '비밀번호 입력.',
    },
    {
      kind: 'click_button',
      buttonId: 'login.submit',
      description: '1차 인증을 통과합니다.',
    },
    {
      kind: 'show_toast',
      message: '2차 인증 — 생체 인증 (지문)',
      tone: 'info',
      description: '지문 인식으로 본인 확인.',
    },
    {
      kind: 'show_toast',
      message: '로그인 완료 · 토큰 30일 보관',
      tone: 'success',
      description: '생체 인증 성공 후 메인 화면 진입.',
    },
  ],
  // 2. 외근 중 FCM 푸시 도착 → 진입
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '단기렌탈 견적 추가로 카니발도 한 대 받아볼 수 있을까요?',
      deviceTarget: 'all',
      description: '박찬호가 카카오 상담톡 채널에 추가 견적 문의를 남깁니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-workday-push',
      title: 'FCM 푸시 — 새 메시지',
      body: `${SK_RENTAL_CUST_PARK_NAME}: 단기렌탈 견적 추가로 카니발도 한 대...`,
      ctaLabel: '대화하기',
      description: '외근 중인 정대리 법인폰에 FCM 푸시 도착.',
    },
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-workday-push',
      description: '정대리가 푸시를 탭해 채널 진입.',
    },
  ],
  // 3. 응대 + 후속 할 일
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '네 대표님, 카니발 3년 장기 단기렌탈 견적 함께 정리해서 1시간 내로 보내드리겠습니다.',
      deviceTarget: 'all',
      description: '정대리가 외근 중에도 즉시 응대.',
    },
    {
      kind: 'show_toast',
      message: '응대 시간 1분 42초 · 5분 KPI 달성',
      tone: 'success',
      description: '외부 채널 사용 없이 회사 채널 안에서 응대 완결.',
    },
  ],
  // 4. 1일 마감 + DB Mart 적재
  [
    {
      kind: 'set_section',
      section: 'talk',
      description: '하루를 마감하며 채널로 돌아옵니다.',
    },
    {
      kind: 'show_toast',
      message:
        '오늘 응대 32건 · 메시지 482건 · 파일 78건 · 외부 채널 사용 0건 — DB Mart 적재 완료',
      tone: 'success',
      description: '1일 마감 통계 토스트.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: '✓ 1일 마감 — 모든 응대 내역 SK렌터카 자산화 (Action Power)',
      description: '회사 자산화 완료 시스템 메시지.',
    },
  ],
];

const stepTitles = [
  '출근 → 생체 인증 로그인',
  '외근 중 FCM 푸시 → 채널 진입',
  '응대 + 후속 안내',
  '1일 마감 + DB Mart 적재',
];

const stepDescriptions = [
  '법인폰 SalesBridge 앱에 ID/PW 입력 + 지문 생체 인증으로 로그인. 토큰은 30일 보관.',
  '외근 중 박찬호가 추가 견적 문의를 보내자 법인폰에 FCM 푸시 카드 도착. 푸시 탭으로 채널 진입.',
  '정대리가 외근 환경에서 5분 내로 응대 완결.',
  '하루 마감 — 모든 응대 데이터가 DB Mart 에 자산화됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-flow-workday-${(i + 1).toString().padStart(2, '0')}`,
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
    '영업사원이 어디서든 5분 내 응대 KPI 를 달성할 수 있는 1일 운영 흐름',
  ],
  seed: createSkRentalSeed({ includePostInvite: true }),
  steps,
};

export default scenario;

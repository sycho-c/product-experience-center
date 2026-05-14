import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-fcm-push-inbound.meta';
import {
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const PARK_FOLLOWUP_MSG_ID = 'sk-fcm-park-followup';
const HOST_REPLY_MSG_ID = 'sk-fcm-host-reply';

const stepActions: UIAction[][] = [
  // 1. 박찬호 후속 문의 메시지 → 정대리 법인폰 FCM 푸시 도착
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: PARK_FOLLOWUP_MSG_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content:
        '추가로 K3 차종 사진과 옵션 안내도 함께 받아볼 수 있을까요? 의사결정에 도움이 될 것 같습니다.',
      deviceTarget: 'all',
      description:
        '박찬호가 카카오 상담톡 공식 채널에 추가 문의를 남깁니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-fcm-inbound',
      title: 'FCM 푸시 — 새 메시지',
      body: `${SK_RENTAL_CUST_PARK_NAME}: 추가로 K3 차종 사진과 옵션 안내도 함께 받아볼 수 있을까요?`,
      ctaLabel: '대화하기',
      description:
        '외근 중인 정대리 법인폰 SalesBridge 앱에 FCM 푸시가 즉시 도착합니다.',
    },
  ],
  // 2. 정대리 푸시 탭 → 채널 진입 → 응대
  [
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-fcm-inbound',
      description:
        '정대리가 푸시 카드의 "대화하기" 를 탭해 법인폰에서 같은 채널로 진입합니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: HOST_REPLY_MSG_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '네 대표님, 방금 외근 중에 푸시 받았습니다. K3 차종 사진 3장과 옵션 안내 바로 보내드리겠습니다.',
      deviceTarget: 'all',
      description:
        '정대리가 법인폰에서 즉시 응대합니다 — 외부 채널 사용 없이 회사 채널 안에서 완결.',
    },
    {
      kind: 'show_toast',
      message:
        '응대 시간 1분 23초 (목표 5분 이내) · DB Mart 적재 진행 중',
      tone: 'success',
      description:
        '외근 환경에서도 5분 이내 응대 KPI 를 달성하고, 대화는 DB Mart 로 적재됩니다.',
    },
  ],
];

const stepTitles = [
  '고객 추가 문의 → 법인폰 FCM 푸시',
  '푸시 탭 → 채널 진입 → 즉시 응대',
];

const stepDescriptions = [
  '박찬호가 SK렌터카 카카오 상담톡 공식 채널에 추가 문의를 남기자, 외근 중인 정대리 법인폰 SalesBridge 앱에 FCM 푸시 카드가 즉시 도착합니다.',
  '정대리가 푸시 카드의 "대화하기" 를 탭해 법인폰에서 같은 채널로 진입하고 즉시 응대합니다. 외부 카톡으로 새지 않고 회사 채널 안에서 1분 내 완결됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-fcm-${(i + 1).toString().padStart(2, '0')}`,
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
    '외근 중인 영업사원이 고객 메시지를 5분 내 인지·응대 (FCM 푸시)',
    '응대 채널을 외부 개인 카톡이 아닌 회사 공식 채널 안에서 완결',
  ],
  seed: createSkRentalSeed({ includePostInvite: true }),
  steps,
};

export default scenario;

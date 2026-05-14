import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-pc-2fa-push.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'pc.login',
      description: 'PC SalesBridge 로그인 화면이 표시됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'pc.login.id',
      value: 'jms.jung',
      description: 'PC 에서 사번 ID 를 입력합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'pc.login.send-to-mobile',
      description: '"모바일 앱으로 인증하기" 버튼을 누릅니다.',
    },
    {
      kind: 'show_toast',
      message: 'POST /if/customadapter/fcm/push/auth/biometric — requestId=bio-uuid',
      tone: 'info',
      description:
        'customAdapter 가 FCM 으로 정대리 법인폰에 인증 푸시를 발송합니다.',
    },
  ],
  [
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-pc-2fa',
      title: 'PC 로그인 인증 요청',
      body: 'PC SalesBridge 로그인 요청이 도착했습니다. 본인 확인을 위해 생체 인증을 진행해 주세요.',
      ctaLabel: '인증하기',
      description: '법인폰에 FCM 푸시 카드가 도착합니다.',
    },
    {
      kind: 'show_toast',
      message: '모바일 생체 인증 진행 — 지문 인식',
      tone: 'info',
      description: '정대리가 푸시를 탭하면 BiometricPrompt 가 표시됩니다.',
    },
    {
      kind: 'show_toast',
      message: '인증 결과 회신 → customAdapter 상태 저장 (APPROVED)',
      tone: 'success',
      description:
        '생체 인증 성공 후 결과가 customAdapter 에 저장됩니다.',
    },
  ],
  [
    {
      kind: 'show_toast',
      message:
        'GET /if/customadapter/fcm/push/auth/biometric/status/{requestId} · APPROVED 수신',
      tone: 'info',
      description:
        'PC 는 polling 으로 결과 조회 후 APPROVED 응답을 받습니다.',
    },
    {
      kind: 'show_toast',
      message: 'PC 로그인 완료 — twoFactorAuthCompleted = true',
      tone: 'success',
      description: 'PC 로그인 버튼이 활성화되어 메인 화면으로 진입합니다.',
    },
  ],
];

const stepTitles = [
  'PC ID 입력 → 모바일 인증 요청',
  '법인폰 푸시 → 생체 인증',
  'PC polling → 로그인 완료',
];
const stepDescriptions = [
  '정대리가 PC SalesBridge 에서 사번 입력 후 "모바일 앱으로 인증하기" 를 눌러 FCM 푸시를 발송합니다.',
  '법인폰에 푸시가 도착해 BiometricPrompt 로 본인 확인을 진행합니다.',
  'PC 가 polling 으로 인증 결과를 받아 로그인을 완성합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-pc2fa-${(i + 1).toString().padStart(2, '0')}`,
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
    'PC 로그인 시에도 법인폰 생체 인증을 필수화하여 ID/PW 만 알아도 접속 불가',
  ],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

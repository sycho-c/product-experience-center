import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-biometric-login.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'highlight',
      selector: 'login.id',
      description: '법인폰 SalesBridge 로그인 화면이 표시됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'login.id',
      value: 'jms.jung',
      description: '사번 ID 를 입력합니다.',
    },
    {
      kind: 'fill_input',
      field: 'login.pw',
      value: '••••••••••',
      description: '비밀번호를 입력합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'login.submit',
      description: '로그인 버튼을 눌러 1차 인증을 완료합니다.',
    },
  ],
  [
    {
      kind: 'show_toast',
      message: 'biometricUtil.checkBiometricAvailability() · 지문/얼굴 등록 확인',
      tone: 'info',
      description:
        'AndroidBridge 로 디바이스 생체 등록 여부를 5초 타임아웃 내에 확인합니다.',
    },
    {
      kind: 'show_toast',
      message: '2차 인증 — 생체인증으로 본인 확인 (지문 인식)',
      tone: 'info',
      description:
        'BiometricPrompt 가 표시되어 사용자가 지문 또는 얼굴로 본인 확인을 수행합니다.',
    },
    {
      kind: 'show_toast',
      message: '인증 완료 · 로그인 유지 30일 (앱 스토리지에 토큰 보관)',
      tone: 'success',
      description:
        '생체 인증 성공 후 access_token / client_id 가 앱 스토리지에 30일 보관됩니다.',
    },
  ],
];

const stepTitles = [
  'ID / PW 1차 인증',
  '생체 인증(지문/얼굴) → 메인 진입',
];
const stepDescriptions = [
  '정대리가 사번 ID 와 비밀번호로 1차 인증을 통과합니다.',
  'BiometricPrompt 가 지문 또는 얼굴로 2차 인증을 요청하고, 성공 시 토큰이 30일 보관되어 자동 로그인됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-bio-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['법인폰 분실/도용 시에도 생체 인증이 없으면 접속 불가 — 보안 강화'],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

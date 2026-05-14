import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-password-toggle.meta';
import { createSkRentalSeed } from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'fill_input',
      field: 'login.pw',
      value: '••••••••••',
      description: '사용자가 비밀번호를 입력해 마스킹 상태로 표시됩니다.',
    },
    {
      kind: 'highlight',
      selector: 'login.pw.toggle',
      description: '비밀번호 입력란 우측의 👁 아이콘을 안내합니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'login.pw.visible',
      on: true,
      description: '👁 아이콘을 클릭해 비밀번호 평문 표시를 켭니다.',
    },
    {
      kind: 'fill_input',
      field: 'login.pw',
      value: 'tmvprxmfk2@',
      description: '비밀번호가 평문 "tmvprxmfk2@" 로 노출됩니다.',
    },
    {
      kind: 'show_toast',
      message: '입력값 확인 가능 — 다시 누르면 마스킹으로 복귀',
      tone: 'info',
      description: '사용자가 자신이 입력한 값이 맞는지 확인하고 다시 마스킹으로 돌아갈 수 있습니다.',
    },
  ],
];

const stepTitles = ['👁 토글로 비밀번호 평문 확인'];
const stepDescriptions = [
  '로그인 화면에서 👁 아이콘으로 비밀번호 마스킹과 평문 표시를 토글합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-pw-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['비밀번호 오타 방지 — 작은 UX 개선'],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

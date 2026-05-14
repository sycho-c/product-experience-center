import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-db-mart-export.meta';
import {
  SK_RENTAL_ROOM_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'set_section',
      section: 'talk',
      description: '카카오 상담톡 채널 화면에서 1일 마감 요약을 확인합니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: '대표 채널을 선택해 마감 메시지를 채널 안에 표시합니다.',
    },
    {
      kind: 'show_toast',
      message:
        '오늘 응대 32건 · 신규 고객 5명 · 메시지 482건 · 파일 78건 · 사업자 메타 5건 — DB Mart 적재 완료',
      tone: 'success',
      description:
        '상담이력 API 를 통해 Action Power 가 DB Mart 에 일괄 적재합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content:
        '✓ 1일 마감 · 외부 채널(개인 카톡) 사용 0건 · 대화방·메시지·고객 정보 API 정상',
      description:
        '모든 대화·파일·고객 메타가 SK렌터카 시스템 자산이 되었음을 시스템 메시지로 정리합니다.',
    },
  ],
];

const stepTitles = ['1일 응대 요약 → DB Mart 자산화'];
const stepDescriptions = [
  '오늘 카카오 상담톡 채널에 쌓인 응대 데이터가 Action Power 파이프라인을 통해 DB Mart 에 자산화됩니다. 외부 채널 사용 0건.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-dbm-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['상담이력 API → DB Mart 자산화 흐름을 1분 안에 체험'],
  seed: createSkRentalSeed({ includePostInvite: true }),
  steps,
};

export default scenario;

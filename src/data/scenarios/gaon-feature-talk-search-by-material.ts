import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-feature-talk-search-by-material.meta';
import {
  GAON_MATERIAL_CODE,
  GAON_PARK_ID,
  GAON_PARK_NAME,
  GAON_ROOM_ID,
  createGaonSeed,
} from './_shared-seeds';

const PARK_REORDER_MSG_ID = 'gn-feat-search-reorder';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'append_system_message',
      roomId: GAON_ROOM_ID,
      content: '— 두 달 후, 동일 자재 재발주 시점 —',
      description: '시간 흐름을 시스템 메시지로 안내합니다.',
    },
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      messageId: PARK_REORDER_MSG_ID,
      from: {
        role: 'customer',
        userId: GAON_PARK_ID,
        displayName: GAON_PARK_NAME,
      },
      content: `지난번 ${GAON_MATERIAL_CODE} 그대로 같은 단가로 한 번 더 부탁드려요. (재발주)`,
      deviceTarget: 'all',
      description:
        '박대표가 자재번호를 인용해 재발주를 요청합니다.',
    },
    {
      kind: 'highlight',
      selector: 'sidebar.talk-search',
      description: "좌측 사이드바의 '대화 조회' 메뉴를 안내합니다.",
    },
    {
      kind: 'set_section',
      section: 'talk-search',
      description:
        "'대화 조회' 메뉴로 이동합니다 — 회사 전체 대화·메시지·파일 통합 조회 화면.",
    },
  ],
  [
    {
      kind: 'set_talk_search',
      tab: 'messages',
      description:
        "'메시지' 탭으로 전환합니다 — 메시지 단위로 키워드 검색이 가능합니다.",
    },
    {
      kind: 'set_talk_search',
      keyword: GAON_MATERIAL_CODE,
      description: `검색어로 자재번호 '${GAON_MATERIAL_CODE}' 를 입력합니다.`,
    },
    {
      kind: 'show_toast',
      message: `'${GAON_MATERIAL_CODE}' 관련 메시지·파일이 회사 전체에서 검색되었습니다.`,
      tone: 'success',
      description:
        '해당 자재가 언급된 과거 대화·메시지·첨부 파일이 한 화면에 정렬됩니다.',
    },
  ],
];

const stepTitles = [
  '재발주 메시지 → 대화 조회 메뉴 진입',
  '자재번호 검색 → 회사 전체 메시지 조회',
];
const stepDescriptions = [
  '동일 자재 재발주가 들어오자 강승희가 좌측 사이드바의 대화 조회 메뉴로 이동합니다.',
  '메시지 탭에서 자재번호를 입력해 회사 전체에서 해당 자재가 언급된 메시지·파일을 통합 조회합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-feat-search-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['자재번호 같은 업무 키워드로 회사 전체 대화·파일을 즉시 검색'],
  seed: createGaonSeed({ includeQuoteSent: true }),
  steps,
};

export default scenario;

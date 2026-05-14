import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-feature-file-library-reuse.meta';
import {
  GAON_HOST_ID,
  GAON_HOST_NAME,
  GAON_HOST_REUSE_MSG_ID,
  GAON_PAST_QUOTE_FILE,
  GAON_ROOM_ID,
  createGaonSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'set_section',
      section: 'talk',
      description:
        '검색에서 과거 견적서를 확인한 뒤 협업 채널로 돌아옵니다.',
    },
    {
      kind: 'select_room',
      roomId: GAON_ROOM_ID,
      description: '미우케이블 박대표 협업 채널을 다시 엽니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-file-quote-v0',
      name: GAON_PAST_QUOTE_FILE.name,
      size: GAON_PAST_QUOTE_FILE.size,
      mime: GAON_PAST_QUOTE_FILE.mime,
      description: '7월 견적서를 현재 채널의 파일 라이브러리에 연결합니다.',
    },
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      messageId: GAON_HOST_REUSE_MSG_ID,
      from: {
        role: 'me',
        userId: GAON_HOST_ID,
        displayName: GAON_HOST_NAME,
      },
      content:
        '7월에 전달드렸던 견적과 동일 조건입니다. 같은 단가로 진행 가능합니다.',
      attachments: [GAON_PAST_QUOTE_FILE],
      deviceTarget: 'all',
      description:
        '강승희가 검색으로 찾은 과거 견적서를 그대로 재첨부해 답변합니다.',
    },
  ],
  [
    {
      kind: 'append_system_message',
      roomId: GAON_ROOM_ID,
      content: '✓ 모든 첨부 파일은 미우케이블 대화 라이브러리에 자동 보관',
      description:
        '회사 시스템 안에 대화·파일·이력이 함께 보관됨을 시스템 메시지로 정리합니다.',
    },
    {
      kind: 'show_toast',
      message: '이 협업 채널의 파일 4건은 가온 영업팀 BR 모두 검색 가능합니다.',
      tone: 'success',
      description:
        '파일이 개인 자산이 아니라 팀 자산으로 보관됨을 토스트로 안내합니다.',
    },
    {
      kind: 'highlight',
      selector: 'file-library-shortcut',
      description:
        '우측 레일의 파일 라이브러리 단축키를 강조하여 회사 차원 파일 가시성을 보여줍니다.',
    },
  ],
];

const stepTitles = [
  '과거 견적서 재첨부 응대',
  '회사 차원 파일 라이브러리 가시성',
];
const stepDescriptions = [
  '검색에서 확인한 7월 견적서를 협업 채널로 돌아와 그대로 재첨부해 응대합니다.',
  '모든 첨부 파일이 채널 라이브러리에 자동 보관되어 영업팀 전체가 검색·재활용할 수 있음을 안내합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-feat-reuse-${(i + 1).toString().padStart(2, '0')}`,
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
    '검색에서 찾은 과거 자료를 그대로 새 응대에 재활용해 응답 속도 가속',
    '파일이 BR 개인 자산이 아닌 팀 자산으로 회사 차원에 보관',
  ],
  seed: createGaonSeed({ includeQuoteSent: true }),
  steps,
};

export default scenario;

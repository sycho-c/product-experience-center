import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-flow-quote-cycle.meta';
import {
  GAON_DRAWING_FILE,
  GAON_HOST_ID,
  GAON_HOST_NAME,
  GAON_HOST_QUOTE_MSG_ID,
  GAON_HOST_REPLY_MSG_ID,
  GAON_MATERIAL_CODE,
  GAON_PARK_ID,
  GAON_PARK_NAME,
  GAON_QUOTE_FILE,
  GAON_ROOM_ID,
  GAON_SPEC_FILE,
  GAON_TASK_ID,
  createGaonSeed,
} from './_shared-seeds';

const PARK_REORDER_MSG_ID = 'gn-flow-reorder';
const PARK_SPEC_MSG_ID = 'gn-flow-spec';

const stepActions: UIAction[][] = [
  // 1. 박대표 사양서 PDF 수신
  [
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      messageId: PARK_SPEC_MSG_ID,
      from: {
        role: 'customer',
        userId: GAON_PARK_ID,
        displayName: GAON_PARK_NAME,
      },
      content: '9월 발주 사양서입니다. 확인 부탁드려요.',
      attachments: [GAON_SPEC_FILE],
      deviceTarget: 'all',
      description: '박대표가 9월 발주 사양서 PDF 를 채널에 전송합니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-flow-file-spec',
      name: GAON_SPEC_FILE.name,
      size: GAON_SPEC_FILE.size,
      mime: GAON_SPEC_FILE.mime,
      description: '사양서가 채널 파일 라이브러리에 자동 보관됩니다.',
    },
  ],
  // 2. 강승희 답변 + 할 일 chip 등록
  [
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      messageId: GAON_HOST_REPLY_MSG_ID,
      from: {
        role: 'me',
        userId: GAON_HOST_ID,
        displayName: GAON_HOST_NAME,
      },
      content: '사양 확인했습니다. 오늘 오후 4시까지 견적 회신드리겠습니다.',
      deviceTarget: 'all',
      description: '강승희가 처리 약속 답변을 남깁니다.',
    },
    {
      kind: 'add_task',
      roomId: GAON_ROOM_ID,
      taskId: GAON_TASK_ID,
      title: `9월 출하 견적 회신 (마감 오늘 16:00, ${GAON_MATERIAL_CODE})`,
      assignee: GAON_HOST_NAME,
      status: '진행중',
      sourceMessageId: GAON_HOST_REPLY_MSG_ID,
      description: '메시지에서 곧바로 할 일을 등록해 마감을 추적합니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: GAON_ROOM_ID,
      messageId: GAON_HOST_REPLY_MSG_ID,
      taskId: GAON_TASK_ID,
      title: '9월 출하 견적 회신',
      description: '메시지 하단에 처리중 할 일 chip 이 부착됩니다.',
    },
  ],
  // 3. 견적·도면 회신 + 할 일 완료
  [
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      messageId: GAON_HOST_QUOTE_MSG_ID,
      from: {
        role: 'me',
        userId: GAON_HOST_ID,
        displayName: GAON_HOST_NAME,
      },
      content: `견적서와 도면 함께 전달드립니다. 자재코드 ${GAON_MATERIAL_CODE} 기준입니다.`,
      attachments: [GAON_QUOTE_FILE, GAON_DRAWING_FILE],
      deviceTarget: 'all',
      description: '강승희가 견적서와 도면을 한 메시지에 첨부해 전송합니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-flow-file-quote',
      name: GAON_QUOTE_FILE.name,
      size: GAON_QUOTE_FILE.size,
      mime: GAON_QUOTE_FILE.mime,
      description: '견적서가 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-flow-file-drawing',
      name: GAON_DRAWING_FILE.name,
      size: GAON_DRAWING_FILE.size,
      mime: GAON_DRAWING_FILE.mime,
      description: '도면이 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'update_task_chip_status',
      roomId: GAON_ROOM_ID,
      messageId: GAON_HOST_REPLY_MSG_ID,
      taskId: GAON_TASK_ID,
      status: '완료',
      description: '회신 완료에 따라 할 일 chip 이 완료로 갱신됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      from: {
        role: 'customer',
        userId: GAON_PARK_ID,
        displayName: GAON_PARK_NAME,
      },
      content: '잘 받았습니다. 단가 확인 후 발주 진행하겠습니다.',
      deviceTarget: 'all',
      description: '박대표가 수신 확인 메시지를 남깁니다.',
    },
  ],
  // 4. 두 달 후 재발주 → 자재번호 검색 → 과거 견적 재첨부
  [
    {
      kind: 'append_system_message',
      roomId: GAON_ROOM_ID,
      content: '— 두 달 후, 동일 자재 재발주 시점 —',
      description: '시간 흐름 안내.',
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
      description: '박대표가 자재번호를 인용해 재발주를 요청합니다.',
    },
    {
      kind: 'set_section',
      section: 'talk-search',
      description: '강승희가 대화 조회 메뉴로 이동합니다.',
    },
    {
      kind: 'set_talk_search',
      tab: 'messages',
      keyword: GAON_MATERIAL_CODE,
      description: `자재번호 '${GAON_MATERIAL_CODE}' 로 회사 전체 메시지를 조회합니다.`,
    },
    {
      kind: 'show_toast',
      message: `'${GAON_MATERIAL_CODE}' 관련 7월 견적서 발견 — 협업 채널로 돌아가 재첨부`,
      tone: 'success',
      description: '검색 결과에서 과거 자료를 찾아 응답을 가속합니다.',
    },
    {
      kind: 'set_section',
      section: 'talk',
      description: '협업 채널로 돌아옵니다.',
    },
    {
      kind: 'select_room',
      roomId: GAON_ROOM_ID,
      description: '미우케이블 박대표 채널을 다시 엽니다.',
    },
    {
      kind: 'append_chat',
      roomId: GAON_ROOM_ID,
      from: {
        role: 'me',
        userId: GAON_HOST_ID,
        displayName: GAON_HOST_NAME,
      },
      content:
        '7월 견적과 동일 조건입니다. 같은 단가로 진행 가능합니다.',
      attachments: [GAON_QUOTE_FILE],
      deviceTarget: 'all',
      description:
        '검색에서 찾은 과거 견적서를 재첨부해 빠르게 응대합니다.',
    },
    {
      kind: 'show_toast',
      message: '발주 사이클 완성 — 사양·견적·도면·재발주 모두 회사 자산',
      tone: 'success',
      description:
        '한 거래처의 발주 사이클이 외부 채널 없이 회사 자산화되었습니다.',
    },
  ],
];

const stepTitles = [
  '사양서 PDF 수신',
  '답변 + 할 일 chip 등록',
  '견적·도면 회신 + 할 일 완료',
  '두 달 후 재발주 → 검색 → 과거 견적 재첨부',
];

const stepDescriptions = [
  '박대표가 9월 발주 사양서 PDF 를 협업 채널에 전송합니다. 파일이 자동으로 채널 라이브러리에 보관됩니다.',
  '강승희가 처리 약속 답변을 남기고 메시지에서 곧바로 할 일을 등록해 마감을 추적합니다.',
  '강승희가 견적서·도면을 한 메시지에 첨부해 회신하고 할 일 chip 을 완료로 갱신합니다.',
  '두 달 뒤 동일 자재 재발주가 들어오자 대화 조회로 자재번호를 검색해 7월 견적서를 그대로 재첨부합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-flow-quote-${(i + 1).toString().padStart(2, '0')}`,
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
    '한 거래처의 발주 사이클이 외부 채널 없이 회사 자산화되는 모습 시연',
    '대화 조회 + 파일 라이브러리로 재발주 시 응답 속도 가속',
  ],
  seed: createGaonSeed({ includeChannelSetup: true }),
  steps,
};

export default scenario;

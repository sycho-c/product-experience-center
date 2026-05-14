import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-feature-multi-file-message.meta';
import {
  GAON_DRAWING_FILE,
  GAON_HOST_ID,
  GAON_HOST_NAME,
  GAON_HOST_QUOTE_MSG_ID,
  GAON_MATERIAL_CODE,
  GAON_QUOTE_FILE,
  GAON_ROOM_ID,
  createGaonSeed,
} from './_shared-seeds';

const stepActions: UIAction[][] = [
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
      description:
        '강승희가 견적서(xlsx) 와 도면(dwg) 두 파일을 한 메시지에 첨부해 전송합니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-file-quote-v1',
      name: GAON_QUOTE_FILE.name,
      size: GAON_QUOTE_FILE.size,
      mime: GAON_QUOTE_FILE.mime,
      description: '견적서가 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'attach_file',
      roomId: GAON_ROOM_ID,
      fileId: 'gn-file-drawing',
      name: GAON_DRAWING_FILE.name,
      size: GAON_DRAWING_FILE.size,
      mime: GAON_DRAWING_FILE.mime,
      description: '도면이 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'show_toast',
      message: '파일 2건 한 메시지로 전송 — 채널 라이브러리에 모두 보관',
      tone: 'success',
      description: '한 풍선에 견적서·도면이 동시 첨부되어 보입니다.',
    },
  ],
];

const stepTitles = ['견적서·도면 한 메시지 동시 첨부'];
const stepDescriptions = [
  '강승희가 견적서(xlsx) 와 도면(dwg) 을 한 메시지에 첨부해 보냅니다. 두 파일이 동시에 채널 파일 라이브러리로 보관됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-feat-multi-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['한 메시지에 여러 파일 첨부로 컨텍스트 분리 없이 자산화'],
  seed: createGaonSeed({ includeSpecMessage: true }),
  steps,
};

export default scenario;

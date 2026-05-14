import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-feature-multi-image.meta';
import {
  SK_K3_CAR_IMAGES,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const HOST_IMAGES_MSG_ID = 'sk-multi-host-images';

const stepActions: UIAction[][] = [
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: HOST_IMAGES_MSG_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        'K3 차종 사진 3장 보내드립니다. 전면 · 측면 · 내부 순으로 확인해 주세요.',
      attachments: SK_K3_CAR_IMAGES,
      deviceTarget: 'all',
      description:
        '정대리가 K3 차종 사진 3장을 한 메시지에 첨부해 전송합니다. 풍선 안에 카톡 스타일 그리드로 표시됩니다.',
    },
    {
      kind: 'show_toast',
      message: '이미지 3건 전송 — 풍선 1개에 카카오톡 스타일 그리드',
      tone: 'success',
      description:
        '3장은 좌측 큰 칸 + 우측 2장 카톡 그리드로, 4장 이상이면 2x2 형태로 렌더됩니다.',
    },
  ],
];

const stepTitles = ['K3 차종 사진 3장 한 풍선으로 전송'];
const stepDescriptions = [
  '정대리가 K3 차종 사진 3장을 한 메시지에 첨부해 보냅니다. 카카오톡 스타일 그리드로 묶음 전송되어 보입니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-feat-multi-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['차종/계약 관련 이미지를 한 메시지에 묶어 카톡과 동일 UX 로 전달'],
  seed: createSkRentalSeed({ includePostInvite: true }),
  steps,
};

export default scenario;

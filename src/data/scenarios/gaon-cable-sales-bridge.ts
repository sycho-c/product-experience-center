import type { Scenario, Step } from '@/types/scenario';
import type { TalkAttachment } from '@/types/talk';
import type { UIAction } from '@/types/uiaction';
import { meta } from './gaon-cable-sales-bridge.meta';

const ROOM_ID = 'gn-room';
const KAKAO_ROOM_ID = 'gn-kakao-room';

const HOST_ID = 'gn-host';
const PARK_ID = 'gn-park';
const HOST_NAME = '강승희';
const PARK_NAME = '박대표';
const HOST_DISPLAY = `${HOST_NAME}(영업팀)`;
const PARK_DISPLAY = `${PARK_NAME}(미우케이블)`;

// 자재번호 — 통합 검색 키워드로 재등장
const MATERIAL_CODE = 'CC-22-150SQ';

// 파일 메타 — 메시지 풍선 첨부 + RightRail 파일 라이브러리에 동일 fileId 로 등록
const SPEC_FILE: TalkAttachment = {
  name: '미우케이블_9월_요청사양서.pdf',
  size: 248320,
  mime: 'application/pdf',
};
const QUOTE_FILE: TalkAttachment = {
  name: `가온_${MATERIAL_CODE}_견적서_v1.xlsx`,
  size: 64512,
  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const DRAWING_FILE: TalkAttachment = {
  name: `${MATERIAL_CODE}_도면.dwg`,
  size: 1342176,
  mime: 'application/acad',
};
const PAST_QUOTE_FILE: TalkAttachment = {
  name: `가온_${MATERIAL_CODE}_견적서_v0.xlsx`,
  size: 58980,
  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

// 메시지 ID — 후속 액션이 참조
const PARK_SPEC_MSG_ID = 'gn-park-spec';
const HOST_REPLY_MSG_ID = 'gn-host-reply';
const HOST_QUOTE_MSG_ID = 'gn-host-quote';
const PARK_REORDER_MSG_ID = 'gn-park-reorder';
const HOST_REUSE_MSG_ID = 'gn-host-reuse';

const TASK_ID = 'gn-task-quote';

const stepActions: UIAction[][] = [
  // 1. 협업 채널 생성 (PC)
  [
    {
      kind: 'highlight',
      selector: 'create-room-button',
      description: "우상단 '새 대화방 만들기' 버튼을 안내합니다.",
    },
    {
      kind: 'open_modal',
      modalId: 'create-room',
      initialStep: 1,
      initialTab: 'external',
      description:
        "'대화방 생성' 모달이 열리고 1단계 '참여자 선택' — 거래처(외부) 탭이 보입니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.external.search',
      value: '박대표',
      description: "검색창에 '박대표'를 입력합니다.",
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.external.eu-011',
      on: true,
      description: '미우케이블 박대표를 선택합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.next',
      description: "'다음' 버튼을 눌러 2단계로 이동합니다.",
    },
    {
      kind: 'set_modal_step',
      modalId: 'create-room',
      step: 2,
      description: "2단계 '대화 채널 선택' 화면이 표시됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.title',
      value: '미우케이블 박대표 ↔ 가온 영업',
      description: '대화방 제목이 거래처 정보로 자동 채워집니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.kakao',
      on: true,
      description: '거래처에 카카오 상담톡 알림으로 초대장을 발송하기를 켭니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.create',
      description: "'대화방 생성' 버튼을 클릭합니다.",
    },
    {
      kind: 'close_modal',
      modalId: 'create-room',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'add_room',
      roomId: ROOM_ID,
      title: '미우케이블 박대표 ↔ 가온 영업',
      participantCount: 1,
      preview: '대화방이 생성되었습니다.',
      toast: { message: '협업 채널이 생성되었습니다.', tone: 'success' },
      description:
        '좌측 대화방 리스트에 미우케이블 협업 채널이 추가되고 토스트가 표시됩니다.',
    },
    {
      kind: 'select_room',
      roomId: ROOM_ID,
      description: 'PC 본문에서 새 협업 채널이 선택됩니다.',
    },
    {
      kind: 'add_participant',
      roomId: ROOM_ID,
      participantId: HOST_ID,
      displayName: HOST_DISPLAY,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트(영업팀 강승희)가 참여자에 포함됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: `입장: ${HOST_NAME} (가온전선 영업팀)`,
      description: '본문 시스템 메시지로 호스트 입장이 기록됩니다.',
    },
  ],
  // 2. 박대표 카카오 상담톡 알림 → 모바일 입장
  [
    {
      kind: 'mobile_push_notice',
      noticeId: 'gn-invite',
      title: '가온 협업 채널 초대 (카카오 상담톡)',
      body: `${HOST_NAME} 님이 협업 채널에 초대했습니다. 앞으로 이 채널에서 견적·발주 협의를 진행해 주세요.`,
      ctaLabel: '초대 수락',
      description:
        '동시에 박대표 모바일에 카카오 상담톡 초대 알림이 도착합니다.',
    },
    {
      kind: 'mobile_open_room',
      roomId: ROOM_ID,
      noticeId: 'gn-invite',
      description: '박대표가 모바일에서 초대를 수락하고 협업 채널에 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: ROOM_ID,
      participantId: PARK_ID,
      displayName: PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: "참여자 정보의 '거래처'에 박대표가 추가됩니다.",
    },
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: `입장: ${PARK_NAME} (미우케이블)`,
      description: 'PC 본문에도 거래처 입장 시스템 메시지가 기록됩니다.',
    },
  ],
  // 3. 박대표가 사양서 PDF 전송 (모바일)
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: PARK_SPEC_MSG_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: '9월 발주 사양서입니다. 확인 부탁드려요.',
      attachments: [SPEC_FILE],
      deviceTarget: 'all',
      description:
        '박대표가 모바일에서 9월 사양서 PDF 를 협업 채널에 전송합니다.',
    },
    {
      kind: 'attach_file',
      roomId: ROOM_ID,
      fileId: 'gn-file-spec',
      name: SPEC_FILE.name,
      size: SPEC_FILE.size,
      mime: SPEC_FILE.mime,
      description: '첨부된 사양서가 우측 파일 라이브러리에 자동 보관됩니다.',
    },
  ],
  // 4. 강승희 확인 + 할 일 chip 등록
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_MSG_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '사양 확인했습니다. 오늘 오후 4시까지 견적 회신드리겠습니다.',
      deviceTarget: 'all',
      description:
        '강승희가 협업 채널에 처리 약속과 함께 답변을 남깁니다.',
    },
    {
      kind: 'add_task',
      roomId: ROOM_ID,
      taskId: TASK_ID,
      title: `9월 출하 견적 회신 (마감 오늘 16:00, ${MATERIAL_CODE})`,
      assignee: HOST_NAME,
      status: '진행중',
      sourceMessageId: HOST_REPLY_MSG_ID,
      description:
        '메시지에서 곧바로 할 일이 등록되어 처리 추적이 시작됩니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_MSG_ID,
      taskId: TASK_ID,
      title: '9월 출하 견적 회신',
      description:
        '메시지 하단에 "처리중" 할 일 chip 이 부착되어 마감 기한과 함께 표시됩니다.',
    },
  ],
  // 5. 강승희가 견적서 + 도면 두 파일 전송 → 할 일 완료
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: HOST_QUOTE_MSG_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: `견적서와 도면 함께 전달드립니다. 자재코드 ${MATERIAL_CODE} 기준으로 작성했습니다.`,
      attachments: [QUOTE_FILE, DRAWING_FILE],
      deviceTarget: 'all',
      description:
        '강승희가 견적서(xlsx) 와 도면(dwg) 두 파일을 한 메시지에 첨부해 전송합니다.',
    },
    {
      kind: 'attach_file',
      roomId: ROOM_ID,
      fileId: 'gn-file-quote-v1',
      name: QUOTE_FILE.name,
      size: QUOTE_FILE.size,
      mime: QUOTE_FILE.mime,
      description: '견적서가 협업 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'attach_file',
      roomId: ROOM_ID,
      fileId: 'gn-file-drawing',
      name: DRAWING_FILE.name,
      size: DRAWING_FILE.size,
      mime: DRAWING_FILE.mime,
      description: '도면이 협업 채널 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'update_task_chip_status',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_MSG_ID,
      taskId: TASK_ID,
      status: '완료',
      description:
        '회신 완료에 따라 step 4 의 할 일 chip 이 "완료" 로 갱신됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: '잘 받았습니다. 단가 확인 후 발주 진행하겠습니다.',
      deviceTarget: 'all',
      description: '박대표가 모바일에서 수신 확인 메시지를 남깁니다.',
    },
  ],
  // 6. 두 달 후 박대표 재발주 — 대화 조회 메뉴로 진입
  [
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: '— 두 달 후, 동일 자재 재발주 시점 —',
      description: '시간 흐름을 시스템 메시지로 안내합니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: PARK_REORDER_MSG_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: `지난번 ${MATERIAL_CODE} 그대로 같은 단가로 한 번 더 부탁드려요. (재발주)`,
      deviceTarget: 'all',
      description: '박대표가 동일 자재코드를 인용해 재발주를 요청합니다.',
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
        "'대화 조회' 메뉴로 이동합니다 — 회사에 쌓인 대화·메시지를 통합 조회할 수 있는 화면입니다.",
    },
  ],
  // 7. 메시지 탭 + 자재번호 검색
  [
    {
      kind: 'set_talk_search',
      tab: 'messages',
      description: "'메시지' 탭으로 전환합니다 — 메시지 단위로 키워드 검색이 가능합니다.",
    },
    {
      kind: 'set_talk_search',
      keyword: MATERIAL_CODE,
      description: `검색어로 자재번호 '${MATERIAL_CODE}' 를 입력합니다 — 회사 전체에서 해당 자재가 언급된 메시지가 조회됩니다.`,
    },
    {
      kind: 'show_toast',
      message: `'${MATERIAL_CODE}' 관련 메시지가 검색되었습니다.`,
      tone: 'info',
      description:
        '검색 결과 영역에 자재번호와 관련된 과거 대화·메시지가 한 화면에 정렬됩니다.',
    },
  ],
  // 8. 협업 채널 복귀 + 과거 견적 파일 재첨부 답변
  [
    {
      kind: 'set_section',
      section: 'talk',
      description:
        '검색에서 과거 이력을 확인한 뒤 협업 채널로 돌아옵니다.',
    },
    {
      kind: 'select_room',
      roomId: ROOM_ID,
      description: '미우케이블 박대표 협업 채널을 다시 엽니다.',
    },
    {
      kind: 'attach_file',
      roomId: ROOM_ID,
      fileId: 'gn-file-quote-v0',
      name: PAST_QUOTE_FILE.name,
      size: PAST_QUOTE_FILE.size,
      mime: PAST_QUOTE_FILE.mime,
      description: '7월 견적서를 현재 채널의 파일 라이브러리에 연결합니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: HOST_REUSE_MSG_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content:
        '7월에 전달드렸던 견적과 동일 조건입니다. 같은 단가로 진행 가능합니다.',
      attachments: [PAST_QUOTE_FILE],
      deviceTarget: 'all',
      description:
        '강승희가 검색으로 찾은 과거 견적서를 그대로 재첨부해 답변합니다.',
    },
  ],
  // 9. 회사 차원 파일 라이브러리 — 다른 BR도 접근 가능
  [
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: '✓ 견적 회신 완료 · 모든 첨부 파일은 미우케이블 대화 라이브러리에 자동 보관',
      description:
        '회사 시스템 안에 대화·파일·이력이 모두 함께 남았다는 점을 시스템 메시지로 정리합니다.',
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
  '협업 채널 생성',
  '거래처 카카오 상담톡 초대 → 모바일 입장',
  '거래처 사양서 PDF 전송',
  '담당 BR 답변 + 할 일 등록',
  '견적서·도면 회신 + 할 일 완료',
  '두 달 후 재발주 — 대화 조회 메뉴로 이동',
  '메시지 탭에서 자재번호 검색',
  '협업 채널 복귀 + 과거 견적 파일 재첨부',
  '회사 차원 파일 라이브러리 가시성',
];

const stepDescriptions = [
  '영업팀 강승희가 미우케이블 박대표를 외부 참여자로 초대해 협업 채널을 생성합니다.',
  '박대표가 카카오 상담톡 알림을 받아 모바일에서 협업 채널에 입장합니다.',
  '박대표가 9월 발주 사양서 PDF 를 협업 채널에 첨부하여 전송합니다.',
  '강승희가 처리 약속과 함께 답변하고, 메시지에서 곧바로 할 일을 등록해 마감을 추적합니다.',
  '강승희가 견적서(xlsx) 와 도면(dwg) 을 함께 전송하고 할 일 chip 을 완료로 갱신합니다.',
  '두 달 뒤 동일 자재 재발주가 들어오자 좌측 사이드바의 대화 조회 메뉴로 진입합니다.',
  '메시지 탭에서 자재번호를 입력해 회사 전체에서 해당 자재가 언급된 메시지를 조회합니다.',
  '검색에서 확인한 과거 견적서를 협업 채널로 돌아와 그대로 재첨부해 응대합니다.',
  '모든 파일이 협업 채널 라이브러리에 자동 보관되어 가온 영업팀 전체가 검색·재활용할 수 있음을 안내합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `gn-step-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

// ─────────────────────────────────────────────────────────
// beforeSteps — 개인 카카오톡 (이력 분산, 검색 불가)
// ─────────────────────────────────────────────────────────
const beforeActions: UIAction[][] = [
  // b1. 개인 카톡에 사양 협의 + 사양서 PDF
  [
    {
      kind: 'add_room',
      roomId: KAKAO_ROOM_ID,
      title: '강승희 ↔ 박대표 (개인 카카오톡)',
      participantCount: 2,
      preview: '9월 발주 사양 보내드립니다.',
      description:
        '강승희와 박대표의 개인 카카오톡 1:1 방이 생성됩니다 (회사 시스템과 분리).',
    },
    {
      kind: 'select_room',
      roomId: KAKAO_ROOM_ID,
      description: '본문에서 개인 카카오톡 방을 선택합니다.',
    },
    {
      kind: 'add_participant',
      roomId: KAKAO_ROOM_ID,
      participantId: HOST_ID,
      displayName: HOST_DISPLAY,
      external: false,
      isHost: true,
      description: '강승희가 개인 카톡 호스트로 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: KAKAO_ROOM_ID,
      participantId: PARK_ID,
      displayName: PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '박대표도 개인 카톡에 입장합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: '9월 발주 사양 보내드립니다.',
      attachments: [SPEC_FILE],
      deviceTarget: 'all',
      description: '박대표가 개인 카톡으로 사양서 PDF 를 전송합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '확인했습니다. 견적 회신드릴게요.',
      deviceTarget: 'all',
      description: '강승희가 답변을 남기지만, 할 일·마감 추적은 없습니다.',
    },
  ],
  // b2. 견적서·도면을 개인 카톡으로 회신 — 회사 이력 없음
  [
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '견적서 회신드립니다.',
      attachments: [QUOTE_FILE],
      deviceTarget: 'all',
      description: '강승희가 견적서를 개인 카톡으로 전송합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: '감사합니다. 도면도 같이 부탁드려요.',
      deviceTarget: 'all',
      description: '박대표가 도면을 추가로 요청합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '전달드립니다.',
      attachments: [DRAWING_FILE],
      deviceTarget: 'all',
      description: '강승희가 도면(dwg) 까지 개인 카톡으로 보냅니다.',
    },
    {
      kind: 'append_system_message',
      roomId: KAKAO_ROOM_ID,
      content: '⚠ 파일이 개인 카톡에만 저장 — 회사 시스템에는 이력 없음 / 검색 불가',
      description:
        '주고받은 파일이 모두 개인 카톡 안에 머물러, 회사 차원에서는 어떤 자료가 오갔는지 알 수 없습니다.',
    },
  ],
  // b3. 두 달 후 재발주 — 자재번호로 검색 시도
  [
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'customer', userId: PARK_ID, displayName: PARK_NAME },
      content: `지난번 ${MATERIAL_CODE} 그대로 같은 단가로 한 번 더 부탁드려요.`,
      deviceTarget: 'all',
      description: '박대표가 두 달 후 동일 자재로 재발주를 요청합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: KAKAO_ROOM_ID,
      content: `⚠ 강승희가 개인 카톡 대화 위로 스크롤하며 7월 파일을 찾는 중 — 자재번호 '${MATERIAL_CODE}' 로 검색 불가`,
      description:
        '개인 카톡은 자재번호 같은 업무 키워드로 과거 대화·파일을 찾을 수 없어 수동 스크롤에 의존합니다.',
    },
  ],
  // b4. 자료 분실 + 회사 가시성 부재
  [
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '(7월 파일이 다른 카톡방에 있는지 찾는 중) 잠시만요...',
      deviceTarget: 'all',
      description:
        '강승희가 다른 거래처 카톡방까지 뒤져야 합니다. 응답이 즉시 나가지 못합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: KAKAO_ROOM_ID,
      content:
        '⚠ 같은 거래처 파일이 여러 개인 카톡에 분산 / 다른 BR 도 동일 자재 이력 확인 불가 / 퇴사 시 이력 소실',
      description:
        '회사 차원에서 보면 거래처 이력이 사원 개인 단말기에 묶여 있고, 인수인계·감사·보안 측면에서 리스크가 큽니다.',
    },
  ],
];

const beforeTitles = [
  '개인 카톡으로 사양 협의',
  '견적서·도면을 개인 카톡으로 회신',
  '재발주 시 자재번호 검색 불가',
  '자료 분산 + 회사 가시성 부재',
];

const beforeDescriptions = [
  '강승희가 개인 카카오톡에서 박대표로부터 사양서 PDF 를 받습니다 — 회사 시스템 이력 없음.',
  '견적서(xlsx) 와 도면(dwg) 까지 개인 카톡으로 전송됩니다. 모든 파일이 개인 단말에 머뭅니다.',
  '두 달 뒤 같은 자재 재발주가 들어오지만 자재번호로 과거 대화·파일을 검색할 수 없습니다.',
  '같은 거래처의 자료가 여러 개인 카톡에 분산되고, 다른 BR / 회사는 이력에 접근할 수 없습니다.',
];

const beforeSteps: Step[] = beforeActions.map((actions, i) => ({
  id: `gn-before-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${beforeTitles[i]}`,
  description: beforeDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: [
    '개인 카카오톡에 흩어진 거래처 대화·파일을 협업 채널로 내재화',
    '대화마다 빈번한 파일 송수신(사양서·견적서·도면)을 회사 시스템에 자동 보관',
    '자재번호 같은 키워드로 과거 대화·첨부 파일을 통합 검색',
    '검색 결과에서 과거 파일을 그대로 재활용해 다음 발주 응대 가속',
  ],
  metrics: [
    {
      label: '과거 이력 검색 가능성',
      before: 10,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '대화·파일 회사 가시성',
      before: 0,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '재발주 시 자료 재찾기 시간',
      before: 100,
      after: 5,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '퇴사 시 거래처 이력 소실 리스크',
      before: 100,
      after: 0,
      unit: '%',
      improvementDirection: 'down',
    },
  ],
  seed: {
    mobileViewerParticipantId: PARK_ID,
  },
  steps,
  beforeSteps,
};

export default scenario;

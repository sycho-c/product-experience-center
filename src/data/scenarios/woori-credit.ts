import type { Scenario, Step } from '@/types/scenario';
import type { Talk } from '@/types/talk';
import type { ParticipantSeed, UIAction } from '@/types/uiaction';

const ROOM_ID = 'wc-room';
const HOST_ID = 'host-1';
const STAFF_ID = 'staff-lee';
const HOST_NAME = '조승열';
const STAFF_NAME = '이수진';

const COMPANIES = [
  '우리상사',
  '청록렌터',
  '한울모빌리티',
  '서울리스',
  '한라카',
  '대신리스',
  '대일렌트',
  '광명렌터카',
  '서원오토',
  '대한리스',
  '강남리스',
  '명진모빌리티',
  '드림리스',
  '미래렌터',
  '평화모터스',
  '한아오토',
  '동방렌터카',
  '신성리스',
  '솔루션모빌',
  '코리아렌트',
  '에이스리스',
  '비전오토',
  '금강리스',
  '한성렌터',
];

const NAMES = [
  '홍길동',
  '김민수',
  '박지영',
  '이정훈',
  '최서연',
  '정현우',
  '강수민',
  '윤재호',
  '한지원',
  '오민준',
  '서예린',
  '김수아',
  '이도현',
  '박민서',
  '조하늘',
  '문지호',
  '신유나',
  '권태민',
  '배소영',
  '백승호',
  '구미진',
  '안재원',
  '주은수',
  '노다인',
  '서지훈',
  '유나경',
  '양병철',
  '편준영',
  '하경민',
  '석윤서',
  '명도윤',
  '천세진',
  '곽지현',
  '진해솔',
  '연소희',
  '도경수',
  '봉희재',
  '추준석',
  '엄성준',
  '심하윤',
  '여진호',
  '도민혁',
  '황수경',
  '최현우',
  '이채린',
  '강도현',
  '김유진',
  '박정민',
  '정민지',
  '나은서',
  '신지유',
  '성하준',
  '예지원',
  '맹다은',
  '하규현',
  '용은비',
  '소민재',
  '제하영',
  '독고선영',
  '남궁경석',
  '사도경',
  '국지민',
  '갈상우',
  '오재홍',
  '윤찬영',
  '최진성',
  '이수안',
  '김도영',
  '정아라',
  '우민혁',
];

const externals: ParticipantSeed[] = NAMES.slice(0, 70).map((name, i) => {
  const company = COMPANIES[i % COMPANIES.length];
  const id = `ext-${(i + 1).toString().padStart(3, '0')}`;
  return {
    id,
    displayName: `${name}(${company})`,
    external: true,
    device: 'Mobile',
  };
});

const internals: ParticipantSeed[] = [
  {
    id: HOST_ID,
    displayName: `${HOST_NAME}(여신팀)`,
    external: false,
    isHost: true,
    device: 'PC',
  },
  {
    id: STAFF_ID,
    displayName: `${STAFF_NAME}(여신팀)`,
    external: false,
    device: 'PC',
  },
];

const allParticipants: ParticipantSeed[] = [...internals, ...externals];

const ext001 = externals[0]!;
const ext003 = externals[2]!;
const ext005 = externals[4]!;
const ext007 = externals[6]!;

// 사전 메시지 — 단체방 분위기
const seedTalks: Talk[] = [
  {
    id: 'wc-pre-1',
    stepId: 'seed',
    type: 'system',
    from: { role: 'system' },
    to: { broadcast: true },
    device: 'all',
    content: '대화방이 생성되었습니다.',
    offsetMs: 0,
  },
  {
    id: 'wc-pre-2',
    stepId: 'seed',
    type: 'message',
    from: {
      role: 'customer',
      userId: ext003.id,
      displayName: ext003.displayName,
    },
    to: { broadcast: true },
    device: 'all',
    content: '오늘 견적 회신 부탁드립니다.',
    offsetMs: 0,
  },
  {
    id: 'wc-pre-3',
    stepId: 'seed',
    type: 'message',
    from: { role: 'internal', userId: STAFF_ID, displayName: STAFF_NAME },
    to: { broadcast: true },
    device: 'all',
    content: '확인 후 순차 회신드리겠습니다.',
    offsetMs: 0,
  },
  {
    id: 'wc-pre-4',
    stepId: 'seed',
    type: 'message',
    from: {
      role: 'customer',
      userId: ext005.id,
      displayName: ext005.displayName,
    },
    to: { broadcast: true },
    device: 'all',
    content: '계약서 양식 공유 가능할까요?',
    offsetMs: 0,
  },
];

// 메시지 ID — 다른 액션이 참조하므로 명시
const HOST_REPLY_ID = 'wc-host-reply';
const TASK_ID = 'wc-task-1';
const SECRET_MSG_ID = 'wc-secret-1';
const BIZFORM_ID = 'wc-bizform-1';
const BIZFORM_MSG_ID = 'wc-bizform-msg-1';

const stepActions: UIAction[][] = [
  // 1. 외부 고객 문의
  [
    {
      kind: 'select_room',
      roomId: ROOM_ID,
      description: '여신팀 ↔ 거래처 단체 대화방을 엽니다.',
    },
    {
      kind: 'mobile_open_room',
      roomId: ROOM_ID,
      description: 'Guest 모바일도 동일 대화방에 입장한 상태로 표시됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: 'wc-step1-msg-1',
      from: {
        role: 'customer',
        userId: ext001.id,
        displayName: ext001.displayName,
      },
      content:
        '여신 한도 상향 가능한지 문의드립니다. 현재 5천만원, 5천만원 추가 필요합니다.',
      deviceTarget: 'all',
      description: `${ext001.displayName} 이 단체방에 한도 상향 문의를 올립니다.`,
    },
  ],
  // 2. 호스트 답변 + 할 일 등록
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '확인했습니다. 신용도 검토 후 안내드리겠습니다.',
      deviceTarget: 'all',
      description: '호스트가 단체방에 1차 답변을 보냅니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_ID,
      taskId: TASK_ID,
      title: '한도 상향 검토',
      description:
        '메시지 하단에 "처리중" 할 일 chip 을 부착하여 처리 추적을 시작합니다.',
    },
  ],
  // 3. 비밀 메시지 모드 진입 (highlight)
  [
    {
      kind: 'highlight',
      selector: 'talk-input-mention',
      description:
        '단체방에서 특정 외부 1명에게만 보이는 비밀 메시지 작성 모드를 안내합니다.',
    },
  ],
  // 4. 비밀 메시지 전송
  [
    {
      kind: 'send_secret_message',
      roomId: ROOM_ID,
      messageId: SECRET_MSG_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      recipientParticipantId: ext001.id,
      content:
        '내부 신용도 검토 결과 한도 상향 가능합니다. 별도 비즈폼으로 추가 자료 요청드릴 예정입니다.',
      deviceTarget: 'all',
      description: `${ext001.displayName} 에게만 보이는 비밀 메시지를 전송합니다.`,
    },
  ],
  // 5. Guest 시점 전환 (다른 외부 참여자)
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: ext007.id,
      description: `Guest 모바일 시점을 ${ext007.displayName} 으로 전환합니다. 비밀 메시지가 placeholder 로 보입니다.`,
    },
  ],
  // 6. 시점 복귀
  [
    {
      kind: 'switch_mobile_viewer',
      participantId: ext001.id,
      description: `시점을 다시 ${ext001.displayName} 으로 복귀합니다.`,
    },
  ],
  // 7. 비즈폼 메뉴 노출
  [
    {
      kind: 'mobile_open_menu',
      description: 'Guest 햄버거 메뉴를 펼칩니다 (공지/지식/게시판/비즈폼/참여자/가이드).',
    },
  ],
  // 8. 비즈폼 모달 열림
  [
    {
      kind: 'mobile_select_menu',
      menuId: 'bizform',
      description: '비즈폼 메뉴를 선택합니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'credit-request',
      title: '한도 상향 요청 비즈폼',
      fields: [
        { id: 'quoteNo', label: '견적번호' },
        { id: 'request', label: '요청내용' },
        { id: 'file1', label: '사업자등록증', file: true },
        { id: 'file2', label: '재무제표', file: true },
        { id: 'file3', label: '신용평가서', file: true },
      ],
      description: 'Google Forms 스타일의 비즈폼 작성 모달이 열립니다.',
    },
  ],
  // 9. 비즈폼 작성
  [
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'quoteNo',
      value: 'WC-2026-00128',
      description: '견적번호를 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'request',
      value: '여신 한도 5천만원 → 1억원 상향 요청',
      description: '요청내용을 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'file1',
      value: '사업자등록증.pdf',
      description: '사업자등록증을 첨부합니다.',
    },
  ],
  // 10. 비즈폼 제출
  [
    {
      kind: 'submit_bizform',
      roomId: ROOM_ID,
      bizformId: BIZFORM_ID,
      title: '한도 상향 요청 비즈폼',
      messageId: BIZFORM_MSG_ID,
      description: '비즈폼을 제출합니다. 대화방에 inline 카드가 생성됩니다.',
    },
  ],
  // 11. 할 일 완료
  [
    {
      kind: 'approve_bizform',
      bizformId: BIZFORM_ID,
      description: '여신팀 호스트가 비즈폼을 승인합니다.',
    },
    {
      kind: 'update_task_chip_status',
      roomId: ROOM_ID,
      messageId: HOST_REPLY_ID,
      taskId: TASK_ID,
      status: '완료',
      description: 'step 2 의 할 일 chip 을 "완료" 로 갱신합니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content:
        '한도 상향 처리 완료되었습니다. 1억원 한도로 사용 가능합니다. 감사합니다.',
      deviceTarget: 'all',
      description: '호스트가 처리 결과를 단체방에 안내합니다.',
    },
  ],
];

const stepTitles = [
  '외부 고객 문의',
  '호스트 답변 + 할 일 등록',
  '비밀 메시지 모드 진입',
  '비밀 메시지 전송',
  'Guest 시점 전환',
  '시점 복귀',
  '비즈폼 메뉴 노출',
  '비즈폼 모달 열림',
  '비즈폼 작성',
  '비즈폼 제출',
  '할 일 완료',
];

const stepDescriptions = [
  '거래처 외부 사용자가 단체 대화방에 한도 상향 문의를 올립니다.',
  '호스트가 답변하면서 메시지에 할 일 chip 을 부착하여 처리를 추적합니다.',
  '단체방에서 특정 외부 사용자에게만 보이는 비밀 메시지 모드를 안내합니다.',
  '내부 검토 결과를 비밀 메시지로 전달합니다 — 호스트와 대상 1명만 풀 표시, 나머지는 placeholder.',
  'Guest 시점을 다른 외부 참여자로 전환하여 비밀 메시지의 가시성 차이를 확인합니다.',
  '시점을 복귀하여 비밀 메시지가 다시 풀 표시되는 것을 확인합니다.',
  'Guest 햄버거 메뉴를 노출합니다.',
  '비즈폼 메뉴 선택 시 Google Forms 스타일 작성 모달이 열립니다.',
  '견적번호, 요청내용, 첨부 자료를 입력합니다.',
  '비즈폼을 제출하여 대화방에 inline 카드가 생성되고 RightRail 비즈폼 패널에 등록됩니다.',
  '여신팀 호스트가 비즈폼을 승인하고 할 일 chip 을 "완료" 로 변경합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `wc-step-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  id: 'woori-credit',
  title: '우리금융캐피탈 렌터카',
  summary:
    '단체 대화방에서 외부 거래처 응대 — 비밀 메시지, 할 일 등록, 비즈폼 요청까지 전체 프로세스를 체험합니다.',
  category: 'customer-case',
  customer: { id: 'woori', name: '우리금융캐피탈' },
  difficulty: 'medium',
  durationMinutes: 12,
  devices: ['pc', 'mobile'],
  goals: [
    '단체 대화방에서 정형화된 외부 고객 응대',
    '비밀 메시지로 내부 검토 내용 보호',
    '비즈폼·할 일로 처리 추적 가능',
  ],
  metrics: [
    {
      label: '내부 검토 노출 리스크',
      before: 100,
      after: 0,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '처리 추적 가능성',
      before: 20,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '거래처 응답 시간',
      before: 100,
      after: 35,
      unit: '%',
      improvementDirection: 'down',
    },
  ],
  seed: {
    rooms: [
      {
        id: ROOM_ID,
        title: '여신팀 ↔ 거래처 협업방',
        participantCount: allParticipants.length,
        preview: '여신 한도 상향 검토 진행 중',
        device: 'PC',
        timestamp: '오늘',
      },
    ],
    currentRoomId: ROOM_ID,
    mobileViewerParticipantId: ext001.id,
    participants: { [ROOM_ID]: allParticipants },
    roomTalks: { [ROOM_ID]: seedTalks },
  },
  steps,
};

export default scenario;

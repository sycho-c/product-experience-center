import type { Talk } from '@/types/talk';
import type {
  MobileChatListEntry,
  ParticipantSeed,
  RoomEntrySeed,
  UISimSeed,
} from '@/types/uiaction';

// ─────────────────────────────────────────────────────────────────────
// 하나손해보험 미니 시나리오 공통 seed
// ─────────────────────────────────────────────────────────────────────

export const HANA_ROOM_ID = 'hi-room';
export const HANA_HOST_ID = 'hi-host';
export const HANA_DESIGNER_ID = 'hi-designer';
export const HANA_HOST_NAME = '김도윤';
export const HANA_DESIGNER_NAME = '영업가족-김철수';
export const HANA_DESIGNER_FULL = `${HANA_DESIGNER_NAME}(5250223)/(주)에즈금융서비스_TM/탑스-의정부`;

export const HANA_IMG_NOTE_MSG = 'hi-img-note';
export const HANA_TEXT_REQUEST_MSG = 'hi-text-request';
export const HANA_TASK_ID = 'hi-task-1';
export const HANA_CONSENT_BIZFORM_ID = 'hi-consent-bf';
export const HANA_CONSENT_BIZFORM_MSG = 'hi-consent-bf-msg';
export const HANA_PDF_FILE_ID = 'hi-pdf-1';

export const HANA_CUSTOMER = {
  name: '박정균',
  ssn: '771030-1234567',
  phone: '010-3456-7890',
  address: '서울시 강동구 명일동 LG아파트 101동 1502호',
  job: 'LG아파트',
};

const hanaHandwrittenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="340" viewBox="0 0 420 340">
  <rect width="420" height="340" fill="#faf6e3" stroke="#d6cfa8" stroke-width="3"/>
  <g font-family="'Nanum Pen Script','Cursive',serif" font-size="24" fill="#1f1a13">
    <text x="32" y="60">이름 : 박정균</text>
    <text x="32" y="110">주민번호 : 771030-1234567</text>
    <text x="32" y="160">연락처 : 010-3456-7890</text>
    <text x="32" y="210">주소 : 서울시 강동구</text>
    <text x="100" y="246">명일동 LG아파트</text>
    <text x="100" y="282">101동 1502호</text>
  </g>
</svg>`;
const hanaHandwrittenUrl = `data:image/svg+xml;utf8,${encodeURIComponent(hanaHandwrittenSvg)}`;

export const hanaHandwrittenAttachment = {
  name: '고객정보_손글씨.jpg',
  size: 184320,
  mime: 'image/jpeg',
  url: hanaHandwrittenUrl,
};

const hanaParticipants: ParticipantSeed[] = [
  {
    id: HANA_HOST_ID,
    displayName: `${HANA_HOST_NAME}(하나손보)`,
    external: false,
    isHost: true,
    device: 'PC',
  },
  {
    id: HANA_DESIGNER_ID,
    displayName: HANA_DESIGNER_NAME,
    external: true,
    device: 'Mobile',
  },
];

interface HanaSeedOpts {
  /** 손글씨 사진 메시지를 사전 메시지로 포함 (기본 true) */
  includeImage?: boolean;
  /** 텍스트 설계 요청 메시지를 사전 메시지로 포함 (기본 true) */
  includeTextRequest?: boolean;
  /** 추가 prepend 메시지 (예: 인사) */
  extraTalks?: Talk[];
}

/**
 * 하나손해보험 미니 시나리오 공통 seed.
 * 대화방 + 호스트/설계사 + (옵션) 사전 메시지가 이미 셋업된 상태로 시작.
 */
export function createHanaSeed(opts: HanaSeedOpts = {}): UISimSeed {
  const { includeImage = true, includeTextRequest = true, extraTalks = [] } = opts;

  const talks: Talk[] = [
    {
      id: 'hi-seed-sys',
      stepId: 'seed',
      type: 'system',
      from: { role: 'system' },
      to: { broadcast: true },
      device: 'all',
      content: `입장: ${HANA_HOST_NAME} (하나손보 GA설계지원)`,
      offsetMs: 0,
    },
    {
      id: 'hi-seed-sys-2',
      stepId: 'seed',
      type: 'system',
      from: { role: 'system' },
      to: { broadcast: true },
      device: 'all',
      content: `입장: ${HANA_DESIGNER_NAME} (5250223)`,
      offsetMs: 0,
    },
    ...extraTalks,
  ];

  if (includeImage) {
    talks.push({
      id: HANA_IMG_NOTE_MSG,
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'customer',
        userId: HANA_DESIGNER_ID,
        displayName: HANA_DESIGNER_NAME,
      },
      to: { broadcast: true },
      device: 'all',
      content: '고객 정보 손글씨로 보내드립니다.',
      attachments: [hanaHandwrittenAttachment],
      offsetMs: 0,
    });
  }

  if (includeTextRequest) {
    talks.push({
      id: HANA_TEXT_REQUEST_MSG,
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'customer',
        userId: HANA_DESIGNER_ID,
        displayName: HANA_DESIGNER_NAME,
      },
      to: { broadcast: true },
      device: 'all',
      content: '월 1만원 내외로 운전자보험 설계부탁 합니다.',
      offsetMs: 0,
    });
  }

  const lastTalk = talks[talks.length - 1];
  const lastPreview = lastTalk?.content ?? '하나손보 GA 협업 채널';

  return {
    rooms: [
      {
        id: HANA_ROOM_ID,
        title: HANA_DESIGNER_FULL,
        participantCount: hanaParticipants.length,
        preview: lastPreview,
        device: 'PC',
        timestamp: '오늘',
      },
    ],
    currentRoomId: HANA_ROOM_ID,
    mobileRoomId: HANA_ROOM_ID,
    mobileChatList: [
      {
        roomId: HANA_ROOM_ID,
        title: HANA_DESIGNER_FULL,
        lastMessage: lastPreview,
        unread: 0,
        time: '오늘',
        kind: 'cowork-invite',
      },
    ],
    participants: { [HANA_ROOM_ID]: hanaParticipants },
    roomTalks: { [HANA_ROOM_ID]: talks },
  };
}

// ─────────────────────────────────────────────────────────────────────
// 우리금융캐피탈 미니 시나리오 공통 seed
// ─────────────────────────────────────────────────────────────────────

export const WOORI_ROOM_ID = 'wc-room';
export const WOORI_HOST_ID = 'host-1';
export const WOORI_STAFF_ID = 'staff-lee';
export const WOORI_HOST_NAME = '김도윤';
export const WOORI_STAFF_NAME = '이수진';

export const WOORI_HOST_REPLY_ID = 'wc-host-reply';
export const WOORI_INQUIRY_MSG_ID = 'wc-inquiry-msg';
export const WOORI_TASK_ID = 'wc-task-1';
export const WOORI_SECRET_MSG_ID = 'wc-secret-1';
export const WOORI_BIZFORM_ID = 'wc-bizform-1';
export const WOORI_BIZFORM_MSG_ID = 'wc-bizform-msg-1';

const WOORI_COMPANIES = [
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

const WOORI_NAMES = [
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

const wooriExternals: ParticipantSeed[] = WOORI_NAMES.slice(0, 70).map((name, i) => {
  const company = WOORI_COMPANIES[i % WOORI_COMPANIES.length];
  const id = `ext-${(i + 1).toString().padStart(3, '0')}`;
  return {
    id,
    displayName: `${name}(${company})`,
    external: true,
    device: 'Mobile',
  };
});

const wooriInternals: ParticipantSeed[] = [
  {
    id: WOORI_HOST_ID,
    displayName: `${WOORI_HOST_NAME}(렌터카)`,
    external: false,
    isHost: true,
    device: 'PC',
  },
  {
    id: WOORI_STAFF_ID,
    displayName: `${WOORI_STAFF_NAME}(렌터카)`,
    external: false,
    device: 'PC',
  },
];

export const WOORI_PARTICIPANTS: ParticipantSeed[] = [
  ...wooriInternals,
  ...wooriExternals,
];

export const WOORI_EXT_001 = wooriExternals[0]!;
export const WOORI_EXT_003 = wooriExternals[2]!;
export const WOORI_EXT_005 = wooriExternals[4]!;
export const WOORI_EXT_007 = wooriExternals[6]!;

interface WooriSeedOpts {
  /** 외부 고객 문의 메시지를 사전에 포함 (기본 false) */
  includeInquiry?: boolean;
  /** 호스트 답변 + task chip 까지 부착된 상태로 시작 (기본 false) */
  includeHostReplyWithChip?: boolean;
  /** 추가 prepend 메시지 */
  extraTalks?: Talk[];
}

/**
 * 우리금융캐피탈 미니 시나리오 공통 seed.
 * 단체 대화방 + 70+ 외부 참여자 + (옵션) 사전 메시지가 셋업된 상태.
 */
export function createWooriSeed(opts: WooriSeedOpts = {}): UISimSeed {
  const { includeInquiry = false, includeHostReplyWithChip = false, extraTalks = [] } =
    opts;

  const talks: Talk[] = [
    {
      id: 'wc-seed-sys',
      stepId: 'seed',
      type: 'system',
      from: { role: 'system' },
      to: { broadcast: true },
      device: 'all',
      content: '대화방이 생성되었습니다.',
      offsetMs: 0,
    },
    {
      id: 'wc-seed-msg-1',
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'customer',
        userId: WOORI_EXT_003.id,
        displayName: WOORI_EXT_003.displayName,
      },
      to: { broadcast: true },
      device: 'all',
      content: '오늘 견적 회신 부탁드립니다.',
      offsetMs: 0,
    },
    {
      id: 'wc-seed-msg-2',
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'internal',
        userId: WOORI_STAFF_ID,
        displayName: WOORI_STAFF_NAME,
      },
      to: { broadcast: true },
      device: 'all',
      content: '확인 후 순차 회신드리겠습니다.',
      offsetMs: 0,
    },
    ...extraTalks,
  ];

  if (includeInquiry || includeHostReplyWithChip) {
    talks.push({
      id: WOORI_INQUIRY_MSG_ID,
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'customer',
        userId: WOORI_EXT_001.id,
        displayName: WOORI_EXT_001.displayName,
      },
      to: { broadcast: true },
      device: 'all',
      content:
        '여신 한도 상향 가능한지 문의드립니다. 현재 5천만원, 5천만원 추가 필요합니다.',
      offsetMs: 0,
    });
  }

  if (includeHostReplyWithChip) {
    talks.push({
      id: WOORI_HOST_REPLY_ID,
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'me',
        userId: WOORI_HOST_ID,
        displayName: WOORI_HOST_NAME,
      },
      to: { broadcast: true },
      device: 'all',
      content: '확인했습니다. 신용도 검토 후 안내드리겠습니다.',
      offsetMs: 0,
      taskChip: {
        taskId: WOORI_TASK_ID,
        title: '한도 상향 검토',
        status: '처리중',
      },
    });
  }

  const lastTalk = talks[talks.length - 1];
  const lastPreview = lastTalk?.content ?? '여신 한도 상향 검토 진행 중';

  return {
    rooms: [
      {
        id: WOORI_ROOM_ID,
        title: '렌터카팀 ↔ 거래처 협업방',
        participantCount: WOORI_PARTICIPANTS.length,
        preview: lastPreview,
        device: 'PC',
        timestamp: '오늘',
      },
    ],
    currentRoomId: WOORI_ROOM_ID,
    mobileRoomId: WOORI_ROOM_ID,
    mobileViewerParticipantId: WOORI_EXT_001.id,
    mobileChatList: [
      {
        roomId: WOORI_ROOM_ID,
        title: '렌터카팀 ↔ 거래처 협업방',
        lastMessage: lastPreview,
        unread: 0,
        time: '오늘',
        kind: 'cowork-invite',
      },
    ],
    participants: { [WOORI_ROOM_ID]: WOORI_PARTICIPANTS },
    roomTalks: { [WOORI_ROOM_ID]: talks },
  };
}

// ─────────────────────────────────────────────────────────────────────
// 가온전선 (Gaon Cable) 미니 시나리오 공통 상수
// ─────────────────────────────────────────────────────────────────────
//
// 영업팀 강승희가 미우케이블 박대표를 협업채널로 응대한다.
// 메인 시나리오(gaon-cable-sales-bridge) 와 동일 인물/방/파일 fixture
// 를 공유해 후속 feature/flow 가 일관된 컨텍스트를 가진다.

export const GAON_ROOM_ID = 'gn-room';
export const GAON_KAKAO_ROOM_ID = 'gn-kakao-room';

export const GAON_HOST_ID = 'gn-host';
export const GAON_PARK_ID = 'gn-park';
export const GAON_HOST_NAME = '강승희';
export const GAON_PARK_NAME = '박대표';
export const GAON_HOST_DISPLAY = `${GAON_HOST_NAME}(영업팀)`;
export const GAON_PARK_DISPLAY = `${GAON_PARK_NAME}(미우케이블)`;

// 자재번호 — 통합 검색 데모 키워드
export const GAON_MATERIAL_CODE = 'CC-22-150SQ';

// 메시지 ID — 후속 액션이 참조
export const GAON_PARK_SPEC_MSG_ID = 'gn-park-spec';
export const GAON_HOST_REPLY_MSG_ID = 'gn-host-reply';
export const GAON_HOST_QUOTE_MSG_ID = 'gn-host-quote';
export const GAON_HOST_REUSE_MSG_ID = 'gn-host-reuse';
export const GAON_TASK_ID = 'gn-task-quote';

// 파일 fixture (재사용 가능)
export const GAON_SPEC_FILE = {
  name: '미우케이블_9월_요청사양서.pdf',
  size: 248320,
  mime: 'application/pdf',
};
export const GAON_QUOTE_FILE = {
  name: `가온_${GAON_MATERIAL_CODE}_견적서_v1.xlsx`,
  size: 64512,
  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
export const GAON_DRAWING_FILE = {
  name: `${GAON_MATERIAL_CODE}_도면.dwg`,
  size: 1342176,
  mime: 'application/acad',
};
export const GAON_PAST_QUOTE_FILE = {
  name: `가온_${GAON_MATERIAL_CODE}_견적서_v0.xlsx`,
  size: 58980,
  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

const gaonParticipants: ParticipantSeed[] = [
  {
    id: GAON_HOST_ID,
    displayName: GAON_HOST_DISPLAY,
    external: false,
    isHost: true,
    device: 'PC',
  },
  {
    id: GAON_PARK_ID,
    displayName: GAON_PARK_DISPLAY,
    external: true,
    device: 'Mobile',
  },
];

interface GaonSeedOpts {
  /** 협업 채널 + 두 참여자가 입장된 상태로 시작 (사양서 메시지 없음). 기본 false. */
  includeChannelSetup?: boolean;
  /** 박대표 사양서 PDF 메시지까지 포함된 상태로 시작. 기본 false. */
  includeSpecMessage?: boolean;
  /** 강승희의 견적서·도면 회신 + 할 일 chip 완료까지 포함된 상태. 기본 false. */
  includeQuoteSent?: boolean;
}

/**
 * 가온전선 미니 시나리오 공통 seed.
 *
 * 옵션에 따라 채널/메시지가 사전 셋업된 상태로 시작할 수 있다.
 * 메인 시나리오와 동일한 인물·방·파일 fixture 를 공유한다.
 */
export function createGaonSeed(opts: GaonSeedOpts = {}): UISimSeed {
  const {
    includeChannelSetup = false,
    includeSpecMessage = false,
    includeQuoteSent = false,
  } = opts;

  const anyChannel = includeChannelSetup || includeSpecMessage || includeQuoteSent;
  if (!anyChannel) {
    return { mobileViewerParticipantId: GAON_PARK_ID };
  }

  const talks: Talk[] = [
    {
      id: 'gn-seed-sys-host',
      stepId: 'seed',
      type: 'system',
      from: { role: 'system' },
      to: { broadcast: true },
      device: 'all',
      content: `입장: ${GAON_HOST_NAME} (가온전선 영업팀)`,
      offsetMs: 0,
    },
    {
      id: 'gn-seed-sys-park',
      stepId: 'seed',
      type: 'system',
      from: { role: 'system' },
      to: { broadcast: true },
      device: 'all',
      content: `입장: ${GAON_PARK_NAME} (미우케이블)`,
      offsetMs: 0,
    },
  ];

  if (includeSpecMessage || includeQuoteSent) {
    talks.push({
      id: GAON_PARK_SPEC_MSG_ID,
      stepId: 'seed',
      type: 'message',
      from: {
        role: 'customer',
        userId: GAON_PARK_ID,
        displayName: GAON_PARK_NAME,
      },
      to: { broadcast: true },
      device: 'all',
      content: '9월 발주 사양서입니다. 확인 부탁드려요.',
      attachments: [GAON_SPEC_FILE],
      offsetMs: 0,
    });
  }

  if (includeQuoteSent) {
    talks.push(
      {
        id: GAON_HOST_REPLY_MSG_ID,
        stepId: 'seed',
        type: 'message',
        from: {
          role: 'me',
          userId: GAON_HOST_ID,
          displayName: GAON_HOST_NAME,
        },
        to: { broadcast: true },
        device: 'all',
        content: '사양 확인했습니다. 오늘 오후 4시까지 견적 회신드리겠습니다.',
        offsetMs: 0,
        taskChip: {
          taskId: GAON_TASK_ID,
          title: '9월 출하 견적 회신',
          status: '완료',
        },
      },
      {
        id: GAON_HOST_QUOTE_MSG_ID,
        stepId: 'seed',
        type: 'message',
        from: {
          role: 'me',
          userId: GAON_HOST_ID,
          displayName: GAON_HOST_NAME,
        },
        to: { broadcast: true },
        device: 'all',
        content: `견적서와 도면 함께 전달드립니다. 자재코드 ${GAON_MATERIAL_CODE} 기준입니다.`,
        attachments: [GAON_QUOTE_FILE, GAON_DRAWING_FILE],
        offsetMs: 0,
      }
    );
  }

  const lastTalk = talks[talks.length - 1];
  const lastPreview = lastTalk?.content ?? '미우케이블 협업 채널';

  return {
    rooms: [
      {
        id: GAON_ROOM_ID,
        title: '미우케이블 박대표 ↔ 가온 영업',
        participantCount: gaonParticipants.length,
        preview: lastPreview,
        device: 'PC',
        timestamp: '오늘',
      },
    ],
    currentRoomId: GAON_ROOM_ID,
    mobileRoomId: GAON_ROOM_ID,
    mobileViewerParticipantId: GAON_PARK_ID,
    mobileChatList: [
      {
        roomId: GAON_ROOM_ID,
        title: '미우케이블 박대표 ↔ 가온 영업',
        lastMessage: lastPreview,
        unread: 0,
        time: '오늘',
        kind: 'cowork-invite',
      },
    ],
    participants: { [GAON_ROOM_ID]: gaonParticipants },
    roomTalks: { [GAON_ROOM_ID]: talks },
  };
}

// ─────────────────────────────────────────────────────────────────────
// SK렌터카 법인폰 시나리오 공통 seed
// ─────────────────────────────────────────────────────────────────────
//
// 영업1팀 대리 정민수가 법인폰 SalesBridge 앱으로 SK렌터카 공식
// 카카오 상담톡 채널을 통해 고객을 응대한다. 동료 김주임은 이직 예정,
// 차상훈 팀장은 영업관리자.

export const SK_RENTAL_ROOM_ID = 'sk-room-park';

export const SK_RENTAL_HOST_ID = 'sk-host';
export const SK_RENTAL_STAFF_PREV_ID = 'sk-staff-prev';
export const SK_RENTAL_MGR_ID = 'sk-mgr';
// 외부 사용자 store (useExternalUsersStore) 의 SEED ID 와 일치시켜
// CreateRoomModal 검색에서 자동으로 검색·선택될 수 있도록 한다.
export const SK_RENTAL_CUST_PARK_ID = 'eu-park-chanho';
export const SK_RENTAL_CUST_LEE_ID = 'eu-lee-sujeong';

export const SK_RENTAL_HOST_NAME = '정민수';
export const SK_RENTAL_STAFF_PREV_NAME = '김주임';
export const SK_RENTAL_MGR_NAME = '차상훈';
export const SK_RENTAL_CUST_PARK_NAME = '박찬호';
export const SK_RENTAL_CUST_LEE_NAME = '이수정';

export const SK_RENTAL_HOST_DISPLAY = `${SK_RENTAL_HOST_NAME}(SK렌터카 영업1팀)`;
export const SK_RENTAL_STAFF_PREV_DISPLAY = `${SK_RENTAL_STAFF_PREV_NAME}(SK렌터카 영업1팀)`;
export const SK_RENTAL_MGR_DISPLAY = `${SK_RENTAL_MGR_NAME}(SK렌터카 영업관리)`;
export const SK_RENTAL_CUST_PARK_DISPLAY = `${SK_RENTAL_CUST_PARK_NAME}((주)한솔무역 대표)`;
export const SK_RENTAL_CUST_LEE_DISPLAY = `${SK_RENTAL_CUST_LEE_NAME}(미래물류 총무)`;

// 메시지 ID — 후속 액션이 참조
export const SK_PARK_INQUIRY_MSG_ID = 'sk-park-inquiry';
export const SK_HOST_GREETING_MSG_ID = 'sk-host-greeting';
export const SK_HOST_QUOTE_MSG_ID = 'sk-host-quote';
export const SK_PARK_REQUEST_MSG_ID = 'sk-park-request';

// 도메인 ID
export const SK_BIZFORM_ID = 'sk-bizform-corp';
export const SK_BIZFORM_MSG_ID = 'sk-bizform-msg';
export const SK_TASK_ID = 'sk-task-follow-up';

// 카카오 알림톡 비즈뿌리오 SK렌터카 공식 채널 아이덴티티
export const SK_CHANNEL_NAME = 'SK렌터카 공식 채널';

// beforeSteps 전용 — 개인 카카오톡 방 ID
export const SK_PERSONAL_KAKAO_ROOM_ID = 'sk-kakao-personal';

// 차종 사진 (간단 SVG) — multi-image attachment 시연용
const k3CarSvg = (label: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <rect width="320" height="200" fill="#1b2a4a"/>
  <ellipse cx="160" cy="150" rx="120" ry="22" fill="#0e1730"/>
  <path d="M40 130 L80 90 L240 90 L280 130 L280 150 L40 150 Z" fill="#e1e8f5" stroke="#0e1730" stroke-width="2"/>
  <path d="M90 95 L120 105 L200 105 L230 95" fill="none" stroke="#0e1730" stroke-width="2"/>
  <circle cx="90" cy="150" r="18" fill="#0e1730"/>
  <circle cx="230" cy="150" r="18" fill="#0e1730"/>
  <circle cx="90" cy="150" r="8" fill="#7d8b9c"/>
  <circle cx="230" cy="150" r="8" fill="#7d8b9c"/>
  <text x="160" y="180" fill="#b6c2d4" font-family="sans-serif" font-size="14" text-anchor="middle">${label}</text>
</svg>`;
const k3CarUrl = (label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(k3CarSvg(label))}`;

export const SK_K3_CAR_IMAGES = [
  { name: 'K3_전면.jpg', size: 184320, mime: 'image/jpeg', url: k3CarUrl('K3 전면') },
  { name: 'K3_측면.jpg', size: 174210, mime: 'image/jpeg', url: k3CarUrl('K3 측면') },
  { name: 'K3_내부.jpg', size: 192480, mime: 'image/jpeg', url: k3CarUrl('K3 내부') },
];

// 사업자등록증 손글씨 — beforeSteps 에서 사진으로 받은 사업자등록증 시연
const bizCertSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="280" viewBox="0 0 380 280">
  <rect width="380" height="280" fill="#fdfdf6" stroke="#b8b29a" stroke-width="2"/>
  <text x="190" y="38" fill="#1f1a13" font-family="serif" font-size="20" font-weight="bold" text-anchor="middle">사 업 자 등 록 증</text>
  <line x1="30" y1="56" x2="350" y2="56" stroke="#b8b29a" stroke-width="1"/>
  <g font-family="sans-serif" font-size="14" fill="#1f1a13">
    <text x="36" y="92">등록번호 :  214-87-65432</text>
    <text x="36" y="124">상호 :  (주)한솔무역</text>
    <text x="36" y="156">대표자 :  박찬호</text>
    <text x="36" y="188">소재지 :  서울 강남구 테헤란로 123</text>
    <text x="36" y="220">업태 :  도소매 / 종목 :  자동차렌탈</text>
  </g>
</svg>`;
const bizCertUrl = `data:image/svg+xml;utf8,${encodeURIComponent(bizCertSvg)}`;

export const SK_BIZ_CERT_ATTACHMENT = {
  name: '사업자등록증_한솔무역.jpg',
  size: 213440,
  mime: 'image/jpeg',
  url: bizCertUrl,
};

// 견적서 PDF (가짜 메타)
export const SK_QUOTE_PDF_ATTACHMENT = {
  name: 'SK렌터카_K3_단기렌탈_견적서_v1.pdf',
  size: 184320,
  mime: 'application/pdf',
};

const skRentalParticipants: ParticipantSeed[] = [
  {
    id: SK_RENTAL_HOST_ID,
    displayName: SK_RENTAL_HOST_DISPLAY,
    external: false,
    isHost: true,
    device: 'PC',
  },
  {
    id: SK_RENTAL_STAFF_PREV_ID,
    displayName: SK_RENTAL_STAFF_PREV_DISPLAY,
    external: false,
    device: 'PC',
  },
  {
    id: SK_RENTAL_MGR_ID,
    displayName: SK_RENTAL_MGR_DISPLAY,
    external: false,
    device: 'PC',
  },
];

interface SkRentalSeedOpts {
  /** 호스트 정민수가 이미 좌측 리스트에 보이도록 정대리 본인 방을 미리 셋업할지 (기본 false — 메인 시나리오는 step1 에서 방을 생성). */
  includeHostSeated?: boolean;
  /** 박찬호 고객이 이미 채널에 입장하고 K3 견적 문의를 남긴 상태로 시작 (feature 시나리오에서 사용). */
  includePostInvite?: boolean;
  /** 김주임 명의 더미 방 4개를 사전 생성 (Step 6 이관 시연용 - 메인에서는 set_section 토스트로만 표현하므로 기본 false). */
  includePreviousStaffRooms?: boolean;
  /** 추가 prepend 메시지 */
  extraTalks?: Talk[];
}

/**
 * SK렌터카 법인폰 시나리오 공통 seed.
 *
 * 기본은 빈 상태에 가깝다 — 메인 시나리오는 step 1 에서 방·참여자를 모두 동적으로
 * 생성한다. opts.includePostInvite 를 켜면 후속 feature 시나리오용으로 박찬호가
 * 이미 채널에 입장한 상태부터 시작할 수 있다.
 */
export function createSkRentalSeed(opts: SkRentalSeedOpts = {}): UISimSeed {
  const {
    includeHostSeated = false,
    includePostInvite = false,
    includePreviousStaffRooms = false,
    extraTalks = [],
  } = opts;

  const rooms: RoomEntrySeed[] = [];
  const participants: Record<string, ParticipantSeed[]> = {};
  const roomTalks: Record<string, Talk[]> = {};
  const mobileChatList: MobileChatListEntry[] = [];

  if (includeHostSeated || includePostInvite) {
    const roomParticipants: ParticipantSeed[] = [...skRentalParticipants.slice(0, 1)];
    if (includePostInvite) {
      roomParticipants.push({
        id: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_DISPLAY,
        external: true,
        device: 'Mobile',
      });
    }

    const seedTalks: Talk[] = [
      {
        id: 'sk-seed-sys',
        stepId: 'seed',
        type: 'system',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: `입장: ${SK_RENTAL_HOST_NAME} (SK렌터카 영업1팀)`,
        offsetMs: 0,
      },
      ...extraTalks,
    ];

    if (includePostInvite) {
      seedTalks.push(
        {
          id: 'sk-seed-sys-invite',
          stepId: 'seed',
          type: 'system',
          from: { role: 'system' },
          to: { broadcast: true },
          device: 'all',
          content: `입장: ${SK_RENTAL_CUST_PARK_NAME} (${SK_CHANNEL_NAME} — 비즈니스 채널입니다)`,
          offsetMs: 0,
        },
        {
          id: SK_PARK_INQUIRY_MSG_ID,
          stepId: 'seed',
          type: 'message',
          from: {
            role: 'customer',
            userId: SK_RENTAL_CUST_PARK_ID,
            displayName: SK_RENTAL_CUST_PARK_NAME,
          },
          to: { broadcast: true },
          device: 'all',
          content: 'K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요?',
          offsetMs: 0,
        }
      );
    }

    rooms.push({
      id: SK_RENTAL_ROOM_ID,
      title: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역 대표) ↔ ${SK_RENTAL_HOST_NAME}`,
      participantCount: roomParticipants.length,
      preview: includePostInvite ? 'K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요?' : '대화방이 생성되었습니다.',
      device: 'PC',
      timestamp: '오늘',
    });
    participants[SK_RENTAL_ROOM_ID] = roomParticipants;
    roomTalks[SK_RENTAL_ROOM_ID] = seedTalks;

    if (includePostInvite) {
      mobileChatList.push({
        roomId: SK_RENTAL_ROOM_ID,
        title: SK_CHANNEL_NAME,
        lastMessage: 'K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요?',
        unread: 0,
        time: '오늘',
        kind: 'kakao-invite',
      });
    }
  }

  if (includePreviousStaffRooms) {
    const prevStaffRooms = [
      { id: 'sk-room-lee', title: `${SK_RENTAL_CUST_LEE_NAME} (미래물류) ↔ ${SK_RENTAL_STAFF_PREV_NAME}`, preview: '카니발 3년 장기 5대 견적' },
      { id: 'sk-room-prev-2', title: `한진로지스틱 ↔ ${SK_RENTAL_STAFF_PREV_NAME}`, preview: '쏘렌토 2년 단체 5대' },
      { id: 'sk-room-prev-3', title: `대성유통 ↔ ${SK_RENTAL_STAFF_PREV_NAME}`, preview: '셀토스 1년 견적' },
      { id: 'sk-room-prev-4', title: `우정택배 ↔ ${SK_RENTAL_STAFF_PREV_NAME}`, preview: '봉고3 5년 3대' },
    ];
    for (const r of prevStaffRooms) {
      rooms.push({
        id: r.id,
        title: r.title,
        participantCount: 2,
        preview: r.preview,
        device: 'PC',
        timestamp: '지난주',
      });
      participants[r.id] = [
        {
          id: SK_RENTAL_STAFF_PREV_ID,
          displayName: SK_RENTAL_STAFF_PREV_DISPLAY,
          external: false,
          isHost: true,
          device: 'PC',
        },
      ];
      roomTalks[r.id] = [];
    }
  }

  return {
    rooms: rooms.length ? rooms : undefined,
    currentRoomId: includeHostSeated || includePostInvite ? SK_RENTAL_ROOM_ID : undefined,
    mobileViewerParticipantId: SK_RENTAL_CUST_PARK_ID,
    mobileChatList: mobileChatList.length ? mobileChatList : undefined,
    participants: Object.keys(participants).length ? participants : undefined,
    roomTalks: Object.keys(roomTalks).length ? roomTalks : undefined,
  };
}

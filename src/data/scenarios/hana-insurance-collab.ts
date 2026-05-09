import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './hana-insurance-collab.meta';

const ROOM_ID = 'hi-room';
const KAKAO_ROOM_ID = 'hi-kakao-room';
const HOST_ID = 'hi-host';
const DESIGNER_ID = 'hi-designer';
const HOST_NAME = '김용익';
const DESIGNER_NAME = '영업가족-김철수';
const DESIGNER_FULL = `${DESIGNER_NAME}(5250223)/(주)에즈금융서비스_TM/탑스-의정부`;

// 메시지 ID — 후속 액션이 참조
const KAKAO_IMG_MSG = 'hi-kakao-img-note';
const KAKAO_TEXT_MSG = 'hi-kakao-text-request';
const IMG_NOTE_MSG = 'hi-img-note';
const TEXT_REQUEST_MSG = 'hi-text-request';
const TASK_ID = 'hi-task-1';
const PDF_FILE_ID = 'hi-pdf-1';
const INVITE_NOTICE_ID = 'hi-invite';
const CONSENT_BIZFORM_ID = 'hi-consent-bf';
const CONSENT_BIZFORM_MSG = 'hi-consent-bf-msg';

// 손글씨 메모 — 카드/모달의 우측 미리보기용 SVG data URL
const handwrittenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">
  <rect width="420" height="280" fill="#faf6e3" stroke="#d6cfa8" stroke-width="3"/>
  <g font-family="'Nanum Pen Script','Cursive',serif" font-size="24" fill="#1f1a13">
    <text x="32" y="74">이름 : 박정균</text>
    <text x="32" y="134">주민번호 : 771030-1234567</text>
    <text x="32" y="194">주소 : 서울시 강동구</text>
    <text x="100" y="232">명일동 LG아파트</text>
    <text x="100" y="266">101동 1502호</text>
  </g>
</svg>`;
const handwrittenUrl = `data:image/svg+xml;utf8,${encodeURIComponent(handwrittenSvg)}`;

const handwrittenAttachment = {
  name: '고객정보_손글씨.jpg',
  size: 184320,
  mime: 'image/jpeg',
  url: handwrittenUrl,
};

// 더미 고객 — 영상의 손글씨 그대로
const CUSTOMER = {
  name: '박정균',
  ssn: '771030-1234567',
  phone: '010-3456-7890',
  address: '서울시 강동구 명일동 LG아파트 101동 1502호',
  job: 'LG아파트',
};

const stepActions: UIAction[][] = [
  // 1. 새 대화방 만들기 — 모달 오픈
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
        "'대화방 생성' 모달이 열리고 1단계 '참여자 선택' — 영업가족(외부) 탭이 보입니다.",
    },
  ],
  // 2. 영업가족 검색 + 김철수 선택 + 다음
  [
    {
      kind: 'fill_input',
      field: 'create-room.external.search',
      value: '김철수',
      description: "검색창에 '김철수'를 입력합니다.",
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.external.kim-5250223',
      on: true,
      description:
        "영업가족-김철수(5250223)/(주)에즈금융서비스_TM 을 선택합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.next',
      description: "'다음' 버튼을 눌러 2단계로 이동합니다.",
    },
  ],
  // 3. 채널 선택 + 알림톡 + 대화방 생성
  [
    {
      kind: 'set_modal_step',
      modalId: 'create-room',
      step: 2,
      description: "2단계 '대화 채널 선택' 화면이 표시됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.title',
      value: DESIGNER_FULL,
      description: '대화방 제목이 영업가족 정보로 자동 채워집니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.kakao',
      on: true,
      description: '영업가족에게 카카오 알림톡으로 초대장을 발송하기를 켭니다.',
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
      title: DESIGNER_FULL,
      participantCount: 1,
      preview: '대화방이 생성되었습니다.',
      toast: { message: '대화방이 생성되었습니다.', tone: 'success' },
      description:
        '좌측 대화방 리스트에 영업가족 협업 채널이 추가되고 토스트가 표시됩니다.',
    },
    {
      kind: 'select_room',
      roomId: ROOM_ID,
      description: 'PC 가운데 본문에서 새 대화방이 선택됩니다.',
    },
    {
      kind: 'add_participant',
      roomId: ROOM_ID,
      participantId: HOST_ID,
      displayName: `${HOST_NAME}(하나손보)`,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트(설계매니저 김용익)가 참여자에 포함됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: `입장: ${HOST_NAME} (하나손보 GA설계지원)`,
      description: '본문 시스템 메시지로 호스트 입장이 기록됩니다.',
    },
  ],
  // 4. 알림톡 → 설계사 입장
  [
    {
      kind: 'mobile_push_notice',
      noticeId: INVITE_NOTICE_ID,
      title: '하나손보 GA 협업 채널 초대',
      body: `${HOST_NAME} 님이 협업 채널에 초대했습니다. 앞으로 이 채널에서 설계요청을 진행해 주세요.`,
      ctaLabel: '초대 수락',
      description:
        '동시에 설계사(영업가족) 모바일에 카카오 알림톡 초대 카드가 도착합니다.',
    },
    {
      kind: 'mobile_open_room',
      roomId: ROOM_ID,
      noticeId: INVITE_NOTICE_ID,
      description: '설계사가 모바일에서 초대를 수락하고 대화방에 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: ROOM_ID,
      participantId: DESIGNER_ID,
      displayName: DESIGNER_NAME,
      external: true,
      device: 'Mobile',
      description: "참여자 정보의 '영업 가족'에 김철수가 추가됩니다.",
    },
    {
      kind: 'append_system_message',
      roomId: ROOM_ID,
      content: `입장: ${DESIGNER_NAME} (5250223)`,
      description: 'PC 본문에도 영업가족 입장 시스템 메시지가 기록됩니다.',
    },
  ],
  // 5. 인사 교환
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content: '안녕하세요',
      deviceTarget: 'all',
      description: '설계사가 모바일에서 인사 메시지를 보냅니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '반갑습니다. 앞으로 현재 채널에서 설계요청 진행해 주세요.',
      deviceTarget: 'all',
      description: '설계매니저가 PC 에서 안내 메시지를 보냅니다.',
    },
  ],
  // 6. 손글씨 사진 + 텍스트 메시지
  [
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: IMG_NOTE_MSG,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content: '고객 정보 손글씨로 보내드립니다.',
      attachments: [handwrittenAttachment],
      deviceTarget: 'all',
      description:
        '설계사가 종이에 적은 고객 정보(이름·주민번호·주소)를 사진으로 전송합니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: TEXT_REQUEST_MSG,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content: '월 1만원 내외로 운전자보험 설계부탁 합니다.',
      deviceTarget: 'all',
      description: '이어서 텍스트 메시지로 설계 요청을 보냅니다.',
    },
  ],
  // 7. 다중 메시지 선택 → 두 메시지 묶어 할 일 생성 → 모달 오픈 (OCR 추출 중)
  [
    {
      kind: 'enter_multi_select_mode',
      roomId: ROOM_ID,
      description:
        '설계매니저가 헤더의 ✓ 아이콘을 눌러 다중 메시지 선택 모드에 진입합니다.',
    },
    {
      kind: 'toggle_message_select',
      messageId: IMG_NOTE_MSG,
      on: true,
      description: '손글씨 사진 메시지를 선택합니다.',
    },
    {
      kind: 'toggle_message_select',
      messageId: TEXT_REQUEST_MSG,
      on: true,
      description:
        '이어서 텍스트 설계 요청 메시지도 함께 선택합니다 — 두 메시지를 한 건의 할 일로 묶습니다.',
    },
    {
      kind: 'highlight',
      selector: 'multi-select-create-task',
      description:
        '하단 "2개 메시지 선택됨 — 할 일 생성" 버튼을 안내합니다.',
    },
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: ROOM_ID,
        sourceMessageIds: [IMG_NOTE_MSG, TEXT_REQUEST_MSG],
        sourceMessageId: IMG_NOTE_MSG,
        mode: 'create',
        designer: DESIGNER_NAME,
      },
      description:
        "'할 일 등록' 모달이 열립니다. 출처 메시지에 사진·텍스트가 모두 포함되고 우측 패널에 손글씨 사진이 표시됩니다.",
    },
    {
      kind: 'exit_multi_select_mode',
      description: '다중 선택 모드를 종료합니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.title',
      value: '[박정균] 운전자보험 설계',
      description: '제목이 자동으로 채워집니다.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'extracting',
      description: '"OCR 추출 중..." 배지가 표시됩니다.',
    },
  ],
  // 8. OCR 시뮬 → 자동 입력 + "추출 완료" 배지
  [
    {
      kind: 'wait',
      ms: 1500,
      description: 'OCR/NER 분석을 진행합니다.',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '"OCR 추출 완료" 배지로 토글됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: CUSTOMER.name,
      description: `고객명 '${CUSTOMER.name}'이 자동 입력됩니다.`,
    },
    {
      kind: 'fill_input',
      field: 'task-registration.ssn',
      value: CUSTOMER.ssn,
      description: '주민등록번호가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.phone',
      value: CUSTOMER.phone,
      description: '휴대폰번호가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.address',
      value: CUSTOMER.address,
      description: '주소가 자동 입력됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.job',
      value: CUSTOMER.job,
      description: '직업/소속이 자동 입력됩니다.',
    },
  ],
  // 9. 저장 — task chip 부착 + RightRail TodoPanel 항목 추가
  [
    {
      kind: 'click_button',
      buttonId: 'task-registration.save',
      description: "'저장' 버튼을 클릭합니다.",
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: ROOM_ID,
      messageId: IMG_NOTE_MSG,
      taskId: TASK_ID,
      title: '[박정균] 운전자보험 설계',
      description:
        '사진 메시지 하단에 "처리중" 할 일 chip 이 부착되고, RightRail 의 할 일 패널에 항목이 추가됩니다.',
    },
  ],
  // 10. 모달 재오픈 (수정 모드) — 고객 등록
  [
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: ROOM_ID,
        sourceMessageId: IMG_NOTE_MSG,
        mode: 'edit',
        designer: DESIGNER_NAME,
      },
      description:
        "할 일을 다시 열어 수정 모드로 진입합니다. 하단에 '고객 등록 / 장기 가입 설계' 버튼이 노출됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.title',
      value: '[박정균] 운전자보험 설계',
      description: '제목이 유지됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.customerName',
      value: CUSTOMER.name,
      description: '저장된 고객 정보가 다시 표시됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.ssn',
      value: CUSTOMER.ssn,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.phone',
      value: CUSTOMER.phone,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.address',
      value: CUSTOMER.address,
      description: '',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.job',
      value: CUSTOMER.job,
      description: '',
    },
    {
      kind: 'set_ocr_status',
      modalId: 'task-registration',
      status: 'completed',
      description: '',
    },
    {
      kind: 'highlight',
      selector: 'task-registration.register-customer',
      description: "'고객 등록' 버튼을 안내합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.register-customer',
      description: "'고객 등록' 버튼을 클릭합니다.",
    },
    {
      kind: 'show_toast',
      message: '고객이 영업 시스템에 등록되었습니다.',
      tone: 'success',
      description: '영업 SFA 에 고객이 등록되었음을 알립니다.',
    },
  ],
  // 11. 가입설계동의서 비즈폼 — 모바일에서 작성 → 채팅 inline 카드
  [
    {
      kind: 'highlight',
      selector: 'task-registration.consent-request',
      description:
        "'장기 가입 설계' 가 비활성 — 먼저 '동의서 요청' 버튼이 안내됩니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.consent-request',
      description:
        "'동의서 요청' 을 클릭하면 설계사 모바일로 가입설계동의서 비즈폼이 발송됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'requested',
      description:
        "모달의 동의서 영역이 '동의서 요청 중 (설계사 작성 대기)' 로 변경됩니다.",
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫히고, 모바일로 시점이 옮겨갑니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'long-insurance-consent',
      title: '가입설계동의서',
      fields: [
        { id: 'customerName', label: '고객명', value: CUSTOMER.name },
        { id: 'ssn', label: '주민등록번호', value: CUSTOMER.ssn },
        { id: 'phone', label: '휴대폰번호', value: CUSTOMER.phone },
        { id: 'address', label: '주소', value: CUSTOMER.address },
        { id: 'productCategory', label: '동의 상품군', value: '운전자보험' },
        { id: 'agree', label: '개인정보 활용 동의' },
        { id: 'signature', label: '전자서명', file: true },
      ],
      description:
        '설계사 모바일에 가입설계동의서 비즈폼이 열립니다. 고객 정보가 미리 채워져 있습니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'agree',
      value: '동의',
      description: "'개인정보 활용 동의' 항목에 동의합니다.",
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'signature',
      value: '박정균_서명.png',
      description: '전자서명 이미지를 첨부합니다.',
    },
    {
      kind: 'submit_bizform',
      roomId: ROOM_ID,
      bizformId: CONSENT_BIZFORM_ID,
      title: '가입설계동의서',
      messageId: CONSENT_BIZFORM_MSG,
      description:
        '비즈폼을 제출합니다 — 채팅에 inline 비즈폼 카드가 추가되고 RightRail 비즈폼 패널에도 등록됩니다.',
    },
    {
      kind: 'fill_input',
      field: 'task-registration.consentStatus',
      value: 'completed',
      description: '동의서 등록완료 상태로 토글됩니다.',
    },
    {
      kind: 'show_toast',
      message: '가입설계동의서가 등록되었습니다.',
      tone: 'success',
      description: '동의서 수령 완료 토스트.',
    },
  ],
  // 12. 장기 가입 설계 → 외부 시스템 mock → PDF 채팅 전달
  [
    {
      kind: 'open_modal',
      modalId: 'task-registration',
      context: {
        roomId: ROOM_ID,
        sourceMessageIds: [IMG_NOTE_MSG, TEXT_REQUEST_MSG],
        sourceMessageId: IMG_NOTE_MSG,
        mode: 'edit',
        designer: DESIGNER_NAME,
      },
      description:
        '할 일을 다시 열면 동의서 등록완료 칩이 보이고 "장기 가입 설계" 버튼이 활성화됩니다.',
    },
    {
      kind: 'highlight',
      selector: 'task-registration.long-design',
      description: "활성화된 '장기 가입 설계' 버튼을 안내합니다.",
    },
    {
      kind: 'click_button',
      buttonId: 'task-registration.long-design',
      description:
        "'장기 가입 설계' 버튼을 클릭하면 외부 영업 시스템에서 설계가 시작됩니다.",
    },
    {
      kind: 'show_toast',
      message: '장기 가입 설계 시스템에서 설계 진행 중...',
      tone: 'info',
      description: '외부 시스템 mock 진행 중 토스트.',
    },
    {
      kind: 'wait',
      ms: 1500,
      description: '설계 처리 대기.',
    },
    {
      kind: 'close_modal',
      modalId: 'task-registration',
      description: '모달이 닫힙니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      messageId: PDF_FILE_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content: '가입제안서를 전달드립니다.',
      attachments: [
        {
          name: '가입제안서_박정균_206001234.pdf',
          size: 1456789,
          mime: 'application/pdf',
        },
      ],
      deviceTarget: 'all',
      description:
        '설계 결과 PDF 가 자동으로 채팅에 전송됩니다 — 다운로드 없이 채팅 안에서 완결.',
    },
  ],
  // 13. 할 일 완료 처리
  [
    {
      kind: 'update_task_chip_status',
      roomId: ROOM_ID,
      messageId: IMG_NOTE_MSG,
      taskId: TASK_ID,
      status: '완료',
      description:
        '메시지 하단 task chip 과 RightRail 의 할 일 항목이 모두 "완료" 로 변경됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content:
        '가입제안서 전달드렸습니다. 검토 후 회신 부탁드립니다. 처리 완료되었습니다.',
      deviceTarget: 'all',
      description: '설계매니저가 처리 완료를 안내합니다.',
    },
  ],
];

const stepTitles = [
  '새 대화방 만들기',
  '영업가족(설계사) 선택',
  '대화 채널 + 알림톡 발송',
  '설계사 모바일 입장',
  '인사 교환',
  '손글씨 사진 + 설계 요청',
  '다중 메시지 선택 → 할 일 생성 모달 오픈',
  'OCR/NER 자동 추출',
  '할 일 저장 — chip 부착',
  '고객 등록',
  '가입설계동의서 비즈폼 — 모바일 작성',
  '장기 가입 설계 → PDF 전달',
  '할 일 완료',
];

const stepDescriptions = [
  '설계매니저(김용익)가 우상단 "새 대화방 만들기"를 눌러 협업 채널 생성을 시작합니다.',
  '영업가족 탭에서 검색으로 "영업가족-김철수(5250223)"를 찾아 선택합니다.',
  '하나손해보험 / GA설계지원 채널을 선택하고 카카오 알림톡 초대장 발송을 켠 뒤 대화방을 생성합니다.',
  '설계사가 모바일에서 카카오 알림톡 초대를 수락해 공식 협업 채널에 입장합니다.',
  '설계사와 설계매니저가 인사 메시지를 주고받습니다 — 이제부터는 모든 업무가 이 채널에서 진행됩니다.',
  '설계사가 종이에 적은 고객 정보(이름·주민번호·주소)를 사진으로 보내고, 이어서 텍스트로 설계 조건을 요청합니다.',
  '설계매니저가 헤더 ✓ 로 다중 선택 모드에 들어가 사진 + 텍스트 두 메시지를 한 건의 할 일로 묶고 하단 "할 일 생성" 버튼을 누르면 모달이 열립니다.',
  'OCR/NER 분석이 끝나면 고객명·주민번호·휴대폰·주소·직업 5개 필드가 자동으로 채워지고 "OCR 추출 완료" 배지가 표시됩니다.',
  '저장하면 사진 메시지에 "처리중" 할 일 chip 이 부착되고 우측 RightRail 의 할 일 패널에 항목이 추가됩니다.',
  '할 일을 다시 열어 "고객 등록" 버튼을 누르면 영업 시스템(SFA)에 고객이 등록됩니다.',
  '동의서 미수령 상태에서는 "장기 가입 설계" 가 비활성화됩니다. "동의서 요청"을 누르면 설계사 모바일에 가입설계동의서 비즈폼이 발송되고, 설계사가 작성·서명·제출하면 채팅에 inline 카드가 추가되며 동의서가 등록완료로 바뀝니다.',
  '"장기 가입 설계" 버튼을 누르면 외부 영업 시스템에서 설계가 진행되고 결과 PDF 가 채팅에 자동으로 전송됩니다.',
  '할 일 chip 과 RightRail 항목이 모두 "완료" 로 변경되고 설계매니저가 처리 결과를 안내합니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `hi-step-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

// ─────────────────────────────────────────────────────────
// beforeSteps — 개인 카카오톡 (비정형, 누락/추적 불가)
// ─────────────────────────────────────────────────────────
const beforeActions: UIAction[][] = [
  // b1. 개인 카톡으로 손글씨 + 설계 요청
  [
    {
      kind: 'add_room',
      roomId: KAKAO_ROOM_ID,
      title: '김용익 ↔ 김철수 (개인 카카오톡)',
      participantCount: 2,
      preview: '월 1만원 내외로 설계부탁 합니다.',
      description:
        '개인 카카오톡에 임시 1:1 채팅방이 만들어집니다 (인증·소속 검증 없음).',
    },
    {
      kind: 'select_room',
      roomId: KAKAO_ROOM_ID,
      description: '본문에서 카카오톡 채팅방을 선택합니다.',
    },
    {
      kind: 'add_participant',
      roomId: KAKAO_ROOM_ID,
      participantId: HOST_ID,
      displayName: `${HOST_NAME}(하나손보)`,
      external: false,
      isHost: true,
      description: '설계매니저가 방장으로 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: KAKAO_ROOM_ID,
      participantId: DESIGNER_ID,
      displayName: DESIGNER_NAME,
      external: true,
      device: 'Mobile',
      description: '설계사도 입장합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      messageId: KAKAO_IMG_MSG,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content: '고객 정보 손글씨로 보내드립니다.',
      attachments: [handwrittenAttachment],
      deviceTarget: 'all',
      description: '설계사가 손글씨 사진을 개인 카톡으로 전송합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      messageId: KAKAO_TEXT_MSG,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content: '월 1만원 내외로 설계부탁 합니다.',
      deviceTarget: 'all',
      description: '설계 조건을 텍스트로 요청합니다.',
    },
  ],
  // b2. 수동 옮겨적기 — 이력 없음 / 검색 불가 / 누락 위험
  [
    {
      kind: 'append_system_message',
      roomId: KAKAO_ROOM_ID,
      content:
        '⚠ 개인 카톡 — 업무 이력 없음 / 검색 불가 / 누락 위험. 메모장으로 옮겨 적어야 합니다.',
      description: '문제점을 시스템 메시지로 시연합니다.',
    },
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'me', userId: HOST_ID, displayName: HOST_NAME },
      content:
        '(메모장에 수기 옮기는 중) 박정균 / 010-3456-7890 / 서울시 강동구 명일동 LG아파트 ...',
      deviceTarget: 'all',
      description: '설계매니저가 외부 메모장으로 정보를 수동 옮겨 적습니다.',
    },
  ],
  // b3. 같은 고객의 다른 요청이 다른 채널에서 도착 — 추적 불가
  [
    {
      kind: 'append_chat',
      roomId: KAKAO_ROOM_ID,
      from: { role: 'customer', userId: DESIGNER_ID, displayName: DESIGNER_NAME },
      content:
        '(다른 카톡방에서 추가) 같은 고객 박정균에 대해 종신보험도 알아봐 주세요.',
      deviceTarget: 'all',
      description:
        '같은 고객의 두 번째 요청이 다른 카카오톡 방에서 도착해 이력 통합이 어렵습니다.',
    },
    {
      kind: 'append_system_message',
      roomId: KAKAO_ROOM_ID,
      content:
        '⚠ 같은 고객의 요청이 여러 채널에 분산 — 통합 이력 / 처리 추적 불가.',
      description: 'Before 흐름의 한계: 데이터 분산, 검색·추적 어려움.',
    },
  ],
];

const beforeTitles = [
  '개인 카톡으로 손글씨 + 설계 요청',
  '수동 옮겨적기 — 이력 없음',
  '다른 채널에서 추가 요청 — 추적 불가',
];

const beforeDescriptions = [
  '설계사가 개인 카카오톡으로 종이에 적은 고객 정보 사진과 설계 조건 텍스트를 보냅니다 — 인증/소속 검증 없음.',
  '설계매니저가 외부 메모장에 직접 옮겨 적습니다 — 업무 이력이 시스템에 남지 않고 검색/누락 위험이 있습니다.',
  '같은 고객의 추가 요청이 다른 카톡방에서 도착하여 이력 통합과 처리 추적이 불가능합니다.',
];

const beforeSteps: Step[] = beforeActions.map((actions, i) => ({
  id: `hi-before-${(i + 1).toString().padStart(2, '0')}`,
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
    '개인 카카오톡 → 공식 협업 채널로 전환',
    '메시지/이미지 → OCR/NER 로 고객 정보 자동 추출',
    '할 일(Task) 자동 생성으로 누락 / 추적 불가 해소',
    '설계 결과(PDF)까지 채팅 안에서 완결',
  ],
  metrics: [
    {
      label: '업무 등록 시간',
      before: 100,
      after: 25,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '요청 누락 가능성',
      before: 40,
      after: 0,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '처리 추적 가능성',
      before: 10,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
  ],
  steps,
  beforeSteps,
};

export default scenario;

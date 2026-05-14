import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-rental-sales-bridge.meta';
import {
  SK_BIZ_CERT_ATTACHMENT,
  SK_BIZFORM_ID,
  SK_BIZFORM_MSG_ID,
  SK_CHANNEL_NAME,
  SK_HOST_GREETING_MSG_ID,
  SK_HOST_QUOTE_MSG_ID,
  SK_K3_CAR_IMAGES,
  SK_PARK_INQUIRY_MSG_ID,
  SK_PARK_REQUEST_MSG_ID,
  SK_PERSONAL_KAKAO_ROOM_ID,
  SK_QUOTE_PDF_ATTACHMENT,
  SK_RENTAL_CUST_PARK_DISPLAY,
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_DISPLAY,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  SK_RENTAL_STAFF_PREV_NAME,
  SK_TASK_ID,
  createSkRentalSeed,
} from './_shared-seeds';

// ─────────────────────────────────────────────────────────────────────
// afterSteps — 법인폰 SalesBridge + 카카오 상담톡 공식 채널
// ─────────────────────────────────────────────────────────────────────
const stepActions: UIAction[][] = [
  // 1. 카카오 알림톡으로 고객 초대 (PC 정대리)
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
        "'대화방 생성' 모달이 열리고 거래처(외부) 탭이 보입니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.external.search',
      value: '박찬호',
      description: "검색창에 '박찬호' 고객을 입력합니다.",
    },
    {
      kind: 'toggle_check',
      itemId: `create-room.external.${SK_RENTAL_CUST_PARK_ID}`,
      on: true,
      description: '(주)한솔무역 박찬호 대표를 선택합니다.',
    },
    {
      kind: 'click_button',
      buttonId: 'create-room.next',
      description: "'다음' 버튼으로 채널 설정 단계로 이동합니다.",
    },
    {
      kind: 'set_modal_step',
      modalId: 'create-room',
      step: 2,
      description: "2단계 '대화 채널 설정' 화면이 표시됩니다.",
    },
    {
      kind: 'fill_input',
      field: 'create-room.title',
      value: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역) ↔ ${SK_RENTAL_HOST_NAME}`,
      description: '대화방 제목이 거래처 정보로 자동 채워집니다.',
    },
    {
      kind: 'toggle_check',
      itemId: 'create-room.kakao',
      on: true,
      description: `카카오 알림톡으로 ${SK_CHANNEL_NAME} 초대장을 발송하기를 켭니다.`,
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
      roomId: SK_RENTAL_ROOM_ID,
      title: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역) ↔ ${SK_RENTAL_HOST_NAME}`,
      participantCount: 1,
      preview: '카카오 알림톡 초대를 발송했습니다.',
      toast: {
        message: `카카오 알림톡(비즈뿌리오) 발송 완료 — ${SK_CHANNEL_NAME}`,
        tone: 'success',
      },
      description:
        '좌측 채널 리스트에 새 카카오 상담톡 채널이 추가되고 토스트가 표시됩니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: 'PC 본문에서 새 카카오 상담톡 채널이 선택됩니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_HOST_ID,
      displayName: SK_RENTAL_HOST_DISPLAY,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트 정대리가 참여자에 포함됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `입장: ${SK_RENTAL_HOST_NAME} (SK렌터카 영업1팀) — ${SK_CHANNEL_NAME}`,
      description: 'PC 본문 시스템 메시지로 호스트 입장이 기록됩니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-alimtalk-invite',
      title: `${SK_CHANNEL_NAME} 초대장 (카카오 알림톡)`,
      body: `${SK_RENTAL_CUST_PARK_NAME} 고객님. 요청하신 K3 1년 단기렌탈 상담을 위해 ${SK_CHANNEL_NAME} 으로 초대드렸습니다. 초대를 수락하시면 상담이 시작됩니다.`,
      ctaLabel: '초대 수락',
      description:
        '동시에 박찬호 고객의 개인 카카오톡에 비즈뿌리오 알림톡 카드가 도착합니다.',
    },
  ],
  // 2. 박찬호 "초대 수락" → 카카오 상담톡 공식 채널 입장
  [
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-alimtalk-invite',
      description:
        '박찬호가 카카오 알림톡의 "초대 수락" 을 누르면 카카오 상담톡 공식 채널로 진입합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_CUST_PARK_ID,
      displayName: SK_RENTAL_CUST_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '참여자 정보에 박찬호 (외부 고객) 가 추가됩니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `입장: ${SK_RENTAL_CUST_PARK_NAME} (한솔무역 대표) · ${SK_CHANNEL_NAME} — 본 채널은 비즈니스 채널이며 대화 이력이 SK렌터카 시스템에 보관됩니다.`,
      description:
        '카카오 상담톡 채널의 비즈니스 채널 고지가 시스템 메시지로 기록됩니다.',
    },
  ],
  // 3. 박찬호 K3 견적 문의 + 정대리 법인폰 FCM 푸시
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_PARK_INQUIRY_MSG_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content:
        '안녕하세요. K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요? 법인 명의로 진행할 예정입니다.',
      deviceTarget: 'all',
      description:
        '박찬호가 카카오 상담톡 공식 채널에 K3 단기렌탈 견적 문의를 남깁니다.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-fcm-inbound',
      title: 'FCM 푸시 — 새 메시지',
      body: `${SK_RENTAL_CUST_PARK_NAME}: K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요?`,
      ctaLabel: '대화하기',
      description:
        '정대리 법인폰 SalesBridge 앱에 FCM 푸시가 도착합니다. (외근 중에도 즉시 인지)',
    },
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-fcm-inbound',
      description:
        '정대리가 푸시를 탭해 법인폰에서 같은 채널로 진입합니다 — 같은 회사 채널을 두 디바이스(PC·법인폰) 에서 모두 응대 가능.',
    },
  ],
  // 4. 응대 + K3 차종 사진 3장 + 사업자등록증 비즈폼
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_GREETING_MSG_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '박찬호 대표님, SK렌터카 영업1팀 정민수 대리입니다. K3 차종 사진 먼저 보내드리고, 사업자 정보 확인되면 견적 회신드리겠습니다.',
      attachments: SK_K3_CAR_IMAGES,
      deviceTarget: 'all',
      description:
        '정대리가 인사 + K3 차종 사진 3장을 한 메시지에 카톡 스타일 그리드로 첨부해 전송합니다.',
    },
    {
      kind: 'attach_bizform',
      roomId: SK_RENTAL_ROOM_ID,
      bizformId: SK_BIZFORM_ID,
      templateId: 'sk-corp-info',
      title: '법인 정보 등록',
      messageId: SK_BIZFORM_MSG_ID,
      fields: [
        { id: 'businessNo', label: '사업자등록번호' },
        { id: 'corpName', label: '법인명' },
        { id: 'ceoName', label: '대표자' },
        { id: 'vehicleUsage', label: '차량 용도' },
        { id: 'bizCert', label: '사업자등록증 첨부', file: true },
      ],
      description:
        '정대리가 견적 회신 전 필수 메타데이터를 받기 위해 "법인 정보 등록" 비즈폼을 채널에 부착합니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'sk-corp-info',
      title: '법인 정보 등록',
      fields: [
        { id: 'businessNo', label: '사업자등록번호' },
        { id: 'corpName', label: '법인명' },
        { id: 'ceoName', label: '대표자' },
        { id: 'vehicleUsage', label: '차량 용도' },
        { id: 'bizCert', label: '사업자등록증 첨부', file: true },
      ],
      description: '박찬호 법인폰에서 비즈폼 입력 화면이 열립니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'businessNo',
      value: '214-87-65432',
      description: '사업자등록번호를 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'corpName',
      value: '(주)한솔무역',
      description: '법인명을 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'ceoName',
      value: SK_RENTAL_CUST_PARK_NAME,
      description: '대표자명을 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'vehicleUsage',
      value: '임원 출퇴근용 (월 평균 1,800km)',
      description: '차량 용도를 입력합니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'bizCert',
      value: SK_BIZ_CERT_ATTACHMENT.name,
      description: '사업자등록증 이미지를 첨부합니다.',
    },
    {
      kind: 'submit_bizform',
      roomId: SK_RENTAL_ROOM_ID,
      bizformId: SK_BIZFORM_ID,
      title: '법인 정보 등록',
      messageId: SK_BIZFORM_MSG_ID,
      description: '박찬호가 비즈폼을 제출합니다.',
    },
    {
      kind: 'approve_bizform',
      bizformId: SK_BIZFORM_ID,
      description: '정대리가 PC RightRail 에서 비즈폼을 승인합니다.',
    },
    {
      kind: 'show_toast',
      message:
        'DB Mart 적재 — 사업자번호 · 법인명 · 대표자 · 차량용도 · 사업자등록증 (Action Power 파이프라인)',
      tone: 'success',
      description:
        '제출된 법인 메타가 상담이력 API 를 통해 DB Mart 에 자산화됩니다.',
    },
  ],
  // 5. 견적서 PDF 회신 → 할 일 chip → 완료
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_QUOTE_MSG_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '법인 정보 확인했습니다. K3 1년 단기렌탈 월 38만원 견적서 첨부드립니다. 후속 안내 전화는 내일 오후 2시에 드리겠습니다.',
      attachments: [SK_QUOTE_PDF_ATTACHMENT],
      deviceTarget: 'all',
      description:
        '정대리가 견적서 PDF 를 채널에 첨부해 회신합니다.',
    },
    {
      kind: 'attach_file',
      roomId: SK_RENTAL_ROOM_ID,
      fileId: 'sk-file-quote-v1',
      name: SK_QUOTE_PDF_ATTACHMENT.name,
      size: SK_QUOTE_PDF_ATTACHMENT.size,
      mime: SK_QUOTE_PDF_ATTACHMENT.mime,
      description:
        '견적서가 카카오 상담톡 채널의 파일 라이브러리에 자동 보관됩니다.',
    },
    {
      kind: 'add_task',
      roomId: SK_RENTAL_ROOM_ID,
      taskId: SK_TASK_ID,
      title: '견적 후속 안내 전화 (한솔무역 박찬호 · K3)',
      assignee: SK_RENTAL_HOST_NAME,
      dueDate: '내일 14:00',
      status: '진행중',
      sourceMessageId: SK_HOST_QUOTE_MSG_ID,
      description:
        '메시지에서 곧바로 후속 전화 할 일이 등록됩니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_QUOTE_MSG_ID,
      taskId: SK_TASK_ID,
      title: '견적 후속 안내 전화 (내일 14:00)',
      description:
        '메시지 하단에 처리중 할 일 chip 이 부착됩니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_PARK_REQUEST_MSG_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '견적 잘 받았습니다. 내일 통화 후 계약 진행하겠습니다.',
      deviceTarget: 'all',
      description: '박찬호가 견적 수령 확인 메시지를 남깁니다.',
    },
    {
      kind: 'update_task_chip_status',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_QUOTE_MSG_ID,
      taskId: SK_TASK_ID,
      status: '완료',
      description:
        '후속 전화 약속까지 잡혀 해당 할 일 chip 이 완료로 갱신됩니다.',
    },
  ],
  // 6. 동료 김주임 퇴사 → 고객 이관 (set_section + toast 만)
  [
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: '— 같은 날 오후, 영업관리 차상훈 팀장이 회의를 소집 —',
      description: '시간 흐름과 맥락 전환을 시스템 메시지로 안내합니다.',
    },
    {
      kind: 'highlight',
      selector: 'sidebar.external',
      description:
        "관리자가 좌측 '외부 사용자' 메뉴로 진입해 영업사원별 고객 리스트를 엽니다.",
    },
    {
      kind: 'set_section',
      section: 'external',
      description:
        '외부 사용자(거래처) 관리 화면에서 김주임이 담당하던 고객 12명을 일괄 선택할 준비를 합니다.',
    },
    {
      kind: 'show_toast',
      message: `${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME}: 고객 12명 · 대화방 12개 · 파일 78건 이관 완료 (이력 100% 승계)`,
      tone: 'success',
      description:
        '관리자가 김주임의 전체 고객 12명을 정대리로 일괄 이관합니다. 대화·파일·DB Mart 이력 모두 그대로 승계.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `담당자 변경: ${SK_RENTAL_STAFF_PREV_NAME} → ${SK_RENTAL_HOST_NAME} (사유: 인사이동)`,
      description:
        '이관된 방들에는 자동으로 담당자 변경 시스템 메시지가 기록됩니다.',
    },
  ],
  // 7. 1일 마감 + DB Mart 적재 요약
  [
    {
      kind: 'set_section',
      section: 'talk',
      description:
        '이관 처리를 마치고 카카오 상담톡 채널로 돌아와 1일 마감 요약을 확인합니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: '박찬호 카카오 상담톡 채널을 다시 엽니다.',
    },
    {
      kind: 'show_toast',
      message:
        '오늘 응대 32건 · 신규 고객 5명 · 메시지 482건 · 파일 78건 · DB Mart 적재 완료 (Action Power)',
      tone: 'success',
      description:
        'DB Mart 파이프라인이 정상 적재 결과를 요약 토스트로 보고합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content:
        '✓ 정대리 1일 마감 — 모든 대화·파일·고객 메타가 SK렌터카 시스템에 보관됨. 외부 채널(개인 카카오톡) 사용 0건.',
      description:
        '회사 차원에서 외부채널 차단·자산화·이력 보존이 동시에 달성되었다는 점을 시스템 메시지로 정리합니다.',
    },
  ],
];

const stepTitles = [
  '카카오 알림톡으로 고객 초대',
  '박찬호 "초대 수락" → 카카오 상담톡 채널 입장',
  '고객 견적 문의 + 정대리 법인폰 FCM 푸시',
  '응대 + K3 사진 3장 + 사업자 비즈폼으로 메타 수집',
  '견적서 PDF 회신 + 할 일 chip 등록 → 완료',
  '동료 김주임 이직 → 고객 12명 일괄 이관',
  '1일 마감 + DB Mart 적재 요약',
];

const stepDescriptions = [
  '정대리가 PC 에서 한솔무역 박찬호 대표를 외부 참여자로 선택하고 카카오 알림톡 발송을 켠 채로 채널을 생성합니다 — 외부채널이 아닌 SK렌터카 공식 채널로만 응대.',
  '박찬호가 개인 카카오톡에 도착한 비즈뿌리오 알림톡의 "초대 수락" 버튼을 눌러 SK렌터카 카카오 상담톡 공식 채널에 진입합니다.',
  '박찬호가 K3 단기렌탈 견적을 요청하자 외근 중인 정대리 법인폰 SalesBridge 앱에 FCM 푸시가 즉시 도착합니다.',
  '정대리가 K3 차종 사진 3장을 카톡 스타일 그리드로 보내고, "법인 정보 등록" 비즈폼으로 사업자번호·차량용도·사업자등록증을 받아 DB Mart 에 자산화합니다.',
  '정대리가 견적서 PDF 를 회신하고 메시지에서 곧바로 후속 안내 전화 할 일을 등록합니다. 박찬호 수령 확인 후 chip 이 완료로 갱신됩니다.',
  '영업1팀 김주임이 동종업계로 이직함에 따라 차상훈 팀장이 김주임의 고객 12명·대화방 12개·파일 78건을 정대리로 일괄 이관합니다 — 인수인계 100%.',
  '대시보드에서 1일 응대 통계와 DB Mart 적재 결과를 확인합니다. 외부 채널 사용 0건 — 모든 대화·파일·고객 메타가 회사 자산으로 보관됩니다.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-step-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

// ─────────────────────────────────────────────────────────────────────
// beforeSteps — 같은 일을 정대리 개인 카카오톡으로 했을 때
// ─────────────────────────────────────────────────────────────────────
const beforeActions: UIAction[][] = [
  // B1. 개인 카톡으로 견적 문의 받음 (회사 시스템 외부)
  [
    {
      kind: 'add_room',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      title: `${SK_RENTAL_HOST_NAME} ↔ ${SK_RENTAL_CUST_PARK_NAME} (개인 카카오톡)`,
      participantCount: 2,
      preview: 'K3 1년 단기렌탈 견적 한 번 받아볼 수 있을까요?',
      description:
        '정대리와 박찬호의 개인 카카오톡 1:1 방이 생성됩니다 (회사 시스템과 완전 분리).',
    },
    {
      kind: 'select_room',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      description: 'PC 본문에서 개인 카카오톡 방을 선택합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      participantId: SK_RENTAL_HOST_ID,
      displayName: SK_RENTAL_HOST_DISPLAY,
      external: false,
      isHost: true,
      description: '정대리가 개인 카톡 호스트로 입장합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      participantId: SK_RENTAL_CUST_PARK_ID,
      displayName: SK_RENTAL_CUST_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '박찬호도 개인 카톡에 입장합니다 (회사 통제 밖).',
    },
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: 'K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요?',
      deviceTarget: 'all',
      description: '박찬호가 정대리 개인 번호로 카톡 견적 문의를 보냅니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content: '네 대표님, 견적 작성해서 보내드릴게요.',
      deviceTarget: 'all',
      description:
        '정대리가 개인 카톡으로 응답합니다 — 회사 시스템에는 어떤 이력도 남지 않습니다.',
    },
    {
      kind: 'show_toast',
      message: 'DB Mart 미적재 — 회사 자산 아님',
      tone: 'warning',
      description:
        '이 대화는 회사 상담이력 API 대상이 아니므로 DB Mart 에 적재되지 않습니다.',
    },
  ],
  // B2. 견적서·사업자등록증을 개인 카톡으로 주고받음
  [
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content: 'K3 1년 단기렌탈 월 38만원 견적서입니다.',
      attachments: [SK_QUOTE_PDF_ATTACHMENT],
      deviceTarget: 'all',
      description: '정대리가 견적서 PDF 를 개인 카톡으로 회신합니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '감사합니다. 사업자등록증 사진 보내드립니다.',
      attachments: [SK_BIZ_CERT_ATTACHMENT],
      deviceTarget: 'all',
      description:
        '박찬호가 사업자등록증을 개인 카톡 사진으로 전송합니다 (보안·자산화 모두 빈손).',
    },
    {
      kind: 'append_system_message',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      content:
        '⚠ 견적서 · 사업자등록증 모두 정대리 개인 단말에만 저장 — 회사 시스템에는 이력 없음 · 사업자번호 메타 미적재',
      description:
        '주고받은 파일이 정대리 개인 카톡 안에만 머물러, 회사 차원에서는 어떤 자료가 오갔는지 알 수 없습니다.',
    },
    {
      kind: 'show_toast',
      message: '외부 채널 사용 — 기업 보안 리스크 (개인 단말 노출 / 감사 불가)',
      tone: 'warning',
      description:
        '법인 메타가 외부 채널에 분산된 상태가 됩니다.',
    },
  ],
  // B3. 김주임 이직 → 개인 카톡 12명 회수 불가
  [
    {
      kind: 'append_system_message',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      content: '— 한 달 후, 동료 김주임이 동종업계로 이직 —',
      description: '시간 흐름을 시스템 메시지로 안내합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      content: `⚠ ${SK_RENTAL_STAFF_PREV_NAME} 의 개인 카카오톡 계정 비활성화 — SK렌터카가 관리하던 고객 12명·대화 이력·견적·사업자등록증 모두 회수 불가`,
      description:
        '김주임이 자기 개인 카톡에 들고 있던 거래처 12명이 그대로 사라집니다.',
    },
    {
      kind: 'show_toast',
      message: '고객 12명 · 대화방 0건 · 파일 0건 회수 (이력 100% 소실)',
      tone: 'warning',
      description:
        '인수인계가 강제될 수 없으며, 같은 거래처가 경쟁사로 따라가는 결과로 이어집니다.',
    },
  ],
  // B4. 두 달 후 박찬호 재문의 → 정대리 모름
  [
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content:
        '안녕하세요. 지난번 K3 같은 조건으로 추가 1대 더 부탁드려요. (재문의)',
      deviceTarget: 'all',
      description: '박찬호가 두 달 뒤 정대리에게 재문의를 합니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '(개인 카톡 스크롤로 두 달 전 견적 찾는 중) 사업자번호 다시 한 번 보내주실 수 있을까요?',
      deviceTarget: 'all',
      description:
        '정대리는 회사 시스템에 박찬호 사업자번호·차량용도가 없어 같은 정보를 다시 요청합니다.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_PERSONAL_KAKAO_ROOM_ID,
      content:
        '⚠ 정대리는 박찬호의 사업자번호 · 차량용도 · 과거 견적서를 회사 어디서도 조회할 수 없음 (인수인계 0건 + DB Mart 0건)',
      description:
        '회사 차원의 가시성·이력 자산이 전혀 없습니다. 영업 생산성 손실 + 고객 신뢰 손실로 이어집니다.',
    },
    {
      kind: 'show_toast',
      message: '같은 정보를 다시 요청 → 고객 신뢰 손실 + 중복 작업 비용',
      tone: 'warning',
      description:
        '이력 부재로 영업사원이 동일한 정보를 다시 받아 입력해야 합니다.',
    },
  ],
];

const beforeTitles = [
  '개인 카톡으로 견적 문의 받음 (외부 채널)',
  '견적서·사업자등록증 개인 카톡으로 주고받음',
  '김주임 이직 → 개인 카톡 거래처 12명 회수 불가',
  '두 달 후 재문의 → 정대리는 박찬호 정보 모름',
];

const beforeDescriptions = [
  '박찬호가 정대리 개인 카카오톡으로 K3 견적을 문의합니다 — SK렌터카 시스템 외부에서 영업이 시작됩니다.',
  '견적서와 사업자등록증을 모두 개인 카톡 사진/파일로 주고받습니다. 회사 차원에서는 어떤 메타도 자산화되지 않습니다.',
  '동료 김주임이 동종업계로 이직하며 개인 카톡에 들고 있던 거래처 12명이 그대로 사라집니다. 인수인계 강제 불가.',
  '두 달 뒤 박찬호가 추가 문의를 보내자 정대리는 회사 어디서도 사업자번호·차량용도·과거 견적서를 조회할 수 없어 동일 정보를 다시 요청합니다.',
];

const beforeSteps: Step[] = beforeActions.map((actions, i) => ({
  id: `sk-before-${(i + 1).toString().padStart(2, '0')}`,
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
    '영업사원 200여 명이 개인 카카오톡 대신 법인폰 SalesBridge 의 카카오 상담톡 공식 채널로만 응대 (외부채널 차단)',
    '대화·파일·사업자 메타데이터를 Action Power 파이프라인으로 DB Mart 에 자동 자산화',
    '동종업계 이직이 빈번한 환경에서 거래처 이력을 100% 회사 자산으로 보존 — 관리자 일괄 이관으로 인수인계 강제',
    '카카오 알림톡(비즈뿌리오) · FCM 푸시 · MDM 배포 등 시스템 연동으로 200명 분산 환경의 응대 속도 유지',
  ],
  metrics: [
    {
      label: '외부 채널(개인 카톡) 응대 비중',
      before: 100,
      after: 0,
      unit: '%',
      improvementDirection: 'down',
    },
    {
      label: '고객 메타 DB Mart 자산화율',
      before: 0,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '이직 시 거래처 이력 보존',
      before: 0,
      after: 100,
      unit: '%',
      improvementDirection: 'up',
    },
    {
      label: '재문의 시 정보 재요청',
      before: 100,
      after: 5,
      unit: '%',
      improvementDirection: 'down',
    },
  ],
  seed: createSkRentalSeed(),
  steps,
  beforeSteps,
};

export default scenario;

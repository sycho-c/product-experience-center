import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';
import { meta } from './sk-flow-new-customer-lifecycle.meta';
import {
  SK_BIZ_CERT_ATTACHMENT,
  SK_BIZFORM_ID,
  SK_BIZFORM_MSG_ID,
  SK_CHANNEL_NAME,
  SK_HOST_QUOTE_MSG_ID,
  SK_QUOTE_PDF_ATTACHMENT,
  SK_RENTAL_CUST_PARK_DISPLAY,
  SK_RENTAL_CUST_PARK_ID,
  SK_RENTAL_CUST_PARK_NAME,
  SK_RENTAL_HOST_DISPLAY,
  SK_RENTAL_HOST_ID,
  SK_RENTAL_HOST_NAME,
  SK_RENTAL_ROOM_ID,
  SK_TASK_ID,
  createSkRentalSeed,
} from './_shared-seeds';

const BIZFORM_FIELDS = [
  { id: 'businessNo', label: '사업자등록번호' },
  { id: 'corpName', label: '법인명' },
  { id: 'ceoName', label: '대표자' },
  { id: 'vehicleUsage', label: '차량 용도' },
  { id: 'bizCert', label: '사업자등록증 첨부', file: true },
];

const stepActions: UIAction[][] = [
  // 1. 알림톡 초대 → 채널 입장
  [
    {
      kind: 'add_room',
      roomId: SK_RENTAL_ROOM_ID,
      title: `${SK_RENTAL_CUST_PARK_NAME} (한솔무역) ↔ ${SK_RENTAL_HOST_NAME}`,
      participantCount: 1,
      preview: '카카오 알림톡 발송 완료',
      toast: { message: `카카오 알림톡 발송 — ${SK_CHANNEL_NAME}`, tone: 'success' },
      description: '정대리가 박찬호를 알림톡으로 초대해 채널을 생성합니다.',
    },
    {
      kind: 'select_room',
      roomId: SK_RENTAL_ROOM_ID,
      description: '새 채널을 선택합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_HOST_ID,
      displayName: SK_RENTAL_HOST_DISPLAY,
      external: false,
      device: 'PC',
      isHost: true,
      description: '호스트 정대리 입장.',
    },
    {
      kind: 'mobile_push_notice',
      noticeId: 'sk-lifecycle-invite',
      title: `${SK_CHANNEL_NAME} 초대장 (카카오 알림톡)`,
      body: '초대를 수락하시면 상담이 시작됩니다.',
      ctaLabel: '초대 수락',
      description: '박찬호 카톡에 알림톡 카드 도착.',
    },
    {
      kind: 'mobile_open_room',
      roomId: SK_RENTAL_ROOM_ID,
      noticeId: 'sk-lifecycle-invite',
      description: '박찬호가 초대를 수락해 채널에 진입합니다.',
    },
    {
      kind: 'add_participant',
      roomId: SK_RENTAL_ROOM_ID,
      participantId: SK_RENTAL_CUST_PARK_ID,
      displayName: SK_RENTAL_CUST_PARK_DISPLAY,
      external: true,
      device: 'Mobile',
      description: '박찬호(외부 고객) 입장.',
    },
    {
      kind: 'append_system_message',
      roomId: SK_RENTAL_ROOM_ID,
      content: `입장: ${SK_RENTAL_CUST_PARK_NAME} · ${SK_CHANNEL_NAME} — 비즈니스 채널`,
      description: '비즈니스 채널 고지 시스템 메시지.',
    },
  ],
  // 2. 박찬호 견적 문의 + 정대리 응대
  [
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: 'K3 1년 단기렌탈 월 견적 한 번 받아볼 수 있을까요? 법인 명의입니다.',
      deviceTarget: 'all',
      description: '박찬호가 견적 문의를 남깁니다.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'me',
        userId: SK_RENTAL_HOST_ID,
        displayName: SK_RENTAL_HOST_NAME,
      },
      content:
        '안녕하세요 대표님, SK렌터카 정민수입니다. 사업자 정보 받고 견적 보내드리겠습니다.',
      deviceTarget: 'all',
      description: '정대리가 인사 + 응대 시작.',
    },
  ],
  // 3. 비즈폼 → 사업자 메타 수집 → DB Mart 적재
  [
    {
      kind: 'attach_bizform',
      roomId: SK_RENTAL_ROOM_ID,
      bizformId: SK_BIZFORM_ID,
      templateId: 'sk-corp-info',
      title: '법인 정보 등록',
      messageId: SK_BIZFORM_MSG_ID,
      fields: BIZFORM_FIELDS,
      description: '"법인 정보 등록" 비즈폼을 채널에 부착합니다.',
    },
    {
      kind: 'mobile_open_bizform',
      templateId: 'sk-corp-info',
      title: '법인 정보 등록',
      fields: BIZFORM_FIELDS,
      description: '박찬호 법인폰에서 비즈폼 입력 화면이 열립니다.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'businessNo',
      value: '214-87-65432',
      description: '사업자번호 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'corpName',
      value: '(주)한솔무역',
      description: '법인명 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'ceoName',
      value: SK_RENTAL_CUST_PARK_NAME,
      description: '대표자 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'vehicleUsage',
      value: '임원 출퇴근',
      description: '차량 용도 입력.',
    },
    {
      kind: 'mobile_fill_bizform_field',
      fieldId: 'bizCert',
      value: SK_BIZ_CERT_ATTACHMENT.name,
      description: '사업자등록증 첨부.',
    },
    {
      kind: 'submit_bizform',
      roomId: SK_RENTAL_ROOM_ID,
      bizformId: SK_BIZFORM_ID,
      title: '법인 정보 등록',
      messageId: SK_BIZFORM_MSG_ID,
      description: '박찬호가 비즈폼 제출.',
    },
    {
      kind: 'approve_bizform',
      bizformId: SK_BIZFORM_ID,
      description: '정대리가 비즈폼을 승인.',
    },
    {
      kind: 'show_toast',
      message: 'DB Mart 적재 — 사업자번호 · 법인명 · 차량용도 · 사업자등록증',
      tone: 'success',
      description: '상담이력 API → Action Power → DB Mart 적재.',
    },
  ],
  // 4. 견적서 회신 + 할 일 chip + 완료
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
      content: 'K3 1년 단기렌탈 월 38만원 견적서입니다.',
      attachments: [SK_QUOTE_PDF_ATTACHMENT],
      deviceTarget: 'all',
      description: '정대리가 견적서 PDF 첨부 회신.',
    },
    {
      kind: 'attach_file',
      roomId: SK_RENTAL_ROOM_ID,
      fileId: 'sk-flow-quote-v1',
      name: SK_QUOTE_PDF_ATTACHMENT.name,
      size: SK_QUOTE_PDF_ATTACHMENT.size,
      mime: SK_QUOTE_PDF_ATTACHMENT.mime,
      description: '견적서가 파일 라이브러리에 등록됩니다.',
    },
    {
      kind: 'add_task',
      roomId: SK_RENTAL_ROOM_ID,
      taskId: SK_TASK_ID,
      title: '견적 후속 안내 전화 (박찬호 · K3)',
      assignee: SK_RENTAL_HOST_NAME,
      dueDate: '내일 14:00',
      status: '진행중',
      sourceMessageId: SK_HOST_QUOTE_MSG_ID,
      description: '후속 안내 전화 할 일이 등록됩니다.',
    },
    {
      kind: 'attach_task_chip',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_QUOTE_MSG_ID,
      taskId: SK_TASK_ID,
      title: '견적 후속 안내 전화',
      description: '메시지 하단 chip 부착.',
    },
    {
      kind: 'append_chat',
      roomId: SK_RENTAL_ROOM_ID,
      from: {
        role: 'customer',
        userId: SK_RENTAL_CUST_PARK_ID,
        displayName: SK_RENTAL_CUST_PARK_NAME,
      },
      content: '잘 받았습니다. 내일 통화 후 계약 진행하겠습니다.',
      deviceTarget: 'all',
      description: '박찬호 수령 확인.',
    },
    {
      kind: 'update_task_chip_status',
      roomId: SK_RENTAL_ROOM_ID,
      messageId: SK_HOST_QUOTE_MSG_ID,
      taskId: SK_TASK_ID,
      status: '완료',
      description: '약속 잡힘에 따라 할 일 완료 처리.',
    },
    {
      kind: 'show_toast',
      message: '신규 고객 lifecycle 완성 — 대화·파일·메타 모두 DB Mart 자산',
      tone: 'success',
      description: '한 고객의 처음-끝 lifecycle 이 회사 자산으로 보존됩니다.',
    },
  ],
];

const stepTitles = [
  '카카오 알림톡 초대 → 채널 입장',
  '견적 문의 + 응대 시작',
  '비즈폼 → 사업자 메타 → DB Mart 적재',
  '견적서 회신 → 할 일 chip → 완료',
];

const stepDescriptions = [
  '정대리가 박찬호를 카카오 알림톡으로 초대하고, 박찬호가 초대를 수락해 비즈니스 채널에 입장합니다.',
  '박찬호의 K3 단기렌탈 견적 문의에 정대리가 인사 + 응대 시작.',
  '비즈폼으로 사업자번호·법인명·차량용도·사업자등록증을 받아 DB Mart 에 자산화합니다.',
  '견적서 PDF 회신, 후속 안내 전화 할 일을 등록하고, 박찬호 수령 확인 후 chip 완료까지.',
];

const steps: Step[] = stepActions.map((actions, i) => ({
  id: `sk-flow-lifecycle-${(i + 1).toString().padStart(2, '0')}`,
  order: i,
  title: `${i + 1}. ${stepTitles[i]}`,
  description: stepDescriptions[i],
  durationMs: 6000,
  talks: [],
  actions,
}));

const scenario: Scenario = {
  ...meta,
  goals: ['신규 고객 한 명의 처음-끝 lifecycle 을 5분 안에 압축 시연'],
  seed: createSkRentalSeed(),
  steps,
};

export default scenario;

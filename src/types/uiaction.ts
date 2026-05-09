import type { Talk, TalkActor } from './talk';

export type DeviceTarget = 'pc' | 'mobile' | 'all';

export interface RoomEntrySeed {
  id: string;
  title: string;
  participantCount: number;
  preview: string;
  device?: 'PC' | 'Mobile';
  timestamp?: string;
}

export interface ParticipantSeed {
  id: string;
  displayName: string;
  external: boolean;
  isHost?: boolean;
  device?: 'PC' | 'Mobile' | 'Web';
  online?: boolean;
}

export interface UISimSeed {
  rooms?: RoomEntrySeed[];
  currentRoomId?: string;
  /** Mobile (Guest) 측 디바이스가 어느 참여자 시점으로 보고 있는지 (단체방 비밀 메시지) */
  mobileViewerParticipantId?: string;
  roomTalks?: Record<string, Talk[]>;
  participants?: Record<string, ParticipantSeed[]>;
  inputs?: Record<string, string>;
  modals?: Record<
    string,
    { open: boolean; step?: number; tab?: string }
  >;
}

export type TaskChipStatus = '처리중' | '완료';

export interface BizFormFieldSeed {
  id: string;
  label: string;
  value?: string;
  file?: boolean;
}

export type MobileMenuId =
  | 'notice'
  | 'knowledge'
  | 'board'
  | 'bizform'
  | 'participants'
  | 'guide';

/**
 * UIAction — 시나리오의 단일 마이크로 단계.
 * description 은 좌측 가이드 자막 / 단계 패널에 자연어로 노출되므로 필수.
 */
export type UIAction =
  // 모달
  | {
      kind: 'open_modal';
      modalId: string;
      description: string;
      initialStep?: number;
      initialTab?: string;
    }
  | { kind: 'close_modal'; modalId: string; description: string }
  | {
      kind: 'set_modal_step';
      modalId: string;
      step: number;
      description: string;
    }
  | {
      kind: 'set_tab';
      modalId: string;
      tab: string;
      description: string;
    }
  // 입력 / 선택
  | {
      kind: 'fill_input';
      field: string;
      value: string;
      description: string;
    }
  | {
      kind: 'toggle_check';
      itemId: string;
      on: boolean;
      description: string;
    }
  | { kind: 'click_button'; buttonId: string; description: string }
  // 시뮬레이션 효과
  | {
      kind: 'show_toast';
      message: string;
      tone?: 'success' | 'info' | 'warning';
      description: string;
    }
  | {
      kind: 'add_room';
      roomId: string;
      title: string;
      participantCount: number;
      preview: string;
      description: string;
    }
  | { kind: 'select_room'; roomId: string; description: string }
  | {
      kind: 'append_system_message';
      roomId: string;
      content: string;
      description: string;
    }
  | {
      kind: 'append_chat';
      roomId: string;
      messageId?: string;
      from: TalkActor;
      content: string;
      deviceTarget?: DeviceTarget;
      description: string;
    }
  | {
      kind: 'add_participant';
      roomId: string;
      participantId: string;
      displayName: string;
      external: boolean;
      device?: 'PC' | 'Mobile' | 'Web';
      isHost?: boolean;
      description: string;
    }
  // 모바일
  | {
      kind: 'mobile_push_notice';
      noticeId: string;
      title: string;
      body: string;
      ctaLabel: string;
      description: string;
    }
  | {
      kind: 'mobile_open_room';
      roomId: string;
      noticeId?: string;
      description: string;
    }
  // 도메인: 할 일
  | {
      kind: 'add_task';
      roomId: string;
      taskId: string;
      title: string;
      assignee?: string;
      dueDate?: string;
      status?: '대기' | '진행중' | '검토중' | '완료';
      sourceMessageId?: string;
      description: string;
    }
  | {
      kind: 'update_task_status';
      taskId: string;
      status: '대기' | '진행중' | '검토중' | '완료';
      description: string;
    }
  // 도메인: 비즈폼
  | {
      kind: 'attach_bizform';
      roomId: string;
      bizformId: string;
      title: string;
      templateId?: string;
      fields: BizFormFieldSeed[];
      messageId?: string;
      description: string;
    }
  | { kind: 'approve_bizform'; bizformId: string; description: string }
  | {
      kind: 'reject_bizform';
      bizformId: string;
      reason?: string;
      description: string;
    }
  // 도메인: 지식 / 파일
  | {
      kind: 'attach_knowledge';
      roomId: string;
      knowledgeId: string;
      title: string;
      excerpt?: string;
      source?: string;
      description: string;
    }
  | {
      kind: 'attach_file';
      roomId: string;
      fileId: string;
      name: string;
      size?: number;
      mime?: string;
      description: string;
    }
  // 단체방: 비밀 메시지
  | {
      kind: 'send_secret_message';
      roomId: string;
      messageId: string;
      from: TalkActor;
      recipientParticipantId: string;
      content: string;
      deviceTarget?: DeviceTarget;
      description: string;
    }
  // 메시지 chip — 메시지에 연결된 할 일 표시
  | {
      kind: 'attach_task_chip';
      roomId: string;
      messageId: string;
      taskId: string;
      title: string;
      description: string;
    }
  | {
      kind: 'update_task_chip_status';
      roomId: string;
      messageId: string;
      taskId: string;
      status: TaskChipStatus;
      description: string;
    }
  // Mobile (Guest) UI
  | { kind: 'mobile_open_menu'; description: string }
  | { kind: 'mobile_close_menu'; description: string }
  | {
      kind: 'mobile_select_menu';
      menuId: MobileMenuId;
      description: string;
    }
  | {
      kind: 'mobile_open_bizform';
      templateId: string;
      title: string;
      fields: BizFormFieldSeed[];
      description: string;
    }
  | {
      kind: 'mobile_fill_bizform_field';
      fieldId: string;
      value: string;
      description: string;
    }
  | {
      kind: 'submit_bizform';
      roomId: string;
      bizformId: string;
      title: string;
      messageId?: string;
      description: string;
    }
  | {
      kind: 'switch_mobile_viewer';
      participantId: string;
      description: string;
    }
  // 보조
  | { kind: 'highlight'; selector: string | null; description: string }
  | { kind: 'wait'; ms: number; description: string };

export type UIActionKind = UIAction['kind'];

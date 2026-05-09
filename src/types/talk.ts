export type Role =
  | 'admin'
  | 'internal'
  | 'partner'
  | 'customer'
  | 'system'
  | 'me';

export type DeviceKind = 'pc' | 'mobile' | 'web' | 'all';

export type TalkType =
  | 'message'
  | 'system'
  | 'task_link'
  | 'bizform'
  | 'knowledge_link'
  | 'file_transfer'
  | 'approval_request'
  | 'approval_result'
  | 'invite'
  | 'notification';

export type TalkActor = {
  role: Role;
  userId?: string;
  displayName?: string;
  avatarUrl?: string;
};

export type TalkRecipient =
  | { role: Role; userId?: string }
  | { broadcast: true };

export type TalkAttachment = {
  name: string;
  size?: number;
  mime?: string;
  url?: string;
};

export type TalkAction =
  | { type: 'UPDATE_STATUS'; target: string; value: string }
  | {
      type: 'CREATE_TASK';
      payload: { title: string; assignee?: string; dueDate?: string };
    }
  | { type: 'ATTACH_BIZFORM'; formId: string; data: Record<string, unknown> }
  | { type: 'ATTACH_KNOWLEDGE'; knowledgeId: string }
  | { type: 'ATTACH_FILE'; fileId: string }
  | { type: 'INVITE_EXTERNAL'; email?: string; link: string }
  | { type: 'JOIN_ROOM'; userId: string; displayName: string }
  | { type: 'NOTIFY'; channel: string; message: string }
  | { type: 'NAVIGATE'; device: DeviceKind; route: string };

export type BubbleTone = 'default' | 'navy';

/** 비밀 메시지 — 단체방에서 특정 외부 참여자에게만 보이는 메시지 */
export interface TalkSecret {
  /** 수신자 참여자 id (단체방 viewer 비교용) */
  recipientParticipantId: string;
}

/** 메시지 하단 chip — 메시지에서 등록된 할 일과 1:1 연결 */
export interface TaskChip {
  taskId: string;
  title: string;
  status: '처리중' | '완료';
}

/** 메시지에서 첨부된 비즈폼 카드 — 도메인 bizform 과 1:1 연결 */
export interface BizFormRef {
  bizformId: string;
}

export interface Talk {
  id: string;
  stepId: string;
  type: TalkType;
  from: TalkActor;
  to: TalkRecipient;
  device: DeviceKind;
  content: string;
  attachments?: TalkAttachment[];
  mentions?: string[];
  offsetMs: number;
  action?: TalkAction;
  uiHint?: { highlight?: string[] };
  /** 메시지 버블 톤 (비밀 메시지 navy 등) */
  bubbleTone?: BubbleTone;
  secret?: TalkSecret;
  taskChip?: TaskChip;
  bizformRef?: BizFormRef;
}

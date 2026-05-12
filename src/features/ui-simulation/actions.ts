import { useUISimStore } from './store';
import { useTaskStore } from '@/features/domain/tasks/store';
import { useBizFormStore } from '@/features/domain/bizforms/store';
import { useKnowledgeStore } from '@/features/domain/knowledge/store';
import type { UIAction } from '@/types/uiaction';
import type { Talk, TaskChip } from '@/types/talk';

let talkCounter = 0;
function genTalkId(): string {
  talkCounter += 1;
  return `act_talk_${Date.now()}_${talkCounter}`;
}

/**
 * 단일 UIAction 을 ui-simulation 스토어 + 도메인 스토어에 적용한다.
 * scenario runner 가 ▶/⏭ 시 호출.
 */
export function applyUIAction(action: UIAction): void {
  const s = useUISimStore.getState();
  const tasks = useTaskStore.getState();
  const bizforms = useBizFormStore.getState();
  const knowledge = useKnowledgeStore.getState();

  switch (action.kind) {
    case 'open_modal':
      s.setModal(action.modalId, {
        open: true,
        step: action.initialStep ?? 1,
        tab: action.initialTab,
        data: action.context,
      });
      break;
    case 'close_modal':
      s.setModal(action.modalId, { open: false });
      break;
    case 'set_modal_step':
      s.setModal(action.modalId, { step: action.step });
      break;
    case 'set_tab':
      s.setModal(action.modalId, { tab: action.tab });
      break;
    case 'fill_input':
      s.setInput(action.field, action.value);
      break;
    case 'toggle_check':
      s.setCheck(action.itemId, action.on);
      break;
    case 'click_button':
      // click_button 자체는 UI 상태 변화가 없음. description 자막 + highlight 의미.
      break;
    case 'show_toast':
      s.pushToast({
        id: `toast_${Date.now()}`,
        message: action.message,
        tone: action.tone ?? 'success',
      });
      break;
    case 'add_room':
      s.addRoom({
        id: action.roomId,
        title: action.title,
        participantCount: action.participantCount,
        preview: action.preview,
        device: 'PC',
        timestamp: nowStamp(),
      });
      if (action.toast) {
        s.pushToast({
          id: `toast_${Date.now()}`,
          message: action.toast.message,
          tone: action.toast.tone ?? 'success',
        });
      }
      break;
    case 'select_room':
      s.selectRoom(action.roomId);
      break;
    case 'append_system_message': {
      const talk: Talk = {
        id: genTalkId(),
        stepId: 'runtime',
        type: 'system',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: action.content,
        offsetMs: 0,
      };
      s.appendTalk(action.roomId, talk);
      break;
    }
    case 'append_chat': {
      const talk: Talk = {
        id: action.messageId ?? genTalkId(),
        stepId: 'runtime',
        type: 'message',
        from: action.from,
        to: { broadcast: true },
        device:
          action.deviceTarget === 'mobile'
            ? 'mobile'
            : action.deviceTarget === 'pc'
              ? 'pc'
              : 'all',
        content: action.content,
        attachments: action.attachments
          ? action.attachments.map((a) => ({ ...a }))
          : undefined,
        offsetMs: 0,
      };
      s.appendTalk(action.roomId, talk);
      break;
    }
    case 'add_participant':
      s.addParticipant(action.roomId, {
        id: action.participantId,
        displayName: action.displayName,
        external: action.external,
        device: action.device,
        isHost: action.isHost,
      });
      break;
    case 'mobile_push_notice':
      s.pushMobileNotice({
        id: action.noticeId,
        title: action.title,
        body: action.body,
        ctaLabel: action.ctaLabel,
      });
      s.pushMobileChat({
        roomId: action.noticeId,
        title: action.title,
        lastMessage: action.body,
        unread: 1,
        time: nowClock(),
        kind: 'cowork-invite',
        noticeId: action.noticeId,
      });
      break;
    case 'mobile_open_room':
      s.setMobileRoom(action.roomId);
      if (action.noticeId) s.consumeMobileNotice(action.noticeId);
      s.markMobileChatRead(action.noticeId ?? action.roomId);
      break;
    case 'highlight':
      s.setHighlight(action.selector);
      break;
    case 'wait':
      // 자동 재생 모드에서만 의미. 수동 ⏭에서는 즉시 통과.
      break;
    case 'set_section':
      s.setActiveSection(action.section);
      break;
    case 'set_talk_search': {
      const patch: Partial<typeof s.talkSearch> = {};
      if (action.tab !== undefined) patch.tab = action.tab;
      if (action.keyword !== undefined) patch.keyword = action.keyword;
      if (action.senderFilter !== undefined)
        patch.senderFilter = action.senderFilter;
      if (action.selectedMessageId !== undefined)
        patch.selectedMessageId = action.selectedMessageId;
      s.setTalkSearch(patch);
      break;
    }

    // ─────────────────────────────────────────────────────────
    // Phase 2 — 도메인 / 비밀 메시지 / 모바일 메뉴 / 비즈폼 / viewer
    // ─────────────────────────────────────────────────────────
    case 'add_task':
      tasks.addTask({
        id: action.taskId,
        roomId: action.roomId,
        title: action.title,
        assignee: action.assignee,
        dueDate: action.dueDate,
        status: action.status ?? '진행중',
        sourceMessageId: action.sourceMessageId,
      });
      break;
    case 'update_task_status':
      tasks.updateStatus(action.taskId, action.status);
      break;
    case 'attach_bizform':
      bizforms.attach({
        id: action.bizformId,
        roomId: action.roomId,
        templateId: action.templateId,
        title: action.title,
        status: '진행중',
        fields: action.fields.map((f) => ({ ...f })),
        messageId: action.messageId,
        createdAt: nowStamp(),
      });
      if (action.messageId) {
        s.appendTalk(action.roomId, {
          id: action.messageId,
          stepId: 'runtime',
          type: 'bizform',
          from: { role: 'system' },
          to: { broadcast: true },
          device: 'all',
          content: action.title,
          offsetMs: 0,
          bizformRef: { bizformId: action.bizformId },
        });
      }
      break;
    case 'approve_bizform':
      bizforms.approve(action.bizformId);
      break;
    case 'reject_bizform':
      bizforms.reject(action.bizformId, action.reason);
      break;
    case 'attach_knowledge':
      knowledge.attach({
        id: action.knowledgeId,
        roomId: action.roomId,
        title: action.title,
        excerpt: action.excerpt,
        source: action.source,
      });
      break;
    case 'attach_file': {
      const talk: Talk = {
        id: genTalkId(),
        stepId: 'runtime',
        type: 'file_transfer',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: action.name,
        attachments: [
          { name: action.name, size: action.size, mime: action.mime },
        ],
        offsetMs: 0,
      };
      s.appendTalk(action.roomId, talk);
      break;
    }
    case 'send_secret_message': {
      const talk: Talk = {
        id: action.messageId,
        stepId: 'runtime',
        type: 'message',
        from: action.from,
        to: { broadcast: true },
        device:
          action.deviceTarget === 'mobile'
            ? 'mobile'
            : action.deviceTarget === 'pc'
              ? 'pc'
              : 'all',
        content: action.content,
        offsetMs: 0,
        bubbleTone: 'navy',
        secret: { recipientParticipantId: action.recipientParticipantId },
      };
      s.appendTalk(action.roomId, talk);
      // 작성 모드 종료
      s.setMention(null);
      break;
    }
    case 'attach_task_chip': {
      const chip: TaskChip = {
        taskId: action.taskId,
        title: action.title,
        status: '처리중',
      };
      s.patchTalk(action.roomId, action.messageId, { taskChip: chip });
      // 도메인 task 도 함께 등록 (없으면)
      tasks.addTask({
        id: action.taskId,
        roomId: action.roomId,
        title: action.title,
        status: '진행중',
        sourceMessageId: action.messageId,
      });
      break;
    }
    case 'update_task_chip_status': {
      const list = useUISimStore.getState().roomTalks[action.roomId];
      const target = list?.find((t) => t.id === action.messageId);
      if (target?.taskChip) {
        s.patchTalk(action.roomId, action.messageId, {
          taskChip: { ...target.taskChip, status: action.status },
        });
      }
      tasks.updateStatus(
        action.taskId,
        action.status === '완료' ? '완료' : '진행중'
      );
      break;
    }
    case 'mobile_open_menu':
      s.setMobileMenuOpen(true);
      break;
    case 'mobile_close_menu':
      s.setMobileMenuOpen(false);
      break;
    case 'mobile_select_menu':
      s.setMobileMenuOpen(false);
      // 비즈폼 외 메뉴는 placeholder — 시나리오는 별도 액션으로 이어진다.
      break;
    case 'mobile_open_bizform':
      s.setBizFormModal({
        templateId: action.templateId,
        title: action.title,
        fields: action.fields.map((f) => ({ ...f })),
      });
      break;
    case 'mobile_fill_bizform_field':
      s.setBizFormModalField(action.fieldId, action.value);
      break;
    case 'submit_bizform': {
      const modal = useUISimStore.getState().bizformModal;
      const fields = modal?.fields ?? [];
      const messageId = action.messageId ?? `bf_msg_${action.bizformId}`;
      bizforms.attach({
        id: action.bizformId,
        roomId: action.roomId,
        templateId: modal?.templateId,
        title: action.title,
        status: '진행중',
        fields: fields.map((f) => ({ ...f })),
        messageId,
        createdAt: nowStamp(),
      });
      // 대화방 inline bizform 카드
      s.appendTalk(action.roomId, {
        id: messageId,
        stepId: 'runtime',
        type: 'bizform',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: action.title,
        offsetMs: 0,
        bizformRef: { bizformId: action.bizformId },
      });
      // 모달 닫기
      s.setBizFormModal(null);
      break;
    }
    case 'switch_mobile_viewer':
      s.setMobileViewer(action.participantId);
      break;
    case 'set_ocr_status':
      s.setOcrStatus(action.modalId, action.status);
      break;
    case 'enter_multi_select_mode':
      s.enterMultiSelect(action.roomId);
      break;
    case 'exit_multi_select_mode':
      s.exitMultiSelect();
      break;
    case 'toggle_message_select':
      s.toggleMessageSelect(action.messageId, action.on);
      break;

    default: {
      const _exhaustive: never = action;
      throw new Error(
        `Unhandled UIAction kind: ${(_exhaustive as UIAction).kind}`
      );
    }
  }
}

function nowStamp(): string {
  const d = new Date();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function nowClock(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? '오후' : '오전';
  const hour12 = ((h + 11) % 12) + 1;
  return `${period} ${hour12.toString().padStart(2, '0')}:${m}`;
}

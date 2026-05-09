import type { Scenario } from '@/types/scenario';
import type {
  ParticipantSeed,
  RoomEntrySeed,
  UIAction,
  UISimSeed,
} from '@/types/uiaction';
import type { Talk } from '@/types/talk';

interface ModalDraft {
  open: boolean;
  step?: number;
  tab?: string;
}

interface SeedDraft {
  rooms: RoomEntrySeed[];
  currentRoomId: string | null;
  mobileViewerParticipantId: string | null;
  roomTalks: Record<string, Talk[]>;
  participants: Record<string, ParticipantSeed[]>;
  inputs: Record<string, string>;
  modals: Record<string, ModalDraft>;
}

function emptyDraft(seed?: UISimSeed): SeedDraft {
  return {
    rooms: seed?.rooms ? seed.rooms.map((r) => ({ ...r })) : [],
    currentRoomId: seed?.currentRoomId ?? null,
    mobileViewerParticipantId: seed?.mobileViewerParticipantId ?? null,
    roomTalks: seed?.roomTalks
      ? Object.fromEntries(
          Object.entries(seed.roomTalks).map(([k, v]) => [k, v.map((t) => ({ ...t }))])
        )
      : {},
    participants: seed?.participants
      ? Object.fromEntries(
          Object.entries(seed.participants).map(([k, v]) => [k, v.map((p) => ({ ...p }))])
        )
      : {},
    inputs: seed?.inputs ? { ...seed.inputs } : {},
    modals: seed?.modals
      ? Object.fromEntries(Object.entries(seed.modals).map(([k, v]) => [k, { ...v }]))
      : {},
  };
}

let seedTalkCounter = 0;
function genSeedTalkId(roomId: string): string {
  seedTalkCounter += 1;
  return `seed_${roomId}_${seedTalkCounter}`;
}

function updateRoomPreview(
  draft: SeedDraft,
  roomId: string,
  talk: Talk
): void {
  if (!isParticipantMessage(talk)) return;
  const room = draft.rooms.find((r) => r.id === roomId);
  if (room) room.preview = talk.content;
}

function isParticipantMessage(talk: Talk): boolean {
  return talk.type === 'message' && talk.from.role !== 'system';
}

function applyToDraft(d: SeedDraft, action: UIAction): void {
  switch (action.kind) {
    case 'open_modal':
      d.modals[action.modalId] = {
        open: true,
        step: action.initialStep ?? 1,
        tab: action.initialTab,
      };
      break;
    case 'close_modal':
      d.modals[action.modalId] = {
        ...(d.modals[action.modalId] ?? { open: false }),
        open: false,
      };
      break;
    case 'set_modal_step':
      d.modals[action.modalId] = {
        ...(d.modals[action.modalId] ?? { open: false }),
        step: action.step,
      };
      break;
    case 'set_tab':
      d.modals[action.modalId] = {
        ...(d.modals[action.modalId] ?? { open: false }),
        tab: action.tab,
      };
      break;
    case 'fill_input':
      d.inputs[action.field] = action.value;
      break;
    case 'add_room':
      if (!d.rooms.find((r) => r.id === action.roomId)) {
        d.rooms.unshift({
          id: action.roomId,
          title: action.title,
          participantCount: action.participantCount,
          preview: action.preview,
          device: 'PC',
        });
      }
      break;
    case 'select_room':
      d.currentRoomId = action.roomId;
      break;
    case 'append_system_message': {
      const t: Talk = {
        id: genSeedTalkId(action.roomId),
        stepId: 'seed',
        type: 'system',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: action.content,
        offsetMs: 0,
      };
      if (!d.roomTalks[action.roomId]) d.roomTalks[action.roomId] = [];
      d.roomTalks[action.roomId].push(t);
      break;
    }
    case 'append_chat': {
      const t: Talk = {
        id: action.messageId ?? genSeedTalkId(action.roomId),
        stepId: 'seed',
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
      };
      if (!d.roomTalks[action.roomId]) d.roomTalks[action.roomId] = [];
      d.roomTalks[action.roomId].push(t);
      updateRoomPreview(d, action.roomId, t);
      break;
    }
    case 'add_participant': {
      if (!d.participants[action.roomId]) d.participants[action.roomId] = [];
      const list = d.participants[action.roomId];
      if (!list.find((p) => p.id === action.participantId)) {
        list.push({
          id: action.participantId,
          displayName: action.displayName,
          external: action.external,
          device: action.device,
          isHost: action.isHost,
        });
      }
      const room = d.rooms.find((r) => r.id === action.roomId);
      if (room) room.participantCount = list.length;
      break;
    }
    case 'send_secret_message': {
      const t: Talk = {
        id: action.messageId,
        stepId: 'seed',
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
      if (!d.roomTalks[action.roomId]) d.roomTalks[action.roomId] = [];
      d.roomTalks[action.roomId].push(t);
      updateRoomPreview(d, action.roomId, t);
      break;
    }
    case 'attach_task_chip': {
      const list = d.roomTalks[action.roomId];
      const target = list?.find((t) => t.id === action.messageId);
      if (target) {
        target.taskChip = {
          taskId: action.taskId,
          title: action.title,
          status: '처리중',
        };
      }
      break;
    }
    case 'update_task_chip_status': {
      const list = d.roomTalks[action.roomId];
      const target = list?.find((t) => t.id === action.messageId);
      if (target?.taskChip) {
        target.taskChip = { ...target.taskChip, status: action.status };
      }
      break;
    }
    case 'attach_bizform':
    case 'submit_bizform': {
      const messageId =
        action.kind === 'attach_bizform'
          ? action.messageId
          : (action.messageId ?? `bf_msg_${action.bizformId}`);
      if (!messageId) break;
      const t: Talk = {
        id: messageId,
        stepId: 'seed',
        type: 'bizform',
        from: { role: 'system' },
        to: { broadcast: true },
        device: 'all',
        content: action.title,
        offsetMs: 0,
        bizformRef: { bizformId: action.bizformId },
      };
      if (!d.roomTalks[action.roomId]) d.roomTalks[action.roomId] = [];
      if (!d.roomTalks[action.roomId].find((x) => x.id === messageId)) {
        d.roomTalks[action.roomId].push(t);
      }
      break;
    }
    case 'attach_file': {
      const t: Talk = {
        id: genSeedTalkId(action.roomId),
        stepId: 'seed',
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
      if (!d.roomTalks[action.roomId]) d.roomTalks[action.roomId] = [];
      d.roomTalks[action.roomId].push(t);
      break;
    }
    case 'switch_mobile_viewer':
      d.mobileViewerParticipantId = action.participantId;
      break;
    // 도메인 store (tasks/bizforms/knowledge), 토스트/하이라이트, 모바일 휘발 상태(menu, modal,
    // notice, viewer 외) 는 final seed 에 보존하지 않는다 — 자식은 자체 seed 또는
    // 시작 액션에서 다시 시작한다.
    default:
      break;
  }
}

/**
 * 시나리오의 `seed` + 모든 step.actions 를 적용한 최종 seed 를 반환.
 * 자식 시나리오의 시작점으로 사용하기 위한 결정적 스냅샷.
 */
export function extractFinalSeed(scenario: Scenario): UISimSeed {
  const draft = emptyDraft(scenario.seed);
  for (const step of scenario.steps) {
    if (step.actions) {
      for (const a of step.actions) applyToDraft(draft, a);
    }
  }
  return {
    rooms: draft.rooms,
    currentRoomId: draft.currentRoomId ?? undefined,
    mobileViewerParticipantId: draft.mobileViewerParticipantId ?? undefined,
    roomTalks: draft.roomTalks,
    participants: draft.participants,
    inputs: draft.inputs,
    modals: draft.modals,
  };
}

/**
 * 부모 final seed 위에 자식 seed 를 덮어쓴다 (자식 우선, shallow).
 * 동일 roomId 의 roomTalks/participants 는 자식이 있으면 자식으로 교체.
 */
export function mergeSeed(parent: UISimSeed, child?: UISimSeed): UISimSeed {
  if (!child) return parent;
  return {
    rooms: child.rooms ?? parent.rooms,
    currentRoomId: child.currentRoomId ?? parent.currentRoomId,
    mobileViewerParticipantId:
      child.mobileViewerParticipantId ?? parent.mobileViewerParticipantId,
    roomTalks: { ...(parent.roomTalks ?? {}), ...(child.roomTalks ?? {}) },
    participants: {
      ...(parent.participants ?? {}),
      ...(child.participants ?? {}),
    },
    inputs: { ...(parent.inputs ?? {}), ...(child.inputs ?? {}) },
    modals: { ...(parent.modals ?? {}), ...(child.modals ?? {}) },
  };
}

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Talk } from '@/types/talk';
import type {
  BizFormFieldSeed,
  MobileMenuId,
  ParticipantSeed,
  RoomEntrySeed,
  UISimSeed,
} from '@/types/uiaction';

export interface ModalState {
  open: boolean;
  step?: number;
  tab?: string;
  data?: Record<string, unknown>;
}

export interface ToastEntry {
  id: string;
  message: string;
  tone: 'success' | 'info' | 'warning';
}

export interface MobileNotice {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  consumed?: boolean;
}

export interface MobileChatListEntry {
  /** 입장 가능한 방의 id (uiSim.rooms 의 id 와 매칭). 미입장 상태면 별도 placeholder id 가능. */
  roomId: string;
  title: string;
  lastMessage: string;
  unread: number;
  time: string;
  /** 초대 출처 — 'cowork-invite' (Cowork+ 알림톡 초대) | 'kakao-invite' (카카오 오픈채팅 링크) */
  kind: 'cowork-invite' | 'kakao-invite';
  /** 연관된 알림 id — 채팅 리스트 탭 시 알림 consume */
  noticeId?: string;
}

/** 단체방 비밀 메시지 작성 모드 — TalkInput @멘션 picker 로 진입 */
export interface MentionState {
  /** 작성 중인 방 */
  roomId: string;
  /** 수신 대상 참여자 id (선택 후 SecretMode chip 노출) */
  recipientParticipantId?: string;
}

/** Mobile 비즈폼 모달 상태 */
export interface BizFormModalState {
  templateId: string;
  title: string;
  fields: BizFormFieldSeed[];
}

export interface UISimState {
  modals: Record<string, ModalState>;
  inputs: Record<string, string>;
  checks: Record<string, boolean>;
  toasts: ToastEntry[];
  rooms: RoomEntrySeed[];
  currentRoomId: string | null;
  /** 모바일 디바이스 측에서 별도로 보고 있는 방. null 이면 알림함/리스트 화면. */
  mobileRoomId: string | null;
  /** 단체방 비밀 메시지 — Mobile 가 어느 참여자 시점에 있는지. null 이면 첫 외부 참여자 또는 default. */
  mobileViewerParticipantId: string | null;
  /** Guest 햄버거 메뉴 dropdown 노출 여부 */
  mobileMenuOpen: boolean;
  /** Guest 비즈폼 모달 (열림 + 템플릿 + 필드 값) — 열려있으면 비즈폼 작성 화면 노출 */
  bizformModal: BizFormModalState | null;
  /** TalkInput 의 @멘션/비밀 메시지 작성 상태 */
  mention: MentionState | null;
  roomTalks: Record<string, Talk[]>;
  participants: Record<string, ParticipantSeed[]>;
  mobileNotices: MobileNotice[];
  mobileChatList: MobileChatListEntry[];
  highlight: string | null;
}

interface UISimActions {
  reset: () => void;
  applySeed: (seed?: UISimSeed) => void;
  setModal: (modalId: string, patch: Partial<ModalState>) => void;
  setInput: (field: string, value: string) => void;
  setCheck: (itemId: string, on: boolean) => void;
  pushToast: (toast: ToastEntry) => void;
  removeToast: (id: string) => void;
  addRoom: (room: RoomEntrySeed) => void;
  selectRoom: (roomId: string | null) => void;
  setMobileRoom: (roomId: string | null) => void;
  setMobileViewer: (participantId: string | null) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setBizFormModal: (modal: BizFormModalState | null) => void;
  setBizFormModalField: (fieldId: string, value: string) => void;
  setMention: (mention: MentionState | null) => void;
  appendTalk: (roomId: string, talk: Talk) => void;
  /** 단일 talk 의 필드 patch. taskChip 갱신 등. */
  patchTalk: (
    roomId: string,
    talkId: string,
    patch: Partial<Talk>
  ) => void;
  addParticipant: (roomId: string, participant: ParticipantSeed) => void;
  pushMobileNotice: (notice: MobileNotice) => void;
  consumeMobileNotice: (id: string) => void;
  pushMobileChat: (entry: MobileChatListEntry) => void;
  markMobileChatRead: (roomId: string) => void;
  setHighlight: (selector: string | null) => void;
}

const EMPTY_STATE: UISimState = {
  modals: {},
  inputs: {},
  checks: {},
  toasts: [],
  rooms: [],
  currentRoomId: null,
  mobileRoomId: null,
  mobileViewerParticipantId: null,
  mobileMenuOpen: false,
  bizformModal: null,
  mention: null,
  roomTalks: {},
  participants: {},
  mobileNotices: [],
  mobileChatList: [],
  highlight: null,
};

export const useUISimStore = create<UISimState & UISimActions>()(
  immer((set) => ({
    ...EMPTY_STATE,
    reset: () =>
      set(() => ({
        ...EMPTY_STATE,
        modals: {},
        inputs: {},
        checks: {},
        toasts: [],
        rooms: [],
        roomTalks: {},
        participants: {},
        mobileNotices: [],
        mobileChatList: [],
      })),
    applySeed: (seed) =>
      set((s) => {
        s.modals = seed?.modals ? { ...seed.modals } : {};
        s.inputs = seed?.inputs ? { ...seed.inputs } : {};
        s.checks = {};
        s.toasts = [];
        s.rooms = seed?.rooms ? [...seed.rooms] : [];
        s.currentRoomId = seed?.currentRoomId ?? null;
        s.mobileRoomId = null;
        s.mobileViewerParticipantId = seed?.mobileViewerParticipantId ?? null;
        s.mobileMenuOpen = false;
        s.bizformModal = null;
        s.mention = null;
        s.roomTalks = seed?.roomTalks
          ? Object.fromEntries(
              Object.entries(seed.roomTalks).map(([k, v]) => [k, [...v]])
            )
          : {};
        s.participants = seed?.participants
          ? Object.fromEntries(
              Object.entries(seed.participants).map(([k, v]) => [k, [...v]])
            )
          : {};
        s.mobileNotices = [];
        s.mobileChatList = [];
        s.highlight = null;
      }),
    setModal: (modalId, patch) =>
      set((s) => {
        const cur: ModalState = s.modals[modalId] ?? { open: false };
        s.modals[modalId] = { ...cur, ...patch };
      }),
    setInput: (field, value) =>
      set((s) => {
        s.inputs[field] = value;
      }),
    setCheck: (itemId, on) =>
      set((s) => {
        s.checks[itemId] = on;
      }),
    pushToast: (toast) =>
      set((s) => {
        s.toasts.push(toast);
      }),
    removeToast: (id) =>
      set((s) => {
        s.toasts = s.toasts.filter((t) => t.id !== id);
      }),
    addRoom: (room) =>
      set((s) => {
        if (!s.rooms.find((r) => r.id === room.id)) {
          s.rooms.unshift(room);
        }
      }),
    selectRoom: (roomId) =>
      set((s) => {
        s.currentRoomId = roomId;
      }),
    setMobileRoom: (roomId) =>
      set((s) => {
        s.mobileRoomId = roomId;
      }),
    setMobileViewer: (participantId) =>
      set((s) => {
        s.mobileViewerParticipantId = participantId;
      }),
    setMobileMenuOpen: (open) =>
      set((s) => {
        s.mobileMenuOpen = open;
      }),
    setBizFormModal: (modal) =>
      set((s) => {
        s.bizformModal = modal ? { ...modal, fields: modal.fields.map((f) => ({ ...f })) } : null;
      }),
    setBizFormModalField: (fieldId, value) =>
      set((s) => {
        if (!s.bizformModal) return;
        const f = s.bizformModal.fields.find((x) => x.id === fieldId);
        if (f) f.value = value;
      }),
    setMention: (mention) =>
      set((s) => {
        s.mention = mention;
      }),
    appendTalk: (roomId, talk) =>
      set((s) => {
        if (!s.roomTalks[roomId]) s.roomTalks[roomId] = [];
        if (!s.roomTalks[roomId].find((t) => t.id === talk.id)) {
          s.roomTalks[roomId].push(talk);
        }
      }),
    patchTalk: (roomId, talkId, patch) =>
      set((s) => {
        const list = s.roomTalks[roomId];
        if (!list) return;
        const idx = list.findIndex((t) => t.id === talkId);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...patch } as Talk;
        }
      }),
    addParticipant: (roomId, participant) =>
      set((s) => {
        if (!s.participants[roomId]) s.participants[roomId] = [];
        if (!s.participants[roomId].find((p) => p.id === participant.id)) {
          s.participants[roomId].push(participant);
        }
        const room = s.rooms.find((r) => r.id === roomId);
        if (room) room.participantCount = s.participants[roomId].length;
      }),
    pushMobileNotice: (notice) =>
      set((s) => {
        if (!s.mobileNotices.find((n) => n.id === notice.id)) {
          s.mobileNotices.push(notice);
        }
      }),
    consumeMobileNotice: (id) =>
      set((s) => {
        const n = s.mobileNotices.find((x) => x.id === id);
        if (n) n.consumed = true;
      }),
    pushMobileChat: (entry) =>
      set((s) => {
        if (!s.mobileChatList.find((e) => e.roomId === entry.roomId)) {
          s.mobileChatList.unshift(entry);
        }
      }),
    markMobileChatRead: (roomId) =>
      set((s) => {
        const e = s.mobileChatList.find((x) => x.roomId === roomId);
        if (e) e.unread = 0;
      }),
    setHighlight: (selector) =>
      set((s) => {
        s.highlight = selector;
      }),
  }))
);

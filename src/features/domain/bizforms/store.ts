import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type BizFormStatus = '대기' | '진행중' | '승인됨' | '반려됨';

export interface BizFormField {
  id: string;
  label: string;
  value?: string;
  /** 첨부 파일 필드 여부 */
  file?: boolean;
}

export interface BizForm {
  id: string;
  roomId: string;
  templateId?: string;
  title: string;
  status: BizFormStatus;
  fields: BizFormField[];
  /** 메시지 inline 카드와 연결되는 메시지 id */
  messageId?: string;
  reason?: string;
  createdAt?: string;
}

interface BizFormState {
  /** roomId → forms */
  bizformsByRoom: Record<string, BizForm[]>;
}

interface BizFormActions {
  attach: (form: BizForm) => void;
  setFieldValue: (id: string, fieldId: string, value: string) => void;
  approve: (id: string) => void;
  reject: (id: string, reason?: string) => void;
  reset: () => void;
}

export const useBizFormStore = create<BizFormState & BizFormActions>()(
  immer((set) => ({
    bizformsByRoom: {},
    attach: (form) =>
      set((s) => {
        if (!s.bizformsByRoom[form.roomId]) s.bizformsByRoom[form.roomId] = [];
        if (!s.bizformsByRoom[form.roomId].find((f) => f.id === form.id)) {
          s.bizformsByRoom[form.roomId].push(form);
        }
      }),
    setFieldValue: (id, fieldId, value) =>
      set((s) => {
        for (const list of Object.values(s.bizformsByRoom)) {
          const f = list.find((x) => x.id === id);
          if (f) {
            const fld = f.fields.find((x) => x.id === fieldId);
            if (fld) fld.value = value;
            return;
          }
        }
      }),
    approve: (id) =>
      set((s) => {
        for (const list of Object.values(s.bizformsByRoom)) {
          const f = list.find((x) => x.id === id);
          if (f) {
            f.status = '승인됨';
            return;
          }
        }
      }),
    reject: (id, reason) =>
      set((s) => {
        for (const list of Object.values(s.bizformsByRoom)) {
          const f = list.find((x) => x.id === id);
          if (f) {
            f.status = '반려됨';
            if (reason) f.reason = reason;
            return;
          }
        }
      }),
    reset: () => set({ bizformsByRoom: {} }),
  }))
);

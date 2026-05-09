import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface KnowledgeRef {
  id: string;
  roomId: string;
  title: string;
  excerpt?: string;
  source?: string;
}

interface KnowledgeState {
  /** roomId → refs */
  knowledgeByRoom: Record<string, KnowledgeRef[]>;
}

interface KnowledgeActions {
  attach: (ref: KnowledgeRef) => void;
  reset: () => void;
}

export const useKnowledgeStore = create<KnowledgeState & KnowledgeActions>()(
  immer((set) => ({
    knowledgeByRoom: {},
    attach: (ref) =>
      set((s) => {
        if (!s.knowledgeByRoom[ref.roomId]) s.knowledgeByRoom[ref.roomId] = [];
        if (!s.knowledgeByRoom[ref.roomId].find((r) => r.id === ref.id)) {
          s.knowledgeByRoom[ref.roomId].push(ref);
        }
      }),
    reset: () => set({ knowledgeByRoom: {} }),
  }))
);

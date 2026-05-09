import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Talk } from '@/types/talk';

interface TalkState {
  timeline: Talk[];
  emittedIds: Set<string>;
}

interface TalkActions {
  push: (talk: Talk) => void;
  pushMany: (talks: Talk[]) => void;
  clear: () => void;
  setTimeline: (talks: Talk[]) => void;
}

export const useTalkStore = create<TalkState & TalkActions>()(
  immer((set) => ({
    timeline: [],
    emittedIds: new Set<string>(),
    push: (talk) =>
      set((s) => {
        if (s.emittedIds.has(talk.id)) return;
        s.timeline.push(talk);
        s.emittedIds.add(talk.id);
      }),
    pushMany: (talks) =>
      set((s) => {
        for (const t of talks) {
          if (!s.emittedIds.has(t.id)) {
            s.timeline.push(t);
            s.emittedIds.add(t.id);
          }
        }
      }),
    clear: () =>
      set((s) => {
        s.timeline = [];
        s.emittedIds = new Set<string>();
      }),
    setTimeline: (talks) =>
      set((s) => {
        s.timeline = [...talks];
        s.emittedIds = new Set(talks.map((t) => t.id));
      }),
  }))
);

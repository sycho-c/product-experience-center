import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Role } from '@/types/talk';

export interface Participant {
  id: string;
  displayName: string;
  role: Role;
  external: boolean;
  isHost?: boolean;
}

interface ParticipantState {
  participants: Participant[];
}

interface ParticipantActions {
  add: (p: Participant) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const useParticipantStore = create<
  ParticipantState & ParticipantActions
>()(
  immer((set) => ({
    participants: [],
    add: (p) =>
      set((s) => {
        if (!s.participants.find((x) => x.id === p.id))
          s.participants.push(p);
      }),
    remove: (id) =>
      set((s) => {
        s.participants = s.participants.filter((p) => p.id !== id);
      }),
    reset: () => set({ participants: [] }),
  }))
);

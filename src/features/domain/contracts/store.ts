import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type ContractStatus =
  | 'draft'
  | 'pending_review'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface ContractRecord {
  id: string;
  contractNumber: string;
  productName: string;
  contractor: string;
  period: string;
  premium?: string;
  status: ContractStatus;
}

interface ContractState {
  records: Record<string, ContractRecord>;
}

interface ContractActions {
  upsert: (record: ContractRecord) => void;
  setStatus: (id: string, status: ContractStatus) => void;
  reset: () => void;
}

export const useContractStore = create<ContractState & ContractActions>()(
  immer((set) => ({
    records: {},
    upsert: (record) =>
      set((s) => {
        s.records[record.id] = record;
      }),
    setStatus: (id, status) =>
      set((s) => {
        if (s.records[id]) s.records[id].status = status;
      }),
    reset: () => set({ records: {} }),
  }))
);

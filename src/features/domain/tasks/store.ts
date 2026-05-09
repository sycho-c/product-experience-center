import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TaskStatus = '대기' | '진행중' | '검토중' | '완료';

export interface DomainTask {
  id: string;
  roomId: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  status: TaskStatus;
  priority?: '낮음' | '중간' | '높음';
  /** 메시지 chip 으로 등록된 task 의 원본 message id */
  sourceMessageId?: string;
}

interface TaskState {
  /** roomId → tasks */
  tasksByRoom: Record<string, DomainTask[]>;
}

interface TaskActions {
  addTask: (task: DomainTask) => void;
  updateStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>()(
  immer((set) => ({
    tasksByRoom: {},
    addTask: (task) =>
      set((s) => {
        if (!s.tasksByRoom[task.roomId]) s.tasksByRoom[task.roomId] = [];
        if (!s.tasksByRoom[task.roomId].find((t) => t.id === task.id)) {
          s.tasksByRoom[task.roomId].push(task);
        }
      }),
    updateStatus: (id, status) =>
      set((s) => {
        for (const list of Object.values(s.tasksByRoom)) {
          const t = list.find((x) => x.id === id);
          if (t) {
            t.status = status;
            return;
          }
        }
      }),
    removeTask: (id) =>
      set((s) => {
        for (const roomId of Object.keys(s.tasksByRoom)) {
          s.tasksByRoom[roomId] = s.tasksByRoom[roomId].filter((t) => t.id !== id);
        }
      }),
    reset: () => set({ tasksByRoom: {} }),
  }))
);

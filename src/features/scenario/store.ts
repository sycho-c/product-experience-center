import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Scenario } from '@/types/scenario';

export type ScenarioStatus = 'idle' | 'playing' | 'paused' | 'completed';
export type ScenarioMode = 'after' | 'before';

interface ScenarioState {
  scenario: Scenario | null;
  loading: boolean;
  error: string | null;
  status: ScenarioStatus;
  stepIndex: number;
  /** 현재 step 안에서 적용된 액션 수(0..actions.length). 마이크로 진행도. */
  actionIndex: number;
  elapsedMs: number;
  mode: ScenarioMode;
  showStepGuide: boolean;
  /** 마지막으로 적용된 UIAction 의 description (가이드 자막) */
  currentActionDescription: string | null;
}

interface ScenarioActions {
  setScenario: (scenario: Scenario | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setStatus: (status: ScenarioStatus) => void;
  setStepIndex: (index: number) => void;
  setActionIndex: (index: number) => void;
  setElapsedMs: (ms: number) => void;
  tick: (deltaMs: number) => void;
  setMode: (mode: ScenarioMode) => void;
  toggleStepGuide: () => void;
  setCurrentActionDescription: (description: string | null) => void;
  reset: () => void;
}

const initialState: ScenarioState = {
  scenario: null,
  loading: false,
  error: null,
  status: 'idle',
  stepIndex: 0,
  actionIndex: 0,
  elapsedMs: 0,
  mode: 'after',
  showStepGuide: true,
  currentActionDescription: null,
};

export const useScenarioStore = create<ScenarioState & ScenarioActions>()(
  immer((set) => ({
    ...initialState,
    setScenario: (scenario) =>
      set((s) => {
        s.scenario = scenario;
        s.stepIndex = 0;
        s.actionIndex = 0;
        s.elapsedMs = 0;
        s.status = 'idle';
        s.error = null;
        s.currentActionDescription = null;
      }),
    setLoading: (loading) =>
      set((s) => {
        s.loading = loading;
      }),
    setError: (error) =>
      set((s) => {
        s.error = error;
      }),
    setStatus: (status) =>
      set((s) => {
        s.status = status;
      }),
    setStepIndex: (index) =>
      set((s) => {
        s.stepIndex = index;
        s.actionIndex = 0;
        s.elapsedMs = 0;
      }),
    setActionIndex: (index) =>
      set((s) => {
        s.actionIndex = index;
      }),
    setElapsedMs: (ms) =>
      set((s) => {
        s.elapsedMs = ms;
      }),
    tick: (deltaMs) =>
      set((s) => {
        s.elapsedMs += deltaMs;
      }),
    setMode: (mode) =>
      set((s) => {
        s.mode = mode;
        s.stepIndex = 0;
        s.actionIndex = 0;
        s.elapsedMs = 0;
        s.status = 'idle';
        s.currentActionDescription = null;
      }),
    toggleStepGuide: () =>
      set((s) => {
        s.showStepGuide = !s.showStepGuide;
      }),
    setCurrentActionDescription: (description) =>
      set((s) => {
        s.currentActionDescription = description;
      }),
    reset: () => set(() => ({ ...initialState })),
  }))
);

// 안정된 빈 배열 reference — selector 가 매 렌더 새 배열을 반환해 useSyncExternalStore
// 가 무한 루프(Maximum update depth)에 빠지는 것을 방지한다.
const EMPTY_STEPS: import('@/types/scenario').Step[] = [];

export function selectActiveSteps(
  state: ScenarioState
): import('@/types/scenario').Step[] {
  if (!state.scenario) return EMPTY_STEPS;
  return state.mode === 'before' && state.scenario.beforeSteps
    ? state.scenario.beforeSteps
    : state.scenario.steps;
}

export function selectCurrentStep(state: ScenarioState) {
  const steps = selectActiveSteps(state);
  return steps[state.stepIndex] ?? null;
}

export function selectTotalSteps(state: ScenarioState) {
  return selectActiveSteps(state).length;
}

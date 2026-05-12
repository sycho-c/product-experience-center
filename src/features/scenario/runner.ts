import { useScenarioStore, selectActiveSteps } from './store';
import { useTalkStore } from '@/features/talk/store';
import { useUISimStore } from '@/features/ui-simulation/store';
import { applyUIAction } from '@/features/ui-simulation/actions';
import { useTaskStore } from '@/features/domain/tasks/store';
import { useBizFormStore } from '@/features/domain/bizforms/store';
import { useKnowledgeStore } from '@/features/domain/knowledge/store';
import { resetTalkClocks } from '@/lib/time';
import type { Talk } from '@/types/talk';
import type { Scenario, Step } from '@/types/scenario';
import type { UIAction } from '@/types/uiaction';

const TICK_INTERVAL_MS = 100;
const DEFAULT_STEP_DURATION_MS = 8_000;
const ACTION_AUTO_INTERVAL_MS = 1_400;

let tickerHandle: ReturnType<typeof setInterval> | null = null;
const visited = new Set<string>();

function getActiveSteps(): Step[] {
  return selectActiveSteps(useScenarioStore.getState());
}

function getCurrentStep(): Step | null {
  const state = useScenarioStore.getState();
  return getActiveSteps()[state.stepIndex] ?? null;
}

function isActionMode(step?: Step | null): boolean {
  return !!(step?.actions && step.actions.length > 0);
}

function clearTicker() {
  if (tickerHandle !== null) {
    clearInterval(tickerHandle);
    tickerHandle = null;
  }
}

/**
 * 시나리오 로드 시 호출. 도메인/uiSim 리셋 후 seed 적용.
 * 이후 runner 의 ⏭/⏮ 가 액션 단위로 작동.
 */
export function applyScenarioSeed(scenario: Scenario): void {
  visited.clear();
  resetTalkClocks();
  useTalkStore.getState().clear();
  useTaskStore.getState().reset();
  useBizFormStore.getState().reset();
  useKnowledgeStore.getState().reset();
  useUISimStore.getState().applySeed(scenario.seed);
}

// ─────────────────────────────────────────────────────────────────
// 시간 기반 (legacy talks emission)
// ─────────────────────────────────────────────────────────────────

function emitDueTalks(): Talk[] {
  const step = getCurrentStep();
  if (!step) return [];
  const elapsedMs = useScenarioStore.getState().elapsedMs;
  const dueTalks = step.talks.filter(
    (t) => t.offsetMs <= elapsedMs && !visited.has(t.id)
  );
  if (dueTalks.length > 0) {
    useTalkStore.getState().pushMany(dueTalks);
    for (const t of dueTalks) visited.add(t.id);
  }
  return dueTalks;
}

function tickLegacy() {
  const store = useScenarioStore.getState();
  if (store.status !== 'playing') {
    clearTicker();
    return;
  }
  store.tick(TICK_INTERVAL_MS);
  emitDueTalks();
  const step = getCurrentStep();
  if (!step) return;
  const duration = step.durationMs ?? DEFAULT_STEP_DURATION_MS;
  const after = useScenarioStore.getState();
  const shouldAdvance = (step.autoAdvance ?? true) && after.elapsedMs >= duration;
  if (shouldAdvance) advanceStep();
}

// ─────────────────────────────────────────────────────────────────
// 액션 기반 (UIAction sequence)
// ─────────────────────────────────────────────────────────────────

let actionAutoHandle: ReturnType<typeof setTimeout> | null = null;

function clearActionAuto() {
  if (actionAutoHandle !== null) {
    clearTimeout(actionAutoHandle);
    actionAutoHandle = null;
  }
}

function applyAction(action: UIAction): void {
  applyUIAction(action);
  useScenarioStore
    .getState()
    .setCurrentActionDescription(action.description ?? null);
}

function tickAction() {
  const store = useScenarioStore.getState();
  if (store.status !== 'playing') return;
  const stepped = nextAction({ silent: true });
  if (!stepped) return; // 시나리오 끝
  if (useScenarioStore.getState().status === 'playing') {
    actionAutoHandle = setTimeout(tickAction, ACTION_AUTO_INTERVAL_MS);
  }
}

// ─────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────

export function play() {
  const state = useScenarioStore.getState();
  if (!state.scenario) return;
  if (state.status === 'completed') {
    seekStep(0);
  }
  state.setStatus('playing');
  clearTicker();
  clearActionAuto();
  if (isActionMode(getCurrentStep())) {
    // ▶ 클릭 시 즉시 첫 액션 dispatch + 1.4s 간격으로 연속 자동 진행.
    const stepped = nextAction({ silent: true });
    if (stepped) {
      actionAutoHandle = setTimeout(tickAction, ACTION_AUTO_INTERVAL_MS);
    }
  } else {
    tickerHandle = setInterval(tickLegacy, TICK_INTERVAL_MS);
  }
}

export function pause() {
  useScenarioStore.getState().setStatus('paused');
  clearTicker();
  clearActionAuto();
}

/**
 * 현재 step 의 다음 액션을 dispatch.
 * step 끝이면 다음 step 의 첫 액션.
 * 시나리오 끝이면 status=completed 로 전환하고 false 반환.
 */
export function nextAction(opts: { silent?: boolean } = {}): boolean {
  const store = useScenarioStore.getState();
  const steps = getActiveSteps();
  let stepIndex = store.stepIndex;
  let step = steps[stepIndex];

  if (!step) return false;

  // 액션이 없는 step (legacy) 인 경우 step 단위로 advance
  if (!isActionMode(step)) {
    return advanceStep();
  }

  let actionIndex = store.actionIndex;
  // 현재 step 끝이면 다음 step 으로
  if (actionIndex >= (step.actions?.length ?? 0)) {
    if (stepIndex + 1 >= steps.length) {
      store.setStatus('completed');
      clearActionAuto();
      return false;
    }
    stepIndex += 1;
    actionIndex = 0;
    step = steps[stepIndex];
    store.setStepIndex(stepIndex);
  }

  const action = step.actions?.[actionIndex];
  if (!action) return false;

  applyAction(action);
  store.setActionIndex(actionIndex + 1);
  if (!opts.silent) {
    // 수동 ⏭ 일 때 자동재생을 멈춤
    clearActionAuto();
  }
  return true;
}

export function prevAction(): boolean {
  const store = useScenarioStore.getState();
  const steps = getActiveSteps();
  let stepIndex = store.stepIndex;
  let actionIndex = store.actionIndex;

  if (actionIndex <= 0) {
    // 이전 step 의 끝으로
    if (stepIndex <= 0) {
      // 시나리오 시작 — seed 만 다시 적용
      const scenario = store.scenario;
      if (scenario) applyScenarioSeed(scenario);
      store.setStepIndex(0);
      store.setActionIndex(0);
      store.setCurrentActionDescription(null);
      return false;
    }
    stepIndex -= 1;
    const prevStep = steps[stepIndex];
    actionIndex = prevStep?.actions?.length ?? 0;
  }

  // step[0..stepIndex-1] 까지 + 현재 step 의 actions[0..actionIndex-2] 까지 replay
  const targetStep = stepIndex;
  const targetAction = Math.max(0, actionIndex - 1);
  return replayTo(targetStep, targetAction);
}

/**
 * (stepIndex=targetStep, actionIndex=targetAction) 위치까지 결정적으로 복원.
 * targetAction = 적용된 액션 수.
 */
export function replayTo(targetStep: number, targetAction: number): boolean {
  const store = useScenarioStore.getState();
  const scenario = store.scenario;
  if (!scenario) return false;
  const steps = getActiveSteps();
  const clampedStep = Math.max(0, Math.min(targetStep, steps.length - 1));
  const stepActions = steps[clampedStep]?.actions ?? [];
  const clampedAction = Math.max(0, Math.min(targetAction, stepActions.length));

  // 1) seed 부터 다시
  applyScenarioSeed(scenario);

  // 2) 이전 step 들의 모든 액션 적용
  for (let i = 0; i < clampedStep; i++) {
    const s = steps[i];
    if (s.actions) for (const a of s.actions) applyUIAction(a);
    // legacy talks 도 push
    if (s.talks?.length) {
      useTalkStore.getState().pushMany(s.talks);
      for (const t of s.talks) visited.add(t.id);
    }
  }

  // 3) 현재 step 의 0..clampedAction-1 적용
  let lastDesc: string | null = null;
  for (let i = 0; i < clampedAction; i++) {
    const a = stepActions[i];
    applyUIAction(a);
    lastDesc = a.description ?? null;
  }

  store.setStepIndex(clampedStep);
  store.setActionIndex(clampedAction);
  store.setCurrentActionDescription(lastDesc);
  return true;
}

/**
 * 시나리오 step 단위 점프.
 * - 첫 step (index 0) 클릭: 시나리오 처음 (액션 0개 적용) 으로 이동.
 * - 그 외 step 클릭: 그 step 의 **모든 액션을 적용한 end 상태** (제목과 화면이 매칭되도록).
 * - targetStepIndex < 0 도 시나리오 처음.
 */
export function seekStep(targetStepIndex: number) {
  const steps = getActiveSteps();
  const clamped = Math.max(0, Math.min(targetStepIndex, steps.length - 1));
  if (targetStepIndex <= 0) {
    replayTo(0, 0);
  } else {
    const target = steps[clamped];
    const actionCount = target?.actions?.length ?? 0;
    replayTo(clamped, actionCount);
  }
  const state = useScenarioStore.getState();
  if (state.status === 'completed') state.setStatus('paused');
}

/** legacy 호환 */
export const seek = seekStep;

/** 시나리오 처음(첫 step 의 첫 액션 직전 상태) 으로 점프. */
export function seekToStart() {
  replayTo(0, 0);
  const state = useScenarioStore.getState();
  if (state.status === 'completed') state.setStatus('paused');
}

/** legacy talks 모드 step 단위 advance */
export function advanceStep(): boolean {
  const store = useScenarioStore.getState();
  const steps = getActiveSteps();
  if (store.stepIndex + 1 >= steps.length) {
    store.setStatus('completed');
    clearActionAuto();
    clearTicker();
    return false;
  }
  store.setStepIndex(store.stepIndex + 1);
  return true;
}

export const advance = advanceStep;

export function previousStep() {
  const state = useScenarioStore.getState();
  seekStep(Math.max(0, state.stepIndex - 1));
}

export const previous = previousStep;

export function stop() {
  clearTicker();
  clearActionAuto();
  visited.clear();
  useTalkStore.getState().clear();
  useTaskStore.getState().reset();
  useBizFormStore.getState().reset();
  useKnowledgeStore.getState().reset();
  useUISimStore.getState().reset();
  const state = useScenarioStore.getState();
  state.setStatus('idle');
  state.setStepIndex(0);
  state.setActionIndex(0);
  state.setElapsedMs(0);
  state.setCurrentActionDescription(null);
}

import { useScenarioStore } from '@/features/scenario/store';
import { nextAction } from '@/features/scenario/runner';

/**
 * 시나리오 진행 중이면 다음 액션을 dispatch 하고, 아니면 fallback 을 호출한다.
 *
 * 자유 인터랙션 핸들러에서 사용:
 *   onClick={() => progressOrDo(() => setModal('foo', { open: true }))}
 *
 * - 시나리오가 로드되어 있고 다음 액션이 남아있으면 진행 (시나리오 안에서는 동기 흐름).
 * - 시나리오 미로드/완료 상태면 fallback (자유 모드).
 * - 다음 액션 진행을 시도했지만 시나리오 끝이면 fallback (안전망).
 */
export function progressOrDo(fallback: () => void) {
  const state = useScenarioStore.getState();
  if (state.status === 'completed' || !state.scenario) {
    fallback();
    return;
  }
  const advanced = nextAction();
  if (!advanced) fallback();
}

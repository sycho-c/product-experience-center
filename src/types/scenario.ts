import type { DeviceKind, Talk } from './talk';
import type { UIAction, UISimSeed } from './uiaction';

export type ScenarioCategory =
  | 'customer-case'
  | 'feature'
  | 'future-concept'
  | 'industry';

export type ScenarioDifficulty = 'easy' | 'medium' | 'hard';

export interface Step {
  id: string;
  order: number;
  title: string;
  description?: string;
  guide?: string;
  durationMs?: number;
  autoAdvance?: boolean;
  talks: Talk[];
  /** 신규: 마이크로 UI 액션 시퀀스. 있으면 ⏭/⏮ 가 액션 단위. */
  actions?: UIAction[];
  uiState?: Record<string, unknown>;
}

export interface ImpactMetric {
  label: string;
  before: number;
  after: number;
  unit: '%' | 'min' | 'count';
  improvementDirection: 'down' | 'up';
}

export interface ScenarioCustomer {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Scenario {
  id: string;
  title: string;
  summary?: string;
  category: ScenarioCategory;
  customer?: ScenarioCustomer;
  difficulty: ScenarioDifficulty;
  durationMinutes: number;
  devices: DeviceKind[];
  /**
   * 부모 시나리오 id. 지정 시 부모의 모든 step.actions 를 적용한 최종 상태를
   * 시작 시점 seed 로 사용한다. 자식의 자체 seed 는 그 위에 덮어쓴다.
   */
  extends?: string;
  /** 시작 위치 — 시나리오 로드 시 ui-simulation 스토어에 적용되는 초기 상태. */
  seed?: UISimSeed;
  steps: Step[];
  beforeSteps?: Step[];
  metrics?: ImpactMetric[];
  goals?: string[];
}

export interface ScenarioSummary {
  id: string;
  title: string;
  summary?: string;
  category: ScenarioCategory;
  customer?: ScenarioCustomer;
  difficulty: ScenarioDifficulty;
  durationMinutes: number;
  devices: DeviceKind[];
  stepCount: number;
}

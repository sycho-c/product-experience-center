import { ScenarioSchema } from './schema';
import type { Scenario, ScenarioSummary } from '@/types/scenario';
import { scenarioRegistry } from '@/data/scenarios/_index';
import {
  extractFinalSeed,
  mergeSeed,
} from '@/features/scenario/extract-final-seed';

const SIMULATED_LATENCY_MS = 120;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listScenarios(): Promise<ScenarioSummary[]> {
  await delay(SIMULATED_LATENCY_MS);
  return scenarioRegistry.map((s) => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    category: s.category,
    customer: s.customer,
    difficulty: s.difficulty,
    durationMinutes: s.durationMinutes,
    devices: s.devices,
  }));
}

async function loadRaw(id: string, depth = 0): Promise<Scenario> {
  if (depth > 5) {
    throw new Error(`Scenario extends 깊이 초과: ${id}`);
  }
  const entry = scenarioRegistry.find((s) => s.id === id);
  if (!entry) {
    throw new Error(`Scenario not found: ${id}`);
  }
  const data = await entry.load();
  const parsed = ScenarioSchema.parse(data);
  if (parsed.extends) {
    if (parsed.extends === parsed.id) {
      throw new Error(`Scenario 자기 자신을 extends 할 수 없음: ${parsed.id}`);
    }
    const parent = await loadRaw(parsed.extends, depth + 1);
    const parentFinal = extractFinalSeed(parent);
    return { ...parsed, seed: mergeSeed(parentFinal, parsed.seed) };
  }
  return parsed;
}

export async function loadScenario(id: string): Promise<Scenario> {
  await delay(SIMULATED_LATENCY_MS);
  return loadRaw(id);
}

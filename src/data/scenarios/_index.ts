import type { Scenario, ScenarioMeta } from '@/types/scenario';
import { meta as basicMeta } from './basic-room-creation.meta';
import { meta as hanaInsuranceMeta } from './hana-insurance-collab.meta';
import { meta as wooriMeta } from './woori-credit.meta';
import { meta as aiMeta } from './ai-smart-assist.meta';
import { meta as nextGenMeta } from './next-gen-comm.meta';

interface ScenarioRegistryEntry extends ScenarioMeta {
  load: () => Promise<Scenario>;
}

const lazy =
  (importer: () => Promise<{ default: Scenario }>) =>
  (): Promise<Scenario> =>
    importer().then((m) => m.default);

export const scenarioRegistry: ScenarioRegistryEntry[] = [
  { ...basicMeta, load: lazy(() => import('./basic-room-creation')) },
  { ...hanaInsuranceMeta, load: lazy(() => import('./hana-insurance-collab')) },
  { ...wooriMeta, load: lazy(() => import('./woori-credit')) },
  { ...aiMeta, load: lazy(() => import('./ai-smart-assist')) },
  { ...nextGenMeta, load: lazy(() => import('./next-gen-comm')) },
];

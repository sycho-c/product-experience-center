import type { Scenario, ScenarioMeta } from '@/types/scenario';
import { meta as basicMeta } from './basic-room-creation.meta';
import { meta as hanaMeta } from './hana-contract.meta';
import { meta as wooriMeta } from './woori-credit.meta';
import { meta as messagingMeta } from './messaging-basics.meta';
import { meta as workspaceMeta } from './workspace-admin.meta';
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
  { ...hanaMeta, load: lazy(() => import('./hana-contract')) },
  { ...wooriMeta, load: lazy(() => import('./woori-credit')) },
  { ...messagingMeta, load: lazy(() => import('./messaging-basics')) },
  { ...workspaceMeta, load: lazy(() => import('./workspace-admin')) },
  { ...aiMeta, load: lazy(() => import('./ai-smart-assist')) },
  { ...nextGenMeta, load: lazy(() => import('./next-gen-comm')) },
];

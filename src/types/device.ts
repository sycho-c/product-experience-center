import type { DeviceKind, Role } from './talk';

export type DeviceStatus = 'active' | 'paused' | 'idle';

export interface DeviceInstance {
  id: string;
  kind: DeviceKind;
  label: string;
  roleAs: Role;
  independent: boolean;
  status: DeviceStatus;
}

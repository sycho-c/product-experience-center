import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type CenterKind = '상담' | '협업';

export interface Center {
  id: string;
  /** 표시용 ID (사용자가 입력) */
  publicId: string;
  name: string;
  kind: CenterKind;
  description?: string;
  group?: string;
}

export type UserRoleId = '어드민' | '매니저' | '상담사' | string;

export interface InternalUser {
  id: string;
  login: string;
  name: string;
  role: UserRoleId;
  team?: string;
  centerLabels: string[];
  locked?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  userCount: number;
  screenPermissions: string[];
  usagePermissions: string[];
}

export type AppChannelKind = 'pc' | 'kakao' | 'collab' | 'spectra';
export type AppChannelService = '상담' | '협업';
export interface AppChannel {
  id: string;
  publicId: string;
  name: string;
  kind: AppChannelKind;
  service: AppChannelService;
  centers: string[];
}

export type CustomFieldType = '단문입력' | '장문입력' | '숫자' | '선택';
export interface CustomField {
  id: string;
  key: string;
  label: string;
  required: boolean;
  fieldType: CustomFieldType;
  helper?: string;
  description?: string;
}

export interface SecurityPolicy {
  passwordMinLen: number;
  requireAlpha: boolean;
  requireDigit: boolean;
  requireSpecial: boolean;
  blockRepeatedChars: boolean;
  repeatedCharLimit: number;
  blockSequential: boolean;
  sequentialLimit: number;
  blockIdInPassword: boolean;
  blockCurrentInChange: boolean;
  forceChangeOnFirstLogin: boolean;
  changeIntervalEnabled: boolean;
  changeIntervalMonths: number;
  inactiveLockEnabled: boolean;
  inactiveLockDays: number;
  failedAttemptLockEnabled: boolean;
  failedAttemptLimit: number;
  autoLogoutEnabled: boolean;
  autoLogoutMinutes: number;
  allowConcurrentLogin: boolean;
  accessIp: string;
}

const CENTERS_SEED: Center[] = [
  {
    id: 'c-collab',
    publicId: 'collab',
    name: '협업센터',
    kind: '협업',
    description: '사내 협업 대화 메인 센터',
    group: '협업그룹',
  },
  {
    id: 'c-counsel',
    publicId: 'counsel',
    name: '상담센터',
    kind: '상담',
    description: '고객 상담 채널 통합 운영',
    group: '상담그룹',
  },
  {
    id: 'c-design',
    publicId: 'designSupport',
    name: '설계지원센터',
    kind: '협업',
    description: 'GA 설계사 협업 지원',
    group: '협업그룹',
  },
  {
    id: 'c-ga',
    publicId: 'gaCollab',
    name: 'GA 협업센터',
    kind: '협업',
    description: '외부 설계사 응대 전용',
    group: '협업그룹',
  },
  {
    id: 'c-sandbox',
    publicId: 'sandbox',
    name: '모래상자',
    kind: '협업',
    description: '데모/테스트용 임시 센터',
  },
];

const INTERNAL_USERS_SEED: InternalUser[] = [
  {
    id: 'iu-host',
    login: 'kimdoyoon',
    name: '김도윤',
    role: '어드민',
    team: '협업기획팀',
    centerLabels: ['협업센터', '상담센터', '설계지원센터'],
  },
  {
    id: 'iu-jiwon',
    login: 'parkjw',
    name: '박지원',
    role: '매니저',
    team: '상담운영팀',
    centerLabels: ['상담센터'],
  },
  {
    id: 'iu-sumin',
    login: 'leesumin',
    name: '이수민',
    role: '매니저',
    team: 'GA 설계지원',
    centerLabels: ['설계지원센터', 'GA 협업센터'],
  },
  {
    id: 'iu-jhkim',
    login: 'jhkim',
    name: '김지현',
    role: '상담사',
    team: '협업기획팀',
    centerLabels: ['협업센터'],
  },
  {
    id: 'iu-mspark',
    login: 'mspark',
    name: '박민수',
    role: '상담사',
    team: '상담운영팀',
    centerLabels: ['상담센터'],
  },
  {
    id: 'iu-sjlee',
    login: 'sjlee',
    name: '이수진',
    role: '상담사',
    team: '상담운영팀',
    centerLabels: ['상담센터'],
  },
  {
    id: 'iu-syhan',
    login: 'syhan',
    name: '한세영',
    role: '매니저',
    team: '협업기획팀',
    centerLabels: ['협업센터'],
  },
  {
    id: 'iu-dhjeong',
    login: 'dhjeong',
    name: '정도현',
    role: '상담사',
    team: 'GA 설계지원',
    centerLabels: ['설계지원센터', 'GA 협업센터'],
  },
];

const USER_ROLES_SEED: UserRole[] = [
  {
    id: 'r-admin',
    name: '어드민',
    description: '시스템 전체 설정과 모든 센터를 관리하는 최고 권한',
    userCount: 1,
    screenPermissions: [
      '대화',
      '대화 조회',
      '지식',
      '할 일',
      '외부 사용자',
      '설정',
    ],
    usagePermissions: [
      '지식 작성: 개인/공용',
      '센터 관리: 전체',
      '내부 사용자 관리: 전체',
      '외부 사용자 관리: 전체',
      '대화 조회: 전체',
      '할 일 조회: 전체',
    ],
  },
  {
    id: 'r-manager',
    name: '매니저',
    description: '센터 단위로 대화/할 일/사용자를 운영하는 관리자',
    userCount: 3,
    screenPermissions: [
      '대화',
      '대화 조회',
      '지식',
      '할 일',
      '외부 사용자',
    ],
    usagePermissions: [
      '지식 작성: 개인/공용',
      '대화 조회: 센터',
      '할 일 조회: 센터',
      '외부 사용자 조회: 센터',
      '협업 대화 생성',
    ],
  },
  {
    id: 'r-agent',
    name: '상담사',
    description: '본인 담당 대화/할 일을 처리하는 일반 사용자',
    userCount: 4,
    screenPermissions: ['대화', '대화 조회', '지식', '할 일'],
    usagePermissions: [
      '지식 작성: 개인',
      '대화 조회: 개인',
      '할 일 조회: 개인',
      '외부 사용자 조회: 개인',
    ],
  },
  {
    id: 'r-design-mgr',
    name: '설계매니저',
    description: 'GA 설계사 협업 채널을 운영하며 설계 업무를 지원',
    userCount: 0,
    screenPermissions: ['대화', '대화 조회', '지식', '할 일', '외부 사용자'],
    usagePermissions: ['지식 작성: 개인', '대화 조회: 센터', '외부 사용자 조회: 센터'],
  },
];

const APP_CHANNELS_SEED: AppChannel[] = [
  {
    id: 'app-pc-collab',
    publicId: 'pc-collab',
    name: 'PC 협업용',
    kind: 'pc',
    service: '협업',
    centers: ['협업센터'],
  },
  {
    id: 'app-collab-guest',
    publicId: 'collab-guest',
    name: '협업용 게스트존',
    kind: 'collab',
    service: '협업',
    centers: ['협업센터', '설계지원센터'],
  },
  {
    id: 'app-pc-counsel',
    publicId: 'pc-counsel',
    name: 'PC 상담용',
    kind: 'pc',
    service: '상담',
    centers: ['상담센터'],
  },
  {
    id: 'app-kakao-counsel',
    publicId: 'kakao-counsel',
    name: '카카오 상담톡',
    kind: 'kakao',
    service: '상담',
    centers: ['상담센터'],
  },
  {
    id: 'app-design-kakao',
    publicId: 'design-kakao',
    name: '설계 카카오톡',
    kind: 'kakao',
    service: '협업',
    centers: ['설계지원센터', 'GA 협업센터'],
  },
  {
    id: 'app-spectra-collab',
    publicId: 'spectra-collab',
    name: 'SPECTRA 협업',
    kind: 'spectra',
    service: '협업',
    centers: ['협업센터'],
  },
];

const SECURITY_SEED: SecurityPolicy = {
  passwordMinLen: 1,
  requireAlpha: false,
  requireDigit: false,
  requireSpecial: false,
  blockRepeatedChars: false,
  repeatedCharLimit: 3,
  blockSequential: false,
  sequentialLimit: 4,
  blockIdInPassword: false,
  blockCurrentInChange: false,
  forceChangeOnFirstLogin: true,
  changeIntervalEnabled: false,
  changeIntervalMonths: 3,
  inactiveLockEnabled: false,
  inactiveLockDays: 20,
  failedAttemptLockEnabled: false,
  failedAttemptLimit: 5,
  autoLogoutEnabled: false,
  autoLogoutMinutes: 30,
  allowConcurrentLogin: true,
  accessIp: '*',
};

interface SettingsState {
  centers: Center[];
  internalUsers: InternalUser[];
  userRoles: UserRole[];
  appChannels: AppChannel[];
  customFields: CustomField[];
  security: SecurityPolicy;
  addCenter: (input: Omit<Center, 'id'>) => string;
  addInternalUser: (input: Omit<InternalUser, 'id'>) => string;
  addUserRole: (input: Omit<UserRole, 'id' | 'userCount'>) => string;
  addAppChannel: (input: Omit<AppChannel, 'id'>) => string;
  addCustomField: (input: Omit<CustomField, 'id'>) => string;
  removeUserRole: (id: string) => void;
  updateSecurity: (patch: Partial<SecurityPolicy>) => void;
  reset: () => void;
}

let _seq = 0;
function genId(prefix: string): string {
  _seq += 1;
  return `${prefix}-${Date.now().toString(36)}-${_seq}`;
}

export const useSettingsStore = create<SettingsState>()(
  immer((set) => ({
    centers: CENTERS_SEED.map((c) => ({ ...c })),
    internalUsers: INTERNAL_USERS_SEED.map((u) => ({
      ...u,
      centerLabels: [...u.centerLabels],
    })),
    userRoles: USER_ROLES_SEED.map((r) => ({
      ...r,
      screenPermissions: [...r.screenPermissions],
      usagePermissions: [...r.usagePermissions],
    })),
    appChannels: APP_CHANNELS_SEED.map((a) => ({
      ...a,
      centers: [...a.centers],
    })),
    customFields: [],
    security: { ...SECURITY_SEED },
    addCenter: (input) => {
      const id = genId('c');
      set((s) => {
        s.centers.push({ id, ...input });
      });
      return id;
    },
    addInternalUser: (input) => {
      const id = genId('iu');
      set((s) => {
        s.internalUsers.push({ id, ...input, centerLabels: [...input.centerLabels] });
      });
      return id;
    },
    addUserRole: (input) => {
      const id = genId('r');
      set((s) => {
        s.userRoles.push({
          id,
          userCount: 0,
          ...input,
          screenPermissions: [...input.screenPermissions],
          usagePermissions: [...input.usagePermissions],
        });
      });
      return id;
    },
    addAppChannel: (input) => {
      const id = genId('app');
      set((s) => {
        s.appChannels.push({ id, ...input, centers: [...input.centers] });
      });
      return id;
    },
    addCustomField: (input) => {
      const id = genId('cf');
      set((s) => {
        s.customFields.push({ id, ...input });
      });
      return id;
    },
    removeUserRole: (id) => {
      set((s) => {
        s.userRoles = s.userRoles.filter((r) => r.id !== id);
      });
    },
    updateSecurity: (patch) => {
      set((s) => {
        s.security = { ...s.security, ...patch };
      });
    },
    reset: () =>
      set((s) => {
        s.centers = CENTERS_SEED.map((c) => ({ ...c }));
        s.internalUsers = INTERNAL_USERS_SEED.map((u) => ({
          ...u,
          centerLabels: [...u.centerLabels],
        }));
        s.userRoles = USER_ROLES_SEED.map((r) => ({
          ...r,
          screenPermissions: [...r.screenPermissions],
          usagePermissions: [...r.usagePermissions],
        }));
        s.appChannels = APP_CHANNELS_SEED.map((a) => ({
          ...a,
          centers: [...a.centers],
        }));
        s.customFields = [];
        s.security = { ...SECURITY_SEED };
      }),
  }))
);

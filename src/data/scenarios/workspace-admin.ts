import type { Scenario } from '@/types/scenario';
import { meta } from './workspace-admin.meta';

const scenario: Scenario = {
  ...meta,
  goals: ['조직 구조 설계', '권한 정책 점검'],
  steps: [
    {
      id: 'step-01',
      order: 0,
      title: '조직 설정',
      description: '조직과 부서 트리를 구성합니다.',
      durationMs: 5000,
      talks: [
        {
          id: 'wa-001',
          stepId: 'step-01',
          type: 'system',
          from: { role: 'system' },
          to: { broadcast: true },
          device: 'pc',
          content: '관리자 모드로 전환되었습니다.',
          offsetMs: 500,
        },
      ],
    },
    {
      id: 'step-02',
      order: 1,
      title: '멤버 초대',
      description: '외부 사용자를 초대 링크로 초대합니다.',
      durationMs: 5000,
      talks: [
        {
          id: 'wa-002',
          stepId: 'step-02',
          type: 'invite',
          from: { role: 'admin', displayName: '관리자' },
          to: { broadcast: true },
          device: 'pc',
          content: '외부 협력사 1명을 초대했습니다.',
          offsetMs: 500,
          action: {
            type: 'INVITE_EXTERNAL',
            email: 'partner@example.com',
            link: 'https://cowork.example/invite/abc',
          },
        },
      ],
    },
  ],
};

export default scenario;

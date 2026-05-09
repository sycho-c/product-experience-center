import type { Scenario } from '@/types/scenario';
import { meta } from './ai-smart-assist.meta';

const scenario: Scenario = {
  ...meta,
  goals: ['대화 요약', '다음 액션 추천'],
  steps: [
    {
      id: 'step-01',
      order: 0,
      title: '대화 요약',
      description: 'AI가 대화 내용을 요약합니다.',
      durationMs: 6000,
      talks: [
        {
          id: 'ai-001',
          stepId: 'step-01',
          type: 'knowledge_link',
          from: { role: 'system', displayName: 'AI 어시스턴트' },
          to: { broadcast: true },
          device: 'all',
          content: '지금까지의 대화를 요약했어요.',
          offsetMs: 500,
          action: { type: 'ATTACH_KNOWLEDGE', knowledgeId: 'summary-001' },
        },
      ],
    },
    {
      id: 'step-02',
      order: 1,
      title: '스마트 추천',
      description: '다음 단계 액션을 추천합니다.',
      durationMs: 6000,
      talks: [
        {
          id: 'ai-002',
          stepId: 'step-02',
          type: 'notification',
          from: { role: 'system', displayName: 'AI 어시스턴트' },
          to: { broadcast: true },
          device: 'all',
          content: '이 대화에서 할 일 2건이 자동 추출되었습니다.',
          offsetMs: 500,
        },
      ],
    },
  ],
};

export default scenario;

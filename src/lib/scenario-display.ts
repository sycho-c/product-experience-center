import type { BadgeProps } from '@/components/ui/badge';
import type { ScenarioSummary } from '@/types/scenario';

export const CATEGORY_LABEL: Record<ScenarioSummary['category'], string> = {
  'customer-case': '고객 사례',
  feature: '제품 기능',
  'future-concept': '컨셉 기능',
  industry: '업종별',
};

export const CATEGORY_VARIANT: Record<
  ScenarioSummary['category'],
  BadgeProps['variant']
> = {
  'customer-case': 'brand',
  feature: 'success',
  'future-concept': 'warning',
  industry: 'neutral',
};

export const TAG_VARIANT: Record<string, BadgeProps['variant']> = {
  기능: 'success',
  흐름: 'warning',
  '전체 흐름': 'warning',
};

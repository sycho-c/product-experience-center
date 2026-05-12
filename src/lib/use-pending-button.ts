import { useUISimStore } from '@/features/ui-simulation/store';
import { cn } from './utils';

/**
 * 시나리오 click_button 액션이 가리키는 버튼인 동안만 펄스 클래스를 반환.
 * 호출처 예:
 *   const pendingCls = usePendingButton('create-room.next');
 *   <button data-button-id="create-room.next" className={cn('...', pendingCls)} />
 */
export function usePendingButton(buttonId: string): string {
  const pending = useUISimStore((s) => s.pendingButtonId);
  return pending === buttonId
    ? cn('animate-pulse ring-2 ring-brand-primary/50 ring-offset-1')
    : '';
}

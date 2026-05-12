export function formatClock(date: Date = new Date()): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? '오후' : '오전';
  const hour12 = ((h + 11) % 12) + 1;
  return `${period} ${hour12.toString().padStart(2, '0')}:${m}`;
}

// talk.id 별로 첫 렌더 시점의 시간을 캐시 — PC / Mobile 이 같은 메시지에 동일한 시간을 표시하도록.
// 같은 talk(같은 풍선·첨부 묶음) 는 동일 시간, 다른 talk 로 호출이 진행될 때마다 분이 1씩 증가해서
// 시나리오 안에서 시간 간격이 자연스럽게 노출되도록 한다.
// 시나리오 리셋 시 resetTalkClocks() 로 비움.
const talkClockCache = new Map<string, string>();
let clockBase: Date | null = null;
let clockOffsetMinutes = 0;

export function getTalkClock(talkId: string): string {
  let v = talkClockCache.get(talkId);
  if (!v) {
    if (!clockBase) clockBase = new Date();
    const d = new Date(clockBase);
    d.setMinutes(d.getMinutes() + clockOffsetMinutes);
    v = formatClock(d);
    talkClockCache.set(talkId, v);
    // 다음 talk 까지의 간격: 1~5분 랜덤
    clockOffsetMinutes += Math.floor(Math.random() * 5) + 1;
  }
  return v;
}

export function resetTalkClocks(): void {
  talkClockCache.clear();
  clockBase = null;
  clockOffsetMinutes = 0;
}

/**
 * 인접한 두 talk 가 같은 발신자 + 같은 분(minute) 이면 그룹의 마지막이 아님.
 * timeline.map(...) 에서 isLastInGroup 계산에 사용.
 */
export function isLastInTalkGroup<
  T extends {
    id: string;
    from: { role: string; userId?: string; displayName?: string };
  },
>(current: T, next: T | undefined): boolean {
  if (!next) return true;
  const sameSender =
    next.from.role === current.from.role &&
    next.from.userId === current.from.userId &&
    next.from.displayName === current.from.displayName;
  if (!sameSender) return true;
  return getTalkClock(next.id) !== getTalkClock(current.id);
}

export function formatPCStamp(date: Date = new Date()): string {
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mi = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');
  return `${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export function formatDateLabel(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${y}년 ${m}월 ${d}일 ${days[date.getDay()]}요일`;
}

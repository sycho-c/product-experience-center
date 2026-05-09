export function formatClock(date: Date = new Date()): string {
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? '오후' : '오전';
  const hour12 = ((h + 11) % 12) + 1;
  return `${period} ${hour12.toString().padStart(2, '0')}:${m}`;
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

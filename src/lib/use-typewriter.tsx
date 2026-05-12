import { useEffect, useRef, useState } from 'react';
import { cn } from './utils';

const TYPE_SPEED_MS = 15;
const MAX_DURATION_MS = 1_500;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface UseTypewriterOptions {
  /** true 면 즉시 풀 텍스트로 fast-forward. */
  skip?: boolean;
}

export interface UseTypewriterResult {
  display: string;
  isTyping: boolean;
}

/**
 * text 가 바뀌면 처음부터 다시 타이핑.
 * - 글자당 TYPE_SPEED_MS, 총 길이가 MAX_DURATION_MS 를 넘으면 한 번에 2~3 글자 묶음.
 * - skip 또는 prefers-reduced-motion 매치 시 즉시 풀.
 * - 한글/이모지 안전 (Array.from 코드포인트 분리).
 */
export function useTypewriter(
  text: string,
  options: UseTypewriterOptions = {},
): UseTypewriterResult {
  const { skip = false } = options;
  const [display, setDisplay] = useState<string>(() =>
    skip || prefersReducedMotion() ? text : '',
  );
  const [isTyping, setIsTyping] = useState<boolean>(
    () => !(skip || prefersReducedMotion()) && text.length > 0,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (skip || prefersReducedMotion() || text.length === 0) {
      setDisplay(text);
      setIsTyping(false);
      return;
    }

    const chars = Array.from(text);
    const totalDuration = chars.length * TYPE_SPEED_MS;
    const charsPerTick = totalDuration > MAX_DURATION_MS
      ? Math.ceil(chars.length / (MAX_DURATION_MS / TYPE_SPEED_MS))
      : 1;
    const interval =
      totalDuration > MAX_DURATION_MS
        ? Math.floor(MAX_DURATION_MS / Math.ceil(chars.length / charsPerTick))
        : TYPE_SPEED_MS;

    let i = 0;
    setDisplay('');
    setIsTyping(true);

    const tick = () => {
      i = Math.min(i + charsPerTick, chars.length);
      setDisplay(chars.slice(0, i).join(''));
      if (i >= chars.length) {
        setIsTyping(false);
        timeoutRef.current = null;
        return;
      }
      timeoutRef.current = setTimeout(tick, interval);
    };
    timeoutRef.current = setTimeout(tick, interval);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, skip]);

  return { display, isTyping };
}

export interface TypingTextProps {
  text: string;
  skip?: boolean;
  className?: string;
  /** 타이핑 중 우측에 깜빡이는 caret 표시. */
  showCaret?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function TypingText({
  text,
  skip,
  className,
  showCaret = false,
  as: Tag = 'span',
}: TypingTextProps) {
  const { display, isTyping } = useTypewriter(text, { skip });
  return (
    <Tag className={className}>
      {display}
      {showCaret && isTyping && (
        <span className="ml-0.5 inline-block w-[1px] animate-pulse bg-current align-middle text-current opacity-60">
          &nbsp;
        </span>
      )}
    </Tag>
  );
}

// Re-export cn for callers that already import the helper alongside.
export { cn };

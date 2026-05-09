import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  text?: string;
  subtitle?: string;
}

export function Logo({
  className,
  showText = true,
  text = 'PRODUCT EXPERIENCE CENTER',
  subtitle,
}: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoMark className="h-7 w-7" />
      {showText && (
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-wide text-ink-primary">
            {text}
          </div>
          {subtitle && (
            <div className="text-[11px] text-ink-muted">{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="11"
        height="11"
        rx="2.5"
        fill="url(#lm)"
        transform="rotate(45 9.5 9.5)"
      />
      <rect
        x="17"
        y="17"
        width="11"
        height="11"
        rx="2.5"
        fill="url(#lm)"
        opacity="0.55"
        transform="rotate(45 22.5 22.5)"
      />
    </svg>
  );
}

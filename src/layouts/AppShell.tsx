import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { to: string; label: string; matchPaths: string[] }[] = [
  { to: '/scenarios', label: '시나리오 체험', matchPaths: ['/scenarios'] },
  { to: '/features', label: '제품 기능', matchPaths: ['/features'] },
];

export function AppShell() {
  const location = useLocation();
  const isFullscreen =
    location.pathname.includes('/experience') ||
    location.pathname.startsWith('/features');

  return (
    <div className="min-h-screen flex flex-col bg-surface-canvas">
      <header className="sticky top-0 z-30 border-b border-surface-border bg-surface-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-6 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <Badge variant="brand" className="ml-1">
              Beta
            </Badge>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.matchPaths.some((p) =>
                location.pathname.startsWith(p)
              );
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'px-3 py-2 text-sm font-medium',
                    active
                      ? 'text-brand-primary'
                      : 'text-ink-secondary hover:text-ink-primary'
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto" />
        </div>
      </header>

      <main
        className={cn(
          'mx-auto w-full max-w-[1480px] flex-1',
          isFullscreen ? '' : 'px-6 py-10'
        )}
      >
        <Outlet />
      </main>

      {!isFullscreen && (
        <footer className="border-t border-surface-border bg-surface-card">
          <div className="mx-auto max-w-[1480px] px-6 py-6 text-xs text-ink-muted">
            모든 데이터는 시나리오 기반의 더미 데이터입니다.
            <span className="mx-2">·</span>
            Copyright © Spectra Co.Ltd Incorporated. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}

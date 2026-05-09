import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundRoute() {
  return (
    <div className="grid place-items-center py-24 text-center">
      <div>
        <div className="text-5xl font-bold text-ink-primary">404</div>
        <p className="mt-3 text-ink-secondary">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}

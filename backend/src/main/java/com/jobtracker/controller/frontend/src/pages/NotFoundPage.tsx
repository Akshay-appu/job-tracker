import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center px-6 bg-app">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-faint">Error 404</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight text-balance">
          Lost the <span className="font-serif italic text-accent-500">trail</span>.
        </h1>
        <p className="mt-3 text-muted">
          We couldn't find that page. It may have been moved or it never existed in the first place.
        </p>
        <div className="mt-7 flex justify-center">
          <Link to="/dashboard">
            <Button leftIcon={<ArrowLeft className="size-4" />}>
              Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

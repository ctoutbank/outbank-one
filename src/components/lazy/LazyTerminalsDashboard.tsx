import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TerminalsDashboardContent = lazy(() => 
  import('@/features/terminals/_components/terminals-dashboard-content').then(module => ({
    default: module.TerminalsDashboardContent
  }))
);

export function LazyTerminalsDashboard(props: any) {
  return (
    <Suspense fallback={
      <div className="w-full mt-1 mb-1 md:mt-2 md:mb-2 lg:mt-4 lg:mb-4">
        <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))}
          </div>
        </div>
      </div>
    }>
      <TerminalsDashboardContent {...props} />
    </Suspense>
  );
}

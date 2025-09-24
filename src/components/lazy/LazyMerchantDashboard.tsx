import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const MerchantDashboardContent = lazy(() => 
  import('@/features/merchant/_components/merchant-dashboard-content').then(module => ({
    default: module.MerchantDashboardContent
  }))
);

export function LazyMerchantDashboard(props: any) {
  return (
    <Suspense fallback={
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[165px] w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <MerchantDashboardContent {...props} />
    </Suspense>
  );
}

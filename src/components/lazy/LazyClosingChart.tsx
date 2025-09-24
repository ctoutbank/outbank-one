import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BarChartCustom = lazy(() => 
  import('@/features/closing/components/barChart').then(module => ({
    default: module.BarChartCustom
  }))
);

export function LazyClosingChart(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <BarChartCustom {...props} />
    </Suspense>
  );
}

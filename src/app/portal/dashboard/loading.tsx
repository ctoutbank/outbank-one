import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow">
      <div className="mb-4 space-y-3">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-6 shadow">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
            <Skeleton className="h-7 w-[140px]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Dashboard" subtitle="Visão Geral das Vendas">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
        </div>

        <CardsSkeleton />

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
          <ChartSkeleton />
        </div>
      </BaseBody>
    </>
  );
}

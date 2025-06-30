import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Vendas", url: "/portal/transactions" }]}
      />
      <BaseBody title="Vendas" subtitle="Visualização de Todas as Vendas">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Filter Skeleton */}
              <Skeleton className="h-10 w-[120px]" />
              {/* Dashboard Button Skeleton */}
              <Skeleton className="h-10 w-[150px]" />
            </div>
            {/* Export Buttons Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="rounded-md border">
            <div className="p-4">
              {/* Table Header */}
              <div className="flex items-center gap-4 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-[100px]" />
                ))}
              </div>

              {/* Table Rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-[100px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[300px]" />
          </div>
        </div>
      </BaseBody>
    </>
  );
}

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Agenda dos Lojistas", url: "/portal/merchantAgenda" },
        ]}
      />
      <BaseBody
        title="Agenda dos Lojistas"
        subtitle="Visualização da agenda dos Lojistas"
        className="overflow-x-visible"
      >
        <div className="flex flex-col space-y-4 mt-2">
          {/* Tabs Skeleton */}
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Filter Section Skeleton */}
          <div className="mb-1">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </div>

          {/* Dashboard Content Skeleton */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="grid grid-cols-2 gap-4 flex-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="h-4 w-[120px] mb-2" />
                  <Skeleton className="h-6 w-[160px]" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>

          {/* Table Skeleton */}
          <div className="w-full overflow-x-auto">
            <div className="rounded-lg border">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-4 border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-[100px]" />
                ))}
              </div>
              {/* Table Rows */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-[100px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[100px]" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </BaseBody>
    </>
  );
}

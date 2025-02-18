import { Skeleton } from "@/components/ui/skeleton";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Estabelecimentos", url: "/portal/merchants" }]}
      />
      <BaseBody
        title="Estabelecimentos"
        subtitle={`visualização de todos os estabelecimentos`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-10 w-[250px]" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </div>

        <div className="rounded-lg border">
          <div className="flex items-center justify-between p-4 border-b bg-muted">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[100px]" />
            </div>
          </div>
          
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-8 w-[100px]" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </BaseBody>
    </>
  );
}

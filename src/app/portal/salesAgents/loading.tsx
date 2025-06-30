import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
      />

      <BaseBody
        title="Consultores"
        subtitle="Visualização de Todos os Consultores"
      >
        <div className="flex justify-between items-center mb-4 mt-8">
          <div className="flex gap-4">
            <Skeleton className="h-8 w-[520px]" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b p-4">
            <div className="flex items-center space-x-4 py-3 border-b">
              <Skeleton className="h-4 w-full" />
            </div>

            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 py-3 border-b last:border-b-0"
              >
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </BaseBody>
    </>
  );
}

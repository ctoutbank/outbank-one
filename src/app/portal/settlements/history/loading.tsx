import { Skeleton } from "@/components/ui/skeleton";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          {
            title: "Histórico de Liquidações",
            url: "/portal/settlements/history",
          },
        ]}
      />
      <BaseBody
        title="Histórico de Liquidações"
        subtitle="Visualização do Histórico de Liquidações"
      >
        {/* Filter Button Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-[100px]" /> {/* Filtros button */}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="border-b p-3">
            <div className="grid grid-cols-6 gap-2">
              <Skeleton className="h-3 w-full" /> {/* Data de liquidação */}
              <Skeleton className="h-3 w-full" /> {/* Montante bruto das vendas */}
              <Skeleton className="h-3 w-full" /> {/* Montante líquido das antecipações */}
              <Skeleton className="h-3 w-full" /> {/* Montante da restituição */}
              <Skeleton className="h-3 w-full" /> {/* Montante da liquidação */}
              <Skeleton className="ml-24 h-3 w-[80px]" /> {/* Status */}
            </div>
          </div>

          {/* Table Rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b p-3">
              <div className="grid grid-cols-6 gap-4">
                <Skeleton className="h-3 w-full" /> {/* Date */}
                <Skeleton className="h-3 w-full" /> {/* Gross amount */}
                <Skeleton className="h-3 w-full" /> {/* Net amount */}
                <Skeleton className="h-3 w-full" /> {/* Restitution */}
                <Skeleton className="h-3 w-full" /> {/* Settlement amount */}
                <Skeleton className="ml-24 h-3 w-[80px]" /> {/* Status badge */}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center mt-4">
            <Skeleton className="h-5 w-[450px]" /> {/* Pagination buttons */}
          </div>
        <div className="mt-4 gap-4">
          <Skeleton className="h-5 w-[150px]" /> {/* Total records counter */}
        </div>
      </BaseBody>
    </>
  );
}

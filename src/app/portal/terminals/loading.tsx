import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Terminais", url: "/portal/terminals" }]}
      />
      <BaseBody title="Terminais" subtitle="Visualização de Todos os Terminais">
        <div className="flex flex-col space-y-4">
          {/* Filtros e Exportação */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-between w-full">
              <Skeleton className="h-10 w-[250px]" /> {/* Filtro */}
              <Skeleton className="h-10 w-[180px]" /> {/* Botão Exportar */}
            </div>
            {/* Dashboard Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-muted flex flex-col gap-4"
                >
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tabela de Terminais */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between p-4 border-b bg-muted">
              <div className="space-y-2 flex gap-4">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[60px]" />
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50"
              >
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex flex-col gap-1 w-[180px]">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            ))}
          </div>
          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-[100px]" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </div>
      </BaseBody>
    </>
  );
}

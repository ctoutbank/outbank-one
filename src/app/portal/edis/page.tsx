import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { EdisDashboardContent } from "@/features/edis/_components/edis-dashboard-content";
import { EdisFilter } from "@/features/edis/_components/edis-filter";
import EdisList from "@/features/edis/_components/edis-list";
import { getEdis } from "@/features/edis/server/edis";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageSizeSelector from "@/components/page-size-selector";

type EdisProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  type?: string;
  date?: string;
};

export default async function EdisPage({
  searchParams,
}: {
  searchParams: EdisProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";

  // Buscar dados EDIS usando a função de servidor
  const edis = await getEdis(
    search,
    page,
    pageSize,
    searchParams.type,
    searchParams.status,
    searchParams.date
  );

  const totalRecords = edis.totalCount;

  const edisData = {
    totalEdis: edis.totalCount,
    activeEdis: edis.active_count || 0,
    inactiveEdis: edis.inactive_count || 0,
    pendingEdis: edis.pending_count || 0,
    processedEdis: edis.processed_count || 0,
    errorEdis: edis.error_count || 0,
  };

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Arquivos EDIS", url: "/portal/edis" }]}
      />

      <BaseBody
        title="Arquivos EDIS"
        subtitle={`Visualização de todos os arquivos EDIS`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <EdisFilter
                typeIn={searchParams.type}
                statusIn={searchParams.status}
                dateIn={searchParams.date}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/edis/new">
                <Plus className="h-4 w-4 mr-1" />
                Novo Arquivo EDIS
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
              <EdisDashboardContent {...edisData} />
            </div>
          </div>

          <EdisList list={edis} />

          {totalRecords > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                    currentPageSize={pageSize}
                    pageName="portal/edis"
                />
                <PaginationRecords
                    totalRecords={totalRecords}
                    currentPage={page}
                    pageSize={pageSize}
                    pageName="portal/edis"
                />
              </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}

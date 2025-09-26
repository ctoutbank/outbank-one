import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EdisDashboardContent } from "@/features/edis/_components/edis-dashboard-content";
import { EdisFilter } from "@/features/edis/_components/edis-filter";
import EdisList from "@/features/edis/_components/edis-list";
import { getEdis } from "@/features/edis/server/edis";
import { Search } from "lucide-react";

type EdisProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    status?: string;
    type?: string;
    date?: string;
  };
};

export default async function EdisPage({ searchParams }: EdisProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";

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
    <div className="space-y-8">
      <PageHeader
        title="Arquivos EDI"
        description="Gerencie e visualize os arquivos de Intercâmbio Eletrônico de Dados."
      />

      <EdisDashboardContent {...edisData} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Arquivos</CardTitle>
          <CardDescription>
            Filtre e visualize todos os arquivos EDI processados.
          </CardDescription>
          <div className="pt-4">
            <EdisFilter
              typeIn={searchParams.type}
              statusIn={searchParams.status}
              dateIn={searchParams.date}
            />
          </div>
        </CardHeader>
        <CardContent>
          {edis.data.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum arquivo EDI encontrado"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <EdisList list={edis} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
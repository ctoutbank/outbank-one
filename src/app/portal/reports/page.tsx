import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportsDashboardContent } from "@/features/reports/_components/reports-dashboard-content";
import { ReportsFilter } from "@/features/reports/_components/reports-filter";
import ReportList from "@/features/reports/_components/reports-list";
import { getReports, getReportStats } from "@/features/reports/server/reports";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type ReportsProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    type?: string;
    format?: string;
    recurrence?: string;
    period?: string;
    email?: string;
    creationDate?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function ReportsPage({ searchParams }: ReportsProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const sortBy = searchParams.sortBy || "id";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "desc";

  const [reports, reportStats] = await Promise.all([
    getReports(
      searchParams.search || "",
      page,
      pageSize,
      searchParams.type,
      searchParams.format,
      searchParams.recurrence,
      searchParams.period,
      searchParams.email,
      searchParams.creationDate,
      { sortBy, sortOrder }
    ),
    getReportStats(),
  ]);

  const totalRecords = reports.totalCount;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios"
        description="Gere e gerencie seus relatórios personalizados."
      >
        <Button asChild>
          <Link href="/portal/reports/0">
            <Plus className="mr-2 h-4 w-4" />
            Novo Relatório
          </Link>
        </Button>
      </PageHeader>

      <ReportsDashboardContent
        totalReports={reportStats.totalReports}
        recurrenceStats={reportStats.recurrenceStats}
        formatStats={reportStats.formatStats}
        typeStats={reportStats.typeStats}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Relatórios</CardTitle>
          <CardDescription>
            Filtre e visualize todos os relatórios gerados.
          </CardDescription>
          <div className="pt-4">
            <ReportsFilter
              searchIn={searchParams.search}
              typeIn={searchParams.type}
              formatIn={searchParams.format}
              recurrenceIn={searchParams.recurrence}
              periodIn={searchParams.period}
              emailIn={searchParams.email}
              creationDateIn={searchParams.creationDate}
            />
          </div>
        </CardHeader>
        <CardContent>
          {reports.reports.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum relatório encontrado"
              description="Tente ajustar seus filtros ou crie um novo relatório."
            />
          ) : (
            <ReportList Reports={reports} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter>
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/reports"
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
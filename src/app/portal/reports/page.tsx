import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { ReportsDashboardContent } from "@/features/reports/_components/reports-dashboard-content";
import { ReportsFilter } from "@/features/reports/_components/reports-filter";
import ReportList from "@/features/reports/_components/reports-list";
import { getReports, getReportStats } from "@/features/reports/server/reports";
import { Plus } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

type ReportsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  type?: string;
  format?: string;
  recurrence?: string;
  period?: string;
  email?: string;
  creationDate?: string;
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: ReportsProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");

  const reports = await getReports(
    searchParams.search || "",
    page,
    pageSize,
    searchParams.type,
    searchParams.format,
    searchParams.recurrence,
    searchParams.period,
    searchParams.email,
    searchParams.creationDate
  );
  const totalRecords = reports.totalCount;

  // Obter estatísticas para o dashboard
  const reportStats = await getReportStats();

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Relatórios", url: "/portal/reports" }]}
      />

      <BaseBody
        title="Relatórios"
        subtitle={`Visualização de todos os Relatórios`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
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
            <Button asChild className="ml-2">
              <Link href="/portal/reports/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo Relatório
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
              <ReportsDashboardContent
                totalReports={reportStats.totalReports}
                recurrenceStats={reportStats.recurrenceStats}
                formatStats={reportStats.formatStats}
                typeStats={reportStats.typeStats}
              />
            </div>
          </div>

          <ReportList Reports={reports} />
          {totalRecords > 0 && (
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/reports"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}

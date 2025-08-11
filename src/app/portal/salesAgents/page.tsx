import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { SalesAgentDashboardContent } from "@/features/salesAgents/_components/salesAgents-dashboard-content";
import { SalesAgentsFilter } from "@/features/salesAgents/_components/salesAgents-filter";
import { getSalesAgentsWithDashboardData } from "@/features/salesAgents/server/salesAgent";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import SalesAgentlist from "../../../features/salesAgents/_components/salesAgents-list";

export const revalidate = 0;

type SalesAgentProps = {
  page?: string;
  pageSize?: string;
  name?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  email?: string;
};

export default async function SalesAgentsPage({
  searchParams,
}: {
  searchParams: SalesAgentProps;
}) {
  await checkPagePermission("Configurar Consultor Comercial");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");

  const salesAgents = await getSalesAgentsWithDashboardData(
    searchParams.name || "",
    page,
    pageSize,
    searchParams.status,
    searchParams.dateFrom,
    searchParams.dateTo,
    searchParams.email
  );
  const totalRecords = salesAgents?.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
      />

      <BaseBody
        title="Consultores"
        subtitle={`Visualização de Todos os Consultores`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <SalesAgentsFilter
                dateFromIn={searchParams.dateFrom}
                dateToIn={searchParams.dateTo}
                nameIn={searchParams.name}
                statusIn={searchParams.status}
                emailIn={searchParams.email}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/salesAgents/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo Consultor
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="w-full">
              <SalesAgentDashboardContent
                totalAgents={salesAgents?.totalCount || 0}
                activeAgents={
                  salesAgents?.salesAgents.filter((a) => a.active).length || 0
                }
                inactiveAgents={
                  salesAgents?.salesAgents.filter((a) => !a.active).length || 0
                }
                totalMerchants={
                  salesAgents?.salesAgents.reduce(
                    (acc, agent) => acc + (agent.totalMerchants || 0),
                    0
                  ) || 0
                }
                pendingMerchants={
                  salesAgents?.salesAgents.reduce(
                    (acc, agent) => acc + (agent.pendingMerchants || 0),
                    0
                  ) || 0
                }
                approvedMerchants={
                  salesAgents?.salesAgents.reduce(
                    (acc, agent) => acc + (agent.approvedMerchants || 0),
                    0
                  ) || 0
                }
                rejectedMerchants={
                  salesAgents?.salesAgents.reduce(
                    (acc, agent) => acc + (agent.rejectedMerchants || 0),
                    0
                  ) || 0
                }
              />
            </div>
          </div>

          {salesAgents?.salesAgents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description=""
            />
          ) : (
            <SalesAgentlist SalesAgents={salesAgents} />
          )}

          {totalRecords && totalRecords > 0 && (
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/salesAgents"
              />
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/salesAgents"
              />
            </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}

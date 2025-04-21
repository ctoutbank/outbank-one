import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { SalesAgentDashboardContent } from "@/features/salesAgents/_components/salesAgents-dashboard-content";
import { SalesAgentsFilter } from "@/features/salesAgents/_components/salesAgents-filter";
import { getSalesAgents } from "@/features/salesAgents/server/salesAgent";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus } from "lucide-react";
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
  const pageSize = parseInt(searchParams.pageSize || "12");

  const salesAgents = await getSalesAgents(
    searchParams.name || "",
    page,
    pageSize,
    searchParams.status,
    searchParams.dateFrom,
    searchParams.dateTo,
    searchParams.email
  );
  const totalRecords = salesAgents.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Consultores", url: "/portal/salesAgents" }]}
      />

      <BaseBody
        title="Consultores"
        subtitle={`Visualização de todos os Consultores`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1">
            <SalesAgentsFilter
              dateFromIn={searchParams.dateFrom}
              dateToIn={searchParams.dateTo}
              nameIn={searchParams.name}
              statusIn={searchParams.status}
              emailIn={searchParams.email}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="max-w-md">
              <SalesAgentDashboardContent
                totalAgents={salesAgents.totalCount}
                activeAgents={
                  salesAgents.salesAgents.filter((a) => a.active).length
                }
                inactiveAgents={
                  salesAgents.salesAgents.filter((a) => !a.active).length
                }
                totalMerchants={salesAgents.salesAgents.reduce(
                  (acc, agent) => acc + (agent.totalMerchants || 0),
                  0
                )}
                pendingMerchants={salesAgents.salesAgents.reduce(
                  (acc, agent) => acc + (agent.pendingMerchants || 0),
                  0
                )}
                approvedMerchants={salesAgents.salesAgents.reduce(
                  (acc, agent) => acc + (agent.approvedMerchants || 0),
                  0
                )}
                rejectedMerchants={salesAgents.salesAgents.reduce(
                  (acc, agent) => acc + (agent.rejectedMerchants || 0),
                  0
                )}
              />
            </div>
            <div className="flex items-end self-stretch">
              <Button asChild className="shrink-0">
                <Link href="/portal/salesAgents/0">
                  <Plus className="h-4 w-4" />
                  Novo Consultor
                </Link>
              </Button>
            </div>
          </div>

          <SalesAgentlist SalesAgents={salesAgents} />

          {totalRecords > 0 && (
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/salesAgents"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}

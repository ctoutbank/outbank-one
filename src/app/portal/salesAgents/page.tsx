import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesAgentDashboardContent } from "@/features/salesAgents/_components/salesAgents-dashboard-content";
import { SalesAgentsFilter } from "@/features/salesAgents/_components/salesAgents-filter";
import SalesAgentlist from "@/features/salesAgents/_components/salesAgents-list";
import { getSalesAgentsWithDashboardData } from "@/features/salesAgents/server/salesAgent";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type SalesAgentProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    name?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    email?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function SalesAgentsPage({ searchParams }: SalesAgentProps) {
  await checkPagePermission("Configurar Consultor Comercial");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const sortBy = searchParams.sortBy;
  const sortOrder = searchParams.sortOrder as "asc" | "desc" | undefined;

  const salesAgents = await getSalesAgentsWithDashboardData(
    searchParams.name || "",
    page,
    pageSize,
    searchParams.status,
    searchParams.dateFrom,
    searchParams.dateTo,
    searchParams.email,
    { sortBy, sortOrder }
  );
  const totalRecords = salesAgents?.totalCount;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Consultores"
        description="Gerencie seus consultores comerciais e acompanhe seus resultados."
      >
        <Button asChild>
          <Link href="/portal/salesAgents/0">
            <Plus className="h-4 w-4 mr-2" />
            Novo Consultor
          </Link>
        </Button>
      </PageHeader>

      <SalesAgentDashboardContent
        totalAgents={salesAgents?.totalCount || 0}
        activeAgents={salesAgents?.salesAgents.filter((a) => a.active).length || 0}
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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Consultores</CardTitle>
          <CardDescription>
            Filtre e visualize todos os consultores cadastrados.
          </CardDescription>
          <div className="pt-4">
            <SalesAgentsFilter
              dateFromIn={searchParams.dateFrom}
              dateToIn={searchParams.dateTo}
              nameIn={searchParams.name}
              statusIn={searchParams.status}
              emailIn={searchParams.email}
            />
          </div>
        </CardHeader>
        <CardContent>
          {salesAgents?.salesAgents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum consultor encontrado"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <SalesAgentlist SalesAgents={salesAgents} />
          )}
        </CardContent>
        {totalRecords && totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
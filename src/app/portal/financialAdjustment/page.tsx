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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialAdjustmentsListRecurrence from "@/features/financialAdjustmet/_components/financial-adjustements-list-recurrence";
import { FinancialAdjustmentsClientWrapper } from "@/features/financialAdjustmet/_components/financial-adjustments-client-wrapper";
import { FinancialAdjustmentsDashboardContent } from "@/features/financialAdjustmet/_components/financial-adjustments-dashboard-content";
import FinancialAdjustmentsList from "@/features/financialAdjustmet/_components/financial-adjustments-list";
import {
  getFinancialAdjustments,
  getFinancialAdjustmentStats,
} from "@/features/financialAdjustmet/server/financialAdjustments";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type FinancialAdjustmentsProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    type?: string;
    reason?: string;
    active?: string;
    creationDate?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function FinancialAdjustmentsPage({
  searchParams,
}: FinancialAdjustmentsProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const sortBy = searchParams.sortBy || "id";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "desc";

  const [adjustments, adjustmentStats] = await Promise.all([
    getFinancialAdjustments(
      searchParams.search || "",
      page,
      pageSize,
      searchParams.type,
      searchParams.reason,
      searchParams.active,
      { sortBy, sortOrder }
    ),
    getFinancialAdjustmentStats(),
  ]);

  const totalRecords = adjustments.totalCount;

  const singleAdjustments = {
    financialAdjustments: adjustments.financialAdjustments.filter(
      (adj) => adj.type === "SINGLE"
    ),
    totalCount: adjustments.financialAdjustments.filter(
      (adj) => adj.type === "SINGLE"
    ).length,
  };

  const recurringAdjustments = {
    financialAdjustments: adjustments.financialAdjustments.filter(
      (adj) => adj.type === "RECURRING"
    ),
    totalCount: adjustments.financialAdjustments.filter(
      (adj) => adj.type === "RECURRING"
    ).length,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ajustes Financeiros"
        description="Crie e gerencie seus ajustes de crédito e débito."
      >
        <Button asChild>
          <Link href="/portal/financialAdjustment/0">
            <Plus className="h-4 w-4 mr-2" />
            Novo Ajuste
          </Link>
        </Button>
      </PageHeader>

      <FinancialAdjustmentsDashboardContent
        totalAdjustments={adjustmentStats.totalAdjustments}
        activeAdjustments={adjustmentStats.activeAdjustments}
        totalValue={adjustmentStats.totalValue}
        typeStats={adjustmentStats.typeStats}
        reasonStats={adjustmentStats.reasonStats}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ajustes</CardTitle>
          <CardDescription>
            Filtre e visualize os ajustes lançados.
          </CardDescription>
          <div className="pt-4">
            <FinancialAdjustmentsClientWrapper
              searchIn={searchParams.search}
              typeIn={searchParams.type}
              reasonIn={searchParams.reason}
              activeIn={searchParams.active}
              creationDateIn={searchParams.creationDate}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lancamentos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-1/3">
              <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
              <TabsTrigger value="recorrencia">Recorrência</TabsTrigger>
            </TabsList>
            <TabsContent value="lancamentos" className="mt-4">
              {singleAdjustments.financialAdjustments.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nenhum lançamento encontrado"
                  description="Não há ajustes do tipo 'Lançamento Único' para os filtros aplicados."
                />
              ) : (
                <FinancialAdjustmentsList adjustments={singleAdjustments} />
              )}
            </TabsContent>
            <TabsContent value="recorrencia" className="mt-4">
              {recurringAdjustments.financialAdjustments.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nenhuma recorrência encontrada"
                  description="Não há ajustes do tipo 'Recorrente' para os filtros aplicados."
                />
              ) : (
                <FinancialAdjustmentsListRecurrence
                  adjustments={recurringAdjustments}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter>
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/financialAdjustment"
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
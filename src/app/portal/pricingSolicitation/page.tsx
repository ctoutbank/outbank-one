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
import { PricingSolicitationFilter } from "@/features/pricingSolicitation/_components/pricing-solicitation-filter";
import PricingSolicitationList from "@/features/pricingSolicitation/_components/pricing-solicitation-list";
import { getPricingSolicitations } from "@/features/pricingSolicitation/server/pricing-solicitation";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Search } from "lucide-react";

export const revalidate = 300;

type PricingSolicitationProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    merchant?: string;
    cnae?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function PricingSolicitationPage({
  searchParams,
}: PricingSolicitationProps) {
  const permissions = await checkPagePermission("Solicitação de Taxas");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const cnae = searchParams.cnae || "";
  const status = searchParams.status || "";
  const sortBy = searchParams.sortBy || "id";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "desc";

  const pricingSolicitations = await getPricingSolicitations(
    cnae,
    status,
    page,
    pageSize,
    { sortBy, sortOrder }
  );

  const totalRecords = pricingSolicitations?.totalCount || 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Solicitação de Taxas"
        description="Analise e gerencie as solicitações de precificação pendentes."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitações</CardTitle>
          <CardDescription>
            Filtre e visualize todas as solicitações de taxas.
          </CardDescription>
          <div className="pt-4">
            <PricingSolicitationFilter
              cnae={cnae}
              status={status}
              permissions={permissions}
            />
          </div>
        </CardHeader>
        <CardContent>
          {!pricingSolicitations ||
          pricingSolicitations.pricingSolicitations.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhuma solicitação encontrada"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <PricingSolicitationList solicitations={pricingSolicitations} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
            <PageSizeSelector
              currentPageSize={pageSize}
              pageName="portal/pricingSolicitation"
            />
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/pricingSolicitation"
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
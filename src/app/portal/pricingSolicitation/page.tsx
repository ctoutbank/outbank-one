import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { PricingSolicitationFilter } from "@/features/pricingSolicitation/_components/pricing-solicitation-filter";
import PricingSolicitationList from "@/features/pricingSolicitation/_components/pricing-solicitation-list";
import { getPricingSolicitations } from "@/features/pricingSolicitation/server/pricing-solicitation";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Search } from "lucide-react";

export const revalidate = 300;

type PricingSolicitationProps = {
  page: string;
  pageSize: string;
  merchant: string;
  cnae: string;
  status: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function PricingSolicitationPage({
  searchParams,
}: {
  searchParams: Promise<PricingSolicitationProps>;
}) {
  const permissions = await checkPagePermission("Solicitação de Taxas");

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.pageSize || "10");
  const cnae = resolvedSearchParams.cnae || "";
  const status = resolvedSearchParams.status || "";
  const sortBy = resolvedSearchParams.sortBy || "id";
  const sortOrder =
    resolvedSearchParams.sortOrder === "asc" || resolvedSearchParams.sortOrder === "desc"
      ? resolvedSearchParams.sortOrder
      : "desc";

  const pricingSolicitations = await getPricingSolicitations(
    cnae,
    status,
    page,
    pageSize,
    { sortBy, sortOrder }
  );

  const totalRecords = pricingSolicitations?.totalCount || 0;

  if (
    !pricingSolicitations ||
    pricingSolicitations.pricingSolicitations.length === 0
  ) {
    return (
      <>
        <BaseHeader
          breadcrumbItems={[
            {
              title: "Solicitação de Taxas",
              url: "/portal/pricingSolicitation",
            },
          ]}
        />
        <BaseBody
          title="Solicitação de Taxa"
          subtitle={`Visualização de Todas as Solicitações de Taxas`}
        >
          <div className="mb-4">
            <PricingSolicitationFilter
              cnae={cnae}
              status={status}
              permissions={permissions}
            />
          </div>
          <EmptyState
            icon={Search}
            title="Nenhum resultado encontrado"
            description=""
          />
        </BaseBody>
      </>
    );
  }

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Solicitação de Taxas", url: "/portal/pricingSolicitation" },
        ]}
      />

      <BaseBody
        title="Solicitação de Taxa"
        subtitle={`Visualização de Todas as Solicitações de Taxas`}
      >
        <div className="mb-4">
          <PricingSolicitationFilter
            cnae={cnae}
            status={status}
            permissions={permissions}
          />
        </div>
        <PricingSolicitationList solicitations={pricingSolicitations} />
        {totalRecords > 0 && (
          <div className="flex items-center justify-between mt-4">
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
          </div>
        )}
      </BaseBody>
    </>
  );
}

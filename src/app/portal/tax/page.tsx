import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import { TaxasDashboardButton } from "@/features/taxas/_components/taxas-dashboard-button";
import { TaxasDashboardContent } from "@/features/taxas/_components/taxas-dashboard-content";
import { TaxasFilter } from "@/features/taxas/_components/taxas-filter";
import { getTaxas } from "@/features/taxas/server/taxa";
import Taxaslist from "../../../features/taxas/_components/taxas-list";

export const revalidate = 0;

type TaxaProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  sortField?: string;
  sortOrder?: string;
  nome?: string;
  status?: string;
  tipo?: string;
  valor?: string;
};

export default async function TaxasPage({
  searchParams,
}: {
  searchParams: TaxaProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const taxas = await getTaxas(
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
    searchParams.nome,
    searchParams.status,
    searchParams.tipo,
    searchParams.valor
  );
  const totalRecords = taxas.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Taxas", url: "/portal/taxas" }]}
      />

      <BaseBody title="Taxas" subtitle={`Visualização de todas as Taxas`}>
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1">
            <TaxasFilter
              nomeIn={searchParams.nome}
              statusIn={searchParams.status}
              tipoIn={searchParams.tipo}
              valorIn={searchParams.valor}
            />

            <TaxasDashboardButton>
              <div className="-ml-28">
                <TaxasDashboardContent
                  totalTaxas={totalRecords}
                  activeTaxas={taxas.activeCount}
                  inactiveTaxas={taxas.inactiveCount}
                  avgValor={taxas.avgValor}
                />
              </div>
            </TaxasDashboardButton>
          </div>
        </div>

        <Taxaslist Taxas={taxas} sortField={sortField} sortOrder={sortOrder} />

        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/taxas"
          />
        )}
      </BaseBody>
    </>
  );
}

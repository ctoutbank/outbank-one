import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import { CategoriesDashboardButton } from "@/features/categories/_components/categories-dashboard-button";
import { CategoriesDashboardContent } from "@/features/categories/_components/categories-dashboard-content";
import { CategoriesFilter } from "@/features/categories/_components/categories-filter";
import { getCategories } from "@/features/categories/server/category";
import Categorylist from "../../../features/categories/_components/categories-list";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type CategoryProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  sortField?: string;
  sortOrder?: string;
  name?: string;
  status?: string;
  mcc?: string;
  cnae?: string;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  await checkPagePermission("Categorias");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const categories = await getCategories(
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
    searchParams.name,
    searchParams.status,
    searchParams.mcc,
    searchParams.cnae
  );
  const totalRecords = categories.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Categorias", url: "/portal/categories" }]}
      />

      <BaseBody
        title="Categorias"
        subtitle={`visualização de todos os Categorias`}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1">
            <CategoriesFilter
              nameIn={searchParams.name}
              statusIn={searchParams.status}
              mccIn={searchParams.mcc}
              cnaeIn={searchParams.cnae}
            />

            <CategoriesDashboardButton>
              <div className="-ml-28">
                <CategoriesDashboardContent
                  totalCategories={totalRecords}
                  activeCategories={categories.activeCount}
                  inactiveCategories={categories.inactiveCount}
                  avgWaitingPeriodCp={categories.avgWaitingPeriodCp}
                  avgWaitingPeriodCnp={categories.avgWaitingPeriodCnp}
                  avgAnticipationRiskFactorCp={
                    categories.avgAnticipationRiskFactorCp
                  }
                  avgAnticipationRiskFactorCnp={
                    categories.avgAnticipationRiskFactorCnp
                  }
                />
              </div>
            </CategoriesDashboardButton>
          </div>
        </div>

        <Categorylist
          Categories={categories}
          sortField={sortField}
          sortOrder={sortOrder}
        />

        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/categories"
          />
        )}
      </BaseBody>
    </>
  );
}

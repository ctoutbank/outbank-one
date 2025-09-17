import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { EmptyState } from "@/components/empty-state";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { CategoriesDashboardContent } from "@/features/categories/_components/categories-dashboard-content";
import { CategoriesFilter } from "@/features/categories/_components/categories-filter";
import { getCategories } from "@/features/categories/server/category";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import Categorylist from "../../../features/categories/_components/categories-list";

export const revalidate = 300;

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
        breadcrumbItems={[{ title: "CNAE", url: "/portal/categories" }]}
      />

      <BaseBody title="CNAE" subtitle={`Visualização de Todos os CNAE`}>
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <CategoriesFilter
                nameIn={searchParams.name}
                statusIn={searchParams.status}
                mccIn={searchParams.mcc}
                cnaeIn={searchParams.cnae}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/categories/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo CNAE
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
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
          </div>

          {categories.categories.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description=""
            />
          ) : (
            <Categorylist
              Categories={categories}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          )}

          {totalRecords > 0 && (
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/categories"
              />
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/categories"
              />
            </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}

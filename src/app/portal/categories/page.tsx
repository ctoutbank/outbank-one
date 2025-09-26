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
import { CategoriesDashboardContent } from "@/features/categories/_components/categories-dashboard-content";
import { CategoriesFilter } from "@/features/categories/_components/categories-filter";
import Categorylist from "@/features/categories/_components/categories-list";
import { getCategories } from "@/features/categories/server/category";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type CategoryProps = {
  searchParams: {
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
};

export default async function CategoriesPage({ searchParams }: CategoryProps) {
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
    <div className="space-y-8">
      <PageHeader
        title="Categorias (CNAE)"
        description="Gerencie as categorias de negócio (CNAE) do sistema."
      >
        <Button asChild>
          <Link href="/portal/categories/0">
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Link>
        </Button>
      </PageHeader>

      <CategoriesDashboardContent
        totalCategories={totalRecords}
        activeCategories={categories.activeCount}
        inactiveCategories={categories.inactiveCount}
        avgWaitingPeriodCp={categories.avgWaitingPeriodCp}
        avgWaitingPeriodCnp={categories.avgWaitingPeriodCnp}
        avgAnticipationRiskFactorCp={categories.avgAnticipationRiskFactorCp}
        avgAnticipationRiskFactorCnp={categories.avgAnticipationRiskFactorCnp}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Filtre e visualize todas as categorias cadastradas.
          </CardDescription>
          <div className="pt-4">
            <CategoriesFilter
              nameIn={searchParams.name}
              statusIn={searchParams.status}
              mccIn={searchParams.mcc}
              cnaeIn={searchParams.cnae}
            />
          </div>
        </CardHeader>
        <CardContent>
          {categories.categories.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhuma categoria encontrada"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <Categorylist
              Categories={categories}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
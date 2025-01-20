import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import Categorylist from "../../../features/categories/_components/categories-list";
import PaginationRecords from "@/components/pagination-Records";
import { getCategories } from "@/features/categories/server/category";

export const revalidate = 0;

type CategoryProps = {
  page: string;
  pageSize: string;
  search: string;
  sortField?: string;
  sortOrder?: string;
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const categories = await getCategories(search, page, pageSize, sortField, sortOrder);
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
        <ListFilter
          pageName="portal/categories"
          search={search}
          linkHref={"/portal/categories/0"}
          linkText={"Nova Categoria"}
        />

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

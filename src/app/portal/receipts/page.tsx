import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { getCategories } from "@/features/categories/server/category";
import FinancialPage from "@/features/merchantAgenda/_components/calendar";

export const revalidate = 0;

type CategoryProps = {
  page: string;
  pageSize: string;
  search: string;
  sortField?: string;
  sortOrder?: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const categories = await getCategories(
    search,
    page,
    pageSize,
    sortField,
    sortOrder
  );
  const totalRecords = categories.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Recebimentos", url: "/portal/receipts" }]}
      />

      <BaseBody title="Recebimentos" subtitle={`visualização dos Recebimentos`}>
        <FinancialPage></FinancialPage>
      </BaseBody>
    </>
  );
}

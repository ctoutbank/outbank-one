import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaymentLinkList from "@/features/paymentLink/_components/paymentLink-list";
import PaginationRecords from "@/components/pagination-Records";
import { getPaymentLinks } from "@/features/paymentLink/server/paymentLink";

export const revalidate = 0;

type PaymentLinkProps = {
  page: string;
  pageSize: string;
  search: string;
  sortField?: string;
  sortOrder?: string;
};

export default async function PaymentLinkPage({
  searchParams,
}: {
  searchParams: PaymentLinkProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const paymentLinks = await getPaymentLinks(search, page, pageSize);
  const totalRecords = paymentLinks.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Links de Pagamento", url: "/portal/paymentLink" },
        ]}
      />

      <BaseBody
        title="Links de Pagamento"
        subtitle={`Visualização de todos os Links de Pagamento`}
      >
        <ListFilter
          pageName="portal/paymentLink"
          search={search}
          linkHref={"/portal/paymentLink/0"}
          linkText={"Novo Link de Pagamento"}
        />

        <PaymentLinkList links={paymentLinks} />

        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/paymentLink"
          />
        )}
      </BaseBody>
    </>
  );
}

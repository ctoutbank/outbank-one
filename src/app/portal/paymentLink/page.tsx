import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { PaymentLinkFilter } from "@/features/paymentLink/_components/payment-link-filter";
import PaymentLinkList from "@/features/paymentLink/_components/paymentLink-list";
import { getPaymentLinks } from "@/features/paymentLink/server/paymentLink";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Search } from "lucide-react";

export const revalidate = 0;

type PaymentLinkProps = {
  page: string;
  pageSize: string;
  merchant: string;
  identifier: string;
  status: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function PaymentLinkPage({
  searchParams,
}: {
  searchParams: PaymentLinkProps;
}) {
  const permissions = await checkPagePermission("Link de Pagamentos");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const merchant = searchParams.merchant || "";
  const identifier = searchParams.identifier || "";
  const status = searchParams.status || "";
  const sortBy = searchParams.sortBy || "dtinsert";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "desc";

  const paymentLinks = await getPaymentLinks(
    merchant,
    identifier,
    status,
    page,
    pageSize,
    sortBy,
    sortOrder
  );

  const totalRecords = paymentLinks.totalCount;
  console.log(permissions);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Links de Pagamento", url: "/portal/paymentLink" },
        ]}
      />

      <BaseBody
        title="Links de Pagamento"
        subtitle={`Visualização de Todos os Links de Pagamento`}
        // actions={<SyncButton syncType="paymentLink" />}
      >
        <div className="mb-4">
          <PaymentLinkFilter
            identifier={identifier}
            status={status}
            merchant={merchant}
            permissions={permissions}
          />
        </div>
        {paymentLinks.linksObject.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum resultado encontrado"
            description=""
          />
        ) : (
          <PaymentLinkList
            links={paymentLinks}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}

        {totalRecords > 0 && (
          <div className="flex items-center justify-between mt-4">
            <PageSizeSelector
              currentPageSize={pageSize}
              pageName="portal/paymentLink"
            />
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/paymentLink"
            />
          </div>
        )}
      </BaseBody>
    </>
  );
}

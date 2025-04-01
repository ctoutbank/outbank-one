import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { PaymentLinkFilter } from "@/features/paymentLink/_components/payment-link-filter";
import PaymentLinkList from "@/features/paymentLink/_components/paymentLink-list";
import { getPaymentLinks } from "@/features/paymentLink/server/paymentLink";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type PaymentLinkProps = {
  page: string;
  pageSize: string;
  merchant: string;
  identifier: string;
  status: string;
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

  const paymentLinks = await getPaymentLinks(
    merchant,
    identifier,
    status,
    page,
    pageSize
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
        subtitle={`Visualização de todos os Links de Pagamento`}
      >
        <div className="mb-4">
          <PaymentLinkFilter
            identifier={identifier}
            status={status}
            merchant={merchant}
            permissions={permissions}
          />
        </div>
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

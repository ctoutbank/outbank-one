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
import { PaymentLinkFilter } from "@/features/paymentLink/_components/payment-link-filter";
import PaymentLinkList from "@/features/paymentLink/_components/paymentLink-list";
import { getPaymentLinks } from "@/features/paymentLink/server/paymentLink";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type PaymentLinkProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    merchant?: string;
    identifier?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function PaymentLinkPage({
  searchParams,
}: PaymentLinkProps) {
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Links de Pagamento"
        description="Crie e gerencie seus links de pagamento."
      >
        <Button asChild>
          <Link href="/portal/paymentLink/0">
            <Plus className="mr-2 h-4 w-4" />
            Novo Link
          </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Links</CardTitle>
          <CardDescription>
            Filtre e visualize todos os links de pagamento gerados.
          </CardDescription>
          <div className="pt-4">
            <PaymentLinkFilter
              identifier={identifier}
              status={status}
              merchant={merchant}
              permissions={permissions}
            />
          </div>
        </CardHeader>
        <CardContent>
          {paymentLinks.linksObject.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum link encontrado"
              description="Tente ajustar seus filtros ou crie um novo link."
            />
          ) : (
            <PaymentLinkList links={paymentLinks} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
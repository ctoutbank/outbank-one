import { PageHeader } from "@/components/layout/portal/PageHeader";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeeList from "@/features/newTax/_components/new-tax-list";
import { getFeesAction } from "@/features/newTax/server/fee-db";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function NewTaxPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");

  const {
    fees,
    totalRecords,
    currentPage,
    pageSize: returnedPageSize,
  } = (await getFeesAction(page, pageSize)) || {
    fees: [],
    totalRecords: 0,
    currentPage: 1,
    pageSize: 10,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Precificação"
        description="Gerencie as tabelas de taxas de cobrança do sistema."
      >
        <Button asChild>
          <Link href="/portal/pricing/0">
            <Plus className="mr-2 h-4 w-4" />
            Nova Tabela
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Tabelas de Taxas</CardTitle>
          <CardDescription>
            Visualize e edite as taxas de cobrança que serão aplicadas nas
            transações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeeList fees={fees} />
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter>
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={currentPage}
              pageSize={returnedPageSize}
              pageName="portal/pricing"
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionsDashboardTable } from "@/features/transactions/_components/transactions-dashboard-table";
import { TransactionsFilter } from "@/features/transactions/_components/transactions-filter";
import TransactionsList from "@/features/transactions/_components/transactions-list";
import { TransactionsExport } from "@/features/transactions/reports/transactions-export-excel";
import {
  getTransactions,
  getTransactionsGroupedReport,
} from "@/features/transactions/serverActions/transaction";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { getEndOfDay } from "@/lib/datetime-utils";
import { Search } from "lucide-react";
import { Suspense } from "react";

type TransactionsProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    status?: string;
    merchant?: string;
    dateFrom?: string;
    dateTo?: string;
    productType?: string;
    brand?: string;
    nsu?: string;
    method?: string;
    salesChannel?: string;
    terminal?: string;
    valueMin?: string;
    valueMax?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

async function TransactionsContent({ searchParams }: { searchParams: TransactionsProps["searchParams"] }) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const dateFrom = searchParams.dateFrom || "2024-09-01T00:00";
  const dateTo = searchParams.dateTo || getEndOfDay();
  const sortBy = searchParams.sortBy || "dtInsert";
  const sortOrder = searchParams.sortOrder as "asc" | "desc" | undefined;

  const filters = {
    status: searchParams.status,
    merchant: searchParams.merchant,
    dateFrom,
    dateTo,
    productType: searchParams.productType,
    brand: searchParams.brand,
    nsu: searchParams.nsu,
    method: searchParams.method,
    salesChannel: searchParams.salesChannel,
    terminal: searchParams.terminal,
    valueMin: searchParams.valueMin,
    valueMax: searchParams.valueMax,
  };

  const [transactionList, transactionsGroupedReport] = await Promise.all([
    getTransactions(
      page,
      pageSize,
      filters.status,
      filters.merchant,
      filters.dateFrom,
      filters.dateTo,
      filters.productType,
      filters.brand,
      filters.nsu,
      filters.method,
      filters.salesChannel,
      filters.terminal,
      filters.valueMin,
      filters.valueMax,
      { sortBy, sortOrder }
    ),
    getTransactionsGroupedReport(
      filters.dateFrom,
      filters.dateTo,
      filters.status,
      filters.productType,
      filters.brand,
      filters.method,
      filters.salesChannel,
      filters.terminal,
      filters.valueMin,
      filters.valueMax,
      filters.merchant
    ),
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              Filtre e visualize os detalhes das suas vendas.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TransactionsFilter
              statusIn={filters.status}
              merchantIn={filters.merchant}
              dateFromIn={filters.dateFrom}
              dateToIn={filters.dateTo}
              productTypeIn={filters.productType}
              brandIn={filters.brand}
              nsuIn={filters.nsu}
              methodIn={filters.method}
              salesChannelIn={filters.salesChannel}
              terminalIn={filters.terminal}
              valueMinIn={filters.valueMin}
              valueMaxIn={filters.valueMax}
            />
            <TransactionsExport
              filters={filters}
              sheetName="Transações"
              fileName="transacoes.xlsx"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <TransactionsDashboardTable transactions={transactionsGroupedReport} />
        {transactionList.transactions.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum resultado encontrado"
            description="Tente ajustar seus filtros para encontrar o que procura."
          />
        ) : (
          <TransactionsList transactions={transactionList.transactions} />
        )}
      </CardContent>
      {transactionList.totalCount > 0 && (
        <CardFooter className="flex items-center justify-between">
          <PageSizeSelector
            currentPageSize={pageSize}
            pageName="portal/transactions"
          />
          <PaginationRecords
            totalRecords={transactionList.totalCount}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/transactions"
          />
        </CardFooter>
      )}
    </Card>
  );
}

function TransactionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="rounded-md border">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-48" />
      </CardFooter>
    </Card>
  );
}

export default async function TransactionsPage({ searchParams }: TransactionsProps) {
  await checkPagePermission("Lançamentos Financeiros");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vendas"
        description="Visualize e gerencie todas as suas transações."
      />
      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
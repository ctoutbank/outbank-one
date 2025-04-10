import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { Skeleton } from "@/components/ui/skeleton";
import { SyncButton } from "@/features/sync/syncButton";
import { TransactionsDashboardTable } from "@/features/transactions/_components/transactions-dashboard-table";
import { TransactionsFilter } from "@/features/transactions/_components/transactions-filter";
import TransactionsList from "@/features/transactions/_components/transactions-list";
import {
  getTransactions,
  getTransactionsGroupedReport,
} from "@/features/transactions/serverActions/transaction";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { getEndOfDay, getStartOfDay } from "@/lib/datetime-utils";
import { Suspense } from "react";
import TransactionsExport from "../../../features/transactions/reports/transactions-export-excel";

type TransactionsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  merchant?: string;
  dateFrom?: string;
  dateTo?: string;
  productType?: string;
};

async function TransactionsContent({
  searchParams,
}: {
  searchParams: TransactionsProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");

  const dateFrom = searchParams.dateFrom || getStartOfDay();
  const dateTo = searchParams.dateTo || getEndOfDay();

  const transactionList = await getTransactions(
    page,
    pageSize,
    searchParams.status,
    searchParams.merchant,
    dateFrom,
    dateTo,
    searchParams.productType
  );

  const transactionsGroupedReport = await getTransactionsGroupedReport(
    dateFrom,
    dateTo,
    searchParams.status,
    searchParams.productType,
    undefined, // terminalLogicalNumber (não especificado nos searchParams)
    searchParams.merchant
  );

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <TransactionsFilter
              statusIn={searchParams.status}
              merchantIn={searchParams.merchant}
              dateFromIn={dateFrom}
              dateToIn={dateTo}
              productTypeIn={searchParams.productType}
            />
          </div>
          <TransactionsExport />

          {/* Componente para exportação em PDF 
          <TransactionsExportPdf />*/}
        </div>

        <div>
          {" "}
          <TransactionsDashboardTable
            transactions={transactionsGroupedReport}
          />
        </div>

        <TransactionsList transactions={transactionList.transactions} />

        {transactionList.totalCount > 0 && (
          <div className="flex items-center justify-between mt-4">
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
          </div>
        )}
      </div>
    </>
  );
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: TransactionsProps;
}) {
  await checkPagePermission("Lançamentos Financeiros");

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Vendas", url: "/portal/transactions" }]}
      />
      <BaseBody
        title="Vendas"
        subtitle={`Visualização de todas as vendas`}
        actions={<SyncButton syncType="transactions" />}
      >
        <Suspense
          fallback={
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[150px]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[120px]" />
                  <Skeleton className="h-10 w-[120px]" />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-[100px]" />
                    ))}
                  </div>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-[100px]" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[300px]" />
              </div>
            </div>
          }
        >
          <TransactionsContent searchParams={searchParams} />
        </Suspense>
      </BaseBody>
    </>
  );
}

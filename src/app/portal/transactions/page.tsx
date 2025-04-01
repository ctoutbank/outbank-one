import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import PageSizeSelector from "@/components/page-size-selector";
import { TransactionsDashboardButton } from "@/features/transactions/_components/transactions-dashboard-button";
import { TransactionsDashboardContent } from "@/features/transactions/_components/transactions-dashboard-content";
import { TransactionsFilter } from "@/features/transactions/_components/transactions-filter";
import TransactionsList from "@/features/transactions/_components/transactions-list";
import { getTransactions } from "@/features/transactions/serverActions/transaction";
import TransactionsExport from "../../../features/transactions/reports/transactions-export-excel";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import TransactionsExportPdf from "@/features/transactions/reports/transactions-export-pdf";

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

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: TransactionsProps;
}) {
  await checkPagePermission("Lançamentos Financeiros");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";

  // Buscar dados de transações com os filtros
  const transactionList = await getTransactions(
    search,
    page,
    pageSize,
    searchParams.status,
    searchParams.merchant,
    searchParams.dateFrom,
    searchParams.dateTo,
    searchParams.productType
  );

  const totalRecords = transactionList.totalCount;

  // Dados para o dashboard
  const dashboardData = {
    totalTransactions: transactionList.totalCount,
    approvedTransactions: transactionList.approved_count,
    pendingTransactions: transactionList.pending_count,
    rejectedTransactions: transactionList.rejected_count,
    totalAmount: transactionList.total_amount,
    revenue: transactionList.revenue,
  };

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Vendas", url: "/portal/transactions" }]}
      />
      <BaseBody title="Vendas" subtitle={`Visualização de todas as vendas`}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <TransactionsFilter
                statusIn={searchParams.status}
                merchantIn={searchParams.merchant}
                dateFromIn={searchParams.dateFrom}
                dateToIn={searchParams.dateTo}
                productTypeIn={searchParams.productType}
              />
              <TransactionsDashboardButton>
                <div className="-ml-28">
                  <TransactionsDashboardContent {...dashboardData} />
                </div>
              </TransactionsDashboardButton>
            </div>
            <TransactionsExport />
            <TransactionsExportPdf />
          </div>

          <TransactionsList
            transactions={transactionList.transactions}
            
          />

          {totalRecords > 0 && (
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/transactions"
              />
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/transactions"
              />
            </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}

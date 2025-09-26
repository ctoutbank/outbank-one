import CardValue from "@/components/dashboard/cardValue";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LazyClosingChart } from "@/components/lazy/LazyClosingChart";
import DashboardFilters from "@/features/closing/components/dashboard-filters";
import TransactionsExport from "@/features/closing/components/export-excel";
import { TransactionsDashboardTable } from "@/features/transactions/_components/transactions-dashboard-table";
import {
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
  getTransactionsGroupedReport,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { gateDateByViewMode, getPreviousPeriodFromRange } from "@/lib/utils";
import { Search } from "lucide-react";
import { Suspense } from "react";

type ClosingSearchParams = {
  viewMode?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  merchant?: string;
  productType?: string;
  brand?: string;
  method?: string;
  salesChannel?: string;
  terminal?: string;
  valueMin?: string;
  valueMax?: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function ClosingPage({
  searchParams,
}: {
  searchParams: ClosingSearchParams;
}) {
  const viewMode = searchParams.viewMode || "month";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  let previousRange = { from: "", to: "" };
  if (searchParams.dateFrom || searchParams.dateTo) {
    previousRange = getPreviousPeriodFromRange(
      searchParams.dateFrom ?? '',
      searchParams.dateTo ?? ''
    );
  }

  const dateRange = await normalizeDateRange(
    searchParams.dateFrom || period.from,
    searchParams.dateTo || period.to
  );
  const dateRangePrevious = await normalizeDateRange(
    searchParams.dateFrom ? previousRange.from : previousPeriod.from!,
    searchParams.dateTo ? previousRange.to : previousPeriod.to!
  );

  const [
    totalTransactions,
    totalTransactionsPreviousPeriod,
    totalTransactionsByMonth,
    totalMerchants,
    transactionsGroupedReport,
  ] = await Promise.all([
    getTotalTransactions(dateRange.start!, dateRange.end!),
    getTotalTransactions(dateRangePrevious.start!, dateRangePrevious.end!),
    getTotalTransactionsByMonth(dateRange.start!, dateRange.end!, viewMode),
    getTotalMerchants(),
    getTransactionsGroupedReport(
      dateRange.start!, dateRange.end!, searchParams.status,
      searchParams.productType, searchParams.brand, searchParams.method,
      searchParams.salesChannel, searchParams.terminal, searchParams.valueMin,
      searchParams.valueMax, searchParams.merchant
    ),
  ]);

  function canShowExport(dateToStr: string | undefined) {
    if (!dateToStr) return false;
    const dateTo = new Date(dateToStr);
    const today = new Date();
    if (dateTo < today) return true;
    const isTodayLastDay =
      today.getDate() ===
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const isSameMonthAndYear =
      dateTo.getFullYear() === today.getFullYear() &&
      dateTo.getMonth() === today.getMonth();
    return isTodayLastDay && isSameMonthAndYear;
  }

  const showExport = canShowExport(searchParams.dateTo);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Fechamento"
        description="Análise detalhada do fechamento do período."
      >
        <div className="flex items-center gap-2">
          <DashboardFilters
            dateRange={{
              from: dateRange.start ?? period.from,
              to: dateRange.end ?? period.to,
            }}
          />
          {showExport && <TransactionsExport />}
        </div>
      </PageHeader>

      <Suspense fallback={<div>Carregando...</div>}>
        {totalTransactions[0]?.count === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum resultado encontrado"
            description="Não há dados de fechamento para o período ou filtros selecionados."
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CardValue
                title="Bruto total"
                description="Total bruto das transações"
                value={totalTransactions[0]?.sum || 0}
                percentage={
                  totalTransactions[0]?.sum &&
                  totalTransactionsPreviousPeriod[0]?.sum
                    ? (
                        ((totalTransactions[0].sum -
                          totalTransactionsPreviousPeriod[0].sum) /
                          totalTransactionsPreviousPeriod[0].sum) *
                        100
                      ).toFixed(2)
                    : "0"
                }
                previousValue={totalTransactionsPreviousPeriod[0]?.sum}
                valueType="currency"
              />
              <CardValue
                title="Lucro total"
                description="Total de lucro realizado"
                value={totalTransactions[0]?.revenue || 0}
                percentage={
                  totalTransactions[0]?.revenue &&
                  totalTransactionsPreviousPeriod[0]?.revenue
                    ? (
                        ((totalTransactions[0].revenue -
                          totalTransactionsPreviousPeriod[0].revenue) /
                          totalTransactionsPreviousPeriod[0].revenue) *
                        100
                      ).toFixed(2)
                    : "0"
                }
                previousValue={totalTransactionsPreviousPeriod[0]?.revenue}
                valueType="currency"
              />
              <CardValue
                title="Transações realizadas"
                description="Total de transações realizadas"
                value={totalTransactions[0]?.count || 0}
                percentage={
                  totalTransactionsPreviousPeriod[0]?.count &&
                  totalTransactions[0]?.count
                    ? (
                        ((totalTransactions[0].count -
                          totalTransactionsPreviousPeriod[0].count) /
                          totalTransactionsPreviousPeriod[0].count) *
                        100
                      ).toFixed(2)
                    : "0"
                }
                previousValue={totalTransactionsPreviousPeriod[0]?.count}
                valueType="number"
              />
              <CardValue
                title="Estabelecimentos"
                description="Total de estabelecimentos cadastrados"
                value={Array.isArray(totalMerchants) ? totalMerchants[0]?.total || 0 : 0}
                percentage={"0"}
                previousValue={Array.isArray(totalMerchants) ? totalMerchants[0]?.total || 0 : 0}
                valueType="number"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <LazyClosingChart
                  chartData={totalTransactionsByMonth}
                  viewMode={viewMode}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsDashboardTable
                  transactions={transactionsGroupedReport}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </Suspense>
    </div>
  );
}
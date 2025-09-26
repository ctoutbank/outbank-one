import { PageHeader } from "@/components/layout/portal/PageHeader";
import {
  getCancelledTransactions,
  getRawTransactionsByDate,
  getTotalMerchants,
  getTotalTransactions,
  getTransactionsDashboardTotals,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { format } from "date-fns";
import { Suspense } from "react";
import { BarChartCustom } from "./_components/barChart";
import { TransactionSummaryCards } from "./_components/transaction-cards";
import { CardsSkeleton, ChartSkeleton } from "./loading";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function ChartSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [
    totalTransactions,
    totalTransactionsByDay,
    canceledTransactions,
    totalMerchants,
  ] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getRawTransactionsByDate(dateRange.start, dateRange.end),
    getCancelledTransactions(dateRange.start, dateRange.end),
    getTotalMerchants(),
  ]);
  return (
    <BarChartCustom
      transactionsData={totalTransactionsByDay}
      viewMode="custom"
      totalTransactions={{
        sum: totalTransactions[0]?.sum ?? 0,
        count: totalTransactions[0]?.count ?? 0,
      }}
      totalMerchants={
        Array.isArray(totalMerchants) ? totalMerchants[0]?.total || 0 : 0
      }
      dateRange={{ start: dateRange.start, end: dateRange.end }}
      canceledTransactions={canceledTransactions[0]?.count || 0}
    />
  );
}

async function CardsSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const transactions = await getTransactionsDashboardTotals(
    dateRange.start,
    dateRange.end
  );
  return <TransactionSummaryCards transactions={transactions} />;
}

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const defaultDateFrom =
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] +
    "T00:00:00";
  const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const dateFrom = resolvedSearchParams.dateFrom || defaultDateFrom;
  const dateTo = resolvedSearchParams.dateTo || defaultDateTo;
  const dateRange = await normalizeDateRange(dateFrom, dateTo);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas vendas e transações."
      />

      <Suspense fallback={<CardsSkeleton />}>
        <CardsSection dateRange={dateRange} />
      </Suspense>

      <div className="grid grid-cols-1 gap-8">
        <Suspense fallback={<ChartSkeleton />}>
          <ChartSection dateRange={dateRange} />
        </Suspense>
      </div>
    </div>
  );
}
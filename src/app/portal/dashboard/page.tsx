import { TransactionSummaryCards } from "@/app/portal/dashboard/_components/transaction-cards";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getCancelledTransactions,
  getRawTransactionsByDate,
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
  getTransactionsDashboardTotals,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { format } from "date-fns";
import { Suspense } from "react";
import { BarChartCustom } from "./_components/barChart";
import { CardsSkeleton, ChartSkeleton } from "./loading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function ChartSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [
    totalTransactions,
    totalTransactionsByDay,
    canceledTransactions,
    totalTransactionsByMonth,
    totalMerchants,
  ] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getRawTransactionsByDate(dateRange.start, dateRange.end),
    getCancelledTransactions(dateRange.start, dateRange.end),
    getTotalTransactionsByMonth(dateRange.start, dateRange.end, "custom"),
    getTotalMerchants(),
  ]);
  return (
    <div className="w-[99.5%]">
      <BarChartCustom
        chartData={totalTransactionsByMonth}
        transactionsData={totalTransactionsByDay}
        viewMode="custom"
        totalTransactions={totalTransactions[0]}
        totalMerchants={totalMerchants[0]?.total || 0}
        dateRange={{ start: dateRange.start, end: dateRange.end }}
        canceledTransactions={canceledTransactions[0]?.count || 0}
      />
    </div>
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
  searchParams: { dateFrom?: string; dateTo?: string };
}) {
  const defaultDateFrom = "2024-09-01T00:00:00";
  const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const dateFrom = searchParams.dateFrom || defaultDateFrom;
  const dateTo = searchParams.dateTo || defaultDateTo;
  const dateRange = await normalizeDateRange(dateFrom, dateTo);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Dashboard" subtitle="Visão Geral das Vendas">
        <Suspense fallback={<ChartSkeleton />}>
          <ChartSection dateRange={dateRange} />
        </Suspense>
        <div className="mt-8">
          <Suspense fallback={<CardsSkeleton />}>
            <div className="w-[99.5%]">
              <CardsSection dateRange={dateRange} />
            </div>
          </Suspense>
        </div>
      </BaseBody>
    </>
  );
}

import { Suspense } from "react";
import { format } from "date-fns";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getRawTransactionsByDate,
  getTotalTransactions,
  getTransactionsDashboardTotals,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";

import { BarChartCustom } from "./_components/barChart";
import DashboardFilters from "./_components/dashboard-filters";
import { TransactionSummaryCards } from "./_components/transaction-cards";
import { CardsSkeleton, ChartSkeleton } from "./loading";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function ChartSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [totalTransactions, totalTransactionsByDay] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getRawTransactionsByDate(dateRange.start, dateRange.end),
  ]);

  return (
    <div className="w-full">
      <BarChartCustom
        transactionsData={totalTransactionsByDay}
        totalTransactions={{
          sum: totalTransactions[0]?.sum ?? 0,
          count: totalTransactions[0]?.count ?? 0,
        }}
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
  const defaultDateFrom =
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0] + "T00:00:00";
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
        <div className="mb-4">
          <DashboardFilters />
        </div>
        <div className="space-y-8">
          <Suspense fallback={<CardsSkeleton />}>
            <CardsSection dateRange={dateRange} />
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <ChartSection dateRange={dateRange} />
          </Suspense>
        </div>
      </BaseBody>
    </>
  );
}
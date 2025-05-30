import CardValue from "@/components/dashboard/cardValue";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartCustom } from "@/features/closing/components/barChart";
import DashboardFilters from "@/features/closing/components/dashboard-filters";
import { getTransactionsGroupedReport } from "@/features/closing/server/closing";
import { TransactionsDashboardTable } from "@/features/transactions/_components/transactions-dashboard-table";
import {
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { gateDateByViewMode, getPreviousPeriodFromRange } from "@/lib/utils";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "month";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  let previousRange: { from: string; to: string } = { from: "", to: "" };
  if (searchParams.dateFrom || searchParams.dateTo) {
    previousRange = getPreviousPeriodFromRange(
      searchParams.dateFrom,
      searchParams.dateTo
    );
  }

  const dateRange = await normalizeDateRange(
    searchParams.dateFrom ? searchParams.dateFrom : period.from,
    searchParams.dateTo ? searchParams.dateTo : period.to
  );
  const dateRangePrevious = await normalizeDateRange(
    searchParams.dateFrom ? previousRange.from : previousPeriod.from!,
    searchParams.dateTo ? previousRange.to : previousPeriod.to!
  );
  const totalTransactions = await getTotalTransactions(
    dateRange.start!,
    dateRange.end!
  );

  const totalTransactionsPreviousPeriod = await getTotalTransactions(
    dateRangePrevious.start!,
    dateRangePrevious.end!
  );

  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    dateRange.start!,
    dateRange.end!,
    viewMode
  );

  const totalMerchants = await getTotalMerchants();
  const transactionsGroupedReport = await getTransactionsGroupedReport(
    dateRange.start!,
    dateRange.end!
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Fechamento", url: "/portal/closing" }]}
      />
      <BaseBody title="Fechamento" subtitle={``}>
        <div className="mb-4 ml-1">
          <DashboardFilters
            dateRange={{
              from: period.from,
              to: period.to,
            }}
          />
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <Card className="w-full border-l-8 border-black bg-sidebar">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardHeader>
            </div>

            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <CardValue
                    title="Bruto total"
                    description="Total bruto das transações"
                    value={totalTransactions[0]?.sum || 0}
                    percentage={
                      totalTransactions[0]?.sum &&
                      totalTransactionsPreviousPeriod[0]?.sum
                        ? (
                            ((totalTransactions[0]?.sum -
                              totalTransactionsPreviousPeriod[0]?.sum) /
                              totalTransactionsPreviousPeriod[0]?.sum) *
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
                            ((totalTransactions[0]?.revenue -
                              totalTransactionsPreviousPeriod[0]?.revenue) /
                              totalTransactionsPreviousPeriod[0]?.revenue) *
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
                            ((totalTransactions[0]?.count -
                              totalTransactionsPreviousPeriod[0]?.count) /
                              totalTransactionsPreviousPeriod[0]?.count) *
                            100
                          ).toFixed(2)
                        : "0"
                    }
                    previousValue={totalTransactionsPreviousPeriod[0]?.count}
                    valueType="number"
                  />
                  <CardValue
                    title="Estabelecimentos cadastrados"
                    description="Total de estabelecimentos cadastrados"
                    value={totalMerchants[0].total || 0}
                    percentage={
                      totalMerchants[0].total
                        ? (
                            ((totalMerchants[0].total -
                              totalMerchants[0].total) /
                              totalMerchants[0].total) *
                            100
                          ).toFixed(2)
                        : "0"
                    }
                    previousValue={totalMerchants[0].total || 0}
                    valueType="number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            <BarChartCustom
              chartData={totalTransactionsByMonth}
              viewMode={viewMode}
            />
          </div>
          <div>
            {" "}
            <TransactionsDashboardTable
              transactions={transactionsGroupedReport}
            />
          </div>
        </Suspense>
      </BaseBody>
    </>
  );
}

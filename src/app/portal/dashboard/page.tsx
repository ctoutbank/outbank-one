import CardValue from "@/components/dashboard/cardValue";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsDashboardCards } from "@/features/transactions/_components/transactions-dashboard-cards";
import {
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
  getTransactionsGroupedReport,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { gateDateByViewMode } from "@/lib/utils";
import { Suspense } from "react";
import { BarChartCustom } from "./_components/barChart";
import DashboardFilters from "./_components/dashboard-filters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "today";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  const totalTransactions = await getTotalTransactions(
    period.from!,
    period.to!
  );
  const totalTransactionsPreviousPeriod = await getTotalTransactions(
    previousPeriod.from!,
    previousPeriod.to!
  );
  const dateRange = await normalizeDateRange(period.from, period.to);
  period.from = dateRange.start;
  period.to = dateRange.end;
  const transactions = await getTransactionsGroupedReport(
    period.from,
    period.to
  );
  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    period.from!,
    period.to!,
    viewMode
  );

  const totalMerchants = await getTotalMerchants();
  const previousTotalMerchants = await getTotalMerchants();

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Dashboard" subtitle="Visão geral das vendas">
        <div className="mb-6">
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
                      previousTotalMerchants[0].total && totalMerchants[0].total
                        ? (
                            ((totalMerchants[0].total -
                              previousTotalMerchants[0].total) /
                              previousTotalMerchants[0].total) *
                            100
                          ).toFixed(2)
                        : "0"
                    }
                    previousValue={previousTotalMerchants[0].total || 0}
                    valueType="number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <BarChartCustom
              chartData={totalTransactionsByMonth}
              viewMode={viewMode}
            />
          </div>

          <div className="mt-8">
            <TransactionsDashboardCards transactions={transactions} />
          </div>
        </Suspense>
      </BaseBody>
    </>
  );
}

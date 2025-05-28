import CardValue from "@/components/dashboard/cardValue";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { BarChartCustom } from "@/features/closing/components/barChart";
import DashboardFilters from "@/features/closing/components/dashboard-filters";
import { TransactionsDashboardTable } from "@/features/closing/components/transactions-dashboard-table";
import { getTransactionsGroupedReport } from "@/features/closing/server/closing";
import {
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
} from "@/features/transactions/serverActions/transaction";
import { gateDateByViewMode } from "@/lib/utils";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "today";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  console.log(previousPeriod, period);
  const totalTransactions = await getTotalTransactions(
    period.from!,
    period.to!
  );

  const totalTransactionsPreviousPeriod = await getTotalTransactions(
    previousPeriod.from!,
    previousPeriod.to!
  );

  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    period.from!,
    period.to!,
    viewMode
  );

  const totalMerchants = await getTotalMerchants();
  const previousTotalMerchants = await getTotalMerchants();
  const transactionsGroupedReport = await getTransactionsGroupedReport(
    period.from!,
    period.to!
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <CardValue
              title={`Bruto total `}
              description={`Total bruto das transações`}
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
              title={`Lucro total `}
              description={`Total de lucro realizado`}
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
              title={`Transações realizadas `}
              description={`Total de transações realizadas`}
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
              title={`Estabelecimentos Cadastrados`}
              description={`Total de estabelecimentos cadastrados`}
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
